"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDecoder = logDecoder;
const helpers_js_1 = require("./helpers.js");
function populateEventMetaClass(logResult, blockNumber) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = {};
    if (logResult.fragment.inputs.length !== logResult.args.length) {
        throw new TypeError('malformed event input. wrong number of arguments');
    }
    logResult.fragment.inputs.forEach((input, index) => {
        let val = logResult.args[index];
        if (typeof val === 'object') {
            val = BigInt(val);
        }
        if (input.type === 'bytes32') {
            val = (0, helpers_js_1.bytes32toString)(val);
        }
        result[input.name] = val;
    });
    result._eventName = logResult.name;
    result.blockNumber = blockNumber;
    return result;
}
function logDecoder(contract, logs) {
    return logs
        .map((log) => {
        const res = contract.interface.parseLog({ topics: [...log.topics], data: log.data });
        if (!res)
            return null;
        return populateEventMetaClass(res, log.blockNumber);
    })
        .filter(helpers_js_1.isDefined);
}
//# sourceMappingURL=logParser.js.map