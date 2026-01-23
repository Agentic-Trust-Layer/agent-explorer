import { Hex } from 'viem';
import { D as Delegation } from '../types-Bwksz_U6.js';
import '@metamask/delegation-abis';
import 'viem/account-abstraction';
import 'viem/chains';

declare enum DelegationStoreFilter {
    Given = "GIVEN",
    Received = "RECEIVED",
    All = "ALL"
}
type Environment = {
    apiUrl: string;
};
type DelegationStorageConfig = {
    apiKey: string;
    apiKeyId: string;
    environment: Environment;
    fetcher?: typeof fetch;
};
declare class DelegationStorageClient {
    #private;
    constructor(config: DelegationStorageConfig);
    getDelegationChain(leafDelegationOrDelegationHash: Hex | Delegation): Promise<Delegation[]>;
    fetchDelegations(deleGatorAddress: Hex, filterMode?: DelegationStoreFilter): Promise<Delegation[]>;
    storeDelegation(delegation: Delegation): Promise<Hex>;
}

export { DelegationStorageClient, type DelegationStorageConfig, DelegationStoreFilter, type Environment };
