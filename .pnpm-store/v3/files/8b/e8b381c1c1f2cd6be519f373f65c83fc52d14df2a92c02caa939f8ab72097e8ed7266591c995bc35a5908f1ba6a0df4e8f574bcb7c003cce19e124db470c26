import { IIdentifier } from '@veramo/core-types';
import { AbstractDIDStore } from './abstract-identifier-store.js';
/**
 * An implementation of {@link AbstractDIDStore} that stores everything in memory.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare class MemoryDIDStore extends AbstractDIDStore {
    private identifiers;
    getDID({ did, alias, provider, }: {
        did: string;
        alias: string;
        provider: string;
    }): Promise<IIdentifier>;
    deleteDID({ did }: {
        did: string;
    }): Promise<boolean>;
    importDID(args: IIdentifier): Promise<boolean>;
    listDIDs(args: {
        alias?: string;
        provider?: string;
    }): Promise<IIdentifier[]>;
}
//# sourceMappingURL=memory-did-store.d.ts.map