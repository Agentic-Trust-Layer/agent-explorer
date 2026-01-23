"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/returns.ts
var _utils = require('@metamask/utils');
var defaultOptions = { out: "hex" };
function prepareResult(result, options) {
  if (options.out === "hex") {
    const hexValue = typeof result === "string" ? result : _utils.bytesToHex.call(void 0, result);
    return hexValue.startsWith("0x") ? hexValue : `0x${hexValue}`;
  }
  const bytesValue = result instanceof Uint8Array ? result : _utils.hexToBytes.call(void 0, result);
  return bytesValue;
}
var bytesLikeToHex = (bytesLike) => {
  if (typeof bytesLike === "string") {
    return bytesLike;
  }
  return _utils.bytesToHex.call(void 0, bytesLike);
};
var bytesLikeToBytes = (bytesLike) => {
  if (typeof bytesLike === "string") {
    return _utils.hexToBytes.call(void 0, bytesLike);
  }
  return bytesLike;
};

// src/utils.ts
var toHexString = ({
  value,
  size
}) => {
  return value.toString(16).padStart(size * 2, "0");
};

// src/caveats/valueLte.ts
function createValueLteTerms(terms, options = defaultOptions) {
  const { maxValue } = terms;
  if (maxValue < 0n) {
    throw new Error("Invalid maxValue: must be greater than or equal to zero");
  }
  const hexValue = toHexString({ value: maxValue, size: 32 });
  return prepareResult(hexValue, options);
}

// src/caveats/timestamp.ts
var TIMESTAMP_UPPER_BOUND_SECONDS = 253402300799;
function createTimestampTerms(terms, encodingOptions = defaultOptions) {
  const { timestampAfterThreshold, timestampBeforeThreshold } = terms;
  if (timestampAfterThreshold < 0) {
    throw new Error(
      "Invalid timestampAfterThreshold: must be zero or positive"
    );
  }
  if (timestampBeforeThreshold < 0) {
    throw new Error(
      "Invalid timestampBeforeThreshold: must be zero or positive"
    );
  }
  if (timestampBeforeThreshold > TIMESTAMP_UPPER_BOUND_SECONDS) {
    throw new Error(
      `Invalid timestampBeforeThreshold: must be less than or equal to ${TIMESTAMP_UPPER_BOUND_SECONDS}`
    );
  }
  if (timestampAfterThreshold > TIMESTAMP_UPPER_BOUND_SECONDS) {
    throw new Error(
      `Invalid timestampAfterThreshold: must be less than or equal to ${TIMESTAMP_UPPER_BOUND_SECONDS}`
    );
  }
  if (timestampBeforeThreshold !== 0 && timestampAfterThreshold >= timestampBeforeThreshold) {
    throw new Error(
      "Invalid thresholds: timestampBeforeThreshold must be greater than timestampAfterThreshold when both are specified"
    );
  }
  const afterThresholdHex = toHexString({
    value: timestampAfterThreshold,
    size: 16
  });
  const beforeThresholdHex = toHexString({
    value: timestampBeforeThreshold,
    size: 16
  });
  const hexValue = `0x${afterThresholdHex}${beforeThresholdHex}`;
  return prepareResult(hexValue, encodingOptions);
}

// src/caveats/nativeTokenPeriodTransfer.ts
function createNativeTokenPeriodTransferTerms(terms, encodingOptions = defaultOptions) {
  const { periodAmount, periodDuration, startDate } = terms;
  if (periodAmount <= 0n) {
    throw new Error("Invalid periodAmount: must be a positive number");
  }
  if (periodDuration <= 0) {
    throw new Error("Invalid periodDuration: must be a positive number");
  }
  if (startDate <= 0) {
    throw new Error("Invalid startDate: must be a positive number");
  }
  const periodAmountHex = toHexString({ value: periodAmount, size: 32 });
  const periodDurationHex = toHexString({ value: periodDuration, size: 32 });
  const startDateHex = toHexString({ value: startDate, size: 32 });
  const hexValue = `0x${periodAmountHex}${periodDurationHex}${startDateHex}`;
  return prepareResult(hexValue, encodingOptions);
}

// src/caveats/exactCalldata.ts
function createExactCalldataTerms(terms, encodingOptions = defaultOptions) {
  const { calldata } = terms;
  if (typeof calldata === "string" && !calldata.startsWith("0x")) {
    throw new Error("Invalid calldata: must be a hex string starting with 0x");
  }
  return prepareResult(calldata, encodingOptions);
}

// src/caveats/nativeTokenStreaming.ts
var TIMESTAMP_UPPER_BOUND_SECONDS2 = 253402300799;
function createNativeTokenStreamingTerms(terms, encodingOptions = defaultOptions) {
  const { initialAmount, maxAmount, amountPerSecond, startTime } = terms;
  if (initialAmount < 0n) {
    throw new Error("Invalid initialAmount: must be greater than zero");
  }
  if (maxAmount <= 0n) {
    throw new Error("Invalid maxAmount: must be a positive number");
  }
  if (maxAmount < initialAmount) {
    throw new Error("Invalid maxAmount: must be greater than initialAmount");
  }
  if (amountPerSecond <= 0n) {
    throw new Error("Invalid amountPerSecond: must be a positive number");
  }
  if (startTime <= 0) {
    throw new Error("Invalid startTime: must be a positive number");
  }
  if (startTime > TIMESTAMP_UPPER_BOUND_SECONDS2) {
    throw new Error(
      "Invalid startTime: must be less than or equal to 253402300799"
    );
  }
  const initialAmountHex = toHexString({ value: initialAmount, size: 32 });
  const maxAmountHex = toHexString({ value: maxAmount, size: 32 });
  const amountPerSecondHex = toHexString({ value: amountPerSecond, size: 32 });
  const startTimeHex = toHexString({ value: startTime, size: 32 });
  const hexValue = `0x${initialAmountHex}${maxAmountHex}${amountPerSecondHex}${startTimeHex}`;
  return prepareResult(hexValue, encodingOptions);
}

// src/caveats/erc20Streaming.ts

var TIMESTAMP_UPPER_BOUND_SECONDS3 = 253402300799;
function createERC20StreamingTerms(terms, encodingOptions = defaultOptions) {
  const { tokenAddress, initialAmount, maxAmount, amountPerSecond, startTime } = terms;
  if (!tokenAddress) {
    throw new Error("Invalid tokenAddress: must be a valid address");
  }
  let prefixedTokenAddressHex;
  if (typeof tokenAddress === "string") {
    if (!_utils.isHexString.call(void 0, tokenAddress) || tokenAddress.length !== 42) {
      throw new Error("Invalid tokenAddress: must be a valid address");
    }
    prefixedTokenAddressHex = tokenAddress;
  } else {
    if (tokenAddress.length !== 20) {
      throw new Error("Invalid tokenAddress: must be a valid address");
    }
    prefixedTokenAddressHex = _utils.bytesToHex.call(void 0, tokenAddress);
  }
  if (initialAmount < 0n) {
    throw new Error("Invalid initialAmount: must be greater than zero");
  }
  if (maxAmount <= 0n) {
    throw new Error("Invalid maxAmount: must be a positive number");
  }
  if (maxAmount < initialAmount) {
    throw new Error("Invalid maxAmount: must be greater than initialAmount");
  }
  if (amountPerSecond <= 0n) {
    throw new Error("Invalid amountPerSecond: must be a positive number");
  }
  if (startTime <= 0) {
    throw new Error("Invalid startTime: must be a positive number");
  }
  if (startTime > TIMESTAMP_UPPER_BOUND_SECONDS3) {
    throw new Error(
      "Invalid startTime: must be less than or equal to 253402300799"
    );
  }
  const initialAmountHex = toHexString({ value: initialAmount, size: 32 });
  const maxAmountHex = toHexString({ value: maxAmount, size: 32 });
  const amountPerSecondHex = toHexString({ value: amountPerSecond, size: 32 });
  const startTimeHex = toHexString({ value: startTime, size: 32 });
  const hexValue = `${prefixedTokenAddressHex}${initialAmountHex}${maxAmountHex}${amountPerSecondHex}${startTimeHex}`;
  return prepareResult(hexValue, encodingOptions);
}

// src/caveats/erc20TokenPeriodTransfer.ts

function createERC20TokenPeriodTransferTerms(terms, encodingOptions = defaultOptions) {
  const { tokenAddress, periodAmount, periodDuration, startDate } = terms;
  if (!tokenAddress) {
    throw new Error("Invalid tokenAddress: must be a valid address");
  }
  let prefixedTokenAddressHex;
  if (typeof tokenAddress === "string") {
    if (!_utils.isHexString.call(void 0, tokenAddress) || tokenAddress.length !== 42) {
      throw new Error("Invalid tokenAddress: must be a valid address");
    }
    prefixedTokenAddressHex = tokenAddress;
  } else {
    if (tokenAddress.length !== 20) {
      throw new Error("Invalid tokenAddress: must be a valid address");
    }
    prefixedTokenAddressHex = _utils.bytesToHex.call(void 0, tokenAddress);
  }
  if (periodAmount <= 0n) {
    throw new Error("Invalid periodAmount: must be a positive number");
  }
  if (periodDuration <= 0) {
    throw new Error("Invalid periodDuration: must be a positive number");
  }
  if (startDate <= 0) {
    throw new Error("Invalid startDate: must be a positive number");
  }
  const periodAmountHex = toHexString({ value: periodAmount, size: 32 });
  const periodDurationHex = toHexString({ value: periodDuration, size: 32 });
  const startDateHex = toHexString({ value: startDate, size: 32 });
  const hexValue = `${prefixedTokenAddressHex}${periodAmountHex}${periodDurationHex}${startDateHex}`;
  return prepareResult(hexValue, encodingOptions);
}

// src/caveats/nonce.ts

var MAX_NONCE_STRING_LENGTH = 66;
function createNonceTerms(terms, encodingOptions = defaultOptions) {
  const { nonce } = terms;
  if (nonce instanceof Uint8Array && nonce.length === 0) {
    throw new Error("Invalid nonce: Uint8Array must not be empty");
  }
  if (typeof nonce === "string" && !nonce.startsWith("0x")) {
    throw new Error("Invalid nonce: string must have 0x prefix");
  }
  const hexNonce = bytesLikeToHex(nonce);
  if (hexNonce === "0x") {
    throw new Error("Invalid nonce: must not be empty");
  }
  if (!_utils.isHexString.call(void 0, hexNonce)) {
    throw new Error("Invalid nonce: must be a valid BytesLike value");
  }
  if (hexNonce.length > MAX_NONCE_STRING_LENGTH) {
    throw new Error("Invalid nonce: must be 32 bytes or less in length");
  }
  const nonceWithoutPrefix = hexNonce.slice(2);
  const paddedNonce = nonceWithoutPrefix.padStart(64, "0");
  const hexValue = `0x${paddedNonce}`;
  return prepareResult(hexValue, encodingOptions);
}

// src/caveats/allowedCalldata.ts

function createAllowedCalldataTerms(terms, encodingOptions = defaultOptions) {
  const { startIndex, value } = terms;
  if (startIndex < 0) {
    throw new Error("Invalid startIndex: must be zero or positive");
  }
  if (!Number.isInteger(startIndex)) {
    throw new Error("Invalid startIndex: must be a whole number");
  }
  let unprefixedValue;
  if (typeof value === "string") {
    if (!value.startsWith("0x")) {
      throw new Error("Invalid value: must be a hex string starting with 0x");
    }
    unprefixedValue = _utils.remove0x.call(void 0, value);
  } else {
    unprefixedValue = _utils.remove0x.call(void 0, _utils.bytesToHex.call(void 0, value));
  }
  const indexHex = toHexString({ value: startIndex, size: 32 });
  return prepareResult(`0x${indexHex}${unprefixedValue}`, encodingOptions);
}

// src/delegation.ts
var _abiutils = require('@metamask/abi-utils');

var _sha3 = require('@noble/hashes/sha3');
var ANY_BENEFICIARY = "0x0000000000000000000000000000000000000a11";
var ROOT_AUTHORITY = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
var DELEGATION_TYPEHASH = "0x88c1d2ecf185adf710588203a5f263f0ff61be0d33da39792cde19ba9aa4331e";
var CAVEAT_TYPEHASH = "0x80ad7e1b04ee6d994a125f4714ca0720908bd80ed16063ec8aee4b88e9253e2d";
var DELEGATION_ARRAY_ABI_TYPES = "(address,address,bytes32,(address,bytes,bytes)[],uint256,bytes)[]";
function encodeDelegations(delegations, options = defaultOptions) {
  let result;
  if (delegations.length === 0) {
    result = new Uint8Array(64);
    result[31] = 32;
  } else {
    const encodableStructs = delegations.map((struct) => [
      struct.delegate,
      struct.delegator,
      struct.authority,
      struct.caveats.map((caveat) => [
        caveat.enforcer,
        caveat.terms,
        caveat.args
      ]),
      struct.salt,
      struct.signature
    ]);
    result = _abiutils.encodeSingle.call(void 0, DELEGATION_ARRAY_ABI_TYPES, encodableStructs);
  }
  return prepareResult(result, options);
}
var delegationFromDecodedDelegation = (decodedDelegation, convertFn) => {
  const [delegate, delegator, authority, caveats, salt, signature] = decodedDelegation;
  return {
    delegate: convertFn(delegate),
    delegator: convertFn(delegator),
    authority: convertFn(authority),
    caveats: caveats.map(([enforcer, terms, args]) => ({
      enforcer: convertFn(enforcer),
      terms: convertFn(terms),
      args: convertFn(args)
    })),
    salt,
    signature: convertFn(signature)
  };
};
function decodeDelegations(encoded, options = defaultOptions) {
  const decodedStructs = _abiutils.decodeSingle.call(void 0, 
    DELEGATION_ARRAY_ABI_TYPES,
    encoded
    // return types cannot be inferred from complex ABI types, so we must assert the type
  );
  if (options.out === "bytes") {
    return decodedStructs.map(
      (struct) => delegationFromDecodedDelegation(struct, bytesLikeToBytes)
    );
  }
  return decodedStructs.map(
    (struct) => delegationFromDecodedDelegation(struct, bytesLikeToHex)
  );
}
function hashDelegation(delegation, options = defaultOptions) {
  const encoded = _abiutils.encode.call(void 0, 
    ["bytes32", "address", "address", "bytes32", "bytes32", "uint256"],
    [
      DELEGATION_TYPEHASH,
      delegation.delegate,
      delegation.delegator,
      delegation.authority,
      getCaveatsArrayHash(delegation.caveats),
      delegation.salt
    ]
  );
  const hash = _sha3.keccak_256.call(void 0, encoded);
  return prepareResult(hash, options);
}
function getCaveatsArrayHash(caveats) {
  const byteLength = 32 * caveats.length;
  const encoded = new Uint8Array(byteLength);
  for (let i = 0; i < caveats.length; i++) {
    const caveat = caveats[i];
    if (!caveat) {
      throw new Error(`Caveat was undefined at index ${i}`);
    }
    const caveatHash = getCaveatHash(caveat);
    encoded.set(caveatHash, i * 32);
  }
  return _sha3.keccak_256.call(void 0, encoded);
}
function getCaveatHash(caveat) {
  const termsBytes = typeof caveat.terms === "string" ? _utils.hexToBytes.call(void 0, caveat.terms) : caveat.terms;
  const termsHash = _sha3.keccak_256.call(void 0, termsBytes);
  const encoded = _abiutils.encode.call(void 0, 
    ["bytes32", "address", "bytes32"],
    [CAVEAT_TYPEHASH, caveat.enforcer, termsHash]
  );
  const hash = _sha3.keccak_256.call(void 0, encoded);
  return hash;
}

















exports.ANY_BENEFICIARY = ANY_BENEFICIARY; exports.CAVEAT_TYPEHASH = CAVEAT_TYPEHASH; exports.DELEGATION_TYPEHASH = DELEGATION_TYPEHASH; exports.ROOT_AUTHORITY = ROOT_AUTHORITY; exports.createAllowedCalldataTerms = createAllowedCalldataTerms; exports.createERC20StreamingTerms = createERC20StreamingTerms; exports.createERC20TokenPeriodTransferTerms = createERC20TokenPeriodTransferTerms; exports.createExactCalldataTerms = createExactCalldataTerms; exports.createNativeTokenPeriodTransferTerms = createNativeTokenPeriodTransferTerms; exports.createNativeTokenStreamingTerms = createNativeTokenStreamingTerms; exports.createNonceTerms = createNonceTerms; exports.createTimestampTerms = createTimestampTerms; exports.createValueLteTerms = createValueLteTerms; exports.decodeDelegations = decodeDelegations; exports.encodeDelegations = encodeDelegations; exports.hashDelegation = hashDelegation;
//# sourceMappingURL=index.cjs.map