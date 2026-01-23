"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkT6PSFUOZcjs = require('./chunk-T6PSFUOZ.cjs');



var _chunkHJETDDBNcjs = require('./chunk-HJETDDBN.cjs');

// src/DelegationFramework/utils.ts
var _delegationabis = require('@metamask/delegation-abis');
var _viem = require('viem');
var _actions = require('viem/actions');

// src/DelegationFramework/DeleGatorCore/read.ts
var read_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports, {
  getDelegationManager: () => read,
  getDeposit: () => read2,
  getEntryPoint: () => read3,
  getNonce: () => read4,
  getProxyImplementation: () => read5,
  getProxyVersion: () => read6,
  isValidSignature: () => read7
});

// src/DelegationFramework/DeleGatorCore/methods/getDelegationManager.ts


var read = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DeleGatorCore.abi,
  functionName: "delegationManager"
});

// src/DelegationFramework/DeleGatorCore/methods/getDeposit.ts


var read2 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DeleGatorCore.abi,
  functionName: "getDeposit"
});

// src/DelegationFramework/DeleGatorCore/methods/getEntryPoint.ts


var read3 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DeleGatorCore.abi,
  functionName: "entryPoint"
});

// src/DelegationFramework/DeleGatorCore/methods/getNonce.ts


var read4 = async ({
  client,
  contractAddress,
  key
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DeleGatorCore.abi,
  functionName: "getNonce",
  args: key ? [key] : void 0
});

// src/DelegationFramework/DeleGatorCore/methods/getProxyImplementation.ts


var read5 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DeleGatorCore.abi,
  functionName: "getImplementation"
});

// src/DelegationFramework/DeleGatorCore/methods/getProxyVersion.ts


var read6 = async ({
  client,
  contractAddress
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DeleGatorCore.abi,
  functionName: "getInitializedVersion"
});

// src/DelegationFramework/DeleGatorCore/methods/isValidSignature.ts



var read7 = async ({
  client,
  contractAddress,
  hash,
  signature
}) => await _actions.readContract.call(void 0, client, {
  address: contractAddress,
  abi: _delegationabis.DeleGatorCore.abi,
  functionName: "isValidSignature",
  args: [hash, signature]
});
var encode = ({
  hash,
  signature
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "isValidSignature",
    args: [hash, signature]
  });
};

// src/DelegationFramework/utils.ts
async function isContractDeployed({
  client,
  contractAddress
}) {
  const code = await _actions.getCode.call(void 0, client, {
    address: contractAddress
  });
  return Boolean(code) && code !== "0x";
}
async function isImplementationExpected({
  client,
  contractAddress,
  expectedImplementationAddress
}) {
  if (!await isContractDeployed({ client, contractAddress })) {
    return false;
  }
  const implementationAddress = await read5({
    client,
    contractAddress
  });
  return implementationAddress === expectedImplementationAddress;
}
var encodeProxyCreationCode = ({
  implementationAddress,
  initcode
}) => _viem.encodeDeployData.call(void 0, {
  abi: _delegationabis.ERC1967Proxy.abi,
  args: [implementationAddress, initcode],
  bytecode: _delegationabis.ERC1967Proxy.bytecode
});

// src/DelegationFramework/HybridDeleGator/methods/initialize.ts



var simulate = async ({
  client,
  hybridDeleGatorAddress,
  eoaOwner,
  p256Owners
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: hybridDeleGatorAddress,
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "initialize",
    args: [
      eoaOwner,
      p256Owners.map((p256Owner) => p256Owner.keyId),
      p256Owners.map((p256Owner) => p256Owner.x),
      p256Owners.map((p256Owner) => p256Owner.y)
    ]
  });
};
var encode2 = ({
  eoaOwner,
  p256Owners
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "initialize",
    args: [
      eoaOwner,
      p256Owners.map((p256Owner) => p256Owner.keyId),
      p256Owners.map((p256Owner) => p256Owner.x),
      p256Owners.map((p256Owner) => p256Owner.y)
    ]
  });
};

// src/DelegationFramework/HybridDeleGator/encode.ts
var encode_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, encode_exports, {
  addKey: () => encode3,
  initializeHybridDeleGator: () => encode2,
  reinitializeHybridDeleGator: () => encode4,
  removeKey: () => encode5,
  updateSigners: () => encode6
});

// src/DelegationFramework/HybridDeleGator/methods/addKey.ts



var simulate2 = async ({
  client,
  hybridDeleGatorAddress,
  p256Owner
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: hybridDeleGatorAddress,
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "addKey",
    args: [p256Owner.keyId, p256Owner.x, p256Owner.y]
  });
};
var encode3 = ({ p256Owner }) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "addKey",
    args: [p256Owner.keyId, p256Owner.x, p256Owner.y]
  });
};

// src/DelegationFramework/HybridDeleGator/methods/reinitialize.ts



var simulate3 = async ({
  client,
  hybridDeleGatorAddress,
  version,
  eoaOwner,
  p256Owners,
  removeExistingP256Owners
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: hybridDeleGatorAddress,
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "reinitialize",
    args: [
      version,
      eoaOwner,
      p256Owners.map((p256Owner) => p256Owner.keyId),
      p256Owners.map((p256Owner) => p256Owner.x),
      p256Owners.map((p256Owner) => p256Owner.y),
      removeExistingP256Owners
    ]
  });
};
var encode4 = ({
  version,
  eoaOwner,
  p256Owners,
  removeExistingP256Owners
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "reinitialize",
    args: [
      version,
      eoaOwner,
      p256Owners.map((p256Owner) => p256Owner.keyId),
      p256Owners.map((p256Owner) => p256Owner.x),
      p256Owners.map((p256Owner) => p256Owner.y),
      removeExistingP256Owners
    ]
  });
};

// src/DelegationFramework/HybridDeleGator/methods/removeKey.ts



var simulate4 = async ({
  client,
  hybridDeleGatorAddress,
  keyId
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: hybridDeleGatorAddress,
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "removeKey",
    args: [keyId]
  });
};
var encode5 = ({ keyId }) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "removeKey",
    args: [keyId]
  });
};

// src/DelegationFramework/HybridDeleGator/methods/updateSigners.ts



var simulate5 = async ({
  client,
  hybridDeleGatorAddress,
  eoaOwner,
  p256Owners
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: hybridDeleGatorAddress,
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "updateSigners",
    args: [
      eoaOwner,
      p256Owners.map((p256Owner) => p256Owner.keyId),
      p256Owners.map((p256Owner) => p256Owner.x),
      p256Owners.map((p256Owner) => p256Owner.y)
    ]
  });
};
var encode6 = ({
  eoaOwner,
  p256Owners
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.HybridDeleGator.abi,
    functionName: "updateSigners",
    args: [
      eoaOwner,
      p256Owners.map((p256Owner) => p256Owner.keyId),
      p256Owners.map((p256Owner) => p256Owner.x),
      p256Owners.map((p256Owner) => p256Owner.y)
    ]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/initialize.ts



var simulate6 = async ({
  client,
  multiSigDeleGatorAddress,
  owners,
  threshold
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: multiSigDeleGatorAddress,
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "initialize",
    args: [owners, threshold]
  });
};
var encode7 = ({ owners, threshold }) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "initialize",
    args: [owners, threshold]
  });
};

// src/DelegationFramework/MultiSigDeleGator/encode.ts
var encode_exports2 = {};
_chunkHJETDDBNcjs.__export.call(void 0, encode_exports2, {
  addSigner: () => encode8,
  initializeMultiSigDeleGator: () => encode7,
  reinitializeMultiSigDeleGator: () => encode9,
  removeSigner: () => encode10,
  replaceSigner: () => encode11,
  updateMultiSigParameters: () => encode12,
  updateThreshold: () => encode13
});

// src/DelegationFramework/MultiSigDeleGator/methods/addSigner.ts



var simulate7 = async ({
  client,
  multiSigDeleGatorAddress,
  signer
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: multiSigDeleGatorAddress,
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "addSigner",
    args: [signer]
  });
};
var encode8 = ({ signer }) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "addSigner",
    args: [signer]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/reinitialize.ts



var simulate8 = async ({
  client,
  multiSigDeleGatorAddress,
  version,
  owners,
  threshold,
  removeExistingOwners
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: multiSigDeleGatorAddress,
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "reinitialize",
    args: [version, owners, threshold, removeExistingOwners]
  });
};
var encode9 = ({
  version,
  owners,
  threshold,
  removeExistingOwners
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "reinitialize",
    args: [version, owners, threshold, removeExistingOwners]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/removeSigner.ts



var simulate9 = async ({
  client,
  multiSigDeleGatorAddress,
  signer
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: multiSigDeleGatorAddress,
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "removeSigner",
    args: [signer]
  });
};
var encode10 = ({ signer }) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "removeSigner",
    args: [signer]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/replaceSigner.ts



var simulate10 = async ({
  client,
  multiSigDeleGatorAddress,
  oldSigner,
  newSigner
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: multiSigDeleGatorAddress,
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "replaceSigner",
    args: [oldSigner, newSigner]
  });
};
var encode11 = ({
  oldSigner,
  newSigner
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "replaceSigner",
    args: [oldSigner, newSigner]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/updateMultiSigParameters.ts



var simulate11 = async ({
  client,
  multiSigDeleGatorAddress,
  owners,
  threshold,
  removeExistingOwners
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: multiSigDeleGatorAddress,
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "updateMultiSigParameters",
    args: [owners, threshold, removeExistingOwners]
  });
};
var encode12 = ({
  owners,
  threshold,
  removeExistingOwners
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "updateMultiSigParameters",
    args: [owners, threshold, removeExistingOwners]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/updateThreshold.ts



var simulate12 = async ({
  client,
  multiSigDeleGatorAddress,
  threshold
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: multiSigDeleGatorAddress,
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "updateThreshold",
    args: [threshold]
  });
};
var encode13 = ({ threshold }) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.MultiSigDeleGator.abi,
    functionName: "updateThreshold",
    args: [threshold]
  });
};

// src/DelegationFramework/SimpleFactory/methods/create2Deploy.ts



var simulate13 = async ({
  client,
  factoryAddress,
  creationCode,
  salt
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: factoryAddress,
    abi: _delegationabis.SimpleFactory.abi,
    functionName: "deploy",
    args: [creationCode, salt]
  });
};
var encode14 = (creationCode, salt) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.SimpleFactory.abi,
    functionName: "deploy",
    args: [creationCode, salt]
  });
};
var execute = async ({
  client,
  factoryAddress,
  creationCode,
  salt
}) => {
  const { request } = await simulate13({
    client,
    factoryAddress,
    creationCode,
    salt
  });
  return _actions.writeContract.call(void 0, client, request);
};

// src/DelegationFramework/SimpleFactory/encode.ts
var encode_exports3 = {};
_chunkHJETDDBNcjs.__export.call(void 0, encode_exports3, {
  create2Deploy: () => encode14
});

// src/DelegationFramework/DeleGatorCore/methods/execute.ts



var simulate14 = async ({
  client,
  contractAddress,
  execution
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "execute",
    args: [execution]
  });
};
var execute2 = async ({
  client,
  contractAddress,
  execution
}) => {
  const { request } = await simulate14({
    client,
    contractAddress,
    execution
  });
  return _actions.writeContract.call(void 0, client, request);
};
var encode15 = ({ execution }) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "execute",
    args: [execution]
  });
};

// src/DelegationFramework/DeleGatorCore/methods/executeWithMode.ts



var simulate15 = async ({
  client,
  contractAddress,
  mode,
  executions
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "execute",
    args: [mode, _chunkT6PSFUOZcjs.encodeExecutionCalldata.call(void 0, executions)]
  });
};
var execute3 = async ({
  client,
  contractAddress,
  mode,
  executions
}) => {
  const { request } = await simulate15({
    client,
    contractAddress,
    mode,
    executions
  });
  return _actions.writeContract.call(void 0, client, request);
};
var encode16 = ({
  mode,
  executions
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "execute",
    args: [mode, _chunkT6PSFUOZcjs.encodeExecutionCalldata.call(void 0, executions)]
  });
};

// src/DelegationFramework/DeleGatorCore/encode.ts
var encode_exports4 = {};
_chunkHJETDDBNcjs.__export.call(void 0, encode_exports4, {
  disableDelegation: () => encode17,
  enableDelegation: () => encode18,
  execute: () => encode15,
  executeWithMode: () => encode16,
  isValidSignature: () => encode,
  upgradeToAndCall: () => encode19
});

// src/DelegationFramework/DeleGatorCore/methods/disableDelegation.ts



var simulate16 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const abi = _delegationabis.DeleGatorCore.abi;
  const delegationStruct = _chunkHJETDDBNcjs.toDelegationStruct.call(void 0, delegation);
  return _actions.simulateContract.call(void 0, client, {
    address: delegationManagerAddress,
    abi,
    functionName: "disableDelegation",
    args: [delegationStruct]
  });
};
var execute4 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const { request } = await simulate16({
    client,
    delegationManagerAddress,
    delegation
  });
  return _actions.writeContract.call(void 0, client, request);
};
var encode17 = ({ delegation }) => {
  const delegationStruct = _chunkHJETDDBNcjs.toDelegationStruct.call(void 0, delegation);
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "disableDelegation",
    args: [delegationStruct]
  });
};

// src/DelegationFramework/DeleGatorCore/methods/enableDelegation.ts



var simulate17 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const abi = _delegationabis.DeleGatorCore.abi;
  const delegationStruct = _chunkHJETDDBNcjs.toDelegationStruct.call(void 0, delegation);
  return _actions.simulateContract.call(void 0, client, {
    address: delegationManagerAddress,
    abi,
    functionName: "enableDelegation",
    args: [delegationStruct]
  });
};
var execute5 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const { request } = await simulate17({
    client,
    delegationManagerAddress,
    delegation
  });
  return _actions.writeContract.call(void 0, client, request);
};
var encode18 = ({ delegation }) => {
  const delegationStruct = _chunkHJETDDBNcjs.toDelegationStruct.call(void 0, delegation);
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "enableDelegation",
    args: [delegationStruct]
  });
};

// src/DelegationFramework/DeleGatorCore/methods/upgradeToAndCall.ts



var simulate18 = async ({
  client,
  contractAddress,
  implementation,
  data
}) => {
  return _actions.simulateContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "upgradeToAndCall",
    args: [implementation, data]
  });
};
var execute6 = async ({
  client,
  contractAddress,
  implementation,
  data
}) => {
  const { request } = await simulate18({
    client,
    contractAddress,
    implementation,
    data
  });
  return _actions.writeContract.call(void 0, client, request);
};
var encode19 = ({
  implementation,
  data
}) => {
  return _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DeleGatorCore.abi,
    functionName: "upgradeToAndCall",
    args: [implementation, data]
  });
};







































exports.simulate = simulate2; exports.simulate2 = simulate; exports.encode = encode2; exports.simulate3 = simulate3; exports.simulate4 = simulate4; exports.simulate5 = simulate5; exports.encode_exports = encode_exports; exports.simulate6 = simulate7; exports.simulate7 = simulate6; exports.encode2 = encode7; exports.simulate8 = simulate8; exports.simulate9 = simulate9; exports.simulate10 = simulate10; exports.simulate11 = simulate11; exports.simulate12 = simulate12; exports.encode_exports2 = encode_exports2; exports.simulate13 = simulate13; exports.encode3 = encode14; exports.execute = execute; exports.encode_exports3 = encode_exports3; exports.read_exports = read_exports; exports.isContractDeployed = isContractDeployed; exports.isImplementationExpected = isImplementationExpected; exports.encodeProxyCreationCode = encodeProxyCreationCode; exports.simulate14 = simulate16; exports.execute2 = execute4; exports.simulate15 = simulate17; exports.execute3 = execute5; exports.simulate16 = simulate14; exports.execute4 = execute2; exports.encode4 = encode15; exports.simulate17 = simulate15; exports.execute5 = execute3; exports.encode5 = encode16; exports.simulate18 = simulate18; exports.execute6 = execute6; exports.encode_exports4 = encode_exports4;
//# sourceMappingURL=chunk-QHDMZSGQ.cjs.map