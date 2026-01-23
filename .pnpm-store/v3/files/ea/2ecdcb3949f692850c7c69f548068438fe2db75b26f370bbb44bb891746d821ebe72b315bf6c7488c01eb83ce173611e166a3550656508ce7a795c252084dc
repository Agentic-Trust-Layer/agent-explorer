"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const universalResolver_js_1 = require("../../contracts/universalResolver.js");
const checkSafeUniversalResolverData_js_1 = require("../../utils/checkSafeUniversalResolverData.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const normalise_js_1 = require("../../utils/normalise.js");
const encode = (client, { address, gatewayUrls }) => {
    const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
    const to = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [(0, viem_1.toHex)((0, hexEncodedName_js_1.packetToBytes)(reverseNode))];
    return {
        to,
        ...(gatewayUrls?.length
            ? {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverReverseWithGatewaysSnippet,
                    functionName: 'reverse',
                    args: [...args, gatewayUrls],
                }),
                passthrough: {
                    args: [...args, gatewayUrls],
                    address: to,
                },
            }
            : {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_js_1.universalResolverReverseSnippet,
                    functionName: 'reverse',
                    args,
                }),
                passthrough: {
                    args,
                    address: to,
                },
            }),
    };
};
const decode = async (_client, data, passthrough, { address, allowMismatch, strict, gatewayUrls }) => {
    const isSafe = (0, checkSafeUniversalResolverData_js_1.checkSafeUniversalResolverData)(data, {
        strict,
        abi: gatewayUrls
            ? universalResolver_js_1.universalResolverReverseWithGatewaysSnippet
            : universalResolver_js_1.universalResolverReverseSnippet,
        args: passthrough.args,
        functionName: 'reverse',
        address: passthrough.address,
    });
    if (!isSafe)
        return null;
    try {
        const [unnormalisedName, forwardResolvedAddress, reverseResolverAddress, resolverAddress,] = (0, viem_1.decodeFunctionResult)({
            abi: universalResolver_js_1.universalResolverReverseSnippet,
            functionName: 'reverse',
            data,
        });
        if (!unnormalisedName)
            return null;
        const match = (0, viem_1.getAddress)(forwardResolvedAddress) === (0, viem_1.getAddress)(address);
        if (!match && !allowMismatch)
            return null;
        const normalisedName = (0, normalise_js_1.normalise)(unnormalisedName);
        return {
            name: normalisedName,
            match,
            reverseResolverAddress,
            resolverAddress,
        };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const getName = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getName;
//# sourceMappingURL=getName.js.map