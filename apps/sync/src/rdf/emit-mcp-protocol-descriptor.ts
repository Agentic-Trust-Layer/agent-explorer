import { escapeTurtleString, protocolIriMcp, rdfPrefixes, turtleJsonLiteral } from './common.js';

export function emitMcpProtocolDescriptorHealthTurtle(opts: {
  didAccount: string;
  checkedAtTime: number;
  alive: boolean;
  statusCode: number | null;
  tools?: string[] | null;
  prompts?: string[] | null;
  toolsListJson?: any | null;
  promptsListJson?: any | null;
}): { turtle: string; protocolIri: string; protocolDescriptorIri: string } {
  const protocolIri = protocolIriMcp(opts.didAccount);
  const pDescIri = protocolIri.replace('/id/protocol/', '/id/descriptor/protocol/');
  const lines: string[] = [rdfPrefixes()];

  // Update protocol descriptor node (do not re-emit the full protocol/endpoint graph).
  lines.push(`${pDescIri} a core:DescriptorMCPProtocol, core:Descriptor, prov:Entity ;`);
  lines.push(`  dcterms:title "mcp" ;`);
  lines.push(`  rdfs:label "mcp" ;`);
  lines.push(`  core:mcpCheckedAtTime ${Math.trunc(opts.checkedAtTime)} ;`);
  lines.push(`  core:mcpAlive ${opts.alive ? 'true' : 'false'} ;`);
  if (opts.alive) lines.push(`  core:mcpLastOkAtTime ${Math.trunc(opts.checkedAtTime)} ;`);
  if (opts.statusCode != null && Number.isFinite(opts.statusCode)) lines.push(`  core:mcpLastStatusCode ${Math.trunc(opts.statusCode)} ;`);

  const tools = Array.isArray(opts.tools) ? opts.tools.filter((x) => typeof x === 'string' && x.trim()).map((x) => String(x).trim()) : [];
  const prompts = Array.isArray(opts.prompts) ? opts.prompts.filter((x) => typeof x === 'string' && x.trim()).map((x) => String(x).trim()) : [];
  if (tools.length) lines.push(`  core:mcpToolsCount ${tools.length} ;`);
  if (prompts.length) lines.push(`  core:mcpPromptsCount ${prompts.length} ;`);

  try {
    if (opts.toolsListJson != null) lines.push(`  core:mcpToolsListJson ${turtleJsonLiteral(JSON.stringify(opts.toolsListJson))} ;`);
  } catch {}
  try {
    if (opts.promptsListJson != null) lines.push(`  core:mcpPromptsListJson ${turtleJsonLiteral(JSON.stringify(opts.promptsListJson))} ;`);
  } catch {}

  // terminate descriptor
  lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
  lines.push('');

  // Ensure protocol node at least points at its descriptor (best-effort).
  lines.push(`<${protocolIri}> core:hasDescriptor ${pDescIri} .`);
  lines.push('');

  return { turtle: lines.join('\n'), protocolIri, protocolDescriptorIri: pDescIri };
}

