"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoderByCoinType = exports.getCoderByCoinName = void 0;
const formats = require("./coins.js");
const coinTypeMap_js_1 = require("./consts/coinTypeMap.js");
const getCoderByCoinName = (name) => {
    const format = formats[name];
    if (!format) {
        throw new Error(`Unsupported coin: ${name}`);
    }
    return format;
};
exports.getCoderByCoinName = getCoderByCoinName;
const getCoderByCoinType = (coinType) => {
    const name = coinTypeMap_js_1.coinTypeMap[String(coinType)];
    if (!name) {
        throw new Error(`Unsupported coin type: ${coinType}`);
    }
    const format = formats[name];
    if (!format) {
        throw new Error(`Unsupported coin type: ${coinType}`);
    }
    return format;
};
exports.getCoderByCoinType = getCoderByCoinType;
//# sourceMappingURL=index.js.map