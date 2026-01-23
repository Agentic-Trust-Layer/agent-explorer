"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoderByCoinTypeAsync = exports.getCoderByCoinNameAsync = void 0;
const coinTypeMap_js_1 = require("./consts/coinTypeMap.js");
const getCoderByCoinNameAsync = async (name) => {
    const mod = await Promise.resolve(`${`./coin/${name}`}`).then(s => require(s));
    if (!mod) {
        throw new Error(`Unsupported coin: ${name}`);
    }
    return mod[name];
};
exports.getCoderByCoinNameAsync = getCoderByCoinNameAsync;
const getCoderByCoinTypeAsync = async (coinType) => {
    const name = coinTypeMap_js_1.coinTypeMap[String(coinType)];
    if (!name) {
        throw new Error(`Unsupported coin type: ${coinType}`);
    }
    const mod = await Promise.resolve(`${`./coin/${name}`}`).then(s => require(s));
    if (!mod) {
        throw new Error(`Unsupported coin: ${name}`);
    }
    return mod[name];
};
exports.getCoderByCoinTypeAsync = getCoderByCoinTypeAsync;
//# sourceMappingURL=async.js.map