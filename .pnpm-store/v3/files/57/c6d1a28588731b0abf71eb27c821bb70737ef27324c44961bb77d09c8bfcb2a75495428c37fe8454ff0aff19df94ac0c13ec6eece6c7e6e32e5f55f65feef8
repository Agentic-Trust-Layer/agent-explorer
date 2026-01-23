"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployments = exports.EthereumDIDRegistry = exports.Errors = exports.interpretIdentifier = exports.identifierMatcher = exports.verificationMethodTypes = exports.attrTypes = exports.delegateTypes = exports.EthrDidController = exports.stringToBytes32 = exports.bytes32toString = exports.getResolver = exports.REGISTRY = void 0;
const resolver_js_1 = require("./resolver.js");
Object.defineProperty(exports, "getResolver", { enumerable: true, get: function () { return resolver_js_1.getResolver; } });
const controller_js_1 = require("./controller.js");
Object.defineProperty(exports, "EthrDidController", { enumerable: true, get: function () { return controller_js_1.EthrDidController; } });
const helpers_js_1 = require("./helpers.js");
Object.defineProperty(exports, "bytes32toString", { enumerable: true, get: function () { return helpers_js_1.bytes32toString; } });
Object.defineProperty(exports, "REGISTRY", { enumerable: true, get: function () { return helpers_js_1.DEFAULT_REGISTRY_ADDRESS; } });
Object.defineProperty(exports, "Errors", { enumerable: true, get: function () { return helpers_js_1.Errors; } });
Object.defineProperty(exports, "identifierMatcher", { enumerable: true, get: function () { return helpers_js_1.identifierMatcher; } });
Object.defineProperty(exports, "interpretIdentifier", { enumerable: true, get: function () { return helpers_js_1.interpretIdentifier; } });
Object.defineProperty(exports, "delegateTypes", { enumerable: true, get: function () { return helpers_js_1.legacyAlgoMap; } });
Object.defineProperty(exports, "attrTypes", { enumerable: true, get: function () { return helpers_js_1.legacyAttrTypes; } });
Object.defineProperty(exports, "stringToBytes32", { enumerable: true, get: function () { return helpers_js_1.stringToBytes32; } });
Object.defineProperty(exports, "verificationMethodTypes", { enumerable: true, get: function () { return helpers_js_1.verificationMethodTypes; } });
const EthereumDIDRegistry_js_1 = require("./config/EthereumDIDRegistry.js");
Object.defineProperty(exports, "EthereumDIDRegistry", { enumerable: true, get: function () { return EthereumDIDRegistry_js_1.EthereumDIDRegistry; } });
const deployments_js_1 = require("./config/deployments.js");
Object.defineProperty(exports, "deployments", { enumerable: true, get: function () { return deployments_js_1.deployments; } });
// workaround for esbuild/vite/hermes issues
// This should not be needed once we move to ESM only build outputs.
// This library now builds as a CommonJS library, with a small ESM wrapper on top.
// This pattern seems to confuse some bundlers, causing errors like `Cannot read 'getResolver' of undefined`
// see https://github.com/decentralized-identity/ethr-did-resolver/issues/186
exports.default = {
    REGISTRY: helpers_js_1.DEFAULT_REGISTRY_ADDRESS,
    getResolver: resolver_js_1.getResolver,
    bytes32toString: helpers_js_1.bytes32toString,
    stringToBytes32: helpers_js_1.stringToBytes32,
    EthrDidController: controller_js_1.EthrDidController,
    verificationMethodTypes: helpers_js_1.verificationMethodTypes,
    identifierMatcher: helpers_js_1.identifierMatcher,
    interpretIdentifier: helpers_js_1.interpretIdentifier,
    Errors: helpers_js_1.Errors,
    EthereumDIDRegistry: EthereumDIDRegistry_js_1.EthereumDIDRegistry,
    deployments: deployments_js_1.deployments,
};
//# sourceMappingURL=index.js.map