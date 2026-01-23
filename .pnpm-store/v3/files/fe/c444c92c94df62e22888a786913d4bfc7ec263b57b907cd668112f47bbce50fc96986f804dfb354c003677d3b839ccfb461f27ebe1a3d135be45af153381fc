"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }






var _chunkQHDMZSGQcjs = require('./chunk-QHDMZSGQ.cjs');



var _chunkT6PSFUOZcjs = require('./chunk-T6PSFUOZ.cjs');

// src/constants.ts
var Implementation = /* @__PURE__ */ ((Implementation2) => {
  Implementation2["MultiSig"] = "MultiSig";
  Implementation2["Hybrid"] = "Hybrid";
  Implementation2["Stateless7702"] = "Stateless7702";
  return Implementation2;
})(Implementation || {});
var TransferWindow = /* @__PURE__ */ ((TransferWindow2) => {
  TransferWindow2[TransferWindow2["Hourly"] = 3600] = "Hourly";
  TransferWindow2[TransferWindow2["Daily"] = 86400] = "Daily";
  TransferWindow2[TransferWindow2["Weekly"] = 604800] = "Weekly";
  TransferWindow2[TransferWindow2["BiWeekly"] = 1209600] = "BiWeekly";
  TransferWindow2[TransferWindow2["Monthly"] = 2592e3] = "Monthly";
  TransferWindow2[TransferWindow2["Quarterly"] = 7776e3] = "Quarterly";
  TransferWindow2[TransferWindow2["Yearly"] = 31536e3] = "Yearly";
  return TransferWindow2;
})(TransferWindow || {});

// src/counterfactualAccountData.ts
var _viem = require('viem');
var getCounterfactualAccountData = async ({
  factory,
  implementations,
  implementation,
  deployParams,
  deploySalt
}) => {
  let implementationAddress;
  let initcode;
  switch (implementation) {
    case "Hybrid" /* Hybrid */: {
      const [owner, keyIds, xValues, yValues] = deployParams;
      if (!implementations.HybridDeleGatorImpl) {
        throw new Error(
          "HybridDeleGatorImpl address not provided in environment"
        );
      }
      implementationAddress = implementations.HybridDeleGatorImpl;
      const p256Owners = keyIds.map((keyId, index) => {
        const xValue = xValues[index];
        const yValue = yValues[index];
        if (!xValue || !yValue) {
          throw new Error(
            `Missing X or Y value for keyId ${keyId} at index ${index}`
          );
        }
        return {
          keyId,
          x: xValue,
          y: yValue
        };
      });
      initcode = _chunkQHDMZSGQcjs.encode.call(void 0, { eoaOwner: owner, p256Owners });
      break;
    }
    case "MultiSig" /* MultiSig */: {
      const [owners, threshold] = deployParams;
      if (!implementations.MultiSigDeleGatorImpl) {
        throw new Error(
          "MultiSigDeleGatorImpl address not provided in environment"
        );
      }
      implementationAddress = implementations.MultiSigDeleGatorImpl;
      initcode = _chunkQHDMZSGQcjs.encode2.call(void 0, { owners, threshold });
      break;
    }
    default:
      throw new Error(`Implementation type '${implementation}' not supported`);
  }
  const salt = _viem.pad.call(void 0, deploySalt, { dir: "left", size: 32 });
  const proxyCreationCode = _chunkQHDMZSGQcjs.encodeProxyCreationCode.call(void 0, {
    implementationAddress,
    initcode
  });
  const address = _viem.getContractAddress.call(void 0, {
    bytecode: proxyCreationCode,
    from: factory,
    opcode: "CREATE2",
    salt
  });
  const factoryData = _chunkQHDMZSGQcjs.encode3.call(void 0, proxyCreationCode, salt);
  return {
    factoryData,
    address
  };
};

// src/encodeCalls.ts
var _delegationabis = require('@metamask/delegation-abis');

var isDelegatedCall = (call) => {
  return "permissionsContext" in call && "delegationManager" in call;
};
var processDelegatedCall = (call) => {
  const {
    permissionsContext,
    delegationManager,
    to: target,
    value,
    data: callData
  } = call;
  const callAsExecution = _chunkT6PSFUOZcjs.createExecution.call(void 0, { target, value, callData });
  if (!permissionsContext) {
    return callAsExecution;
  }
  const redeemCalldata = _viem.encodeFunctionData.call(void 0, {
    abi: _delegationabis.DelegationManager.abi,
    functionName: "redeemDelegations",
    args: [
      [permissionsContext],
      ["0x0000000000000000000000000000000000000000000000000000000000000000" /* SingleDefault */],
      _chunkT6PSFUOZcjs.encodeExecutionCalldatas.call(void 0, [[callAsExecution]])
    ]
  });
  return _chunkT6PSFUOZcjs.createExecution.call(void 0, {
    target: delegationManager,
    callData: redeemCalldata
  });
};
var encodeCalls = (calls) => {
  if (calls.length === 1) {
    const call = calls[0];
    if (call && !isDelegatedCall(call)) {
      const { to: target, value, data: callData } = call;
      const execution = _chunkT6PSFUOZcjs.createExecution.call(void 0, { target, value, callData });
      return _chunkQHDMZSGQcjs.encode4.call(void 0, { execution });
    }
  }
  const executions = calls.map((call) => {
    if (isDelegatedCall(call)) {
      return processDelegatedCall(call);
    }
    const { to: target, value, data: callData } = call;
    return _chunkT6PSFUOZcjs.createExecution.call(void 0, { target, value, callData });
  });
  const mode = calls.length === 1 ? "0x0000000000000000000000000000000000000000000000000000000000000000" /* SingleDefault */ : "0x0100000000000000000000000000000000000000000000000000000000000000" /* BatchDefault */;
  return _chunkQHDMZSGQcjs.encode5.call(void 0, { mode, executions });
};
var encodeCallsForCaller = async (caller, calls) => {
  if (calls.length === 1) {
    const call = calls[0];
    if (call && call.to === caller && !isDelegatedCall(call)) {
      return _nullishCoalesce(call.data, () => ( "0x"));
    }
  }
  return encodeCalls(calls);
};

// src/webAuthn.ts








var _webauthnp256 = require('webauthn-p256');
var FIELD_MODULUS = 115792089210356248762697446949407573529996955224135760342422259061068512044369n;
var MALLEABILITY_THRESHOLD = FIELD_MODULUS / 2n;
var SIGNATURE_ABI_PARAMS = _viem.parseAbiParameters.call(void 0, 
  "bytes32, uint256, uint256, bytes, bool, string, string, uint256"
);
var splitOnChallenge = (clientDataJson) => {
  try {
    const { challenge } = JSON.parse(clientDataJson);
    if (challenge === void 0) {
      throw new Error('No "challenge" found in the input string');
    }
    return clientDataJson.split(challenge);
  } catch (error) {
    throw new Error('No "challenge" found in the input string', {
      cause: error
    });
  }
};
var getResponseTypeLocation = (clientDataJson) => {
  try {
    const typeIndex = clientDataJson.indexOf('"type":');
    if (typeIndex === -1) {
      throw new Error('No "type" found in the input string');
    }
    return BigInt(typeIndex);
  } catch (error) {
    throw new Error('No "type" found in the input string', {
      cause: error
    });
  }
};
function encodeDeleGatorSignature(keyId, signature, clientDataJSON, authenticatorData) {
  const keyIdHash = _viem.keccak256.call(void 0, _viem.encodePacked.call(void 0, ["string"], [keyId]));
  const parsedSignature = _webauthnp256.parseSignature.call(void 0, signature);
  let { s } = parsedSignature;
  while (s > MALLEABILITY_THRESHOLD) {
    s = FIELD_MODULUS - s;
  }
  const { r } = parsedSignature;
  const [clientDataComponent1, clientDataComponent2] = splitOnChallenge(clientDataJSON);
  const { userVerified } = parseAuthenticatorFlags(authenticatorData);
  const responseTypeLocation = getResponseTypeLocation(clientDataJSON);
  const encodedSignature = _viem.encodeAbiParameters.call(void 0, SIGNATURE_ABI_PARAMS, [
    keyIdHash,
    r,
    s,
    authenticatorData,
    userVerified,
    clientDataComponent1,
    clientDataComponent2,
    responseTypeLocation
  ]);
  return encodedSignature;
}
var AUTHENTICATOR_DATA_FLAGS_OFFSET = 32;
function parseAuthenticatorFlags(authenticatorData) {
  const authenticatorDataBuffer = _viem.hexToBytes.call(void 0, authenticatorData);
  const dataBufferUint8 = new Uint8Array(authenticatorDataBuffer);
  const flags = dataBufferUint8[AUTHENTICATOR_DATA_FLAGS_OFFSET];
  if (flags === void 0) {
    throw new Error("Authenticator flags not found in authenticator data");
  }
  const bitMask = 1 << 2 /* UserVerified */;
  return {
    // eslint-disable-next-line no-bitwise
    userVerified: (flags & bitMask) !== 0
  };
}
var createDummyWebAuthnSignature = (keyId) => {
  const rpIdHash = _viem.keccak256.call(void 0, _viem.encodePacked.call(void 0, ["string"], ["AuthenticatorData"]));
  const flags = "0x05";
  const signCount = "0x00000000";
  const authenticatorData = _viem.concat.call(void 0, [rpIdHash, flags, signCount]);
  const keyIdHash = _viem.keccak256.call(void 0, _viem.encodePacked.call(void 0, ["string"], [keyId]));
  const rs = 57896044605178124381348723474703786764998477612067880171211129530534256022184n;
  const userVerification = true;
  const clientDataPrefix = '{"type":"webauthn.get","challenge":"';
  const clientDataSuffix = '","origin":"passkey-domain","crossOrigin":false}';
  const responseTypeLocation = 1n;
  const encodedSignature = _viem.encodeAbiParameters.call(void 0, SIGNATURE_ABI_PARAMS, [
    keyIdHash,
    rs,
    rs,
    authenticatorData,
    userVerification,
    clientDataPrefix,
    clientDataSuffix,
    responseTypeLocation
  ]);
  return encodedSignature;
};










exports.Implementation = Implementation; exports.TransferWindow = TransferWindow; exports.getCounterfactualAccountData = getCounterfactualAccountData; exports.encodeCalls = encodeCalls; exports.encodeCallsForCaller = encodeCallsForCaller; exports.SIGNATURE_ABI_PARAMS = SIGNATURE_ABI_PARAMS; exports.encodeDeleGatorSignature = encodeDeleGatorSignature; exports.createDummyWebAuthnSignature = createDummyWebAuthnSignature;
//# sourceMappingURL=chunk-5ZBCTLQS.cjs.map