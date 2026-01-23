export interface ParsedEnsDid {
    /**
     * Decoded ENS DID without URL encoding (e.g. did:ens:11155111:my-agent.org.eth)
     */
    did: string;
    /**
     * DID method – always "ens"
     */
    method: 'ens';
    /**
     * Chain id component parsed as a number
     */
    chainId: number;
    /**
     * ENS name component (e.g. my-agent.org.eth)
     */
    ensName: string;
    /**
     * Encoded DID string suitable for use in URLs
     */
    encoded: string;
}
/**
 * Parse a did:ens identifier.
 *
 * Accepts encoded or decoded strings and expects format:
 *   did:ens:chainId:ensname
 */
export declare function parseEnsDid(raw: string | undefined | null): ParsedEnsDid;
export interface BuildEnsDidOptions {
    /**
     * When true (default) the resulting DID is URI-encoded.
     */
    encode?: boolean;
}
/**
 * Build a did:ens identifier from chain id and ENS name.
 */
export declare function buildEnsDid(chainId: number | string, ensName: string, options?: BuildEnsDidOptions): string;
/**
 * Build an ENS DID from agent name and organization name.
 * e.g. agentName = "my-agent", orgName = "org", chainId = 11155111
 *  → did:ens:11155111:my-agent.org.eth
 */
export declare function buildEnsDidFromAgentAndOrg(chainId: number | string, agentName: string, orgName: string, options?: BuildEnsDidOptions): string;
//# sourceMappingURL=didEns.d.ts.map