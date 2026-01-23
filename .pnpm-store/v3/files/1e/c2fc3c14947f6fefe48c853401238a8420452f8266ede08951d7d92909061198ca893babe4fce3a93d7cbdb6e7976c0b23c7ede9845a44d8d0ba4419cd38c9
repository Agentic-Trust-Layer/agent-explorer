"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }





var _chunk4QBJFYZ7cjs = require('./chunk-4QBJFYZ7.cjs');



var _chunkBWR5ZK6Zcjs = require('./chunk-BWR5ZK6Z.cjs');



var _chunkT6PSFUOZcjs = require('./chunk-T6PSFUOZ.cjs');




var _chunkHJETDDBNcjs = require('./chunk-HJETDDBN.cjs');

// src/actions/index.ts
var actions_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, actions_exports, {
  caveatEnforcerActions: () => caveatEnforcerActions,
  erc7710BundlerActions: () => erc7710BundlerActions,
  erc7710WalletActions: () => erc7710WalletActions,
  erc7715ProviderActions: () => erc7715ProviderActions,
  getErc20PeriodTransferEnforcerAvailableAmount: () => getErc20PeriodTransferEnforcerAvailableAmount,
  getErc20StreamingEnforcerAvailableAmount: () => getErc20StreamingEnforcerAvailableAmount,
  getMultiTokenPeriodEnforcerAvailableAmount: () => getMultiTokenPeriodEnforcerAvailableAmount,
  getNativeTokenPeriodTransferEnforcerAvailableAmount: () => getNativeTokenPeriodTransferEnforcerAvailableAmount,
  getNativeTokenStreamingEnforcerAvailableAmount: () => getNativeTokenStreamingEnforcerAvailableAmount,
  isValid7702Implementation: () => isValid7702Implementation,
  requestExecutionPermissions: () => erc7715RequestExecutionPermissionsAction,
  signDelegation: () => signDelegation,
  signDelegationActions: () => signDelegationActions,
  signUserOperation: () => signUserOperation,
  signUserOperationActions: () => signUserOperationActions
});

// src/actions/erc7710RedeemDelegationAction.ts
var _delegationabis = require('@metamask/delegation-abis');
var _viem = require('viem');
async function sendTransactionWithDelegationAction(client, args) {
  if (!args.to) {
    throw new Error(
      "`to` is required. `sendTransactionWithDelegation` cannot be used to deploy contracts."
    );
  }
  const executions = [
    _chunkT6PSFUOZcjs.createExecution.call(void 0, {
      target: args.to,
      value: args.value,
      callData: args.data
    })
  ];
  const calldata = _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DelegationManager.abi,
    functionName: "redeemDelegations",
    args: [
      [args.permissionsContext],
      ["0x0000000000000000000000000000000000000000000000000000000000000000" /* SingleDefault */],
      _chunkT6PSFUOZcjs.encodeExecutionCalldatas.call(void 0, [executions])
    ]
  });
  const {
    value: _value,
    permissionsContext: _permissionsContext,
    delegationManager: _delegationManager,
    ...rest
  } = args;
  const hash = await client.sendTransaction({
    ...rest,
    to: args.delegationManager,
    data: calldata
  });
  return hash;
}
async function sendUserOperationWithDelegationAction(client, parameters) {
  if (parameters.accountMetadata) {
    const { publicClient } = parameters;
    const includedAccountKeys = {};
    const chainId = _optionalChain([publicClient, 'access', _ => _.chain, 'optionalAccess', _2 => _2.id]);
    if (!chainId) {
      throw new Error("Chain ID is not set");
    }
    const { SimpleFactory } = _chunkBWR5ZK6Zcjs.getSmartAccountsEnvironment.call(void 0, chainId);
    const uniqueAccountMetadatas = parameters.accountMetadata.filter(
      (accountMetadata) => {
        if (!_viem.isAddressEqual.call(void 0, accountMetadata.factory, SimpleFactory)) {
          throw new Error(
            `Invalid accountMetadata: ${accountMetadata.factory} is not allowed.`
          );
        }
        const accountKey = _viem.concat.call(void 0, [
          accountMetadata.factory,
          accountMetadata.factoryData
        ]);
        const isDuplicate = includedAccountKeys[accountKey];
        includedAccountKeys[accountKey] = true;
        return !isDuplicate;
      }
    );
    const factoryCalls = (await Promise.all(
      uniqueAccountMetadatas.map(async ({ factory, factoryData }) => {
        const isDeployed = await publicClient.call({
          to: factory,
          data: factoryData
        }).then(() => false).catch(() => true);
        if (isDeployed) {
          return void 0;
        }
        return {
          to: factory,
          value: 0n,
          data: factoryData
        };
      })
    )).filter((call) => call !== void 0);
    parameters.calls = [
      ...factoryCalls,
      ...parameters.calls
    ];
  }
  return client.sendUserOperation(
    parameters
  );
}

// src/actions/erc7715RequestExecutionPermissionsAction.ts

async function erc7715RequestExecutionPermissionsAction(client, parameters) {
  const formattedPermissionRequest = parameters.map(formatPermissionsRequest);
  const result = await client.request(
    {
      method: "wallet_requestExecutionPermissions",
      params: formattedPermissionRequest
    },
    { retryCount: 0 }
  );
  if (!result) {
    throw new Error("Failed to grant permissions");
  }
  return result;
}
function formatPermissionsRequest(parameters) {
  const { chainId, address, expiry, isAdjustmentAllowed } = parameters;
  const permissionFormatter = getPermissionFormatter(
    parameters.permission.type
  );
  const signerAddress = typeof parameters.signer === "string" ? parameters.signer : parameters.signer.data.address;
  const rules = [
    {
      type: "expiry",
      isAdjustmentAllowed,
      data: {
        timestamp: expiry
      }
    }
  ];
  const optionalFields = {
    ...address ? { address } : {}
  };
  return {
    ...optionalFields,
    chainId: _viem.toHex.call(void 0, chainId),
    permission: permissionFormatter({
      permission: parameters.permission,
      isAdjustmentAllowed
    }),
    signer: {
      // MetaMask 7715 implementation only supports AccountSigner
      type: "account",
      data: {
        address: signerAddress
      }
    },
    rules
  };
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function assertIsDefined(value, parameterName) {
  if (!isDefined(value)) {
    throw new Error(
      `Invalid parameters: ${_nullishCoalesce(parameterName, () => ( "value"))} is required`
    );
  }
}
function toHexOrThrow(value, parameterName) {
  assertIsDefined(value, parameterName);
  if (typeof value === "string") {
    if (!_viem.isHex.call(void 0, value)) {
      throw new Error(
        `Invalid parameters: ${_nullishCoalesce(parameterName, () => ( "value"))} is not a valid hex value`
      );
    }
    return value;
  }
  return _viem.toHex.call(void 0, value);
}
function getPermissionFormatter(permissionType) {
  switch (permissionType) {
    case "native-token-stream":
      return ({ permission, isAdjustmentAllowed }) => formatNativeTokenStreamPermission({
        permission,
        isAdjustmentAllowed
      });
    case "erc20-token-stream":
      return ({ permission, isAdjustmentAllowed }) => formatErc20TokenStreamPermission({
        permission,
        isAdjustmentAllowed
      });
    case "native-token-periodic":
      return ({ permission, isAdjustmentAllowed }) => formatNativeTokenPeriodicPermission({
        permission,
        isAdjustmentAllowed
      });
    case "erc20-token-periodic":
      return ({ permission, isAdjustmentAllowed }) => formatErc20TokenPeriodicPermission({
        permission,
        isAdjustmentAllowed
      });
    case "erc20-token-revocation":
      return ({ permission, isAdjustmentAllowed }) => formatErc20TokenRevocationPermission({
        permission,
        isAdjustmentAllowed
      });
    default:
      throw new Error(`Unsupported permission type: ${permissionType}`);
  }
}
function formatNativeTokenStreamPermission({
  permission,
  isAdjustmentAllowed
}) {
  const {
    data: {
      initialAmount,
      justification,
      maxAmount,
      startTime,
      amountPerSecond
    }
  } = permission;
  const optionalFields = {
    ...isDefined(initialAmount) && {
      initialAmount: toHexOrThrow(initialAmount, "initialAmount")
    },
    ...isDefined(maxAmount) && {
      maxAmount: toHexOrThrow(maxAmount, "maxAmount")
    },
    ...isDefined(startTime) && {
      startTime: Number(startTime)
    },
    ...justification ? { justification } : {}
  };
  return {
    type: "native-token-stream",
    data: {
      amountPerSecond: toHexOrThrow(amountPerSecond, "amountPerSecond"),
      ...optionalFields
    },
    isAdjustmentAllowed
  };
}
function formatErc20TokenStreamPermission({
  permission,
  isAdjustmentAllowed
}) {
  const {
    data: {
      tokenAddress,
      amountPerSecond,
      initialAmount,
      startTime,
      maxAmount,
      justification
    }
  } = permission;
  const optionalFields = {
    ...isDefined(initialAmount) && {
      initialAmount: toHexOrThrow(initialAmount, "initialAmount")
    },
    ...isDefined(maxAmount) && {
      maxAmount: toHexOrThrow(maxAmount, "maxAmount")
    },
    ...isDefined(startTime) && {
      startTime: Number(startTime)
    },
    ...justification ? { justification } : {}
  };
  return {
    type: "erc20-token-stream",
    data: {
      tokenAddress: toHexOrThrow(tokenAddress, "tokenAddress"),
      amountPerSecond: toHexOrThrow(amountPerSecond, "amountPerSecond"),
      ...optionalFields
    },
    isAdjustmentAllowed
  };
}
function formatNativeTokenPeriodicPermission({
  permission,
  isAdjustmentAllowed
}) {
  const {
    data: { periodAmount, periodDuration, startTime, justification }
  } = permission;
  const optionalFields = {
    ...isDefined(startTime) && {
      startTime: Number(startTime)
    },
    ...justification ? { justification } : {}
  };
  return {
    type: "native-token-periodic",
    data: {
      periodAmount: toHexOrThrow(periodAmount, "periodAmount"),
      periodDuration: Number(periodDuration),
      ...optionalFields
    },
    isAdjustmentAllowed
  };
}
function formatErc20TokenPeriodicPermission({
  permission,
  isAdjustmentAllowed
}) {
  const {
    data: {
      tokenAddress,
      periodAmount,
      periodDuration,
      startTime,
      justification
    }
  } = permission;
  const optionalFields = {
    ...isDefined(startTime) && {
      startTime: Number(startTime)
    },
    ...justification ? { justification } : {}
  };
  return {
    type: "erc20-token-periodic",
    data: {
      tokenAddress: toHexOrThrow(tokenAddress, "tokenAddress"),
      periodAmount: toHexOrThrow(periodAmount, "periodAmount"),
      periodDuration: Number(periodDuration),
      ...optionalFields
    },
    isAdjustmentAllowed
  };
}
function formatErc20TokenRevocationPermission({
  permission,
  isAdjustmentAllowed
}) {
  const {
    data: { justification }
  } = permission;
  const data = {
    ...justification ? { justification } : {}
  };
  return {
    type: "erc20-token-revocation",
    data,
    isAdjustmentAllowed
  };
}

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
  const delegationHash = _chunkHJETDDBNcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunk4QBJFYZ7cjs.read_exports.getAvailableAmount({
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
  const delegationHash = _chunkHJETDDBNcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunk4QBJFYZ7cjs.read_exports2.getAvailableAmount({
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
  const delegationHash = _chunkHJETDDBNcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms, args } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunk4QBJFYZ7cjs.read_exports3.getAvailableAmount({
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
  const delegationHash = _chunkHJETDDBNcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunk4QBJFYZ7cjs.read_exports4.getAvailableAmount({
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
  const delegationHash = _chunkHJETDDBNcjs.getDelegationHashOffchain.call(void 0, params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName
  });
  return _chunk4QBJFYZ7cjs.read_exports5.getAvailableAmount({
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

var _actions = require('viem/actions');
var DELEGATION_PREFIX = "0xef0100";
function extractDelegatedAddress(code) {
  if (_optionalChain([code, 'optionalAccess', _3 => _3.length]) !== 48) {
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
  const typedData = _chunkHJETDDBNcjs.prepareSignDelegationTypedData.call(void 0, {
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
  const typedData = _chunkBWR5ZK6Zcjs.prepareSignUserOperationTypedData.call(void 0, {
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
        if (!_optionalChain([client, 'access', _6 => _6.chain, 'optionalAccess', _7 => _7.id])) {
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

// src/actions/index.ts
var erc7715ProviderActions = () => (client) => ({
  requestExecutionPermissions: async (parameters) => {
    return erc7715RequestExecutionPermissionsAction(
      client,
      parameters
    );
  }
});
var erc7710WalletActions = () => (client) => ({
  sendTransactionWithDelegation: async (args) => sendTransactionWithDelegationAction(client, args)
});
var erc7710BundlerActions = () => (client) => ({
  sendUserOperationWithDelegation: async (args) => sendUserOperationWithDelegationAction(client, args)
});


















exports.isValid7702Implementation = isValid7702Implementation; exports.erc7715RequestExecutionPermissionsAction = erc7715RequestExecutionPermissionsAction; exports.getErc20PeriodTransferEnforcerAvailableAmount = getErc20PeriodTransferEnforcerAvailableAmount; exports.getErc20StreamingEnforcerAvailableAmount = getErc20StreamingEnforcerAvailableAmount; exports.getMultiTokenPeriodEnforcerAvailableAmount = getMultiTokenPeriodEnforcerAvailableAmount; exports.getNativeTokenPeriodTransferEnforcerAvailableAmount = getNativeTokenPeriodTransferEnforcerAvailableAmount; exports.getNativeTokenStreamingEnforcerAvailableAmount = getNativeTokenStreamingEnforcerAvailableAmount; exports.caveatEnforcerActions = caveatEnforcerActions; exports.signDelegation = signDelegation; exports.signDelegationActions = signDelegationActions; exports.signUserOperation = signUserOperation; exports.signUserOperationActions = signUserOperationActions; exports.erc7715ProviderActions = erc7715ProviderActions; exports.erc7710WalletActions = erc7710WalletActions; exports.erc7710BundlerActions = erc7710BundlerActions; exports.actions_exports = actions_exports;
//# sourceMappingURL=chunk-QPCM4XRT.cjs.map