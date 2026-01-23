/**
 * Session Package Utilities
 *
 * Handles loading and validation of session packages for agent delegation
 * NOTE: These functions should only be called server-side (Next.js API routes, server components)
 */
import { type Chain, type PublicClient } from 'viem';
import { type Account } from 'viem/accounts';
import type { SessionPackage } from '../../shared/sessionPackage';
type Hex = `0x${string}`;
export type DelegationSetup = {
    agentId: number;
    chainId: number;
    chain: Chain;
    rpcUrl: string;
    bundlerUrl: string;
    entryPoint: Hex;
    aa: Hex;
    sessionAA?: Hex;
    selector: Hex;
    sessionKey: SessionPackage['sessionKey'];
    signedDelegation: SessionPackage['signedDelegation'];
    delegationRedeemData?: Hex;
    publicClient: PublicClient;
};
/**
 * Build an in-memory SessionPackage JSON object from the parameters produced by
 * the session creation flow (AA, session AA, session key, delegation, etc.).
 *
 * This is the canonical shape used by auth/session and downstream helpers.
 */
export declare function buildSessionPackage(params: {
    agentId: number;
    chainId: number;
    aa: Hex;
    sessionAA?: Hex;
    selector: Hex;
    sessionKey: {
        privateKey: Hex;
        address: Hex;
        validAfter: number;
        validUntil: number;
    };
    entryPoint: Hex;
    bundlerUrl: string;
    signedDelegation: SessionPackage['signedDelegation'];
    delegationRedeemData?: Hex;
}): SessionPackage;
/**
 * Load session package from file
 * @param filePath - Optional path to session package file (defaults to sessionPackage.json.secret in same directory)
 */
export declare function loadSessionPackage(filePath?: string): SessionPackage;
/**
 * Validate session package structure
 * Note: bundlerUrl and reputationRegistry can come from environment variables
 */
export declare function validateSessionPackage(pkg: SessionPackage): void;
/**
 * Build delegation setup from session package
 * Uses environment variables only (no overrides allowed)
 * Priority: env vars > session package defaults
 */
export declare function buildDelegationSetup(pkg?: SessionPackage): DelegationSetup;
export declare function buildAgentAccountFromSession(sessionPackage?: SessionPackage): Promise<Account>;
export {};
//# sourceMappingURL=sessionPackage.d.ts.map