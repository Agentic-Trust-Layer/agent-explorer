"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkHJETDDBNcjs = require('./chunk-HJETDDBN.cjs');

// src/DelegationFramework/ERC20PeriodTransferEnforcer/index.ts
var ERC20PeriodTransferEnforcer_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, ERC20PeriodTransferEnforcer_exports, {
  read: () => read_exports
});

// src/DelegationFramework/ERC20PeriodTransferEnforcer/read.ts
var read_exports = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports, {
  getAvailableAmount: () => read
});

// src/DelegationFramework/ERC20PeriodTransferEnforcer/methods/getAvailableAmount.ts
var _delegationabis = require('@metamask/delegation-abis');
var _actions = require('viem/actions');
var read = async ({
  client,
  contractAddress,
  delegationHash,
  delegationManager,
  terms
}) => {
  const [availableAmount, isNewPeriod, currentPeriod] = await _actions.readContract.call(void 0, 
    client,
    {
      address: contractAddress,
      abi: _delegationabis.ERC20PeriodTransferEnforcer.abi,
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
_chunkHJETDDBNcjs.__export.call(void 0, ERC20StreamingEnforcer_exports, {
  read: () => read_exports2
});

// src/DelegationFramework/ERC20StreamingEnforcer/read.ts
var read_exports2 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports2, {
  getAvailableAmount: () => read2
});

// src/DelegationFramework/ERC20StreamingEnforcer/methods/getAvailableAmount.ts


var read2 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash,
  terms
}) => {
  const currentBlock = await _actions.getBlock.call(void 0, client);
  const currentTimestamp = currentBlock.timestamp;
  const allowanceState = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.ERC20StreamingEnforcer.abi,
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
  const decodedTerms = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.ERC20StreamingEnforcer.abi,
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
_chunkHJETDDBNcjs.__export.call(void 0, MultiTokenPeriodEnforcer_exports, {
  read: () => read_exports3
});

// src/DelegationFramework/MultiTokenPeriodEnforcer/read.ts
var read_exports3 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports3, {
  getAvailableAmount: () => read3
});

// src/DelegationFramework/MultiTokenPeriodEnforcer/methods/getAvailableAmount.ts


var read3 = async ({
  client,
  contractAddress,
  delegationHash,
  delegationManager,
  terms,
  args
}) => {
  const [availableAmount, isNewPeriod, currentPeriod] = await _actions.readContract.call(void 0, 
    client,
    {
      address: contractAddress,
      abi: _delegationabis.MultiTokenPeriodEnforcer.abi,
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
_chunkHJETDDBNcjs.__export.call(void 0, NativeTokenPeriodTransferEnforcer_exports, {
  read: () => read_exports4
});

// src/DelegationFramework/NativeTokenPeriodTransferEnforcer/read.ts
var read_exports4 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports4, {
  getAvailableAmount: () => read4
});

// src/DelegationFramework/NativeTokenPeriodTransferEnforcer/methods/getAvailableAmount.ts


var read4 = async ({
  client,
  contractAddress,
  delegationHash,
  delegationManager,
  terms
}) => {
  const [availableAmount, isNewPeriod, currentPeriod] = await _actions.readContract.call(void 0, 
    client,
    {
      address: contractAddress,
      abi: _delegationabis.NativeTokenPeriodTransferEnforcer.abi,
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
_chunkHJETDDBNcjs.__export.call(void 0, NativeTokenStreamingEnforcer_exports, {
  read: () => read_exports5
});

// src/DelegationFramework/NativeTokenStreamingEnforcer/read.ts
var read_exports5 = {};
_chunkHJETDDBNcjs.__export.call(void 0, read_exports5, {
  getAvailableAmount: () => read5
});

// src/DelegationFramework/NativeTokenStreamingEnforcer/methods/getAvailableAmount.ts


var read5 = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash,
  terms
}) => {
  const currentBlock = await _actions.getBlock.call(void 0, client);
  const currentTimestamp = currentBlock.timestamp;
  const allowanceState = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.NativeTokenStreamingEnforcer.abi,
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
  const decodedTerms = await _actions.readContract.call(void 0, client, {
    address: contractAddress,
    abi: _delegationabis.NativeTokenStreamingEnforcer.abi,
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












exports.read_exports = read_exports; exports.ERC20PeriodTransferEnforcer_exports = ERC20PeriodTransferEnforcer_exports; exports.read_exports2 = read_exports2; exports.ERC20StreamingEnforcer_exports = ERC20StreamingEnforcer_exports; exports.read_exports3 = read_exports3; exports.MultiTokenPeriodEnforcer_exports = MultiTokenPeriodEnforcer_exports; exports.read_exports4 = read_exports4; exports.NativeTokenPeriodTransferEnforcer_exports = NativeTokenPeriodTransferEnforcer_exports; exports.read_exports5 = read_exports5; exports.NativeTokenStreamingEnforcer_exports = NativeTokenStreamingEnforcer_exports;
//# sourceMappingURL=chunk-4QBJFYZ7.cjs.map