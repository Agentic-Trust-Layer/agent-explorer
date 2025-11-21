'use client';

import * as React from 'react';
import { CHAIN_CONFIGS, getChainConfigByHex } from '../config/chains';

export type IdentityClientApi = {
  getAgentAccount: (agentId: bigint | string | number) => Promise<string | null>;
  prepareRegisterCalls: (agentName: string, agentAccount: string, tokenUri?: string | null) => Promise<any>;
  prepareSetRegistrationUriCalls: (agentId: bigint | string | number, uri: string) => Promise<any>;
  extractAgentIdFromReceiptPublic: (receipt: any) => Promise<string | null>;
};

const DEFAULT_CHAIN_HEX = CHAIN_CONFIGS[0]?.chainIdHex ?? '0xaa36a7';

function toSerializable(value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(toSerializable);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toSerializable(v)]));
  }
  return value;
}

async function callIdentityApi(method: string, args: any[] = [], chainIdHex?: string) {
  const chainConfig = getChainConfigByHex(chainIdHex || DEFAULT_CHAIN_HEX);
  const response = await fetch('/api/identity-client', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method,
      args: args.map(toSerializable),
      chainId: chainConfig?.chainId,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Identity client request failed');
  }
  return payload?.result ?? null;
}

export function buildIdentityClient(chainIdHex?: string): IdentityClientApi {
  return {
    getAgentAccount: (agentId: bigint | string | number) =>
      callIdentityApi('getAgentAccount', [agentId], chainIdHex),
    prepareRegisterCalls: (agentName: string, agentAccount: string, tokenUri?: string | null) =>
      callIdentityApi('prepareRegisterCalls', [agentName, agentAccount, tokenUri], chainIdHex),
    prepareSetRegistrationUriCalls: (agentId: bigint | string | number, uri: string) =>
      callIdentityApi('prepareSetRegistrationUriCalls', [agentId, uri], chainIdHex),
    extractAgentIdFromReceiptPublic: (receipt: any) =>
      callIdentityApi('extractAgentIdFromReceiptPublic', [receipt], chainIdHex),
  };
}

const AgentIdentityClientContext = React.createContext<IdentityClientApi | null>(null);

export function useAgentIdentityClient(): IdentityClientApi {
  const client = React.useContext(AgentIdentityClientContext);
  if (!client) {
    throw new Error('useAgentIdentityClient must be used within AIAgentIdentityClientProvider');
  }
  return client;
}

type Props = { children: React.ReactNode };

export function AIAgentIdentityClientProvider({ children }: Props) {
  const client = React.useMemo(() => buildIdentityClient(DEFAULT_CHAIN_HEX), []);

  return (
    <AgentIdentityClientContext.Provider value={client}>
      {children}
    </AgentIdentityClientContext.Provider>
  );
}
