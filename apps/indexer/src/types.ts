import type { Address } from "viem";

export type AgentRow = {
  agentId: string;           // store uint256 as DEC string for easy querying
  agentAccount: Address;     // the agent's canonical account address (subgraph agentWallet)
  owner?: Address;           // not in your ABI; keep optional for future
  agentUri?: string | null; // optional for future
  createdAtBlock: number;
  didIdentity?: string;      // did:8004:chainId:agentId
  didAccount?: string;       // did:ethr:chainId:agentAccount
  didName?: string | null;   // did:ens:chainId:agentName (if agentName ends with .eth)
  createdAtTime: number;     // unix
};
