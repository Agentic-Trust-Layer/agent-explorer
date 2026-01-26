import {
  accountIri,
  agentDescriptorIri,
  escapeTurtleString,
  identityEnsIri,
  identityIdentifier8004Iri,
  identityIdentifierEnsIri,
  identity8004Iri,
  rdfPrefixes,
  turtleIriOrLiteral,
  turtleJsonLiteral,
} from './common.js';
import { emitRawSubgraphRecord } from './emit-raw-record.js';

function normalizeHex(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim().toLowerCase();
  if (!s) return null;
  const hex = s.startsWith('0x') ? s : null;
  if (!hex) return null;
  return /^0x[0-9a-f]{40}$/.test(hex) ? hex : null;
}

export function emitAgentsTurtle(chainId: number, items: any[], cursorKey: 'mintedAt', minCursorExclusive: bigint): { turtle: string; maxCursor: bigint } {
  const lines: string[] = [rdfPrefixes()];
  let maxCursor = minCursorExclusive;

  for (const item of items) {
    const agentId = String(item?.id ?? '').trim();
    if (!agentId) continue;

    const mintedAtRaw = item?.mintedAt ?? 0;
    let mintedAt = 0n;
    try {
      mintedAt = BigInt(mintedAtRaw);
    } catch {
      mintedAt = 0n;
    }
    if (mintedAt <= minCursorExclusive) continue;
    if (mintedAt > maxCursor) maxCursor = mintedAt;

    const owner = normalizeHex(item?.owner?.id ?? item?.owner) ?? '0x0000000000000000000000000000000000000000';
    const agentWallet = normalizeHex(item?.agentWallet) ?? owner;
    if (!agentWallet) continue;

    const agentAccountIri = accountIri(chainId, agentWallet);
    const didIdentity = `did:8004:${chainId}:${agentId}`;
    const didAccount = `did:ethr:${chainId}:${agentWallet}`;

    // Agent node (anchored to account, consistent with export-agent-rdf)
    lines.push(`${agentAccountIri} a core:AIAgent, prov:SoftwareAgent, eth:Account, prov:Agent, prov:Entity ;`);
    if (typeof item?.name === 'string' && item.name.trim()) lines.push(`  core:agentName "${escapeTurtleString(item.name.trim())}" ;`);
    lines.push(`  core:didIdentity "${escapeTurtleString(didIdentity)}" ;`);
    lines.push(`  core:didAccount "${escapeTurtleString(didAccount)}" ;`);

    const agentUri = typeof item?.agentURI === 'string' ? item.agentURI.trim() : '';
    if (agentUri) {
      const tok = turtleIriOrLiteral(agentUri);
      if (tok) lines.push(`  core:agentUri ${tok} ;`);
    }

    const a2aEndpoint = typeof item?.a2aEndpoint === 'string' ? item.a2aEndpoint.trim() : '';
    if (a2aEndpoint) {
      const tok = turtleIriOrLiteral(a2aEndpoint);
      if (tok) lines.push(`  core:a2aEndpoint ${tok} ;`);
    }

    // Store registration JSON from subgraph as core:json (matches existing KB usage)
    const rawJsonText =
      (typeof item?.metadataJson === 'string' && item.metadataJson.trim() ? item.metadataJson.trim() : '') ||
      (typeof item?.registration?.raw === 'string' && item.registration.raw.trim() ? item.registration.raw.trim() : '');
    if (rawJsonText) {
      lines.push(`  core:json ${turtleJsonLiteral(rawJsonText)} ;`);
    }

    // Identity node + registration descriptor link (minimal, but standard-aligned)
    const identityIri = identity8004Iri(didIdentity);
    const identityIdentifierIri = identityIdentifier8004Iri(didIdentity);
    const descriptorIri = agentDescriptorIri(didAccount);
    lines.push(`  core:hasIdentity ${identityIri} ;`);
    // terminate agent
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    lines.push(`${identityIri} a erc8004:AgentIdentity8004, core:AgentIdentity, prov:Entity ;`);
    lines.push(`  core:identityOf ${agentAccountIri} ;`);
    // Associate DID identifier (did:8004:{chainId}:{id})
    lines.push(`  core:hasIdentifier ${identityIdentifierIri} ;`);
    lines.push(`  core:hasDescriptor ${descriptorIri} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    lines.push(`${identityIdentifierIri} a erc8004:IdentityIdentifier8004, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier "${escapeTurtleString(didIdentity)}" ;`);
    lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/8004> .`);
    lines.push('');

    // Descriptor node (AgentRegistration8004 is defined in OWL docs; keep type for compatibility)
    lines.push(`${descriptorIri} a erc8004:AgentRegistration8004, core:AgentIdentityDescriptor, core:Descriptor, prov:Entity ;`);
    if (typeof item?.name === 'string' && item.name.trim()) lines.push(`  core:descriptorName "${escapeTurtleString(item.name.trim())}" ;`);
    if (typeof item?.description === 'string' && item.description.trim()) lines.push(`  core:descriptorDescription "${escapeTurtleString(item.description.trim())}" ;`);
    if (item?.image != null) {
      const imgTok = turtleIriOrLiteral(String(item.image));
      if (imgTok) lines.push(`  core:descriptorImage ${imgTok} ;`);
    }
    // terminate descriptor
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // ENS Identity (optional)
    const ensName = typeof item?.ensName === 'string' ? item.ensName.trim() : '';
    if (ensName) {
      const ensDid = `did:ens:${ensName}`;
      const ensIdIri = identityEnsIri(ensName);
      const didEnsIri = identityIdentifierEnsIri(ensName);

      lines.push(`${agentAccountIri} core:hasIdentity ${ensIdIri} .`);
      lines.push('');

      lines.push(`${ensIdIri} a ens:EnsIdentity, core:AgentIdentity, prov:Entity ;`);
      lines.push(`  core:identityOf ${agentAccountIri} ;`);
      lines.push(`  core:hasIdentifier ${didEnsIri} ;`);
      lines.push(`  core:identityRegistry <https://www.agentictrust.io/id/ens-registry> .`);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');

      lines.push(`${didEnsIri} a ens:EnsIdentifier, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
      lines.push(`  core:protocolIdentifier "${escapeTurtleString(ensDid)}" ;`);
      lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/ens> .`);
      lines.push('');
    }

    // Raw ingest record (stores full subgraph row)
    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'agents',
        entityId: agentId,
        cursorValue: mintedAt.toString(),
        raw: item,
        txHash: null,
        blockNumber: null,
        timestamp: null,
        recordsEntityIri: agentAccountIri,
      }),
    );
    lines.push('');
  }

  return { turtle: lines.join('\n'), maxCursor };
}

