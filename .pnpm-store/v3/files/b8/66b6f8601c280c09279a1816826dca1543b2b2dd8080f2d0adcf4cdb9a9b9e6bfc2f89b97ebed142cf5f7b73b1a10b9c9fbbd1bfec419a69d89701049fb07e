import { VerifiableCredential, JWT, JwtPresentationPayload, JwtCredentialPayload, CredentialPayload, W3CCredential, Verifiable, PresentationPayload, W3CPresentation } from './types';
export declare function asArray(arg: any | any[]): any[];
export declare function notEmpty<TValue>(value: TValue | null | undefined): value is TValue;
export declare function isLegacyAttestationFormat(payload: Record<string, any>): boolean;
export declare function attestationToVcFormat(payload: Record<string, any>): JwtCredentialPayload;
/**
 * Normalizes a credential payload into an unambiguous W3C credential data type In case of conflict, existing W3C
 * Credential specific properties take precedence, except for arrays and object types which get merged.
 *
 * @param input - either a JWT or JWT payload, or a VerifiableCredential
 * @param removeOriginalFields - if true, removes all fields that were transformed according to the W3C mapping
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#jwt-encoding | VC JWT encoding }
 */
export declare function normalizeCredential(input: Partial<VerifiableCredential> | Partial<JwtCredentialPayload>, removeOriginalFields?: boolean): Verifiable<W3CCredential>;
/**
 * type used to signal a very loose input is accepted
 */
type DeepPartial<T> = T extends Record<string, unknown> ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
/**
 * Transforms a W3C Credential payload into a JWT compatible encoding.
 * The method accepts app specific fields and in case of collision, existing JWT properties will take precedence.
 * Also, `nbf`, `exp` and `jti` properties can be explicitly set to `undefined` and they will be kept intact.
 * @param input - either a JWT payload or a CredentialPayloadInput
 * @param removeOriginalFields - if true, removes original W3C fields from the resulting object
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#jwt-encoding | VC JWT encoding }
 */
export declare function transformCredentialInput(input: Partial<CredentialPayload> | DeepPartial<JwtCredentialPayload>, removeOriginalFields?: boolean): JwtCredentialPayload;
/**
 * Normalizes a presentation payload into an unambiguous W3C Presentation data type.
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#jwt-encoding | VP JWT encoding }
 *
 * @param input - either a JWT or JWT payload, or a VerifiablePresentation
 * @param removeOriginalFields - if true, removes all fields that were transformed according to the W3C mapping
 */
export declare function normalizePresentation(input: Partial<PresentationPayload> | DeepPartial<JwtPresentationPayload> | JWT, removeOriginalFields?: boolean): Verifiable<W3CPresentation>;
/**
 * Transforms a W3C Presentation payload into a JWT compatible encoding.
 * The method accepts app specific fields and in case of collision, existing JWT properties will take precedence.
 * Also, `nbf`, `exp` and `jti` properties can be explicitly set to `undefined` and they will be kept intact.
 * @param input - either a JWT payload or a CredentialPayloadInput
 * @param removeOriginalFields - when true, removes the original W3C fields from the resulting object
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#jwt-encoding | VP JWT encoding }
 */
export declare function transformPresentationInput(input: Partial<PresentationPayload> | DeepPartial<JwtPresentationPayload>, removeOriginalFields?: boolean): JwtPresentationPayload;
export {};
//# sourceMappingURL=converters.d.ts.map