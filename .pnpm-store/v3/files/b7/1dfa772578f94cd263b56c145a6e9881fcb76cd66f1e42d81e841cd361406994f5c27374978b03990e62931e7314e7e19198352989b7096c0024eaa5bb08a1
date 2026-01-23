import { decodeJWT } from 'did-jwt';

/**
 * [draft] An implementation of a StatusMethod that can aggregate multiple other methods.
 * It calls the appropriate method based on the `credentialStatus.type` specified in the credential.
 *
 * @alpha This API is still being developed and may be updated. Please follow progress or suggest improvements at
 *   [https://github.com/uport-project/credential-status]
 */

class Status {
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
  constructor(registry = {}) {
    this.registry = void 0;
    this.registry = registry;
  }

  checkStatus(credential, didDoc) {
    try {
      const _this = this;

      let statusEntry = undefined;

      if (typeof credential === 'string') {
        try {
          const decoded = decodeJWT(credential);
          statusEntry = decoded?.payload?.vc?.credentialStatus || // JWT Verifiable Credential payload
          decoded?.payload?.vp?.credentialStatus || // JWT Verifiable Presentation payload
          decoded?.payload?.credentialStatus; // legacy JWT payload
        } catch (e1) {
          // not a JWT credential or presentation
          try {
            const decoded = JSON.parse(credential);
            statusEntry = decoded?.credentialStatus;
          } catch (e2) {// not a JSON either.
          }
        }
      } else {
        statusEntry = credential.credentialStatus;
      }

      if (!statusEntry) {
        return Promise.resolve({
          revoked: false,
          message: 'credentialStatus property was not set on the original credential'
        });
      } else if (typeof statusEntry !== 'object' || !statusEntry?.type) {
        throw new Error('bad_request: credentialStatus entry is not formatted correctly. Validity can not be determined.');
      }

      const method = _this.registry[statusEntry.type];

      if (!method) {
        throw new Error(`unknown_method: credentialStatus method ${statusEntry.type} unknown. Validity can not be determined.`);
      } else {
        return Promise.resolve(method(credential, didDoc));
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

}

export { Status };
//# sourceMappingURL=index.module.js.map
