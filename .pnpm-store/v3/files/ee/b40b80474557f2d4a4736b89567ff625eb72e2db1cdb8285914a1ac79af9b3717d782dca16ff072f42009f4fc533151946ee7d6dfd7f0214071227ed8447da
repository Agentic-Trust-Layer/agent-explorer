"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNamespaces = void 0;
const listNamespaces = (apiProvider) => {
    return async (limit, paginationToken) => {
        const api = await apiProvider.provide();
        return await api.listNamespacesOperation({ limit, paginationToken });
    };
};
exports.listNamespaces = listNamespaces;
//# sourceMappingURL=listNamespaces.js.map