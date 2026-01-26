function escapeTurtleString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function iriEncodeSegment(value: string): string {
  return encodeURIComponent(value).replace(/%/g, '_');
}

function turtleJsonLiteral(json: string): string {
  const escaped = escapeTurtleString(json);
  return `"""${escaped}"""^^xsd:string`;
}

function rdfPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix erc8004: <https://agentictrust.io/ontology/erc8004#> .',
    '',
    '<https://www.agentictrust.io/graph/data/subgraph> a owl:Ontology ;',
    '  owl:imports <https://agentictrust.io/ontology/core> ;',
    '  owl:imports <https://agentictrust.io/ontology/erc8004> ;',
    '  .',
    '',
  ].join('\n');
}

export function exportSubgraphDataToRdf(
  chainId: number,
  dataType: string,
  items: any[],
): string {
  const lines: string[] = [rdfPrefixes()];

  for (const item of items) {
    if (!item || typeof item !== 'object') continue;

    const itemId = String(item.id || '').trim();
    if (!itemId) continue;

    const itemIri = `<https://www.agentictrust.io/id/subgraph/${dataType}/${chainId}/${iriEncodeSegment(itemId)}>`;
    lines.push(`${itemIri} a erc8004:SubgraphRawData, prov:Entity ;`);
    lines.push(`  erc8004:subgraphDataType "${escapeTurtleString(dataType)}" ;`);
    lines.push(`  erc8004:subgraphChainId ${chainId} ;`);
    lines.push(`  erc8004:subgraphItemId "${escapeTurtleString(itemId)}" ;`);

    // Store raw JSON data
    try {
      const rawJson = JSON.stringify(item);
      lines.push(`  erc8004:subgraphRawJson ${turtleJsonLiteral(rawJson)} ;`);
    } catch {
      // skip if can't stringify
    }

    // Extract common fields and add as properties
    if (item.blockNumber != null) {
      lines.push(`  erc8004:subgraphBlockNumber ${Number(item.blockNumber) || 0} ;`);
    }
    if (item.timestamp != null) {
      lines.push(`  erc8004:subgraphTimestamp ${Number(item.timestamp) || 0} ;`);
    }
    if (item.txHash) {
      const txHash = String(item.txHash).trim();
      if (txHash) {
        lines.push(`  erc8004:subgraphTxHash "${escapeTurtleString(txHash)}" ;`);
      }
    }

    // Link to agent if present
    if (item.agent?.id) {
      const agentId = String(item.agent.id).trim();
      if (agentId) {
        const agentIri = `<https://www.agentictrust.io/id/agent/${chainId}/${iriEncodeSegment(agentId)}>`;
        lines.push(`  erc8004:subgraphAgent ${agentIri} ;`);
      }
    }

    lines.push(`  .\n`);
  }

  return lines.join('\n');
}
