// src/executions.ts
import {
  encodeAbiParameters,
  encodePacked
} from "viem";
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
  return encodePacked(
    ["address", "uint256", "bytes"],
    [execution.target, execution.value, execution.callData]
  );
};
var encodeBatchExecution = (executions) => {
  return encodeAbiParameters(
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

export {
  createExecution,
  ExecutionMode,
  encodeSingleExecution,
  encodeBatchExecution,
  encodeExecutionCalldata,
  encodeExecutionCalldatas
};
//# sourceMappingURL=chunk-CPLIK3VF.mjs.map