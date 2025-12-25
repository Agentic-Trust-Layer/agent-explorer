type AnyDb = any;

function isNode(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof process !== 'undefined' && Boolean((process as any).versions?.node);
}

function rdfPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix p-plan: <http://purl.org/net/p-plan#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    '@prefix agentictrust: <https://agentictrust.io/ontology/agentictrust#> .',
    '',
  ].join('\n');
}

function parseCursor(value: unknown): { chainId: number; agentId: string } {
  if (typeof value !== 'string' || !value.trim()) return { chainId: 0, agentId: '' };
  const parts = value.split('|');
  if (parts.length < 2) return { chainId: 0, agentId: '' };
  const chainId = Number(parts[0]);
  const agentId = parts.slice(1).join('|');
  return {
    chainId: Number.isFinite(chainId) && chainId >= 0 ? Math.trunc(chainId) : 0,
    agentId: typeof agentId === 'string' ? agentId : '',
  };
}

function formatCursor(cursor: { chainId: number; agentId: string }): string {
  const chainId = Number.isFinite(cursor.chainId) && cursor.chainId >= 0 ? Math.trunc(cursor.chainId) : 0;
  const agentId = typeof cursor.agentId === 'string' ? cursor.agentId : '';
  return `${chainId}|${agentId}`;
}

function escapeTurtleString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function turtleJsonLiteral(jsonText: string): string {
  // Use rdf:JSON datatype (supported by many RDF tools; Protege can still display as literal).
  // Use triple-quoted literal, but still escape backslashes/quotes to keep it robust.
  const escaped = escapeTurtleString(jsonText);
  return `"""${escaped}"""^^rdf:JSON`;
}

function iriEncodeSegment(seg: string): string {
  return encodeURIComponent(seg).replace(/%2F/g, '%252F');
}

function agentIri(chainId: number, agentId: string): string {
  return `<https://agentictrust.io/id/agent/${chainId}/${iriEncodeSegment(agentId)}>`;
}

function agentCardIri(chainId: number, agentId: string): string {
  return `<https://agentictrust.io/id/agent-card/${chainId}/${iriEncodeSegment(agentId)}>`;
}

function skillIri(chainId: number, agentId: string, skillId: string): string {
  return `<https://agentictrust.io/id/skill/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(skillId)}>`;
}

function fetchActivityIri(chainId: number, agentId: string, readAt: number): string {
  return `<https://agentictrust.io/id/activity/agent-card-fetch/${chainId}/${iriEncodeSegment(agentId)}/${readAt}>`;
}

async function writeFileAtomically(targetPath: string, contents: string): Promise<void> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const dir = path.dirname(targetPath);
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${targetPath}.tmp`;
  await fs.writeFile(tmp, contents, 'utf8');
  await fs.rename(tmp, targetPath);
}

async function setCheckpointValue(db: AnyDb, key: string, value: string): Promise<void> {
  try {
    await db.prepare('INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key, value);
  } catch {
    // best-effort
  }
}

async function getCheckpointValue(db: AnyDb, key: string): Promise<string | null> {
  try {
    const row = await db.prepare('SELECT value FROM checkpoints WHERE key = ?').get(key);
    return row?.value ? String((row as any).value) : null;
  } catch {
    return null;
  }
}

function renderAgentSection(row: any, agentCard: any, agentCardJsonText: string): string {
  const chainId = Number(row?.chainId ?? 0) || 0;
  const agentId = String(row?.agentId ?? '');
  const readAt = Number(row?.agentCardReadAt ?? 0) || Math.floor(Date.now() / 1000);

  const aIri = agentIri(chainId, agentId);
  const cIri = agentCardIri(chainId, agentId);
  const fetchIri = fetchActivityIri(chainId, agentId, readAt);

  const lines: string[] = [];

  // Agent
  lines.push(`${aIri} a agentictrust:ERC8004Agent, prov:Agent ;`);
  lines.push(`  agentictrust:chainId ${chainId} ;`);
  lines.push(`  agentictrust:agentId "${escapeTurtleString(String(agentId))}" ;`);
  if (row?.agentName) lines.push(`  agentictrust:agentName "${escapeTurtleString(String(row.agentName))}" ;`);
  if (row?.didIdentity) lines.push(`  agentictrust:didIdentity "${escapeTurtleString(String(row.didIdentity))}" ;`);
  if (row?.didAccount) lines.push(`  agentictrust:didAccount "${escapeTurtleString(String(row.didAccount))}" ;`);
  if (row?.didName) lines.push(`  agentictrust:didName "${escapeTurtleString(String(row.didName))}" ;`);
  if (row?.agentAccount) lines.push(`  agentictrust:agentAccount "${escapeTurtleString(String(row.agentAccount))}" ;`);
  if (row?.agentOwner) lines.push(`  agentictrust:agentOwner "${escapeTurtleString(String(row.agentOwner))}" ;`);
  if (row?.eoaOwner) lines.push(`  agentictrust:eoaOwner "${escapeTurtleString(String(row.eoaOwner))}" ;`);
  if (row?.tokenUri) lines.push(`  agentictrust:tokenUri <${escapeTurtleString(String(row.tokenUri))}> ;`);
  if (row?.a2aEndpoint) lines.push(`  agentictrust:a2aEndpoint <${escapeTurtleString(String(row.a2aEndpoint))}> ;`);
  if (row?.ensEndpoint) lines.push(`  agentictrust:ensEndpoint <${escapeTurtleString(String(row.ensEndpoint))}> ;`);
  if (row?.agentAccountEndpoint) lines.push(`  agentictrust:agentAccountEndpoint <${escapeTurtleString(String(row.agentAccountEndpoint))}> ;`);
  if (row?.supportedTrust) lines.push(`  agentictrust:supportedTrust "${escapeTurtleString(String(row.supportedTrust))}" ;`);
  if (row?.createdAtTime) lines.push(`  agentictrust:createdAtTime ${Number(row.createdAtTime) || 0} ;`);
  if (row?.updatedAtTime) lines.push(`  agentictrust:updatedAtTime ${Number(row.updatedAtTime) || 0} ;`);
  lines.push(`  agentictrust:agentCardReadAt ${readAt} ;`);
  lines.push(`  agentictrust:hasAgentCard ${cIri} ;`);
  if (row?.rawJson) lines.push(`  agentictrust:json ${turtleJsonLiteral(String(row.rawJson))} ;`);
  lines.push(`  .\n`);

  // Agent card
  lines.push(`${cIri} a agentictrust:AgentCard, prov:Entity ;`);
  if (typeof agentCard?.name === 'string' && agentCard.name.trim()) lines.push(`  rdfs:label "${escapeTurtleString(agentCard.name.trim())}" ;`);
  if (typeof agentCard?.description === 'string' && agentCard.description.trim())
    lines.push(`  dcterms:description "${escapeTurtleString(agentCard.description.trim())}" ;`);
  if (typeof agentCard?.protocolVersion === 'string' && agentCard.protocolVersion.trim())
    lines.push(`  agentictrust:protocolVersion "${escapeTurtleString(agentCard.protocolVersion.trim())}" ;`);
  if (typeof agentCard?.preferredTransport === 'string' && agentCard.preferredTransport.trim())
    lines.push(`  agentictrust:preferredTransport "${escapeTurtleString(agentCard.preferredTransport.trim())}" ;`);
  if (typeof agentCard?.url === 'string' && agentCard.url.trim()) lines.push(`  agentictrust:serviceUrl <${escapeTurtleString(agentCard.url.trim())}> ;`);
  lines.push(`  agentictrust:json ${turtleJsonLiteral(agentCardJsonText)} ;`);

  const skills: any[] = Array.isArray(agentCard?.skills) ? agentCard.skills : [];
  for (const skill of skills) {
    const id = typeof skill?.id === 'string' ? skill.id.trim() : '';
    if (!id) continue;
    lines.push(`  agentictrust:hasSkill ${skillIri(chainId, agentId, id)} ;`);
  }
  lines.push(`  .\n`);

  // Fetch provenance
  lines.push(`${fetchIri} a agentictrust:AgentCardFetch, prov:Activity ;`);
  lines.push(`  prov:generated ${cIri} ;`);
  lines.push(`  prov:endedAtTime "${new Date(readAt * 1000).toISOString()}"^^xsd:dateTime ;`);
  lines.push(`  .\n`);

  // Skills + examples + tags
  const allTags: string[] = [];
  for (const skill of skills) {
    const id = typeof skill?.id === 'string' ? skill.id.trim() : '';
    if (!id) continue;
    const sIri = skillIri(chainId, agentId, id);
    const afterSkill: string[] = [];
    lines.push(`${sIri} a agentictrust:Skill, prov:Entity ;`);
    lines.push(`  agentictrust:skillId "${escapeTurtleString(id)}" ;`);
    if (typeof skill?.name === 'string' && skill.name.trim()) lines.push(`  agentictrust:skillName "${escapeTurtleString(skill.name.trim())}" ;`);
    if (typeof skill?.description === 'string' && skill.description.trim())
      lines.push(`  agentictrust:skillDescription "${escapeTurtleString(skill.description.trim())}" ;`);

    const tags: any[] = Array.isArray(skill?.tags) ? skill.tags : [];
    for (const t of tags) {
      if (typeof t === 'string' && t.trim()) {
        const tag = t.trim();
        allTags.push(tag);
        const tagIri = `<https://agentictrust.io/id/tag/${iriEncodeSegment(tag)}>`;
        lines.push(`  agentictrust:hasTag ${tagIri} ;`);
      }
    }

    const examples: any[] = Array.isArray(skill?.examples) ? skill.examples : [];
    let exampleIndex = 0;
    for (const ex of examples) {
      exampleIndex += 1;
      const exIri = `<https://agentictrust.io/id/example/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(id)}/${exampleIndex}>`;
      lines.push(`  agentictrust:hasExample ${exIri} ;`);

      const title = typeof ex?.title === 'string' ? ex.title.trim() : '';
      afterSkill.push(`${exIri} a agentictrust:SkillExample, prov:Entity ;`);
      if (title) afterSkill.push(`  rdfs:label "${escapeTurtleString(title)}" ;`);
      try {
        afterSkill.push(`  agentictrust:json ${turtleJsonLiteral(JSON.stringify(ex))} ;`);
      } catch {
        // ignore
      }
      afterSkill.push(`  .\n`);
    }

    lines.push(`  .\n`);
    if (afterSkill.length) lines.push(afterSkill.join('\n'));
  }

  // Tag individuals (duplicates are OK in Turtle, but we de-dupe within this agent)
  for (const t of Array.from(new Set(allTags))) {
    const tagIri = `<https://agentictrust.io/id/tag/${iriEncodeSegment(t)}>`;
    lines.push(`${tagIri} a agentictrust:Tag, prov:Entity ; rdfs:label "${escapeTurtleString(t)}" .`);
  }
  lines.push('');

  return lines.join('\n');
}

async function exportAllAgentsRdf(db: AnyDb): Promise<{ outPath: string; bytes: number; agentCount: number }> {
  const rows = await db
    .prepare(
      `
      SELECT
        chainId, agentId, agentName, agentOwner, eoaOwner, agentCategory, tokenUri,
        a2aEndpoint, ensEndpoint, agentAccountEndpoint,
        didIdentity, didAccount, didName,
        agentAccount,
        supportedTrust,
        rawJson,
        agentCardJson,
        agentCardReadAt,
        createdAtTime,
        updatedAtTime,
        description,
        image,
        type
      FROM agents
      WHERE agentCardJson IS NOT NULL AND agentCardJson != ''
      ORDER BY chainId ASC, LENGTH(agentId) ASC, agentId ASC
    `,
    )
    .all();

  const agentRows: any[] = Array.isArray(rows) ? rows : Array.isArray((rows as any)?.results) ? (rows as any).results : [];

  const chunks: string[] = [];
  chunks.push(rdfPrefixes());

  let included = 0;
  for (const row of agentRows) {
    const agentCardJsonText = row?.agentCardJson != null ? String(row.agentCardJson) : '';
    if (!agentCardJsonText.trim()) continue;
    let agentCard: any = null;
    try {
      agentCard = JSON.parse(agentCardJsonText);
    } catch {
      agentCard = null;
    }
    if (!agentCard || typeof agentCard !== 'object') continue;
    chunks.push(renderAgentSection(row, agentCard, agentCardJsonText));
    included += 1;
  }

  const ttl = chunks.join('\n');

  const path = await import('node:path');
  const publicDir =
    (process.env.RDF_PUBLIC_DIR && process.env.RDF_PUBLIC_DIR.trim()) ||
    path.resolve(process.cwd(), '../badge-admin/public');

  const outPath = path.resolve(publicDir, 'rdf', 'agents.ttl');
  await writeFileAtomically(outPath, ttl);
  return { outPath, bytes: Buffer.byteLength(ttl, 'utf8'), agentCount: included };
}

export async function exportAgentRdfForAgentCardUpdate(db: AnyDb, chainId: number, agentId: string): Promise<void> {
  if (!isNode()) return;
  if (!db) return;
  // single-file export (requested): regenerate from all stored agent cards
  const result = await exportAllAgentsRdf(db);
  console.info('[rdf-export] wrote combined', { trigger: { chainId, agentId }, ...result });
  await setCheckpointValue(db, 'agentRdfExportCursor', `${chainId}|${agentId}|${Math.floor(Date.now() / 1000)}`);
}

export async function backfillAgentRdfFromStoredAgentCards(
  db: AnyDb,
  opts?: { reset?: boolean; chunkSize?: number; max?: number },
): Promise<void> {
  if (!isNode()) return;
  if (!db) return;

  const checkpointKey = 'agentRdfBackfillCursor';
  if (opts?.reset) {
    try {
      await db.prepare('DELETE FROM checkpoints WHERE key = ?').run(checkpointKey);
      console.info('[rdf-backfill] reset: cleared agentRdfBackfillCursor checkpoint');
    } catch (e) {
      console.warn('[rdf-backfill] reset requested but failed to clear checkpoint', e);
    }
  }
  const result = await exportAllAgentsRdf(db);
  console.info('[rdf-backfill] wrote combined', result);
  await setCheckpointValue(db, checkpointKey, `${Math.floor(Date.now() / 1000)}`);
}


