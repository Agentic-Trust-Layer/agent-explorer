import { RerankResult, InferenceApi } from '../pinecone-generated-ts-fetch/inference';
/** Options one can send with a request to {@link rerank} *
 *
 * @param topN - The number of documents to return in the response. Default is the number of documents passed in the
 * request.
 * @param returnDocuments - Whether to return the documents in the response. Default is `true`.
 * @param rankFields - The fields by which to rank the documents. If no field is passed, default is `['text']`.
 * Note: some models only support 1 reranking field. See the [model documentation](https://docs.pinecone.io/guides/inference/understanding-inference#rerank) for more information.
 * @param parameters - Additional model-specific parameters to send with the request, e.g. {truncate: "END"}.
 * */
export interface RerankOptions {
    topN?: number;
    returnDocuments?: boolean;
    rankFields?: Array<string>;
    parameters?: {
        [key: string]: string;
    };
}
export declare const rerank: (infApi: InferenceApi) => (model: string, query: string, documents: (string | {
    [key: string]: string;
})[], options?: RerankOptions) => Promise<RerankResult>;
