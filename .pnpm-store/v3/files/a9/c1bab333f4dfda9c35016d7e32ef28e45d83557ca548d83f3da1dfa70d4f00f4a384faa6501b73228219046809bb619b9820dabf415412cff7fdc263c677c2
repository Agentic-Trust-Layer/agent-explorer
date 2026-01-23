"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthTypesFromInputDocEthers = exports.getEthTypesFromInputDoc = void 0;
var json_canonicalize_1 = require("json-canonicalize");
function getEthTypesFromInputDoc(input, primaryType) {
    if (primaryType === void 0) { primaryType = "Document"; }
    var res = getEthTypesFromInputDocHelper(input, primaryType);
    if (!res.has("Proof")) {
        throw new Error("No proof was found on input document");
    }
    var obj = Object.fromEntries(res);
    obj = __assign({ "EIP712Domain": [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
        ] }, obj);
    return obj;
}
exports.getEthTypesFromInputDoc = getEthTypesFromInputDoc;
function getEthTypesFromInputDocEthers(input, primaryType) {
    if (primaryType === void 0) { primaryType = "Document"; }
    var res = getEthTypesFromInputDocHelper(input, primaryType);
    if (!res.has("Proof")) {
        throw new Error("No proof was found on input document");
    }
    return Object.fromEntries(res);
}
exports.getEthTypesFromInputDocEthers = getEthTypesFromInputDocEthers;
// Given an Input Document, generate Types according to type generation algorithm specified in EIP-712 spec:
// https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/#ref-for-dfn-types-generation-algorithm-2
function getEthTypesFromInputDocHelper(input, primaryType) {
    var output = new Map();
    var types = new Array();
    var canonicalizedInput = JSON.parse((0, json_canonicalize_1.canonicalize)(input));
    for (var property in canonicalizedInput) {
        var val = canonicalizedInput[property];
        var type = typeof val;
        if (type === "boolean") {
            types.push({ name: property, type: "bool" });
        }
        else if (type === "number" || type === "bigint") {
            types.push({ name: property, type: "uint256" });
        }
        else if (type === "string") {
            types.push({ name: property, type: "string" });
        }
        else if (type === "object") {
            if (Array.isArray(val)) {
                if (val.length === 0) {
                    throw new Error("Array with length 0 found");
                }
                else {
                    var arrayFirstType = typeof val[0];
                    if (arrayFirstType === "boolean" || arrayFirstType === "number" || arrayFirstType === "string") {
                        for (var arrayEntry in val) {
                            if (typeof arrayEntry !== arrayFirstType) {
                                throw new Error("Array with different types found");
                            }
                        }
                        if (arrayFirstType === "boolean") {
                            types.push({ name: property, type: "bool[]" });
                        }
                        else if (arrayFirstType === "number") {
                            types.push({ name: property, type: "number[]" });
                        }
                        else if (arrayFirstType === "string") {
                            types.push({ name: property, type: "string[]" });
                        }
                    }
                    else {
                        throw new Error("Array with elements of unknown type found");
                    }
                }
            }
            else {
                var recursiveOutput = getEthTypesFromInputDocHelper(val, primaryType);
                var recursiveTypes = recursiveOutput.get(primaryType);
                var propertyType = property.charAt(0).toUpperCase() + property.substring(1);
                types.push({ name: property, type: propertyType });
                output.set(propertyType, recursiveTypes);
                for (var key in recursiveOutput) {
                    if (key !== primaryType) {
                        output.set(key, recursiveOutput.get(key));
                    }
                }
            }
        }
        else {
            throw new Error("Bad Type Found in Input Document");
        }
    }
    output.set(primaryType, types);
    return output;
}
//# sourceMappingURL=getEthTypesFromInputDoc.js.map