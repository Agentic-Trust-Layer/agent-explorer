/**
 * @typedef {{
 *   sign (data: Uint8Array): Promise<Uint8Array>
 * }} SigningKey
 *
 * @typedef {{
 *   endpoint: URL
 *   rateLimiter?: function
 * }} PublicService
 */
/**
 * Proxy the old `publish` function arguments through to the new version.
 *
 * @param {import('./lib/interface.js').Service} service
 * @param {w3name.Revision} revision Revision of record to publish.
 * @param {SigningKey} key Private key to sign the record with.
 */
export function publish(service: import('./lib/interface.js').Service, revision: w3name.Revision, key: SigningKey): Promise<void>;
/**
 * Proxy the old function arguments to the new version.
 * @param {PublicService} service
 * @param {w3name.Name} name The name to resolve.
 */
export function resolve(service: PublicService, name: w3name.Name): Promise<w3name.Revision>;
export const Name: typeof w3name.Name;
export const WritableName: typeof w3name.WritableName;
export const create: typeof w3name.create;
export const parse: typeof w3name.parse;
export const from: typeof w3name.from;
export const v0: typeof w3name.v0;
export const increment: typeof w3name.increment;
export const Revision: typeof w3name.Revision;
export type SigningKey = {
    sign(data: Uint8Array): Promise<Uint8Array>;
};
export type PublicService = {
    endpoint: URL;
    rateLimiter?: Function;
};
import * as w3name from "w3name";
//# sourceMappingURL=name.d.ts.map