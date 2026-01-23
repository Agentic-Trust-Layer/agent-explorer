import { JwtCredentialSubject, DateType } from './types';
import { VerifiableCredential } from '.';
/**
 * Error prefixes used for known verification failure cases related to the
 * {@link https://www.w3.org/TR/vc-data-model/ | Verifiable Credential data model }
 */
export declare const VC_ERROR: {
    /**
     * Thrown when the credential or presentation being verified does not conform to the data model defined by
     * {@link https://www.w3.org/TR/vc-data-model/ | the spec}
     */
    SCHEMA_ERROR: string;
    /**
     * Thrown when the input is not a JWT string
     */
    FORMAT_ERROR: string;
    /**
     * Thrown when verifying a presentation where `challenge` and/or `domain` don't match the expected values.
     */
    AUTH_ERROR: string;
};
/**
 * Known validation or verification error prefixes.
 */
export declare const VC_JWT_ERROR: {
    INVALID_JWT: string;
    INVALID_AUDIENCE: string;
    INVALID_SIGNATURE: string;
    NO_SUITABLE_KEYS: string;
    NOT_SUPPORTED: string;
    RESOLVER_ERROR: string;
    /**
     * Thrown when the credential or presentation being verified does not conform to the data model defined by
     * {@link https://www.w3.org/TR/vc-data-model/ | the spec}
     */
    SCHEMA_ERROR: string;
    /**
     * Thrown when the input is not a JWT string
     */
    FORMAT_ERROR: string;
    /**
     * Thrown when verifying a presentation where `challenge` and/or `domain` don't match the expected values.
     */
    AUTH_ERROR: string;
};
export declare function validateJwtFormat(value: VerifiableCredential): void;
export declare function validateTimestamp(value: number | DateType): void;
export declare function validateContext(value: string | string[]): void;
export declare function validateVcType(value: string | string[]): void;
export declare function validateVpType(value: string | string[]): void;
export declare function validateCredentialSubject(value: JwtCredentialSubject): void;
//# sourceMappingURL=validators.d.ts.map