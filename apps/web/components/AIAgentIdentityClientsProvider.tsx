'use client';

import * as React from 'react';
import { CHAIN_CONFIGS } from '../config/chains';
import { buildIdentityClient, IdentityClientApi } from './AIAgentIdentityClientProvider';

type ClientsByChain = Record<string, IdentityClientApi>;

const ClientsContext = React.createContext<ClientsByChain>({});

export function useAgentIdentityClients(): ClientsByChain {
  return React.useContext(ClientsContext);
}

export function useAgentIdentityClientFor(chainIdHex?: string): IdentityClientApi | null {
  const clients = useAgentIdentityClients();
  const targetClient = chainIdHex ? clients[chainIdHex] : null;
  const firstChainId = React.useMemo(() => Object.keys(clients)[0] || null, [clients]);
  const firstClient = firstChainId ? clients[firstChainId] : null;

  return React.useMemo(() => {
    if (targetClient) return targetClient;
    if (firstClient) return firstClient;
    return null;
  }, [targetClient, firstClient]);
}

type Props = { children: React.ReactNode };

export function AIAgentIdentityClientsProvider({ children }: Props) {
  const clients = React.useMemo(() => {
    const map: ClientsByChain = {};
    CHAIN_CONFIGS.forEach(cfg => {
      map[cfg.chainIdHex] = buildIdentityClient(cfg.chainIdHex);
    });
    return map;
  }, []);

  return (
    <ClientsContext.Provider value={clients}>
      {children}
    </ClientsContext.Provider>
  );
}

