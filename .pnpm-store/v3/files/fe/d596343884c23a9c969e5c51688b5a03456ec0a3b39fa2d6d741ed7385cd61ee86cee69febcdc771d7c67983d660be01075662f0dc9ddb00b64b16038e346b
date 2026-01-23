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
  SIGNABLE_USER_OP_TYPED_DATA,
  prepareSignUserOperationTypedData,
  signUserOperation
};
//# sourceMappingURL=chunk-IVSH2AQS.mjs.map