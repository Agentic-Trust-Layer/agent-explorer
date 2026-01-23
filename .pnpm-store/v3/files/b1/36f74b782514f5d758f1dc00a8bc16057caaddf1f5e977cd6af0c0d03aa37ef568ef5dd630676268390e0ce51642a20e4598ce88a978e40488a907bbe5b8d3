![Namespace Ninja](https://i.postimg.cc/Nfcbq9jP/namespace.png)

# Namespace SDK - Mint Manager

[![npm version](https://img.shields.io/npm/v/@thenamespace/mint-manager.svg)](https://www.npmjs.com/package/@thenamespace/mint-manager)

`@thenamespace/mint-manager` is a TypeScript SDK for minting subnames on the ENS (Ethereum Name Service) platform. It enables seamless interaction with the Namespace ecosystem, allowing users to mint both Mainnet and Layer 2 (L2) subnames on supported networks, including Base and Optimism. The SDK abstracts the complexities of interacting with smart contracts, ensuring a smooth developer experience.

## Features

- **Mint Subnames**: Easily mint ENS subnames listed on the Namespace platform.
- **Mainnet & L2 Support**: Works with Ethereum Mainnet as well as Layer 2 networks like Base and Optimism.
- **Subname Availability Checks**: Determine whether a subname is available for minting.
- **Configurable Environment**: Supports testnet mode, which uses Sepolia-listed names.
- **Custom ENS Record Setting**: Set resolver records at the time of minting.

## Installation

```sh
npm install @thenamespace/mint-manager
```

## Configuration

The MintClient can be configured with the following parameters:

- `isTestnet` (boolean): If `true`, the SDK operates in test mode and uses subnames listed on the Sepolia test network instead of Mainnet.

### Example Usage

```typescript
import { createMintClient } from "@thenamespace/mint-manager";

// Mainnet (zero-config)
const mainnetClient = createMintClient();

// Testnet (Sepolia listings, staging APIs)
const testnetClient = createMintClient({ isTestnet: true });
```

## API

### Get Mint Details (quote and parameters)

Fetch minting quote and estimated parameters for a subname.

```typescript
const details = await mintClient.getMintDetails({
  parentName: "example.eth",
  label: "subname",
  minterAddress: "0x123...",
  expiryInYears: 1,
  isTestnet: true,
});
```

### Get Minting Transaction Parameters

This method retrieves the transaction parameters required for minting a subname. It also supports setting ENS records, allowing users to pre-configure resolver records such as avatars, texts, and crypto addresses.

```typescript
const txParams = await mintClient.getMintTransactionParameters({
  parentName: "example.eth",
  label: "subname",
  minterAddress: "0x123...",
  expiryInYears: 1,
  records: {
    avatar: "https://example.com/avatar.png",
    "com.twitter": "@example",
  },
});
```

**Response:**

- `abi`: The ABI of the contract function to call.
- `args`: Arguments required for the contract call.
- `functionName`: The function to execute (`mint`).
- `contractAddress`: The contract handling the minting.
- `account`: The address executing the transaction.
- `value`: The total cost of minting (price + fee).

### Check L1 Subname Availability

Determines if an ENS subname is available on the Ethereum Mainnet.

```typescript
const isAvailable = await mintClient.isL1SubnameAvailable(
  "subname.example.eth"
);
console.log(isAvailable ? "Subname is available" : "Subname is already taken");
```

### Check L2 Subname Availability

Checks whether a subname is available on an L2 network. This requires specifying the `chainId` of the target network.

```typescript
const isAvailable = await mintClient.isL2SubnameAvailable(
  "subname.example.eth",
  8453
); // Base network
console.log(
  isAvailable ? "Subname is available on L2" : "Subname is already taken"
);
```

**Parameters:**

- `subname` (string): The full subname to check.
- `chainId` (number): The chain ID of the target L2 network (e.g., 8453 for Base, 10 for Optimism).

### Notes

- `createMintClient()` now derives environment internally; set `isTestnet: true` for test usage.
- You can optionally provide custom RPC URLs per chain if needed.

## License

MIT
