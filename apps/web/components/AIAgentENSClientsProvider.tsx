'use client';

import * as React from 'react';
import { CHAIN_CONFIGS } from '../config/chains';
import { EnsClientApi, buildEnsClient, DEFAULT_ENS_CHAIN_HEX } from './AIAgentENSClientProvider';

type ENSClientsByChain = Record<string, EnsClientApi>;

const ENSClientsContext = React.createContext<ENSClientsByChain>({});

export function useAgentENSClients(): ENSClientsByChain {
  return React.useContext(ENSClientsContext);
}

export function useAgentENSClientFor(chainIdHex?: string): EnsClientApi | null {
  const clients = useAgentENSClients();
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

export function AIAgentENSClientsProvider({ children }: Props) {
  const clients = React.useMemo(() => {
    const map: ENSClientsByChain = {};
    CHAIN_CONFIGS.forEach(cfg => {
      map[cfg.chainIdHex] = buildEnsClient(cfg.chainIdHex);
    });
    if (!map[DEFAULT_ENS_CHAIN_HEX]) {
      map[DEFAULT_ENS_CHAIN_HEX] = buildEnsClient(DEFAULT_ENS_CHAIN_HEX);
    }
    return map;
  }, []);

  return (
    <ENSClientsContext.Provider value={clients}>
      {children}
    </ENSClientsContext.Provider>
  );
}


