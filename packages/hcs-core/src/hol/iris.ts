import { iriEncodeSegment } from '../rdf/common.js';

export function holAgentIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/agent/hol/${iriEncodeSegment(agentId)}>`;
}

export function holIdentityIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/hol-identity/${iriEncodeSegment(agentId)}>`;
}

export function holIdentityDescriptorIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/hol-identity-descriptor/${iriEncodeSegment(agentId)}>`;
}

export function holIdentityIdentifierIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/identifier/hol/${iriEncodeSegment(agentId)}>`;
}

export function holAgentDescriptorIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/agent-descriptor/hol/${iriEncodeSegment(agentId)}>`;
}

export function holAgentProfileIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/hol-profile/${iriEncodeSegment(agentId)}>`;
}

export function holRegistryIri(registry: string): string {
  const key = registry && registry.trim() ? registry.trim() : 'HOL';
  return `<https://www.agentictrust.io/id/registry/hol/${iriEncodeSegment(key)}>`;
}

