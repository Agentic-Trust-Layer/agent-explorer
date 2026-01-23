"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inference = void 0;
const inferenceOperationsBuilder_1 = require("./inferenceOperationsBuilder");
const embed_1 = require("./embed");
const rerank_1 = require("./rerank");
const getModel_1 = require("./getModel");
const listModels_1 = require("./listModels");
/* The Inference class uses the Inference API to generate embeddings, rerank documents, and work with models.  */
class Inference {
    constructor(config) {
        this.config = config;
        const inferenceApi = (0, inferenceOperationsBuilder_1.inferenceOperationsBuilder)(this.config);
        this._embed = (0, embed_1.embed)(inferenceApi);
        this._rerank = (0, rerank_1.rerank)(inferenceApi);
        this._listModels = (0, listModels_1.listModels)(inferenceApi);
        this._getModel = (0, getModel_1.getModel)(inferenceApi);
    }
    /**
     * Generates embeddings for the provided inputs using the specified model and (optional) parameters.
     *
     * @example
     * ````typescript
     * import { Pinecone } from '@pinecone-database/pinecone';
     * const pc = new Pinecone();
     *
     * const inputs = ['Who created the first computer?'];
     * const model = 'multilingual-e5-large';
     * const parameters = {
     *   inputType: 'passage',
     *   truncate: 'END',
     * };
     * const embeddings = await pc.inference.embed(model, inputs, parameters);
     * console.log(embeddings);
     * // {
     * //   model: 'multilingual-e5-large',
     * //   vectorType: 'dense',
     * //   data: [ { values: [Array], vectorType: 'dense' } ],
     * //   usage: { totalTokens: 10 }
     * // }
     * ```
     *
     * @param model - The model to use for generating embeddings.
     * @param inputs - A list of items to generate embeddings for.
     * @param params - A dictionary of parameters to use when generating embeddings.
     * @returns A promise that resolves to {@link EmbeddingsList}.
     * */
    embed(model, inputs, params) {
        return this._embed(model, inputs, params);
    }
    /**
     * Rerank documents against a query with a reranking model. Each document is ranked in descending relevance order
     * against the query provided.
     *
     * @example
     * ````typescript
     * import { Pinecone } from '@pinecone-database/pinecone';
     * const pc = new Pinecone();
     * const rerankingModel = 'bge-reranker-v2-m3';
     * const myQuery = 'What are some good Turkey dishes for Thanksgiving?';
     *
     * // Option 1: Documents as an array of strings
     * const myDocsStrings = [
     *   'I love turkey sandwiches with pastrami',
     *   'A lemon brined Turkey with apple sausage stuffing is a classic Thanksgiving main',
     *   'My favorite Thanksgiving dish is pumpkin pie',
     *   'Turkey is a great source of protein',
     * ];
     *
     * // Option 1 response
     * const response = await pc.inference.rerank(
     *   rerankingModel,
     *   myQuery,
     *   myDocsStrings
     * );
     * console.log(response);
     * // {
     * // model: 'bge-reranker-v2-m3',
     * // data: [
     * //   { index: 1, score: 0.5633179, document: [Object] },
     * //   { index: 2, score: 0.02013874, document: [Object] },
     * //   { index: 3, score: 0.00035419367, document: [Object] },
     * //   { index: 0, score: 0.00021485926, document: [Object] }
     * // ],
     * // usage: { rerankUnits: 1 }
     * // }
     *
     * // Option 2: Documents as an array of objects
     * const myDocsObjs = [
     *   {
     *     title: 'Turkey Sandwiches',
     *     body: 'I love turkey sandwiches with pastrami',
     *   },
     *   {
     *     title: 'Lemon Turkey',
     *     body: 'A lemon brined Turkey with apple sausage stuffing is a classic Thanksgiving main',
     *   },
     *   {
     *     title: 'Thanksgiving',
     *     body: 'My favorite Thanksgiving dish is pumpkin pie',
     *   },
     *   { title: 'Protein Sources', body: 'Turkey is a great source of protein' },
     * ];
     *
     * // Option 2: Options object declaring which custom key to rerank on
     * // Note: If no custom key is passed via `rankFields`, each doc must contain a `text` key, and that will act as the default)
     * const rerankOptions = {
     *   topN: 3,
     *   returnDocuments: false,
     *   rankFields: ['body'],
     *   parameters: {
     *     inputType: 'passage',
     *     truncate: 'END',
     *   },
     * };
     *
     * // Option 2 response
     * const response = await pc.inference.rerank(
     *   rerankingModel,
     *   myQuery,
     *   myDocsObjs,
     *   rerankOptions
     * );
     * console.log(response);
     * // {
     * // model: 'bge-reranker-v2-m3',
     * // data: [
     * //   { index: 1, score: 0.5633179, document: undefined },
     * //   { index: 2, score: 0.02013874, document: undefined },
     * //   { index: 3, score: 0.00035419367, document: undefined },
     * // ],
     * // usage: { rerankUnits: 1 }
     * //}
     * ```
     *
     * @param model - (Required) The model to use for reranking. Currently, the only available model is "[bge-reranker-v2-m3](https://docs.pinecone.io/models/bge-reranker-v2-m3)"}.
     * @param query - (Required) The query to rerank documents against.
     * @param documents - (Required) An array of documents to rerank. The array can either be an array of strings or
     * an array of objects.
     * @param options - (Optional) Additional options to send with the reranking request. See {@link RerankOptions} for more details.
     * */
    async rerank(model, query, documents, options) {
        return this._rerank(model, query, documents, options);
    }
    /**
     * List available models hosted by Pinecone.
     *
     * @example
     * ````typescript
     * import { Pinecone } from '@pinecone-database/pinecone';
     * const pc = new Pinecone();
     *
     * const models = await pc.inference.listModels();
     * console.log(models);
     * // {
     * //   models: [
     * //     {
     * //       model: 'llama-text-embed-v2',
     * //       shortDescription: 'A high performance dense embedding model optimized for multilingual and cross-lingual text question-answering retrieval with support for long documents (up to 2048 tokens) and dynamic embedding size (Matryoshka Embeddings).',
     * //       type: 'embed',
     * //       vectorType: 'dense',
     * //       defaultDimension: 1024,
     * //       modality: 'text',
     * //       maxSequenceLength: 2048,
     * //       maxBatchSize: 96,
     * //       providerName: 'NVIDIA',
     * //       supportedDimensions: [Array],
     * //       supportedMetrics: [Array],
     * //       supportedParameters: [Array]
     * //     },
     * //     ...
     * //     {
     * //       model: 'pinecone-rerank-v0',
     * //       shortDescription: 'A state of the art reranking model that out-performs competitors on widely accepted benchmarks. It can handle chunks up to 512 tokens (1-2 paragraphs)',
     * //       type: 'rerank',
     * //       vectorType: undefined,
     * //       defaultDimension: undefined,
     * //       modality: 'text',
     * //       maxSequenceLength: 512,
     * //       maxBatchSize: 100,
     * //       providerName: 'Pinecone',
     * //       supportedDimensions: undefined,
     * //       supportedMetrics: undefined,
     * //       supportedParameters: [Array]
     * //     }
     * //   ]
     * // }
     * ```
     *
     * @param options - (Optional) A {@link ListModelsOptions} object to filter the models returned.
     * @returns A promise that resolves to {@link ModelInfoList}.
     * */
    async listModels(options) {
        return this._listModels(options);
    }
    /**
     * Get the information for a model hosted by Pinecone.
     *
     * @example
     * ````typescript
     * import { Pinecone } from '@pinecone-database/pinecone';
     * const pc = new Pinecone();
     *
     * const model = await pc.inference.getModel('pinecone-sparse-english-v0');
     * console.log(model);
     * // {
     * //   model: 'pinecone-sparse-english-v0',
     * //   shortDescription: 'A sparse embedding model for converting text to sparse vectors for keyword or hybrid semantic/keyword search. Built on the innovations of the DeepImpact architecture.',
     * //   type: 'embed',
     * //   vectorType: 'sparse',
     * //   defaultDimension: undefined,
     * //   modality: 'text',
     * //   maxSequenceLength: 512,
     * //   maxBatchSize: 96,
     * //   providerName: 'Pinecone',
     * //   supportedDimensions: undefined,
     * //   supportedMetrics: [ 'DotProduct' ],
     * //   supportedParameters: [
     * //     {
     * //       parameter: 'input_type',
     * //       type: 'one_of',
     * //       valueType: 'string',
     * //       required: true,
     * //       allowedValues: [Array],
     * //       min: undefined,
     * //       max: undefined,
     * //       _default: undefined
     * //     },
     * //     {
     * //       parameter: 'truncate',
     * //       type: 'one_of',
     * //       valueType: 'string',
     * //       required: false,
     * //       allowedValues: [Array],
     * //       min: undefined,
     * //       max: undefined,
     * //       _default: 'END'
     * //     },
     * //     {
     * //       parameter: 'return_tokens',
     * //       type: 'any',
     * //       valueType: 'boolean',
     * //       required: false,
     * //       allowedValues: undefined,
     * //       min: undefined,
     * //       max: undefined,
     * //       _default: false
     * //     }
     * //   ]
     * // }
     * ```
     *
     * @param modelName - The model name you would like to describe.
     * @returns A promise that resolves to {@link ModelInfo}.
     * */
    async getModel(modelName) {
        return this._getModel(modelName);
    }
}
exports.Inference = Inference;
//# sourceMappingURL=inference.js.map