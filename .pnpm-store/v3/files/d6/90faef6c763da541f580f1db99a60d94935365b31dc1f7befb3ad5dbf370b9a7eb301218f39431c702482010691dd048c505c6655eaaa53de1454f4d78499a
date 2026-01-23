"use strict";Object.defineProperty(exports, "__esModule", {value: true});





var _chunk4QBJFYZ7cjs = require('./chunk-4QBJFYZ7.cjs');

































var _chunkQHDMZSGQcjs = require('./chunk-QHDMZSGQ.cjs');


var _chunkT6PSFUOZcjs = require('./chunk-T6PSFUOZ.cjs');






var _chunkHJETDDBNcjs = require('./chunk-HJETDDBN.cjs');

// src/contracts/index.ts
var contracts_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, contracts_exports, {
  DeleGatorCore: () => DeleGatorCore_exports,
  DelegationManager: () => DelegationManager_exports,
  EIP712: () => EIP712_exports,
  ERC20PeriodTransferEnforcer: () => _chunk4QBJFYZ7cjs.ERC20PeriodTransferEnforcer_exports,
  ERC20StreamingEnforcer: () => _chunk4QBJFYZ7cjs.ERC20StreamingEnforcer_exports,
  ERC20TransferAmountEnforcer: () => ERC20TransferAmountEnforcer_exports,
  EntryPoint: () => EntryPoint_exports,
  HybridDeleGator: () => HybridDeleGator_exports,
  IdEnforcer: () => IdEnforcer_exports,
  LimitedCallsEnforcer: () => LimitedCallsEnforcer_exports,
  MultiSigDeleGator: () => MultiSigDeleGator_exports,
  MultiTokenPeriodEnforcer: () => _chunk4QBJFYZ7cjs.MultiTokenPeriodEnforcer_exports,
  NativeTokenPeriodTransferEnforcer: () => _chunk4QBJFYZ7cjs.NativeTokenPeriodTransferEnforcer_exports,
  NativeTokenStreamingEnforcer: () => _chunk4QBJFYZ7cjs.NativeTokenStreamingEnforcer_exports,
  NativeTokenTransferAmountEnforcer: () => NativeTokenTransferAmountEnforcer_exports,
  NonceEnforcer: () => NonceEnforcer_exports,
  Ownable2Step: () => Ownable2Step_exports,
  Pausable: () => Pausable_exports,
  SimpleFactory: () => SimpleFactory_exports,
  SpecificActionERC20TransferBatchEnforcer: () => SpecificActionERC20TransferBatchEnforcer_exports,
  encodeProxyCreationCode: () => _chunkQHDMZSGQcjs.encodeProxyCreationCode,
  isContractDeployed: () => _chunkQHDMZSGQcjs.isContractDeployed,
  isImplementationExpected: () => _chunkQHDMZSGQcjs.isImplementationExpected
});

// src/DelegationFramework/DelegationManager/index.ts
var DelegationManager_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, DelegationManager_exports, {
  constants: () => constants_exports,
  encode: () => encode_exports5,
  execute: () => execute_exports,
  read: () => read_exports2,
  simulate: () => simulate_exports
});

// src/DelegationFramework/DelegationManager/constants.ts
var constants_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, constants_exports, {
  ANY_BENEFICIARY: () => _chunkHJETDDBNcjs.ANY_BENEFICIARY,
  DOMAIN_VERSION: () => DOMAIN_VERSION,
  NAME: () => NAME,
  ROOT_AUTHORITY: () => _chunkHJETDDBNcjs.ROOT_AUTHORITY,
  VERSION: () => VERSION
});
var NAME = "DelegationManager";
var VERSION = "1.3.0";
var DOMAIN_VERSION = "1";

// src/DelegationFramework/DelegationManager/encode.ts
var encode_exports5 = {};
_chunkHJETDDBNcjs.__export.call(void 0, encode_exports5, {
  disableDelegation: () => encode,
  enableDelegation: () => encode2,
  redeemDelegations: () => encode3
});

// src/DelegationFramework/DelegationManager/methods/disableDelegation.ts
var _delegationabis = require('@metamask/delegation-abis');
var _viem = require('viem');
var _actions = require('viem/actions');
var simulate19 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const abi = _delegationabis.DelegationManager.abi;
  const delegationStruct = _chunkHJETDDBNcjs.toDelegationStruct.call(void 0, delegation);
  return _actions.simulateContract.call(void 0, client, {
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
  return _actions.writeContract.call(void 0, client, request);
};
var encode = ({ delegation }) => {
  const delegationStruct = _chunkHJETDDBNcjs.toDelegationStruct.call(void 0, delegation);
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DelegationManager.abi,
    functionName: "disableDelegation",
    args: [delegationStruct]
  });
};

// src/DelegationFramework/DelegationManager/methods/enableDelegation.ts



var simulate20 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const abi = _delegationabis.DelegationManager.abi;
  const delegationStruct = _chunkHJETDDBNcjs.toDelegationStruct.call(void 0, delegation);
  return _actions.simulateContract.call(void 0, client, {
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
  return _actions.writeContract.call(void 0, client, request);
};
var encode2 = ({ delegation }) => {
  const delegationStruct = _chunkHJETDDBNcjs.toDelegationStruct.call(void 0, delegation);
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DelegationManager.abi,
    functionName: "enableDelegation",
    args: [delegationStruct]
  });
};

// src/DelegationFramework/DelegationManager/methods/redeemDelegations.ts



var simulate21 = async ({
  client,
  delegationManagerAddress,
  delegations,
  modes,
  executions
}) => {
  const abi = _delegationabis.DelegationManager.abi;
  return _actions.simulateContract.call(void 0, client, {
    address: delegationManagerAddress,
    abi,
    functionName: "redeemDelegations",
    args: [
      _chunkHJETDDBNcjs.encodePermissionContexts.call(void 0, delegations),
      modes,
      _chunkT6PSFUOZcjs.encodeExecutionCalldatas.call(void 0, executions)
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
  return _actions.writeContract.call(void 0, client, request);
};
var encode3 = ({
  delegations,
  modes,
  executions
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DelegationManager.abi,
    functionName: "redeemDelegations",
    args: [
      _chunkHJETDDBNcjs.encodePermissionContexts.call(void 0, delegations),
      modes,
      _chunkT6PSFUOZcjs.encodeExecutionCalldatas.call(void 0, executions)
    ]
  });
};

// src/DelegationFramework/DelegationManager/execute.ts
var execute_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, execute_exports, {
  disableDelegation: () => execute7,
  enableDelegation: () => execute8,
  redeemDelegations: () => execute9
});

// src/DelegationFramework/DelegationManager/read.ts
var read_exports2 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports2, {
  disabledDelegations: () => read,
  getAnyDelegate: () => read2,
  getRootAuthority: () => read3
});

// src/DelegationFramework/DelegationManager/methods/disabledDelegations.ts


var read = async ({
  client,
  contractAddress,
  delegationHash
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DelegationManager.abi,
  functionName: "disabledDelegations",
  args: [delegationHash]
});

// src/DelegationFramework/DelegationManager/methods/getAnyDelegate.ts


var read2 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DelegationManager.abi,
  functionName: "ANY_DELEGATE"
});

// src/DelegationFramework/DelegationManager/methods/getRootAuthority.ts


var read3 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DelegationManager.abi,
  functionName: "ROOT_AUTHORITY"
});

// src/DelegationFramework/DelegationManager/simulate.ts
var simulate_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, simulate_exports, {
  disableDelegation: () => simulate19,
  enableDelegation: () => simulate20,
  redeemDelegations: () => simulate21
});

// src/DelegationFramework/DeleGatorCore/index.ts
var DeleGatorCore_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, DeleGatorCore_exports, {
  encode: () => _chunkQHDMZSGQcjs.encode_exports4,
  execute: () => execute_exports2,
  read: () => _chunkQHDMZSGQcjs.read_exports,
  simulate: () => simulate_exports2
});

// src/DelegationFramework/DeleGatorCore/execute.ts
var execute_exports2 = {};
_chunkHJETDDBNcjs.__export.call(void 0, execute_exports2, {
  disableDelegation: () => _chunkQHDMZSGQcjs.execute2,
  enableDelegation: () => _chunkQHDMZSGQcjs.execute3,
  execute: () => _chunkQHDMZSGQcjs.execute4,
  executeWithMode: () => _chunkQHDMZSGQcjs.execute5,
  upgradeToAndCall: () => _chunkQHDMZSGQcjs.execute6
});

// src/DelegationFramework/DeleGatorCore/simulate.ts
var simulate_exports2 = {};
_chunkHJETDDBNcjs.__export.call(void 0, simulate_exports2, {
  disableDelegation: () => _chunkQHDMZSGQcjs.simulate14,
  enableDelegation: () => _chunkQHDMZSGQcjs.simulate15,
  execute: () => _chunkQHDMZSGQcjs.simulate16,
  executeWithMode: () => _chunkQHDMZSGQcjs.simulate17,
  upgradeToAndCall: () => _chunkQHDMZSGQcjs.simulate18
});

// src/DelegationFramework/EIP712/index.ts
var EIP712_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, EIP712_exports, {
  read: () => read_exports3
});

// src/DelegationFramework/EIP712/read.ts
var read_exports3 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports3, {
  getContractName: () => read4,
  getContractVersion: () => read5,
  getDomainVersion: () => read6
});

// src/DelegationFramework/EIP712/methods/getContractName.ts

var read4 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
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

var read5 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
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

var read6 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
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
_chunkHJETDDBNcjs.__export.call(void 0, EntryPoint_exports, {
  read: () => read_exports4
});

// src/DelegationFramework/EntryPoint/read.ts
var read_exports4 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports4, {
  entryPointGetNonce: () => read7
});

// src/DelegationFramework/EntryPoint/methods/getNonce.ts


var read7 = async ({
  client,
  entryPoint,
  contractAddress,
  key
}) => await _actions.readContract.call(void 0, client, {
  address: entryPoint,
  abi: _delegationabis.EntryPoint.abi,
  functionName: "getNonce",
  args: [contractAddress, key]
});

// src/DelegationFramework/ERC20TransferAmountEnforcer/index.ts
var ERC20TransferAmountEnforcer_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, ERC20TransferAmountEnforcer_exports, {
  read: () => read_exports5
});

// src/DelegationFramework/ERC20TransferAmountEnforcer/read.ts
var read_exports5 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports5, {
  getSpentAmount: () => read8,
  getTermsInfo: () => read9
});

// src/DelegationFramework/ERC20TransferAmountEnforcer/methods/getSpentAmount.ts


var read8 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash
}) => {
  const amount = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.ERC20TransferAmountEnforcer.abi,
    functionName: "spentMap",
    args: [delegationManager, delegationHash]
  });
  return amount;
};

// src/DelegationFramework/ERC20TransferAmountEnforcer/methods/getTermsInfo.ts


var read9 = async ({
  client,
  contractAddress,
  terms
}) => {
  const [allowedContract, maxTokens] = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.ERC20TransferAmountEnforcer.abi,
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
_chunkHJETDDBNcjs.__export.call(void 0, HybridDeleGator_exports, {
  constants: () => constants_exports2,
  encode: () => _chunkQHDMZSGQcjs.encode_exports,
  read: () => read_exports6,
  simulate: () => simulate_exports3
});

// src/DelegationFramework/HybridDeleGator/read.ts
var read_exports6 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports6, {
  getKey: () => read10,
  getKeyIdHashes: () => read11,
  getKeyIdHashesCount: () => read12
});

// src/DelegationFramework/HybridDeleGator/methods/getKey.ts


var read10 = async ({
  client,
  hybridDeleGatorAddress,
  keyId
}) => await _actions.readContract.call(void 0, client, {
  address: hybridDeleGatorAddress,
  abi: _delegationabis.HybridDeleGator.abi,
  functionName: "getKey",
  args: [keyId]
});

// src/DelegationFramework/HybridDeleGator/methods/getKeyIdHashes.ts


var read11 = async ({
  client,
  hybridDeleGatorAddress
}) => await _actions.readContract.call(void 0, client, {
  address: hybridDeleGatorAddress,
  abi: _delegationabis.HybridDeleGator.abi,
  functionName: "getKeyIdHashes"
});

// src/DelegationFramework/HybridDeleGator/methods/getKeyIdHashesCount.ts


var read12 = async ({
  client,
  hybridDeleGatorAddress
}) => await _actions.readContract.call(void 0, client, {
  address: hybridDeleGatorAddress,
  abi: _delegationabis.HybridDeleGator.abi,
  functionName: "getKeyIdHashesCount"
});

// src/DelegationFramework/HybridDeleGator/simulate.ts
var simulate_exports3 = {};
_chunkHJETDDBNcjs.__export.call(void 0, simulate_exports3, {
  addKey: () => _chunkQHDMZSGQcjs.simulate,
  initializeHybridDeleGator: () => _chunkQHDMZSGQcjs.simulate2,
  reinitializeHybridDeleGator: () => _chunkQHDMZSGQcjs.simulate3,
  removeKey: () => _chunkQHDMZSGQcjs.simulate4,
  updateSigners: () => _chunkQHDMZSGQcjs.simulate5
});

// src/DelegationFramework/HybridDeleGator/constants.ts
var constants_exports2 = {};
_chunkHJETDDBNcjs.__export.call(void 0, constants_exports2, {
  ANY_BENEFICIARY: () => _chunkHJETDDBNcjs.ANY_BENEFICIARY,
  DOMAIN_VERSION: () => DOMAIN_VERSION2,
  NAME: () => NAME2,
  ROOT_AUTHORITY: () => _chunkHJETDDBNcjs.ROOT_AUTHORITY,
  VERSION: () => VERSION2
});
var NAME2 = "HybridDeleGator";
var VERSION2 = "1.3.0";
var DOMAIN_VERSION2 = "1";

// src/DelegationFramework/IdEnforcer/index.ts
var IdEnforcer_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, IdEnforcer_exports, {
  read: () => read_exports7
});

// src/DelegationFramework/IdEnforcer/read.ts
var read_exports7 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports7, {
  getIsUsed: () => read13,
  getTermsInfo: () => read14
});

// src/DelegationFramework/IdEnforcer/methods/getIsUsed.ts


var read13 = async ({
  client,
  contractAddress,
  delegationManager,
  delegator,
  id
}) => {
  const isUsed = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.IdEnforcer.abi,
    functionName: "getIsUsed",
    args: [delegationManager, delegator, id]
  });
  return isUsed;
};

// src/DelegationFramework/IdEnforcer/methods/getTermsInfo.ts


var read14 = async ({
  client,
  contractAddress,
  terms
}) => {
  const id = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.IdEnforcer.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return id;
};

// src/DelegationFramework/LimitedCallsEnforcer/index.ts
var LimitedCallsEnforcer_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, LimitedCallsEnforcer_exports, {
  read: () => read_exports8
});

// src/DelegationFramework/LimitedCallsEnforcer/read.ts
var read_exports8 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports8, {
  callCounts: () => read15,
  getTermsInfo: () => read16
});

// src/DelegationFramework/LimitedCallsEnforcer/methods/callCounts.ts


var read15 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash
}) => {
  const count = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.LimitedCallsEnforcer.abi,
    functionName: "callCounts",
    args: [delegationManager, delegationHash]
  });
  return count;
};

// src/DelegationFramework/LimitedCallsEnforcer/methods/getTermsInfo.ts


var read16 = async ({
  client,
  contractAddress,
  terms
}) => {
  const limit = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.LimitedCallsEnforcer.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return limit;
};

// src/DelegationFramework/MultiSigDeleGator/index.ts
var MultiSigDeleGator_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, MultiSigDeleGator_exports, {
  constants: () => constants_exports3,
  encode: () => _chunkQHDMZSGQcjs.encode_exports2,
  read: () => read_exports9,
  simulate: () => simulate_exports4
});

// src/DelegationFramework/MultiSigDeleGator/read.ts
var read_exports9 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports9, {
  getMaxNumberOfSigners: () => read17,
  getSigners: () => read18,
  getSignersCount: () => read19,
  getThreshold: () => read20,
  isSigner: () => read21
});

// src/DelegationFramework/MultiSigDeleGator/methods/getMaxNumberOfSigners.ts


var read17 = async ({
  client,
  multiSigDeleGatorAddress
}) => await _actions.readContract.call(void 0, client, {
  address: multiSigDeleGatorAddress,
  abi: _delegationabis.MultiSigDeleGator.abi,
  functionName: "MAX_NUMBER_OF_SIGNERS"
});

// src/DelegationFramework/MultiSigDeleGator/methods/getSigners.ts


var read18 = async ({
  client,
  multiSigDeleGatorAddress
}) => await _actions.readContract.call(void 0, client, {
  address: multiSigDeleGatorAddress,
  abi: _delegationabis.MultiSigDeleGator.abi,
  functionName: "getSigners"
});

// src/DelegationFramework/MultiSigDeleGator/methods/getSignersCount.ts


var read19 = async ({
  client,
  multiSigDeleGatorAddress
}) => await _actions.readContract.call(void 0, client, {
  address: multiSigDeleGatorAddress,
  abi: _delegationabis.MultiSigDeleGator.abi,
  functionName: "getSignersCount"
});

// src/DelegationFramework/MultiSigDeleGator/methods/getThreshold.ts


var read20 = async ({
  client,
  multiSigDeleGatorAddress
}) => await _actions.readContract.call(void 0, client, {
  address: multiSigDeleGatorAddress,
  abi: _delegationabis.MultiSigDeleGator.abi,
  functionName: "getThreshold"
});

// src/DelegationFramework/MultiSigDeleGator/methods/isSigner.ts


var read21 = async ({
  client,
  multiSigDeleGatorAddress,
  signer
}) => await _actions.readContract.call(void 0, client, {
  address: multiSigDeleGatorAddress,
  abi: _delegationabis.MultiSigDeleGator.abi,
  functionName: "isSigner",
  args: [signer]
});

// src/DelegationFramework/MultiSigDeleGator/simulate.ts
var simulate_exports4 = {};
_chunkHJETDDBNcjs.__export.call(void 0, simulate_exports4, {
  addSigner: () => _chunkQHDMZSGQcjs.simulate6,
  initializeMultiSigDeleGator: () => _chunkQHDMZSGQcjs.simulate7,
  reinitializeMultiSigDeleGator: () => _chunkQHDMZSGQcjs.simulate8,
  removeSigner: () => _chunkQHDMZSGQcjs.simulate9,
  replaceSigner: () => _chunkQHDMZSGQcjs.simulate10,
  updateMultiSigParameters: () => _chunkQHDMZSGQcjs.simulate11,
  updateThreshold: () => _chunkQHDMZSGQcjs.simulate12
});

// src/DelegationFramework/MultiSigDeleGator/constants.ts
var constants_exports3 = {};
_chunkHJETDDBNcjs.__export.call(void 0, constants_exports3, {
  MAX_NUMBER_OF_SIGNERS: () => MAX_NUMBER_OF_SIGNERS
});
var MAX_NUMBER_OF_SIGNERS = 30;

// src/DelegationFramework/NativeTokenTransferAmountEnforcer/index.ts
var NativeTokenTransferAmountEnforcer_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, NativeTokenTransferAmountEnforcer_exports, {
  read: () => read_exports10
});

// src/DelegationFramework/NativeTokenTransferAmountEnforcer/read.ts
var read_exports10 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports10, {
  getSpentAmount: () => read22,
  getTermsInfo: () => read23
});

// src/DelegationFramework/NativeTokenTransferAmountEnforcer/methods/getSpentAmount.ts


var read22 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash
}) => {
  const amount = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.NativeTokenTransferAmountEnforcer.abi,
    functionName: "spentMap",
    args: [delegationManager, delegationHash]
  });
  return amount;
};

// src/DelegationFramework/NativeTokenTransferAmountEnforcer/methods/getTermsInfo.ts


var read23 = async ({
  client,
  contractAddress,
  terms
}) => {
  const allowance = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.NativeTokenTransferAmountEnforcer.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return allowance;
};

// src/DelegationFramework/NonceEnforcer/index.ts
var NonceEnforcer_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, NonceEnforcer_exports, {
  encode: () => encode_exports6,
  execute: () => execute_exports3,
  read: () => read_exports11,
  simulate: () => simulate_exports5
});

// src/DelegationFramework/NonceEnforcer/encode.ts
var encode_exports6 = {};
_chunkHJETDDBNcjs.__export.call(void 0, encode_exports6, {
  incrementNonce: () => encode4
});

// src/DelegationFramework/NonceEnforcer/methods/incrementNonce.ts



var encode4 = (delegationManager) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.NonceEnforcer.abi,
    functionName: "incrementNonce",
    args: [delegationManager]
  });
};
var simulate22 = async ({
  client,
  contractAddress,
  delegationManager
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.NonceEnforcer.abi,
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
  return _actions.writeContract.call(void 0, client, request);
};

// src/DelegationFramework/NonceEnforcer/execute.ts
var execute_exports3 = {};
_chunkHJETDDBNcjs.__export.call(void 0, execute_exports3, {
  incrementNonce: () => execute10
});

// src/DelegationFramework/NonceEnforcer/read.ts
var read_exports11 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports11, {
  currentNonce: () => read24,
  getTermsInfo: () => read25
});

// src/DelegationFramework/NonceEnforcer/methods/currentNonce.ts


var read24 = async ({
  client,
  contractAddress,
  delegationManager,
  delegator
}) => {
  const nonce = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.NonceEnforcer.abi,
    functionName: "currentNonce",
    args: [delegationManager, delegator]
  });
  return nonce;
};

// src/DelegationFramework/NonceEnforcer/methods/getTermsInfo.ts


var read25 = async ({
  client,
  contractAddress,
  terms
}) => {
  const nonce = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.NonceEnforcer.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return nonce;
};

// src/DelegationFramework/NonceEnforcer/simulate.ts
var simulate_exports5 = {};
_chunkHJETDDBNcjs.__export.call(void 0, simulate_exports5, {
  incrementNonce: () => simulate22
});

// src/DelegationFramework/Ownable2Step/index.ts
var Ownable2Step_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, Ownable2Step_exports, {
  encode: () => encode_exports7,
  execute: () => execute_exports4,
  read: () => read_exports12,
  simulate: () => simulate_exports6
});

// src/DelegationFramework/Ownable2Step/read.ts
var read_exports12 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports12, {
  getOwner: () => read26,
  getPendingOwner: () => read27
});

// src/DelegationFramework/Ownable2Step/methods/getOwner.ts


var read26 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.Ownable2Step.abi,
  functionName: "owner"
});

// src/DelegationFramework/Ownable2Step/methods/getPendingOwner.ts


var read27 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.Ownable2Step.abi,
  functionName: "pendingOwner"
});

// src/DelegationFramework/Ownable2Step/execute.ts
var execute_exports4 = {};
_chunkHJETDDBNcjs.__export.call(void 0, execute_exports4, {
  acceptOwnership: () => execute11,
  renounceOwnership: () => execute12,
  transferOwnership: () => execute13
});

// src/DelegationFramework/Ownable2Step/methods/acceptOwnership.ts



var simulate23 = async ({
  client,
  contractAddress
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.Ownable2Step.abi,
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
  return _actions.writeContract.call(void 0, client, request);
};
var encode5 = () => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.Ownable2Step.abi,
    functionName: "acceptOwnership"
  });
};

// src/DelegationFramework/Ownable2Step/methods/renounceOwnership.ts



var simulate24 = async ({
  client,
  contractAddress
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.Ownable2Step.abi,
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
  return _actions.writeContract.call(void 0, client, request);
};
var encode6 = () => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.Ownable2Step.abi,
    functionName: "renounceOwnership"
  });
};

// src/DelegationFramework/Ownable2Step/methods/transferOwnership.ts



var simulate25 = async ({
  client,
  contractAddress,
  account
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.Ownable2Step.abi,
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
  return _actions.writeContract.call(void 0, client, request);
};
var encode7 = (account) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.Ownable2Step.abi,
    functionName: "transferOwnership",
    args: [account]
  });
};

// src/DelegationFramework/Ownable2Step/encode.ts
var encode_exports7 = {};
_chunkHJETDDBNcjs.__export.call(void 0, encode_exports7, {
  acceptOwnership: () => encode5,
  renounceOwnership: () => encode6,
  transferOwnership: () => encode7
});

// src/DelegationFramework/Ownable2Step/simulate.ts
var simulate_exports6 = {};
_chunkHJETDDBNcjs.__export.call(void 0, simulate_exports6, {
  acceptOwnership: () => simulate23,
  renounceOwnership: () => simulate24,
  transferOwnership: () => simulate25
});

// src/DelegationFramework/Pausable/index.ts
var Pausable_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, Pausable_exports, {
  encode: () => encode_exports8,
  execute: () => execute_exports5,
  read: () => read_exports13,
  simulate: () => simulate_exports7
});

// src/DelegationFramework/Pausable/read.ts
var read_exports13 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports13, {
  isPaused: () => read28
});

// src/DelegationFramework/Pausable/methods/isPaused.ts


var read28 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.Pausable.abi,
  functionName: "paused"
});

// src/DelegationFramework/Pausable/execute.ts
var execute_exports5 = {};
_chunkHJETDDBNcjs.__export.call(void 0, execute_exports5, {
  pause: () => execute14,
  unpause: () => execute15
});

// src/DelegationFramework/Pausable/methods/pause.ts


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
  return _actions.simulateContract.call(void 0, client, {
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
  return _actions.writeContract.call(void 0, client, request);
};
var encode8 = () => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: PauseAbi,
    functionName: "pause"
  });
};

// src/DelegationFramework/Pausable/methods/unpause.ts


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
  return _actions.simulateContract.call(void 0, client, {
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
  return _actions.writeContract.call(void 0, client, request);
};
var encode9 = () => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: UnpauseAbi,
    functionName: "unpause"
  });
};

// src/DelegationFramework/Pausable/encode.ts
var encode_exports8 = {};
_chunkHJETDDBNcjs.__export.call(void 0, encode_exports8, {
  pause: () => encode8,
  unpause: () => encode9
});

// src/DelegationFramework/Pausable/simulate.ts
var simulate_exports7 = {};
_chunkHJETDDBNcjs.__export.call(void 0, simulate_exports7, {
  pause: () => simulate26,
  unpause: () => simulate27
});

// src/DelegationFramework/SimpleFactory/index.ts
var SimpleFactory_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, SimpleFactory_exports, {
  encode: () => _chunkQHDMZSGQcjs.encode_exports3,
  execute: () => execute_exports6,
  read: () => read_exports14,
  simulate: () => simulate_exports8
});

// src/DelegationFramework/SimpleFactory/execute.ts
var execute_exports6 = {};
_chunkHJETDDBNcjs.__export.call(void 0, execute_exports6, {
  create2Deploy: () => _chunkQHDMZSGQcjs.execute
});

// src/DelegationFramework/SimpleFactory/read.ts
var read_exports14 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports14, {
  getCreate2Address: () => read29
});

// src/DelegationFramework/SimpleFactory/methods/getCreate2Address.ts


var read29 = async (client, factoryAddress, creationCode, salt) => {
  return _actions.readContract.call(void 0, client, {
    address: factoryAddress,
    abi: _delegationabis.SimpleFactory.abi,
    functionName: "computeAddress",
    args: [creationCode, salt]
  });
};

// src/DelegationFramework/SimpleFactory/simulate.ts
var simulate_exports8 = {};
_chunkHJETDDBNcjs.__export.call(void 0, simulate_exports8, {
  create2Deploy: () => _chunkQHDMZSGQcjs.simulate13
});

// src/DelegationFramework/SpecificActionERC20TransferBatchEnforcer/index.ts
var SpecificActionERC20TransferBatchEnforcer_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, SpecificActionERC20TransferBatchEnforcer_exports, {
  read: () => read_exports15
});

// src/DelegationFramework/SpecificActionERC20TransferBatchEnforcer/read.ts
var read_exports15 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports15, {
  getTermsInfo: () => read30,
  usedDelegations: () => read31
});

// src/DelegationFramework/SpecificActionERC20TransferBatchEnforcer/methods/getTermsInfo.ts


var read30 = async ({
  client,
  contractAddress,
  terms
}) => {
  const termsData = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.SpecificActionERC20TransferBatchEnforcer.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  return termsData;
};

// src/DelegationFramework/SpecificActionERC20TransferBatchEnforcer/methods/usedDelegations.ts


var read31 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash
}) => {
  const isUsed = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.SpecificActionERC20TransferBatchEnforcer.abi,
    functionName: "usedDelegations",
    args: [delegationManager, delegationHash]
  });
  return isUsed;
};



















exports.read = read7; exports.DelegationManager_exports = DelegationManager_exports; exports.DeleGatorCore_exports = DeleGatorCore_exports; exports.EIP712_exports = EIP712_exports; exports.EntryPoint_exports = EntryPoint_exports; exports.ERC20TransferAmountEnforcer_exports = ERC20TransferAmountEnforcer_exports; exports.HybridDeleGator_exports = HybridDeleGator_exports; exports.IdEnforcer_exports = IdEnforcer_exports; exports.LimitedCallsEnforcer_exports = LimitedCallsEnforcer_exports; exports.MultiSigDeleGator_exports = MultiSigDeleGator_exports; exports.NativeTokenTransferAmountEnforcer_exports = NativeTokenTransferAmountEnforcer_exports; exports.NonceEnforcer_exports = NonceEnforcer_exports; exports.Ownable2Step_exports = Ownable2Step_exports; exports.Pausable_exports = Pausable_exports; exports.SimpleFactory_exports = SimpleFactory_exports; exports.SpecificActionERC20TransferBatchEnforcer_exports = SpecificActionERC20TransferBatchEnforcer_exports; exports.contracts_exports = contracts_exports;
//# sourceMappingURL=chunk-DLR4BZKP.cjs.map