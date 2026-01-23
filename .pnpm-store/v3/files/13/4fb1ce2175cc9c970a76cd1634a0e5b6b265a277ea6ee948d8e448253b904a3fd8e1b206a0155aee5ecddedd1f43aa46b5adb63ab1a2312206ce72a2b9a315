"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = void 0;
const errors_1 = require("../errors");
const getModel = (infApi) => {
    return async (modelName) => {
        if (!modelName) {
            throw new errors_1.PineconeArgumentError('You must pass a non-empty string for `modelName` in order to get a model');
        }
        return await infApi.getModel({ modelName });
    };
};
exports.getModel = getModel;
//# sourceMappingURL=getModel.js.map