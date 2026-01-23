"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rerank = void 0;
const errors_1 = require("../errors");
const rerank = (infApi) => {
    return async (model, query, documents, options = {}) => {
        if (documents.length == 0) {
            throw new errors_1.PineconeArgumentError('You must pass at least one document to rerank');
        }
        if (query.length == 0) {
            throw new errors_1.PineconeArgumentError('You must pass a query to rerank');
        }
        if (model.length == 0) {
            throw new errors_1.PineconeArgumentError('You must pass the name of a supported reranking model in order to rerank' +
                ' documents. See https://docs.pinecone.io/models for supported models.');
        }
        const { topN = documents.length, returnDocuments = true, parameters = {}, } = options;
        let { rankFields = ['text'] } = options;
        // Validate and standardize documents to ensure they are in object format
        const newDocuments = documents.map((doc) => typeof doc === 'string' ? { text: doc } : doc);
        if (!options.rankFields) {
            if (!newDocuments.every((doc) => typeof doc === 'object' && doc.text)) {
                throw new errors_1.PineconeArgumentError('Documents must be a list of strings or objects containing the "text" field');
            }
        }
        if (options.rankFields) {
            rankFields = options.rankFields;
        }
        const req = {
            rerankRequest: {
                model: model,
                query: query,
                documents: newDocuments,
                topN: topN,
                returnDocuments: returnDocuments,
                rankFields: rankFields,
                parameters: parameters,
            },
        };
        return await infApi.rerank(req);
    };
};
exports.rerank = rerank;
//# sourceMappingURL=rerank.js.map