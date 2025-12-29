/**
 * OASF (Open Agentic Schema Framework) synchronization from GitHub
 * Fetches domains and skills from https://github.com/agntcy/oasf
 */

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
const OASF_REPO = 'agntcy/oasf';
const DOMAINS_PATH = 'schema/domains';
const SKILLS_PATH = 'schema/skills';

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
  
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, { headers });
    
    if (response.status === 429) {
      // Rate limited - check Retry-After header or wait exponential backoff
      const retryAfter = response.headers.get('Retry-After');
      const waitSeconds = retryAfter ? parseInt(retryAfter, 10) : Math.pow(2, attempt) * 60;
      console.warn(`[oasf-sync] Rate limited, waiting ${waitSeconds} seconds before retry ${attempt + 1}/${retries}`);
      await sleep(waitSeconds * 1000);
      continue;
    }
    
    if (!response.ok) {
      const text = await response.text();
      if (attempt < retries - 1 && response.status >= 500) {
        // Server error, retry with backoff
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      throw new Error(`GitHub API error ${response.status}: ${text}`);
    }
    
    return response.json();
  }
  
  throw new Error(`GitHub API request failed after ${retries} retries`);
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

async function fetchGitHubFile(path: string): Promise<GitHubFileContent> {
  return fetchGitHubApi(`contents/${path}`);
}

async function decodeBase64Content(encoded: string): Promise<string> {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }
  // For browsers/Workers, use atob
  return atob(encoded);
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
        const fileContent = await fetchGitHubFile(item.path);
        const contentText = await decodeBase64Content(fileContent.content);
        const domainData = JSON.parse(contentText);
        
        // Extract domain ID from filename (e.g., "finance.json" -> "finance")
        const domainId = item.path.split('/').pop()?.replace('.json', '') || '';
        if (!domainId) continue;
        
        const id = `oasf-domain-${domainId}`;
        const name = domainData.name || domainData.title || domainId;
        const description = domainData.description || null;
        const category = domainData.category || null;
        const schemaJson = JSON.stringify(domainData);
        
        // Check if domain exists
        const existing = await db.prepare('SELECT id, githubSha FROM oasf_domains WHERE domainId = ?').get(domainId);
        
        if (existing && (existing as any).githubSha === fileContent.sha) {
          // No change, skip
          continue;
        }
        
        if (existing) {
          // Update existing
          await db.prepare(`
            UPDATE oasf_domains SET
              name = ?,
              description = ?,
              category = ?,
              schemaJson = ?,
              githubPath = ?,
              githubSha = ?,
              lastFetchedAt = ?,
              updatedAt = ?
            WHERE domainId = ?
          `).run(
            name,
            description,
            category,
            schemaJson,
            item.path,
            fileContent.sha,
            now,
            now,
            domainId
          );
          updated++;
        } else {
          // Insert new
          await db.prepare(`
            INSERT INTO oasf_domains (
              id, domainId, name, description, category, schemaJson,
              githubPath, githubSha, lastFetchedAt, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            id,
            domainId,
            name,
            description,
            category,
            schemaJson,
            item.path,
            fileContent.sha,
            now,
            now,
            now
          );
          synced++;
        }
      } catch (error) {
        console.error(`[oasf-sync] Error processing domain file ${item.path}:`, error);
        errors++;
      }
    }
    
    // Update checkpoint with tree SHA
    await setCheckpointValue(db, 'oasf_domains_tree_sha', tree.sha);
    await setCheckpointValue(db, 'oasf_domains_last_sync', String(now));
    
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
        const fileContent = await fetchGitHubFile(item.path);
        const contentText = await decodeBase64Content(fileContent.content);
        const skillData = JSON.parse(contentText);
        
        // Extract skill ID from filename (e.g., "validation_attestation.json" -> "validation_attestation")
        const skillId = item.path.split('/').pop()?.replace('.json', '') || '';
        if (!skillId) continue;
        
        const id = `oasf-skill-${skillId}`;
        const name = skillData.name || skillData.title || skillId;
        const description = skillData.description || null;
        const domainId = skillData.domain || skillData.domainId || null;
        const category = skillData.category || null;
        const schemaJson = JSON.stringify(skillData);
        
        // Check if skill exists
        const existing = await db.prepare('SELECT id, githubSha FROM oasf_skills WHERE skillId = ?').get(skillId);
        
        if (existing && (existing as any).githubSha === fileContent.sha) {
          // No change, skip
          continue;
        }
        
        if (existing) {
          // Update existing
          await db.prepare(`
            UPDATE oasf_skills SET
              name = ?,
              description = ?,
              domainId = ?,
              category = ?,
              schemaJson = ?,
              githubPath = ?,
              githubSha = ?,
              lastFetchedAt = ?,
              updatedAt = ?
            WHERE skillId = ?
          `).run(
            name,
            description,
            domainId,
            category,
            schemaJson,
            item.path,
            fileContent.sha,
            now,
            now,
            skillId
          );
          updated++;
        } else {
          // Insert new
          await db.prepare(`
            INSERT INTO oasf_skills (
              id, skillId, name, description, domainId, category, schemaJson,
              githubPath, githubSha, lastFetchedAt, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            id,
            skillId,
            name,
            description,
            domainId,
            category,
            schemaJson,
            item.path,
            fileContent.sha,
            now,
            now,
            now
          );
          synced++;
        }
      } catch (error) {
        console.error(`[oasf-sync] Error processing skill file ${item.path}:`, error);
        errors++;
      }
    }
    
    // Update checkpoint with tree SHA
    await setCheckpointValue(db, 'oasf_skills_tree_sha', tree.sha);
    await setCheckpointValue(db, 'oasf_skills_last_sync', String(now));
    
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

