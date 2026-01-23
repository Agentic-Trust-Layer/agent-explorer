"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBackups = void 0;
const listBackups = (api) => {
    return async (listBackupOptions = {}) => {
        const { indexName, ...rest } = listBackupOptions;
        if (!indexName) {
            return await api.listProjectBackups({
                ...rest,
            });
        }
        else {
            return await api.listIndexBackups({ indexName, ...rest });
        }
    };
};
exports.listBackups = listBackups;
//# sourceMappingURL=listBackups.js.map