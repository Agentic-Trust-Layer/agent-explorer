var didJwt = require('did-jwt');

const JWT_ALG = 'ES256K';
const JWT_FORMAT = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
const DEFAULT_CONTEXT = 'https://www.w3.org/2018/credentials/v1';
const DEFAULT_VC_TYPE = 'VerifiableCredential';
const DEFAULT_VP_TYPE = 'VerifiablePresentation';
/**
 * The `JwtProof2020` is a synthetic proof type, usable for differentiating credentials by proof type when representing
 * JWT credentials as W3C VC JSON. It is not a registered W3C VC Data Model algorithm and should not be treated as
 * such.
 *
 * This proof type is only intended as a convenience and does not actually prove the validity of a VC/VP in JSON
 * representation. The actual verifiable credential or presentation is represented in the `jwt` property.
 */
const DEFAULT_JWT_PROOF_TYPE = 'JwtProof2020';

/**
 * Additional W3C VC fields:
 * These are defined as optional top-level properties in the W3C spec but are not mapped to top-level JWT names,
 * so they should be moved inside the "vc" object when transforming to a JWT.
 * Conversely, they should be moved out of the "vc" object when transforming from a JWT to W3C JSON.
 */
const additionalPropNames = ['evidence', 'termsOfUse', 'refreshService', 'credentialSchema', 'credentialStatus'];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asArray(arg) {
  return Array.isArray(arg) ? arg : [arg];
}
function deepCopy(source) {
  return Array.isArray(source) ? source.map(item => deepCopy(item)) : source instanceof Date ? new Date(source.getTime()) : source && typeof source === 'object' ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
    Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop));
    o[prop] = deepCopy(source[prop]);
    return o;
  }, Object.create(Object.getPrototypeOf(source))) : source;
}
function notEmpty(value) {
  return value !== null && value !== undefined;
}
function cleanUndefined(input) {
  if (typeof input !== 'object' || input === null) {
    return input;
  }
  const obj = {
    ...input
  };
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  return obj;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isLegacyAttestationFormat(payload) {
  // payload is an object and has all the required fields of old attestation format
  return typeof payload === 'object' && payload.sub && payload.iss && payload.claim && payload.iat;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function attestationToVcFormat(payload) {
  const {
    iat,
    nbf,
    claim,
    vc,
    ...rest
  } = payload;
  const result = {
    ...rest,
    nbf: nbf ? nbf : iat,
    vc: {
      '@context': [DEFAULT_CONTEXT],
      type: [DEFAULT_VC_TYPE],
      credentialSubject: claim
    }
  };
  if (vc) payload.issVc = vc;
  return result;
}
function normalizeJwtCredentialPayload(input, removeOriginalFields = true) {
  let result = deepCopy(input);
  if (isLegacyAttestationFormat(input)) {
    result = attestationToVcFormat(input);
  }
  // FIXME: handle case when credentialSubject(s) are not object types
  result.credentialSubject = {
    ...input.credentialSubject,
    ...input.vc?.credentialSubject
  };
  if (input.sub && !input.credentialSubject?.id && result.credentialSubject) {
    result.credentialSubject.id = input.sub;
    if (removeOriginalFields) {
      delete result.sub;
    }
  }
  if (removeOriginalFields) {
    delete result.vc?.credentialSubject;
  }
  if (typeof input.issuer === 'undefined' || typeof input.issuer === 'object') {
    result.issuer = cleanUndefined({
      id: input.iss,
      ...input.issuer
    });
    if (removeOriginalFields && !input.issuer?.id) {
      delete result.iss;
    }
  }
  if (!input.id && input.jti) {
    result.id = result.id || result.jti;
    if (removeOriginalFields) {
      delete result.jti;
    }
  }
  const types = [...asArray(result.type), ...asArray(result.vc?.type)].filter(notEmpty);
  result.type = [...new Set(types)];
  if (removeOriginalFields) {
    delete result.vc?.type;
  }
  for (const prop of additionalPropNames) {
    if (input.vc && input.vc[prop]) {
      if (!result[prop]) {
        result[prop] = input.vc[prop];
      }
      if (removeOriginalFields) {
        delete result.vc[prop];
      }
    }
  }
  const contextArray = [...asArray(input.context), ...asArray(input['@context']), ...asArray(input.vc?.['@context'])].filter(notEmpty);
  result['@context'] = [...new Set(contextArray)];
  if (removeOriginalFields) {
    delete result.context;
    delete result.vc?.['@context'];
  }
  if (!input.issuanceDate && (input.iat || input.nbf)) {
    result.issuanceDate = new Date((input.nbf || input.iat) * 1000).toISOString();
    if (removeOriginalFields) {
      if (input.nbf) {
        delete result.nbf;
      } else {
        delete result.iat;
      }
    }
  }
  if (!input.expirationDate && input.exp) {
    result.expirationDate = new Date(input.exp * 1000).toISOString();
    if (removeOriginalFields) {
      delete result.exp;
    }
  }
  if (removeOriginalFields) {
    if (result.vc && Object.keys(result.vc).length === 0) {
      delete result.vc;
    }
  }
  // FIXME: interpret `aud` property as `verifier`
  return result;
}
function normalizeJwtCredential(input, removeOriginalFields = true) {
  let decoded;
  try {
    decoded = didJwt.decodeJWT(input);
  } catch {
    throw new TypeError('unknown credential format');
  }
  return {
    ...normalizeJwtCredentialPayload(decoded.payload, removeOriginalFields),
    proof: {
      type: DEFAULT_JWT_PROOF_TYPE,
      jwt: input
    }
  };
}
/**
 * Normalizes a credential payload into an unambiguous W3C credential data type In case of conflict, existing W3C
 * Credential specific properties take precedence, except for arrays and object types which get merged.
 *
 * @param input - either a JWT or JWT payload, or a VerifiableCredential
 * @param removeOriginalFields - if true, removes all fields that were transformed according to the W3C mapping
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#jwt-encoding | VC JWT encoding }
 */
function normalizeCredential(input, removeOriginalFields = true) {
  if (typeof input === 'string') {
    if (JWT_FORMAT.test(input)) {
      return normalizeJwtCredential(input, removeOriginalFields);
    } else {
      let parsed;
      try {
        parsed = JSON.parse(input);
      } catch {
        throw new TypeError('unknown credential format');
      }
      return normalizeCredential(parsed, removeOriginalFields);
    }
  } else if (input.proof?.jwt) {
    // TODO: test that it correctly propagates app specific proof properties
    return deepCopy({
      ...normalizeJwtCredential(input.proof.jwt, removeOriginalFields),
      proof: input.proof
    });
  } else {
    // TODO: test that it accepts JWT payload, CredentialPayload, VerifiableCredential
    // TODO: test that it correctly propagates proof, if any
    return {
      proof: {},
      ...normalizeJwtCredentialPayload(input, removeOriginalFields)
    };
  }
}
/**
 * Transforms a W3C Credential payload into a JWT compatible encoding.
 * The method accepts app specific fields and in case of collision, existing JWT properties will take precedence.
 * Also, `nbf`, `exp` and `jti` properties can be explicitly set to `undefined` and they will be kept intact.
 * @param input - either a JWT payload or a CredentialPayloadInput
 * @param removeOriginalFields - if true, removes original W3C fields from the resulting object
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#jwt-encoding | VC JWT encoding }
 */
function transformCredentialInput(input, removeOriginalFields = true) {
  if (Array.isArray(input.credentialSubject)) throw Error('credentialSubject of type array not supported');
  const result = deepCopy({
    vc: {
      ...input.vc
    },
    ...input
  });
  result.vc = result.vc;
  const credentialSubject = {
    ...input.credentialSubject,
    ...input.vc?.credentialSubject
  };
  if (!input.sub) {
    result.sub = input.credentialSubject?.id;
    if (removeOriginalFields) {
      delete credentialSubject.id;
    }
  }
  const contextEntries = [...asArray(input.context), ...asArray(input['@context']), ...asArray(input.vc?.['@context'])].filter(notEmpty);
  result.vc['@context'] = [...new Set(contextEntries)];
  if (removeOriginalFields) {
    delete result.context;
    delete result['@context'];
  }
  const types = [...asArray(input.type), ...asArray(input.vc?.type)].filter(notEmpty);
  result.vc.type = [...new Set(types)];
  if (removeOriginalFields) {
    delete result.type;
  }
  if (input.id && Object.getOwnPropertyNames(input).indexOf('jti') === -1) {
    result.jti = input.id;
    if (removeOriginalFields) {
      delete result.id;
    }
  }
  if (input.issuanceDate && Object.getOwnPropertyNames(input).indexOf('nbf') === -1) {
    const converted = Date.parse(input.issuanceDate);
    if (!isNaN(converted)) {
      result.nbf = Math.floor(converted / 1000);
      if (removeOriginalFields) {
        delete result.issuanceDate;
      }
    }
  }
  if (input.expirationDate && Object.getOwnPropertyNames(input).indexOf('exp') === -1) {
    const converted = Date.parse(input.expirationDate);
    if (!isNaN(converted)) {
      result.exp = Math.floor(converted / 1000);
      if (removeOriginalFields) {
        delete result.expirationDate;
      }
    }
  }
  if (input.issuer && Object.getOwnPropertyNames(input).indexOf('iss') === -1) {
    if (typeof input.issuer === 'object') {
      result.iss = input.issuer?.id;
      if (removeOriginalFields) {
        delete result.issuer.id;
        if (Object.keys(result.issuer).length === 0) {
          delete result.issuer;
        }
      }
    } else if (typeof input.issuer === 'string') {
      result.iss = input.iss || '' + input.issuer;
      if (removeOriginalFields) {
        delete result.issuer;
      }
    } else ;
  }
  result.vc.credentialSubject = credentialSubject;
  if (removeOriginalFields) {
    delete result.credentialSubject;
  }
  for (const prop of additionalPropNames) {
    if (input[prop]) {
      if (!result.vc[prop]) {
        result.vc[prop] = input[prop];
      }
      if (removeOriginalFields) {
        delete result[prop];
      }
    }
  }
  return result;
}
function normalizeJwtPresentationPayload(input, removeOriginalFields = true) {
  const result = deepCopy(input);
  result.verifiableCredential = [...asArray(input.verifiableCredential), ...asArray(input.vp?.verifiableCredential)].filter(notEmpty);
  result.verifiableCredential = result.verifiableCredential.map(cred => {
    return normalizeCredential(cred, removeOriginalFields);
  });
  if (removeOriginalFields) {
    delete result.vp?.verifiableCredential;
  }
  if (input.iss && !input.holder) {
    result.holder = input.iss;
    if (removeOriginalFields) {
      delete result.iss;
    }
  }
  if (input.aud) {
    result.verifier = [...asArray(input.verifier), ...asArray(input.aud)].filter(notEmpty);
    result.verifier = [...new Set(result.verifier)];
    if (removeOriginalFields) {
      delete result.aud;
    }
  }
  if (input.jti && Object.getOwnPropertyNames(input).indexOf('id') === -1) {
    result.id = input.id || input.jti;
    if (removeOriginalFields) {
      delete result.jti;
    }
  }
  const types = [...asArray(input.type), ...asArray(input.vp?.type)].filter(notEmpty);
  result.type = [...new Set(types)];
  if (removeOriginalFields) {
    delete result.vp?.type;
  }
  const contexts = [...asArray(input.context), ...asArray(input['@context']), ...asArray(input.vp?.['@context'])].filter(notEmpty);
  result['@context'] = [...new Set(contexts)];
  if (removeOriginalFields) {
    delete result.context;
    delete result.vp?.['@context'];
  }
  if (!input.issuanceDate && (input.iat || input.nbf)) {
    result.issuanceDate = new Date((input.nbf || input.iat) * 1000).toISOString();
    if (removeOriginalFields) {
      if (input.nbf) {
        delete result.nbf;
      } else {
        delete result.iat;
      }
    }
  }
  if (!input.expirationDate && input.exp) {
    result.expirationDate = new Date(input.exp * 1000).toISOString();
    if (removeOriginalFields) {
      delete result.exp;
    }
  }
  if (result.vp && Object.keys(result.vp).length === 0) {
    if (removeOriginalFields) {
      delete result.vp;
    }
  }
  return result;
}
function normalizeJwtPresentation(input, removeOriginalFields = true) {
  let decoded;
  try {
    decoded = didJwt.decodeJWT(input);
  } catch {
    throw new TypeError('unknown presentation format');
  }
  return {
    ...normalizeJwtPresentationPayload(decoded.payload, removeOriginalFields),
    proof: {
      type: DEFAULT_JWT_PROOF_TYPE,
      jwt: input
    }
  };
}
/**
 * Normalizes a presentation payload into an unambiguous W3C Presentation data type.
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#jwt-encoding | VP JWT encoding }
 *
 * @param input - either a JWT or JWT payload, or a VerifiablePresentation
 * @param removeOriginalFields - if true, removes all fields that were transformed according to the W3C mapping
 */
function normalizePresentation(input, removeOriginalFields = true) {
  if (typeof input === 'string') {
    if (JWT_FORMAT.test(input)) {
      return normalizeJwtPresentation(input, removeOriginalFields);
    } else {
      let parsed;
      try {
        parsed = JSON.parse(input);
      } catch {
        throw new TypeError('unknown presentation format');
      }
      return normalizePresentation(parsed, removeOriginalFields);
    }
  } else if (input.proof?.jwt) {
    // TODO: test that it correctly propagates app specific proof properties
    return {
      ...normalizeJwtPresentation(input.proof.jwt, removeOriginalFields),
      proof: input.proof
    };
  } else {
    // TODO: test that it accepts JWT payload, PresentationPayload, VerifiablePresentation
    // TODO: test that it correctly propagates proof, if any
    return {
      proof: {},
      ...normalizeJwtPresentationPayload(input, removeOriginalFields)
    };
  }
}
/**
 * Transforms a W3C Presentation payload into a JWT compatible encoding.
 * The method accepts app specific fields and in case of collision, existing JWT properties will take precedence.
 * Also, `nbf`, `exp` and `jti` properties can be explicitly set to `undefined` and they will be kept intact.
 * @param input - either a JWT payload or a CredentialPayloadInput
 * @param removeOriginalFields - when true, removes the original W3C fields from the resulting object
 *
 * @see {@link https://www.w3.org/TR/vc-data-model/#jwt-encoding | VP JWT encoding }
 */
function transformPresentationInput(input, removeOriginalFields = true) {
  const result = deepCopy({
    vp: {
      ...input.vp
    },
    ...input
  });
  result.vp = result.vp;
  const contextEntries = [...asArray(input.context), ...asArray(input['@context']), ...asArray(input.vp?.['@context'])].filter(notEmpty);
  result.vp['@context'] = [...new Set(contextEntries)];
  if (removeOriginalFields) {
    delete result.context;
    delete result['@context'];
  }
  const types = [...asArray(input.type), ...asArray(input.vp?.type)].filter(notEmpty);
  result.vp.type = [...new Set(types)];
  if (removeOriginalFields) {
    delete result.type;
  }
  if (input.id && Object.getOwnPropertyNames(input).indexOf('jti') === -1) {
    result.jti = input.id;
    if (removeOriginalFields) {
      delete result.id;
    }
  }
  if (input.issuanceDate && Object.getOwnPropertyNames(input).indexOf('nbf') === -1) {
    const converted = Date.parse(input.issuanceDate);
    if (!isNaN(converted)) {
      result.nbf = Math.floor(converted / 1000);
      if (removeOriginalFields) {
        delete result.issuanceDate;
      }
    }
  }
  if (input.expirationDate && Object.getOwnPropertyNames(input).indexOf('exp') === -1) {
    const converted = Date.parse(input.expirationDate);
    if (!isNaN(converted)) {
      result.exp = Math.floor(converted / 1000);
      if (removeOriginalFields) {
        delete result.expirationDate;
      }
    }
  }
  if (result.verifiableCredential || result.vp?.verifiableCredential) {
    result.vp.verifiableCredential = [...asArray(result.verifiableCredential), ...asArray(result.vp?.verifiableCredential)].filter(notEmpty).map(credential => {
      if (typeof credential === 'object' && credential.proof?.jwt) {
        return credential.proof.jwt;
      } else {
        return credential;
      }
    });
  }
  if (removeOriginalFields) {
    delete result.verifiableCredential;
  }
  if (input.holder && Object.getOwnPropertyNames(input).indexOf('iss') === -1) {
    if (typeof input.holder === 'string') {
      result.iss = input.holder;
      if (removeOriginalFields) {
        delete result.holder;
      }
    }
  }
  if (input.verifier) {
    const audience = [...asArray(input.verifier), ...asArray(input.aud)].filter(notEmpty);
    result.aud = [...new Set(audience)];
    if (removeOriginalFields) {
      delete result.verifier;
    }
  }
  return result;
}

/**
 * Error prefixes used for known verification failure cases related to the
 * {@link https://www.w3.org/TR/vc-data-model/ | Verifiable Credential data model }
 */
const VC_ERROR = {
  /**
   * Thrown when the credential or presentation being verified does not conform to the data model defined by
   * {@link https://www.w3.org/TR/vc-data-model/ | the spec}
   */
  SCHEMA_ERROR: 'schema_error',
  /**
   * Thrown when the input is not a JWT string
   */
  FORMAT_ERROR: 'format_error',
  /**
   * Thrown when verifying a presentation where `challenge` and/or `domain` don't match the expected values.
   */
  AUTH_ERROR: 'auth_error'
};
/**
 * Known validation or verification error prefixes.
 */
const VC_JWT_ERROR = {
  ...VC_ERROR,
  ...didJwt.JWT_ERROR
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDateObject(input) {
  return input && !isNaN(input) && Object.prototype.toString.call(input) === '[object Date]';
}
function validateJwtFormat(value) {
  if (typeof value === 'string' && !value.match(JWT_FORMAT)) {
    throw new TypeError(`${VC_ERROR.FORMAT_ERROR}: "${value}" is not a valid JWT format`);
  }
}
// The main scenario we want to guard against is having a timestamp in milliseconds
// instead of seconds (ex: from new Date().getTime()).
// We will check the number of digits and assume that any number with 12 or more
// digits is a millisecond timestamp.
// 10 digits max is 9999999999 -> 11/20/2286 @ 5:46pm (UTC)
// 11 digits max is 99999999999 -> 11/16/5138 @ 9:46am (UTC)
// 12 digits max is 999999999999 -> 09/27/33658 @ 1:46am (UTC)
function validateTimestamp(value) {
  if (typeof value === 'number') {
    if (!(Number.isInteger(value) && value < 100000000000)) {
      throw new TypeError(`${VC_ERROR.SCHEMA_ERROR}: "${value}" is not a unix timestamp in seconds`);
    }
  } else if (typeof value === 'string') {
    validateTimestamp(Math.floor(new Date(value).valueOf() / 1000));
  } else if (!isDateObject(value)) {
    throw new TypeError(`${VC_ERROR.SCHEMA_ERROR}: "${value}" is not a valid time`);
  }
}
function validateContext(value) {
  const input = asArray(value);
  if (input.length < 1 || input.indexOf(DEFAULT_CONTEXT) === -1) {
    throw new TypeError(`${VC_ERROR.SCHEMA_ERROR}: @context is missing default context "${DEFAULT_CONTEXT}"`);
  }
}
function validateVcType(value) {
  const input = asArray(value);
  if (input.length < 1 || input.indexOf(DEFAULT_VC_TYPE) === -1) {
    throw new TypeError(`${VC_ERROR.SCHEMA_ERROR}: type is missing default "${DEFAULT_VC_TYPE}"`);
  }
}
function validateVpType(value) {
  const input = asArray(value);
  if (input.length < 1 || input.indexOf(DEFAULT_VP_TYPE) === -1) {
    throw new TypeError(`${VC_ERROR.SCHEMA_ERROR}: type is missing default "${DEFAULT_VP_TYPE}"`);
  }
}
function validateCredentialSubject(value) {
  if (Object.keys(value).length === 0) {
    throw new TypeError(`${VC_ERROR.SCHEMA_ERROR}: credentialSubject must not be empty`);
  }
}

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
const verifyPresentation = function (presentation, resolver, options = {}) {
  try {
    const nbf = options?.policies?.issuanceDate === false ? false : undefined;
    const exp = options?.policies?.expirationDate === false ? false : undefined;
    options = {
      audience: options.domain,
      ...options,
      policies: {
        ...options?.policies,
        nbf,
        exp,
        iat: nbf
      }
    };
    return Promise.resolve(didJwt.verifyJWT(presentation, {
      resolver,
      ...options
    })).then(function (verified) {
      verifyPresentationPayloadOptions(verified.payload, options);
      verified.verifiablePresentation = normalizePresentation(verified.jwt, options?.removeOriginalFields);
      if (options?.policies?.format !== false) {
        validatePresentationPayload(verified.verifiablePresentation);
      }
      return verified;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
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
const verifyCredential = function (vc, resolver, options = {}) {
  try {
    const nbf = options?.policies?.issuanceDate === false ? false : undefined;
    const exp = options?.policies?.expirationDate === false ? false : undefined;
    options = {
      ...options,
      policies: {
        ...options?.policies,
        nbf,
        exp,
        iat: nbf
      }
    };
    return Promise.resolve(didJwt.verifyJWT(vc, {
      resolver,
      ...options
    })).then(function (verified) {
      verified.verifiableCredential = normalizeCredential(verified.jwt, options?.removeOriginalFields);
      if (options?.policies?.format !== false) {
        validateCredentialPayload(verified.verifiableCredential);
      }
      return verified;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
/**
 * Verifies that the given JwtPresentationPayload contains the appropriate options from VerifyPresentationOptions
 *
 * @param payload - the JwtPresentationPayload to verify against
 * @param options - the VerifyPresentationOptions that contain the optional values to verify.
 * @throws {Error} If VerifyPresentationOptions are not satisfied
 */
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
const createVerifiablePresentationJwt = function (payload, holder, options = {}) {
  try {
    const parsedPayload = {
      iat: undefined,
      ...transformPresentationInput(payload, options?.removeOriginalFields)
    };
    // add challenge to nonce
    if (options.challenge && Object.getOwnPropertyNames(parsedPayload).indexOf('nonce') === -1) {
      parsedPayload.nonce = options.challenge;
    }
    // add domain to audience.
    if (options.domain) {
      const audience = [...asArray(options.domain), ...asArray(parsedPayload.aud)].filter(notEmpty);
      parsedPayload.aud = [...new Set(audience)];
    }
    validateJwtPresentationPayload(parsedPayload);
    return Promise.resolve(didJwt.createJWT(parsedPayload, {
      ...options,
      issuer: holder.did || parsedPayload.iss || '',
      signer: holder.signer
    }, {
      ...options.header,
      alg: holder.alg || options.header?.alg || JWT_ALG
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
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
const createVerifiableCredentialJwt = function (payload, issuer, options = {}) {
  try {
    const parsedPayload = {
      iat: undefined,
      ...transformCredentialInput(payload, options.removeOriginalFields)
    };
    validateJwtCredentialPayload(parsedPayload);
    if (!Array.isArray(issuer)) {
      return Promise.resolve(didJwt.createJWT(parsedPayload, {
        ...options,
        issuer: issuer.did || parsedPayload.iss || '',
        signer: issuer.signer
      }, {
        ...options.header,
        alg: issuer.alg || options.header?.alg || JWT_ALG
      }));
    } else {
      const did = issuer[0].did;
      const issuers = [];
      for (const iss of issuer) {
        if (iss.did !== did) {
          throw new Error('All issuers must be the same did to comply with the Verifiable Conditions spec');
        }
        issuers.push({
          issuer: iss.did || parsedPayload.iss || '',
          signer: iss.signer,
          alg: iss.alg || options.header?.alg || JWT_ALG
        });
      }
      return Promise.resolve(didJwt.createMultisignatureJWT(parsedPayload, {
        ...options
      }, issuers));
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
function validateJwtCredentialPayload(payload) {
  validateContext(payload.vc['@context']);
  validateVcType(payload.vc.type);
  validateCredentialSubject(payload.vc.credentialSubject);
  if (payload.nbf) validateTimestamp(payload.nbf);
  if (payload.exp) validateTimestamp(payload.exp);
}
function validateCredentialPayload(payload) {
  validateContext(payload['@context']);
  validateVcType(payload.type);
  validateCredentialSubject(payload.credentialSubject);
  if (payload.issuanceDate) validateTimestamp(payload.issuanceDate);
  if (payload.expirationDate) validateTimestamp(payload.expirationDate);
}
function validateJwtPresentationPayload(payload) {
  validateContext(payload.vp['@context']);
  validateVpType(payload.vp.type);
  // empty credential array is allowed
  if (payload.vp.verifiableCredential && payload.vp.verifiableCredential.length >= 1) {
    for (const vc of asArray(payload.vp.verifiableCredential)) {
      if (typeof vc === 'string') {
        validateJwtFormat(vc);
      } else {
        validateCredentialPayload(vc);
      }
    }
  }
  if (payload.exp) validateTimestamp(payload.exp);
}
function validatePresentationPayload(payload) {
  validateContext(payload['@context']);
  validateVpType(payload.type);
  // empty credential array is allowed
  if (payload.verifiableCredential && payload.verifiableCredential.length >= 1) {
    for (const vc of payload.verifiableCredential) {
      if (typeof vc === 'string') {
        validateJwtFormat(vc);
      } else {
        validateCredentialPayload(vc);
      }
    }
  }
  if (payload.expirationDate) validateTimestamp(payload.expirationDate);
}
function verifyPresentationPayloadOptions(payload, options) {
  if (options.challenge && options.challenge !== payload.nonce) {
    throw new Error(`${VC_ERROR.AUTH_ERROR}: Presentation does not contain the mandatory challenge (JWT: nonce) for : ${options.challenge}`);
  }
  if (options.domain) {
    // aud might be an array
    let matchedAudience;
    if (payload.aud) {
      const audArray = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
      matchedAudience = audArray.find(item => options.domain === item);
    }
    if (typeof matchedAudience === 'undefined') {
      throw new Error(`${VC_ERROR.AUTH_ERROR}: Presentation does not contain the mandatory domain (JWT: aud) for : ${options.domain}`);
    }
  }
}

exports.VC_ERROR = VC_ERROR;
exports.VC_JWT_ERROR = VC_JWT_ERROR;
exports.createVerifiableCredentialJwt = createVerifiableCredentialJwt;
exports.createVerifiablePresentationJwt = createVerifiablePresentationJwt;
exports.normalizeCredential = normalizeCredential;
exports.normalizePresentation = normalizePresentation;
exports.transformCredentialInput = transformCredentialInput;
exports.transformPresentationInput = transformPresentationInput;
exports.validateCredentialPayload = validateCredentialPayload;
exports.validateJwtCredentialPayload = validateJwtCredentialPayload;
exports.validateJwtPresentationPayload = validateJwtPresentationPayload;
exports.validatePresentationPayload = validatePresentationPayload;
exports.verifyCredential = verifyCredential;
exports.verifyPresentation = verifyPresentation;
exports.verifyPresentationPayloadOptions = verifyPresentationPayloadOptions;
//# sourceMappingURL=index.cjs.map
