import { schema } from './plugin.schema.js';
import Debug from 'debug';
const debug = Debug('veramo:did-discovery');
/**
 * This class adds support for discovering DIDs.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class DIDDiscovery {
    methods;
    schema = schema.IDIDDiscovery;
    providers;
    constructor(options) {
        this.providers = options.providers;
        this.methods = {
            discoverDid: this.discoverDid.bind(this),
        };
    }
    /**
     * Queries data providers and returns DIDs with metadata
     *
     * @param args - The param object with the properties necessary to discover DID
     * @param context - *RESERVED* This is filled by the framework when the method is called.
     *
     */
    async discoverDid(args, context) {
        const results = [];
        const errors = {};
        for (const provider of this.providers) {
            try {
                const providerResult = await provider.discoverDid(args, context);
                if (providerResult.matches.length > 0) {
                    results.push(providerResult);
                }
            }
            catch (e) {
                errors[provider.name] = e?.message;
                debug(`Error ${provider}: ${e?.message}`);
            }
        }
        const result = {
            ...args,
            results,
        };
        if (errors) {
            result['errors'] = errors;
        }
        return result;
    }
}
//# sourceMappingURL=action-handler.js.map