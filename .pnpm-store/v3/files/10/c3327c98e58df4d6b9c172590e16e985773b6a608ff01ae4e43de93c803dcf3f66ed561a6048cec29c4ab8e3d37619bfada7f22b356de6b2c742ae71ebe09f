import { coinTypeMap } from "./consts/coinTypeMap.js";
export const getCoderByCoinNameAsync = async (name) => {
    const mod = await import(`./coin/${name}`);
    if (!mod) {
        throw new Error(`Unsupported coin: ${name}`);
    }
    return mod[name];
};
export const getCoderByCoinTypeAsync = async (coinType) => {
    const name = coinTypeMap[String(coinType)];
    if (!name) {
        throw new Error(`Unsupported coin type: ${coinType}`);
    }
    const mod = await import(`./coin/${name}`);
    if (!mod) {
        throw new Error(`Unsupported coin: ${name}`);
    }
    return mod[name];
};
//# sourceMappingURL=async.js.map