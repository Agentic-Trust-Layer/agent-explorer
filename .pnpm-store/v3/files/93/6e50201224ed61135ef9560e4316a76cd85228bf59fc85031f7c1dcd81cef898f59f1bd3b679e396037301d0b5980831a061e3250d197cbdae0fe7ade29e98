import {
  actions_exports,
  caveatEnforcerActions,
  isValid7702Implementation
} from "./chunk-2HNEALPY.mjs";
import {
  contracts_exports,
  read
} from "./chunk-KTAXE6PZ.mjs";
import "./chunk-F5U55BIP.mjs";
import {
  Implementation,
  TransferWindow,
  createDummyWebAuthnSignature,
  encodeCallsForCaller,
  encodeDeleGatorSignature,
  getCounterfactualAccountData
} from "./chunk-Y5MOTV4T.mjs";
import {
  PREFERRED_VERSION,
  SIGNABLE_USER_OP_TYPED_DATA,
  getSmartAccountsEnvironment,
  redeemDelegations,
  signUserOperation
} from "./chunk-3JBYBEYP.mjs";
import "./chunk-72UQFUL5.mjs";
import {
  ExecutionMode,
  createExecution
} from "./chunk-CPLIK3VF.mjs";
import {
  ANY_BENEFICIARY,
  BalanceChangeType,
  ROOT_AUTHORITY,
  SIGNABLE_DELEGATION_TYPED_DATA,
  createCaveat,
  createDelegation,
  createOpenDelegation,
  signDelegation,
  toDelegationStruct
} from "./chunk-BJGZGTRU.mjs";

// src/toMetaMaskSmartAccount.ts
import {
  EIP7702StatelessDeleGator,
  HybridDeleGator,
  MultiSigDeleGator
} from "@metamask/delegation-abis";
import {
  entryPoint07Abi,
  toPackedUserOperation,
  toSmartAccount
} from "viem/account-abstraction";

// src/signer.ts
import { concat as concat2 } from "viem";

// src/signatures.ts
import { concat } from "viem";
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
  return concat(sortedSignatures.map(({ signature }) => signature));
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
  const encodeSignature = ({ signature, webauthn }) => encodeDeleGatorSignature(
    keyId,
    signature,
    webauthn.clientDataJSON,
    webauthn.authenticatorData
  );
  const signMessage = async (args) => webAuthnAccount.signMessage(args).then(encodeSignature);
  const signTypedData = async (typedDataDefinition) => webAuthnAccount.signTypedData(typedDataDefinition).then(encodeSignature);
  const getStubSignature = async () => createDummyWebAuthnSignature(keyId);
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
  const getStubSignature = async () => concat2(resolvedSigners.map(() => EOA_STUB_SIGNATURE));
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
  const environment = params.environment ?? getSmartAccountsEnvironment(chain.id);
  let address, factoryData;
  if (params.address) {
    factoryData = void 0;
    address = params.address;
  } else {
    if (implementation === "Stateless7702" /* Stateless7702 */) {
      throw new Error("Stateless7702 does not support counterfactual accounts");
    }
    const accountData = await getCounterfactualAccountData({
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
    abi: entryPoint07Abi,
    address: environment.EntryPoint,
    version: ENTRYPOINT_VERSION
  };
  const { abi, contractName } = {
    ["Hybrid" /* Hybrid */]: {
      contractName: "HybridDeleGator",
      abi: HybridDeleGator.abi
    },
    ["MultiSig" /* MultiSig */]: {
      contractName: "MultiSigDeleGator",
      abi: MultiSigDeleGator.abi
    },
    ["Stateless7702" /* Stateless7702 */]: {
      contractName: "EIP7702StatelessDeleGator",
      abi: EIP7702StatelessDeleGator.abi
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
    const delegationStruct = toDelegationStruct({
      ...delegation,
      signature: "0x"
    });
    const signature = signer.signTypedData({
      domain: {
        chainId: chainId ?? chain.id,
        name: "DelegationManager",
        version: "1",
        verifyingContract: environment.DelegationManager
      },
      types: SIGNABLE_DELEGATION_TYPED_DATA,
      primaryType: "Delegation",
      message: delegationStruct
    });
    return signature;
  };
  const signUserOperation2 = async (userOpParams) => {
    const { chainId } = userOpParams;
    const packedUserOp = toPackedUserOperation({
      sender: address,
      ...userOpParams,
      signature: "0x"
    });
    const signature = await signer.signTypedData({
      domain: {
        chainId: chainId ?? chain.id,
        name: contractName,
        version: "1",
        verifyingContract: address
      },
      types: SIGNABLE_USER_OP_TYPED_DATA,
      primaryType: "PackedUserOperation",
      message: { ...packedUserOp, entryPoint: entryPoint.address }
    });
    return signature;
  };
  const getAddress = async () => address;
  const getNonce = async () => read({
    client,
    entryPoint: environment.EntryPoint,
    contractAddress: address,
    key: 0n
  });
  const encodeCalls = async (calls) => encodeCallsForCaller(address, calls);
  const smartAccount = await toSmartAccount({
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
      isDeployed: async () => isValid7702Implementation({
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
  return client.extend(caveatEnforcerActions({ environment }));
}

// src/actions/infuraBundlerClient.ts
import {
  createBundlerClient
} from "viem/account-abstraction";
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
  const baseBundlerClient = createBundlerClient(config);
  return baseBundlerClient.extend(
    infuraBundlerActions()
  );
}
export {
  ANY_BENEFICIARY,
  BalanceChangeType,
  ExecutionMode,
  Implementation,
  PREFERRED_VERSION,
  ROOT_AUTHORITY,
  TransferWindow,
  actions_exports as actions,
  aggregateSignature,
  contracts_exports as contracts,
  createCaveat,
  createCaveatEnforcerClient,
  createDelegation,
  createExecution,
  createInfuraBundlerClient,
  createOpenDelegation,
  getSmartAccountsEnvironment,
  redeemDelegations,
  signDelegation,
  signUserOperation,
  toMetaMaskSmartAccount
};
//# sourceMappingURL=index.mjs.map