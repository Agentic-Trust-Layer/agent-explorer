import { AccountProvider } from '@agentic-trust/8004-sdk';
/**
 * Org Identity Client - ENS utilities for organizations
 * Uses AccountProvider (Ports & Adapters pattern) for chain I/O.
 * Provides helpers to resolve an org's ENS name to its account address and URL text record.
 */
export declare class OrgIdentityClient {
    private accountProvider;
    private ensRegistryAddress;
    private publicClient;
    constructor(accountProvider: AccountProvider, options?: {
        ensRegistry?: `0x${string}`;
        rpcUrl?: string;
    });
    /** Resolve the account address for an org ENS name via resolver.addr(namehash(name)). */
    getOrgAccountByName(orgName: string): Promise<`0x${string}` | null>;
    getOrgEoaByAccount(orgAccount: `0x${string}`): Promise<string | null>;
    /** Resolve the URL text record for an org ENS name via resolver.text(namehash(name), 'url'). */
    getOrgUrlByName(orgName: string): Promise<string | null>;
    /** Reverse lookup: account address -> ENS name via resolver.name(reverseNode) */
    getOrgNameByAccount(account: `0x${string}`): Promise<string | null>;
    private getResolver;
    private normalizeEnsName;
    private namehash;
    private isZeroAddress;
}
//# sourceMappingURL=OrgIdentityClient.d.ts.map