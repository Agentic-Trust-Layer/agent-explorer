"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatStream = void 0;
const assistant_data_1 = require("../../pinecone-generated-ts-fetch/assistant_data");
const utils_1 = require("../../utils");
const errors_1 = require("../../errors");
const node_stream_1 = require("node:stream");
const chat_1 = require("./chat");
const chatStream = (assistantName, apiProvider, config) => {
    return async (options) => {
        const fetch = (0, utils_1.getFetch)(config);
        (0, chat_1.validateChatOptions)(options);
        const hostUrl = await apiProvider.provideHostUrl();
        const chatUrl = `${hostUrl}/chat/${assistantName}`;
        const requestHeaders = {
            'Api-Key': config.apiKey,
            'User-Agent': (0, utils_1.buildUserAgent)(config),
            'X-Pinecone-Api-Version': assistant_data_1.X_PINECONE_API_VERSION,
        };
        // format context options
        let contextOptions = undefined;
        if (options.contextOptions?.topK || options.contextOptions?.snippetSize) {
            contextOptions = {
                top_k: options.contextOptions?.topK || options.topK,
                snippet_size: options.contextOptions?.snippetSize,
            };
        }
        else if (options.topK) {
            contextOptions = {
                top_k: options.topK,
            };
        }
        // we call the API directly via fetch, so we need to snake_case the keys (normally generated code handles this)
        const response = await fetch(chatUrl, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
                messages: (0, chat_1.messagesValidation)(options),
                stream: true,
                model: (0, chat_1.modelValidation)(options),
                filter: options.filter,
                json_response: options.jsonResponse,
                include_highlights: options.includeHighlights,
                context_options: contextOptions,
            }),
        });
        if (response.ok && response.body) {
            const nodeReadable = node_stream_1.Readable.fromWeb(response.body);
            return new utils_1.ChatStream(nodeReadable);
        }
        else {
            const err = await (0, errors_1.handleApiError)(new assistant_data_1.ResponseError(response, 'Response returned an error'), undefined, chatUrl);
            throw err;
        }
    };
};
exports.chatStream = chatStream;
//# sourceMappingURL=chatStream.js.map