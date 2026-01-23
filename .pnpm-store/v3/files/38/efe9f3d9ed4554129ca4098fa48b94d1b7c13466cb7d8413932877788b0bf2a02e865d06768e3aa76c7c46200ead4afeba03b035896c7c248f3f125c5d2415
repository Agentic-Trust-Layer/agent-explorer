/**
 * A DID discovery provider that can filter DIDs by the `alias` used internally in
 * {@link @veramo/did-manager#DIDManager | DIDManager}
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export class AliasDiscoveryProvider {
    name = 'alias';
    async discoverDid(args, context) {
        const matches = [];
        try {
            const identifier = await context.agent.didManagerGetByAlias({ alias: args.query });
            const match = {
                did: identifier.did,
                metaData: {
                    alias: identifier.alias,
                },
            };
            matches.push(match);
        }
        catch (e) {
        }
        return {
            provider: this.name,
            matches,
        };
    }
}
//# sourceMappingURL=did-discovery-provider.js.map