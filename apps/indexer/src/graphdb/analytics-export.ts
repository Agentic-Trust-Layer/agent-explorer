import fs from 'node:fs/promises';
import path from 'node:path';

import { db, ensureSchemaInitialized } from '../db';

type AnyDb = any;

function normalizeResults(result: any): any[] {
  if (Array.isArray(result)) return result;
  if (result?.results && Array.isArray(result.results)) return result.results;
  return [];
}

async function executeQuery(dbConn: AnyDb, sql: string, params: any[]): Promise<any[]> {
  const stmt = dbConn.prepare(sql);
  if (stmt.bind && typeof stmt.bind === 'function') {
    const result = await stmt.bind(...params).all();
    return normalizeResults(result);
  }
  const result = await stmt.all(...params);
  return normalizeResults(result);
}

function escapeTurtleString(value: string): string {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function iriEncodeSegment(value: string): string {
  return encodeURIComponent(String(value)).replace(/%/g, '_');
}

function rdfPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix analytics: <https://agentictrust.io/ontology/core/analytics#> .',
    '',
  ].join('\n');
}

function analyticsIndexIri(chainId: number, agentId: string): string {
  return `<https://www.agentictrust.io/id/agent-trust-index/${chainId}/${iriEncodeSegment(agentId)}>`;
}

function analyticsComponentIri(chainId: number, agentId: string, component: string): string {
  return `<https://www.agentictrust.io/id/agent-trust-component/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(component)}>`;
}

function analyticsBadgeDefIri(badgeId: string): string {
  return `<https://www.agentictrust.io/id/trust-ledger-badge-definition/${iriEncodeSegment(badgeId)}>`;
}

export async function exportAnalyticsTtlForChain(chainId: number): Promise<{
  outPath: string;
  bytes: number;
  atiCount: number;
  componentCount: number;
}> {
  await ensureSchemaInitialized();
  const cId = Number.isFinite(Number(chainId)) ? Math.trunc(Number(chainId)) : 0;
  if (!cId) throw new Error('chainId required');

  const atiRows = await executeQuery(
    db,
    `SELECT chainId, agentId, overallScore, overallConfidence, version, computedAt, bundleJson
     FROM agent_trust_index WHERE chainId = ?`,
    [cId],
  );
  const compRows = await executeQuery(
    db,
    `SELECT chainId, agentId, component, score, weight, evidenceCountsJson
     FROM agent_trust_components WHERE chainId = ?`,
    [cId],
  );

  const lines: string[] = [rdfPrefixes()];
  for (const row of atiRows) {
    const agentId = String(row?.agentId ?? '').trim();
    if (!agentId) continue;
    const iri = analyticsIndexIri(cId, agentId);
    lines.push(`${iri} a analytics:AgentTrustIndex, prov:Entity ;`);
    lines.push(`  analytics:chainId ${cId} ;`);
    lines.push(`  analytics:agentId "${escapeTurtleString(agentId)}" ;`);
    lines.push(`  analytics:overallScore ${Math.trunc(Number(row?.overallScore ?? 0))} ;`);
    if (row?.overallConfidence != null) {
      const conf = Number(row.overallConfidence);
      if (Number.isFinite(conf)) lines.push(`  analytics:overallConfidence "${conf}"^^xsd:decimal ;`);
    }
    if (row?.version != null) lines.push(`  analytics:version "${escapeTurtleString(String(row.version))}" ;`);
    if (row?.computedAt != null) lines.push(`  analytics:computedAt ${Math.trunc(Number(row.computedAt))} ;`);
    if (row?.bundleJson != null) lines.push(`  analytics:bundleJson "${escapeTurtleString(String(row.bundleJson))}" ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');
  }

  for (const row of compRows) {
    const agentId = String(row?.agentId ?? '').trim();
    const component = String(row?.component ?? '').trim();
    if (!agentId || !component) continue;
    const iri = analyticsComponentIri(cId, agentId, component);
    const indexIri = analyticsIndexIri(cId, agentId);
    lines.push(`${iri} a analytics:AgentTrustComponent, prov:Entity ;`);
    lines.push(`  analytics:componentOf ${indexIri} ;`);
    lines.push(`  analytics:component "${escapeTurtleString(component)}" ;`);
    const score = Number(row?.score);
    if (Number.isFinite(score)) lines.push(`  analytics:score "${score}"^^xsd:decimal ;`);
    const weight = Number(row?.weight);
    if (Number.isFinite(weight)) lines.push(`  analytics:weight "${weight}"^^xsd:decimal ;`);
    if (row?.evidenceCountsJson != null) lines.push(`  analytics:evidenceCountsJson "${escapeTurtleString(String(row.evidenceCountsJson))}" ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');
  }

  const outDir = path.resolve(process.cwd(), '.graphdb-out');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `analytics-${cId}.ttl`);
  const content = lines.join('\n');
  await fs.writeFile(outPath, content, 'utf8');
  return { outPath, bytes: Buffer.byteLength(content, 'utf8'), atiCount: atiRows.length, componentCount: compRows.length };
}

export async function exportTrustLedgerBadgeDefinitionsTtl(): Promise<{ outPath: string; bytes: number; badgeCount: number }> {
  await ensureSchemaInitialized();
  const rows = await executeQuery(
    db,
    `SELECT badgeId, program, name, description, iconRef, points, ruleId, ruleJson, active, createdAt, updatedAt
     FROM trust_ledger_badge_definitions`,
    [],
  );

  const lines: string[] = [rdfPrefixes()];
  for (const row of rows) {
    const badgeId = String(row?.badgeId ?? '').trim();
    if (!badgeId) continue;
    const iri = analyticsBadgeDefIri(badgeId);
    lines.push(`${iri} a analytics:TrustLedgerBadgeDefinition, prov:Entity ;`);
    lines.push(`  analytics:badgeId "${escapeTurtleString(badgeId)}" ;`);
    lines.push(`  analytics:program "${escapeTurtleString(String(row?.program ?? ''))}" ;`);
    lines.push(`  analytics:name "${escapeTurtleString(String(row?.name ?? ''))}" ;`);
    if (row?.description != null) lines.push(`  analytics:description "${escapeTurtleString(String(row.description))}" ;`);
    if (row?.iconRef != null) lines.push(`  analytics:iconRef "${escapeTurtleString(String(row.iconRef))}" ;`);
    lines.push(`  analytics:points ${Math.trunc(Number(row?.points ?? 0))} ;`);
    lines.push(`  analytics:ruleId "${escapeTurtleString(String(row?.ruleId ?? ''))}" ;`);
    if (row?.ruleJson != null) lines.push(`  analytics:ruleJson "${escapeTurtleString(String(row.ruleJson))}" ;`);
    lines.push(`  analytics:active ${(Number(row?.active ?? 0) ? 'true' : 'false')} ;`);
    if (row?.createdAt != null) lines.push(`  analytics:createdAt ${Math.trunc(Number(row.createdAt))} ;`);
    if (row?.updatedAt != null) lines.push(`  analytics:updatedAt ${Math.trunc(Number(row.updatedAt))} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');
  }

  const outDir = path.resolve(process.cwd(), '.graphdb-out');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `trust-ledger-badges.ttl`);
  const content = lines.join('\n');
  await fs.writeFile(outPath, content, 'utf8');
  return { outPath, bytes: Buffer.byteLength(content, 'utf8'), badgeCount: rows.length };
}

export async function listAnalyticsChainIds(): Promise<number[]> {
  await ensureSchemaInitialized();
  const rows = await executeQuery(db, `SELECT DISTINCT chainId FROM agent_trust_index ORDER BY chainId ASC`, []);
  return rows
    .map((r) => Number(r?.chainId))
    .filter((n) => Number.isFinite(n))
    .map((n) => Math.trunc(n));
}

