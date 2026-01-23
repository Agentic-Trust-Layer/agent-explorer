"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/userOp.ts
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





exports.SIGNABLE_USER_OP_TYPED_DATA = SIGNABLE_USER_OP_TYPED_DATA; exports.prepareSignUserOperationTypedData = prepareSignUserOperationTypedData; exports.signUserOperation = signUserOperation;
//# sourceMappingURL=chunk-2YEKEDAF.cjs.map