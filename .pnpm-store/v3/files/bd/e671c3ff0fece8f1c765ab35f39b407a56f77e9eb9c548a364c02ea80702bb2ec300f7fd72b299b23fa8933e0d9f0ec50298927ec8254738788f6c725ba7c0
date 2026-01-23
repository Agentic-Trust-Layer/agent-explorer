"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }



var _chunkYBVGMN76cjs = require('./chunk-YBVGMN76.cjs');



var _chunkBL3ZRTKFcjs = require('./chunk-BL3ZRTKF.cjs');
require('./chunk-JN5LSN7D.cjs');






var _chunkYFV73Y2Dcjs = require('./chunk-YFV73Y2D.cjs');



var _chunk2YEKEDAFcjs = require('./chunk-2YEKEDAF.cjs');
require('./chunk-HOWFH4O7.cjs');




var _chunkCTZHYDS4cjs = require('./chunk-CTZHYDS4.cjs');



var _chunkT6PSFUOZcjs = require('./chunk-T6PSFUOZ.cjs');










var _chunk5GYFPRIZcjs = require('./chunk-5GYFPRIZ.cjs');

// src/toMetaMaskSmartAccount.ts




var _delegationabis = require('@metamask/delegation-abis');




var _accountabstraction = require('viem/account-abstraction');

// src/signer.ts
var _viem = require('viem');

// src/signatures.ts

var signatureTypes = ["ECDSA"];
var aggregateSignature = ({
  signatures
}) => {
  if (signatures.length === 0) {
    return "0x";
  }
  for (const { type } of signatures) {
    if (!signatureTypes.includes(type)) {
      throw new Error(`Invalid signature type: ${type}`);
    }
  }
  const sortedSignatures = [...signatures].sort(
    (a, b) => a.signer.localeCompare(b.signer)
  );
  return _viem.concat.call(void 0, sortedSignatures.map(({ signature }) => signature));
};

// src/signer.ts
var EOA_STUB_SIGNATURE = "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000011b";
var resolveSignerFromWalletConfig = (config) => {
  return {
    signMessage: config.walletClient.signMessage,
    signTypedData: async (typedData) => {
      return config.walletClient.signTypedData(typedData);
    },
    getStubSignature: async () => EOA_STUB_SIGNATURE
  };
};
var resolveSignerFromAccountConfig = (config) => {
  return {
    signMessage: config.account.signMessage,
    signTypedData: config.account.signTypedData,
    getStubSignature: async () => EOA_STUB_SIGNATURE
  };
};
var resolveHybridSigner = (config) => {
  if ("walletClient" in config) {
    return resolveSignerFromWalletConfig(config);
  } else if ("account" in config) {
    const { signMessage: signMessage2, signTypedData: signTypedData2, getStubSignature: getStubSignature2 } = resolveSignerFromAccountConfig(config);
    if (!signMessage2) {
      throw new Error("Account does not support signMessage");
    }
    if (!signTypedData2) {
      throw new Error("Account does not support signTypedData");
    }
    return {
      signMessage: signMessage2,
      signTypedData: signTypedData2,
      getStubSignature: getStubSignature2
    };
  }
  const { keyId, webAuthnAccount } = config;
  if (webAuthnAccount.type !== "webAuthn") {
    throw new Error("Account is not a webAuthn account");
  }
  const encodeSignature = ({ signature, webauthn }) => _chunkYFV73Y2Dcjs.encodeDeleGatorSignature.call(void 0, 
    keyId,
    signature,
    webauthn.clientDataJSON,
    webauthn.authenticatorData
  );
  const signMessage = async (args) => webAuthnAccount.signMessage(args).then(encodeSignature);
  const signTypedData = async (typedDataDefinition) => webAuthnAccount.signTypedData(typedDataDefinition).then(encodeSignature);
  const getStubSignature = async () => _chunkYFV73Y2Dcjs.createDummyWebAuthnSignature.call(void 0, keyId);
  return {
    signMessage,
    signTypedData,
    getStubSignature
  };
};
var resolveMultiSigSigner = (config) => {
  const resolvedSigners = config.map((signer) => {
    let individualSignMessage;
    let individualSignTypedData;
    let address;
    if ("walletClient" in signer) {
      const { signMessage: signMessage2, signTypedData: signTypedData2 } = resolveSignerFromWalletConfig(signer);
      individualSignMessage = signMessage2;
      individualSignTypedData = signTypedData2;
      address = signer.walletClient.account.address;
    } else {
      const { signMessage: signMessage2, signTypedData: signTypedData2 } = resolveSignerFromAccountConfig(signer);
      if (!signMessage2) {
        throw new Error("Account does not support signMessage");
      }
      if (!signTypedData2) {
        throw new Error("Account does not support signTypedData");
      }
      individualSignMessage = signMessage2;
      individualSignTypedData = signTypedData2;
      address = signer.account.address;
    }
    return {
      address,
      individualSignMessage,
      individualSignTypedData
    };
  });
  const signMessage = async (args) => {
    const addressAndSignatures = resolvedSigners.map(
      async ({ individualSignMessage, address }) => ({
        signature: await individualSignMessage(args),
        signer: address,
        type: "ECDSA"
      })
    );
    const signatures = await Promise.all(addressAndSignatures);
    return aggregateSignature({
      signatures
    });
  };
  const signTypedData = async (typedDataDefinition) => {
    const addressAndSignatures = resolvedSigners.map(
      async ({ individualSignTypedData, address }) => ({
        signature: await individualSignTypedData(typedDataDefinition),
        signer: address,
        type: "ECDSA"
      })
    );
    const signatures = await Promise.all(addressAndSignatures);
    return aggregateSignature({
      signatures
    });
  };
  const getStubSignature = async () => _viem.concat.call(void 0, resolvedSigners.map(() => EOA_STUB_SIGNATURE));
  return {
    signMessage,
    signTypedData,
    getStubSignature
  };
};
var resolveStateless7702Signer = (config) => {
  if ("walletClient" in config) {
    return resolveSignerFromWalletConfig(config);
  } else if ("account" in config) {
    const { signMessage, signTypedData, getStubSignature } = resolveSignerFromAccountConfig(config);
    if (!signMessage) {
      throw new Error("Account does not support signMessage");
    }
    if (!signTypedData) {
      throw new Error("Account does not support signTypedData");
    }
    return {
      signMessage,
      signTypedData,
      getStubSignature
    };
  }
  throw new Error("Invalid signer config");
};
var resolveSigner = (config) => {
  const { implementation } = config;
  if (implementation === "Hybrid" /* Hybrid */) {
    return resolveHybridSigner(config.signer);
  } else if (implementation === "MultiSig" /* MultiSig */) {
    return resolveMultiSigSigner(config.signer);
  } else if (implementation === "Stateless7702" /* Stateless7702 */) {
    return resolveStateless7702Signer(
      config.signer
    );
  }
  throw new Error(`Implementation type '${implementation}' not supported`);
};

// src/toMetaMaskSmartAccount.ts
var ENTRYPOINT_VERSION = "0.7";
async function toMetaMaskSmartAccount(params) {
  const {
    client,
    client: { chain },
    implementation
  } = params;
  if (!chain) {
    throw new Error("Chain not specified");
  }
  const signer = resolveSigner({
    implementation,
    signer: params.signer
  });
  const environment = _nullishCoalesce(params.environment, () => ( _chunkCTZHYDS4cjs.getDeleGatorEnvironment.call(void 0, chain.id)));
  let address, factoryData;
  if (params.address) {
    factoryData = void 0;
    address = params.address;
  } else {
    if (implementation === "Stateless7702" /* Stateless7702 */) {
      throw new Error("Stateless7702 does not support counterfactual accounts");
    }
    const accountData = await _chunkYFV73Y2Dcjs.getCounterfactualAccountData.call(void 0, {
      factory: environment.SimpleFactory,
      implementations: environment.implementations,
      implementation,
      deployParams: params.deployParams,
      deploySalt: params.deploySalt
    });
    address = accountData.address;
    factoryData = accountData.factoryData;
  }
  const entryPoint = {
    abi: _accountabstraction.entryPoint07Abi,
    address: environment.EntryPoint,
    version: ENTRYPOINT_VERSION
  };
  const { abi, contractName } = {
    ["Hybrid" /* Hybrid */]: {
      contractName: "HybridDeleGator",
      abi: _delegationabis.HybridDeleGator.abi
    },
    ["MultiSig" /* MultiSig */]: {
      contractName: "MultiSigDeleGator",
      abi: _delegationabis.MultiSigDeleGator.abi
    },
    ["Stateless7702" /* Stateless7702 */]: {
      contractName: "EIP7702StatelessDeleGator",
      abi: _delegationabis.EIP7702StatelessDeleGator.abi
    }
  }[implementation];
  const getFactoryArgs = async () => {
    if (factoryData === void 0) {
      throw new Error(
        "Deploy params were not provided, so factory args cannot be inferred"
      );
    }
    return {
      factoryData,
      factory: environment.SimpleFactory
    };
  };
  const signDelegation2 = async (delegationParams) => {
    const { delegation, chainId } = delegationParams;
    const delegationStruct = _chunk5GYFPRIZcjs.toDelegationStruct.call(void 0, {
      ...delegation,
      signature: "0x"
    });
    const signature = signer.signTypedData({
      domain: {
        chainId: _nullishCoalesce(chainId, () => ( chain.id)),
        name: "DelegationManager",
        version: "1",
        verifyingContract: environment.DelegationManager
      },
      types: _chunk5GYFPRIZcjs.SIGNABLE_DELEGATION_TYPED_DATA,
      primaryType: "Delegation",
      message: delegationStruct
    });
    return signature;
  };
  const signUserOperation2 = async (userOpParams) => {
    const { chainId } = userOpParams;
    const packedUserOp = _accountabstraction.toPackedUserOperation.call(void 0, {
      sender: address,
      ...userOpParams,
      signature: "0x"
    });
    const signature = await signer.signTypedData({
      domain: {
        chainId: _nullishCoalesce(chainId, () => ( chain.id)),
        name: contractName,
        version: "1",
        verifyingContract: address
      },
      types: _chunk2YEKEDAFcjs.SIGNABLE_USER_OP_TYPED_DATA,
      primaryType: "PackedUserOperation",
      message: { ...packedUserOp, entryPoint: entryPoint.address }
    });
    return signature;
  };
  const getAddress = async () => address;
  const getNonce = async () => _chunkBL3ZRTKFcjs.read.call(void 0, {
    client,
    entryPoint: environment.EntryPoint,
    contractAddress: address,
    key: 0n
  });
  const encodeCalls = async (calls) => _chunkYFV73Y2Dcjs.encodeCallsForCaller.call(void 0, address, calls);
  const smartAccount = await _accountabstraction.toSmartAccount.call(void 0, {
    abi,
    client,
    entryPoint,
    environment,
    getAddress,
    getFactoryArgs,
    encodeCalls,
    getNonce,
    signUserOperation: signUserOperation2,
    signDelegation: signDelegation2,
    ...signer
  });
  if (implementation === "Stateless7702" /* Stateless7702 */) {
    return {
      ...smartAccount,
      isDeployed: async () => _chunkYBVGMN76cjs.isValid7702Implementation.call(void 0, {
        client,
        accountAddress: address,
        environment
      })
    };
  }
  return smartAccount;
}

// src/actions/caveatEnforcerClient.ts
function createCaveatEnforcerClient({
  client,
  environment
}) {
  return client.extend(_chunkYBVGMN76cjs.caveatEnforcerActions.call(void 0, { environment }));
}

// src/actions/infuraBundlerClient.ts



var infuraBundlerActions = () => (client) => ({
  /**
   * Get user operation gas prices from Infura bundler.
   * Calls the pimlico_getUserOperationGasPrice RPC method.
   *
   * @returns Promise resolving to gas price tiers (slow, standard, fast).
   * @example
   * ```typescript
   * const gasPrices = await bundlerClient.getUserOperationGasPrice();
   * console.log(gasPrices.standard.maxFeePerGas);
   * ```
   */
  async getUserOperationGasPrice() {
    const pimlicoClient = client;
    return await pimlicoClient.request({
      method: "pimlico_getUserOperationGasPrice",
      params: []
    });
  }
});
function createInfuraBundlerClient(config) {
  const baseBundlerClient = _accountabstraction.createBundlerClient.call(void 0, config);
  return baseBundlerClient.extend(
    infuraBundlerActions()
  );
}





















exports.ANY_BENEFICIARY = _chunk5GYFPRIZcjs.ANY_BENEFICIARY; exports.BalanceChangeType = _chunk5GYFPRIZcjs.BalanceChangeType; exports.ExecutionMode = _chunkT6PSFUOZcjs.ExecutionMode; exports.Implementation = _chunkYFV73Y2Dcjs.Implementation; exports.PREFERRED_VERSION = _chunkCTZHYDS4cjs.PREFERRED_VERSION; exports.ROOT_AUTHORITY = _chunk5GYFPRIZcjs.ROOT_AUTHORITY; exports.actions = _chunkYBVGMN76cjs.actions_exports; exports.aggregateSignature = aggregateSignature; exports.contracts = _chunkBL3ZRTKFcjs.contracts_exports; exports.createCaveat = _chunk5GYFPRIZcjs.createCaveat; exports.createCaveatEnforcerClient = createCaveatEnforcerClient; exports.createDelegation = _chunk5GYFPRIZcjs.createDelegation; exports.createExecution = _chunkT6PSFUOZcjs.createExecution; exports.createInfuraBundlerClient = createInfuraBundlerClient; exports.createOpenDelegation = _chunk5GYFPRIZcjs.createOpenDelegation; exports.getDeleGatorEnvironment = _chunkCTZHYDS4cjs.getDeleGatorEnvironment; exports.redeemDelegations = _chunkCTZHYDS4cjs.redeemDelegations; exports.signDelegation = _chunk5GYFPRIZcjs.signDelegation; exports.signUserOperation = _chunk2YEKEDAFcjs.signUserOperation; exports.toMetaMaskSmartAccount = toMetaMaskSmartAccount;
//# sourceMappingURL=index.cjs.map