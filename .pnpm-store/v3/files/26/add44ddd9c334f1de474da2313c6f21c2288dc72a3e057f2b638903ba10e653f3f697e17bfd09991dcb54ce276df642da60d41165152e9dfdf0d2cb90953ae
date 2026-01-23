/**
 * Agent Verification API
 * Provides challenge-response verification using raw signatures over canonical challenges
 */
export interface ChallengeRequest {
    /** DID of the agent to verify */
    agentDid: string;
    /** Audience (origin/app identifier) */
    audience: string;
    /** Optional nonce (will be generated if not provided) */
    nonce?: string;
}
export interface Challenge {
    /** The challenge string to sign */
    challenge: string;
    /** Nonce used in the challenge */
    nonce: string;
    /** Issued at timestamp */
    iat: number;
    /** Audience */
    aud: string;
    /** Agent DID */
    iss: string;
}
export interface SignedChallenge {
    /** Agent DID */
    did: string;
    /** Key ID used for signing */
    kid: string;
    /** Algorithm used */
    algorithm: string;
    /** The original challenge */
    challenge: string;
    /** The signature bytes */
    signature: string;
}
export interface VerificationRequest {
    /** Signed challenge from the agent */
    signedChallenge: SignedChallenge;
    /** Expected audience */
    audience: string;
    /** Optional nonce to verify against */
    nonce?: string;
}
export interface VerificationResult {
    /** Whether the verification was successful */
    valid: boolean;
    /** Agent DID that was verified */
    agentDid: string;
    /** Error message if verification failed */
    error?: string;
}
//# sourceMappingURL=verification.d.ts.map