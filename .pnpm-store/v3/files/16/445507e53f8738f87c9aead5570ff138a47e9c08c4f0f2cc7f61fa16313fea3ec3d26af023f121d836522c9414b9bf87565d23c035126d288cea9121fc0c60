import { DIDResolver } from 'did-resolver';
interface Options {
    url: string;
}
/**
 * @deprecated please use `getUniresolver(url)` or `getUniresolverFor(methods, url)` instead
 *
 * @internal
 */
export declare class UniversalResolver {
    constructor(options: Options);
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
export declare function getUniversalResolver(url?: string): DIDResolver;
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
export declare function getUniversalResolverFor(methods: string[], url?: string): Record<string, DIDResolver>;
export {};
//# sourceMappingURL=universal-resolver.d.ts.map