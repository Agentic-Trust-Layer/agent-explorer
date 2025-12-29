/**
 * OASF (Open Agentic Schema Framework) synchronization from GitHub
 * Fetches domains and skills from https://github.com/agntcy/oasf
 */

import { fetchWithRetry } from './net/fetch-with-retry';
type AnyDb = any;

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';
const OASF_REPO = 'agntcy/oasf';
const DOMAINS_PATH = 'schema/domains';
const SKILLS_PATH = 'schema/skills';
const DOMAIN_CATEGORIES_PATH = 'schema/domain_categories.json';
const SKILL_CATEGORIES_PATH = 'schema/skill_categories.json';
const DICTIONARY_PATH = 'schema/dictionary.json';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGitHubApi(endpoint: string, retries = 3): Promise<any> {
  const url = `${GITHUB_API_BASE}/repos/${OASF_REPO}/${endpoint}`;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'agentic-trust-indexer',
  };
  
  // Optional: Add GitHub token from env for rate limiting
  const githubToken = process.env.GITHUB_TOKEN;
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  const timeoutMs = Number(process.env.GITHUB_HTTP_TIMEOUT_MS ?? 20_000);
  const response = await fetchWithRetry(url, { headers }, {
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 20_000,
    retries,
    retryOnStatuses: [429, 500, 502, 503, 504],
    minBackoffMs: 750,
    maxBackoffMs: 60_000,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    const lower = text.toLowerCase();
    const isRateLimit =
      response.status === 403 &&
      ((remaining && remaining.trim() === '0') || lower.includes('rate limit exceeded'));
    if (isRateLimit) {
      const resetEpoch = reset ? Number.parseInt(reset, 10) : NaN;
      const err: any = new Error(
        `GitHub API rate limit exceeded (set GITHUB_TOKEN to increase limit).` +
          (Number.isFinite(resetEpoch) ? ` Reset at epoch ${resetEpoch}.` : ''),
      );
      err.name = 'GitHubRateLimitError';
      err.resetEpoch = resetEpoch;
      err.status = response.status;
      throw err;
    }

    throw new Error(`GitHub API error ${response.status}: ${text || response.statusText}`);
  }

  return response.json();
}

function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function stripSuffix(value: string, suffix: string): string {
  return value.endsWith(suffix) ? value.slice(0, value.length - suffix.length) : value;
}

function oasfPathIdFromGithubPath(githubPath: string, kind: 'domains' | 'skills'): string {
  const prefix = kind === 'domains' ? 'schema/domains/' : 'schema/skills/';
  return stripSuffix(stripPrefix(githubPath, prefix), '.json');
}

function oasfCategoryKeyFromGithubPath(githubPath: string, kind: 'domains' | 'skills'): string | null {
  const prefix = kind === 'domains' ? 'schema/domains/' : 'schema/skills/';
  const rel = stripPrefix(githubPath, prefix);
  // Expect: "<categoryKey>/<file>.json" (domains) or "<categoryKey>/<...>/<file>.json" (skills)
  const parts = rel.split('/').filter(Boolean);
  const categoryKey = parts.length >= 2 ? parts[0] : null;
  return categoryKey && categoryKey.trim() ? categoryKey.trim() : null;
}

async function fetchOasfRawJson<T = any>(path: string): Promise<T> {
  const url = `${GITHUB_RAW_BASE}/${OASF_REPO}/main/${path}`;
  const timeoutMs = Number(process.env.GITHUB_RAW_TIMEOUT_MS ?? 30_000);
  const res = await fetchWithRetry(url, undefined as any, {
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 30_000,
    retries: 4,
    retryOnStatuses: [429, 500, 502, 503, 504],
    minBackoffMs: 750,
    maxBackoffMs: 30_000,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub RAW error ${res.status}: ${text || res.statusText}`);
  }
  const text = await res.text();
  return JSON.parse(text) as T;
}

async function fetchGitHubTree(path: string): Promise<GitHubTreeResponse> {
  // Get the main branch SHA first
  const ref = await fetchGitHubApi(`git/refs/heads/main`);
  const mainSha = ref.object.sha;
  
  // Get the tree for main branch recursively
  const treeData = await fetchGitHubApi(`git/trees/${mainSha}?recursive=1`);
  
  // Filter tree items by path prefix and JSON files
  const filtered = treeData.tree.filter((item: GitHubTreeItem) => 
    item.path.startsWith(path) && item.type === 'blob' && item.path.endsWith('.json')
  );
  
  return {
    sha: treeData.sha,
    url: treeData.url,
    tree: filtered,
    truncated: treeData.truncated || false,
  };
}

async function getCheckpointValue(db: AnyDb, key: string): Promise<string | null> {
  try {
    const row = await db.prepare('SELECT value FROM checkpoints WHERE key = ?').get(key);
    return row?.value ? String((row as any).value) : null;
  } catch {
    return null;
  }
}

async function setCheckpointValue(db: AnyDb, key: string, value: string): Promise<void> {
  try {
    await db.prepare('INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key, value);
  } catch (error) {
    console.warn(`Failed to set checkpoint ${key}:`, error);
  }
}

export async function syncOASFDomains(db: AnyDb): Promise<{ synced: number; updated: number; errors: number }> {
  const now = Math.floor(Date.now() / 1000);
  let synced = 0;
  let updated = 0;
  let errors = 0;
  let completed = true;
  
  try {
    console.log('[oasf-sync] Fetching OASF domains from GitHub...');
    const tree = await fetchGitHubTree(DOMAINS_PATH);
    const lastSha = await getCheckpointValue(db, 'oasf_domains_tree_sha');
    
    // Check if tree has changed
    if (lastSha === tree.sha) {
      console.log('[oasf-sync] Domains tree unchanged, skipping sync');
      return { synced: 0, updated: 0, errors: 0 };
    }
    
    console.log(`[oasf-sync] Found ${tree.tree.length} domain files`);
    
    // Add delay between file fetches to avoid rate limiting
    for (let i = 0; i < tree.tree.length; i++) {
      const item = tree.tree[i];
      try {
        // Add delay between requests (except first one)
        if (i > 0) {
          await sleep(500); // 500ms delay between file fetches
        }
        // Fetch via raw.githubusercontent.com to avoid GitHub REST API rate limits.
        const domainData = await fetchOasfRawJson<any>(item.path);
        
        // Use hierarchical path id under schema/domains/
        const domainId = oasfPathIdFromGithubPath(item.path, 'domains');
        if (!domainId) continue;
        
        const id = `oasf-domain-${domainId}`;
        const nameKey = domainData.name || null;
        const uid = Number.isFinite(Number(domainData.uid)) ? Number(domainData.uid) : null;
        const caption = typeof domainData.caption === 'string' ? domainData.caption : (typeof domainData.title === 'string' ? domainData.title : domainId);
        const description = typeof domainData.description === 'string' ? domainData.description : null;
        // Category for a domain is determined by githubPath folder:
        // e.g. schema/domains/energy/energy_management.json => category "energy"
        // Fall back to JSON "extends" if path parsing fails.
        const extendsKey =
          oasfCategoryKeyFromGithubPath(item.path, 'domains') ??
          (typeof domainData.extends === 'string' ? domainData.extends : null);
        const schemaJson = JSON.stringify(domainData);
        
        // Prefer lookup by githubPath to migrate old ids to path-based ids without duplicates.
        const existing = await db
          .prepare('SELECT id, domainId, githubSha FROM oasf_domains WHERE githubPath = ? OR domainId = ? LIMIT 1')
          .get(item.path, domainId);
        
        if (existing && (existing as any).githubSha === item.sha) {
          // No change, skip
          continue;
        }
        
        if (existing) {
          // Update existing (and move domainId to path-based id if needed)
          try {
            // Prefer writing both extendsKey and legacy category (if present) for compatibility.
            await db.prepare(`
              UPDATE oasf_domains SET
                nameKey = ?,
                uid = ?,
                caption = ?,
                description = ?,
                extendsKey = ?,
                category = ?,
                schemaJson = ?,
                githubPath = ?,
                githubSha = ?,
                lastFetchedAt = ?,
                updatedAt = ?
              WHERE id = ?
            `).run(
              nameKey,
              uid,
              caption,
              description,
              extendsKey,
              extendsKey,
              schemaJson,
              item.path,
              item.sha,
              now,
              now,
              (existing as any).id
            );
          } catch (e: any) {
            // Fallback if legacy column doesn't exist yet.
            await db.prepare(`
              UPDATE oasf_domains SET
                nameKey = ?,
                uid = ?,
                caption = ?,
                description = ?,
                extendsKey = ?,
                schemaJson = ?,
                githubPath = ?,
                githubSha = ?,
                lastFetchedAt = ?,
                updatedAt = ?
              WHERE id = ?
            `).run(
              nameKey,
              uid,
              caption,
              description,
              extendsKey,
              schemaJson,
              item.path,
              item.sha,
              now,
              now,
              (existing as any).id
            );
          }
          // If the stored domainId is not the path-based domainId, try to update it (best-effort).
          try {
            const prevDomainId = (existing as any)?.domainId != null ? String((existing as any).domainId) : '';
            if (prevDomainId && prevDomainId !== domainId) {
              await db.prepare(`UPDATE oasf_domains SET domainId = ? WHERE id = ?`).run(domainId, (existing as any).id);
            }
          } catch {}
          updated++;
        } else {
          // Insert new
          try {
            await db.prepare(`
              INSERT INTO oasf_domains (
                id, domainId, nameKey, uid, caption, description, extendsKey, category, schemaJson,
                githubPath, githubSha, lastFetchedAt, createdAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              id,
              domainId,
              nameKey,
              uid,
              caption,
              description,
              extendsKey,
              extendsKey,
              schemaJson,
              item.path,
              item.sha,
              now,
              now,
              now
            );
          } catch (e: any) {
            // Fallback if legacy column doesn't exist yet.
            await db.prepare(`
              INSERT INTO oasf_domains (
                id, domainId, nameKey, uid, caption, description, extendsKey, schemaJson,
                githubPath, githubSha, lastFetchedAt, createdAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              id,
              domainId,
              nameKey,
              uid,
              caption,
              description,
              extendsKey,
              schemaJson,
              item.path,
              item.sha,
              now,
              now,
              now
            );
          }
          synced++;
        }
      } catch (error) {
        if ((error as any)?.name === 'GitHubRateLimitError') {
          completed = false;
          const resetEpoch = Number((error as any)?.resetEpoch ?? NaN);
          console.warn(
            `[oasf-sync] GitHub rate limit hit while syncing domains; stopping early (set GITHUB_TOKEN).` +
              (Number.isFinite(resetEpoch) ? ` Reset at epoch ${resetEpoch}.` : ''),
          );
          break;
        }
        console.error(`[oasf-sync] Error processing domain file ${item.path}:`, error);
        errors++;
      }
    }
    
    // Only advance checkpoints if we completed the pass (avoid skipping remaining files after rate-limit).
    if (completed) {
      await setCheckpointValue(db, 'oasf_domains_tree_sha', tree.sha);
      await setCheckpointValue(db, 'oasf_domains_last_sync', String(now));
    } else {
      console.warn('[oasf-sync] Domains sync incomplete; checkpoints not advanced');
    }
    
    console.log(`[oasf-sync] Domains sync complete: ${synced} new, ${updated} updated, ${errors} errors`);
  } catch (error) {
    console.error('[oasf-sync] Error syncing domains:', error);
    throw error;
  }
  
  return { synced, updated, errors };
}

export async function syncOASFSkills(db: AnyDb): Promise<{ synced: number; updated: number; errors: number }> {
  const now = Math.floor(Date.now() / 1000);
  let synced = 0;
  let updated = 0;
  let errors = 0;
  let completed = true;
  
  try {
    console.log('[oasf-sync] Fetching OASF skills from GitHub...');
    const tree = await fetchGitHubTree(SKILLS_PATH);
    const lastSha = await getCheckpointValue(db, 'oasf_skills_tree_sha');
    
    // Check if tree has changed
    if (lastSha === tree.sha) {
      console.log('[oasf-sync] Skills tree unchanged, skipping sync');
      return { synced: 0, updated: 0, errors: 0 };
    }
    
    console.log(`[oasf-sync] Found ${tree.tree.length} skill files`);
    
    // Add delay between file fetches to avoid rate limiting
    for (let i = 0; i < tree.tree.length; i++) {
      const item = tree.tree[i];
      try {
        // Add delay between requests (except first one)
        if (i > 0) {
          await sleep(500); // 500ms delay between file fetches
        }
        // Fetch via raw.githubusercontent.com to avoid GitHub REST API rate limits.
        const skillData = await fetchOasfRawJson<any>(item.path);
        
        // Use hierarchical path id under schema/skills/
        const skillId = oasfPathIdFromGithubPath(item.path, 'skills');
        if (!skillId) continue;
        
        const id = `oasf-skill-${skillId}`;
        const nameKey = skillData.name || null;
        const uid = Number.isFinite(Number(skillData.uid)) ? Number(skillData.uid) : null;
        const caption = typeof skillData.caption === 'string' ? skillData.caption : (typeof skillData.title === 'string' ? skillData.title : skillId);
        const description = typeof skillData.description === 'string' ? skillData.description : null;
        // Category for a skill is determined by githubPath folder:
        // e.g. schema/skills/agent_orchestration/agent_orchestration.json => category "agent_orchestration"
        // Fall back to JSON "extends" if path parsing fails.
        const extendsKey =
          oasfCategoryKeyFromGithubPath(item.path, 'skills') ??
          (typeof skillData.extends === 'string' ? skillData.extends : null);
        const schemaJson = JSON.stringify(skillData);
        
        // Prefer lookup by githubPath to migrate old ids to path-based ids without duplicates.
        const existing = await db
          .prepare('SELECT id, skillId, githubSha FROM oasf_skills WHERE githubPath = ? OR skillId = ? LIMIT 1')
          .get(item.path, skillId);
        
        if (existing && (existing as any).githubSha === item.sha) {
          // No change, skip
          continue;
        }
        
        if (existing) {
          // Update existing
          try {
            await db.prepare(`
              UPDATE oasf_skills SET
                nameKey = ?,
                uid = ?,
                caption = ?,
                description = ?,
                extendsKey = ?,
                category = ?,
                schemaJson = ?,
                githubPath = ?,
                githubSha = ?,
                lastFetchedAt = ?,
                updatedAt = ?
              WHERE id = ?
            `).run(
              nameKey,
              uid,
              caption,
              description,
              extendsKey,
              extendsKey,
              schemaJson,
              item.path,
              item.sha,
              now,
              now,
              (existing as any).id
            );
          } catch {
            await db.prepare(`
              UPDATE oasf_skills SET
                nameKey = ?,
                uid = ?,
                caption = ?,
                description = ?,
                extendsKey = ?,
                schemaJson = ?,
                githubPath = ?,
                githubSha = ?,
                lastFetchedAt = ?,
                updatedAt = ?
              WHERE id = ?
            `).run(
              nameKey,
              uid,
              caption,
              description,
              extendsKey,
              schemaJson,
              item.path,
              item.sha,
              now,
              now,
              (existing as any).id
            );
          }
          // If the stored skillId is not the path-based skillId, try to update it (best-effort).
          try {
            const prevSkillId = (existing as any)?.skillId != null ? String((existing as any).skillId) : '';
            if (prevSkillId && prevSkillId !== skillId) {
              await db.prepare(`UPDATE oasf_skills SET skillId = ? WHERE id = ?`).run(skillId, (existing as any).id);
            }
          } catch {}
          updated++;
        } else {
          // Insert new
          try {
            await db.prepare(`
              INSERT INTO oasf_skills (
                id, skillId, nameKey, uid, caption, description, extendsKey, category, schemaJson,
                githubPath, githubSha, lastFetchedAt, createdAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              id,
              skillId,
              nameKey,
              uid,
              caption,
              description,
              extendsKey,
              extendsKey,
              schemaJson,
              item.path,
              item.sha,
              now,
              now,
              now
            );
          } catch {
            await db.prepare(`
              INSERT INTO oasf_skills (
                id, skillId, nameKey, uid, caption, description, extendsKey, schemaJson,
                githubPath, githubSha, lastFetchedAt, createdAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              id,
              skillId,
              nameKey,
              uid,
              caption,
              description,
              extendsKey,
              schemaJson,
              item.path,
              item.sha,
              now,
              now,
              now
            );
          }
          synced++;
        }
      } catch (error) {
        if ((error as any)?.name === 'GitHubRateLimitError') {
          completed = false;
          const resetEpoch = Number((error as any)?.resetEpoch ?? NaN);
          console.warn(
            `[oasf-sync] GitHub rate limit hit while syncing skills; stopping early (set GITHUB_TOKEN).` +
              (Number.isFinite(resetEpoch) ? ` Reset at epoch ${resetEpoch}.` : ''),
          );
          break;
        }
        console.error(`[oasf-sync] Error processing skill file ${item.path}:`, error);
        errors++;
      }
    }
    
    if (completed) {
      await setCheckpointValue(db, 'oasf_skills_tree_sha', tree.sha);
      await setCheckpointValue(db, 'oasf_skills_last_sync', String(now));
    } else {
      console.warn('[oasf-sync] Skills sync incomplete; checkpoints not advanced');
    }
    
    console.log(`[oasf-sync] Skills sync complete: ${synced} new, ${updated} updated, ${errors} errors`);
  } catch (error) {
    console.error('[oasf-sync] Error syncing skills:', error);
    throw error;
  }
  
  return { synced, updated, errors };
}

export async function syncOASF(db: AnyDb): Promise<void> {
  console.log('[oasf-sync] Starting OASF synchronization...');
  
  try {
    // Sync categories + dictionary via raw fetch (small, stable files)
    const now = Math.floor(Date.now() / 1000);
    try {
      const domainCategories = await fetchOasfRawJson<any>(DOMAIN_CATEGORIES_PATH);
      const attrs = domainCategories?.attributes && typeof domainCategories.attributes === 'object' ? domainCategories.attributes : {};
      for (const [key, value] of Object.entries(attrs)) {
        const v: any = value as any;
        const uid = Number.isFinite(Number(v?.uid)) ? Number(v.uid) : null;
        const caption = typeof v?.caption === 'string' ? v.caption : key;
        const description = typeof v?.description === 'string' ? v.description : null;
        const schemaJson = JSON.stringify(v);
        await db.prepare(`
          INSERT INTO oasf_domain_categories (key, uid, caption, description, schemaJson, githubPath, githubSha, lastFetchedAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET
            uid=excluded.uid,
            caption=excluded.caption,
            description=excluded.description,
            schemaJson=excluded.schemaJson,
            githubPath=excluded.githubPath,
            githubSha=excluded.githubSha,
            lastFetchedAt=excluded.lastFetchedAt,
            updatedAt=excluded.updatedAt
        `).run(key, uid, caption, description, schemaJson, DOMAIN_CATEGORIES_PATH, null, now, now, now);
      }
    } catch (e) {
      console.warn('[oasf-sync] Failed to sync domain_categories.json (continuing):', e);
    }

    try {
      const skillCategories = await fetchOasfRawJson<any>(SKILL_CATEGORIES_PATH);
      const attrs = skillCategories?.attributes && typeof skillCategories.attributes === 'object' ? skillCategories.attributes : {};
      for (const [key, value] of Object.entries(attrs)) {
        const v: any = value as any;
        const uid = Number.isFinite(Number(v?.uid)) ? Number(v.uid) : null;
        const caption = typeof v?.caption === 'string' ? v.caption : key;
        const description = typeof v?.description === 'string' ? v.description : null;
        const schemaJson = JSON.stringify(v);
        await db.prepare(`
          INSERT INTO oasf_skill_categories (key, uid, caption, description, schemaJson, githubPath, githubSha, lastFetchedAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET
            uid=excluded.uid,
            caption=excluded.caption,
            description=excluded.description,
            schemaJson=excluded.schemaJson,
            githubPath=excluded.githubPath,
            githubSha=excluded.githubSha,
            lastFetchedAt=excluded.lastFetchedAt,
            updatedAt=excluded.updatedAt
        `).run(key, uid, caption, description, schemaJson, SKILL_CATEGORIES_PATH, null, now, now, now);
      }
    } catch (e) {
      console.warn('[oasf-sync] Failed to sync skill_categories.json (continuing):', e);
    }

    try {
      const dict = await fetchOasfRawJson<any>(DICTIONARY_PATH);
      const attrs = dict?.attributes && typeof dict.attributes === 'object' ? dict.attributes : {};
      for (const [key, value] of Object.entries(attrs)) {
        const v: any = value as any;
        const type = typeof v?.type === 'string' ? v.type : null;
        const caption = typeof v?.caption === 'string' ? v.caption : key;
        const description = typeof v?.description === 'string' ? v.description : null;
        const referencesJson = v?.references != null ? JSON.stringify(v.references) : null;
        const schemaJson = JSON.stringify(v);
        await db.prepare(`
          INSERT INTO oasf_dictionary_entries (key, type, caption, description, referencesJson, schemaJson, githubPath, githubSha, lastFetchedAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET
            type=excluded.type,
            caption=excluded.caption,
            description=excluded.description,
            referencesJson=excluded.referencesJson,
            schemaJson=excluded.schemaJson,
            githubPath=excluded.githubPath,
            githubSha=excluded.githubSha,
            lastFetchedAt=excluded.lastFetchedAt,
            updatedAt=excluded.updatedAt
        `).run(key, type, caption, description, referencesJson, schemaJson, DICTIONARY_PATH, null, now, now, now);
      }

      const types = dict?.types && typeof dict.types === 'object' ? dict.types : {};
      for (const [key, value] of Object.entries(types)) {
        await db.prepare(`
          INSERT INTO oasf_dictionary_types (key, schemaJson, githubPath, githubSha, lastFetchedAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET
            schemaJson=excluded.schemaJson,
            githubPath=excluded.githubPath,
            githubSha=excluded.githubSha,
            lastFetchedAt=excluded.lastFetchedAt,
            updatedAt=excluded.updatedAt
        `).run(key, JSON.stringify(value), DICTIONARY_PATH, null, now, now, now);
      }
    } catch (e) {
      console.warn('[oasf-sync] Failed to sync dictionary.json (continuing):', e);
    }

    await syncOASFDomains(db);
    // Add delay between domains and skills sync
    await sleep(1000);
    await syncOASFSkills(db);
    console.log('[oasf-sync] OASF synchronization complete');
  } catch (error) {
    console.error('[oasf-sync] OASF synchronization failed:', error);
    // Don't throw - allow indexer to continue even if OASF sync fails
    // The sync will retry on next run
    console.warn('[oasf-sync] Continuing indexer despite OASF sync failure');
  }
}

