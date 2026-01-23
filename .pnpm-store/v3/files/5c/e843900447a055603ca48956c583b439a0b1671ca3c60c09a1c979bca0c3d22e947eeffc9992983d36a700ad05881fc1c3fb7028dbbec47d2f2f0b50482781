"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_canonicalize_1 = require("json-canonicalize");
var getEthTypesFromInputDoc_1 = require("./getEthTypesFromInputDoc");
// Examples specified here: https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/#ref-for-dfn-types-generation-algorithm-2
var specExampleInputDoc = {
    "@context": ["https://schema.org", "https://w3id.org/security/v2"],
    "@type": "Person",
    "name": {
        "first": "Jane",
        "last": "Doe"
    },
    "otherData": {
        "jobTitle": "Professor",
        "school": "University of ExampleLand"
    },
    "telephone": "(425) 123-4567",
    "email": "jane.doe@example.com",
    "proof": {
        "verificationMethod": "did:fake" + "#controller",
        "created": "date: fake",
        "proofPurpose": "assertionMethod",
        "type": "EthereumEip712Signature2021",
    }
};
var specExampleTypes = {
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
    ],
    Document: [
        { name: "@context", type: "string[]" },
        { name: "@type", type: "string" },
        { name: "email", type: "string" },
        { name: "name", type: "Name" },
        { name: "otherData", type: "OtherData" },
        {
            name: "proof",
            type: "Proof",
        },
        { name: "telephone", type: "string" }
    ],
    Name: [
        { name: "first", type: "string" },
        { name: "last", type: "string" }
    ],
    OtherData: [
        { name: "jobTitle", type: "string" },
        { name: "school", type: "string" }
    ],
    Proof: [
        {
            name: "created",
            type: "string",
        },
        {
            name: "proofPurpose",
            type: "string",
        },
        {
            name: "type",
            type: "string",
        },
        {
            name: "verificationMethod",
            type: "string",
        }
    ],
};
var socialMediaProfileLinkage = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://beta.api.schemas.serto.id/v1/public/social-media-linkage-credential/1.0/ld-context.json",
    ],
    "type": ["VerifiableCredential", "SocialMediaProfileLinkage"],
    "issuer": "did:fake",
    "issuanceDate": "date: fake",
    "credentialSubject": {
        "socialMediaProfileUrl": "profile fake",
        "id": "did:fake",
    },
    "credentialSchema": {
        "id": "https://beta.api.schemas.serto.id/v1/public/social-media-linkage-credential/1.0/json-schema.json",
        "type": "JsonSchemaValidator2018",
    },
    "proof": {
        "verificationMethod": "did:fake" + "#controller",
        "created": "date: fake",
        "proofPurpose": "assertionMethod",
        "type": "EthereumEip712Signature2021",
    }
};
var socialMediaProfileLinkageTypes = {
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
    ],
    VerifiableCredential: [
        {
            name: "@context",
            type: "string[]",
        },
        {
            name: "credentialSchema",
            type: "CredentialSchema",
        },
        {
            name: "credentialSubject",
            type: "CredentialSubject",
        },
        {
            name: "issuanceDate",
            type: "string",
        },
        {
            name: "issuer",
            type: "string",
        },
        {
            name: "proof",
            type: "Proof",
        },
        {
            name: "type",
            type: "string[]",
        },
    ],
    CredentialSchema: [
        {
            name: "id",
            type: "string",
        },
        {
            name: "type",
            type: "string",
        },
    ],
    CredentialSubject: [
        {
            name: "id",
            type: "string",
        },
        {
            name: "socialMediaProfileUrl",
            type: "string",
        }
    ],
    Proof: [
        {
            name: "created",
            type: "string",
        },
        {
            name: "proofPurpose",
            type: "string",
        },
        {
            name: "type",
            type: "string",
        },
        {
            name: "verificationMethod",
            type: "string",
        }
    ],
};
var specExamplenIputDocWithoutProof = {
    "@context": ["https://schema.org", "https://w3id.org/security/v2"],
    "@type": "Person",
    "name": {
        "first": "Jane",
        "last": "Doe"
    },
    "otherData": {
        "jobTitle": "Professor",
        "school": "University of ExampleLand"
    },
    "telephone": "(425) 123-4567",
    "email": "jane.doe@example.com"
};
describe("getEthTypesFromSchemas tests", function () {
    test("test spec example", function () {
        var res = (0, getEthTypesFromInputDoc_1.getEthTypesFromInputDoc)(specExampleInputDoc);
        var objRes = JSON.parse((0, json_canonicalize_1.canonicalize)(res));
        expect(objRes).toEqual(specExampleTypes);
    });
    test("test SocialMediaProfileLinkage example", function () {
        var res = (0, getEthTypesFromInputDoc_1.getEthTypesFromInputDoc)(socialMediaProfileLinkage, "VerifiableCredential");
        var parsedCanonicalized = JSON.parse((0, json_canonicalize_1.canonicalize)(res));
        expect((0, json_canonicalize_1.canonicalize)(parsedCanonicalized)).toEqual((0, json_canonicalize_1.canonicalize)(socialMediaProfileLinkageTypes));
    });
    test("spec example without proof should fail", function () {
        expect(function () { return (0, getEthTypesFromInputDoc_1.getEthTypesFromInputDoc)(specExamplenIputDocWithoutProof, "VerifiableCredential"); }).toThrow();
    });
});
//# sourceMappingURL=getEthTypesFromInputDoc.test.js.map