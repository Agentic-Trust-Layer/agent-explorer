import { BlockTag } from 'ethers';
import { ConfigurationOptions } from './configuration.js';
import { DIDDocument, DIDResolutionOptions, DIDResolutionResult, DIDResolver, ParsedDID, Resolvable } from 'did-resolver';
import { ERC1056Event } from './helpers.js';
export declare function getResolver(options: ConfigurationOptions): Record<string, DIDResolver>;
export declare class EthrDidResolver {
    private contracts;
    constructor(options: ConfigurationOptions);
    /**
     * Returns the block number with the previous change to a particular address (DID)
     *
     * @param address - the address (DID) to check for changes
     * @param networkId - the EVM network to check
     * @param blockTag - the block tag to use for the query (default: 'latest')
     */
    previousChange(address: string, networkId: string, blockTag?: BlockTag): Promise<bigint>;
    getBlockMetadata(blockHeight: number, networkId: string): Promise<{
        height: string;
        isoDate: string;
    }>;
    changeLog(identity: string, networkId: string, blockTag?: BlockTag): Promise<{
        address: string;
        history: ERC1056Event[];
        controllerKey?: string;
        chainId: bigint;
    }>;
    wrapDidDocument(did: string, address: string, controllerKey: string | undefined, history: ERC1056Event[], chainId: bigint, blockHeight: string | number, now: bigint): {
        didDocument: DIDDocument;
        deactivated: boolean;
        versionId: number;
        nextVersionId: number;
    };
    resolve(did: string, parsed: ParsedDID, _unused: Resolvable, options: DIDResolutionOptions): Promise<DIDResolutionResult>;
    build(): Record<string, DIDResolver>;
}
//# sourceMappingURL=resolver.d.ts.map