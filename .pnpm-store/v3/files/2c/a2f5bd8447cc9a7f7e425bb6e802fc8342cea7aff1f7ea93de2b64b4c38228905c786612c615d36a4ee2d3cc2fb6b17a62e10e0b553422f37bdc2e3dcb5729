import { decodeJWT } from 'did-jwt'
import { DIDDocument } from 'did-resolver'

/**
 * Represents the result of a status check.
 *
 * Implementations should populate the `revoked` boolean property, but they can return additional metadata that is
 * method specific.
 *
 * @alpha This API is still being developed and may be updated. Please follow progress or suggest improvements at
 *   [https://github.com/uport-project/credential-status]
 */
export interface CredentialStatus {
  revoked?: boolean

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

/**
 * Represents a status method entry that could be embedded in a W3C Verifiable Credential.
 * Normally, only credentials that list a status method would need to be verified by it.
 *
 * ex:
 * ```json
 * credentialStatus: {
 *   type: "EthrStatusRegistry2019",
 *   id: "rinkeby:0xregistryAddress"
 * }
 * ```
 * See https://www.w3.org/TR/vc-data-model/#status
 *
 * @alpha This API is still being developed and may be updated. Please follow progress or suggest improvements at
 *   [https://github.com/uport-project/credential-status]
 */
export interface StatusEntry {
  type: string
  id: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

/**
 * The interface expected for status resolvers.
 * `checkStatus` should be called with a raw credential and it should Promise a [[CredentialStatus]] result.
 * It is advisable that classes that implement this interface also provide a way to easily register the correct
 * Status method type.
 *
 * Example:
 * ```typescript
 *  class CredentialStatusList2017 implements StatusResolver {
 *    checkStatus: StatusMethod = async (credential: string) => {
 *      // ...your implementation here
 *    }
 *    asStatusMethod = {"CredentialStatusList2017" : this.checkStatus}
 *  }
 * ```
 *
 * @alpha This API is still being developed and may be updated. Please follow progress or suggest improvements at
 *   [https://github.com/uport-project/credential-status]
 */
export interface StatusResolver {
  checkStatus: StatusMethod
}

/**
 * The Verifiable Credential or Presentation to be verified in either JSON/JSON-LD or JWT format.
 *
 * @alpha This API is still being developed and may be updated. Please follow progress or suggest improvements at
 *   [https://github.com/uport-project/credential-status]
 */
export type CredentialJwtOrJSON = string | { credentialStatus?: StatusEntry }

/**
 * The method signature expected to be implemented by credential status resolvers.
 *
 * @param credential The credential whose status will be verified
 * @param didDoc The DID document of the issuer.
 *
 * @return a Promise resolving to a `CredentialStatus` object or rejecting with a reason.
 *
 * @alpha This API is still being developed and may be updated. Please follow progress or suggest improvements at
 *   [https://github.com/uport-project/credential-status]
 */
export type StatusMethod = (credential: CredentialJwtOrJSON, didDoc: DIDDocument) => Promise<CredentialStatus>

/**
 * [draft] An implementation of a StatusMethod that can aggregate multiple other methods.
 * It calls the appropriate method based on the `credentialStatus.type` specified in the credential.
 *
 * @alpha This API is still being developed and may be updated. Please follow progress or suggest improvements at
 *   [https://github.com/uport-project/credential-status]
 */
export class Status implements StatusResolver {
  private registry: Record<string, StatusMethod>

  /**
   * All the expected StatusMethods should be registered during construction.
   * Example:
   * ```typescript
   * const status = new Status({
   *   ...new EthrStatusRegistry(config).asStatusMethod,                       //using convenience method
   *   "CredentialStatusList2017": new CredentialStatusList2017().checkStatus, //referencing a checkStatus
   * implementation
   *   "CustomStatusChecker": customStatusCheckerMethod                        //directly referencing an independent
   * method
   * })
   * ```
   */
  constructor(registry: Record<string, StatusMethod> = {}) {
    this.registry = registry
  }

  async checkStatus(credential: CredentialJwtOrJSON, didDoc: DIDDocument): Promise<CredentialStatus> {
    let statusEntry: StatusEntry | undefined = undefined

    if (typeof credential === 'string') {
      try {
        const decoded = decodeJWT(credential)
        statusEntry =
          decoded?.payload?.vc?.credentialStatus || // JWT Verifiable Credential payload
          decoded?.payload?.vp?.credentialStatus || // JWT Verifiable Presentation payload
          decoded?.payload?.credentialStatus // legacy JWT payload
      } catch (e1: unknown) {
        // not a JWT credential or presentation
        try {
          const decoded = JSON.parse(credential)
          statusEntry = decoded?.credentialStatus
        } catch (e2: unknown) {
          // not a JSON either.
        }
      }
    } else {
      statusEntry = credential.credentialStatus
    }

    if (!statusEntry) {
      return {
        revoked: false,
        message: 'credentialStatus property was not set on the original credential',
      }
    } else if (typeof statusEntry !== 'object' || !statusEntry?.type) {
      throw new Error('bad_request: credentialStatus entry is not formatted correctly. Validity can not be determined.')
    }

    const method = this.registry[statusEntry.type]

    if (!method) {
      throw new Error(
        `unknown_method: credentialStatus method ${statusEntry.type} unknown. Validity can not be determined.`,
      )
    } else {
      return method(credential, didDoc)
    }
  }
}
