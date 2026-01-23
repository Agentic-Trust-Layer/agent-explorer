/** @typedef { import('./lib/interface.js').API } API */
/** @typedef { import('./lib/interface.js').Status} Status */
/** @typedef { import('./lib/interface.js').Upload} Upload */
/** @typedef { import('./lib/interface.js').Deal} Deal */
/** @typedef { import('./lib/interface.js').Pin} Pin */
/** @typedef { import('./lib/interface.js').Service } Service */
/** @typedef { import('./lib/interface.js').Web3File} Web3File */
/** @typedef { import('./lib/interface.js').Filelike } Filelike */
/** @typedef { import('./lib/interface.js').CIDString} CIDString */
/** @typedef { import('./lib/interface.js').RequestOptions} RequestOptions */
/** @typedef { import('./lib/interface.js').PutOptions} PutOptions */
/** @typedef { import('./lib/interface.js').PutCarOptions} PutCarOptions */
/** @typedef { import('./lib/interface.js').ListOptions} ListOptions */
/** @typedef { import('./lib/interface.js').RateLimiter } RateLimiter */
/** @typedef { import('./lib/interface.js').UnixFSEntry} UnixFSEntry */
/** @typedef { import('./lib/interface.js').Web3Response} Web3Response */
/**
 * Creates a rate limiter which limits at the same rate as is enforced
 * server-side, to allow the client to avoid exceeding the requests limit and
 * being blocked for 30 seconds.
 * @returns {RateLimiter}
 */
export function createRateLimiter(): RateLimiter;
export type API = import('./lib/interface.js').API;
export type Status = import('./lib/interface.js').Status;
export type Upload = import('./lib/interface.js').Upload;
export type Deal = import('./lib/interface.js').Deal;
export type Pin = import('./lib/interface.js').Pin;
export type Service = import('./lib/interface.js').Service;
export type Web3File = import('./lib/interface.js').Web3File;
export type Filelike = import('./lib/interface.js').Filelike;
export type CIDString = import('./lib/interface.js').CIDString;
export type RequestOptions = import('./lib/interface.js').RequestOptions;
export type PutOptions = import('./lib/interface.js').PutOptions;
export type PutCarOptions = import('./lib/interface.js').PutCarOptions;
export type ListOptions = import('./lib/interface.js').ListOptions;
export type RateLimiter = import('./lib/interface.js').RateLimiter;
export type UnixFSEntry = import('./lib/interface.js').UnixFSEntry;
export type Web3Response = import('./lib/interface.js').Web3Response;
/**
 * @implements Service
 */
export class Web3Storage implements Service {
    /**
     * @hidden
     * @param {string} token
     * @returns {Record<string, string>}
     */
    static headers(token: string): Record<string, string>;
    /**
     * @param {Service} service
     * @param {Iterable<Filelike>} files
     * @param {PutOptions} [options]
     * @returns {Promise<CIDString>}
     */
    static put({ endpoint, token, rateLimiter, fetch }: Service, files: Iterable<Filelike>, { onRootCidReady, onStoredChunk, maxRetries, maxChunkSize, wrapWithDirectory, name, signal }?: import("./lib/interface.js").PutOptions | undefined): Promise<CIDString>;
    /**
     * @param {Service} service
     * @param {import('@ipld/car/api').CarReader} car
     * @param {PutCarOptions} [options]
     * @returns {Promise<CIDString>}
     */
    static putCar({ endpoint, token, rateLimiter, fetch }: Service, car: import('@ipld/car/api').CarReader, { name, onStoredChunk, maxRetries, maxChunkSize, decoders, signal }?: import("./lib/interface.js").PutCarOptions | undefined): Promise<CIDString>;
    /**
     * @param {Service} service
     * @param {CIDString} cid
     * @param {RequestOptions} [options]
     * @returns {Promise<Web3Response | null>}
     */
    static get({ endpoint, token, rateLimiter, fetch }: Service, cid: CIDString, options?: import("./lib/interface.js").RequestOptions | undefined): Promise<Web3Response | null>;
    /**
     * @param {Service} service
     * @param {CIDString} cid
     * @param {RequestOptions} [options]
     * @returns {Promise<CIDString>}
     */
    static delete({ endpoint, token, rateLimiter }: Service, cid: CIDString, options?: import("./lib/interface.js").RequestOptions | undefined): Promise<CIDString>;
    /**
     * @param {Service} service
     * @param {CIDString} cid
     * @param {RequestOptions} [options]
     * @returns {Promise<Status | undefined>}
     */
    static status({ endpoint, token, rateLimiter, fetch }: Service, cid: CIDString, options?: import("./lib/interface.js").RequestOptions | undefined): Promise<Status | undefined>;
    /**
     * @param {Service} service
     * @param {ListOptions} [opts]
     * @returns {AsyncIterable<Upload>}
     */
    static list(service: Service, { before, maxResults, signal }?: import("./lib/interface.js").ListOptions | undefined): AsyncIterable<Upload>;
    /**
     * Constructs a client bound to the given `options.token` and
     * `options.endpoint`.
     *
     * @example
     * ```js
     * import { Web3Storage } from 'web3.storage'
     * const client = new Web3Storage({ token: API_TOKEN })
     * ```
     *
      @param {Service} options
     */
    constructor({ token, endpoint, rateLimiter, fetch }: Service);
    /**
     * Authorization token.
     *
     * @readonly
     */
    readonly token: string;
    /**
     * Service API endpoint `URL`.
     * @readonly
     */
    readonly endpoint: URL;
    /**
     * @readonly
     */
    readonly rateLimiter: import("./lib/interface.js").RateLimiter;
    /**
     * Optional custom fetch function. Defaults to global fetch in browsers or @web-std/fetch on node.
     * @readonly
     */
    readonly fetch: typeof fetch;
    /**
     * Uploads files to web3.storage. Files are hashed in the client and uploaded as a single
     * [Content Addressed Archive(CAR)](https://github.com/ipld/specs/blob/master/block-layer/content-addressable-archives.md).
     * Takes a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob)
     *
     * Returns the corresponding Content Identifier (CID).
     *
     * @example
     * ```js
     * const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' })
     * const cid = await client.put([file])
     * ```
     * @param {Iterable<Filelike>} files
     * @param {PutOptions} [options]
     */
    put(files: Iterable<Filelike>, options?: import("./lib/interface.js").PutOptions | undefined): Promise<import("./lib/interface.js").CIDString>;
    /**
     * Uploads a CAR ([Content Addressed Archive](https://github.com/ipld/specs/blob/master/block-layer/content-addressable-archives.md)) file to web3.storage.
     * Takes a CarReader interface from @ipld/car
     *
     * Returns the corresponding Content Identifier (CID).
     *
     * @example
     * ```js
     * import fs from 'fs'
     * import { Readable } from 'stream'
     * import { CarReader, CarWriter } from '@ipld/car'
     * import * as raw from 'multiformats/codecs/raw'
     * import { CID } from 'multiformats/cid'
     * import { sha256 } from 'multiformats/hashes/sha2'
     *
     * async function getCar() {
     *    const bytes = new TextEncoder().encode('random meaningless bytes')
     *    const hash = await sha256.digest(raw.encode(bytes))
     *    const cid = CID.create(1, raw.code, hash)
     *
     *    // create the writer and set the header with a single root
     *    const { writer, out } = await CarWriter.create([cid])
     *    Readable.from(out).pipe(fs.createWriteStream('example.car'))
  
     *    // store a new block, creates a new file entry in the CAR archive
     *    await writer.put({ cid, bytes })
     *    await writer.close()
  
     *    const inStream = fs.createReadStream('example.car')
     *    // read and parse the entire stream in one go, this will cache the contents of
     *    // the car in memory so is not suitable for large files.
     *    const reader = await CarReader.fromIterable(inStream)
     *    return reader
     * }
     *
     * const car = await getCar()
     * const cid = await client.putCar(car)
     * ```
     * @param {import('@ipld/car/api').CarReader} car
     * @param {PutCarOptions} [options]
     */
    putCar(car: import('@ipld/car/api').CarReader, options?: import("./lib/interface.js").PutCarOptions | undefined): Promise<import("./lib/interface.js").CIDString>;
    /**
     * Fetch the Content Addressed Archive by its root CID.
     * @param {CIDString} cid
     * @param {RequestOptions} [options]
     */
    get(cid: CIDString, options?: import("./lib/interface.js").RequestOptions | undefined): Promise<import("./lib/interface.js").Web3Response | null>;
    /**
     * @param {CIDString} cid
     * @param {RequestOptions} [options]
     */
    delete(cid: CIDString, options?: import("./lib/interface.js").RequestOptions | undefined): Promise<import("./lib/interface.js").CIDString>;
    /**
     * Fetch info on Filecoin deals and IPFS pins that a given CID is replicated in.
     * @param {CIDString} cid
     * @param {RequestOptions} [options]
     */
    status(cid: CIDString, options?: import("./lib/interface.js").RequestOptions | undefined): Promise<import("./lib/interface.js").Status | undefined>;
    /**
     * Find all uploads for this account. Use a `for await...of` loop to fetch them all.
     * @example
     * Fetch all the uploads
     * ```js
     * const uploads = []
     * for await (const item of client.list()) {
     *    uploads.push(item)
     * }
     * ```
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
     * @param {ListOptions} [opts]
     * @returns {AsyncIterable<Upload>}
     */
    list(opts?: import("./lib/interface.js").ListOptions | undefined): AsyncIterable<Upload>;
}
import { File } from "./platform.js";
import { Blob } from "./platform.js";
import { filesFromPath } from "files-from-path";
import { getFilesFromPath } from "files-from-path";
export { File, Blob, filesFromPath, getFilesFromPath };
//# sourceMappingURL=lib.d.ts.map