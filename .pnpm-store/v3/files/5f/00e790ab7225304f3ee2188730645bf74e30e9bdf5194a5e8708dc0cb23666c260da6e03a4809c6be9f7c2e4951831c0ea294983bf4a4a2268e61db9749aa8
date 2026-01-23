export interface ParsedDid8004 {
    /**
     * DID without any URL fragment (decoded form)
     * e.g. did:8004:11155111:724
     */
    did: string;
    /**
     * DID method – always "8004"
     */
    method: '8004';
    /**
     * Optional namespace between method and chain id (e.g. "eip155")
     */
    namespace?: string;
    /**
     * Chain id component parsed as a number
     */
    chainId: number;
    /**
     * Agent identifier component (string to preserve full precision)
     */
    agentId: string;
    /**
     * Optional fragment (portion after '#', decoded)
     */
    fragment?: string;
    /**
     * Encoded DID string suitable for use in URLs
     */
    encoded: string;
}
export interface BuildDid8004Options {
    namespace?: string;
    fragment?: string;
    /**
     * When true (default) the resulting DID is URI-encoded.
     */
    encode?: boolean;
}
/**
 * Construct a did:8004 identifier.
 *
 * @param chainId - numeric or string chain id
 * @param agentId - agent identifier (string or number)
 * @param namespaceOrOptions - optional namespace string or options bag
 * @param options - optional options when namespace is provided as third argument
 */
export declare function buildDid8004(chainId: number | string, agentId: number | string, namespaceOrOptions?: string | BuildDid8004Options, options?: BuildDid8004Options): string;
/**
 * Parse a did:8004 identifier.
 *
 * Accepts encoded or decoded strings and supports identifiers with or without
 * an intermediate namespace (e.g. did:8004:11155111:724).
 */
export declare function parseDid8004(raw: string | undefined | null): ParsedDid8004;
export declare function resolveDid8004(did: string): any;
//# sourceMappingURL=did8004.d.ts.map