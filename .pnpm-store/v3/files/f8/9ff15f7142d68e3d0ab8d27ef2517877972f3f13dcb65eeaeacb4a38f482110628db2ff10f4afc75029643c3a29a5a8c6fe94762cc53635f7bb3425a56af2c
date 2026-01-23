"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkT6PSFUOZcjs = require('./chunk-T6PSFUOZ.cjs');


var _chunkHJETDDBNcjs = require('./chunk-HJETDDBN.cjs');

// src/write.ts
var _delegationabis = require('@metamask/delegation-abis');
var redeemDelegations = async (walletClient, publicClient, delegationManagerAddress, redemptions) => {
  if (redemptions.length === 0) {
    throw new Error("RedeemDelegations invalid zero redemptions");
  }
  const permissionContexts = [];
  const executionsBatch = [];
  const executionModes = [];
  redemptions.forEach((redemption) => {
    permissionContexts.push(redemption.permissionContext);
    executionsBatch.push(redemption.executions);
    executionModes.push(redemption.mode);
  });
  const encodedPermissionContexts = _chunkHJETDDBNcjs.encodePermissionContexts.call(void 0, permissionContexts);
  const executionCalldatas = _chunkT6PSFUOZcjs.encodeExecutionCalldatas.call(void 0, executionsBatch);
  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address: delegationManagerAddress,
    abi: _delegationabis.DelegationManager.abi,
    functionName: "redeemDelegations",
    args: [encodedPermissionContexts, executionModes, executionCalldatas]
  });
  return await walletClient.writeContract(request);
};
async function deployContract(walletClient, publicClient, chain, { bytecode, abi }, args = []) {
  if (!walletClient.account) {
    throw new Error("Wallet client account is required");
  }
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args,
    account: walletClient.account,
    chain
  });
  const receipt = await publicClient.waitForTransactionReceipt({
    hash
  });
  if (!receipt.contractAddress) {
    throw new Error("No contract address in receipt");
  }
  return { address: receipt.contractAddress, hash, receipt };
}

// src/smartAccountsEnvironment.ts








































var _delegationdeployments = require('@metamask/delegation-deployments');
var PREFERRED_VERSION = "1.3.0";
var contractOverrideMap = /* @__PURE__ */ new Map();
var getContractOverrideKey = (chainId, version) => `${version}:${chainId}`;
function overrideDeployedEnvironment(chainId, version, environment) {
  contractOverrideMap.set(
    getContractOverrideKey(chainId, version),
    environment
  );
}
function getSmartAccountsEnvironment(chainId, version = PREFERRED_VERSION) {
  const overrideKey = getContractOverrideKey(chainId, version);
  const overriddenContracts = contractOverrideMap.get(overrideKey);
  if (overriddenContracts) {
    return overriddenContracts;
  }
  const contracts = _optionalChain([_delegationdeployments.DELEGATOR_CONTRACTS, 'access', _ => _[version], 'optionalAccess', _2 => _2[chainId]]);
  if (!contracts) {
    throw new Error(
      `No contracts found for version ${version} chain ${chainId}`
    );
  }
  return getSmartAccountsEnvironmentV1(contracts);
}
function getSmartAccountsEnvironmentV1(contracts) {
  return {
    DelegationManager: contracts.DelegationManager,
    EntryPoint: contracts.EntryPoint,
    SimpleFactory: contracts.SimpleFactory,
    implementations: {
      MultiSigDeleGatorImpl: contracts.MultiSigDeleGatorImpl,
      HybridDeleGatorImpl: contracts.HybridDeleGatorImpl,
      EIP7702StatelessDeleGatorImpl: contracts.EIP7702StatelessDeleGatorImpl
    },
    caveatEnforcers: {
      AllowedCalldataEnforcer: contracts.AllowedCalldataEnforcer,
      AllowedMethodsEnforcer: contracts.AllowedMethodsEnforcer,
      AllowedTargetsEnforcer: contracts.AllowedTargetsEnforcer,
      ArgsEqualityCheckEnforcer: contracts.ArgsEqualityCheckEnforcer,
      BlockNumberEnforcer: contracts.BlockNumberEnforcer,
      DeployedEnforcer: contracts.DeployedEnforcer,
      ERC20BalanceChangeEnforcer: contracts.ERC20BalanceChangeEnforcer,
      ERC20TransferAmountEnforcer: contracts.ERC20TransferAmountEnforcer,
      ERC20StreamingEnforcer: contracts.ERC20StreamingEnforcer,
      ERC721BalanceChangeEnforcer: contracts.ERC721BalanceChangeEnforcer,
      ERC721TransferEnforcer: contracts.ERC721TransferEnforcer,
      ERC1155BalanceChangeEnforcer: contracts.ERC1155BalanceChangeEnforcer,
      IdEnforcer: contracts.IdEnforcer,
      LimitedCallsEnforcer: contracts.LimitedCallsEnforcer,
      NonceEnforcer: contracts.NonceEnforcer,
      TimestampEnforcer: contracts.TimestampEnforcer,
      ValueLteEnforcer: contracts.ValueLteEnforcer,
      NativeTokenTransferAmountEnforcer: contracts.NativeTokenTransferAmountEnforcer,
      NativeBalanceChangeEnforcer: contracts.NativeBalanceChangeEnforcer,
      NativeTokenStreamingEnforcer: contracts.NativeTokenStreamingEnforcer,
      NativeTokenPaymentEnforcer: contracts.NativeTokenPaymentEnforcer,
      OwnershipTransferEnforcer: contracts.OwnershipTransferEnforcer,
      RedeemerEnforcer: contracts.RedeemerEnforcer,
      SpecificActionERC20TransferBatchEnforcer: contracts.SpecificActionERC20TransferBatchEnforcer,
      ERC20PeriodTransferEnforcer: contracts.ERC20PeriodTransferEnforcer,
      NativeTokenPeriodTransferEnforcer: contracts.NativeTokenPeriodTransferEnforcer,
      ExactCalldataBatchEnforcer: contracts.ExactCalldataBatchEnforcer,
      ExactCalldataEnforcer: contracts.ExactCalldataEnforcer,
      ExactExecutionEnforcer: contracts.ExactExecutionEnforcer,
      ExactExecutionBatchEnforcer: contracts.ExactExecutionBatchEnforcer,
      MultiTokenPeriodEnforcer: contracts.MultiTokenPeriodEnforcer
    }
  };
}
async function deploySmartAccountsEnvironment(walletClient, publicClient, chain, deployedContracts = {}) {
  const deployContractCurried = async (name, contract, params = []) => {
    const existingAddress = deployedContracts[name];
    if (existingAddress) {
      return {
        address: existingAddress,
        name
      };
    }
    const deployedContract = await deployContract(
      walletClient,
      publicClient,
      chain,
      contract,
      params
    );
    const newDeployedContracts = { ...deployedContracts };
    newDeployedContracts[name] = deployedContract.address;
    Object.assign(deployedContracts, newDeployedContracts);
    return { ...deployedContract, name };
  };
  const standaloneContracts = {
    SimpleFactory: _delegationabis.SimpleFactory,
    AllowedCalldataEnforcer: _delegationabis.AllowedCalldataEnforcer,
    AllowedTargetsEnforcer: _delegationabis.AllowedTargetsEnforcer,
    AllowedMethodsEnforcer: _delegationabis.AllowedMethodsEnforcer,
    ArgsEqualityCheckEnforcer: _delegationabis.ArgsEqualityCheckEnforcer,
    DeployedEnforcer: _delegationabis.DeployedEnforcer,
    TimestampEnforcer: _delegationabis.TimestampEnforcer,
    BlockNumberEnforcer: _delegationabis.BlockNumberEnforcer,
    LimitedCallsEnforcer: _delegationabis.LimitedCallsEnforcer,
    ERC20BalanceChangeEnforcer: _delegationabis.ERC20BalanceChangeEnforcer,
    ERC20TransferAmountEnforcer: _delegationabis.ERC20TransferAmountEnforcer,
    ERC20StreamingEnforcer: _delegationabis.ERC20StreamingEnforcer,
    ERC721BalanceChangeEnforcer: _delegationabis.ERC721BalanceChangeEnforcer,
    ERC721TransferEnforcer: _delegationabis.ERC721TransferEnforcer,
    ERC1155BalanceChangeEnforcer: _delegationabis.ERC1155BalanceChangeEnforcer,
    IdEnforcer: _delegationabis.IdEnforcer,
    NonceEnforcer: _delegationabis.NonceEnforcer,
    ValueLteEnforcer: _delegationabis.ValueLteEnforcer,
    NativeTokenTransferAmountEnforcer: _delegationabis.NativeTokenTransferAmountEnforcer,
    NativeBalanceChangeEnforcer: _delegationabis.NativeBalanceChangeEnforcer,
    NativeTokenStreamingEnforcer: _delegationabis.NativeTokenStreamingEnforcer,
    OwnershipTransferEnforcer: _delegationabis.OwnershipTransferEnforcer,
    RedeemerEnforcer: _delegationabis.RedeemerEnforcer,
    SpecificActionERC20TransferBatchEnforcer: _delegationabis.SpecificActionERC20TransferBatchEnforcer,
    ERC20PeriodTransferEnforcer: _delegationabis.ERC20PeriodTransferEnforcer,
    NativeTokenPeriodTransferEnforcer: _delegationabis.NativeTokenPeriodTransferEnforcer,
    ExactCalldataBatchEnforcer: _delegationabis.ExactCalldataBatchEnforcer,
    ExactCalldataEnforcer: _delegationabis.ExactCalldataEnforcer,
    ExactExecutionEnforcer: _delegationabis.ExactExecutionEnforcer,
    ExactExecutionBatchEnforcer: _delegationabis.ExactExecutionBatchEnforcer,
    MultiTokenPeriodEnforcer: _delegationabis.MultiTokenPeriodEnforcer
  };
  for (const [name, contract] of Object.entries(standaloneContracts)) {
    await deployContractCurried(name, contract);
  }
  const delegationManager = await deployContractCurried(
    "DelegationManager",
    _delegationabis.DelegationManager,
    [_optionalChain([walletClient, 'access', _3 => _3.account, 'optionalAccess', _4 => _4.address])]
  );
  await deployContractCurried(
    "NativeTokenPaymentEnforcer",
    _delegationabis.NativeTokenPaymentEnforcer,
    [delegationManager.address, deployedContracts.ArgsEqualityCheckEnforcer]
  );
  const entryPoint = await deployContractCurried("EntryPoint", _delegationabis.EntryPoint);
  const { address: sclRIP7212 } = await deployContract(
    walletClient,
    publicClient,
    chain,
    _delegationabis.SCL_RIP7212,
    []
  );
  const hybridDeleGatorWithLinkedLibrary = {
    ..._delegationabis.HybridDeleGator,
    bytecode: _delegationabis.HybridDeleGator.bytecode.replace(
      /__\$b8f96b288d4d0429e38b8ed50fd423070f\$__/gu,
      sclRIP7212.slice(2)
    )
  };
  await deployContractCurried(
    "HybridDeleGatorImpl",
    hybridDeleGatorWithLinkedLibrary,
    [delegationManager.address, entryPoint.address]
  );
  await deployContractCurried("MultiSigDeleGatorImpl", _delegationabis.MultiSigDeleGator, [
    delegationManager.address,
    entryPoint.address
  ]);
  await deployContractCurried(
    "EIP7702StatelessDeleGatorImpl",
    _delegationabis.EIP7702StatelessDeleGator,
    [delegationManager.address, entryPoint.address]
  );
  return getSmartAccountsEnvironmentV1(deployedContracts);
}

// src/userOp.ts
var _viem = require('viem');
var _accountabstraction = require('viem/account-abstraction');
var _accounts = require('viem/accounts');
var SIGNABLE_USER_OP_TYPED_DATA = {
  PackedUserOperation: [
    { name: "sender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "initCode", type: "bytes" },
    { name: "callData", type: "bytes" },
    { name: "accountGasLimits", type: "bytes32" },
    { name: "preVerificationGas", type: "uint256" },
    { name: "gasFees", type: "bytes32" },
    { name: "paymasterAndData", type: "bytes" },
    { name: "entryPoint", type: "address" }
  ]
};
var prepareSignUserOperationTypedData = ({
  userOperation,
  entryPoint,
  chainId,
  name,
  address,
  version = "1"
}) => {
  const packedUserOp = _accountabstraction.toPackedUserOperation.call(void 0, {
    ...userOperation,
    signature: "0x"
  });
  return {
    domain: {
      chainId,
      name,
      version,
      verifyingContract: address
    },
    types: SIGNABLE_USER_OP_TYPED_DATA,
    primaryType: "PackedUserOperation",
    message: { ...packedUserOp, entryPoint: entryPoint.address }
  };
};
var signUserOperation = async ({
  privateKey,
  userOperation,
  entryPoint,
  chainId,
  name,
  address,
  version = "1"
}) => {
  const typedData = prepareSignUserOperationTypedData({
    userOperation,
    entryPoint,
    chainId,
    name,
    address,
    version
  });
  return _accounts.signTypedData.call(void 0, {
    privateKey,
    ...typedData
  });
};










exports.redeemDelegations = redeemDelegations; exports.PREFERRED_VERSION = PREFERRED_VERSION; exports.overrideDeployedEnvironment = overrideDeployedEnvironment; exports.getSmartAccountsEnvironment = getSmartAccountsEnvironment; exports.deploySmartAccountsEnvironment = deploySmartAccountsEnvironment; exports.SIGNABLE_USER_OP_TYPED_DATA = SIGNABLE_USER_OP_TYPED_DATA; exports.prepareSignUserOperationTypedData = prepareSignUserOperationTypedData; exports.signUserOperation = signUserOperation;
//# sourceMappingURL=chunk-BWR5ZK6Z.cjs.map