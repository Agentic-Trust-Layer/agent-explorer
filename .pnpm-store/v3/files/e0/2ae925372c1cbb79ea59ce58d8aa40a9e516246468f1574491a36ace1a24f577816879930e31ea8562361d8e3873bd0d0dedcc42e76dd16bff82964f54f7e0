/**
 * Veramo Agent integration for AgenticTrustClient
 */
import type { TAgent, IKeyManager, IDIDManager, ICredentialIssuer, ICredentialVerifier, IResolver } from '@veramo/core';
/**
 * Type definition for a Veramo agent with required capabilities
 */
export type VeramoAgent = TAgent<IKeyManager & IDIDManager & ICredentialIssuer & ICredentialVerifier & IResolver>;
/**
 * Authentication challenge structure
 */
export interface AuthChallenge {
    did: string;
    kid: string;
    algorithm: string;
    challenge: string;
    signature: string;
    ethereumAddress?: string;
}
/**
 * Verification result
 */
export interface ChallengeVerificationResult {
    valid: boolean;
    error?: string;
    clientAddress?: string;
}
/**
 * Veramo integration API
 * Provides access to the connected Veramo agent and verification methods
 */
export declare class VeramoAPI {
    private agent;
    /**
     * Connect a Veramo agent instance to the client
     */
    connect(agent: VeramoAgent): void;
    /**
     * Get the connected Veramo agent
     * Agent is always connected after client construction
     */
    getAgent(): VeramoAgent;
    /**
     * Check if an agent is connected
     */
    isConnected(): boolean;
    /**
     * Disconnect the agent
     */
    disconnect(): void;
    /**
     * Verify a signed challenge
     * Handles all Veramo agent logic internally - no Veramo exposure at app level
     *
     * @param auth - The authentication challenge with signature
     * @param expectedAudience - Expected audience (provider URL) for validation
     * @returns Verification result with client address if valid
     */
    verifyChallenge(auth: AuthChallenge, expectedAudience: string): Promise<ChallengeVerificationResult>;
}
//# sourceMappingURL=veramo.d.ts.map