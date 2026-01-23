"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }





var _chunkJN5LSN7Dcjs = require('./chunk-JN5LSN7D.cjs');


var _chunk2YEKEDAFcjs = require('./chunk-2YEKEDAF.cjs');




var _chunk5GYFPRIZcjs = require('./chunk-5GYFPRIZ.cjs');

// src/actions/index.ts
var actions_exports = {};
_chunk5GYFPRIZcjs.__export.call(void 0, actions_exports, {
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
  const delegationHash = _chunk5GYFPRIZcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunkJN5LSN7Dcjs.read_exports.getAvailableAmount({
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
  const delegationHash = _chunk5GYFPRIZcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunkJN5LSN7Dcjs.read_exports2.getAvailableAmount({
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
  const delegationHash = _chunk5GYFPRIZcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms, args } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunkJN5LSN7Dcjs.read_exports3.getAvailableAmount({
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
  const delegationHash = _chunk5GYFPRIZcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunkJN5LSN7Dcjs.read_exports4.getAvailableAmount({
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
  const delegationHash = _chunk5GYFPRIZcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunkJN5LSN7Dcjs.read_exports5.getAvailableAmount({
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
var _viem = require('viem');
var _actions = require('viem/actions');
var DELEGATION_PREFIX = "0xef0100";
function extractDelegatedAddress(code) {
  if (_optionalChain([code, 'optionalAccess', _ => _.length]) !== 48) {
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
    const code = await _actions.getCode.call(void 0, client, {
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
    return _viem.isAddressEqual.call(void 0, delegatedAddress, expectedImplementation);
  } catch (error) {
    return false;
  }
}

// src/actions/signDelegation.ts

var _accounts = require('viem/accounts');
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
    throw new (0, _viem.BaseError)("Account not found. Please provide an account.");
  }
  const account = _accounts.parseAccount.call(void 0, accountParam);
  const typedData = _chunk5GYFPRIZcjs.prepareSignDelegationTypedData.call(void 0, {
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
      chainId: _nullishCoalesce(parameters.chainId, () => ( (() => {
        if (!_optionalChain([client, 'access', _2 => _2.chain, 'optionalAccess', _3 => _3.id])) {
          throw new (0, _viem.BaseError)(
            "Chain ID is required. Either provide it in parameters or configure the client with a chain."
          );
        }
        return client.chain.id;
      })())),
      ...parameters
    })
  });
}

// src/actions/signUserOperation.ts


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
    throw new (0, _viem.BaseError)("Account not found. Please provide an account.");
  }
  const account = _accounts.parseAccount.call(void 0, accountParam);
  const typedData = _chunk2YEKEDAFcjs.prepareSignUserOperationTypedData.call(void 0, {
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
      chainId: _nullishCoalesce(parameters.chainId, () => ( (() => {
        if (!_optionalChain([client, 'access', _4 => _4.chain, 'optionalAccess', _5 => _5.id])) {
          throw new (0, _viem.BaseError)(
            "Chain ID is required. Either provide it in parameters or configure the client with a chain."
          );
        }
        return client.chain.id;
      })())),
      ...parameters
    })
  });
}














exports.isValid7702Implementation = isValid7702Implementation; exports.getErc20PeriodTransferEnforcerAvailableAmount = getErc20PeriodTransferEnforcerAvailableAmount; exports.getErc20StreamingEnforcerAvailableAmount = getErc20StreamingEnforcerAvailableAmount; exports.getMultiTokenPeriodEnforcerAvailableAmount = getMultiTokenPeriodEnforcerAvailableAmount; exports.getNativeTokenPeriodTransferEnforcerAvailableAmount = getNativeTokenPeriodTransferEnforcerAvailableAmount; exports.getNativeTokenStreamingEnforcerAvailableAmount = getNativeTokenStreamingEnforcerAvailableAmount; exports.caveatEnforcerActions = caveatEnforcerActions; exports.signDelegation = signDelegation; exports.signDelegationActions = signDelegationActions; exports.signUserOperation = signUserOperation; exports.signUserOperationActions = signUserOperationActions; exports.actions_exports = actions_exports;
//# sourceMappingURL=chunk-YBVGMN76.cjs.map