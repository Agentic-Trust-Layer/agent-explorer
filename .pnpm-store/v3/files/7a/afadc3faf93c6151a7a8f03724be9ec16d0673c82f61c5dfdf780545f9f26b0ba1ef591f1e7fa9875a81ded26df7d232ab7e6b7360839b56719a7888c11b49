import type { VerificationMethod } from 'did-resolver';
import { EcdsaSignature, ECDSASignature } from './util.js';
export declare function toSignatureObject(signature: string, recoverable?: boolean): EcdsaSignature;
export declare function toSignatureObject2(signature: string, recoverable?: boolean): ECDSASignature;
export declare function verifyES256(data: string, signature: string, authenticators: VerificationMethod[]): VerificationMethod;
export declare function verifyES256K(data: string, signature: string, authenticators: VerificationMethod[]): VerificationMethod;
export declare function verifyRecoverableES256K(data: string, signature: string, authenticators: VerificationMethod[]): VerificationMethod;
export declare function verifyEd25519(data: string, signature: string, authenticators: VerificationMethod[]): VerificationMethod;
type Verifier = (data: string, signature: string, authenticators: VerificationMethod[]) => VerificationMethod;
declare function VerifierAlgorithm(alg: string): Verifier;
declare namespace VerifierAlgorithm {
    var toSignatureObject: typeof import("./VerifierAlgorithm.js").toSignatureObject;
}
export default VerifierAlgorithm;
//# sourceMappingURL=VerifierAlgorithm.d.ts.map