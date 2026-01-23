"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeBackup = void 0;
const errors_1 = require("../errors");
const describeBackup = (api) => {
    return async (backupId) => {
        if (!backupId) {
            throw new errors_1.PineconeArgumentError('You must pass a non-empty string for `backupId` in order to describe a backup');
        }
        return await api.describeBackup({ backupId: backupId });
    };
};
exports.describeBackup = describeBackup;
//# sourceMappingURL=describeBackup.js.map