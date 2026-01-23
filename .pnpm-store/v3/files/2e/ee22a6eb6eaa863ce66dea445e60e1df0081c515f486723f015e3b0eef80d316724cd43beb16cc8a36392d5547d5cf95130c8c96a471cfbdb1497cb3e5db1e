"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNearAddress = void 0;
const nearAddressRegex = /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/;
const validateNearAddress = (address) => {
    if (address.length < 2 || address.length > 64)
        return false;
    if (!nearAddressRegex.test(address))
        return false;
    return true;
};
exports.validateNearAddress = validateNearAddress;
//# sourceMappingURL=near.js.map