# credential-status

[![codecov](https://codecov.io/gh/uport-project/credential-status/branch/develop/graph/badge.svg)](https://codecov.io/gh/uport-project/credential-status)

A status method aggregator for verifiable credentials.

## Usage

Given a JWT credential that embeds a `status` property, it should call the appropriate status checking method and return
its result. This library is meant to be used with `did-jwt`, as a status method aggregator called during the
verification step.

Example:

A JWT with a status field in the payload.vc field:

```json
{
  "credentialStatus": {
    "id": "mainnet:0xStatusRegistryAddress",
    "type": "EthrStatusRegistry2019"
  },
  "iss": "did:ethr:0x...",
  "vc": {
    //...
  }
  //...
}
```

```ts
import { EthrStatusRegistry } from 'ethr-status-registry'
import { Status } from 'credential-status'
//...other JWT verification inits

const status = new Status({
  ...new EthrStatusRegistry(config).asStatusMethod,
})

const verificationResult = await didJWT.verifyJWT(token, resolver)
const didDoc = verificationResult.doc

const result = await status.checkStatus(token, didDoc)
// result: { "revokedAt": "0x5348684" }

```

The individual methods used to check for the status need to implement a `checkStatus` method and are expected to use the
provided issuer DID document to help generate a result.

### Results

There is no standard format for the result of a status check. It is up to the method implementer to provide their own,
and ultimately up to verifiers of credentials to determine which methods they support or accept.

## Known methods

The only known implementation of a credential-status method is
the [ethr-status-registry](https://github.com/uport-project/ethr-status-registry) which uses an ethereum smart contract
to register revocations of credentials.

If you implement your own status check, feel free to submit a link to it here.
