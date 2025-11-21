'use client';

import * as React from 'react';
import { CHAIN_CONFIGS, getChainConfigByHex } from '../config/chains';

export type EnsClientApi = {
  getAgentUrlByName: (name: string) => Promise<string | null>;
  getAgentImageByName: (name: string) => Promise<string | null>;
  getAgentDescriptionByName: (name: string) => Promise<string | null>;
  getAgentAccountByName: (name: string) => Promise<string | null>;
  getAgentIdentityByName: (name: string) => Promise<any>;
  hasAgentNameOwner: (orgName: string, agentName: string) => Promise<boolean>;
  prepareSetNameUriCalls: (name: string, uri: string) => Promise<any>;
  prepareSetNameDescriptionCalls: (name: string, description: string) => Promise<any>;
  prepareSetNameImageCalls: (name: string, image: string) => Promise<any>;
  prepareSetAgentNameInfoCalls: (params: Record<string, unknown>) => Promise<any>;
  prepareAddAgentNameToOrgCalls: (params: Record<string, unknown>) => Promise<any>;
};

export const DEFAULT_ENS_CHAIN_HEX = CHAIN_CONFIGS[0]?.chainIdHex ?? '0xaa36a7';

async function callEnsApi(method: string, args: any[] = [], chainIdHex?: string) {
  const chainConfig = getChainConfigByHex(chainIdHex || DEFAULT_ENS_CHAIN_HEX);
  const response = await fetch('/api/ens-client', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method,
      args,
      chainId: chainConfig?.chainId,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'ENS client request failed');
  }
  return payload?.result ?? null;
}

export function buildEnsClient(chainIdHex?: string): EnsClientApi {
  return {
    getAgentUrlByName: (name: string) => callEnsApi('getAgentUrlByName', [name], chainIdHex),
    getAgentImageByName: (name: string) => callEnsApi('getAgentImageByName', [name], chainIdHex),
    getAgentDescriptionByName: (name: string) => callEnsApi('getAgentDescriptionByName', [name], chainIdHex),
    getAgentAccountByName: (name: string) => callEnsApi('getAgentAccountByName', [name], chainIdHex),
    getAgentIdentityByName: (name: string) => callEnsApi('getAgentIdentityByName', [name], chainIdHex),
    hasAgentNameOwner: (orgName: string, agentName: string) =>
      callEnsApi('hasAgentNameOwner', [orgName, agentName], chainIdHex),
    prepareSetNameUriCalls: (name: string, uri: string) =>
      callEnsApi('prepareSetNameUriCalls', [name, uri], chainIdHex),
    prepareSetNameDescriptionCalls: (name: string, description: string) =>
      callEnsApi('prepareSetNameDescriptionCalls', [name, description], chainIdHex),
    prepareSetNameImageCalls: (name: string, image: string) =>
      callEnsApi('prepareSetNameImageCalls', [name, image], chainIdHex),
    prepareSetAgentNameInfoCalls: (params: Record<string, unknown>) =>
      callEnsApi('prepareSetAgentNameInfoCalls', [params], chainIdHex),
    prepareAddAgentNameToOrgCalls: (params: Record<string, unknown>) =>
      callEnsApi('prepareAddAgentNameToOrgCalls', [params], chainIdHex),
  };
}

const AIAgentENSClientContext = React.createContext<EnsClientApi | null>(null);

export function useAgentENSClient(): EnsClientApi {
  const client = React.useContext(AIAgentENSClientContext);
  if (!client) throw new Error('useAgentENSClient must be used within AIAgentENSClientProvider');
  return client;
}

type Props = { children: React.ReactNode };

export function AIAgentENSClientProvider({ children }: Props) {
  const client = React.useMemo(() => buildEnsClient(DEFAULT_ENS_CHAIN_HEX), []);

  return (
    <AIAgentENSClientContext.Provider value={client}>
      {children}
    </AIAgentENSClientContext.Provider>
  );
}

