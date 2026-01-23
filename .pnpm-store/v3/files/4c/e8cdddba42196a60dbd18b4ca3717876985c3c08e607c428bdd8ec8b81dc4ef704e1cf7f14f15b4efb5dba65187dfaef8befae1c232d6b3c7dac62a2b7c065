import type { Resolvable } from 'did-resolver';
import type { CreateCredentialOptions, CreatePresentationOptions, CredentialPayload, Issuer, JWT, JwtCredentialPayload, JwtPresentationPayload, PresentationPayload, Verifiable, VerifiableCredential, VerifiablePresentation, VerifiedCredential, VerifiedPresentation, VerifyCredentialOptions, VerifyCredentialPolicies, VerifyPresentationOptions, W3CCredential, W3CPresentation } from './types.js';
import { normalizeCredential, normalizePresentation, transformCredentialInput, transformPresentationInput } from './converters.js';
export { VC_ERROR, VC_JWT_ERROR } from './validators.js';
export type { Issuer, CredentialPayload, PresentationPayload, JwtCredentialPayload, JwtPresentationPayload, VerifiableCredential, VerifiablePresentation, VerifiedCredential, VerifiedPresentation, Verifiable, W3CCredential, W3CPresentation, CreateCredentialOptions, CreatePresentationOptions, VerifyCredentialOptions, VerifyCredentialPolicies, VerifyPresentationOptions, };
export { transformCredentialInput, transformPresentationInput, normalizeCredential, normalizePresentation };
/**
 * Creates a VerifiableCredential given a `CredentialPayload` or `JwtCredentialPayload` and an `Issuer`.
 *
 * This method transforms the payload into the [JWT encoding](https://www.w3.org/TR/vc-data-model/#jwt-encoding)
 * described in the [W3C VC spec](https://www.w3.org/TR/vc-data-model) and then validated to conform to the minimum
 * spec
 * required spec.
 *
 * The `issuer` is then used to assign an algorithm, override the `iss` field of the payload and then sign the JWT.
 *
 * @param payload - `CredentialPayload` or `JwtCredentialPayload`
 * @param issuer - `Issuer` the DID, signer and algorithm that will sign the token
 * @param options - Use these options to tweak the creation of the JWT Credential. These are forwarded to did-jwt.
 * @return a `Promise` that resolves to the JWT encoded verifiable credential or rejects with `TypeError` if the
 * `payload` is not W3C compliant
 */
export declare function createVerifiableCredentialJwt(payload: JwtCredentialPayload | CredentialPayload, issuer: Issuer | Issuer[], options?: CreateCredentialOptions): Promise<JWT>;
/**
 * Creates a VerifiablePresentation JWT given a `PresentationPayload` or `JwtPresentationPayload` and an `Issuer`.
 *
 * This method transforms the payload into the [JWT encoding](https://www.w3.org/TR/vc-data-model/#jwt-encoding)
 * described in the [W3C VC spec](https://www.w3.org/TR/vc-data-model) and then validated to conform to the minimum
 * spec
 * required spec.
 *
 * The `holder` is then used to assign an algorithm, override the `iss` field of the payload and then sign the JWT.
 *
 * @param payload - `PresentationPayload` or `JwtPresentationPayload`
 * @param holder - `Issuer` of the Presentation JWT (holder of the VC), signer and algorithm that will sign the token
 * @param options - `CreatePresentationOptions` allows to pass additional values to the resulting JWT payload. These
 *   options are forwarded to did-jwt.
 * @return a `Promise` that resolves to the JWT encoded verifiable presentation or rejects with `TypeError` if the
 * `payload` is not W3C compliant
 */
export declare function createVerifiablePresentationJwt(payload: JwtPresentationPayload | PresentationPayload, holder: Issuer, options?: CreatePresentationOptions): Promise<JWT>;
export declare function validateJwtCredentialPayload(payload: JwtCredentialPayload): void;
export declare function validateCredentialPayload(payload: CredentialPayload): void;
export declare function validateJwtPresentationPayload(payload: JwtPresentationPayload): void;
export declare function validatePresentationPayload(payload: PresentationPayload): void;
/**
 * Verifies and validates a VerifiableCredential that is encoded as a JWT according to the W3C spec.
 *
 * @return a `Promise` that resolves to a `VerifiedCredential` or rejects with `TypeError` if the input is not
 * W3C compliant
 * @param vc - the credential to be verified. Currently only the JWT encoding is supported by this library
 * @param resolver - a configured `Resolver` (or an implementation of `Resolvable`) that can provide the DID document
 *   of the JWT issuer
 * @param options - optional tweaks to the verification process. These are forwarded to did-jwt.
 */
export declare function verifyCredential(vc: JWT, resolver: Resolvable, options?: VerifyCredentialOptions): Promise<VerifiedCredential>;
/**
 * Verifies that the given JwtPresentationPayload contains the appropriate options from VerifyPresentationOptions
 *
 * @param payload - the JwtPresentationPayload to verify against
 * @param options - the VerifyPresentationOptions that contain the optional values to verify.
 * @throws {Error} If VerifyPresentationOptions are not satisfied
 */
export declare function verifyPresentationPayloadOptions(payload: JwtPresentationPayload, options: VerifyPresentationOptions): void;
/**
 * Verifies and validates a VerifiablePresentation that is encoded as a JWT according to the W3C spec.
 *
 * @return a `Promise` that resolves to a `VerifiedPresentation` or rejects with `TypeError` if the input is
 * not W3C compliant or the VerifyPresentationOptions are not satisfied.
 * @param presentation - the presentation to be verified. Currently only the JWT encoding is supported by this library
 * @param resolver - a configured `Resolver` or an implementation of `Resolvable` that can provide the DID document of
 *   the JWT issuer (presentation holder)
 * @param options - optional verification options that need to be satisfied. These are also forwarded to did-jwt.
 */
export declare function verifyPresentation(presentation: JWT, resolver: Resolvable, options?: VerifyPresentationOptions): Promise<VerifiedPresentation>;
//# sourceMappingURL=index.d.ts.map