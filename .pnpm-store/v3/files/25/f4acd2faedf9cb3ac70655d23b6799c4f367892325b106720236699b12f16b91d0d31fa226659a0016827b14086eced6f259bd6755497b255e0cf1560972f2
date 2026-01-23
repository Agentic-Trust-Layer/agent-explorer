"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBackup = void 0;
const createBackup = (api) => {
    return async (createBackupOptions) => {
        if (!createBackupOptions.indexName) {
            throw new Error('You must pass a non-empty string for `indexName` in order to create a backup');
        }
        return await api.createBackup({
            indexName: createBackupOptions.indexName,
            createBackupRequest: {
                name: createBackupOptions.name,
                description: createBackupOptions.description,
            },
        });
    };
};
exports.createBackup = createBackup;
//# sourceMappingURL=createBackup.js.map