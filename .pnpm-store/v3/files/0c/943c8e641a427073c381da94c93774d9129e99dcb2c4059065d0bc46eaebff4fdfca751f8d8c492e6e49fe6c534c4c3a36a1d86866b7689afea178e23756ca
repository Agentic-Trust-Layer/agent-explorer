"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNamespace = void 0;
const deleteNamespace = (apiProvider) => {
    return async (namespace) => {
        const api = await apiProvider.provide();
        await api.deleteNamespace({ namespace });
        return;
    };
};
exports.deleteNamespace = deleteNamespace;
//# sourceMappingURL=deleteNamespace.js.map