"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/executions.ts



var _viem = require('viem');
var createExecution = ({
  target,
  value = 0n,
  callData = "0x"
}) => ({
  target,
  value,
  callData
});
var ExecutionMode = /* @__PURE__ */ ((ExecutionMode2) => {
  ExecutionMode2["SingleDefault"] = "0x0000000000000000000000000000000000000000000000000000000000000000";
  ExecutionMode2["SingleTry"] = "0x0001000000000000000000000000000000000000000000000000000000000000";
  ExecutionMode2["BatchDefault"] = "0x0100000000000000000000000000000000000000000000000000000000000000";
  ExecutionMode2["BatchTry"] = "0x0101000000000000000000000000000000000000000000000000000000000000";
  return ExecutionMode2;
})(ExecutionMode || {});
var EXECUTION_ABI_TYPE_COMPONENTS = [
  { type: "address", name: "target" },
  { type: "uint256", name: "value" },
  { type: "bytes", name: "callData" }
];
var encodeSingleExecution = (execution) => {
  return _viem.encodePacked.call(void 0, 
    ["address", "uint256", "bytes"],
    [execution.target, execution.value, execution.callData]
  );
};
var encodeBatchExecution = (executions) => {
  return _viem.encodeAbiParameters.call(void 0, 
    [
      {
        components: EXECUTION_ABI_TYPE_COMPONENTS,
        name: "executions",
        type: "tuple[]"
      }
    ],
    [executions]
  );
};
var encodeExecutionCalldata = (executions) => {
  if (executions.length === 0) {
    throw new Error(
      "Error while getting the execution calldatas, executions is empty"
    );
  }
  if (executions.length === 1) {
    const execution = executions[0];
    if (!execution) {
      throw new Error("Execution not found");
    }
    return encodeSingleExecution(execution);
  }
  return encodeBatchExecution(executions);
};
var encodeExecutionCalldatas = (executionsBatch) => {
  if (executionsBatch.length === 0) {
    throw new Error(
      "Error while getting the execution calldatas, executionsBatch is empty"
    );
  }
  return executionsBatch.map(encodeExecutionCalldata);
};








exports.createExecution = createExecution; exports.ExecutionMode = ExecutionMode; exports.encodeSingleExecution = encodeSingleExecution; exports.encodeBatchExecution = encodeBatchExecution; exports.encodeExecutionCalldata = encodeExecutionCalldata; exports.encodeExecutionCalldatas = encodeExecutionCalldatas;
//# sourceMappingURL=chunk-T6PSFUOZ.cjs.map