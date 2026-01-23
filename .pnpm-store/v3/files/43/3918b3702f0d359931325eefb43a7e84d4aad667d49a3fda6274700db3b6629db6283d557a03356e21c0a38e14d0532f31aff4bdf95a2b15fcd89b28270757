import {
  ERC20PeriodTransferEnforcer_exports,
  ERC20StreamingEnforcer_exports,
  MultiTokenPeriodEnforcer_exports,
  NativeTokenPeriodTransferEnforcer_exports,
  NativeTokenStreamingEnforcer_exports
} from "./chunk-F5U55BIP.mjs";
import {
  encodeProxyCreationCode,
  encode_exports,
  encode_exports2,
  encode_exports3,
  encode_exports4,
  execute,
  execute2,
  execute3,
  execute4,
  execute5,
  execute6,
  isContractDeployed,
  isImplementationExpected,
  read_exports,
  simulate,
  simulate10,
  simulate11,
  simulate12,
  simulate13,
  simulate14,
  simulate15,
  simulate16,
  simulate17,
  simulate18,
  simulate2,
  simulate3,
  simulate4,
  simulate5,
  simulate6,
  simulate7,
  simulate8,
  simulate9
} from "./chunk-72UQFUL5.mjs";
import {
  encodeExecutionCalldatas
} from "./chunk-CPLIK3VF.mjs";
import {
  ANY_BENEFICIARY,
  ROOT_AUTHORITY,
  __export,
  encodePermissionContexts,
  toDelegationStruct
} from "./chunk-BJGZGTRU.mjs";

// src/contracts/index.ts
var contracts_exports = {};
__export(contracts_exports, {
  DeleGatorCore: () => DeleGatorCore_exports,
  DelegationManager: () => DelegationManager_exports,
  EIP712: () => EIP712_exports,
  ERC20PeriodTransferEnforcer: () => ERC20PeriodTransferEnforcer_exports,
  ERC20StreamingEnforcer: () => ERC20StreamingEnforcer_exports,
  ERC20TransferAmountEnforcer: () => ERC20TransferAmountEnforcer_exports,
  EntryPoint: () => EntryPoint_exports,
  HybridDeleGator: () => HybridDeleGator_exports,
  IdEnforcer: () => IdEnforcer_exports,
  LimitedCallsEnforcer: () => LimitedCallsEnforcer_exports,
  MultiSigDeleGator: () => MultiSigDeleGator_exports,
  MultiTokenPeriodEnforcer: () => MultiTokenPeriodEnforcer_exports,
  NativeTokenPeriodTransferEnforcer: () => NativeTokenPeriodTransferEnforcer_exports,
  NativeTokenStreamingEnforcer: () => NativeTokenStreamingEnforcer_exports,
  NativeTokenTransferAmountEnforcer: () => NativeTokenTransferAmountEnforcer_exports,
  NonceEnforcer: () => NonceEnforcer_exports,
  Ownable2Step: () => Ownable2Step_exports,
  Pausable: () => Pausable_exports,
  SimpleFactory: () => SimpleFactory_exports,
  SpecificActionERC20TransferBatchEnforcer: () => SpecificActionERC20TransferBatchEnforcer_exports,
  encodeProxyCreationCode: () => encodeProxyCreationCode,
  isContractDeployed: () => isContractDeployed,
  isImplementationExpected: () => isImplementationExpected
});

// src/DelegationFramework/DelegationManager/index.ts
var DelegationManager_exports = {};
__export(DelegationManager_exports, {
  constants: () => constants_exports,
  encode: () => encode_exports5,
  execute: () => execute_exports,
  read: () => read_exports2,
  simulate: () => simulate_exports
});

// src/DelegationFramework/DelegationManager/constants.ts
var constants_exports = {};
__export(constants_exports, {
  ANY_BENEFICIARY: () => ANY_BENEFICIARY,
  DOMAIN_VERSION: () => DOMAIN_VERSION,
  NAME: () => NAME,
  ROOT_AUTHORITY: () => ROOT_AUTHORITY,
  VERSION: () => VERSION
});
var NAME = "DelegationManager";
var VERSION = "1.3.0";
var DOMAIN_VERSION = "1";

// src/DelegationFramework/DelegationManager/encode.ts
var encode_exports5 = {};
__export(encode_exports5, {
  disableDelegation: () => encode,
  enableDelegation: () => encode2,
  redeemDelegations: () => encode3
});

// src/DelegationFramework/DelegationManager/methods/disableDelegation.ts
import { DelegationManager } from "@metamask/delegation-abis";
import { encodeFunctionData } from "viem";
import { simulateContract, writeContract } from "viem/actions";
var simulate19 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const abi = DelegationManager.abi;
  const delegationStruct = toDelegationStruct(delegation);
  return simulateContract(client, {
    address: delegationManagerAddress,
    abi,
    functionName: "disableDelegation",
    args: [delegationStruct]
  });
};
var execute7 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const { request } = await simulate19({
    client,
    delegationManagerAddress,
    delegation
  });
  return writeContract(client, request);
};
var encode = ({ delegation }) => {
  const delegationStruct = toDelegationStruct(delegation);
  return encodeFunctionData({
    abi: DelegationManager.abi,
    functionName: "disableDelegation",
    args: [delegationStruct]
  });
};

// src/DelegationFramework/DelegationManager/methods/enableDelegation.ts
import { DelegationManager as DelegationManager2 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData2 } from "viem";
import { simulateContract as simulateContract2, writeContract as writeContract2 } from "viem/actions";
var simulate20 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const abi = DelegationManager2.abi;
  const delegationStruct = toDelegationStruct(delegation);
  return simulateContract2(client, {
    address: delegationManagerAddress,
    abi,
    functionName: "enableDelegation",
    args: [delegationStruct]
  });
};
var execute8 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const { request } = await simulate20({
    client,
    delegationManagerAddress,
    delegation
  });
  return writeContract2(client, request);
};
var encode2 = ({ delegation }) => {
  const delegationStruct = toDelegationStruct(delegation);
  return encodeFunctionData2({
    abi: DelegationManager2.abi,
    functionName: "enableDelegation",
    args: [delegationStruct]
  });
};

// src/DelegationFramework/DelegationManager/methods/redeemDelegations.ts
import { DelegationManager as DelegationManager3 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData3 } from "viem";
import { simulateContract as simulateContract3, writeContract as writeContract3 } from "viem/actions";
var simulate21 = async ({
  client,
  delegationManagerAddress,
  delegations,
  modes,
  executions
}) => {
  const abi = DelegationManager3.abi;
  return simulateContract3(client, {
    address: delegationManagerAddress,
    abi,
    functionName: "redeemDelegations",
    args: [
      encodePermissionContexts(delegations),
      modes,
      encodeExecutionCalldatas(executions)
    ]
  });
};
var execute9 = async ({
  client,
  delegationManagerAddress,
  delegations,
  modes,
  executions
}) => {
  const { request } = await simulate21({
    client,
    delegationManagerAddress,
    delegations,
    modes,
    executions
  });
  return writeContract3(client, request);
};
var encode3 = ({
  delegations,
  modes,
  executions
}) => {
  return encodeFunctionData3({
    abi: DelegationManager3.abi,
    functionName: "redeemDelegations",
    args: [
      encodePermissionContexts(delegations),
      modes,
      encodeExecutionCalldatas(executions)
    ]
  });
};

// src/DelegationFramework/DelegationManager/execute.ts
var execute_exports = {};
__export(execute_exports, {
  disableDelegation: () => execute7,
  enableDelegation: () => execute8,
  redeemDelegations: () => execute9
});

// src/DelegationFramework/DelegationManager/read.ts
var read_exports2 = {};
__export(read_exports2, {
  disabledDelegations: () => read,
  getAnyDelegate: () => read2,
  getRootAuthority: () => read3
});

// src/DelegationFramework/DelegationManager/methods/disabledDelegations.ts
import { DelegationManager as DelegationManager4 } from "@metamask/delegation-abis";
import { readContract } from "viem/actions";
var read = async ({
  client,
  contractAddress,
  delegationHash
}) => await readContract(client, {
  address: contractAddress,
  abi: DelegationManager4.abi,
  functionName: "disabledDelegations",
  args: [delegationHash]
});

// src/DelegationFramework/DelegationManager/methods/getAnyDelegate.ts
import { DelegationManager as DelegationManager5 } from "@metamask/delegation-abis";
import { readContract as readContract2 } from "viem/actions";
var read2 = async ({
  client,
  contractAddress
}) => await readContract2(client, {
  address: contractAddress,
  abi: DelegationManager5.abi,
  functionName: "ANY_DELEGATE"
});

// src/DelegationFramework/DelegationManager/methods/getRootAuthority.ts
import { DelegationManager as DelegationManager6 } from "@metamask/delegation-abis";
import { readContract as readContract3 } from "viem/actions";
var read3 = async ({
  client,
  contractAddress
}) => await readContract3(client, {
  address: contractAddress,
  abi: DelegationManager6.abi,
  functionName: "ROOT_AUTHORITY"
});

// src/DelegationFramework/DelegationManager/simulate.ts
var simulate_exports = {};
__export(simulate_exports, {
  disableDelegation: () => simulate19,
  enableDelegation: () => simulate20,
  redeemDelegations: () => simulate21
});

// src/DelegationFramework/DeleGatorCore/index.ts
var DeleGatorCore_exports = {};
__export(DeleGatorCore_exports, {
  encode: () => encode_exports4,
  execute: () => execute_exports2,
  read: () => read_exports,
  simulate: () => simulate_exports2
});

// src/DelegationFramework/DeleGatorCore/execute.ts
var execute_exports2 = {};
__export(execute_exports2, {
  disableDelegation: () => execute2,
  enableDelegation: () => execute3,
  execute: () => execute4,
  executeWithMode: () => execute5,
  upgradeToAndCall: () => execute6
});

// src/DelegationFramework/DeleGatorCore/simulate.ts
var simulate_exports2 = {};
__export(simulate_exports2, {
  disableDelegation: () => simulate14,
  enableDelegation: () => simulate15,
  execute: () => simulate16,
  executeWithMode: () => simulate17,
  upgradeToAndCall: () => simulate18
});

// src/DelegationFramework/EIP712/index.ts
var EIP712_exports = {};
__export(EIP712_exports, {
  read: () => read_exports3
});

// src/DelegationFramework/EIP712/read.ts
var read_exports3 = {};
__export(read_exports3, {
  getContractName: () => read4,
  getContractVersion: () => read5,
  getDomainVersion: () => read6
});

// src/DelegationFramework/EIP712/methods/getContractName.ts
import { readContract as readContract4 } from "viem/actions";
var read4 = async ({
  client,
  contractAddress
}) => await readContract4(client, {
  address: contractAddress,
  abi: [
    {
      type: "function",
      name: "NAME",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "string",
          internalType: "string"
        }
      ],
      stateMutability: "view"
    }
  ],
  functionName: "NAME"
});

// src/DelegationFramework/EIP712/methods/getContractVersion.ts
import { readContract as readContract5 } from "viem/actions";
var read5 = async ({
  client,
  contractAddress
}) => await readContract5(client, {
  address: contractAddress,
  abi: [
    {
      type: "function",
      name: "VERSION",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "string",
          internalType: "string"
        }
      ],
      stateMutability: "view"
    }
  ],
  functionName: "VERSION"
});

// src/DelegationFramework/EIP712/methods/getDomainVersion.ts
import { readContract as readContract6 } from "viem/actions";
var read6 = async ({
  client,
  contractAddress
}) => await readContract6(client, {
  address: contractAddress,
  abi: [
    {
      type: "function",
      name: "DOMAIN_VERSION",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "string",
          internalType: "string"
        }
      ],
      stateMutability: "view"
    }
  ],
  functionName: "DOMAIN_VERSION"
});

// src/DelegationFramework/EntryPoint/index.ts
var EntryPoint_exports = {};
__export(EntryPoint_exports, {
  read: () => read_exports4
});

// src/DelegationFramework/EntryPoint/read.ts
var read_exports4 = {};
__export(read_exports4, {
  entryPointGetNonce: () => read7
});

// src/DelegationFramework/EntryPoint/methods/getNonce.ts
import { EntryPoint } from "@metamask/delegation-abis";
import { readContract as readContract7 } from "viem/actions";
var read7 = async ({
  client,
  entryPoint,
  contractAddress,
  key
}) => await readContract7(client, {
  address: entryPoint,
  abi: EntryPoint.abi,
  functionName: "getNonce",
  args: [contractAddress, key]
});

// src/DelegationFramework/ERC20TransferAmountEnforcer/index.ts
var ERC20TransferAmountEnforcer_exports = {};
__export(ERC20TransferAmountEnforcer_exports, {
  read: () => read_exports5
});

// src/DelegationFramework/ERC20TransferAmountEnforcer/read.ts
var read_exports5 = {};
__export(read_exports5, {
  getSpentAmount: () => read8,
  getTermsInfo: () => read9
});

// src/DelegationFramework/ERC20TransferAmountEnforcer/methods/getSpentAmount.ts
import { ERC20TransferAmountEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract8 } from "viem/actions";
var read8 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash
}) => {
  const amount = await readContract8(client, {
    address: contractAddress,
    abi: ERC20TransferAmountEnforcer.abi,
    functionName: "spentMap",
    args: [delegationManager, delegationHash]
  });
  return amount;
};

// src/DelegationFramework/ERC20TransferAmountEnforcer/methods/getTermsInfo.ts
import { ERC20TransferAmountEnforcer as ERC20TransferAmountEnforcer2 } from "@metamask/delegation-abis";
import { readContract as readContract9 } from "viem/actions";
var read9 = async ({
  client,
  contractAddress,
  terms
}) => {
  const [allowedContract, maxTokens] = await readContract9(client, {
    address: contractAddress,
    abi: ERC20TransferAmountEnforcer2.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return {
    allowedContract,
    maxTokens
  };
};

// src/DelegationFramework/HybridDeleGator/index.ts
var HybridDeleGator_exports = {};
__export(HybridDeleGator_exports, {
  constants: () => constants_exports2,
  encode: () => encode_exports,
  read: () => read_exports6,
  simulate: () => simulate_exports3
});

// src/DelegationFramework/HybridDeleGator/read.ts
var read_exports6 = {};
__export(read_exports6, {
  getKey: () => read10,
  getKeyIdHashes: () => read11,
  getKeyIdHashesCount: () => read12
});

// src/DelegationFramework/HybridDeleGator/methods/getKey.ts
import { HybridDeleGator } from "@metamask/delegation-abis";
import { readContract as readContract10 } from "viem/actions";
var read10 = async ({
  client,
  hybridDeleGatorAddress,
  keyId
}) => await readContract10(client, {
  address: hybridDeleGatorAddress,
  abi: HybridDeleGator.abi,
  functionName: "getKey",
  args: [keyId]
});

// src/DelegationFramework/HybridDeleGator/methods/getKeyIdHashes.ts
import { HybridDeleGator as HybridDeleGator2 } from "@metamask/delegation-abis";
import { readContract as readContract11 } from "viem/actions";
var read11 = async ({
  client,
  hybridDeleGatorAddress
}) => await readContract11(client, {
  address: hybridDeleGatorAddress,
  abi: HybridDeleGator2.abi,
  functionName: "getKeyIdHashes"
});

// src/DelegationFramework/HybridDeleGator/methods/getKeyIdHashesCount.ts
import { HybridDeleGator as HybridDeleGator3 } from "@metamask/delegation-abis";
import { readContract as readContract12 } from "viem/actions";
var read12 = async ({
  client,
  hybridDeleGatorAddress
}) => await readContract12(client, {
  address: hybridDeleGatorAddress,
  abi: HybridDeleGator3.abi,
  functionName: "getKeyIdHashesCount"
});

// src/DelegationFramework/HybridDeleGator/simulate.ts
var simulate_exports3 = {};
__export(simulate_exports3, {
  addKey: () => simulate,
  initializeHybridDeleGator: () => simulate2,
  reinitializeHybridDeleGator: () => simulate3,
  removeKey: () => simulate4,
  updateSigners: () => simulate5
});

// src/DelegationFramework/HybridDeleGator/constants.ts
var constants_exports2 = {};
__export(constants_exports2, {
  ANY_BENEFICIARY: () => ANY_BENEFICIARY,
  DOMAIN_VERSION: () => DOMAIN_VERSION2,
  NAME: () => NAME2,
  ROOT_AUTHORITY: () => ROOT_AUTHORITY,
  VERSION: () => VERSION2
});
var NAME2 = "HybridDeleGator";
var VERSION2 = "1.3.0";
var DOMAIN_VERSION2 = "1";

// src/DelegationFramework/IdEnforcer/index.ts
var IdEnforcer_exports = {};
__export(IdEnforcer_exports, {
  read: () => read_exports7
});

// src/DelegationFramework/IdEnforcer/read.ts
var read_exports7 = {};
__export(read_exports7, {
  getIsUsed: () => read13,
  getTermsInfo: () => read14
});

// src/DelegationFramework/IdEnforcer/methods/getIsUsed.ts
import { IdEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract13 } from "viem/actions";
var read13 = async ({
  client,
  contractAddress,
  delegationManager,
  delegator,
  id
}) => {
  const isUsed = await readContract13(client, {
    address: contractAddress,
    abi: IdEnforcer.abi,
    functionName: "getIsUsed",
    args: [delegationManager, delegator, id]
  });
  return isUsed;
};

// src/DelegationFramework/IdEnforcer/methods/getTermsInfo.ts
import { IdEnforcer as IdEnforcer2 } from "@metamask/delegation-abis";
import { readContract as readContract14 } from "viem/actions";
var read14 = async ({
  client,
  contractAddress,
  terms
}) => {
  const id = await readContract14(client, {
    address: contractAddress,
    abi: IdEnforcer2.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return id;
};

// src/DelegationFramework/LimitedCallsEnforcer/index.ts
var LimitedCallsEnforcer_exports = {};
__export(LimitedCallsEnforcer_exports, {
  read: () => read_exports8
});

// src/DelegationFramework/LimitedCallsEnforcer/read.ts
var read_exports8 = {};
__export(read_exports8, {
  callCounts: () => read15,
  getTermsInfo: () => read16
});

// src/DelegationFramework/LimitedCallsEnforcer/methods/callCounts.ts
import { LimitedCallsEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract15 } from "viem/actions";
var read15 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash
}) => {
  const count = await readContract15(client, {
    address: contractAddress,
    abi: LimitedCallsEnforcer.abi,
    functionName: "callCounts",
    args: [delegationManager, delegationHash]
  });
  return count;
};

// src/DelegationFramework/LimitedCallsEnforcer/methods/getTermsInfo.ts
import { LimitedCallsEnforcer as LimitedCallsEnforcer2 } from "@metamask/delegation-abis";
import { readContract as readContract16 } from "viem/actions";
var read16 = async ({
  client,
  contractAddress,
  terms
}) => {
  const limit = await readContract16(client, {
    address: contractAddress,
    abi: LimitedCallsEnforcer2.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return limit;
};

// src/DelegationFramework/MultiSigDeleGator/index.ts
var MultiSigDeleGator_exports = {};
__export(MultiSigDeleGator_exports, {
  constants: () => constants_exports3,
  encode: () => encode_exports2,
  read: () => read_exports9,
  simulate: () => simulate_exports4
});

// src/DelegationFramework/MultiSigDeleGator/read.ts
var read_exports9 = {};
__export(read_exports9, {
  getMaxNumberOfSigners: () => read17,
  getSigners: () => read18,
  getSignersCount: () => read19,
  getThreshold: () => read20,
  isSigner: () => read21
});

// src/DelegationFramework/MultiSigDeleGator/methods/getMaxNumberOfSigners.ts
import { MultiSigDeleGator } from "@metamask/delegation-abis";
import { readContract as readContract17 } from "viem/actions";
var read17 = async ({
  client,
  multiSigDeleGatorAddress
}) => await readContract17(client, {
  address: multiSigDeleGatorAddress,
  abi: MultiSigDeleGator.abi,
  functionName: "MAX_NUMBER_OF_SIGNERS"
});

// src/DelegationFramework/MultiSigDeleGator/methods/getSigners.ts
import { MultiSigDeleGator as MultiSigDeleGator2 } from "@metamask/delegation-abis";
import { readContract as readContract18 } from "viem/actions";
var read18 = async ({
  client,
  multiSigDeleGatorAddress
}) => await readContract18(client, {
  address: multiSigDeleGatorAddress,
  abi: MultiSigDeleGator2.abi,
  functionName: "getSigners"
});

// src/DelegationFramework/MultiSigDeleGator/methods/getSignersCount.ts
import { MultiSigDeleGator as MultiSigDeleGator3 } from "@metamask/delegation-abis";
import { readContract as readContract19 } from "viem/actions";
var read19 = async ({
  client,
  multiSigDeleGatorAddress
}) => await readContract19(client, {
  address: multiSigDeleGatorAddress,
  abi: MultiSigDeleGator3.abi,
  functionName: "getSignersCount"
});

// src/DelegationFramework/MultiSigDeleGator/methods/getThreshold.ts
import { MultiSigDeleGator as MultiSigDeleGator4 } from "@metamask/delegation-abis";
import { readContract as readContract20 } from "viem/actions";
var read20 = async ({
  client,
  multiSigDeleGatorAddress
}) => await readContract20(client, {
  address: multiSigDeleGatorAddress,
  abi: MultiSigDeleGator4.abi,
  functionName: "getThreshold"
});

// src/DelegationFramework/MultiSigDeleGator/methods/isSigner.ts
import { MultiSigDeleGator as MultiSigDeleGator5 } from "@metamask/delegation-abis";
import { readContract as readContract21 } from "viem/actions";
var read21 = async ({
  client,
  multiSigDeleGatorAddress,
  signer
}) => await readContract21(client, {
  address: multiSigDeleGatorAddress,
  abi: MultiSigDeleGator5.abi,
  functionName: "isSigner",
  args: [signer]
});

// src/DelegationFramework/MultiSigDeleGator/simulate.ts
var simulate_exports4 = {};
__export(simulate_exports4, {
  addSigner: () => simulate6,
  initializeMultiSigDeleGator: () => simulate7,
  reinitializeMultiSigDeleGator: () => simulate8,
  removeSigner: () => simulate9,
  replaceSigner: () => simulate10,
  updateMultiSigParameters: () => simulate11,
  updateThreshold: () => simulate12
});

// src/DelegationFramework/MultiSigDeleGator/constants.ts
var constants_exports3 = {};
__export(constants_exports3, {
  MAX_NUMBER_OF_SIGNERS: () => MAX_NUMBER_OF_SIGNERS
});
var MAX_NUMBER_OF_SIGNERS = 30;

// src/DelegationFramework/NativeTokenTransferAmountEnforcer/index.ts
var NativeTokenTransferAmountEnforcer_exports = {};
__export(NativeTokenTransferAmountEnforcer_exports, {
  read: () => read_exports10
});

// src/DelegationFramework/NativeTokenTransferAmountEnforcer/read.ts
var read_exports10 = {};
__export(read_exports10, {
  getSpentAmount: () => read22,
  getTermsInfo: () => read23
});

// src/DelegationFramework/NativeTokenTransferAmountEnforcer/methods/getSpentAmount.ts
import { NativeTokenTransferAmountEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract22 } from "viem/actions";
var read22 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash
}) => {
  const amount = await readContract22(client, {
    address: contractAddress,
    abi: NativeTokenTransferAmountEnforcer.abi,
    functionName: "spentMap",
    args: [delegationManager, delegationHash]
  });
  return amount;
};

// src/DelegationFramework/NativeTokenTransferAmountEnforcer/methods/getTermsInfo.ts
import { NativeTokenTransferAmountEnforcer as NativeTokenTransferAmountEnforcer2 } from "@metamask/delegation-abis";
import { readContract as readContract23 } from "viem/actions";
var read23 = async ({
  client,
  contractAddress,
  terms
}) => {
  const allowance = await readContract23(client, {
    address: contractAddress,
    abi: NativeTokenTransferAmountEnforcer2.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return allowance;
};

// src/DelegationFramework/NonceEnforcer/index.ts
var NonceEnforcer_exports = {};
__export(NonceEnforcer_exports, {
  encode: () => encode_exports6,
  execute: () => execute_exports3,
  read: () => read_exports11,
  simulate: () => simulate_exports5
});

// src/DelegationFramework/NonceEnforcer/encode.ts
var encode_exports6 = {};
__export(encode_exports6, {
  incrementNonce: () => encode4
});

// src/DelegationFramework/NonceEnforcer/methods/incrementNonce.ts
import { NonceEnforcer } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData4 } from "viem";
import { simulateContract as simulateContract4, writeContract as writeContract4 } from "viem/actions";
var encode4 = (delegationManager) => {
  return encodeFunctionData4({
    abi: NonceEnforcer.abi,
    functionName: "incrementNonce",
    args: [delegationManager]
  });
};
var simulate22 = async ({
  client,
  contractAddress,
  delegationManager
}) => {
  return simulateContract4(client, {
    address: contractAddress,
    abi: NonceEnforcer.abi,
    functionName: "incrementNonce",
    args: [delegationManager]
  });
};
var execute10 = async ({
  client,
  contractAddress,
  delegationManager
}) => {
  const { request } = await simulate22({
    client,
    contractAddress,
    delegationManager
  });
  return writeContract4(client, request);
};

// src/DelegationFramework/NonceEnforcer/execute.ts
var execute_exports3 = {};
__export(execute_exports3, {
  incrementNonce: () => execute10
});

// src/DelegationFramework/NonceEnforcer/read.ts
var read_exports11 = {};
__export(read_exports11, {
  currentNonce: () => read24,
  getTermsInfo: () => read25
});

// src/DelegationFramework/NonceEnforcer/methods/currentNonce.ts
import { NonceEnforcer as NonceEnforcer2 } from "@metamask/delegation-abis";
import { readContract as readContract24 } from "viem/actions";
var read24 = async ({
  client,
  contractAddress,
  delegationManager,
  delegator
}) => {
  const nonce = await readContract24(client, {
    address: contractAddress,
    abi: NonceEnforcer2.abi,
    functionName: "currentNonce",
    args: [delegationManager, delegator]
  });
  return nonce;
};

// src/DelegationFramework/NonceEnforcer/methods/getTermsInfo.ts
import { NonceEnforcer as NonceEnforcer3 } from "@metamask/delegation-abis";
import { readContract as readContract25 } from "viem/actions";
var read25 = async ({
  client,
  contractAddress,
  terms
}) => {
  const nonce = await readContract25(client, {
    address: contractAddress,
    abi: NonceEnforcer3.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return nonce;
};

// src/DelegationFramework/NonceEnforcer/simulate.ts
var simulate_exports5 = {};
__export(simulate_exports5, {
  incrementNonce: () => simulate22
});

// src/DelegationFramework/Ownable2Step/index.ts
var Ownable2Step_exports = {};
__export(Ownable2Step_exports, {
  encode: () => encode_exports7,
  execute: () => execute_exports4,
  read: () => read_exports12,
  simulate: () => simulate_exports6
});

// src/DelegationFramework/Ownable2Step/read.ts
var read_exports12 = {};
__export(read_exports12, {
  getOwner: () => read26,
  getPendingOwner: () => read27
});

// src/DelegationFramework/Ownable2Step/methods/getOwner.ts
import { Ownable2Step } from "@metamask/delegation-abis";
import { readContract as readContract26 } from "viem/actions";
var read26 = async ({
  client,
  contractAddress
}) => await readContract26(client, {
  address: contractAddress,
  abi: Ownable2Step.abi,
  functionName: "owner"
});

// src/DelegationFramework/Ownable2Step/methods/getPendingOwner.ts
import { Ownable2Step as Ownable2Step2 } from "@metamask/delegation-abis";
import { readContract as readContract27 } from "viem/actions";
var read27 = async ({
  client,
  contractAddress
}) => await readContract27(client, {
  address: contractAddress,
  abi: Ownable2Step2.abi,
  functionName: "pendingOwner"
});

// src/DelegationFramework/Ownable2Step/execute.ts
var execute_exports4 = {};
__export(execute_exports4, {
  acceptOwnership: () => execute11,
  renounceOwnership: () => execute12,
  transferOwnership: () => execute13
});

// src/DelegationFramework/Ownable2Step/methods/acceptOwnership.ts
import { Ownable2Step as Ownable2Step3 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData5 } from "viem";
import { simulateContract as simulateContract5, writeContract as writeContract5 } from "viem/actions";
var simulate23 = async ({
  client,
  contractAddress
}) => {
  return simulateContract5(client, {
    address: contractAddress,
    abi: Ownable2Step3.abi,
    functionName: "acceptOwnership"
  });
};
var execute11 = async ({
  client,
  contractAddress
}) => {
  const { request } = await simulate23({
    client,
    contractAddress
  });
  return writeContract5(client, request);
};
var encode5 = () => {
  return encodeFunctionData5({
    abi: Ownable2Step3.abi,
    functionName: "acceptOwnership"
  });
};

// src/DelegationFramework/Ownable2Step/methods/renounceOwnership.ts
import { Ownable2Step as Ownable2Step4 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData6 } from "viem";
import { simulateContract as simulateContract6, writeContract as writeContract6 } from "viem/actions";
var simulate24 = async ({
  client,
  contractAddress
}) => {
  return simulateContract6(client, {
    address: contractAddress,
    abi: Ownable2Step4.abi,
    functionName: "renounceOwnership"
  });
};
var execute12 = async ({
  client,
  contractAddress
}) => {
  const { request } = await simulate24({
    client,
    contractAddress
  });
  return writeContract6(client, request);
};
var encode6 = () => {
  return encodeFunctionData6({
    abi: Ownable2Step4.abi,
    functionName: "renounceOwnership"
  });
};

// src/DelegationFramework/Ownable2Step/methods/transferOwnership.ts
import { Ownable2Step as Ownable2Step5 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData7 } from "viem";
import { simulateContract as simulateContract7, writeContract as writeContract7 } from "viem/actions";
var simulate25 = async ({
  client,
  contractAddress,
  account
}) => {
  return simulateContract7(client, {
    address: contractAddress,
    abi: Ownable2Step5.abi,
    functionName: "transferOwnership",
    args: [account]
  });
};
var execute13 = async ({
  client,
  contractAddress,
  account
}) => {
  const { request } = await simulate25({
    client,
    contractAddress,
    account
  });
  return writeContract7(client, request);
};
var encode7 = (account) => {
  return encodeFunctionData7({
    abi: Ownable2Step5.abi,
    functionName: "transferOwnership",
    args: [account]
  });
};

// src/DelegationFramework/Ownable2Step/encode.ts
var encode_exports7 = {};
__export(encode_exports7, {
  acceptOwnership: () => encode5,
  renounceOwnership: () => encode6,
  transferOwnership: () => encode7
});

// src/DelegationFramework/Ownable2Step/simulate.ts
var simulate_exports6 = {};
__export(simulate_exports6, {
  acceptOwnership: () => simulate23,
  renounceOwnership: () => simulate24,
  transferOwnership: () => simulate25
});

// src/DelegationFramework/Pausable/index.ts
var Pausable_exports = {};
__export(Pausable_exports, {
  encode: () => encode_exports8,
  execute: () => execute_exports5,
  read: () => read_exports13,
  simulate: () => simulate_exports7
});

// src/DelegationFramework/Pausable/read.ts
var read_exports13 = {};
__export(read_exports13, {
  isPaused: () => read28
});

// src/DelegationFramework/Pausable/methods/isPaused.ts
import { Pausable } from "@metamask/delegation-abis";
import { readContract as readContract28 } from "viem/actions";
var read28 = async ({
  client,
  contractAddress
}) => await readContract28(client, {
  address: contractAddress,
  abi: Pausable.abi,
  functionName: "paused"
});

// src/DelegationFramework/Pausable/execute.ts
var execute_exports5 = {};
__export(execute_exports5, {
  pause: () => execute14,
  unpause: () => execute15
});

// src/DelegationFramework/Pausable/methods/pause.ts
import { encodeFunctionData as encodeFunctionData8 } from "viem";
import { simulateContract as simulateContract8, writeContract as writeContract8 } from "viem/actions";
var PauseAbi = [
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  }
];
var simulate26 = async ({
  client,
  contractAddress
}) => {
  return simulateContract8(client, {
    address: contractAddress,
    abi: PauseAbi,
    functionName: "pause"
  });
};
var execute14 = async ({
  client,
  contractAddress
}) => {
  const { request } = await simulate26({
    client,
    contractAddress
  });
  return writeContract8(client, request);
};
var encode8 = () => {
  return encodeFunctionData8({
    abi: PauseAbi,
    functionName: "pause"
  });
};

// src/DelegationFramework/Pausable/methods/unpause.ts
import { encodeFunctionData as encodeFunctionData9 } from "viem";
import { simulateContract as simulateContract9, writeContract as writeContract9 } from "viem/actions";
var UnpauseAbi = [
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  }
];
var simulate27 = async ({
  client,
  contractAddress
}) => {
  return simulateContract9(client, {
    address: contractAddress,
    abi: UnpauseAbi,
    functionName: "unpause"
  });
};
var execute15 = async ({
  client,
  contractAddress
}) => {
  const { request } = await simulate27({
    client,
    contractAddress
  });
  return writeContract9(client, request);
};
var encode9 = () => {
  return encodeFunctionData9({
    abi: UnpauseAbi,
    functionName: "unpause"
  });
};

// src/DelegationFramework/Pausable/encode.ts
var encode_exports8 = {};
__export(encode_exports8, {
  pause: () => encode8,
  unpause: () => encode9
});

// src/DelegationFramework/Pausable/simulate.ts
var simulate_exports7 = {};
__export(simulate_exports7, {
  pause: () => simulate26,
  unpause: () => simulate27
});

// src/DelegationFramework/SimpleFactory/index.ts
var SimpleFactory_exports = {};
__export(SimpleFactory_exports, {
  encode: () => encode_exports3,
  execute: () => execute_exports6,
  read: () => read_exports14,
  simulate: () => simulate_exports8
});

// src/DelegationFramework/SimpleFactory/execute.ts
var execute_exports6 = {};
__export(execute_exports6, {
  create2Deploy: () => execute
});

// src/DelegationFramework/SimpleFactory/read.ts
var read_exports14 = {};
__export(read_exports14, {
  getCreate2Address: () => read29
});

// src/DelegationFramework/SimpleFactory/methods/getCreate2Address.ts
import { SimpleFactory } from "@metamask/delegation-abis";
import { readContract as readContract29 } from "viem/actions";
var read29 = async (client, factoryAddress, creationCode, salt) => {
  return readContract29(client, {
    address: factoryAddress,
    abi: SimpleFactory.abi,
    functionName: "computeAddress",
    args: [creationCode, salt]
  });
};

// src/DelegationFramework/SimpleFactory/simulate.ts
var simulate_exports8 = {};
__export(simulate_exports8, {
  create2Deploy: () => simulate13
});

// src/DelegationFramework/SpecificActionERC20TransferBatchEnforcer/index.ts
var SpecificActionERC20TransferBatchEnforcer_exports = {};
__export(SpecificActionERC20TransferBatchEnforcer_exports, {
  read: () => read_exports15
});

// src/DelegationFramework/SpecificActionERC20TransferBatchEnforcer/read.ts
var read_exports15 = {};
__export(read_exports15, {
  getTermsInfo: () => read30,
  usedDelegations: () => read31
});

// src/DelegationFramework/SpecificActionERC20TransferBatchEnforcer/methods/getTermsInfo.ts
import { SpecificActionERC20TransferBatchEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract30 } from "viem/actions";
var read30 = async ({
  client,
  contractAddress,
  terms
}) => {
  const termsData = await readContract30(client, {
    address: contractAddress,
    abi: SpecificActionERC20TransferBatchEnforcer.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return termsData;
};

// src/DelegationFramework/SpecificActionERC20TransferBatchEnforcer/methods/usedDelegations.ts
import { SpecificActionERC20TransferBatchEnforcer as SpecificActionERC20TransferBatchEnforcer2 } from "@metamask/delegation-abis";
import { readContract as readContract31 } from "viem/actions";
var read31 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash
}) => {
  const isUsed = await readContract31(client, {
    address: contractAddress,
    abi: SpecificActionERC20TransferBatchEnforcer2.abi,
    functionName: "usedDelegations",
    args: [delegationManager, delegationHash]
  });
  return isUsed;
};

export {
  read7 as read,
  DelegationManager_exports,
  DeleGatorCore_exports,
  EIP712_exports,
  EntryPoint_exports,
  ERC20TransferAmountEnforcer_exports,
  HybridDeleGator_exports,
  IdEnforcer_exports,
  LimitedCallsEnforcer_exports,
  MultiSigDeleGator_exports,
  NativeTokenTransferAmountEnforcer_exports,
  NonceEnforcer_exports,
  Ownable2Step_exports,
  Pausable_exports,
  SimpleFactory_exports,
  SpecificActionERC20TransferBatchEnforcer_exports,
  contracts_exports
};
//# sourceMappingURL=chunk-KTAXE6PZ.mjs.map