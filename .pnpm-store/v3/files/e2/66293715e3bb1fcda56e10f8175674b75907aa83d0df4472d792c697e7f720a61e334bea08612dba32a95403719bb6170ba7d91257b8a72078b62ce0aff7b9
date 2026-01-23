(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('did-jwt'), require('ethr-did-resolver'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', 'did-jwt', 'ethr-did-resolver', 'ethers'], factory) :
  (global = global || self, factory(global.ethrDid = {}, global.didJwt, global.ethrDidResolver, global.ethers));
})(this, (function (exports, didJwt, ethrDidResolver, ethers) {
  exports.DelegateTypes = void 0;
  (function (DelegateTypes) {
    DelegateTypes["veriKey"] = "veriKey";
    DelegateTypes["sigAuth"] = "sigAuth";
    DelegateTypes["enc"] = "enc";
  })(exports.DelegateTypes || (exports.DelegateTypes = {}));
  class EthrDID {
    constructor(conf) {
      this.did = void 0;
      this.address = void 0;
      this.signer = void 0;
      this.alg = void 0;
      this.owner = void 0;
      this.controller = void 0;
      const {
        address,
        publicKey,
        network
      } = ethrDidResolver.interpretIdentifier(conf.identifier);
      const chainNameOrId = typeof conf.chainNameOrId === 'bigint' || typeof conf.chainNameOrId === 'number' ? ethers.toQuantity(conf.chainNameOrId) : conf.chainNameOrId;
      if (conf.provider || conf.rpcUrl || conf.web3) {
        let txSigner = conf.txSigner;
        if (conf.privateKey && typeof txSigner === 'undefined') {
          txSigner = new ethers.Wallet(conf.privateKey, conf.provider || conf.web3?.currentProvider);
        }
        this.controller = new ethrDidResolver.EthrDidController(conf.identifier, undefined, txSigner, chainNameOrId, conf.provider || conf.web3?.currentProvider, conf.rpcUrl, conf.registry || ethrDidResolver.REGISTRY);
        this.did = this.controller.did;
      } else {
        const net = network || chainNameOrId;
        let networkString = net ? `${net}:` : '';
        if (networkString in ['mainnet:', '0x1:']) {
          networkString = '';
        }
        this.did = typeof publicKey === 'string' ? `did:ethr:${networkString}${publicKey}` : `did:ethr:${networkString}${address}`;
      }
      this.address = address;
      if (conf.signer) {
        this.signer = conf.signer;
        this.alg = conf.alg;
        if (!this.alg) {
          console.warn('A JWT signer was specified but no algorithm was set. Please set the `alg` parameter when calling `new EthrDID()`');
        }
      } else if (conf.privateKey) {
        this.signer = didJwt.ES256KSigner(didJwt.hexToBytes(conf.privateKey), true);
        this.alg = 'ES256K-R';
      }
    }
    static createKeyPair(chainNameOrId) {
      const wallet = ethers.Wallet.createRandom();
      const privateKey = wallet.privateKey;
      const address = ethers.computeAddress(privateKey);
      const publicKey = wallet.publicKey;
      const net = typeof chainNameOrId === 'number' ? ethers.toQuantity(chainNameOrId) : chainNameOrId;
      const identifier = net ? `did:ethr:${net}:${publicKey}` : publicKey;
      return {
        address,
        privateKey,
        publicKey,
        identifier
      };
    }
    lookupOwner(cache = true) {
      try {
        const _this = this;
        if (typeof _this.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        if (cache && _this.owner) return Promise.resolve(_this.owner);
        return Promise.resolve(_this.controller?.getOwner(_this.address));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    changeOwner(newOwner, txOptions) {
      try {
        const _this2 = this;
        if (typeof _this2.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this2.lookupOwner()).then(function (owner) {
          return Promise.resolve(_this2.controller.changeOwner(newOwner, {
            ...txOptions,
            from: owner
          })).then(function (receipt) {
            _this2.owner = newOwner;
            return receipt.hash;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    createChangeOwnerHash(newOwner) {
      try {
        const _this3 = this;
        if (typeof _this3.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this3.controller.createChangeOwnerHash(newOwner));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    changeOwnerSigned(newOwner, signature, txOptions) {
      try {
        const _this4 = this;
        if (typeof _this4.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this4.controller.changeOwnerSigned(newOwner, signature, txOptions)).then(function (receipt) {
          _this4.owner = newOwner;
          return receipt.hash;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    addDelegate(delegate, delegateOptions, txOptions = {}) {
      try {
        const _this5 = this;
        if (typeof _this5.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this5.lookupOwner()).then(function (owner) {
          return Promise.resolve(_this5.controller.addDelegate(delegateOptions?.delegateType || exports.DelegateTypes.veriKey, delegate, delegateOptions?.expiresIn || 86400, {
            ...txOptions,
            from: owner
          })).then(function (receipt) {
            return receipt.hash;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    createAddDelegateHash(delegateType, delegateAddress, exp) {
      try {
        const _this6 = this;
        if (typeof _this6.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this6.controller.createAddDelegateHash(delegateType, delegateAddress, exp));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    addDelegateSigned(delegate, signature, delegateOptions, txOptions = {}) {
      try {
        const _this7 = this;
        if (typeof _this7.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this7.controller.addDelegateSigned(delegateOptions?.delegateType || exports.DelegateTypes.veriKey, delegate, delegateOptions?.expiresIn || 86400, signature, txOptions)).then(function (receipt) {
          return receipt.hash;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    revokeDelegate(delegate, delegateType, txOptions = {}) {
      try {
        const _this8 = this;
        if (delegateType === undefined) delegateType = exports.DelegateTypes.veriKey;
        if (typeof _this8.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this8.lookupOwner()).then(function (owner) {
          return Promise.resolve(_this8.controller.revokeDelegate(delegateType, delegate, {
            ...txOptions,
            from: owner
          })).then(function (receipt) {
            return receipt.hash;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    createRevokeDelegateHash(delegateType, delegateAddress) {
      try {
        const _this9 = this;
        if (typeof _this9.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this9.controller.createRevokeDelegateHash(delegateType, delegateAddress));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    revokeDelegateSigned(delegate, delegateType, signature, txOptions = {}) {
      try {
        const _this10 = this;
        if (delegateType === undefined) delegateType = exports.DelegateTypes.veriKey;
        if (typeof _this10.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this10.controller.revokeDelegateSigned(delegateType, delegate, signature, txOptions)).then(function (receipt) {
          return receipt.hash;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    setAttribute(key, value, expiresIn = 86400, /** @deprecated please use `txOptions.gasLimit` */
    gasLimit, txOptions = {}) {
      try {
        const _this11 = this;
        if (typeof _this11.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this11.lookupOwner()).then(function (owner) {
          return Promise.resolve(_this11.controller.setAttribute(key, attributeToHex(key, value), expiresIn, {
            gasLimit,
            ...txOptions,
            from: owner
          })).then(function (receipt) {
            return receipt.hash;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    createSetAttributeHash(attrName, attrValue, exp) {
      try {
        const _this12 = this;
        if (typeof _this12.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this12.controller.createSetAttributeHash(attrName, attrValue, exp));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    setAttributeSigned(key, value, expiresIn = 86400, signature, txOptions = {}) {
      try {
        const _this13 = this;
        if (typeof _this13.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this13.controller.setAttributeSigned(key, attributeToHex(key, value), expiresIn, signature, txOptions)).then(function (receipt) {
          return receipt.hash;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    revokeAttribute(key, value, /** @deprecated please use `txOptions.gasLimit` */
    gasLimit, txOptions = {}) {
      try {
        const _this14 = this;
        if (typeof _this14.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this14.lookupOwner()).then(function (owner) {
          return Promise.resolve(_this14.controller.revokeAttribute(key, attributeToHex(key, value), {
            gasLimit,
            ...txOptions,
            from: owner
          })).then(function (receipt) {
            return receipt.hash;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    createRevokeAttributeHash(attrName, attrValue) {
      try {
        const _this15 = this;
        if (typeof _this15.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this15.controller.createRevokeAttributeHash(attrName, attrValue));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    revokeAttributeSigned(key, value, signature, txOptions = {}) {
      try {
        const _this16 = this;
        if (typeof _this16.controller === 'undefined') {
          throw new Error('a web3 provider configuration is needed for network operations');
        }
        return Promise.resolve(_this16.controller.revokeAttributeSigned(key, attributeToHex(key, value), signature, txOptions)).then(function (receipt) {
          return receipt.hash;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    } // Create a temporary signing delegate able to sign JWT on behalf of identity
    createSigningDelegate(delegateType, expiresIn = 86400) {
      try {
        const _this17 = this;
        if (delegateType === undefined) delegateType = exports.DelegateTypes.veriKey;
        const kp = EthrDID.createKeyPair();
        _this17.signer = didJwt.ES256KSigner(didJwt.hexToBytes(kp.privateKey), true);
        return Promise.resolve(_this17.addDelegate(kp.address, {
          delegateType,
          expiresIn
        })).then(function (txHash) {
          return {
            kp,
            txHash
          };
        });
      } catch (e) {
        return Promise.reject(e);
      }
    } // eslint-disable-next-line
    signJWT(payload, expiresIn) {
      try {
        const _this18 = this;
        if (typeof _this18.signer !== 'function') {
          throw new Error('No signer configured');
        }
        const options = {
          signer: _this18.signer,
          alg: 'ES256K-R',
          issuer: _this18.did
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (expiresIn) options['expiresIn'] = expiresIn;
        return Promise.resolve(didJwt.createJWT(payload, options));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    verifyJWT(jwt, resolver, audience) {
      try {
        const _this19 = this;
        if (audience === undefined) audience = _this19.did;
        return Promise.resolve(didJwt.verifyJWT(jwt, {
          resolver,
          audience
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
  function attributeToHex(key, value) {
    if (value instanceof Uint8Array || ethers.isBytesLike(value)) {
      return ethers.hexlify(value);
    }
    const matchKeyWithEncoding = key.match(/^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/);
    const encoding = matchKeyWithEncoding?.[6];
    const matchHexString = value.match(/^0x[0-9a-fA-F]*$/);
    if (encoding && !matchHexString) {
      if (encoding === 'base64') {
        return ethers.hexlify(ethers.decodeBase64(value));
      }
      if (encoding === 'base58') {
        return ethers.hexlify(ethers.toBeHex(ethers.decodeBase58(value)));
      }
    } else if (matchHexString) {
      return value;
    }
    return ethers.hexlify(ethers.toUtf8Bytes(value));
  }

  exports.EthrDID = EthrDID;

}));
//# sourceMappingURL=index.umd.js.map
