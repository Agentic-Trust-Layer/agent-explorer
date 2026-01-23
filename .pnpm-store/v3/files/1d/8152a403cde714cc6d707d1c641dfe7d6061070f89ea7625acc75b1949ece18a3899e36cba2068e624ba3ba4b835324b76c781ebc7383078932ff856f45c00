import * as formats from "./coins.js";
import { coinTypeMap } from "./consts/coinTypeMap.js";
export const getCoderByCoinName = (name) => {
    const format = formats[name];
    if (!format) {
        throw new Error(`Unsupported coin: ${name}`);
    }
    return format;
};
export const getCoderByCoinType = (coinType) => {
    const name = coinTypeMap[String(coinType)];
    if (!name) {
        throw new Error(`Unsupported coin type: ${coinType}`);
    }
    const format = formats[name];
    if (!format) {
        throw new Error(`Unsupported coin type: ${coinType}`);
    }
    return format;
};
//# sourceMappingURL=index.js.map