"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkCTZHYDS4cjs = require('../chunk-CTZHYDS4.cjs');



var _chunkT6PSFUOZcjs = require('../chunk-T6PSFUOZ.cjs');


var _chunk5GYFPRIZcjs = require('../chunk-5GYFPRIZ.cjs');

// src/experimental/erc7710RedeemDelegationAction.ts
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
    const chainId = _optionalChain([publicClient, 'access', _2 => _2.chain, 'optionalAccess', _3 => _3.id]);
    if (!chainId) {
      throw new Error("Chain ID is not set");
    }
    const { SimpleFactory } = _chunkCTZHYDS4cjs.getDeleGatorEnvironment.call(void 0, chainId);
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

// src/experimental/erc7715RequestExecutionPermissionsAction.ts

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
function assertIsDefined(value, message) {
  if (!isDefined(value)) {
    throw new Error(_nullishCoalesce(message, () => ( "Invalid parameters: value is required")));
  }
}
function toHexOrThrow(value, message) {
  assertIsDefined(value, message);
  if (typeof value === "string") {
    if (!_viem.isHex.call(void 0, value)) {
      throw new Error("Invalid parameters: invalid hex value");
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
      initialAmount: toHexOrThrow(initialAmount)
    },
    ...isDefined(maxAmount) && {
      maxAmount: toHexOrThrow(maxAmount)
    },
    ...isDefined(startTime) && {
      startTime: Number(startTime)
    },
    ...justification ? { justification } : {}
  };
  return {
    type: "native-token-stream",
    data: {
      amountPerSecond: toHexOrThrow(
        amountPerSecond,
        "Invalid parameters: amountPerSecond is required"
      ),
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
      initialAmount: toHexOrThrow(initialAmount)
    },
    ...isDefined(maxAmount) && {
      maxAmount: toHexOrThrow(maxAmount)
    },
    ...isDefined(startTime) && {
      startTime: Number(startTime)
    },
    ...justification ? { justification } : {}
  };
  return {
    type: "erc20-token-stream",
    data: {
      tokenAddress: toHexOrThrow(tokenAddress),
      amountPerSecond: toHexOrThrow(amountPerSecond),
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
      periodAmount: toHexOrThrow(periodAmount),
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
      tokenAddress: toHexOrThrow(tokenAddress),
      periodAmount: toHexOrThrow(periodAmount),
      periodDuration: Number(periodDuration),
      ...optionalFields
    },
    isAdjustmentAllowed
  };
}

// src/experimental/delegationStorage.ts

var DelegationStorageClient = class {
  #apiVersionPrefix = "api/v0";
  #config;
  #fetcher;
  #apiUrl;
  constructor(config) {
    const { apiUrl } = config.environment;
    if (apiUrl.endsWith(this.#apiVersionPrefix)) {
      this.#apiUrl = apiUrl;
    } else {
      const separator = apiUrl.endsWith("/") ? "" : "/";
      this.#apiUrl = `${apiUrl}${separator}${this.#apiVersionPrefix}`;
    }
    this.#fetcher = this.#initializeFetcher(config);
    this.#config = config;
  }
  /**
   * Initializes the fetch function for HTTP requests.
   *
   * - Uses `config.fetcher` if provided.
   * - Falls back to global `fetch` if available.
   * - Throws an error if no fetch function is available.
   *
   * @param config - Configuration object that may include a custom fetch function.
   * @returns The fetch function to be used for HTTP requests.
   * @throws Error if no fetch function is available in the environment.
   */
  #initializeFetcher(config) {
    if (config.fetcher) {
      return config.fetcher;
    } else if (typeof _optionalChain([globalThis, 'optionalAccess', _4 => _4.fetch]) === "function") {
      return globalThis.fetch.bind(globalThis);
    }
    throw new Error(
      "Fetch API is not available in this environment. Please provide a fetch function in the config."
    );
  }
  /**
   * Fetches the delegation chain from the Delegation Storage Service, ending with
   * the specified leaf delegation.
   *
   * @param leafDelegationOrDelegationHash - The leaf delegation, or the hash
   * of the leaf delegation.
   * @returns A promise that resolves to the delegation chain - empty array if the delegation
   * is not found.
   */
  async getDelegationChain(leafDelegationOrDelegationHash) {
    const leafDelegationHash = typeof leafDelegationOrDelegationHash === "string" ? leafDelegationOrDelegationHash : _chunk5GYFPRIZcjs.getDelegationHashOffchain.call(void 0, leafDelegationOrDelegationHash);
    const response = await this.#fetcher(
      `${this.#apiUrl}/delegation/chain/${leafDelegationHash}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.#config.apiKey}`,
          "x-api-key-id": this.#config.apiKeyId
        }
      }
    );
    const responseData = await response.json();
    if ("error" in responseData) {
      throw new Error(
        `Failed to fetch delegation chain: ${responseData.error}`
      );
    }
    return responseData;
  }
  /**
   * Fetches the delegations from the Delegation Storage Service, either `Received`
   * by, or `Given` by, (or both: `All`) the specified deleGatorAddress. Defaults
   * to `Received`.
   *
   * @param deleGatorAddress - The deleGatorAddress to retrieve the delegations for.
   * @param filterMode - The DelegationStoreFilter mode - defaults to Received.
   * @returns A promise that resolves to the list of delegations received by the deleGatorAddress,
   * empty array if the delegations are not found.
   */
  async fetchDelegations(deleGatorAddress, filterMode = "RECEIVED" /* Received */) {
    const response = await this.#fetcher(
      `${this.#apiUrl}/delegation/accounts/${deleGatorAddress}?filter=${filterMode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.#config.apiKey}`,
          "x-api-key-id": this.#config.apiKeyId
        }
      }
    );
    const responseData = await response.json();
    if ("error" in responseData) {
      throw new Error(`Failed to fetch delegations: ${responseData.error}`);
    }
    return responseData;
  }
  /**
   * Stores the specified delegation in the Delegation Storage Service.
   *
   * @param delegation - The delegation to store.
   * @returns A promise that resolves to the delegation hash indicating successful storage.
   */
  async storeDelegation(delegation) {
    if (!delegation.signature || delegation.signature === "0x") {
      throw new Error("Delegation must be signed to be stored");
    }
    const delegationHash = _chunk5GYFPRIZcjs.getDelegationHashOffchain.call(void 0, delegation);
    const body = JSON.stringify(
      {
        ...delegation,
        metadata: []
      },
      (_, value) => typeof value === "bigint" || typeof value === "number" ? _viem.toHex.call(void 0, value) : value,
      2
    );
    const response = await this.#fetcher(`${this.#apiUrl}/delegation/store`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.#config.apiKey}`,
        "x-api-key-id": this.#config.apiKeyId,
        "Content-Type": "application/json"
      },
      body
    });
    const responseData = await response.json();
    if ("error" in responseData) {
      throw new Error(responseData.error);
    }
    if (responseData.delegationHash !== delegationHash) {
      throw Error(
        "Failed to store the Delegation, the hash returned from the MM delegation storage API does not match the hash of the delegation"
      );
    }
    return responseData.delegationHash;
  }
};

// src/experimental/index.ts
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






exports.DelegationStorageClient = DelegationStorageClient; exports.erc7710BundlerActions = erc7710BundlerActions; exports.erc7710WalletActions = erc7710WalletActions; exports.erc7715ProviderActions = erc7715ProviderActions; exports.requestExecutionPermissions = erc7715RequestExecutionPermissionsAction;
//# sourceMappingURL=index.cjs.map