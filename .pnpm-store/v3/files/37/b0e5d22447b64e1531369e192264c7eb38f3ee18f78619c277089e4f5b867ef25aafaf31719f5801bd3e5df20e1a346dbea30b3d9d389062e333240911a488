import {
  __export
} from "./chunk-BJGZGTRU.mjs";

// src/DelegationFramework/ERC20PeriodTransferEnforcer/index.ts
var ERC20PeriodTransferEnforcer_exports = {};
__export(ERC20PeriodTransferEnforcer_exports, {
  read: () => read_exports
});

// src/DelegationFramework/ERC20PeriodTransferEnforcer/read.ts
var read_exports = {};
__export(read_exports, {
  getAvailableAmount: () => read
});

// src/DelegationFramework/ERC20PeriodTransferEnforcer/methods/getAvailableAmount.ts
import { ERC20PeriodTransferEnforcer } from "@metamask/delegation-abis";
import { readContract } from "viem/actions";
var read = async ({
  client,
  contractAddress,
  delegationHash,
  delegationManager,
  terms
}) => {
  const [availableAmount, isNewPeriod, currentPeriod] = await readContract(
    client,
    {
      address: contractAddress,
      abi: ERC20PeriodTransferEnforcer.abi,
      functionName: "getAvailableAmount",
      args: [delegationHash, delegationManager, terms]
    }
  );
  return {
    availableAmount,
    isNewPeriod,
    currentPeriod
  };
};

// src/DelegationFramework/ERC20StreamingEnforcer/index.ts
var ERC20StreamingEnforcer_exports = {};
__export(ERC20StreamingEnforcer_exports, {
  read: () => read_exports2
});

// src/DelegationFramework/ERC20StreamingEnforcer/read.ts
var read_exports2 = {};
__export(read_exports2, {
  getAvailableAmount: () => read2
});

// src/DelegationFramework/ERC20StreamingEnforcer/methods/getAvailableAmount.ts
import { ERC20StreamingEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract2, getBlock } from "viem/actions";
var read2 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash,
  terms
}) => {
  const currentBlock = await getBlock(client);
  const currentTimestamp = currentBlock.timestamp;
  const allowanceState = await readContract2(client, {
    address: contractAddress,
    abi: ERC20StreamingEnforcer.abi,
    functionName: "streamingAllowances",
    args: [delegationManager, delegationHash]
  });
  const [initialAmount, maxAmount, amountPerSecond, startTime, spent] = allowanceState;
  if (startTime !== 0n) {
    const availableAmount2 = getAvailableAmount({
      initialAmount,
      maxAmount,
      amountPerSecond,
      startTime,
      spent,
      currentTimestamp
    });
    return {
      availableAmount: availableAmount2
    };
  }
  const decodedTerms = await readContract2(client, {
    address: contractAddress,
    abi: ERC20StreamingEnforcer.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  const [
    ,
    decodedInitialAmount,
    decodedMaxAmount,
    decodedAmountPerSecond,
    decodedStartTime
  ] = decodedTerms;
  const availableAmount = getAvailableAmount({
    initialAmount: decodedInitialAmount,
    maxAmount: decodedMaxAmount,
    amountPerSecond: decodedAmountPerSecond,
    startTime: decodedStartTime,
    spent: 0n,
    currentTimestamp
  });
  return {
    availableAmount
  };
};
function getAvailableAmount(allowance) {
  if (allowance.currentTimestamp < allowance.startTime) {
    return 0n;
  }
  const elapsed = allowance.currentTimestamp - allowance.startTime;
  let unlocked = allowance.initialAmount + allowance.amountPerSecond * elapsed;
  if (unlocked > allowance.maxAmount) {
    unlocked = allowance.maxAmount;
  }
  if (allowance.spent >= unlocked) {
    return 0n;
  }
  return unlocked - allowance.spent;
}

// src/DelegationFramework/MultiTokenPeriodEnforcer/index.ts
var MultiTokenPeriodEnforcer_exports = {};
__export(MultiTokenPeriodEnforcer_exports, {
  read: () => read_exports3
});

// src/DelegationFramework/MultiTokenPeriodEnforcer/read.ts
var read_exports3 = {};
__export(read_exports3, {
  getAvailableAmount: () => read3
});

// src/DelegationFramework/MultiTokenPeriodEnforcer/methods/getAvailableAmount.ts
import { MultiTokenPeriodEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract3 } from "viem/actions";
var read3 = async ({
  client,
  contractAddress,
  delegationHash,
  delegationManager,
  terms,
  args
}) => {
  const [availableAmount, isNewPeriod, currentPeriod] = await readContract3(
    client,
    {
      address: contractAddress,
      abi: MultiTokenPeriodEnforcer.abi,
      functionName: "getAvailableAmount",
      args: [delegationHash, delegationManager, terms, args]
    }
  );
  return {
    availableAmount,
    isNewPeriod,
    currentPeriod
  };
};

// src/DelegationFramework/NativeTokenPeriodTransferEnforcer/index.ts
var NativeTokenPeriodTransferEnforcer_exports = {};
__export(NativeTokenPeriodTransferEnforcer_exports, {
  read: () => read_exports4
});

// src/DelegationFramework/NativeTokenPeriodTransferEnforcer/read.ts
var read_exports4 = {};
__export(read_exports4, {
  getAvailableAmount: () => read4
});

// src/DelegationFramework/NativeTokenPeriodTransferEnforcer/methods/getAvailableAmount.ts
import { NativeTokenPeriodTransferEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract4 } from "viem/actions";
var read4 = async ({
  client,
  contractAddress,
  delegationHash,
  delegationManager,
  terms
}) => {
  const [availableAmount, isNewPeriod, currentPeriod] = await readContract4(
    client,
    {
      address: contractAddress,
      abi: NativeTokenPeriodTransferEnforcer.abi,
      functionName: "getAvailableAmount",
      args: [delegationHash, delegationManager, terms]
    }
  );
  return {
    availableAmount,
    isNewPeriod,
    currentPeriod
  };
};

// src/DelegationFramework/NativeTokenStreamingEnforcer/index.ts
var NativeTokenStreamingEnforcer_exports = {};
__export(NativeTokenStreamingEnforcer_exports, {
  read: () => read_exports5
});

// src/DelegationFramework/NativeTokenStreamingEnforcer/read.ts
var read_exports5 = {};
__export(read_exports5, {
  getAvailableAmount: () => read5
});

// src/DelegationFramework/NativeTokenStreamingEnforcer/methods/getAvailableAmount.ts
import { NativeTokenStreamingEnforcer } from "@metamask/delegation-abis";
import { readContract as readContract5, getBlock as getBlock2 } from "viem/actions";
var read5 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash,
  terms
}) => {
  const currentBlock = await getBlock2(client);
  const currentTimestamp = currentBlock.timestamp;
  const allowanceState = await readContract5(client, {
    address: contractAddress,
    abi: NativeTokenStreamingEnforcer.abi,
    functionName: "streamingAllowances",
    args: [delegationManager, delegationHash]
  });
  const [initialAmount, maxAmount, amountPerSecond, startTime, spent] = allowanceState;
  if (startTime !== 0n) {
    const availableAmount2 = getAvailableAmount2({
      initialAmount,
      maxAmount,
      amountPerSecond,
      startTime,
      spent,
      currentTimestamp
    });
    return {
      availableAmount: availableAmount2
    };
  }
  const decodedTerms = await readContract5(client, {
    address: contractAddress,
    abi: NativeTokenStreamingEnforcer.abi,
    functionName: "getTermsInfo",
    args: [terms]
  });
  const [
    decodedInitialAmount,
    decodedMaxAmount,
    decodedAmountPerSecond,
    decodedStartTime
  ] = decodedTerms;
  const availableAmount = getAvailableAmount2({
    initialAmount: decodedInitialAmount,
    maxAmount: decodedMaxAmount,
    amountPerSecond: decodedAmountPerSecond,
    startTime: decodedStartTime,
    spent: 0n,
    currentTimestamp
  });
  return {
    availableAmount
  };
};
function getAvailableAmount2(allowance) {
  if (allowance.currentTimestamp < allowance.startTime) {
    return 0n;
  }
  const elapsed = allowance.currentTimestamp - allowance.startTime;
  let unlocked = allowance.initialAmount + allowance.amountPerSecond * elapsed;
  if (unlocked > allowance.maxAmount) {
    unlocked = allowance.maxAmount;
  }
  if (allowance.spent >= unlocked) {
    return 0n;
  }
  return unlocked - allowance.spent;
}

export {
  read_exports,
  ERC20PeriodTransferEnforcer_exports,
  read_exports2,
  ERC20StreamingEnforcer_exports,
  read_exports3,
  MultiTokenPeriodEnforcer_exports,
  read_exports4,
  NativeTokenPeriodTransferEnforcer_exports,
  read_exports5,
  NativeTokenStreamingEnforcer_exports
};
//# sourceMappingURL=chunk-F5U55BIP.mjs.map