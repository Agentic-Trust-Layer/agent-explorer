import {
  encodeExecutionCalldata
} from "./chunk-CPLIK3VF.mjs";
import {
  __export,
  toDelegationStruct
} from "./chunk-BJGZGTRU.mjs";

// src/DelegationFramework/utils.ts
import { ERC1967Proxy } from "@metamask/delegation-abis";
import { encodeDeployData } from "viem";
import { getCode } from "viem/actions";

// src/DelegationFramework/DeleGatorCore/read.ts
var read_exports = {};
__export(read_exports, {
  getDelegationManager: () => read,
  getDeposit: () => read2,
  getEntryPoint: () => read3,
  getNonce: () => read4,
  getProxyImplementation: () => read5,
  getProxyVersion: () => read6,
  isValidSignature: () => read7
});

// src/DelegationFramework/DeleGatorCore/methods/getDelegationManager.ts
import { DeleGatorCore } from "@metamask/delegation-abis";
import { readContract } from "viem/actions";
var read = async ({
  client,
  contractAddress
}) => await readContract(client, {
  address: contractAddress,
  abi: DeleGatorCore.abi,
  functionName: "delegationManager"
});

// src/DelegationFramework/DeleGatorCore/methods/getDeposit.ts
import { DeleGatorCore as DeleGatorCore2 } from "@metamask/delegation-abis";
import { readContract as readContract2 } from "viem/actions";
var read2 = async ({
  client,
  contractAddress
}) => await readContract2(client, {
  address: contractAddress,
  abi: DeleGatorCore2.abi,
  functionName: "getDeposit"
});

// src/DelegationFramework/DeleGatorCore/methods/getEntryPoint.ts
import { DeleGatorCore as DeleGatorCore3 } from "@metamask/delegation-abis";
import { readContract as readContract3 } from "viem/actions";
var read3 = async ({
  client,
  contractAddress
}) => await readContract3(client, {
  address: contractAddress,
  abi: DeleGatorCore3.abi,
  functionName: "entryPoint"
});

// src/DelegationFramework/DeleGatorCore/methods/getNonce.ts
import { DeleGatorCore as DeleGatorCore4 } from "@metamask/delegation-abis";
import { readContract as readContract4 } from "viem/actions";
var read4 = async ({
  client,
  contractAddress,
  key
}) => await readContract4(client, {
  address: contractAddress,
  abi: DeleGatorCore4.abi,
  functionName: "getNonce",
  args: key ? [key] : void 0
});

// src/DelegationFramework/DeleGatorCore/methods/getProxyImplementation.ts
import { DeleGatorCore as DeleGatorCore5 } from "@metamask/delegation-abis";
import { readContract as readContract5 } from "viem/actions";
var read5 = async ({
  client,
  contractAddress
}) => await readContract5(client, {
  address: contractAddress,
  abi: DeleGatorCore5.abi,
  functionName: "getImplementation"
});

// src/DelegationFramework/DeleGatorCore/methods/getProxyVersion.ts
import { DeleGatorCore as DeleGatorCore6 } from "@metamask/delegation-abis";
import { readContract as readContract6 } from "viem/actions";
var read6 = async ({
  client,
  contractAddress
}) => await readContract6(client, {
  address: contractAddress,
  abi: DeleGatorCore6.abi,
  functionName: "getInitializedVersion"
});

// src/DelegationFramework/DeleGatorCore/methods/isValidSignature.ts
import { DeleGatorCore as DeleGatorCore7 } from "@metamask/delegation-abis";
import { encodeFunctionData } from "viem";
import { readContract as readContract7 } from "viem/actions";
var read7 = async ({
  client,
  contractAddress,
  hash,
  signature
}) => await readContract7(client, {
  address: contractAddress,
  abi: DeleGatorCore7.abi,
  functionName: "isValidSignature",
  args: [hash, signature]
});
var encode = ({
  hash,
  signature
}) => {
  return encodeFunctionData({
    abi: DeleGatorCore7.abi,
    functionName: "isValidSignature",
    args: [hash, signature]
  });
};

// src/DelegationFramework/utils.ts
async function isContractDeployed({
  client,
  contractAddress
}) {
  const code = await getCode(client, {
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
}) => encodeDeployData({
  abi: ERC1967Proxy.abi,
  args: [implementationAddress, initcode],
  bytecode: ERC1967Proxy.bytecode
});

// src/DelegationFramework/HybridDeleGator/methods/initialize.ts
import { HybridDeleGator } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData2 } from "viem";
import { simulateContract, writeContract } from "viem/actions";
var simulate = async ({
  client,
  hybridDeleGatorAddress,
  eoaOwner,
  p256Owners
}) => {
  return simulateContract(client, {
    address: hybridDeleGatorAddress,
    abi: HybridDeleGator.abi,
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
  return encodeFunctionData2({
    abi: HybridDeleGator.abi,
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
__export(encode_exports, {
  addKey: () => encode3,
  initializeHybridDeleGator: () => encode2,
  reinitializeHybridDeleGator: () => encode4,
  removeKey: () => encode5,
  updateSigners: () => encode6
});

// src/DelegationFramework/HybridDeleGator/methods/addKey.ts
import { HybridDeleGator as HybridDeleGator2 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData3 } from "viem";
import { simulateContract as simulateContract2, writeContract as writeContract2 } from "viem/actions";
var simulate2 = async ({
  client,
  hybridDeleGatorAddress,
  p256Owner
}) => {
  return simulateContract2(client, {
    address: hybridDeleGatorAddress,
    abi: HybridDeleGator2.abi,
    functionName: "addKey",
    args: [p256Owner.keyId, p256Owner.x, p256Owner.y]
  });
};
var encode3 = ({ p256Owner }) => {
  return encodeFunctionData3({
    abi: HybridDeleGator2.abi,
    functionName: "addKey",
    args: [p256Owner.keyId, p256Owner.x, p256Owner.y]
  });
};

// src/DelegationFramework/HybridDeleGator/methods/reinitialize.ts
import { HybridDeleGator as HybridDeleGator3 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData4 } from "viem";
import { simulateContract as simulateContract3, writeContract as writeContract3 } from "viem/actions";
var simulate3 = async ({
  client,
  hybridDeleGatorAddress,
  version,
  eoaOwner,
  p256Owners,
  removeExistingP256Owners
}) => {
  return simulateContract3(client, {
    address: hybridDeleGatorAddress,
    abi: HybridDeleGator3.abi,
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
  return encodeFunctionData4({
    abi: HybridDeleGator3.abi,
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
import { HybridDeleGator as HybridDeleGator4 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData5 } from "viem";
import { simulateContract as simulateContract4, writeContract as writeContract4 } from "viem/actions";
var simulate4 = async ({
  client,
  hybridDeleGatorAddress,
  keyId
}) => {
  return simulateContract4(client, {
    address: hybridDeleGatorAddress,
    abi: HybridDeleGator4.abi,
    functionName: "removeKey",
    args: [keyId]
  });
};
var encode5 = ({ keyId }) => {
  return encodeFunctionData5({
    abi: HybridDeleGator4.abi,
    functionName: "removeKey",
    args: [keyId]
  });
};

// src/DelegationFramework/HybridDeleGator/methods/updateSigners.ts
import { HybridDeleGator as HybridDeleGator5 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData6 } from "viem";
import { simulateContract as simulateContract5, writeContract as writeContract5 } from "viem/actions";
var simulate5 = async ({
  client,
  hybridDeleGatorAddress,
  eoaOwner,
  p256Owners
}) => {
  return simulateContract5(client, {
    address: hybridDeleGatorAddress,
    abi: HybridDeleGator5.abi,
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
  return encodeFunctionData6({
    abi: HybridDeleGator5.abi,
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
import { MultiSigDeleGator } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData7 } from "viem";
import { simulateContract as simulateContract6, writeContract as writeContract6 } from "viem/actions";
var simulate6 = async ({
  client,
  multiSigDeleGatorAddress,
  owners,
  threshold
}) => {
  return simulateContract6(client, {
    address: multiSigDeleGatorAddress,
    abi: MultiSigDeleGator.abi,
    functionName: "initialize",
    args: [owners, threshold]
  });
};
var encode7 = ({ owners, threshold }) => {
  return encodeFunctionData7({
    abi: MultiSigDeleGator.abi,
    functionName: "initialize",
    args: [owners, threshold]
  });
};

// src/DelegationFramework/MultiSigDeleGator/encode.ts
var encode_exports2 = {};
__export(encode_exports2, {
  addSigner: () => encode8,
  initializeMultiSigDeleGator: () => encode7,
  reinitializeMultiSigDeleGator: () => encode9,
  removeSigner: () => encode10,
  replaceSigner: () => encode11,
  updateMultiSigParameters: () => encode12,
  updateThreshold: () => encode13
});

// src/DelegationFramework/MultiSigDeleGator/methods/addSigner.ts
import { MultiSigDeleGator as MultiSigDeleGator2 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData8 } from "viem";
import { simulateContract as simulateContract7, writeContract as writeContract7 } from "viem/actions";
var simulate7 = async ({
  client,
  multiSigDeleGatorAddress,
  signer
}) => {
  return simulateContract7(client, {
    address: multiSigDeleGatorAddress,
    abi: MultiSigDeleGator2.abi,
    functionName: "addSigner",
    args: [signer]
  });
};
var encode8 = ({ signer }) => {
  return encodeFunctionData8({
    abi: MultiSigDeleGator2.abi,
    functionName: "addSigner",
    args: [signer]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/reinitialize.ts
import { MultiSigDeleGator as MultiSigDeleGator3 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData9 } from "viem";
import { simulateContract as simulateContract8, writeContract as writeContract8 } from "viem/actions";
var simulate8 = async ({
  client,
  multiSigDeleGatorAddress,
  version,
  owners,
  threshold,
  removeExistingOwners
}) => {
  return simulateContract8(client, {
    address: multiSigDeleGatorAddress,
    abi: MultiSigDeleGator3.abi,
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
  return encodeFunctionData9({
    abi: MultiSigDeleGator3.abi,
    functionName: "reinitialize",
    args: [version, owners, threshold, removeExistingOwners]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/removeSigner.ts
import { MultiSigDeleGator as MultiSigDeleGator4 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData10 } from "viem";
import { simulateContract as simulateContract9, writeContract as writeContract9 } from "viem/actions";
var simulate9 = async ({
  client,
  multiSigDeleGatorAddress,
  signer
}) => {
  return simulateContract9(client, {
    address: multiSigDeleGatorAddress,
    abi: MultiSigDeleGator4.abi,
    functionName: "removeSigner",
    args: [signer]
  });
};
var encode10 = ({ signer }) => {
  return encodeFunctionData10({
    abi: MultiSigDeleGator4.abi,
    functionName: "removeSigner",
    args: [signer]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/replaceSigner.ts
import { MultiSigDeleGator as MultiSigDeleGator5 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData11 } from "viem";
import { simulateContract as simulateContract10, writeContract as writeContract10 } from "viem/actions";
var simulate10 = async ({
  client,
  multiSigDeleGatorAddress,
  oldSigner,
  newSigner
}) => {
  return simulateContract10(client, {
    address: multiSigDeleGatorAddress,
    abi: MultiSigDeleGator5.abi,
    functionName: "replaceSigner",
    args: [oldSigner, newSigner]
  });
};
var encode11 = ({
  oldSigner,
  newSigner
}) => {
  return encodeFunctionData11({
    abi: MultiSigDeleGator5.abi,
    functionName: "replaceSigner",
    args: [oldSigner, newSigner]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/updateMultiSigParameters.ts
import { MultiSigDeleGator as MultiSigDeleGator6 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData12 } from "viem";
import { simulateContract as simulateContract11, writeContract as writeContract11 } from "viem/actions";
var simulate11 = async ({
  client,
  multiSigDeleGatorAddress,
  owners,
  threshold,
  removeExistingOwners
}) => {
  return simulateContract11(client, {
    address: multiSigDeleGatorAddress,
    abi: MultiSigDeleGator6.abi,
    functionName: "updateMultiSigParameters",
    args: [owners, threshold, removeExistingOwners]
  });
};
var encode12 = ({
  owners,
  threshold,
  removeExistingOwners
}) => {
  return encodeFunctionData12({
    abi: MultiSigDeleGator6.abi,
    functionName: "updateMultiSigParameters",
    args: [owners, threshold, removeExistingOwners]
  });
};

// src/DelegationFramework/MultiSigDeleGator/methods/updateThreshold.ts
import { MultiSigDeleGator as MultiSigDeleGator7 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData13 } from "viem";
import { simulateContract as simulateContract12, writeContract as writeContract12 } from "viem/actions";
var simulate12 = async ({
  client,
  multiSigDeleGatorAddress,
  threshold
}) => {
  return simulateContract12(client, {
    address: multiSigDeleGatorAddress,
    abi: MultiSigDeleGator7.abi,
    functionName: "updateThreshold",
    args: [threshold]
  });
};
var encode13 = ({ threshold }) => {
  return encodeFunctionData13({
    abi: MultiSigDeleGator7.abi,
    functionName: "updateThreshold",
    args: [threshold]
  });
};

// src/DelegationFramework/SimpleFactory/methods/create2Deploy.ts
import { SimpleFactory } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData14 } from "viem";
import { simulateContract as simulateContract13, writeContract as writeContract13 } from "viem/actions";
var simulate13 = async ({
  client,
  factoryAddress,
  creationCode,
  salt
}) => {
  return simulateContract13(client, {
    address: factoryAddress,
    abi: SimpleFactory.abi,
    functionName: "deploy",
    args: [creationCode, salt]
  });
};
var encode14 = (creationCode, salt) => {
  return encodeFunctionData14({
    abi: SimpleFactory.abi,
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
  return writeContract13(client, request);
};

// src/DelegationFramework/SimpleFactory/encode.ts
var encode_exports3 = {};
__export(encode_exports3, {
  create2Deploy: () => encode14
});

// src/DelegationFramework/DeleGatorCore/methods/execute.ts
import { DeleGatorCore as DeleGatorCore8 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData15 } from "viem";
import { simulateContract as simulateContract14, writeContract as writeContract14 } from "viem/actions";
var simulate14 = async ({
  client,
  contractAddress,
  execution
}) => {
  return simulateContract14(client, {
    address: contractAddress,
    abi: DeleGatorCore8.abi,
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
  return writeContract14(client, request);
};
var encode15 = ({ execution }) => {
  return encodeFunctionData15({
    abi: DeleGatorCore8.abi,
    functionName: "execute",
    args: [execution]
  });
};

// src/DelegationFramework/DeleGatorCore/methods/executeWithMode.ts
import { DeleGatorCore as DeleGatorCore9 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData16 } from "viem";
import { simulateContract as simulateContract15, writeContract as writeContract15 } from "viem/actions";
var simulate15 = async ({
  client,
  contractAddress,
  mode,
  executions
}) => {
  return simulateContract15(client, {
    address: contractAddress,
    abi: DeleGatorCore9.abi,
    functionName: "execute",
    args: [mode, encodeExecutionCalldata(executions)]
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
  return writeContract15(client, request);
};
var encode16 = ({
  mode,
  executions
}) => {
  return encodeFunctionData16({
    abi: DeleGatorCore9.abi,
    functionName: "execute",
    args: [mode, encodeExecutionCalldata(executions)]
  });
};

// src/DelegationFramework/DeleGatorCore/encode.ts
var encode_exports4 = {};
__export(encode_exports4, {
  disableDelegation: () => encode17,
  enableDelegation: () => encode18,
  execute: () => encode15,
  executeWithMode: () => encode16,
  isValidSignature: () => encode,
  upgradeToAndCall: () => encode19
});

// src/DelegationFramework/DeleGatorCore/methods/disableDelegation.ts
import { DeleGatorCore as DeleGatorCore10 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData17 } from "viem";
import { simulateContract as simulateContract16, writeContract as writeContract16 } from "viem/actions";
var simulate16 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const abi = DeleGatorCore10.abi;
  const delegationStruct = toDelegationStruct(delegation);
  return simulateContract16(client, {
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
  return writeContract16(client, request);
};
var encode17 = ({ delegation }) => {
  const delegationStruct = toDelegationStruct(delegation);
  return encodeFunctionData17({
    abi: DeleGatorCore10.abi,
    functionName: "disableDelegation",
    args: [delegationStruct]
  });
};

// src/DelegationFramework/DeleGatorCore/methods/enableDelegation.ts
import { DeleGatorCore as DeleGatorCore11 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData18 } from "viem";
import { simulateContract as simulateContract17, writeContract as writeContract17 } from "viem/actions";
var simulate17 = async ({
  client,
  delegationManagerAddress,
  delegation
}) => {
  const abi = DeleGatorCore11.abi;
  const delegationStruct = toDelegationStruct(delegation);
  return simulateContract17(client, {
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
  return writeContract17(client, request);
};
var encode18 = ({ delegation }) => {
  const delegationStruct = toDelegationStruct(delegation);
  return encodeFunctionData18({
    abi: DeleGatorCore11.abi,
    functionName: "enableDelegation",
    args: [delegationStruct]
  });
};

// src/DelegationFramework/DeleGatorCore/methods/upgradeToAndCall.ts
import { DeleGatorCore as DeleGatorCore12 } from "@metamask/delegation-abis";
import { encodeFunctionData as encodeFunctionData19 } from "viem";
import { simulateContract as simulateContract18, writeContract as writeContract18 } from "viem/actions";
var simulate18 = async ({
  client,
  contractAddress,
  implementation,
  data
}) => {
  return simulateContract18(client, {
    address: contractAddress,
    abi: DeleGatorCore12.abi,
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
  return writeContract18(client, request);
};
var encode19 = ({
  implementation,
  data
}) => {
  return encodeFunctionData19({
    abi: DeleGatorCore12.abi,
    functionName: "upgradeToAndCall",
    args: [implementation, data]
  });
};

export {
  simulate2 as simulate,
  simulate as simulate2,
  encode2 as encode,
  simulate3,
  simulate4,
  simulate5,
  encode_exports,
  simulate7 as simulate6,
  simulate6 as simulate7,
  encode7 as encode2,
  simulate8,
  simulate9,
  simulate10,
  simulate11,
  simulate12,
  encode_exports2,
  simulate13,
  encode14 as encode3,
  execute,
  encode_exports3,
  read_exports,
  isContractDeployed,
  isImplementationExpected,
  encodeProxyCreationCode,
  simulate16 as simulate14,
  execute4 as execute2,
  simulate17 as simulate15,
  execute5 as execute3,
  simulate14 as simulate16,
  execute2 as execute4,
  encode15 as encode4,
  simulate15 as simulate17,
  execute3 as execute5,
  encode16 as encode5,
  simulate18,
  execute6,
  encode_exports4
};
//# sourceMappingURL=chunk-72UQFUL5.mjs.map