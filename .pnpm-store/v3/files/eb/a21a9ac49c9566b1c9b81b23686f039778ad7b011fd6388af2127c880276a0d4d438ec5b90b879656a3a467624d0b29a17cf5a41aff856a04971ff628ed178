(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('uint8arrays'), require('@noble/curves/ed25519'), require('multiformats'), require('multibase'), require('@noble/curves/secp256k1'), require('@noble/curves/p256'), require('@noble/hashes/sha256'), require('@noble/hashes/ripemd160'), require('@noble/hashes/sha3'), require('canonicalize'), require('did-resolver'), require('@scure/base'), require('@noble/ciphers/chacha'), require('@noble/hashes/utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'uint8arrays', '@noble/curves/ed25519', 'multiformats', 'multibase', '@noble/curves/secp256k1', '@noble/curves/p256', '@noble/hashes/sha256', '@noble/hashes/ripemd160', '@noble/hashes/sha3', 'canonicalize', 'did-resolver', '@scure/base', '@noble/ciphers/chacha', '@noble/hashes/utils'], factory) :
  (global = global || self, factory(global.didJwt = {}, global.uint8Arrays, global.ed25519, global.multiformats, global.multibase, global.secp256k1, global.p256, global.sha256$1, global.ripemd160, global.sha3, global.canonicalize, global.didResolver, global.base, global.chacha, global.utils));
}(this, (function (exports, uint8arrays, ed25519, multiformats, multibase, secp256k1, p256, sha256$1, ripemd160, sha3, canonicalizeData, didResolver, base, chacha, utils) {
  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var canonicalizeData__default = /*#__PURE__*/_interopDefaultLegacy(canonicalizeData);

  const u8a = {
    toString: uint8arrays.toString,
    fromString: uint8arrays.fromString,
    concat: uint8arrays.concat
  };
  function bytesToBase64url(b) {
    return u8a.toString(b, 'base64url');
  }
  function base64ToBytes(s) {
    const inputBase64Url = s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return u8a.fromString(inputBase64Url, 'base64url');
  }
  function base58ToBytes(s) {
    return u8a.fromString(s, 'base58btc');
  }
  function bytesToBase58(b) {
    return u8a.toString(b, 'base58btc');
  }
  const SUPPORTED_PUBLIC_KEY_TYPES = {
    ES256: ['JsonWebKey2020', 'Multikey', 'EcdsaSecp256r1VerificationKey2019'],
    ES256K: ['EcdsaSecp256k1VerificationKey2019',
    /**
     * Equivalent to EcdsaSecp256k1VerificationKey2019 when key is an ethereumAddress
     */
    'EcdsaSecp256k1RecoveryMethod2020',
    /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */
    'Secp256k1VerificationKey2018',
    /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */
    'Secp256k1SignatureVerificationKey2018',
    /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */
    'EcdsaPublicKeySecp256k1',
    /**
     *  TODO - support R1 key as well
     *   'ConditionalProof2022',
     */
    'JsonWebKey2020', 'Multikey'],
    'ES256K-R': ['EcdsaSecp256k1VerificationKey2019',
    /**
     * Equivalent to EcdsaSecp256k1VerificationKey2019 when key is an ethereumAddress
     */
    'EcdsaSecp256k1RecoveryMethod2020',
    /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */
    'Secp256k1VerificationKey2018',
    /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */
    'Secp256k1SignatureVerificationKey2018',
    /**
     * @deprecated, supported for backward compatibility. Equivalent to EcdsaSecp256k1VerificationKey2019 when key is
     *   not an ethereumAddress
     */
    'EcdsaPublicKeySecp256k1', 'ConditionalProof2022', 'JsonWebKey2020', 'Multikey'],
    Ed25519: ['ED25519SignatureVerification', 'Ed25519VerificationKey2018', 'Ed25519VerificationKey2020', 'JsonWebKey2020', 'Multikey'],
    EdDSA: ['ED25519SignatureVerification', 'Ed25519VerificationKey2018', 'Ed25519VerificationKey2020', 'JsonWebKey2020', 'Multikey']
  };
  const VM_TO_KEY_TYPE = {
    Secp256k1SignatureVerificationKey2018: 'Secp256k1',
    Secp256k1VerificationKey2018: 'Secp256k1',
    EcdsaSecp256k1VerificationKey2019: 'Secp256k1',
    EcdsaPublicKeySecp256k1: 'Secp256k1',
    EcdsaSecp256k1RecoveryMethod2020: 'Secp256k1',
    EcdsaSecp256r1VerificationKey2019: 'P-256',
    Ed25519VerificationKey2018: 'Ed25519',
    Ed25519VerificationKey2020: 'Ed25519',
    ED25519SignatureVerification: 'Ed25519',
    X25519KeyAgreementKey2019: 'X25519',
    X25519KeyAgreementKey2020: 'X25519',
    ConditionalProof2022: undefined,
    JsonWebKey2020: undefined,
    // key type must be specified in the JWK
    Multikey: undefined // key type must be extracted from the multicodec

  }; // this is from the multicodec table https://github.com/multiformats/multicodec/blob/master/table.csv

  const supportedCodecs = {
    'ed25519-pub': 0xed,
    'x25519-pub': 0xec,
    'secp256k1-pub': 0xe7,
    'bls12_381-g1-pub': 0xea,
    'bls12_381-g2-pub': 0xeb,
    'p256-pub': 0x1200
  };
  const CODEC_TO_KEY_TYPE = {
    'bls12_381-g1-pub': 'Bls12381G1',
    'bls12_381-g2-pub': 'Bls12381G2',
    'ed25519-pub': 'Ed25519',
    'p256-pub': 'P-256',
    'secp256k1-pub': 'Secp256k1',
    'x25519-pub': 'X25519'
  };
  /**
   * Extracts the raw byte representation of a public key from a VerificationMethod along with an inferred key type
   * @param pk a VerificationMethod entry from a DIDDocument
   * @return an object containing the `keyBytes` of the public key and an inferred `keyType`
   */

  function extractPublicKeyBytes(pk) {
    if (pk.publicKeyBase58) {
      return {
        keyBytes: base58ToBytes(pk.publicKeyBase58),
        keyType: VM_TO_KEY_TYPE[pk.type]
      };
    } else if (pk.publicKeyBase64) {
      return {
        keyBytes: base64ToBytes(pk.publicKeyBase64),
        keyType: VM_TO_KEY_TYPE[pk.type]
      };
    } else if (pk.publicKeyHex) {
      return {
        keyBytes: hexToBytes(pk.publicKeyHex),
        keyType: VM_TO_KEY_TYPE[pk.type]
      };
    } else if (pk.publicKeyJwk && pk.publicKeyJwk.crv === 'secp256k1' && pk.publicKeyJwk.x && pk.publicKeyJwk.y) {
      return {
        keyBytes: secp256k1.secp256k1.ProjectivePoint.fromAffine({
          x: bytesToBigInt(base64ToBytes(pk.publicKeyJwk.x)),
          y: bytesToBigInt(base64ToBytes(pk.publicKeyJwk.y))
        }).toRawBytes(false),
        keyType: 'Secp256k1'
      };
    } else if (pk.publicKeyJwk && pk.publicKeyJwk.crv === 'P-256' && pk.publicKeyJwk.x && pk.publicKeyJwk.y) {
      return {
        keyBytes: p256.p256.ProjectivePoint.fromAffine({
          x: bytesToBigInt(base64ToBytes(pk.publicKeyJwk.x)),
          y: bytesToBigInt(base64ToBytes(pk.publicKeyJwk.y))
        }).toRawBytes(false),
        keyType: 'P-256'
      };
    } else if (pk.publicKeyJwk && pk.publicKeyJwk.kty === 'OKP' && ['Ed25519', 'X25519'].includes(pk.publicKeyJwk.crv ?? '') && pk.publicKeyJwk.x) {
      return {
        keyBytes: base64ToBytes(pk.publicKeyJwk.x),
        keyType: pk.publicKeyJwk.crv
      };
    } else if (pk.publicKeyMultibase) {
      const {
        keyBytes,
        keyType
      } = multibaseToBytes(pk.publicKeyMultibase);
      return {
        keyBytes,
        keyType: keyType ?? VM_TO_KEY_TYPE[pk.type]
      };
    }

    return {
      keyBytes: new Uint8Array()
    };
  }
  /**
   * Encodes the given byte array to a multibase string (defaulting to base58btc).
   * If a codec is provided, the corresponding multicodec prefix will be added.
   *
   * @param b - the Uint8Array to be encoded
   * @param base - the base to use for encoding (defaults to base58btc)
   * @param codec - the codec to use for encoding (defaults to no codec)
   *
   * @returns the multibase encoded string
   *
   * @public
   */

  function bytesToMultibase(b, base = 'base58btc', codec) {
    if (!codec) {
      return u8a.toString(multibase.encode(base, b), 'utf-8');
    } else {
      const codecCode = typeof codec === 'string' ? supportedCodecs[codec] : codec;
      const prefixLength = multiformats.varint.encodingLength(codecCode);
      const multicodecEncoding = new Uint8Array(prefixLength + b.length);
      multiformats.varint.encodeTo(codecCode, multicodecEncoding); // set prefix

      multicodecEncoding.set(b, prefixLength); // add the original bytes

      return u8a.toString(multibase.encode(base, multicodecEncoding), 'utf-8');
    }
  }
  /**
   * Converts a multibase string to the Uint8Array it represents.
   * This method will assume the byte array that is multibase encoded is a multicodec and will attempt to decode it.
   *
   * @param s - the string to be converted
   *
   * @throws if the string is not formatted correctly.
   *
   * @public
   */

  function multibaseToBytes(s) {
    const bytes = multibase.decode(s); // look for known key lengths first
    // Ed25519/X25519, secp256k1/P256 compressed or not, BLS12-381 G1/G2 compressed

    if ([32, 33, 48, 64, 65, 96].includes(bytes.length)) {
      return {
        keyBytes: bytes
      };
    } // then assume multicodec, otherwise return the bytes


    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [codec, length] = multiformats.varint.decode(bytes);
      const possibleCodec = Object.entries(supportedCodecs).filter(([, code]) => code === codec)?.[0][0] ?? '';
      return {
        keyBytes: bytes.slice(length),
        keyType: CODEC_TO_KEY_TYPE[possibleCodec]
      };
    } catch (e) {
      // not a multicodec, return the bytes
      return {
        keyBytes: bytes
      };
    }
  }
  function hexToBytes(s, minLength) {
    let input = s.startsWith('0x') ? s.substring(2) : s;

    if (input.length % 2 !== 0) {
      input = `0${input}`;
    }

    if (minLength) {
      const paddedLength = Math.max(input.length, minLength * 2);
      input = input.padStart(paddedLength, '00');
    }

    return u8a.fromString(input.toLowerCase(), 'base16');
  }
  function encodeBase64url(s) {
    return bytesToBase64url(u8a.fromString(s));
  }
  function decodeBase64url(s) {
    return u8a.toString(base64ToBytes(s));
  }
  function bytesToHex(b) {
    return u8a.toString(b, 'base16');
  }
  function bytesToBigInt(b) {
    return BigInt(`0x` + u8a.toString(b, 'base16'));
  }
  function stringToBytes(s) {
    return u8a.fromString(s, 'utf-8');
  }
  function toJose({
    r,
    s,
    recoveryParam
  }, recoverable) {
    const jose = new Uint8Array(recoverable ? 65 : 64);
    jose.set(u8a.fromString(r, 'base16'), 0);
    jose.set(u8a.fromString(s, 'base16'), 32);

    if (recoverable) {
      if (typeof recoveryParam === 'undefined') {
        throw new Error('Signer did not return a recoveryParam');
      }

      jose[64] = recoveryParam;
    }

    return bytesToBase64url(jose);
  }
  function fromJose(signature) {
    const signatureBytes = base64ToBytes(signature);

    if (signatureBytes.length < 64 || signatureBytes.length > 65) {
      throw new TypeError(`Wrong size for signature. Expected 64 or 65 bytes, but got ${signatureBytes.length}`);
    }

    const r = bytesToHex(signatureBytes.slice(0, 32));
    const s = bytesToHex(signatureBytes.slice(32, 64));
    const recoveryParam = signatureBytes.length === 65 ? signatureBytes[64] : undefined;
    return {
      r,
      s,
      recoveryParam
    };
  }
  function toSealed(ciphertext, tag) {
    return u8a.concat([base64ToBytes(ciphertext), tag ? base64ToBytes(tag) : new Uint8Array(0)]);
  }
  function leftpad(data, size = 64) {
    if (data.length === size) return data;
    return '0'.repeat(size - data.length) + data;
  }
  /**
   * Generate random x25519 key pair.
   */

  function generateKeyPair() {
    const secretKey = ed25519.x25519.utils.randomPrivateKey();
    const publicKey = ed25519.x25519.getPublicKey(secretKey);
    return {
      secretKey: secretKey,
      publicKey: publicKey
    };
  }
  /**
   * Generate private-public x25519 key pair from `seed`.
   */

  function generateKeyPairFromSeed(seed) {
    if (seed.length !== 32) {
      throw new Error(`x25519: seed must be ${32} bytes`);
    }

    return {
      publicKey: ed25519.x25519.getPublicKey(seed),
      secretKey: seed
    };
  }
  function genX25519EphemeralKeyPair() {
    const epk = generateKeyPair();
    return {
      publicKeyJWK: {
        kty: 'OKP',
        crv: 'X25519',
        x: bytesToBase64url(epk.publicKey)
      },
      secretKey: epk.secretKey
    };
  }
  /**
   * Checks if a variable is defined and not null.
   * After this check, typescript sees the variable as defined.
   *
   * @param arg - The input to be verified
   *
   * @returns true if the input variable is defined.
   */

  function isDefined(arg) {
    return arg !== null && typeof arg !== 'undefined';
  }

  function sha256(payload) {
    const data = typeof payload === 'string' ? uint8arrays.fromString(payload) : payload;
    return sha256$1.sha256(data);
  }
  const keccak = sha3.keccak_256;
  function toEthereumAddress(hexPublicKey) {
    const hashInput = uint8arrays.fromString(hexPublicKey.slice(2), 'base16');
    return `0x${uint8arrays.toString(keccak(hashInput).slice(-20), 'base16')}`;
  }

  function writeUint32BE(value, array = new Uint8Array(4)) {
    const encoded = uint8arrays.fromString(value.toString(), 'base10');
    array.set(encoded, 4 - encoded.length);
    return array;
  }

  const lengthAndInput = input => uint8arrays.concat([writeUint32BE(input.length), input]); // This implementation of concatKDF was inspired by these two implementations:
  // https://github.com/digitalbazaar/minimal-cipher/blob/master/algorithms/ecdhkdf.js
  // https://github.com/panva/jose/blob/master/lib/jwa/ecdh/derive.js


  function concatKDF(secret, keyLen, alg, producerInfo, consumerInfo) {
    if (keyLen !== 256) throw new Error(`Unsupported key length: ${keyLen}`);
    const value = uint8arrays.concat([lengthAndInput(uint8arrays.fromString(alg)), lengthAndInput(typeof producerInfo === 'undefined' ? new Uint8Array(0) : producerInfo), // apu
    lengthAndInput(typeof consumerInfo === 'undefined' ? new Uint8Array(0) : consumerInfo), // apv
    writeUint32BE(keyLen)]); // since our key lenght is 256 we only have to do one round

    const roundNumber = 1;
    return sha256(uint8arrays.concat([writeUint32BE(roundNumber), secret, value]));
  }

  /**
   *  Creates a configured signer function for signing data using the ES256K (secp256k1 + sha256) algorithm.
   *
   *  The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature
   *
   *  @example
   *  ```typescript
   *  const sign: Signer = ES256KSigner(process.env.PRIVATE_KEY)
   *  const signature: string = await sign(data)
   *  ```
   *
   *  @param    {String}    privateKey   a private key as `Uint8Array`
   *  @param    {Boolean}   recoverable  an optional flag to add the recovery param to the generated signatures
   *  @return   {Function}               a configured signer function `(data: string | Uint8Array): Promise<string>`
   */

  function ES256KSigner(privateKey, recoverable = false) {
    const privateKeyBytes = privateKey;

    if (privateKeyBytes.length !== 32) {
      throw new Error(`bad_key: Invalid private key format. Expecting 32 bytes, but got ${privateKeyBytes.length}`);
    }

    return function (data) {
      try {
        const signature = secp256k1.secp256k1.sign(sha256(data), privateKeyBytes);
        return Promise.resolve(toJose({
          r: leftpad(signature.r.toString(16)),
          s: leftpad(signature.s.toString(16)),
          recoveryParam: signature.recovery
        }, recoverable));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  /**
   * @deprecated Please use ES256KSigner
   *  The SimpleSigner returns a configured function for signing data.
   *
   *  @example
   *  const signer = SimpleSigner(process.env.PRIVATE_KEY)
   *  signer(data, (err, signature) => {
   *    ...
   *  })
   *
   *  @param    {String}         hexPrivateKey    a hex encoded private key
   *  @return   {Function}                     a configured signer function
   */

  function SimpleSigner(hexPrivateKey) {
    const signer = ES256KSigner(hexToBytes(hexPrivateKey), true);
    return function (data) {
      try {
        return Promise.resolve(signer(data)).then(fromJose);
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  /**
   * @deprecated Please use ES256KSigner
   *  The EllipticSigner returns a configured function for signing data.
   *
   *  @example
   *  ```typescript
   *  const signer = EllipticSigner(process.env.PRIVATE_KEY)
   *  signer(data).then( (signature: string) => {
   *    ...
   *  })
   *  ```
   *
   *  @param    {String}         hexPrivateKey    a hex encoded private key
   *  @return   {Function}                        a configured signer function
   */

  function EllipticSigner(hexPrivateKey) {
    return ES256KSigner(hexToBytes(hexPrivateKey));
  }

  /**
   *  Creates a configured signer function for signing data using the EdDSA (Ed25519) algorithm.
   *
   *  The private key is expected to be a `Uint8Array` of 32 bytes, but for compatibility 64 bytes are also acceptable.
   * Users of `@stablelib/ed25519` or `tweetnacl` will be able to use the 64 byte secret keys that library generates.
   * These libraries precompute the public key and append it as the last 32 bytes of the secretKey, to speed up later
   * signing operations.
   *
   *  The signing function itself takes the data as a `Uint8Array` or utf8 `string` and returns a `base64Url`-encoded
   * signature
   *
   *  @example
   *  ```typescript
   *  const sign: Signer = EdDSASigner(process.env.PRIVATE_KEY)
   *  const signature: string = await sign(data)
   *  ```
   *
   *  @param    {String}    secretKey   a 32 or 64 byte secret key as `Uint8Array`
   *  @return   {Function}              a configured signer function `(data: string | Uint8Array): Promise<string>`
   */

  function EdDSASigner(secretKey) {
    const privateKeyBytes = secretKey;

    if (![32, 64].includes(privateKeyBytes.length)) {
      throw new Error(`bad_key: Invalid private key format. Expecting 32 or 64 bytes, but got ${privateKeyBytes.length}`);
    }

    return function (data) {
      try {
        const dataBytes = typeof data === 'string' ? stringToBytes(data) : data;
        const signature = ed25519.ed25519.sign(dataBytes, privateKeyBytes.slice(0, 32));
        return Promise.resolve(bytesToBase64url(signature));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  /**
   * @deprecated Please use EdDSASigner
   *
   *  The NaclSigner returns a configured function for signing data using the Ed25519 algorithm.
   *
   *  The signing function itself takes the data as a `string` or `Uint8Array` parameter and returns a
   *   `base64Url`-encoded signature.
   *
   *  @example
   *  const signer = NaclSigner(process.env.PRIVATE_KEY)
   *  const data: string = '...'
   *  signer(data).then( (signature: string) => {
   *    ...
   *  })
   *
   *  @param    {String}   base64PrivateKey    a 64 byte base64 encoded private key
   *  @return   {Function}                     a configured signer function
   */

  function NaclSigner(base64PrivateKey) {
    return EdDSASigner(base64ToBytes(base64PrivateKey));
  }

  /**
   *  Creates a configured signer function for signing data using the ES256 (secp256r1 + sha256) algorithm.
   *
   *  The signing function itself takes the data as a `Uint8Array` or `string` and returns a `base64Url`-encoded signature
   *
   *  @example
   *  ```typescript
   *  const sign: Signer = ES256Signer(process.env.PRIVATE_KEY)
   *  const signature: string = await sign(data)
   *  ```
   *
   *  @param    {String}    privateKey   a private key as `Uint8Array`
   *  @return   {Function}               a configured signer function `(data: string | Uint8Array): Promise<string>`
   */

  function ES256Signer(privateKey) {
    if (privateKey.length !== 32) {
      throw new Error(`bad_key: Invalid private key format. Expecting 32 bytes, but got ${privateKey.length}`);
    }

    return function (data) {
      try {
        const signature = p256.p256.sign(sha256(data), privateKey);
        return Promise.resolve(toJose({
          r: leftpad(signature.r.toString(16)),
          s: leftpad(signature.s.toString(16))
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  function instanceOfEcdsaSignature(object) {
    return typeof object === 'object' && 'r' in object && 's' in object;
  }

  function ES256SignerAlg() {
    return function sign(payload, signer) {
      try {
        return Promise.resolve(signer(payload)).then(function (signature) {
          if (instanceOfEcdsaSignature(signature)) {
            return toJose(signature);
          } else {
            return signature;
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }
  function ES256KSignerAlg(recoverable) {
    return function sign(payload, signer) {
      try {
        return Promise.resolve(signer(payload)).then(function (signature) {
          if (instanceOfEcdsaSignature(signature)) {
            return toJose(signature, recoverable);
          } else {
            if (recoverable && typeof fromJose(signature).recoveryParam === 'undefined') {
              throw new Error(`not_supported: ES256K-R not supported when signer doesn't provide a recovery param`);
            }

            return signature;
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }
  function Ed25519SignerAlg() {
    return function sign(payload, signer) {
      try {
        return Promise.resolve(signer(payload)).then(function (signature) {
          if (!instanceOfEcdsaSignature(signature)) {
            return signature;
          } else {
            throw new Error('invalid_config: expected a signer function that returns a string instead of signature object');
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }
  const algorithms$1 = {
    ES256: ES256SignerAlg(),
    ES256K: ES256KSignerAlg(),
    // This is a non-standard algorithm but retained for backwards compatibility
    // see https://github.com/decentralized-identity/did-jwt/issues/146
    'ES256K-R': ES256KSignerAlg(true),
    // This is actually incorrect but retained for backwards compatibility
    // see https://github.com/decentralized-identity/did-jwt/issues/130
    Ed25519: Ed25519SignerAlg(),
    EdDSA: Ed25519SignerAlg()
  };

  function SignerAlg(alg) {
    const impl = algorithms$1[alg];
    if (!impl) throw new Error(`not_supported: Unsupported algorithm ${alg}`);
    return impl;
  }

  function publicKeyToAddress$1(publicKey, otherAddress) {
    // Use the same version/prefix byte as the given address.
    const version = bytesToHex(base58ToBytes(otherAddress).slice(0, 1));
    const publicKeyBuffer = hexToBytes(publicKey);
    const publicKeyHash = ripemd160.ripemd160(sha256(publicKeyBuffer));
    const step1 = version + bytesToHex(publicKeyHash);
    const step2 = sha256(hexToBytes(step1));
    const step3 = sha256(step2);
    const checksum = bytesToHex(step3).substring(0, 8);
    const step4 = step1 + checksum;
    return bytesToBase58(hexToBytes(step4));
  }

  function publicKeyToAddress(publicKey, prefix) {
    const publicKeyBuffer = secp256k1.secp256k1.ProjectivePoint.fromHex(publicKey).toRawBytes();
    const hash = ripemd160.ripemd160(sha256(publicKeyBuffer));
    const words = base.bech32.toWords(hash);
    return base.bech32.encode(prefix, words).replace(prefix, '');
  }

  function verifyBlockchainAccountId(publicKey, blockchainAccountId) {
    if (blockchainAccountId) {
      const chain = blockchainAccountId.split(':');

      switch (chain[0]) {
        case 'bip122':
          chain[chain.length - 1] = publicKeyToAddress$1(publicKey, chain[chain.length - 1]);
          break;

        case 'cosmos':
          chain[chain.length - 1] = publicKeyToAddress(publicKey, chain[1]);
          break;

        case 'eip155':
          chain[chain.length - 1] = toEthereumAddress(publicKey);
          break;

        default:
          return false;
      }

      return chain.join(':').toLowerCase() === blockchainAccountId.toLowerCase();
    }

    return false;
  }

  function toSignatureObject(signature, recoverable = false) {
    const rawSig = base64ToBytes(signature);

    if (rawSig.length !== (recoverable ? 65 : 64)) {
      throw new Error('wrong signature length');
    }

    const r = bytesToHex(rawSig.slice(0, 32));
    const s = bytesToHex(rawSig.slice(32, 64));
    const sigObj = {
      r,
      s
    };

    if (recoverable) {
      sigObj.recoveryParam = rawSig[64];
    }

    return sigObj;
  }
  function toSignatureObject2(signature, recoverable = false) {
    const bytes = base64ToBytes(signature);

    if (bytes.length !== (recoverable ? 65 : 64)) {
      throw new Error('wrong signature length');
    }

    return {
      compact: bytes.slice(0, 64),
      recovery: bytes[64]
    };
  }
  function verifyES256(data, signature, authenticators) {
    const hash = sha256(data);
    const sig = p256.p256.Signature.fromCompact(toSignatureObject2(signature).compact);
    const fullPublicKeys = authenticators.filter(a => !a.ethereumAddress && !a.blockchainAccountId);
    const signer = fullPublicKeys.find(pk => {
      try {
        const {
          keyBytes
        } = extractPublicKeyBytes(pk);
        return p256.p256.verify(sig, hash, keyBytes);
      } catch (err) {
        return false;
      }
    });
    if (!signer) throw new Error('invalid_signature: Signature invalid for JWT');
    return signer;
  }
  function verifyES256K(data, signature, authenticators) {
    const hash = sha256(data);
    const signatureNormalized = secp256k1.secp256k1.Signature.fromCompact(base64ToBytes(signature)).normalizeS();
    const fullPublicKeys = authenticators.filter(a => {
      return !a.ethereumAddress && !a.blockchainAccountId;
    });
    const blockchainAddressKeys = authenticators.filter(a => {
      return a.ethereumAddress || a.blockchainAccountId;
    });
    let signer = fullPublicKeys.find(pk => {
      try {
        const {
          keyBytes
        } = extractPublicKeyBytes(pk);
        return secp256k1.secp256k1.verify(signatureNormalized, hash, keyBytes);
      } catch (err) {
        return false;
      }
    });

    if (!signer && blockchainAddressKeys.length > 0) {
      signer = verifyRecoverableES256K(data, signature, blockchainAddressKeys);
    }

    if (!signer) throw new Error('invalid_signature: Signature invalid for JWT');
    return signer;
  }
  function verifyRecoverableES256K(data, signature, authenticators) {
    const signatures = [];

    if (signature.length > 86) {
      signatures.push(toSignatureObject2(signature, true));
    } else {
      const so = toSignatureObject2(signature, false);
      signatures.push({ ...so,
        recovery: 0
      });
      signatures.push({ ...so,
        recovery: 1
      });
    }

    const hash = sha256(data);

    const checkSignatureAgainstSigner = sigObj => {
      const signature = secp256k1.secp256k1.Signature.fromCompact(sigObj.compact).addRecoveryBit(sigObj.recovery || 0);
      const recoveredPublicKey = signature.recoverPublicKey(hash);
      const recoveredAddress = toEthereumAddress(recoveredPublicKey.toHex(false)).toLowerCase();
      const recoveredPublicKeyHex = recoveredPublicKey.toHex(false);
      const recoveredCompressedPublicKeyHex = recoveredPublicKey.toHex(true);
      return authenticators.find(a => {
        const {
          keyBytes
        } = extractPublicKeyBytes(a);
        const keyHex = bytesToHex(keyBytes);
        return keyHex === recoveredPublicKeyHex || keyHex === recoveredCompressedPublicKeyHex || a.ethereumAddress?.toLowerCase() === recoveredAddress || a.blockchainAccountId?.split('@eip155')?.[0].toLowerCase() === recoveredAddress || // CAIP-2
        verifyBlockchainAccountId(recoveredPublicKeyHex, a.blockchainAccountId) // CAIP-10
        ;
      });
    }; // Find first verification method


    for (const signature of signatures) {
      const verificationMethod = checkSignatureAgainstSigner(signature);
      if (verificationMethod) return verificationMethod;
    } // If no one found matching


    throw new Error('invalid_signature: Signature invalid for JWT');
  }
  function verifyEd25519(data, signature, authenticators) {
    const clear = stringToBytes(data);
    const signatureBytes = base64ToBytes(signature);
    const signer = authenticators.find(a => {
      const {
        keyBytes,
        keyType
      } = extractPublicKeyBytes(a);

      if (keyType === 'Ed25519') {
        return ed25519.ed25519.verify(signatureBytes, clear, keyBytes);
      } else {
        return false;
      }
    });
    if (!signer) throw new Error('invalid_signature: Signature invalid for JWT');
    return signer;
  }
  const algorithms = {
    ES256: verifyES256,
    ES256K: verifyES256K,
    // This is a non-standard algorithm but retained for backwards compatibility
    // see https://github.com/decentralized-identity/did-jwt/issues/146
    'ES256K-R': verifyRecoverableES256K,
    // This is actually incorrect but retained for backwards compatibility
    // see https://github.com/decentralized-identity/did-jwt/issues/130
    Ed25519: verifyEd25519,
    EdDSA: verifyEd25519
  };

  function VerifierAlgorithm(alg) {
    const impl = algorithms[alg];
    if (!impl) throw new Error(`not_supported: Unsupported algorithm ${alg}`);
    return impl;
  }

  VerifierAlgorithm.toSignatureObject = toSignatureObject;

  /**
   * Error prefixes used for known verification failure cases.
   *
   * For compatibility, these error prefixes match the existing error messages, but will be adjusted in a future major
   * version update to match the scenarios better.
   *
   * @beta
   */
  const JWT_ERROR = {
    /**
     * Thrown when a JWT payload schema is unexpected or when validity period does not match
     */
    INVALID_JWT: 'invalid_jwt',

    /**
     * Thrown when the verifier audience does not match the one set in the JWT payload
     */
    INVALID_AUDIENCE: 'invalid_config',

    /**
     * Thrown when none of the public keys of the issuer match the signature of the JWT.
     *
     * This is equivalent to `NO_SUITABLE_KEYS` when the `proofPurpose` is NOT specified.
     */
    INVALID_SIGNATURE: 'invalid_signature',

    /**
     * Thrown when the DID document of the issuer does not have any keys that match the signature for the given
     * `proofPurpose`.
     *
     * This is equivalent to `invalid_signature`, when a `proofPurpose` is specified.
     */
    NO_SUITABLE_KEYS: 'no_suitable_keys',

    /**
     * Thrown when the `alg` of the JWT or the encoding of the key is not supported
     */
    NOT_SUPPORTED: 'not_supported',

    /**
     * Thrown when the DID resolver is unable to resolve the issuer DID.
     */
    RESOLVER_ERROR: 'resolver_error'
  };

  function _catch$1(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }

    if (result && result.then) {
      return result.then(void 0, recover);
    }

    return result;
  }

  const verifyConditionDelegated = function (jwt, {
    header,
    payload,
    data,
    signature
  }, authenticator, options) {
    try {
      if (!authenticator.conditionDelegated) {
        throw new Error('Expected conditionDelegated');
      }

      if (!options.resolver) {
        throw new Error('Expected resolver');
      }

      let foundSigner;
      const issuer = authenticator.conditionDelegated;
      return Promise.resolve(resolveAuthenticator(options.resolver, header.alg, issuer, options.proofPurpose)).then(function (didAuthenticator) {
        let _exit2;

        function _temp6(_result4) {
          if (_exit2) ;

          if (foundSigner) {
            return authenticator;
          }

          throw new Error(`${JWT_ERROR.INVALID_SIGNATURE}: condition for authenticator ${authenticator.id} is not met.`);
        }

        const didResolutionResult = didAuthenticator.didResolutionResult;

        if (!didResolutionResult?.didDocument) {
          throw new Error(`${JWT_ERROR.RESOLVER_ERROR}: Could not resolve delegated DID ${issuer}.`);
        }

        const delegatedAuthenticator = didAuthenticator.authenticators.find(authenticator => authenticator.id === issuer);

        if (!delegatedAuthenticator) {
          throw new Error(`${JWT_ERROR.NO_SUITABLE_KEYS}: Could not find delegated authenticator ${issuer} in it's DID Document`);
        }

        const _temp5 = function () {
          if (delegatedAuthenticator.type === CONDITIONAL_PROOF_2022) {
            return Promise.resolve(verifyJWT(jwt, { ...options,
              ...{
                didAuthenticator: {
                  didResolutionResult,
                  authenticators: [delegatedAuthenticator],
                  issuer: delegatedAuthenticator.id
                }
              }
            })).then(function ({
              verified
            }) {
              if (verified) {
                foundSigner = delegatedAuthenticator;
              }
            });
          } else {
            try {
              foundSigner = verifyJWTDecoded({
                header,
                payload,
                data,
                signature
              }, delegatedAuthenticator);
            } catch (e) {
              if (!e.message.startsWith('invalid_signature:')) throw e;
            }
          }
        }();

        return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const _iteratorSymbol$1 = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";

  function _settle$2(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact$2) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }

          value = value.v;
        } else {
          value.o = _settle$2.bind(null, pact, state);
          return;
        }
      }

      if (value && value.then) {
        value.then(_settle$2.bind(null, pact, state), _settle$2.bind(null, pact, 2));
        return;
      }

      pact.s = state;
      pact.v = value;
      const observer = pact.o;

      if (observer) {
        observer(pact);
      }
    }
  }

  const _Pact$2 = /*#__PURE__*/function () {
    function _Pact() {}

    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;

      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;

        if (callback) {
          try {
            _settle$2(result, 1, callback(this.v));
          } catch (e) {
            _settle$2(result, 2, e);
          }

          return result;
        } else {
          return this;
        }
      }

      this.o = function (_this) {
        try {
          const value = _this.v;

          if (_this.s & 1) {
            _settle$2(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle$2(result, 1, onRejected(value));
          } else {
            _settle$2(result, 2, value);
          }
        } catch (e) {
          _settle$2(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _isSettledPact$2(thenable) {
    return thenable instanceof _Pact$2 && thenable.s & 1;
  }

  function _forTo$2(array, body, check) {
    var i = -1,
        pact,
        reject;

    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);

          if (result && result.then) {
            if (_isSettledPact$2(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle$2.bind(null, pact = new _Pact$2(), 2)));
              return;
            }
          }
        }

        if (pact) {
          _settle$2(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle$2(pact || (pact = new _Pact$2()), 2, e);
      }
    }

    _cycle();

    return pact;
  }

  const verifyConditionWeightedThreshold = function (jwt, {
    header,
    payload,
    data,
    signature
  }, authenticator, options) {
    try {
      let _exit;

      function _temp4(_result3) {
        if (_exit) return _result3;
        throw new Error(`${JWT_ERROR.INVALID_SIGNATURE}: condition for authenticator ${authenticator.id} is not met.`);
      }

      if (!authenticator.conditionWeightedThreshold || !authenticator.threshold) {
        throw new Error('Expected conditionWeightedThreshold and threshold');
      }

      const issuers = [];
      const threshold = authenticator.threshold;
      let weightCount = 0;

      const _temp3 = _forOf$1(authenticator.conditionWeightedThreshold, function (weightedCondition) {
        function _temp2(_result2) {
          if (_exit) return _result2;

          if (foundSigner && !issuers.includes(foundSigner.id)) {
            issuers.push(foundSigner.id);
            weightCount += weightedCondition.weight;

            if (weightCount >= threshold) {
              _exit = 1;
              return authenticator;
            }
          }
        }

        const currentCondition = weightedCondition.condition;
        let foundSigner;

        const _temp = _catch$1(function () {
          if (currentCondition.type === CONDITIONAL_PROOF_2022) {
            if (!options.didAuthenticator) {
              throw new Error('Expected didAuthenticator');
            }

            const newOptions = { ...options,
              didAuthenticator: {
                didResolutionResult: options.didAuthenticator?.didResolutionResult,
                authenticators: [currentCondition],
                issuer: currentCondition.id
              }
            };
            return Promise.resolve(verifyJWT(jwt, newOptions)).then(function ({
              verified
            }) {
              if (verified) {
                foundSigner = currentCondition;
              }
            });
          } else {
            return Promise.resolve(verifyJWTDecoded({
              header,
              payload,
              data,
              signature
            }, currentCondition)).then(function (_verifyJWTDecoded) {
              foundSigner = _verifyJWTDecoded;
            });
          }
        }, function (e) {
          if (!e.message.startsWith(JWT_ERROR.INVALID_SIGNATURE)) throw e;
        });

        return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
      }, function () {
        return _exit;
      });

      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  function _forOf$1(target, body, check) {
    if (typeof target[_iteratorSymbol$1] === "function") {
      var iterator = target[_iteratorSymbol$1](),
          step,
          pact,
          reject;

      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);

            if (result && result.then) {
              if (_isSettledPact$2(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle$2.bind(null, pact = new _Pact$2(), 2)));
                return;
              }
            }
          }

          if (pact) {
            _settle$2(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle$2(pact || (pact = new _Pact$2()), 2, e);
        }
      }

      _cycle();

      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}

          return value;
        };

        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }

        _fixup();
      }

      return pact;
    } // No support for Symbol.iterator


    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    } // Handle live collections properly


    var values = [];

    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }

    return _forTo$2(values, function (i) {
      return body(values[i]);
    }, check);
  }

  const verifyConditionalProof = function (jwt, {
    header,
    payload,
    signature,
    data
  }, authenticator, options) {
    try {
      // Validate the condition according to its condition property
      if (authenticator.conditionWeightedThreshold) {
        return verifyConditionWeightedThreshold(jwt, {
          header,
          payload,
          data,
          signature
        }, authenticator, options);
      } else if (authenticator.conditionDelegated) {
        return verifyConditionDelegated(jwt, {
          header,
          payload,
          data,
          signature
        }, authenticator, options);
      } // TODO other conditions


      throw new Error(`${JWT_ERROR.INVALID_JWT}: conditional proof type did not find condition for authenticator ${authenticator.id}.`);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const verifyProof = function (jwt, {
    header,
    payload,
    signature,
    data
  }, authenticator, options) {
    try {
      if (authenticator.type === CONDITIONAL_PROOF_2022) {
        return verifyConditionalProof(jwt, {
          payload,
          header,
          signature,
          data
        }, authenticator, options);
      } else {
        return Promise.resolve(verifyJWTDecoded({
          header,
          payload,
          data,
          signature
        }, [authenticator]));
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const CONDITIONAL_PROOF_2022 = 'ConditionalProof2022';

  /**
   * Resolves relevant public keys or other authenticating material used to verify signature from the DID document of
   * provided DID
   *
   *  @example
   *  ```ts
   *  resolveAuthenticator(resolver, 'ES256K', 'did:uport:2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqX').then(obj => {
   *      const payload = obj.payload
   *      const profile = obj.profile
   *      const jwt = obj.jwt
   *      // ...
   *  })
   *  ```
   *
   *  @param resolver - {Resolvable} a DID resolver function that can obtain the `DIDDocument` for the `issuer`
   *  @param alg - {String} a JWT algorithm
   *  @param issuer - {String} a Decentralized Identifier (DID) to lookup
   *  @param proofPurpose - {ProofPurposeTypes} *Optional* Use the verificationMethod linked in that section of the
   *   issuer DID document
   *  @return {Promise<DIDAuthenticator>} a promise which resolves with an object containing an array of authenticators
   *   or rejects with an error if none exist
   */
  function _settle$1(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact$1) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }

          value = value.v;
        } else {
          value.o = _settle$1.bind(null, pact, state);
          return;
        }
      }

      if (value && value.then) {
        value.then(_settle$1.bind(null, pact, state), _settle$1.bind(null, pact, 2));
        return;
      }

      pact.s = state;
      pact.v = value;
      const observer = pact.o;

      if (observer) {
        observer(pact);
      }
    }
  }

  const _Pact$1 = /*#__PURE__*/function () {
    function _Pact() {}

    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;

      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;

        if (callback) {
          try {
            _settle$1(result, 1, callback(this.v));
          } catch (e) {
            _settle$1(result, 2, e);
          }

          return result;
        } else {
          return this;
        }
      }

      this.o = function (_this) {
        try {
          const value = _this.v;

          if (_this.s & 1) {
            _settle$1(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle$1(result, 1, onRejected(value));
          } else {
            _settle$1(result, 2, value);
          }
        } catch (e) {
          _settle$1(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _isSettledPact$1(thenable) {
    return thenable instanceof _Pact$1 && thenable.s & 1;
  }

  function _forTo$1(array, body, check) {
    var i = -1,
        pact,
        reject;

    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);

          if (result && result.then) {
            if (_isSettledPact$1(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle$1.bind(null, pact = new _Pact$1(), 2)));
              return;
            }
          }
        }

        if (pact) {
          _settle$1(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle$1(pact || (pact = new _Pact$1()), 2, e);
      }
    }

    _cycle();

    return pact;
  }

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }

    if (result && result.then) {
      return result.then(void 0, recover);
    }

    return result;
  }

  function _for$1(test, update, body) {
    var stage;

    for (;;) {
      var shouldContinue = test();

      if (_isSettledPact$1(shouldContinue)) {
        shouldContinue = shouldContinue.v;
      }

      if (!shouldContinue) {
        return result;
      }

      if (shouldContinue.then) {
        stage = 0;
        break;
      }

      var result = body();

      if (result && result.then) {
        if (_isSettledPact$1(result)) {
          result = result.s;
        } else {
          stage = 1;
          break;
        }
      }

      if (update) {
        var updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact$1(updateValue)) {
          stage = 2;
          break;
        }
      }
    }

    var pact = new _Pact$1();

    var reject = _settle$1.bind(null, pact, 2);

    (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
    return pact;

    function _resumeAfterBody(value) {
      result = value;

      do {
        if (update) {
          updateValue = update();

          if (updateValue && updateValue.then && !_isSettledPact$1(updateValue)) {
            updateValue.then(_resumeAfterUpdate).then(void 0, reject);
            return;
          }
        }

        shouldContinue = test();

        if (!shouldContinue || _isSettledPact$1(shouldContinue) && !shouldContinue.v) {
          _settle$1(pact, 1, result);

          return;
        }

        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          return;
        }

        result = body();

        if (_isSettledPact$1(result)) {
          result = result.v;
        }
      } while (!result || !result.then);

      result.then(_resumeAfterBody).then(void 0, reject);
    }

    function _resumeAfterTest(shouldContinue) {
      if (shouldContinue) {
        result = body();

        if (result && result.then) {
          result.then(_resumeAfterBody).then(void 0, reject);
        } else {
          _resumeAfterBody(result);
        }
      } else {
        _settle$1(pact, 1, result);
      }
    }

    function _resumeAfterUpdate() {
      if (shouldContinue = test()) {
        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        } else {
          _resumeAfterTest(shouldContinue);
        }
      } else {
        _settle$1(pact, 1, result);
      }
    }
  }

  const resolveAuthenticator = function (resolver, alg, issuer, proofPurpose) {
    try {
      const types = SUPPORTED_PUBLIC_KEY_TYPES[alg];

      if (!types || types.length === 0) {
        throw new Error(`${JWT_ERROR.NOT_SUPPORTED}: No supported signature types for algorithm ${alg}`);
      }

      let didResult;
      return Promise.resolve(resolver.resolve(issuer, {
        accept: DID_JSON
      })).then(function (result) {
        // support legacy resolvers that do not produce DIDResolutionResult
        if (Object.getOwnPropertyNames(result).indexOf('didDocument') === -1) {
          didResult = {
            didDocument: result,
            didDocumentMetadata: {},
            didResolutionMetadata: {
              contentType: DID_JSON
            }
          };
        } else {
          didResult = result;
        }

        if (didResult.didResolutionMetadata?.error || didResult.didDocument == null) {
          const {
            error,
            message
          } = didResult.didResolutionMetadata;
          throw new Error(`${JWT_ERROR.RESOLVER_ERROR}: Unable to resolve DID document for ${issuer}: ${error}, ${message || ''}`);
        }

        const getPublicKeyById = (verificationMethods, pubid) => {
          const filtered = verificationMethods.filter(({
            id
          }) => pubid === id);
          return filtered.length > 0 ? filtered[0] : null;
        };

        let publicKeysToCheck = [...(didResult?.didDocument?.verificationMethod || []), ...(didResult?.didDocument?.publicKey || [])];

        if (typeof proofPurpose === 'string') {
          // support legacy DID Documents that do not list assertionMethod
          if (proofPurpose.startsWith('assertion') && !Object.getOwnPropertyNames(didResult?.didDocument).includes('assertionMethod')) {
            didResult.didDocument = { ...didResult.didDocument
            };
            didResult.didDocument.assertionMethod = [...publicKeysToCheck.map(pk => pk.id)];
          }

          publicKeysToCheck = (didResult.didDocument[proofPurpose] || []).map(verificationMethod => {
            if (typeof verificationMethod === 'string') {
              return getPublicKeyById(publicKeysToCheck, verificationMethod);
            } else if (typeof verificationMethod.publicKey === 'string') {
              // this is a legacy format
              return getPublicKeyById(publicKeysToCheck, verificationMethod.publicKey);
            } else {
              return verificationMethod;
            }
          }).filter(key => key != null);
        }

        const authenticators = publicKeysToCheck.filter(({
          type
        }) => types.find(supported => supported === type));

        if (typeof proofPurpose === 'string' && (!authenticators || authenticators.length === 0)) {
          throw new Error(`${JWT_ERROR.NO_SUITABLE_KEYS}: DID document for ${issuer} does not have public keys suitable for ${alg} with ${proofPurpose} purpose`);
        }

        if (!authenticators || authenticators.length === 0) {
          throw new Error(`${JWT_ERROR.NO_SUITABLE_KEYS}: DID document for ${issuer} does not have public keys for ${alg}`);
        }

        return {
          authenticators,
          issuer,
          didResolutionResult: didResult
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   *  Verifies given JWT. If the JWT is valid, the promise returns an object including the JWT, the payload of the JWT,
   *  and the DID document of the issuer of the JWT.
   *
   *  @example
   *  ```ts
   *  verifyJWT(
   *      'did:uport:eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJyZXF1Z....',
   *      {audience: '5A8bRWU3F7j3REx3vkJ...', callbackUrl: 'https://...'}
   *    ).then(obj => {
   *        const did = obj.did // DID of signer
   *        const payload = obj.payload
   *        const doc = obj.didResolutionResult.didDocument // DID Document of issuer
   *        const jwt = obj.jwt
   *        const signerKeyId = obj.signer.id // ID of key in DID document that signed JWT
   *        ...
   *    })
   *  ```
   *
   *  @param    {String}            jwt                a JSON Web Token to verify
   *  @param    {Object}            [options]           an unsigned credential object
   *  @param    {Boolean}           options.auth        Require signer to be listed in the authentication section of the
   *   DID document (for Authentication purposes)
   *  @param    {String}            options.audience    DID of the recipient of the JWT
   *  @param    {String}            options.callbackUrl callback url in JWT
   *  @return   {Promise<Object, Error>}               a promise which resolves with a response object or rejects with an
   *   error
   */
  const verifyJWT = function (jwt, options = {
    resolver: undefined,
    auth: undefined,
    audience: undefined,
    callbackUrl: undefined,
    skewTime: undefined,
    proofPurpose: undefined,
    policies: {},
    didAuthenticator: undefined
  }) {
    try {
      function _temp7() {
        let _exit;

        function _temp5(_result) {
          if (_exit) ;

          if (signer) {
            const now = typeof options.policies?.now === 'number' ? options.policies.now : Math.floor(Date.now() / 1000);
            const skewTime = typeof options.skewTime !== 'undefined' && options.skewTime >= 0 ? options.skewTime : NBF_SKEW;
            const nowSkewed = now + skewTime;

            if (options.policies?.nbf !== false && payload.nbf) {
              if (payload.nbf > nowSkewed) {
                throw new Error(`${JWT_ERROR.INVALID_JWT}: JWT not valid before nbf: ${payload.nbf}`);
              }
            } else if (options.policies?.iat !== false && payload.iat && payload.iat > nowSkewed) {
              throw new Error(`${JWT_ERROR.INVALID_JWT}: JWT not valid yet (issued in the future) iat: ${payload.iat}`);
            }

            if (options.policies?.exp !== false && payload.exp && payload.exp <= now - skewTime) {
              throw new Error(`${JWT_ERROR.INVALID_JWT}: JWT has expired: exp: ${payload.exp} < now: ${now}`);
            }

            if (options.policies?.aud !== false && payload.aud) {
              if (!options.audience && !options.callbackUrl) {
                throw new Error(`${JWT_ERROR.INVALID_AUDIENCE}: JWT audience is required but your app address has not been configured`);
              }

              const audArray = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
              const matchedAudience = audArray.find(item => options.audience === item || options.callbackUrl === item);

              if (typeof matchedAudience === 'undefined') {
                throw new Error(`${JWT_ERROR.INVALID_AUDIENCE}: JWT audience does not match your DID or callback url`);
              }
            }

            return {
              verified: true,
              payload,
              didResolutionResult,
              issuer,
              signer,
              jwt,
              policies: options.policies
            };
          }

          throw new Error(`${JWT_ERROR.INVALID_SIGNATURE}: JWT not valid. issuer DID document does not contain a verificationMethod that matches the signature.`);
        }

        const {
          did
        } = didResolver.parse(didUrl);
        let signer = null;

        const _temp4 = function () {
          if (did !== didUrl) {
            const authenticator = authenticators.find(auth => auth.id === didUrl);

            if (!authenticator) {
              throw new Error(`${JWT_ERROR.INVALID_JWT}: No authenticator found for did URL ${didUrl}`);
            }

            return Promise.resolve(verifyProof(jwt, {
              payload,
              header,
              signature,
              data
            }, authenticator, options)).then(function (_verifyProof) {
              signer = _verifyProof;
            });
          } else {
            let i = 0;
            return _for$1(function () {
              return !_exit && !signer && i < authenticators.length;
            }, void 0, function () {
              function _temp3(_result2) {
                if (_exit) ;
                i++;
              }

              const authenticator = authenticators[i];

              const _temp2 = _catch(function () {
                return Promise.resolve(verifyProof(jwt, {
                  payload,
                  header,
                  signature,
                  data
                }, authenticator, options)).then(function (_verifyProof2) {
                  signer = _verifyProof2;
                });
              }, function (e) {
                if (!e.message.includes(JWT_ERROR.INVALID_SIGNATURE) || i === authenticators.length - 1) throw e;
              });

              return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
            });
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
      }

      if (!options.resolver) throw new Error('missing_resolver: No DID resolver has been configured');
      const {
        payload,
        header,
        signature,
        data
      } = decodeJWT(jwt, false);
      const proofPurpose = Object.prototype.hasOwnProperty.call(options, 'auth') ? options.auth ? 'authentication' : undefined : options.proofPurpose;
      let didUrl;

      if (!payload.iss && !payload.client_id) {
        throw new Error(`${JWT_ERROR.INVALID_JWT}: JWT iss or client_id are required`);
      }

      if (options.didAuthenticator) {
        didUrl = options.didAuthenticator.issuer;
      } else if (payload.iss === SELF_ISSUED_V2 || payload.iss === SELF_ISSUED_V2_VC_INTEROP) {
        if (!payload.sub) {
          throw new Error(`${JWT_ERROR.INVALID_JWT}: JWT sub is required`);
        }

        if (typeof payload.sub_jwk === 'undefined') {
          didUrl = payload.sub;
        } else {
          didUrl = (header.kid || '').split('#')[0];
        }
      } else if (payload.iss === SELF_ISSUED_V0_1) {
        if (!payload.did) {
          throw new Error(`${JWT_ERROR.INVALID_JWT}: JWT did is required`);
        }

        didUrl = payload.did;
      } else if (!payload.iss && payload.scope === 'openid' && payload.redirect_uri) {
        // SIOP Request payload
        // https://identity.foundation/jwt-vc-presentation-profile/#self-issued-op-request-object
        if (!payload.client_id) {
          throw new Error(`${JWT_ERROR.INVALID_JWT}: JWT client_id is required`);
        }

        didUrl = payload.client_id;
      } else {
        didUrl = payload.iss;
      }

      if (!didUrl) {
        throw new Error(`${JWT_ERROR.INVALID_JWT}: No DID has been found in the JWT`);
      }

      let authenticators;
      let issuer;
      let didResolutionResult;

      const _temp6 = function () {
        if (options.didAuthenticator) {
          ({
            didResolutionResult,
            authenticators,
            issuer
          } = options.didAuthenticator);
        } else {
          return Promise.resolve(resolveAuthenticator(options.resolver, header.alg, didUrl, proofPurpose)).then(function (_resolveAuthenticator) {
            ({
              didResolutionResult,
              authenticators,
              issuer
            } = _resolveAuthenticator);
            // Add to options object for recursive reference
            options.didAuthenticator = {
              didResolutionResult,
              authenticators,
              issuer
            };
          });
        }
      }();

      return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   *  Creates a multi-signature signed JWT given multiple issuers and their corresponding signers, and a payload for
   * which the signature is over.
   *
   *  @example
   *  const signer = ES256KSigner(process.env.PRIVATE_KEY)
   *  createJWT({address: '5A8bRWU3F7j3REx3vkJ...', signer}, {key1: 'value', key2: ..., ... }).then(jwt => {
   *      ...
   *  })
   *
   *  @param    {Object}            payload               payload object
   *  @param    {Object}            [options]             an unsigned credential object
   *  @param    {boolean}           options.expiresIn     optional flag to denote the expiration time
   *  @param    {boolean}           options.canonicalize  optional flag to canonicalize header and payload before signing
   *  @param    {Object[]}          issuers               array of the issuers, their signers and algorithms
   *  @param    {string}            issuers[].issuer      The DID of the issuer (signer) of JWT
   *  @param    {Signer}            issuers[].signer      a `Signer` function, Please see `ES256KSigner` or `EdDSASigner`
   *  @param    {String}            issuers[].alg         [DEPRECATED] The JWT signing algorithm to use. Supports:
   *   [ES256K, ES256K-R, Ed25519, EdDSA], Defaults to: ES256K. Please use `header.alg` to specify the algorithm
   *  @return   {Promise<Object, Error>}                  a promise which resolves with a signed JSON Web Token or
   *   rejects with an error
   */
  const createMultisignatureJWT = function (payload, {
    expiresIn,
    canonicalize
  }, issuers) {
    try {
      if (issuers.length === 0) throw new Error('invalid_argument: must provide one or more issuers');
      let payloadResult = payload;
      let jwt = '';

      const _temp = _forTo$1(issuers, function (i) {
        const issuer = issuers[i];
        const header = {
          typ: 'JWT',
          alg: issuer.alg
        }; // Create nested JWT
        // See Point 5 of https://www.rfc-editor.org/rfc/rfc7519#section-7.1
        // After the first JWT is created (the first JWS), the next JWT is created by inputting the previous JWT as the
        // payload

        if (i !== 0) {
          header.cty = 'JWT';
        }

        return Promise.resolve(createJWT(payloadResult, { ...issuer,
          canonicalize,
          expiresIn
        }, header)).then(function (_createJWT) {
          jwt = _createJWT;
          payloadResult = {
            jwt
          };
        });
      });

      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {
        return jwt;
      }) : jwt);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   *  Creates a signed JWT given an address which becomes the issuer, a signer, and a payload for which the signature is
   * over.
   *
   *  @example
   *  const signer = ES256KSigner(process.env.PRIVATE_KEY)
   *  createJWT({address: '5A8bRWU3F7j3REx3vkJ...', signer}, {key1: 'value', key2: ..., ... }).then(jwt => {
   *      ...
   *  })
   *
   *  @param    {Object}            payload               payload object
   *  @param    {Object}            [options]             an unsigned credential object
   *  @param    {String}            options.issuer        The DID of the issuer (signer) of JWT
   *  @param    {String}            options.alg           [DEPRECATED] The JWT signing algorithm to use. Supports:
   *   [ES256K, ES256K-R, Ed25519, EdDSA], Defaults to: ES256K. Please use `header.alg` to specify the algorithm
   *  @param    {Signer}            options.signer        a `Signer` function, Please see `ES256KSigner` or `EdDSASigner`
   *  @param    {boolean}           options.canonicalize  optional flag to canonicalize header and payload before signing
   *  @param    {Object}            header                optional object to specify or customize the JWT header
   *  @return   {Promise<Object, Error>}                  a promise which resolves with a signed JSON Web Token or
   *   rejects with an error
   */
  const createJWT = function (payload, {
    issuer,
    signer,
    alg,
    expiresIn,
    canonicalize
  }, header = {}) {
    try {
      if (!signer) throw new Error('missing_signer: No Signer functionality has been configured');
      if (!issuer) throw new Error('missing_issuer: No issuing DID has been configured');
      if (!header.typ) header.typ = 'JWT';
      if (!header.alg) header.alg = alg;
      const timestamps = {
        iat: Math.floor(Date.now() / 1000),
        exp: undefined
      };

      if (expiresIn) {
        if (typeof expiresIn === 'number') {
          timestamps.exp = (payload.nbf || timestamps.iat) + Math.floor(expiresIn);
        } else {
          throw new Error('invalid_argument: JWT expiresIn is not a number');
        }
      }

      const fullPayload = { ...timestamps,
        ...payload,
        iss: issuer
      };
      return createJWS(fullPayload, signer, header, {
        canonicalize
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   *  Creates a signed JWS given a payload, a signer, and an optional header.
   *
   *  @example
   *  const signer = ES256KSigner(process.env.PRIVATE_KEY)
   *  const jws = await createJWS({ my: 'payload' }, signer)
   *
   *  @param    {Object}            payload           payload object
   *  @param    {Signer}            signer            a signer, see `ES256KSigner or `EdDSASigner`
   *  @param    {Object}            header            optional object to specify or customize the JWS header
   *  @param    {Object}            options           can be used to trigger automatic canonicalization of header and
   *                                                    payload properties
   *  @return   {Promise<string>}                     a Promise which resolves to a JWS string or rejects with an error
   */
  const createJWS = function (payload, signer, header = {}, options = {}) {
    try {
      if (!header.alg) header.alg = defaultAlg;
      const encodedPayload = typeof payload === 'string' ? payload : encodeSection(payload, options.canonicalize);
      const signingInput = [encodeSection(header, options.canonicalize), encodedPayload].join('.');
      const jwtSigner = SignerAlg(header.alg);
      return Promise.resolve(jwtSigner(signingInput, signer)).then(function (signature) {
        // JWS Compact Serialization
        // https://www.rfc-editor.org/rfc/rfc7515#section-7.1
        return [signingInput, signature].join('.');
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const SELF_ISSUED_V2 = 'https://self-issued.me/v2';
  const SELF_ISSUED_V2_VC_INTEROP = 'https://self-issued.me/v2/openid-vc'; // https://identity.foundation/jwt-vc-presentation-profile/#id-token-validation

  const SELF_ISSUED_V0_1 = 'https://self-issued.me';
  const defaultAlg = 'ES256K';
  const DID_JSON = 'application/did+json'; // eslint-disable-next-line @typescript-eslint/no-explicit-any

  function encodeSection(data, shouldCanonicalize = false) {
    if (shouldCanonicalize) {
      return encodeBase64url(canonicalizeData__default['default'](data));
    } else {
      return encodeBase64url(JSON.stringify(data));
    }
  }

  const NBF_SKEW = 300;

  function decodeJWS(jws) {
    const parts = jws.match(/^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)$/);

    if (parts) {
      return {
        header: JSON.parse(decodeBase64url(parts[1])),
        payload: parts[2],
        signature: parts[3],
        data: `${parts[1]}.${parts[2]}`
      };
    }

    throw new Error('invalid_argument: Incorrect format JWS');
  }
  /**
   *  Decodes a JWT and returns an object representing the payload
   *
   *  @example
   *  decodeJWT('eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1...')
   *
   *  @param    {String}            jwt                a JSON Web Token to verify
   * @param    {Object}            [recurse]          whether to recurse into the payload to decode any nested JWTs
   *  @return   {Object}                               a JS object representing the decoded JWT
   */


  function decodeJWT(jwt, recurse = true) {
    if (!jwt) throw new Error('invalid_argument: no JWT passed into decodeJWT');

    try {
      const jws = decodeJWS(jwt);
      const decodedJwt = Object.assign(jws, {
        payload: JSON.parse(decodeBase64url(jws.payload))
      });
      const iss = decodedJwt.payload.iss;

      if (decodedJwt.header.cty === 'JWT' && recurse) {
        const innerDecodedJwt = decodeJWT(decodedJwt.payload.jwt);
        if (innerDecodedJwt.payload.iss !== iss) throw new Error(`${JWT_ERROR.INVALID_JWT}: multiple issuers`);
        return innerDecodedJwt;
      }

      return decodedJwt;
    } catch (e) {
      throw new Error(`invalid_argument: ${JWT_ERROR.INVALID_JWT}: ${e}`);
    }
  }
  function verifyJWTDecoded({
    header,
    payload,
    data,
    signature
  }, pubKeys) {
    if (!Array.isArray(pubKeys)) pubKeys = [pubKeys];
    const iss = payload.iss;
    let recurse = true;

    do {
      if (iss !== payload.iss) throw new Error(`${JWT_ERROR.INVALID_JWT}: multiple issuers`);

      try {
        const result = VerifierAlgorithm(header.alg)(data, signature, pubKeys);
        return result;
      } catch (e) {
        if (!e.message.startsWith(JWT_ERROR.INVALID_SIGNATURE)) throw e;
      } // TODO probably best to create copy objects than replace reference objects


      if (header.cty !== 'JWT') {
        recurse = false;
      } else {
        ({
          payload,
          header,
          signature,
          data
        } = decodeJWT(payload.jwt, false));
      }
    } while (recurse);

    throw new Error(`${JWT_ERROR.INVALID_SIGNATURE}: no matching public key found`);
  }
  function verifyJWSDecoded({
    header,
    data,
    signature
  }, pubKeys) {
    if (!Array.isArray(pubKeys)) pubKeys = [pubKeys];
    const signer = VerifierAlgorithm(header.alg)(data, signature, pubKeys);
    return signer;
  }
  /**
   *  Verifies given JWS. If the JWS is valid, returns the public key that was
   *  used to sign the JWS, or throws an `Error` if none of the `pubKeys` match.
   *
   *  @example
   *  const pubKey = verifyJWS('eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJyZXF1Z....', { publicKeyHex: '0x12341...' })
   *
   *  @param    {String}                          jws         A JWS string to verify
   *  @param    {Array<VerificationMethod> | VerificationMethod}    pubKeys     The public keys used to verify the JWS
   *  @return   {VerificationMethod}                       The public key used to sign the JWS
   */

  function verifyJWS(jws, pubKeys) {
    const jwsDecoded = decodeJWS(jws);
    return verifyJWSDecoded(jwsDecoded, pubKeys);
  }

  const _iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";

  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }

          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }

      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }

      pact.s = state;
      pact.v = value;
      const observer = pact.o;

      if (observer) {
        observer(pact);
      }
    }
  }

  const _Pact = /*#__PURE__*/function () {
    function _Pact() {}

    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;

      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;

        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }

          return result;
        } else {
          return this;
        }
      }

      this.o = function (_this) {
        try {
          const value = _this.v;

          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }

  function _forTo(array, body, check) {
    var i = -1,
        pact,
        reject;

    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);

          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }

        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }

    _cycle();

    return pact;
  }

  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var iterator = target[_iteratorSymbol](),
          step,
          pact,
          reject;

      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);

            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }

          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle(pact || (pact = new _Pact()), 2, e);
        }
      }

      _cycle();

      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}

          return value;
        };

        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }

        _fixup();
      }

      return pact;
    } // No support for Symbol.iterator


    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    } // Handle live collections properly


    var values = [];

    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }

    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
  }

  function _for(test, update, body) {
    var stage;

    for (;;) {
      var shouldContinue = test();

      if (_isSettledPact(shouldContinue)) {
        shouldContinue = shouldContinue.v;
      }

      if (!shouldContinue) {
        return result;
      }

      if (shouldContinue.then) {
        stage = 0;
        break;
      }

      var result = body();

      if (result && result.then) {
        if (_isSettledPact(result)) {
          result = result.s;
        } else {
          stage = 1;
          break;
        }
      }

      if (update) {
        var updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          stage = 2;
          break;
        }
      }
    }

    var pact = new _Pact();

    var reject = _settle.bind(null, pact, 2);

    (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
    return pact;

    function _resumeAfterBody(value) {
      result = value;

      do {
        if (update) {
          updateValue = update();

          if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
            updateValue.then(_resumeAfterUpdate).then(void 0, reject);
            return;
          }
        }

        shouldContinue = test();

        if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
          _settle(pact, 1, result);

          return;
        }

        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          return;
        }

        result = body();

        if (_isSettledPact(result)) {
          result = result.v;
        }
      } while (!result || !result.then);

      result.then(_resumeAfterBody).then(void 0, reject);
    }

    function _resumeAfterTest(shouldContinue) {
      if (shouldContinue) {
        result = body();

        if (result && result.then) {
          result.then(_resumeAfterBody).then(void 0, reject);
        } else {
          _resumeAfterBody(result);
        }
      } else {
        _settle(pact, 1, result);
      }
    }

    function _resumeAfterUpdate() {
      if (shouldContinue = test()) {
        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        } else {
          _resumeAfterTest(shouldContinue);
        }
      } else {
        _settle(pact, 1, result);
      }
    }
  }

  function validateJWE(jwe) {
    if (!(jwe.protected && jwe.iv && jwe.ciphertext && jwe.tag)) {
      throw new Error('bad_jwe: missing properties');
    }

    if (jwe.recipients) {
      jwe.recipients.map(rec => {
        if (!(rec.header && rec.encrypted_key)) {
          throw new Error('bad_jwe: malformed recipients');
        }
      });
    }
  }

  function encodeJWE({
    ciphertext,
    tag,
    iv,
    protectedHeader,
    recipient
  }, aad) {
    const jwe = {
      protected: protectedHeader,
      iv: bytesToBase64url(iv ?? new Uint8Array(0)),
      ciphertext: bytesToBase64url(ciphertext),
      tag: bytesToBase64url(tag ?? new Uint8Array(0))
    };
    if (aad) jwe.aad = bytesToBase64url(aad);
    if (recipient) jwe.recipients = [recipient];
    return jwe;
  }

  const decryptJWE = function (jwe, decrypter) {
    try {
      let _exit;

      function _temp5(_result) {
        if (_exit) ;
        if (cleartext === null) throw new Error('failure: Failed to decrypt');
        return cleartext;
      }

      validateJWE(jwe);
      const protHeader = JSON.parse(decodeBase64url(jwe.protected));
      if (protHeader.enc !== decrypter.enc) throw new Error(`not_supported: Decrypter does not supported: '${protHeader.enc}'`);
      const sealed = toSealed(jwe.ciphertext, jwe.tag);
      const aad = stringToBytes(jwe.aad ? `${jwe.protected}.${jwe.aad}` : jwe.protected);
      let cleartext = null;

      const _temp4 = function () {
        if (protHeader.alg === 'dir' && decrypter.alg === 'dir') {
          return Promise.resolve(decrypter.decrypt(sealed, base64ToBytes(jwe.iv), aad)).then(function (_decrypter$decrypt) {
            cleartext = _decrypter$decrypt;
          });
        } else return function () {
          if (!jwe.recipients || jwe.recipients.length === 0) {
            throw new Error('bad_jwe: missing recipients');
          } else {
            let i = 0;
            return _for(function () {
              return !cleartext && i < jwe.recipients.length;
            }, function () {
              return i++;
            }, function () {
              const recipient = jwe.recipients[i];
              Object.assign(recipient.header, protHeader);

              const _temp3 = function () {
                if (recipient.header.alg === decrypter.alg) {
                  return Promise.resolve(decrypter.decrypt(sealed, base64ToBytes(jwe.iv), aad, recipient)).then(function (_decrypter$decrypt2) {
                    cleartext = _decrypter$decrypt2;
                  });
                }
              }();

              if (_temp3 && _temp3.then) return _temp3.then(function () {});
            });
          }
        }();
      }();

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const createJWE = function (cleartext, encrypters, protectedHeader = {}, aad, useSingleEphemeralKey = false) {
    try {
      if (encrypters[0].alg === 'dir') {
        if (encrypters.length > 1) throw new Error('not_supported: Can only do "dir" encryption to one key.');
        return Promise.resolve(encrypters[0].encrypt(cleartext, protectedHeader, aad)).then(function (encryptionResult) {
          return encodeJWE(encryptionResult, aad);
        });
      } else {
        const tmpEnc = encrypters[0].enc;

        if (!encrypters.reduce((acc, encrypter) => acc && encrypter.enc === tmpEnc, true)) {
          throw new Error('invalid_argument: Incompatible encrypters passed');
        }

        let cek;
        let jwe;
        let epk;

        if (useSingleEphemeralKey) {
          epk = encrypters[0].genEpk?.();
          const alg = encrypters[0].alg;
          protectedHeader = { ...protectedHeader,
            alg,
            epk: epk?.publicKeyJWK
          };
        }

        const _temp2 = _forOf(encrypters, function (encrypter) {
          const _temp = function () {
            if (!cek) {
              return Promise.resolve(encrypter.encrypt(cleartext, protectedHeader, aad, epk)).then(function (encryptionResult) {
                cek = encryptionResult.cek;
                jwe = encodeJWE(encryptionResult, aad);
              });
            } else {
              return Promise.resolve(encrypter.encryptCek?.(cek, epk)).then(function (recipient) {
                if (recipient) {
                  jwe?.recipients?.push(recipient);
                }
              });
            }
          }();

          if (_temp && _temp.then) return _temp.then(function () {});
        });

        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {
          return jwe;
        }) : jwe);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  function xc20pEncrypter(key) {
    return (cleartext, aad) => {
      const iv = utils.randomBytes(24);
      const cipher = chacha.xchacha20poly1305(key, iv, aad);
      const sealed = cipher.encrypt(cleartext);
      return {
        ciphertext: sealed.subarray(0, sealed.length - 16),
        tag: sealed.subarray(sealed.length - 16),
        iv
      };
    };
  }
  function xc20pDirEncrypter(key) {
    const encrypt = function (cleartext, protectedHeader = {}, aad) {
      try {
        const protHeader = encodeBase64url(JSON.stringify(Object.assign({
          alg
        }, protectedHeader, {
          enc
        })));
        const encodedAad = stringToBytes(aad ? `${protHeader}.${bytesToBase64url(aad)}` : protHeader);
        return Promise.resolve({ ...xc20pEncrypt(cleartext, encodedAad),
          protectedHeader: protHeader
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    const xc20pEncrypt = xc20pEncrypter(key);
    const enc = 'XC20P';
    const alg = 'dir';
    return {
      alg,
      enc,
      encrypt
    };
  }
  function xc20pDirDecrypter(key) {
    const decrypt = function (sealed, iv, aad) {
      try {
        try {
          return Promise.resolve(chacha.xchacha20poly1305(key, iv, aad).decrypt(sealed));
        } catch (error) {
          return Promise.resolve(null);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return {
      alg: 'dir',
      enc: 'XC20P',
      decrypt
    };
  }

  const createX25519EcdhEsKek = function (recipientPublicKey, senderSecret, // unused
  alg, apu, // unused
  apv, ephemeralKeyPair) {
    try {
      const crv = 'X25519';
      const keyLen = 256;
      const ephemeral = ephemeralKeyPair ? generateKeyPairFromSeed(ephemeralKeyPair.secretKey) : generateKeyPair();
      const epk = {
        kty: 'OKP',
        crv,
        x: bytesToBase64url(ephemeral.publicKey)
      };
      const sharedSecret = ed25519.x25519.getSharedSecret(ephemeral.secretKey, recipientPublicKey); // Key Encryption Key

      const consumerInfo = base64ToBytes(apv ?? '');
      const kek = concatKDF(sharedSecret, keyLen, alg, undefined, consumerInfo);
      return Promise.resolve({
        epk,
        kek
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const computeX25519EcdhEsKek = function (recipient, receiverSecret, alg) {
    try {
      function _temp2() {
        // Key Encryption Key
        let producerInfo = undefined;
        let consumerInfo = undefined;
        if (recipient.header.apu) producerInfo = base64ToBytes(recipient.header.apu);
        if (recipient.header.apv) consumerInfo = base64ToBytes(recipient.header.apv);
        return concatKDF(sharedSecret, keyLen, alg, producerInfo, consumerInfo);
      }

      const crv = 'X25519';
      const keyLen = 256;
      const header = recipient.header;
      if (header.epk?.crv !== crv || typeof header.epk.x == 'undefined') return Promise.resolve(null);
      const publicKey = base64ToBytes(header.epk.x);
      let sharedSecret;

      const _temp = function () {
        if (receiverSecret instanceof Uint8Array) {
          sharedSecret = ed25519.x25519.getSharedSecret(receiverSecret, publicKey);
        } else {
          return Promise.resolve(receiverSecret(publicKey)).then(function (_receiverSecret) {
            sharedSecret = _receiverSecret;
          });
        }
      }();

      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const createX25519Ecdh1PUv3Kek = function (recipientPublicKey, senderSecret, alg, // must be provided as this is the key agreement alg + the key wrapper alg, Example: 'ECDH-ES+A256KW'
  apu, apv, ephemeralKeyPair) {
    try {
      function _temp4() {
        const sharedSecret = new Uint8Array(zE.length + zS.length);
        sharedSecret.set(zE);
        sharedSecret.set(zS, zE.length);
        let partyUInfo = new Uint8Array(0);
        let partyVInfo = new Uint8Array(0);
        if (apu) partyUInfo = base64ToBytes(apu);
        if (apv) partyVInfo = base64ToBytes(apv); // Key Encryption Key

        const kek = concatKDF(sharedSecret, keyLen, alg, partyUInfo, partyVInfo);
        return {
          epk,
          kek
        };
      }

      const crv = 'X25519';
      const keyLen = 256;
      const ephemeral = ephemeralKeyPair ? generateKeyPairFromSeed(ephemeralKeyPair.secretKey) : generateKeyPair();
      const epk = {
        kty: 'OKP',
        crv,
        x: bytesToBase64url(ephemeral.publicKey)
      };
      const zE = ed25519.x25519.getSharedSecret(ephemeral.secretKey, recipientPublicKey); // ECDH-1PU requires additional shared secret between
      // static key of sender and static key of recipient

      let zS;

      const _temp3 = function () {
        if (senderSecret instanceof Uint8Array) {
          zS = ed25519.x25519.getSharedSecret(senderSecret, recipientPublicKey);
        } else {
          return Promise.resolve(senderSecret(recipientPublicKey)).then(function (_senderSecret) {
            zS = _senderSecret;
          });
        }
      }();

      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  const computeX25519Ecdh1PUv3Kek = function (recipient, recipientSecret, senderPublicKey, alg) {
    try {
      function _temp2() {
        const sharedSecret = new Uint8Array(zE.length + zS.length);
        sharedSecret.set(zE);
        sharedSecret.set(zS, zE.length); // Key Encryption Key

        let producerInfo;
        let consumerInfo;
        if (recipient.header.apu) producerInfo = base64ToBytes(recipient.header.apu);
        if (recipient.header.apv) consumerInfo = base64ToBytes(recipient.header.apv);
        return concatKDF(sharedSecret, keyLen, alg, producerInfo, consumerInfo);
      }

      const crv = 'X25519';
      const keyLen = 256;
      const header = recipient.header;
      if (header.epk?.crv !== crv || typeof header.epk.x == 'undefined') return Promise.resolve(null); // ECDH-1PU requires additional shared secret between
      // static key of sender and static key of recipient

      const publicKey = base64ToBytes(header.epk.x);
      let zE;
      let zS;

      const _temp = function () {
        if (recipientSecret instanceof Uint8Array) {
          zE = ed25519.x25519.getSharedSecret(recipientSecret, publicKey);
          zS = ed25519.x25519.getSharedSecret(recipientSecret, senderPublicKey);
        } else {
          return Promise.resolve(recipientSecret(publicKey)).then(function (_recipientSecret) {
            zE = _recipientSecret;
            return Promise.resolve(recipientSecret(senderPublicKey)).then(function (_recipientSecret2) {
              zS = _recipientSecret2;
            });
          });
        }
      }();

      return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Wraps an X25519 secret key into an ECDH method that can be used to compute a shared secret with a public key.
   * @param mySecretKey A `Uint8Array` of length 32 representing the bytes of my secret key
   * @returns an `ECDH` method with the signature `(theirPublicKey: Uint8Array) => Promise<Uint8Array>`
   *
   * @throws 'invalid_argument:...' if the secret key size is wrong
   */

  function createX25519ECDH(mySecretKey) {
    if (mySecretKey.length !== 32) {
      throw new Error('invalid_argument: incorrect secret key length for X25519');
    }

    return function (theirPublicKey) {
      try {
        if (theirPublicKey.length !== 32) {
          throw new Error('invalid_argument: incorrect publicKey key length for X25519');
        }

        return Promise.resolve(ed25519.x25519.getSharedSecret(mySecretKey, theirPublicKey));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  function createFullEncrypter(recipientPublicKey, senderSecret, options = {}, kekCreator, keyWrapper, contentEncrypter) {
    const encrypt = function (cleartext, protectedHeader = {}, aad, ephemeralKeyPair) {
      try {
        // we won't want alg to be set to dir from xc20pDirEncrypter
        Object.assign(protectedHeader, {
          alg: undefined
        }); // Content Encryption Key

        const cek = utils.randomBytes(32);
        return Promise.resolve(encryptCek(cek, ephemeralKeyPair)).then(function (recipient) {
          // getting an ephemeral key means the epk is set only once per all recipients
          if (ephemeralKeyPair) {
            protectedHeader.alg = `${kekCreator.alg}+${keyWrapper.alg}`;
            protectedHeader.epk = ephemeralKeyPair.publicKeyJWK;
          }

          return Promise.resolve(contentEncrypter.from(cek).encrypt(cleartext, protectedHeader, aad)).then(function (_contentEncrypter$fro) {
            return { ..._contentEncrypter$fro,
              recipient,
              cek
            };
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    const encryptCek = function (cek, ephemeralKeyPair) {
      try {
        return Promise.resolve(kekCreator.createKek(recipientPublicKey, senderSecret, `${kekCreator.alg}+${keyWrapper.alg}`, options.apu, options.apv, ephemeralKeyPair)).then(function ({
          epk,
          kek
        }) {
          return Promise.resolve(keyWrapper.from(kek).wrap(cek)).then(function (res) {
            const recipient = {
              encrypted_key: bytesToBase64url(res.ciphertext),
              header: {}
            };
            if (res.iv) recipient.header.iv = bytesToBase64url(res.iv);
            if (res.tag) recipient.header.tag = bytesToBase64url(res.tag);
            if (options.kid) recipient.header.kid = options.kid;
            if (options.apu) recipient.header.apu = options.apu;
            if (options.apv) recipient.header.apv = options.apv;

            if (!ephemeralKeyPair) {
              recipient.header.alg = `${kekCreator.alg}+${keyWrapper.alg}`;
              recipient.header.epk = epk;
            }

            return recipient;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return {
      alg: keyWrapper.alg,
      enc: contentEncrypter.enc,
      encrypt,
      encryptCek,
      genEpk: genX25519EphemeralKeyPair
    };
  }

  /**
   * @deprecated Use
   *   {@link xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2 | xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2() } instead
   */

  const resolveX25519Encrypters = function (dids, resolver) {
    try {
      const encryptersForDID = function (did, resolved = []) {
        try {
          return Promise.resolve(resolver.resolve(did)).then(function ({
            didResolutionMetadata,
            didDocument
          }) {
            function _temp2() {
              const agreementKeys = didDocument.keyAgreement?.map(key => {
                if (typeof key === 'string') {
                  return [...(didDocument.publicKey || []), ...(didDocument.verificationMethod || [])].find(pk => pk.id === key);
                }

                return key;
              })?.filter(key => typeof key !== 'undefined');
              const pks = agreementKeys?.filter(key => ['X25519KeyAgreementKey2019', 'X25519KeyAgreementKey2020', 'JsonWebKey2020', 'Multikey'].includes(key.type)) ?? [];
              if (!pks.length && !controllerEncrypters.length) throw new Error(`no_suitable_keys: Could not find X25519 key for ${did}`);
              return pks.map(pk => {
                const {
                  keyBytes,
                  keyType
                } = extractPublicKeyBytes(pk);

                if (keyType === 'X25519') {
                  return x25519Encrypter(keyBytes, pk.id);
                } else {
                  return null;
                }
              }).filter(isDefined).concat(...controllerEncrypters);
            }

            resolved.push(did);

            if (didResolutionMetadata?.error || didDocument == null) {
              throw new Error(`resolver_error: Could not resolve ${did}: ${didResolutionMetadata.error}, ${didResolutionMetadata.message}`);
            }

            let controllerEncrypters = [];

            if (!didDocument.controller && !didDocument.keyAgreement) {
              throw new Error(`no_suitable_keys: Could not find x25519 key for ${did}`);
            }

            const _temp = function () {
              if (didDocument.controller) {
                let controllers = Array.isArray(didDocument.controller) ? didDocument.controller : [didDocument.controller];
                controllers = controllers.filter(c => !resolved.includes(c));
                const encrypterPromises = controllers.map(did => encryptersForDID(did, resolved).catch(() => {
                  return [];
                }));
                return Promise.resolve(Promise.all(encrypterPromises)).then(function (encrypterArrays) {
                  controllerEncrypters = [].concat(...encrypterArrays);
                });
              }
            }();

            return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      const encrypterPromises = dids.map(did => encryptersForDID(did));
      return Promise.resolve(Promise.all(encrypterPromises)).then(function (encrypterArrays) {
        return [].concat(...encrypterArrays);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  /**
   * @deprecated Use {@link xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2 | xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2() }
   *   instead
   */

  function createAuthEncrypter(recipientPublicKey, senderSecret, options = {}) {
    return xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2(recipientPublicKey, senderSecret, options);
  }
  /**
   * @deprecated Use {@link xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2 | xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2() }
   *   instead
   */

  function createAnonEncrypter(publicKey, options = {}) {
    return xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2(publicKey, options);
  }
  /**
   * @deprecated Use
   *   {@link xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2 | xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2() } instead
   */

  function createAuthDecrypter(recipientSecret, senderPublicKey) {
    return xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2(recipientSecret, senderPublicKey);
  }
  /**
   * @deprecated Use {@link xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2 | xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2() }
   *   instead
   */

  function createAnonDecrypter(recipientSecret) {
    return xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2(recipientSecret);
  }
  function validateHeader(header) {
    if (!(header && header.epk && header.iv && header.tag)) {
      throw new Error('bad_jwe: malformed header');
    }

    return header;
  }
  const xc20pKeyWrapper = {
    from: wrappingKey => {
      const wrap = function (cek) {
        try {
          return Promise.resolve(xc20pEncrypter(wrappingKey)(cek));
        } catch (e) {
          return Promise.reject(e);
        }
      };

      return {
        wrap
      };
    },
    alg: 'XC20PKW'
  };
  /**
   * @deprecated Use {@link xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2 | xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2() }
   *   instead
   */

  function x25519Encrypter(publicKey, kid, apv) {
    return xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2(publicKey, {
      kid,
      apv
    });
  }
  /**
   * Recommended encrypter for anonymous encryption (i.e. no sender authentication).
   * Uses {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | ECDH-ES+XC20PKW v2}.
   *
   * @param recipientPublicKey - the byte array representing the recipient public key
   * @param options - {@link AnonEncryptParams} used to specify the recipient key ID (`kid`)
   *
   * @returns an {@link Encrypter} instance usable with {@link createJWE}
   *
   * NOTE: ECDH-ES+XC20PKW is a proposed draft in IETF and not a standard yet and
   * is subject to change as new revisions or until the official CFRG specification is released.
   */

  function xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2(recipientPublicKey, options = {}) {
    return createFullEncrypter(recipientPublicKey, undefined, options, {
      createKek: createX25519EcdhEsKek,
      alg: 'ECDH-ES'
    }, xc20pKeyWrapper, {
      from: cek => xc20pDirEncrypter(cek),
      enc: 'XC20P'
    });
  }
  /**
   *  Recommended encrypter for authenticated encryption (i.e. sender authentication and requires
   *  sender private key to encrypt the data).
   *  Uses {@link https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03 | ECDH-1PU v3 } and
   *  {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | XC20PKW v2 }.
   *
   *  @param recipientPublicKey - the byte array representing the recipient public key
   *  @param senderSecret - either a Uint8Array representing the sender secret key or
   *    an ECDH function that wraps the key and can promise a shared secret given a public key
   *  @param options - {@link AuthEncryptParams} used to specify extra header parameters
   *
   *  @returns an {@link Encrypter} instance usable with {@link createJWE}
   *
   *  NOTE: ECDH-1PU and XC20PKW are proposed drafts in IETF and not a standard yet and
   *  are subject to change as new revisions or until the official CFRG specification are released.
   *
   * Implements ECDH-1PU+XC20PKW with XChaCha20Poly1305 based on the following specs:
   *   - {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | XC20PKW}
   *   - {@link https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03 | ECDH-1PU}
   */

  function xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2(recipientPublicKey, senderSecret, options = {}) {
    return createFullEncrypter(recipientPublicKey, senderSecret, options, {
      createKek: createX25519Ecdh1PUv3Kek,
      alg: 'ECDH-1PU'
    }, xc20pKeyWrapper, {
      from: cek => xc20pDirEncrypter(cek),
      enc: 'XC20P'
    });
  }
  function x25519Decrypter(receiverSecret) {
    return xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2(receiverSecret);
  }
  /**
   * Recommended decrypter for anonymous encryption (i.e. no sender authentication).
   * Uses {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | ECDH-ES+XC20PKW v2 }.
   *
   * @param recipientSecret - either a Uint8Array representing the recipient secret key or
   *   an ECDH function that wraps the key and can promise a shared secret given a public key
   *
   * @returns a {@link Decrypter} instance usable with {@link decryptJWE}
   *
   * NOTE: ECDH-ES+XC20PKW is a proposed draft in IETF and not a standard yet and
   * is subject to change as new revisions or until the official CFRG specification is released.
   *
   * @beta
   */

  function xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2(recipientSecret) {
    const decrypt = function (sealed, iv, aad, recipient) {
      try {
        recipient = recipient;
        const header = validateHeader(recipient.header);
        return Promise.resolve(computeX25519EcdhEsKek(recipient, recipientSecret, alg)).then(function (kek) {
          if (!kek) return null; // Content Encryption Key

          const sealedCek = toSealed(recipient.encrypted_key, header.tag);
          return Promise.resolve(xc20pDirDecrypter(kek).decrypt(sealedCek, base64ToBytes(header.iv))).then(function (cek) {
            return cek === null ? null : xc20pDirDecrypter(cek).decrypt(sealed, iv, aad);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    const alg = 'ECDH-ES+XC20PKW';
    const enc = 'XC20P';
    return {
      alg,
      enc,
      decrypt
    };
  }
  /**
   * Recommended decrypter for authenticated encryption (i.e. sender authentication and requires
   * sender public key to decrypt the data).
   * Uses {@link https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03 | ECDH-1PU v3 } and
   * {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | XC20PKW v2 }.
   *
   * @param recipientSecret - either a Uint8Array representing the recipient secret key or
   *   an ECDH function that wraps the key and can promise a shared secret given a public key
   * @param senderPublicKey - the byte array representing the sender public key
   *
   * @returns a {@link Decrypter} instance usable with {@link decryptJWE}
   *
   * NOTE: ECDH-1PU and XC20PKW are proposed drafts in IETF and not a standard yet and
   * are subject to change as new revisions or until the official CFRG specification are released.
   *
   * @beta
   *
   * Implements ECDH-1PU+XC20PKW with XChaCha20Poly1305 based on the following specs:
   *   - {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | XC20PKW}
   *   - {@link https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03 | ECDH-1PU}
   */

  function xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2(recipientSecret, senderPublicKey) {
    const decrypt = function (sealed, iv, aad, recipient) {
      try {
        recipient = recipient;
        const header = validateHeader(recipient.header);
        return Promise.resolve(computeX25519Ecdh1PUv3Kek(recipient, recipientSecret, senderPublicKey, alg)).then(function (kek) {
          if (!kek) return null; // Content Encryption Key

          const sealedCek = toSealed(recipient.encrypted_key, header.tag);
          return Promise.resolve(xc20pDirDecrypter(kek).decrypt(sealedCek, base64ToBytes(header.iv))).then(function (cek) {
            return cek === null ? null : xc20pDirDecrypter(cek).decrypt(sealed, iv, aad);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    const alg = 'ECDH-1PU+XC20PKW';
    const enc = 'XC20P';
    return {
      alg,
      enc,
      decrypt
    };
  }

  exports.ES256KSigner = ES256KSigner;
  exports.ES256Signer = ES256Signer;
  exports.EdDSASigner = EdDSASigner;
  exports.EllipticSigner = EllipticSigner;
  exports.JWT_ERROR = JWT_ERROR;
  exports.NaclSigner = NaclSigner;
  exports.SimpleSigner = SimpleSigner;
  exports.base58ToBytes = base58ToBytes;
  exports.base64ToBytes = base64ToBytes;
  exports.bytesToBase58 = bytesToBase58;
  exports.bytesToBase64url = bytesToBase64url;
  exports.bytesToHex = bytesToHex;
  exports.bytesToMultibase = bytesToMultibase;
  exports.computeX25519Ecdh1PUv3Kek = computeX25519Ecdh1PUv3Kek;
  exports.computeX25519EcdhEsKek = computeX25519EcdhEsKek;
  exports.concatKDF = concatKDF;
  exports.createAnonDecrypter = createAnonDecrypter;
  exports.createAnonEncrypter = createAnonEncrypter;
  exports.createAuthDecrypter = createAuthDecrypter;
  exports.createAuthEncrypter = createAuthEncrypter;
  exports.createFullEncrypter = createFullEncrypter;
  exports.createJWE = createJWE;
  exports.createJWS = createJWS;
  exports.createJWT = createJWT;
  exports.createMultisignatureJWT = createMultisignatureJWT;
  exports.createX25519ECDH = createX25519ECDH;
  exports.createX25519Ecdh1PUv3Kek = createX25519Ecdh1PUv3Kek;
  exports.createX25519EcdhEsKek = createX25519EcdhEsKek;
  exports.decodeJWT = decodeJWT;
  exports.decryptJWE = decryptJWE;
  exports.extractPublicKeyBytes = extractPublicKeyBytes;
  exports.genX25519EphemeralKeyPair = genX25519EphemeralKeyPair;
  exports.hexToBytes = hexToBytes;
  exports.multibaseToBytes = multibaseToBytes;
  exports.resolveX25519Encrypters = resolveX25519Encrypters;
  exports.supportedCodecs = supportedCodecs;
  exports.toEthereumAddress = toEthereumAddress;
  exports.verifyJWS = verifyJWS;
  exports.verifyJWT = verifyJWT;
  exports.x25519Decrypter = x25519Decrypter;
  exports.x25519Encrypter = x25519Encrypter;
  exports.xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2 = xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2;
  exports.xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2 = xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2;
  exports.xc20pDirDecrypter = xc20pDirDecrypter;
  exports.xc20pDirEncrypter = xc20pDirEncrypter;

})));
//# sourceMappingURL=index.umd.js.map
