"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embed = void 0;
const embed = (infApi) => {
    return async (model, inputs, params) => {
        const typedAndFormattedInputs = inputs.map((str) => {
            return { text: str };
        });
        if (params && params.inputType) {
            // Rename `inputType` to `input_type`
            params.input_type = params.inputType;
            delete params.inputType;
        }
        const typedRequest = {
            embedRequest: {
                model: model,
                inputs: typedAndFormattedInputs,
                parameters: params,
            },
        };
        return await infApi.embed(typedRequest);
    };
};
exports.embed = embed;
//# sourceMappingURL=embed.js.map