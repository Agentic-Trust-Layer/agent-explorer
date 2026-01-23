var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/caveatBuilder/caveatBuilder.ts
var INSECURE_UNRESTRICTED_DELEGATION_ERROR_MESSAGE = "No caveats found. If you definitely want to create an empty caveat collection, set `allowInsecureUnrestrictedDelegation` to `true`.";
var CaveatBuilder = class _CaveatBuilder {
  #results = [];
  #hasBeenBuilt = false;
  #environment;
  #config;
  #enforcerBuilders;
  constructor(environment, config = {}, enforcerBuilders = {}, builtCaveats = []) {
    this.#environment = environment;
    this.#config = config;
    this.#enforcerBuilders = enforcerBuilders;
    this.#results = builtCaveats;
  }
  /**
   * Extends the CaveatBuilder with a new enforcer function.
   * @template TEnforcerName - The name of the enforcer.
   * @template TFunction - The type of the enforcer function.
   * @param name - The name of the enforcer.
   * @param fn - The enforcer function.
   * @returns The extended CaveatBuilder instance.
   */
  extend(name, fn) {
    return new _CaveatBuilder(
      this.#environment,
      this.#config,
      { ...this.#enforcerBuilders, [name]: fn },
      this.#results
    );
  }
  addCaveat(nameOrCaveat, config) {
    if (typeof nameOrCaveat === "object") {
      const caveat = {
        args: "0x",
        ...nameOrCaveat
      };
      this.#results = [...this.#results, caveat];
      return this;
    }
    const name = nameOrCaveat;
    const func = this.#enforcerBuilders[name];
    if (typeof func === "function") {
      const result = func(this.#environment, config);
      this.#results = [...this.#results, result];
      return this;
    }
    throw new Error(`Function "${String(name)}" does not exist.`);
  }
  /**
   * Returns the caveats that have been built using this CaveatBuilder.
   * @returns The array of built caveats.
   * @throws Error if the builder has already been built or if no caveats are found and empty caveats are not allowed.
   */
  build() {
    if (this.#hasBeenBuilt) {
      throw new Error("This CaveatBuilder has already been built.");
    }
    if (this.#results.length === 0 && !this.#config.allowInsecureUnrestrictedDelegation) {
      throw new Error(INSECURE_UNRESTRICTED_DELEGATION_ERROR_MESSAGE);
    }
    this.#hasBeenBuilt = true;
    return this.#results;
  }
};

// src/caveatBuilder/types.ts
var BalanceChangeType = /* @__PURE__ */ ((BalanceChangeType2) => {
  BalanceChangeType2[BalanceChangeType2["Increase"] = 0] = "Increase";
  BalanceChangeType2[BalanceChangeType2["Decrease"] = 1] = "Decrease";
  return BalanceChangeType2;
})(BalanceChangeType || {});

// src/caveatBuilder/allowedCalldataBuilder.ts
import { createAllowedCalldataTerms } from "@metamask/delegation-core";
var allowedCalldata = "allowedCalldata";
var allowedCalldataBuilder = (environment, config) => {
  const { startIndex, value } = config;
  const terms = createAllowedCalldataTerms({ startIndex, value });
  const {
    caveatEnforcers: { AllowedCalldataEnforcer }
  } = environment;
  if (!AllowedCalldataEnforcer) {
    throw new Error("AllowedCalldataEnforcer not found in environment");
  }
  return {
    enforcer: AllowedCalldataEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/allowedMethodsBuilder.ts
import { isHex, concat, toFunctionSelector } from "viem";
var allowedMethods = "allowedMethods";
var FUNCTION_SELECTOR_STRING_LENGTH = 10;
var allowedMethodsBuilder = (environment, config) => {
  const { selectors } = config;
  if (selectors.length === 0) {
    throw new Error("Invalid selectors: must provide at least one selector");
  }
  const parsedSelectors = selectors.map(parseSelector);
  const terms = concat(parsedSelectors);
  const {
    caveatEnforcers: { AllowedMethodsEnforcer }
  } = environment;
  if (!AllowedMethodsEnforcer) {
    throw new Error("AllowedMethodsEnforcer not found in environment");
  }
  return {
    enforcer: AllowedMethodsEnforcer,
    terms,
    args: "0x"
  };
};
function parseSelector(selector) {
  if (isHex(selector)) {
    if (selector.length === FUNCTION_SELECTOR_STRING_LENGTH) {
      return selector;
    }
    throw new Error(
      "Invalid selector: must be a 4 byte hex string, abi function signature, or AbiFunction"
    );
  }
  try {
    return toFunctionSelector(selector);
  } catch (rootError) {
    throw new Error(
      "Invalid selector: must be a 4 byte hex string, abi function signature, or AbiFunction",
      { cause: rootError }
    );
  }
}

// src/caveatBuilder/allowedTargetsBuilder.ts
import { concat as concat2, isAddress } from "viem";
var allowedTargets = "allowedTargets";
var allowedTargetsBuilder = (environment, config) => {
  const { targets } = config;
  if (targets.length === 0) {
    throw new Error(
      "Invalid targets: must provide at least one target address"
    );
  }
  const invalidAddresses = targets.filter(
    (target) => !isAddress(target, { strict: false })
  );
  if (invalidAddresses.length > 0) {
    throw new Error("Invalid targets: must be valid addresses");
  }
  const terms = concat2(targets);
  const {
    caveatEnforcers: { AllowedTargetsEnforcer }
  } = environment;
  if (!AllowedTargetsEnforcer) {
    throw new Error("AllowedTargetsEnforcer not found in environment");
  }
  return {
    enforcer: AllowedTargetsEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/argsEqualityCheckBuilder.ts
import { isHex as isHex2 } from "viem";
var argsEqualityCheck = "argsEqualityCheck";
var argsEqualityCheckBuilder = (environment, config) => {
  const { args } = config;
  if (!isHex2(args)) {
    throw new Error("Invalid config: args must be a valid hex string");
  }
  const {
    caveatEnforcers: { ArgsEqualityCheckEnforcer }
  } = environment;
  if (!ArgsEqualityCheckEnforcer) {
    throw new Error("ArgsEqualityCheckEnforcer not found in environment");
  }
  return {
    enforcer: ArgsEqualityCheckEnforcer,
    terms: args,
    args: "0x"
  };
};

// src/caveatBuilder/blockNumberBuilder.ts
import { concat as concat3, toHex } from "viem";
var blockNumber = "blockNumber";
var blockNumberBuilder = (environment, config) => {
  const { afterThreshold, beforeThreshold } = config;
  if (afterThreshold === 0n && beforeThreshold === 0n) {
    throw new Error(
      "Invalid thresholds: At least one of afterThreshold or beforeThreshold must be specified"
    );
  }
  if (beforeThreshold !== 0n && afterThreshold >= beforeThreshold) {
    throw new Error(
      "Invalid thresholds: afterThreshold must be less than beforeThreshold if both are specified"
    );
  }
  const terms = concat3([
    toHex(afterThreshold, {
      size: 16
    }),
    toHex(beforeThreshold, {
      size: 16
    })
  ]);
  const {
    caveatEnforcers: { BlockNumberEnforcer }
  } = environment;
  if (!BlockNumberEnforcer) {
    throw new Error("BlockNumberEnforcer not found in environment");
  }
  return {
    enforcer: BlockNumberEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/deployedBuilder.ts
import { concat as concat4, isAddress as isAddress2, isHex as isHex3, pad } from "viem";
var deployed = "deployed";
var deployedBuilder = (environment, config) => {
  const { contractAddress, salt, bytecode } = config;
  if (!isAddress2(contractAddress, { strict: false })) {
    throw new Error(
      `Invalid contractAddress: must be a valid Ethereum address`
    );
  }
  if (!isHex3(salt)) {
    throw new Error("Invalid salt: must be a valid hexadecimal string");
  }
  if (!isHex3(bytecode)) {
    throw new Error("Invalid bytecode: must be a valid hexadecimal string");
  }
  const terms = concat4([contractAddress, pad(salt, { size: 32 }), bytecode]);
  const {
    caveatEnforcers: { DeployedEnforcer }
  } = environment;
  if (!DeployedEnforcer) {
    throw new Error("DeployedEnforcer not found in environment");
  }
  return {
    enforcer: DeployedEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/erc1155BalanceChangeBuilder.ts
import { isAddress as isAddress3, encodePacked } from "viem";
var erc1155BalanceChange = "erc1155BalanceChange";
var erc1155BalanceChangeBuilder = (environment, config) => {
  const { tokenAddress, recipient, tokenId, balance, changeType } = config;
  if (!isAddress3(tokenAddress, { strict: false })) {
    throw new Error("Invalid tokenAddress: must be a valid address");
  }
  if (!isAddress3(recipient, { strict: false })) {
    throw new Error("Invalid recipient: must be a valid address");
  }
  if (balance <= 0n) {
    throw new Error("Invalid balance: must be a positive number");
  }
  if (tokenId < 0n) {
    throw new Error("Invalid tokenId: must be a non-negative number");
  }
  if (changeType !== 0 /* Increase */ && changeType !== 1 /* Decrease */) {
    throw new Error("Invalid changeType: must be either Increase or Decrease");
  }
  const terms = encodePacked(
    ["uint8", "address", "address", "uint256", "uint256"],
    [changeType, tokenAddress, recipient, tokenId, balance]
  );
  const {
    caveatEnforcers: { ERC1155BalanceChangeEnforcer }
  } = environment;
  if (!ERC1155BalanceChangeEnforcer) {
    throw new Error("ERC1155BalanceChangeEnforcer not found in environment");
  }
  return {
    enforcer: ERC1155BalanceChangeEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/erc20BalanceChangeBuilder.ts
import { isAddress as isAddress4, encodePacked as encodePacked2 } from "viem";
var erc20BalanceChange = "erc20BalanceChange";
var erc20BalanceChangeBuilder = (environment, config) => {
  const { tokenAddress, recipient, balance, changeType } = config;
  if (!isAddress4(tokenAddress, { strict: false })) {
    throw new Error("Invalid tokenAddress: must be a valid address");
  }
  if (balance <= 0n) {
    throw new Error("Invalid balance: must be a positive number");
  }
  if (changeType !== 0 /* Increase */ && changeType !== 1 /* Decrease */) {
    throw new Error("Invalid changeType: must be either Increase or Decrease");
  }
  const terms = encodePacked2(
    ["uint8", "address", "address", "uint256"],
    [changeType, tokenAddress, recipient, balance]
  );
  const {
    caveatEnforcers: { ERC20BalanceChangeEnforcer }
  } = environment;
  if (!ERC20BalanceChangeEnforcer) {
    throw new Error("ERC20BalanceChangeEnforcer not found in environment");
  }
  return {
    enforcer: ERC20BalanceChangeEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/erc20PeriodTransferBuilder.ts
import { createERC20TokenPeriodTransferTerms } from "@metamask/delegation-core";
var erc20PeriodTransfer = "erc20PeriodTransfer";
var erc20PeriodTransferBuilder = (environment, config) => {
  const { tokenAddress, periodAmount, periodDuration, startDate } = config;
  const terms = createERC20TokenPeriodTransferTerms({
    tokenAddress,
    periodAmount,
    periodDuration,
    startDate
  });
  const {
    caveatEnforcers: { ERC20PeriodTransferEnforcer }
  } = environment;
  if (!ERC20PeriodTransferEnforcer) {
    throw new Error("ERC20PeriodTransferEnforcer not found in environment");
  }
  return {
    enforcer: ERC20PeriodTransferEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/erc20StreamingBuilder.ts
import { createERC20StreamingTerms } from "@metamask/delegation-core";
var erc20Streaming = "erc20Streaming";
var erc20StreamingBuilder = (environment, config) => {
  const { tokenAddress, initialAmount, maxAmount, amountPerSecond, startTime } = config;
  const terms = createERC20StreamingTerms({
    tokenAddress,
    initialAmount,
    maxAmount,
    amountPerSecond,
    startTime
  });
  const {
    caveatEnforcers: { ERC20StreamingEnforcer }
  } = environment;
  if (!ERC20StreamingEnforcer) {
    throw new Error("ERC20StreamingEnforcer not found in environment");
  }
  return {
    enforcer: ERC20StreamingEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/erc20TransferAmountBuilder.ts
import { concat as concat5, isAddress as isAddress5, toHex as toHex2 } from "viem";
var erc20TransferAmount = "erc20TransferAmount";
var erc20TransferAmountBuilder = (environment, config) => {
  const { tokenAddress, maxAmount } = config;
  if (!isAddress5(tokenAddress, { strict: false })) {
    throw new Error("Invalid tokenAddress: must be a valid address");
  }
  if (maxAmount <= 0n) {
    throw new Error("Invalid maxAmount: must be a positive number");
  }
  const terms = concat5([tokenAddress, toHex2(maxAmount, { size: 32 })]);
  const {
    caveatEnforcers: { ERC20TransferAmountEnforcer }
  } = environment;
  if (!ERC20TransferAmountEnforcer) {
    throw new Error("ERC20TransferAmountEnforcer not found in environment");
  }
  return {
    enforcer: ERC20TransferAmountEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/erc721BalanceChangeBuilder.ts
import { isAddress as isAddress6, encodePacked as encodePacked3 } from "viem";
var erc721BalanceChange = "erc721BalanceChange";
var erc721BalanceChangeBuilder = (environment, config) => {
  const { tokenAddress, recipient, amount, changeType } = config;
  if (!isAddress6(tokenAddress, { strict: false })) {
    throw new Error("Invalid tokenAddress: must be a valid address");
  }
  if (!isAddress6(recipient, { strict: false })) {
    throw new Error("Invalid recipient: must be a valid address");
  }
  if (amount <= 0n) {
    throw new Error("Invalid balance: must be a positive number");
  }
  if (changeType !== 0 /* Increase */ && changeType !== 1 /* Decrease */) {
    throw new Error("Invalid changeType: must be either Increase or Decrease");
  }
  const terms = encodePacked3(
    ["uint8", "address", "address", "uint256"],
    [changeType, tokenAddress, recipient, amount]
  );
  const {
    caveatEnforcers: { ERC721BalanceChangeEnforcer }
  } = environment;
  if (!ERC721BalanceChangeEnforcer) {
    throw new Error("ERC721BalanceChangeEnforcer not found in environment");
  }
  return {
    enforcer: ERC721BalanceChangeEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/erc721TransferBuilder.ts
import { isAddress as isAddress7, toHex as toHex3, concat as concat6 } from "viem";
var erc721Transfer = "erc721Transfer";
var erc721TransferBuilder = (environment, config) => {
  const { tokenAddress, tokenId } = config;
  if (!isAddress7(tokenAddress, { strict: false })) {
    throw new Error("Invalid tokenAddress: must be a valid address");
  }
  if (tokenId < 0n) {
    throw new Error("Invalid tokenId: must be a non-negative number");
  }
  const terms = concat6([tokenAddress, toHex3(tokenId, { size: 32 })]);
  const {
    caveatEnforcers: { ERC721TransferEnforcer }
  } = environment;
  if (!ERC721TransferEnforcer) {
    throw new Error("ERC721TransferEnforcer not found in environment");
  }
  return {
    enforcer: ERC721TransferEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/exactCalldataBatchBuilder.ts
import { encodeAbiParameters, isAddress as isAddress8 } from "viem";
var exactCalldataBatch = "exactCalldataBatch";
var exactCalldataBatchBuilder = (environment, config) => {
  const { executions } = config;
  if (executions.length === 0) {
    throw new Error("Invalid executions: array cannot be empty");
  }
  for (const execution of executions) {
    if (!isAddress8(execution.target, { strict: false })) {
      throw new Error("Invalid target: must be a valid address");
    }
    if (execution.value < 0n) {
      throw new Error("Invalid value: must be a non-negative number");
    }
    if (!execution.callData.startsWith("0x")) {
      throw new Error(
        "Invalid calldata: must be a hex string starting with 0x"
      );
    }
  }
  const terms = encodeAbiParameters(
    [
      {
        type: "tuple[]",
        components: [
          { type: "address", name: "target" },
          { type: "uint256", name: "value" },
          { type: "bytes", name: "callData" }
        ]
      }
    ],
    [executions]
  );
  const {
    caveatEnforcers: { ExactCalldataBatchEnforcer }
  } = environment;
  if (!ExactCalldataBatchEnforcer) {
    throw new Error("ExactCalldataBatchEnforcer not found in environment");
  }
  return {
    enforcer: ExactCalldataBatchEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/exactCalldataBuilder.ts
import { createExactCalldataTerms } from "@metamask/delegation-core";
var exactCalldata = "exactCalldata";
var exactCalldataBuilder = (environment, config) => {
  const { calldata } = config;
  const terms = createExactCalldataTerms({ calldata });
  const {
    caveatEnforcers: { ExactCalldataEnforcer }
  } = environment;
  if (!ExactCalldataEnforcer) {
    throw new Error("ExactCalldataEnforcer not found in environment");
  }
  return {
    enforcer: ExactCalldataEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/exactExecutionBatchBuilder.ts
import { encodeAbiParameters as encodeAbiParameters2, isAddress as isAddress9 } from "viem";
var exactExecutionBatch = "exactExecutionBatch";
var exactExecutionBatchBuilder = (environment, config) => {
  const { executions } = config;
  if (executions.length === 0) {
    throw new Error("Invalid executions: array cannot be empty");
  }
  for (const execution of executions) {
    if (!isAddress9(execution.target, { strict: false })) {
      throw new Error("Invalid target: must be a valid address");
    }
    if (execution.value < 0n) {
      throw new Error("Invalid value: must be a non-negative number");
    }
    if (!execution.callData.startsWith("0x")) {
      throw new Error(
        "Invalid calldata: must be a hex string starting with 0x"
      );
    }
  }
  const terms = encodeAbiParameters2(
    [
      {
        type: "tuple[]",
        components: [
          { type: "address", name: "target" },
          { type: "uint256", name: "value" },
          { type: "bytes", name: "callData" }
        ]
      }
    ],
    [executions]
  );
  const {
    caveatEnforcers: { ExactExecutionBatchEnforcer }
  } = environment;
  if (!ExactExecutionBatchEnforcer) {
    throw new Error("ExactExecutionBatchEnforcer not found in environment");
  }
  return {
    enforcer: ExactExecutionBatchEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/exactExecutionBuilder.ts
import { isAddress as isAddress10, concat as concat7, toHex as toHex4 } from "viem";
var exactExecution = "exactExecution";
var exactExecutionBuilder = (environment, config) => {
  const { execution } = config;
  if (!isAddress10(execution.target, { strict: false })) {
    throw new Error("Invalid target: must be a valid address");
  }
  if (execution.value < 0n) {
    throw new Error("Invalid value: must be a non-negative number");
  }
  if (!execution.callData.startsWith("0x")) {
    throw new Error("Invalid calldata: must be a hex string starting with 0x");
  }
  const terms = concat7([
    execution.target,
    toHex4(execution.value, { size: 32 }),
    execution.callData
  ]);
  const {
    caveatEnforcers: { ExactExecutionEnforcer }
  } = environment;
  if (!ExactExecutionEnforcer) {
    throw new Error("ExactExecutionEnforcer not found in environment");
  }
  return {
    enforcer: ExactExecutionEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/idBuilder.ts
import { maxUint256, toHex as toHex5 } from "viem";
var id = "id";
var idBuilder = (environment, config) => {
  const { id: idValue } = config;
  let idBigInt;
  if (typeof idValue === "number") {
    if (!Number.isInteger(idValue)) {
      throw new Error("Invalid id: must be an integer");
    }
    idBigInt = BigInt(idValue);
  } else if (typeof idValue === "bigint") {
    idBigInt = idValue;
  } else {
    throw new Error("Invalid id: must be a bigint or number");
  }
  if (idBigInt < 0n) {
    throw new Error("Invalid id: must be a non-negative number");
  }
  if (idBigInt > maxUint256) {
    throw new Error("Invalid id: must be less than 2^256");
  }
  const terms = toHex5(idBigInt, { size: 32 });
  const {
    caveatEnforcers: { IdEnforcer }
  } = environment;
  if (!IdEnforcer) {
    throw new Error("IdEnforcer not found in environment");
  }
  return {
    enforcer: IdEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/limitedCallsBuilder.ts
import { toHex as toHex6, pad as pad2 } from "viem";
var limitedCalls = "limitedCalls";
var limitedCallsBuilder = (environment, config) => {
  const { limit } = config;
  if (!Number.isInteger(limit)) {
    throw new Error("Invalid limit: must be an integer");
  }
  if (limit <= 0) {
    throw new Error("Invalid limit: must be a positive integer");
  }
  const terms = pad2(toHex6(limit), { size: 32 });
  const {
    caveatEnforcers: { LimitedCallsEnforcer }
  } = environment;
  if (!LimitedCallsEnforcer) {
    throw new Error("LimitedCallsEnforcer not found in environment");
  }
  return {
    enforcer: LimitedCallsEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/multiTokenPeriodBuilder.ts
import { concat as concat8, isAddress as isAddress11, pad as pad3, toHex as toHex7 } from "viem";
var multiTokenPeriod = "multiTokenPeriod";
var multiTokenPeriodBuilder = (environment, config) => {
  if (!config?.tokenConfigs || config.tokenConfigs.length === 0) {
    throw new Error(
      "MultiTokenPeriodBuilder: tokenConfigs array cannot be empty"
    );
  }
  config.tokenConfigs.forEach((tokenConfig) => {
    if (!isAddress11(tokenConfig.token)) {
      throw new Error(`Invalid token address: ${String(tokenConfig.token)}`);
    }
    if (tokenConfig.periodAmount <= 0) {
      throw new Error("Invalid period amount: must be greater than 0");
    }
    if (tokenConfig.periodDuration <= 0) {
      throw new Error("Invalid period duration: must be greater than 0");
    }
  });
  const termsArray = config.tokenConfigs.reduce(
    (acc, { token, periodAmount, periodDuration, startDate }) => [
      ...acc,
      pad3(token, { size: 20 }),
      toHex7(periodAmount, { size: 32 }),
      toHex7(periodDuration, { size: 32 }),
      toHex7(startDate, { size: 32 })
    ],
    []
  );
  const terms = concat8(termsArray);
  const {
    caveatEnforcers: { MultiTokenPeriodEnforcer }
  } = environment;
  if (!MultiTokenPeriodEnforcer) {
    throw new Error("MultiTokenPeriodEnforcer not found in environment");
  }
  return {
    enforcer: MultiTokenPeriodEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/nativeBalanceChangeBuilder.ts
import { isAddress as isAddress12, encodePacked as encodePacked4 } from "viem";
var nativeBalanceChange = "nativeBalanceChange";
var nativeBalanceChangeBuilder = (environment, config) => {
  const { recipient, balance, changeType } = config;
  if (!isAddress12(recipient)) {
    throw new Error("Invalid recipient: must be a valid Address");
  }
  if (balance <= 0n) {
    throw new Error("Invalid balance: must be a positive number");
  }
  if (changeType !== 0 /* Increase */ && changeType !== 1 /* Decrease */) {
    throw new Error("Invalid changeType: must be either Increase or Decrease");
  }
  const terms = encodePacked4(
    ["uint8", "address", "uint256"],
    [changeType, recipient, balance]
  );
  const {
    caveatEnforcers: { NativeBalanceChangeEnforcer }
  } = environment;
  if (!NativeBalanceChangeEnforcer) {
    throw new Error("NativeBalanceChangeEnforcer not found in environment");
  }
  return {
    enforcer: NativeBalanceChangeEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/nativeTokenPaymentBuilder.ts
import { encodePacked as encodePacked5, isAddress as isAddress13 } from "viem";
var nativeTokenPayment = "nativeTokenPayment";
var nativeTokenPaymentBuilder = (environment, config) => {
  const { recipient, amount } = config;
  if (amount <= 0n) {
    throw new Error("Invalid amount: must be positive");
  }
  if (!isAddress13(recipient)) {
    throw new Error("Invalid recipient: must be a valid address");
  }
  const terms = encodePacked5(["address", "uint256"], [recipient, amount]);
  const {
    caveatEnforcers: { NativeTokenPaymentEnforcer }
  } = environment;
  if (!NativeTokenPaymentEnforcer) {
    throw new Error("NativeTokenPaymentEnforcer not found in environment");
  }
  return {
    enforcer: NativeTokenPaymentEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/nativeTokenPeriodTransferBuilder.ts
import { createNativeTokenPeriodTransferTerms } from "@metamask/delegation-core";
var nativeTokenPeriodTransfer = "nativeTokenPeriodTransfer";
var nativeTokenPeriodTransferBuilder = (environment, config) => {
  const { periodAmount, periodDuration, startDate } = config;
  const terms = createNativeTokenPeriodTransferTerms({
    periodAmount,
    periodDuration,
    startDate
  });
  const {
    caveatEnforcers: { NativeTokenPeriodTransferEnforcer }
  } = environment;
  if (!NativeTokenPeriodTransferEnforcer) {
    throw new Error(
      "NativeTokenPeriodTransferEnforcer not found in environment"
    );
  }
  return {
    enforcer: NativeTokenPeriodTransferEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/nativeTokenStreamingBuilder.ts
import { createNativeTokenStreamingTerms } from "@metamask/delegation-core";
var nativeTokenStreaming = "nativeTokenStreaming";
var nativeTokenStreamingBuilder = (environment, config) => {
  const { initialAmount, maxAmount, amountPerSecond, startTime } = config;
  const terms = createNativeTokenStreamingTerms({
    initialAmount,
    maxAmount,
    amountPerSecond,
    startTime
  });
  const {
    caveatEnforcers: { NativeTokenStreamingEnforcer }
  } = environment;
  if (!NativeTokenStreamingEnforcer) {
    throw new Error("NativeTokenStreamingEnforcer not found in environment");
  }
  return {
    enforcer: NativeTokenStreamingEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/nativeTokenTransferAmountBuilder.ts
import { encodePacked as encodePacked6 } from "viem";
var nativeTokenTransferAmount = "nativeTokenTransferAmount";
var nativeTokenTransferAmountBuilder = (environment, config) => {
  const { maxAmount } = config;
  if (maxAmount < 0n) {
    throw new Error("Invalid maxAmount: must be zero or positive");
  }
  const terms = encodePacked6(["uint256"], [maxAmount]);
  const {
    caveatEnforcers: { NativeTokenTransferAmountEnforcer }
  } = environment;
  if (!NativeTokenTransferAmountEnforcer) {
    throw new Error(
      "NativeTokenTransferAmountEnforcer not found in environment"
    );
  }
  return {
    enforcer: NativeTokenTransferAmountEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/nonceBuilder.ts
import { createNonceTerms } from "@metamask/delegation-core";
var nonce = "nonce";
var nonceBuilder = (environment, config) => {
  const { nonce: nonceValue } = config;
  const terms = createNonceTerms({ nonce: nonceValue });
  const {
    caveatEnforcers: { NonceEnforcer }
  } = environment;
  if (!NonceEnforcer) {
    throw new Error("NonceEnforcer not found in environment");
  }
  return {
    enforcer: NonceEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/ownershipTransferBuilder.ts
import { isAddress as isAddress14 } from "viem";
var ownershipTransfer = "ownershipTransfer";
var ownershipTransferBuilder = (environment, config) => {
  const { contractAddress } = config;
  if (!isAddress14(contractAddress, { strict: false })) {
    throw new Error("Invalid contractAddress: must be a valid address");
  }
  const terms = contractAddress;
  const {
    caveatEnforcers: { OwnershipTransferEnforcer }
  } = environment;
  if (!OwnershipTransferEnforcer) {
    throw new Error("OwnershipTransferEnforcer not found in environment");
  }
  return {
    enforcer: OwnershipTransferEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/redeemerBuilder.ts
import { concat as concat9, isAddress as isAddress15 } from "viem";
var redeemer = "redeemer";
var redeemerBuilder = (environment, config) => {
  const { redeemers } = config;
  if (redeemers.length === 0) {
    throw new Error(
      "Invalid redeemers: must specify at least one redeemer address"
    );
  }
  for (const redeemerAddress of redeemers) {
    if (!isAddress15(redeemerAddress)) {
      throw new Error("Invalid redeemers: must be a valid address");
    }
  }
  const terms = concat9(redeemers);
  const {
    caveatEnforcers: { RedeemerEnforcer }
  } = environment;
  if (!RedeemerEnforcer) {
    throw new Error("RedeemerEnforcer not found in environment");
  }
  return {
    enforcer: RedeemerEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/specificActionERC20TransferBatchBuilder.ts
import { concat as concat10, isAddress as isAddress16, toHex as toHex8 } from "viem";
var specificActionERC20TransferBatch = "specificActionERC20TransferBatch";
var specificActionERC20TransferBatchBuilder = (environment, config) => {
  const { tokenAddress, recipient, amount, target, calldata } = config;
  if (!isAddress16(tokenAddress, { strict: false })) {
    throw new Error("Invalid tokenAddress: must be a valid address");
  }
  if (!isAddress16(recipient, { strict: false })) {
    throw new Error("Invalid recipient: must be a valid address");
  }
  if (!isAddress16(target, { strict: false })) {
    throw new Error("Invalid target: must be a valid address");
  }
  if (amount <= 0n) {
    throw new Error("Invalid amount: must be a positive number");
  }
  const terms = concat10([
    tokenAddress,
    recipient,
    toHex8(amount, { size: 32 }),
    target,
    calldata
  ]);
  const {
    caveatEnforcers: { SpecificActionERC20TransferBatchEnforcer }
  } = environment;
  if (!SpecificActionERC20TransferBatchEnforcer) {
    throw new Error(
      "SpecificActionERC20TransferBatchEnforcer not found in environment"
    );
  }
  return {
    enforcer: SpecificActionERC20TransferBatchEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/timestampBuilder.ts
import { createTimestampTerms } from "@metamask/delegation-core";
var timestamp = "timestamp";
var timestampBuilder = (environment, config) => {
  const { afterThreshold, beforeThreshold } = config;
  const terms = createTimestampTerms({
    timestampAfterThreshold: afterThreshold,
    timestampBeforeThreshold: beforeThreshold
  });
  const {
    caveatEnforcers: { TimestampEnforcer }
  } = environment;
  if (!TimestampEnforcer) {
    throw new Error("TimestampEnforcer not found in environment");
  }
  return {
    enforcer: TimestampEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/valueLteBuilder.ts
import { createValueLteTerms } from "@metamask/delegation-core";
var valueLte = "valueLte";
var valueLteBuilder = (environment, config) => {
  const { maxValue } = config;
  const terms = createValueLteTerms({ maxValue });
  const {
    caveatEnforcers: { ValueLteEnforcer }
  } = environment;
  if (!ValueLteEnforcer) {
    throw new Error("ValueLteEnforcer not found in environment");
  }
  return {
    enforcer: ValueLteEnforcer,
    terms,
    args: "0x"
  };
};

// src/caveatBuilder/coreCaveatBuilder.ts
var createCaveatBuilder = (environment, config) => {
  const caveatBuilder = new CaveatBuilder(environment, config).extend(allowedMethods, allowedMethodsBuilder).extend(allowedTargets, allowedTargetsBuilder).extend(deployed, deployedBuilder).extend(allowedCalldata, allowedCalldataBuilder).extend(erc20BalanceChange, erc20BalanceChangeBuilder).extend(erc721BalanceChange, erc721BalanceChangeBuilder).extend(erc1155BalanceChange, erc1155BalanceChangeBuilder).extend(valueLte, valueLteBuilder).extend(limitedCalls, limitedCallsBuilder).extend(id, idBuilder).extend(nonce, nonceBuilder).extend(timestamp, timestampBuilder).extend(blockNumber, blockNumberBuilder).extend(erc20TransferAmount, erc20TransferAmountBuilder).extend(erc20Streaming, erc20StreamingBuilder).extend(nativeTokenStreaming, nativeTokenStreamingBuilder).extend(erc721Transfer, erc721TransferBuilder).extend(nativeTokenTransferAmount, nativeTokenTransferAmountBuilder).extend(nativeBalanceChange, nativeBalanceChangeBuilder).extend(redeemer, redeemerBuilder).extend(nativeTokenPayment, nativeTokenPaymentBuilder).extend(argsEqualityCheck, argsEqualityCheckBuilder).extend(
    specificActionERC20TransferBatch,
    specificActionERC20TransferBatchBuilder
  ).extend(erc20PeriodTransfer, erc20PeriodTransferBuilder).extend(nativeTokenPeriodTransfer, nativeTokenPeriodTransferBuilder).extend(exactCalldataBatch, exactCalldataBatchBuilder).extend(exactCalldata, exactCalldataBuilder).extend(exactExecution, exactExecutionBuilder).extend(exactExecutionBatch, exactExecutionBatchBuilder).extend(multiTokenPeriod, multiTokenPeriodBuilder).extend(ownershipTransfer, ownershipTransferBuilder);
  return caveatBuilder;
};

// src/caveatBuilder/scope/erc20PeriodicScope.ts
function createErc20PeriodicCaveatBuilder(environment, config) {
  return createCaveatBuilder(environment).addCaveat("valueLte", {
    maxValue: 0n
  }).addCaveat("erc20PeriodTransfer", {
    tokenAddress: config.tokenAddress,
    periodAmount: config.periodAmount,
    periodDuration: config.periodDuration,
    startDate: config.startDate
  });
}

// src/caveatBuilder/scope/erc20StreamingScope.ts
function createErc20StreamingCaveatBuilder(environment, config) {
  return createCaveatBuilder(environment).addCaveat("valueLte", {
    maxValue: 0n
  }).addCaveat("erc20Streaming", {
    tokenAddress: config.tokenAddress,
    initialAmount: config.initialAmount,
    maxAmount: config.maxAmount,
    amountPerSecond: config.amountPerSecond,
    startTime: config.startTime
  });
}

// src/caveatBuilder/scope/erc20TransferScope.ts
function createErc20TransferCaveatBuilder(environment, config) {
  return createCaveatBuilder(environment).addCaveat("valueLte", {
    maxValue: 0n
  }).addCaveat("erc20TransferAmount", {
    tokenAddress: config.tokenAddress,
    maxAmount: config.maxAmount
  });
}

// src/utils.ts
import { isHex as isHex4, toHex as toHex9 } from "viem";
var hasProperties = (object, properties) => {
  return properties.every(
    (prop) => prop in object && object[prop] !== void 0
  );
};

// src/caveatBuilder/scope/erc721Scope.ts
var isErc721TransferConfig = (config) => {
  return hasProperties(
    config,
    ["tokenAddress", "tokenId"]
  );
};
function createErc721CaveatBuilder(environment, config) {
  if (!isErc721TransferConfig(config)) {
    throw new Error("Invalid ERC721 configuration");
  }
  const caveatBuilder = createCaveatBuilder(environment).addCaveat(
    "erc721Transfer",
    config
  );
  return caveatBuilder;
}

// src/caveatBuilder/scope/functionCallScope.ts
var isFunctionCallConfig = (config) => {
  return hasProperties(config, ["targets", "selectors"]);
};
function createFunctionCallCaveatBuilder(environment, config) {
  const { targets, selectors, allowedCalldata: allowedCalldata2, exactCalldata: exactCalldata2 } = config;
  if (!isFunctionCallConfig(config)) {
    throw new Error("Invalid Function Call configuration");
  }
  if (allowedCalldata2 && allowedCalldata2.length > 0 && exactCalldata2) {
    throw new Error(
      "Cannot specify both allowedCalldata and exactCalldata. Please use only one calldata restriction type."
    );
  }
  const valueLteConfig = config.valueLte ?? { maxValue: 0n };
  const caveatBuilder = createCaveatBuilder(environment).addCaveat("allowedTargets", { targets }).addCaveat("allowedMethods", { selectors }).addCaveat("valueLte", valueLteConfig);
  if (allowedCalldata2 && allowedCalldata2.length > 0) {
    allowedCalldata2.forEach((calldataConfig) => {
      caveatBuilder.addCaveat("allowedCalldata", calldataConfig);
    });
  } else if (exactCalldata2) {
    caveatBuilder.addCaveat("exactCalldata", exactCalldata2);
  }
  return caveatBuilder;
}

// src/caveatBuilder/scope/nativeTokenPeriodicScope.ts
function createNativeTokenPeriodicCaveatBuilder(environment, config) {
  const {
    periodAmount,
    periodDuration,
    startDate,
    allowedCalldata: allowedCalldata2,
    exactCalldata: exactCalldata2
  } = config;
  if (allowedCalldata2 && allowedCalldata2.length > 0 && exactCalldata2) {
    throw new Error(
      "Cannot specify both allowedCalldata and exactCalldata. Please use only one calldata restriction type."
    );
  }
  const caveatBuilder = createCaveatBuilder(environment);
  if (allowedCalldata2 && allowedCalldata2.length > 0) {
    allowedCalldata2.forEach((calldataConfig) => {
      caveatBuilder.addCaveat("allowedCalldata", calldataConfig);
    });
  } else if (exactCalldata2) {
    caveatBuilder.addCaveat("exactCalldata", exactCalldata2);
  } else {
    caveatBuilder.addCaveat("exactCalldata", {
      calldata: "0x"
    });
  }
  caveatBuilder.addCaveat("nativeTokenPeriodTransfer", {
    periodAmount,
    periodDuration,
    startDate
  });
  return caveatBuilder;
}

// src/caveatBuilder/scope/nativeTokenStreamingScope.ts
function createNativeTokenStreamingCaveatBuilder(environment, config) {
  const {
    initialAmount,
    maxAmount,
    amountPerSecond,
    startTime,
    allowedCalldata: allowedCalldata2,
    exactCalldata: exactCalldata2
  } = config;
  if (allowedCalldata2 && allowedCalldata2.length > 0 && exactCalldata2) {
    throw new Error(
      "Cannot specify both allowedCalldata and exactCalldata. Please use only one calldata restriction type."
    );
  }
  const caveatBuilder = createCaveatBuilder(environment);
  if (allowedCalldata2 && allowedCalldata2.length > 0) {
    allowedCalldata2.forEach((calldataConfig) => {
      caveatBuilder.addCaveat("allowedCalldata", calldataConfig);
    });
  } else if (exactCalldata2) {
    caveatBuilder.addCaveat("exactCalldata", exactCalldata2);
  } else {
    caveatBuilder.addCaveat("exactCalldata", {
      calldata: "0x"
    });
  }
  caveatBuilder.addCaveat("nativeTokenStreaming", {
    initialAmount,
    maxAmount,
    amountPerSecond,
    startTime
  });
  return caveatBuilder;
}

// src/caveatBuilder/scope/nativeTokenTransferScope.ts
function createNativeTokenTransferCaveatBuilder(environment, config) {
  const { maxAmount, allowedCalldata: allowedCalldata2, exactCalldata: exactCalldata2 } = config;
  if (allowedCalldata2 && allowedCalldata2.length > 0 && exactCalldata2) {
    throw new Error(
      "Cannot specify both allowedCalldata and exactCalldata. Please use only one calldata restriction type."
    );
  }
  const caveatBuilder = createCaveatBuilder(environment);
  if (allowedCalldata2 && allowedCalldata2.length > 0) {
    allowedCalldata2.forEach((calldataConfig) => {
      caveatBuilder.addCaveat("allowedCalldata", calldataConfig);
    });
  } else if (exactCalldata2) {
    caveatBuilder.addCaveat("exactCalldata", exactCalldata2);
  } else {
    caveatBuilder.addCaveat("exactCalldata", {
      calldata: "0x"
    });
  }
  caveatBuilder.addCaveat("nativeTokenTransferAmount", {
    maxAmount
  });
  return caveatBuilder;
}

// src/caveatBuilder/scope/ownershipScope.ts
var isOwnershipTransferConfig = (config) => {
  return hasProperties(
    config,
    ["contractAddress"]
  );
};
function createOwnershipCaveatBuilder(environment, config) {
  if (!isOwnershipTransferConfig(config)) {
    throw new Error("Invalid ownership transfer configuration");
  }
  const caveatBuilder = createCaveatBuilder(environment).addCaveat(
    "ownershipTransfer",
    config
  );
  return caveatBuilder;
}

// src/caveatBuilder/scope/index.ts
var createCaveatBuilderFromScope = (environment, scopeConfig) => {
  switch (scopeConfig.type) {
    case erc20TransferAmount:
      return createErc20TransferCaveatBuilder(environment, scopeConfig);
    case erc20Streaming:
      return createErc20StreamingCaveatBuilder(environment, scopeConfig);
    case erc20PeriodTransfer:
      return createErc20PeriodicCaveatBuilder(environment, scopeConfig);
    case nativeTokenTransferAmount:
      return createNativeTokenTransferCaveatBuilder(environment, scopeConfig);
    case nativeTokenStreaming:
      return createNativeTokenStreamingCaveatBuilder(environment, scopeConfig);
    case nativeTokenPeriodTransfer:
      return createNativeTokenPeriodicCaveatBuilder(environment, scopeConfig);
    case erc721Transfer:
      return createErc721CaveatBuilder(environment, scopeConfig);
    case ownershipTransfer:
      return createOwnershipCaveatBuilder(environment, scopeConfig);
    case "functionCall":
      return createFunctionCallCaveatBuilder(environment, scopeConfig);
    default:
      const exhaustivenessCheck = scopeConfig;
      throw new Error(
        `Invalid scope type: ${exhaustivenessCheck.type}`
      );
  }
};

// src/caveatBuilder/resolveCaveats.ts
var resolveCaveats = ({
  environment,
  scope,
  caveats
}) => {
  const scopeCaveatBuilder = createCaveatBuilderFromScope(environment, scope);
  if (caveats) {
    if ("build" in caveats && typeof caveats.build === "function") {
      caveats.build().forEach((caveat) => {
        scopeCaveatBuilder.addCaveat(caveat);
      });
    } else if (Array.isArray(caveats)) {
      caveats.forEach((caveat) => {
        try {
          if ("type" in caveat) {
            const { type, ...config } = caveat;
            scopeCaveatBuilder.addCaveat(type, config);
          } else {
            scopeCaveatBuilder.addCaveat(caveat);
          }
        } catch (error) {
          throw new Error(`Invalid caveat: ${error.message}`);
        }
      });
    }
  }
  return scopeCaveatBuilder.build();
};

// src/caveats.ts
import {
  encodePacked as encodePacked7,
  encodeAbiParameters as encodeAbiParameters3,
  parseAbiParameters,
  keccak256,
  toHex as toHex10
} from "viem";
var CAVEAT_ABI_TYPE_COMPONENTS = [
  { type: "address", name: "enforcer" },
  { type: "bytes", name: "terms" },
  { type: "bytes", name: "args" }
];
var CAVEAT_TYPEHASH = keccak256(
  toHex10("Caveat(address enforcer,bytes terms)")
);
var createCaveat = (enforcer, terms, args = "0x") => ({
  enforcer,
  terms,
  args
});

// src/delegation.ts
import {
  encodeDelegations as encodeDelegationsCore,
  decodeDelegations as decodeDelegationsCore,
  hashDelegation,
  ANY_BENEFICIARY,
  DELEGATION_TYPEHASH,
  CAVEAT_TYPEHASH as CAVEAT_TYPEHASH2,
  ROOT_AUTHORITY
} from "@metamask/delegation-core";
import { hashMessage, toBytes, toHex as toHex11, getAddress } from "viem";
import { signTypedData } from "viem/accounts";
var DELEGATION_ABI_TYPE_COMPONENTS = [
  { type: "address", name: "delegate" },
  { type: "address", name: "delegator" },
  { type: "bytes32", name: "authority" },
  { type: "tuple[]", name: "caveats", components: CAVEAT_ABI_TYPE_COMPONENTS },
  { type: "uint256", name: "salt" },
  { type: "bytes", name: "signature" }
];
var toDelegationStruct = (delegation) => {
  const caveats = delegation.caveats.map((caveat) => ({
    enforcer: getAddress(caveat.enforcer),
    terms: caveat.terms,
    args: caveat.args
  }));
  const salt = delegation.salt === "0x" ? 0n : BigInt(delegation.salt);
  return {
    delegate: getAddress(delegation.delegate),
    delegator: getAddress(delegation.delegator),
    authority: delegation.authority === void 0 ? ROOT_AUTHORITY : delegation.authority,
    caveats,
    salt,
    signature: delegation.signature
  };
};
var toDelegation = (delegationStruct) => {
  return {
    ...delegationStruct,
    salt: toHex11(delegationStruct.salt)
  };
};
var encodeDelegations = (delegations) => {
  const delegationStructs = delegations.map(toDelegationStruct);
  return encodeDelegationsCore(delegationStructs);
};
var encodePermissionContexts = (delegations) => {
  const encodedDelegations = delegations.map(
    (delegationChain) => encodeDelegations(delegationChain)
  );
  return encodedDelegations;
};
var decodeDelegations = (encoded) => {
  return decodeDelegationsCore(encoded).map(toDelegation);
};
var decodePermissionContexts = (encoded) => {
  const delegationChains = encoded.map(decodeDelegations);
  return delegationChains;
};
var SIGNABLE_DELEGATION_TYPED_DATA = {
  Caveat: [
    { name: "enforcer", type: "address" },
    { name: "terms", type: "bytes" }
  ],
  Delegation: [
    { name: "delegate", type: "address" },
    { name: "delegator", type: "address" },
    { name: "authority", type: "bytes32" },
    { name: "caveats", type: "Caveat[]" },
    { name: "salt", type: "uint256" }
  ]
};
var DELEGATION_ARRAY_ABI_TYPE = {
  type: "tuple[]",
  components: DELEGATION_ABI_TYPE_COMPONENTS
};
var getDelegationHashOffchain = (input) => {
  const delegationStruct = toDelegationStruct(input);
  return hashDelegation(delegationStruct);
};
var resolveAuthority = (parentDelegation) => {
  if (!parentDelegation) {
    return ROOT_AUTHORITY;
  }
  if (typeof parentDelegation === "string") {
    return parentDelegation;
  }
  return getDelegationHashOffchain(parentDelegation);
};
var createDelegation = (options) => {
  return {
    delegate: options.to,
    delegator: options.from,
    authority: resolveAuthority(options.parentDelegation),
    caveats: resolveCaveats(options),
    salt: options.salt ?? "0x",
    signature: "0x"
  };
};
var createOpenDelegation = (options) => {
  return {
    delegate: ANY_BENEFICIARY,
    delegator: options.from,
    authority: resolveAuthority(options.parentDelegation),
    caveats: resolveCaveats(options),
    salt: options.salt ?? "0x",
    signature: "0x"
  };
};
var prepareSignDelegationTypedData = ({
  delegation,
  delegationManager,
  chainId,
  name = "DelegationManager",
  version = "1",
  allowInsecureUnrestrictedDelegation = false
}) => {
  const delegationStruct = toDelegationStruct({
    ...delegation,
    signature: "0x"
  });
  if (delegationStruct.caveats.length === 0 && !allowInsecureUnrestrictedDelegation) {
    throw new Error(
      "No caveats found. If you definitely want to sign a delegation without caveats, set `allowInsecureUnrestrictedDelegation` to `true`."
    );
  }
  return {
    domain: {
      chainId,
      name,
      version,
      verifyingContract: delegationManager
    },
    types: SIGNABLE_DELEGATION_TYPED_DATA,
    primaryType: "Delegation",
    message: delegationStruct
  };
};
var signDelegation = async ({
  privateKey,
  delegation,
  delegationManager,
  chainId,
  name = "DelegationManager",
  version = "1",
  allowInsecureUnrestrictedDelegation = false
}) => {
  const typedData = prepareSignDelegationTypedData({
    delegation,
    delegationManager,
    chainId,
    name,
    version,
    allowInsecureUnrestrictedDelegation
  });
  return signTypedData({
    privateKey,
    ...typedData
  });
};

export {
  __export,
  CaveatBuilder,
  BalanceChangeType,
  createCaveatBuilder,
  createCaveat,
  ANY_BENEFICIARY,
  DELEGATION_TYPEHASH,
  ROOT_AUTHORITY,
  DELEGATION_ABI_TYPE_COMPONENTS,
  toDelegationStruct,
  toDelegation,
  encodeDelegations,
  encodePermissionContexts,
  decodeDelegations,
  decodePermissionContexts,
  SIGNABLE_DELEGATION_TYPED_DATA,
  DELEGATION_ARRAY_ABI_TYPE,
  getDelegationHashOffchain,
  createDelegation,
  createOpenDelegation,
  prepareSignDelegationTypedData,
  signDelegation
};
//# sourceMappingURL=chunk-BJGZGTRU.mjs.map