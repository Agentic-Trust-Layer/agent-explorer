import fetch from 'cross-fetch';
/**
 * @deprecated please use `getUniresolver(url)` or `getUniresolverFor(methods, url)` instead
 *
 * @internal
 */
export class UniversalResolver {
    constructor(options) {
        return getUniversalResolver(options.url);
    }
}
/**
 * Creates a DIDResolver instance that can be used with `did-resolver`
 *
 * @example
 * ```typescript
 * const uniResolver = getUniversalResolver()
 * const resolver = new Resolver({
 *   web: uniResolver,
 *   key: uniResolver,
 *   elem: uniResolver
 * })
 * ```
 *
 * @param url - the URL for the universal resolver instance (See https://uniresolver.io )
 * @returns `DIDResolver`
 *
 * @public
 */
export function getUniversalResolver(url = 'https://dev.uniresolver.io/1.0/identifiers/') {
    if (!url) {
        throw Error('[did-resolver] Universal: url required');
    }
    const resolve = async (didUrl) => {
        try {
            const headers = { 'Accept': 'application/ld+json;profile="https://w3id.org/did-resolution"' };
            const result = await fetch(url + didUrl, { headers });
            const ddo = await result.json();
            return ddo;
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    return resolve;
}
/**
 * Creates a mapping of DID methods to a DIDResolver instance that can be used with `did-resolver`
 *
 * @example
 * ```typescript
 * const uniResolver = getUniversalResolverFor(['web', 'key', 'elem'])
 * const resolver = new Resolver({
 *   ...uniResolver,
 *   // other resolvers
 * })
 * ```
 *
 * @param methods - an array of DID methods that should be resolved by this universal resolver
 * @param url - the URL for the universal resolver instance (See https://uniresolver.io )
 * @returns `Record<string, DIDResolver>` a mapping of the given methods to an instance of `DIDResolver`
 *
 * @public
 */
export function getUniversalResolverFor(methods, url = 'https://dev.uniresolver.io/1.0/identifiers/') {
    const uniResolver = getUniversalResolver(url);
    const mapping = {};
    for (const method of methods) {
        mapping[method] = uniResolver;
    }
    return mapping;
}
//# sourceMappingURL=universal-resolver.js.map