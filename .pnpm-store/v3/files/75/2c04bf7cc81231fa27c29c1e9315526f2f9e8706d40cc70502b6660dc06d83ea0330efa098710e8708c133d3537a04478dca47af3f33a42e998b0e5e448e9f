import {
  read_exports,
  read_exports2,
  read_exports3,
  read_exports4,
  read_exports5
} from "./chunk-LESWPFZK.mjs";
import {
  prepareSignUserOperationTypedData
} from "./chunk-IVSH2AQS.mjs";
import {
  __export,
  getDelegationHashOffchain,
  prepareSignDelegationTypedData
} from "./chunk-22I5T7W4.mjs";

// src/actions/index.ts
var actions_exports = {};
__export(actions_exports, {
  caveatEnforcerActions: () => caveatEnforcerActions,
  getErc20PeriodTransferEnforcerAvailableAmount: () => getErc20PeriodTransferEnforcerAvailableAmount,
  getErc20StreamingEnforcerAvailableAmount: () => getErc20StreamingEnforcerAvailableAmount,
  getMultiTokenPeriodEnforcerAvailableAmount: () => getMultiTokenPeriodEnforcerAvailableAmount,
  getNativeTokenPeriodTransferEnforcerAvailableAmount: () => getNativeTokenPeriodTransferEnforcerAvailableAmount,
  getNativeTokenStreamingEnforcerAvailableAmount: () => getNativeTokenStreamingEnforcerAvailableAmount,
  isValid7702Implementation: () => isValid7702Implementation,
  signDelegation: () => signDelegation,
  signDelegationActions: () => signDelegationActions,
  signUserOperation: () => signUserOperation,
  signUserOperationActions: () => signUserOperationActions
});

// src/actions/getCaveatAvailableAmount.ts
function findMatchingCaveat({
  delegation,
  enforcerAddress,
  enforcerName
}) {
  const matchingCaveats = delegation.caveats.filter(
    (caveat) => caveat.enforcer.toLowerCase() === enforcerAddress.toLowerCase()
  );
  if (matchingCaveats.length === 0) {
    throw new Error(`No caveat found with enforcer matching ${enforcerName}`);
  }
  if (matchingCaveats.length > 1) {
    throw new Error(
      `Multiple caveats found with enforcer matching ${enforcerName}`
    );
  }
  const [{ terms, args }] = matchingCaveats;
  return {
    terms,
    args
  };
}
function getDelegationManager(environment) {
  if (!environment.DelegationManager) {
    throw new Error("Delegation manager address not found");
  }
  return environment.DelegationManager;
}
function getEnforcerAddress({
  enforcerName,
  environment
}) {
  const enforcerAddress = environment.caveatEnforcers[enforcerName];
  if (!enforcerAddress) {
    throw new Error(`${enforcerName} not found in environment`);
  }
  return enforcerAddress;
}
async function getErc20PeriodTransferEnforcerAvailableAmount(client, environment, params) {
  const enforcerName = "ERC20PeriodTransferEnforcer";
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment
  });
  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return read_exports.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash,
    delegationManager,
    terms
  });
}
async function getErc20StreamingEnforcerAvailableAmount(client, environment, params) {
  const enforcerName = "ERC20StreamingEnforcer";
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment
  });
  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return read_exports2.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationManager,
    delegationHash,
    terms
  });
}
async function getMultiTokenPeriodEnforcerAvailableAmount(client, environment, params) {
  const enforcerName = "MultiTokenPeriodEnforcer";
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment
  });
  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms, args } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return read_exports3.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash,
    delegationManager,
    terms,
    args
  });
}
async function getNativeTokenPeriodTransferEnforcerAvailableAmount(client, environment, params) {
  const enforcerName = "NativeTokenPeriodTransferEnforcer";
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment
  });
  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return read_exports4.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash,
    delegationManager,
    terms
  });
}
async function getNativeTokenStreamingEnforcerAvailableAmount(client, environment, params) {
  const enforcerName = "NativeTokenStreamingEnforcer";
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment
  });
  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return read_exports5.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationManager,
    delegationHash,
    terms
  });
}
var caveatEnforcerActions = ({ environment }) => (client) => ({
  /**
   * Get available amount for ERC20 period transfer enforcer.
   *
   * @param params - The parameters for the ERC20 period transfer enforcer.
   * @returns Promise resolving to the period transfer result.
   */
  getErc20PeriodTransferEnforcerAvailableAmount: async (params) => {
    return getErc20PeriodTransferEnforcerAvailableAmount(
      client,
      environment,
      params
    );
  },
  /**
   * Get available amount for ERC20 streaming enforcer.
   *
   * @param params - The parameters for the ERC20 streaming enforcer.
   * @returns Promise resolving to the streaming result.
   */
  getErc20StreamingEnforcerAvailableAmount: async (params) => {
    return getErc20StreamingEnforcerAvailableAmount(
      client,
      environment,
      params
    );
  },
  /**
   * Get available amount for multi-token period enforcer.
   *
   * @param params - The parameters for the multi-token period enforcer.
   * @returns Promise resolving to the period transfer result.
   */
  getMultiTokenPeriodEnforcerAvailableAmount: async (params) => {
    return getMultiTokenPeriodEnforcerAvailableAmount(
      client,
      environment,
      params
    );
  },
  /**
   * Get available amount for native token period transfer enforcer.
   *
   * @param params - The parameters for the native token period transfer enforcer.
   * @returns Promise resolving to the period transfer result.
   */
  getNativeTokenPeriodTransferEnforcerAvailableAmount: async (params) => {
    return getNativeTokenPeriodTransferEnforcerAvailableAmount(
      client,
      environment,
      params
    );
  },
  /**
   * Get available amount for native token streaming enforcer.
   *
   * @param params - The parameters for the native token streaming enforcer.
   * @returns Promise resolving to the streaming result.
   */
  getNativeTokenStreamingEnforcerAvailableAmount: async (params) => {
    return getNativeTokenStreamingEnforcerAvailableAmount(
      client,
      environment,
      params
    );
  }
});

// src/actions/isValid7702Implementation.ts
import { isAddressEqual } from "viem";
import { getCode } from "viem/actions";
var DELEGATION_PREFIX = "0xef0100";
function extractDelegatedAddress(code) {
  if (code?.length !== 48) {
    return null;
  }
  if (!code.toLowerCase().startsWith(DELEGATION_PREFIX.toLowerCase())) {
    return null;
  }
  const addressHex = code.slice(8);
  return `0x${addressHex}`;
}
async function isValid7702Implementation({
  client,
  accountAddress,
  environment
}) {
  try {
    const code = await getCode(client, {
      address: accountAddress
    });
    const delegatedAddress = extractDelegatedAddress(code);
    if (!delegatedAddress) {
      return false;
    }
    const expectedImplementation = environment.implementations.EIP7702StatelessDeleGatorImpl;
    if (!expectedImplementation) {
      return false;
    }
    return isAddressEqual(delegatedAddress, expectedImplementation);
  } catch (error) {
    return false;
  }
}

// src/actions/signDelegation.ts
import { BaseError } from "viem";
import { parseAccount } from "viem/accounts";
async function signDelegation(client, parameters) {
  const {
    account: accountParam = client.account,
    delegation,
    delegationManager,
    chainId,
    name = "DelegationManager",
    version = "1",
    allowInsecureUnrestrictedDelegation = false
  } = parameters;
  if (!accountParam) {
    throw new BaseError("Account not found. Please provide an account.");
  }
  const account = parseAccount(accountParam);
  const typedData = prepareSignDelegationTypedData({
    delegation,
    delegationManager,
    chainId,
    name,
    version,
    allowInsecureUnrestrictedDelegation
  });
  return client.signTypedData({
    account,
    ...typedData
  });
}
function signDelegationActions() {
  return (client) => ({
    signDelegation: async (parameters) => signDelegation(client, {
      chainId: parameters.chainId ?? (() => {
        if (!client.chain?.id) {
          throw new BaseError(
            "Chain ID is required. Either provide it in parameters or configure the client with a chain."
          );
        }
        return client.chain.id;
      })(),
      ...parameters
    })
  });
}

// src/actions/signUserOperation.ts
import { BaseError as BaseError2 } from "viem";
import { parseAccount as parseAccount2 } from "viem/accounts";
async function signUserOperation(client, parameters) {
  const {
    account: accountParam = client.account,
    userOperation,
    entryPoint,
    chainId,
    name,
    address,
    version = "1"
  } = parameters;
  if (!accountParam) {
    throw new BaseError2("Account not found. Please provide an account.");
  }
  const account = parseAccount2(accountParam);
  const typedData = prepareSignUserOperationTypedData({
    userOperation,
    entryPoint,
    chainId,
    name,
    address,
    version
  });
  return client.signTypedData({
    account,
    ...typedData
  });
}
function signUserOperationActions() {
  return (client) => ({
    signUserOperation: async (parameters) => signUserOperation(client, {
      chainId: parameters.chainId ?? (() => {
        if (!client.chain?.id) {
          throw new BaseError2(
            "Chain ID is required. Either provide it in parameters or configure the client with a chain."
          );
        }
        return client.chain.id;
      })(),
      ...parameters
    })
  });
}

export {
  isValid7702Implementation,
  getErc20PeriodTransferEnforcerAvailableAmount,
  getErc20StreamingEnforcerAvailableAmount,
  getMultiTokenPeriodEnforcerAvailableAmount,
  getNativeTokenPeriodTransferEnforcerAvailableAmount,
  getNativeTokenStreamingEnforcerAvailableAmount,
  caveatEnforcerActions,
  signDelegation,
  signDelegationActions,
  signUserOperation,
  signUserOperationActions,
  actions_exports
};
//# sourceMappingURL=chunk-TMYAWDSH.mjs.map