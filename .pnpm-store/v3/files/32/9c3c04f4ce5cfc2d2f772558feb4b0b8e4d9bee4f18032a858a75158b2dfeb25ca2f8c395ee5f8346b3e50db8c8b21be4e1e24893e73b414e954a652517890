import {
  encodeExecutionCalldatas
} from "./chunk-CPLIK3VF.mjs";
import {
  encodePermissionContexts
} from "./chunk-BJGZGTRU.mjs";

// src/write.ts
import { SimpleFactory, DelegationManager } from "@metamask/delegation-abis";
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
  const encodedPermissionContexts = encodePermissionContexts(permissionContexts);
  const executionCalldatas = encodeExecutionCalldatas(executionsBatch);
  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address: delegationManagerAddress,
    abi: DelegationManager.abi,
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
import {
  EntryPoint,
  SimpleFactory as SimpleFactory2,
  DelegationManager as DelegationManager2,
  MultiSigDeleGator,
  HybridDeleGator,
  EIP7702StatelessDeleGator,
  SCL_RIP7212,
  AllowedTargetsEnforcer,
  AllowedMethodsEnforcer,
  DeployedEnforcer,
  TimestampEnforcer,
  NonceEnforcer,
  AllowedCalldataEnforcer,
  BlockNumberEnforcer,
  LimitedCallsEnforcer,
  ERC20BalanceChangeEnforcer,
  ERC20StreamingEnforcer,
  IdEnforcer,
  ERC20TransferAmountEnforcer,
  ValueLteEnforcer,
  NativeTokenTransferAmountEnforcer,
  NativeBalanceChangeEnforcer,
  NativeTokenStreamingEnforcer,
  NativeTokenPaymentEnforcer,
  RedeemerEnforcer,
  ArgsEqualityCheckEnforcer,
  ERC721BalanceChangeEnforcer,
  ERC721TransferEnforcer,
  ERC1155BalanceChangeEnforcer,
  OwnershipTransferEnforcer,
  SpecificActionERC20TransferBatchEnforcer,
  ERC20PeriodTransferEnforcer,
  NativeTokenPeriodTransferEnforcer,
  ExactCalldataBatchEnforcer,
  ExactCalldataEnforcer,
  ExactExecutionEnforcer,
  ExactExecutionBatchEnforcer,
  MultiTokenPeriodEnforcer
} from "@metamask/delegation-abis";
import { DELEGATOR_CONTRACTS } from "@metamask/delegation-deployments";
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
  const contracts = DELEGATOR_CONTRACTS[version]?.[chainId];
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
    SimpleFactory: SimpleFactory2,
    AllowedCalldataEnforcer,
    AllowedTargetsEnforcer,
    AllowedMethodsEnforcer,
    ArgsEqualityCheckEnforcer,
    DeployedEnforcer,
    TimestampEnforcer,
    BlockNumberEnforcer,
    LimitedCallsEnforcer,
    ERC20BalanceChangeEnforcer,
    ERC20TransferAmountEnforcer,
    ERC20StreamingEnforcer,
    ERC721BalanceChangeEnforcer,
    ERC721TransferEnforcer,
    ERC1155BalanceChangeEnforcer,
    IdEnforcer,
    NonceEnforcer,
    ValueLteEnforcer,
    NativeTokenTransferAmountEnforcer,
    NativeBalanceChangeEnforcer,
    NativeTokenStreamingEnforcer,
    OwnershipTransferEnforcer,
    RedeemerEnforcer,
    SpecificActionERC20TransferBatchEnforcer,
    ERC20PeriodTransferEnforcer,
    NativeTokenPeriodTransferEnforcer,
    ExactCalldataBatchEnforcer,
    ExactCalldataEnforcer,
    ExactExecutionEnforcer,
    ExactExecutionBatchEnforcer,
    MultiTokenPeriodEnforcer
  };
  for (const [name, contract] of Object.entries(standaloneContracts)) {
    await deployContractCurried(name, contract);
  }
  const delegationManager = await deployContractCurried(
    "DelegationManager",
    DelegationManager2,
    [walletClient.account?.address]
  );
  await deployContractCurried(
    "NativeTokenPaymentEnforcer",
    NativeTokenPaymentEnforcer,
    [delegationManager.address, deployedContracts.ArgsEqualityCheckEnforcer]
  );
  const entryPoint = await deployContractCurried("EntryPoint", EntryPoint);
  const { address: sclRIP7212 } = await deployContract(
    walletClient,
    publicClient,
    chain,
    SCL_RIP7212,
    []
  );
  const hybridDeleGatorWithLinkedLibrary = {
    ...HybridDeleGator,
    bytecode: HybridDeleGator.bytecode.replace(
      /__\$b8f96b288d4d0429e38b8ed50fd423070f\$__/gu,
      sclRIP7212.slice(2)
    )
  };
  await deployContractCurried(
    "HybridDeleGatorImpl",
    hybridDeleGatorWithLinkedLibrary,
    [delegationManager.address, entryPoint.address]
  );
  await deployContractCurried("MultiSigDeleGatorImpl", MultiSigDeleGator, [
    delegationManager.address,
    entryPoint.address
  ]);
  await deployContractCurried(
    "EIP7702StatelessDeleGatorImpl",
    EIP7702StatelessDeleGator,
    [delegationManager.address, entryPoint.address]
  );
  return getSmartAccountsEnvironmentV1(deployedContracts);
}

// src/userOp.ts
import { concat, encodeAbiParameters, keccak256, pad, toHex } from "viem";
import { toPackedUserOperation } from "viem/account-abstraction";
import { signTypedData } from "viem/accounts";
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
  const packedUserOp = toPackedUserOperation({
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
  return signTypedData({
    privateKey,
    ...typedData
  });
};

export {
  redeemDelegations,
  PREFERRED_VERSION,
  overrideDeployedEnvironment,
  getSmartAccountsEnvironment,
  deploySmartAccountsEnvironment,
  SIGNABLE_USER_OP_TYPED_DATA,
  prepareSignUserOperationTypedData,
  signUserOperation
};
//# sourceMappingURL=chunk-3JBYBEYP.mjs.map