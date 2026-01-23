# @thenamespace/indexer

A TypeScript SDK for interacting with the Namespace Indexer API. Query L2 subnames, registries, and metadata with full TypeScript support.

## Features

- 🔍 **Query L2 Subnames** - Get detailed information about individual subnames
- 🏛️ **Registry Information** - Access registry metadata and configuration
- 📄 **Paginated Lists** - Efficiently browse multiple subnames with filtering
- 🛡️ **Type Safety** - Full TypeScript support with comprehensive type definitions
- ⚡ **HTTP Client** - Built on axios with configurable timeouts and error handling
- 🔧 **Flexible Configuration** - Custom endpoints, headers, and request options

## Installation

```bash
npm install @thenamespace/indexer
```

```bash
yarn add @thenamespace/indexer
```

```bash
pnpm add @thenamespace/indexer
```

## Quick Start

```typescript
import { createIndexerClient } from '@thenamespace/indexer';

// Create a client instance
const client = createIndexerClient();

// Get information about a specific subname
const subname = await client.getL2Subname({
  chainId: 10, // Optimism
  nameOrNamehash: 'alice.namespace.eth'
});

console.log('Subname owner:', subname.owner);
console.log('Subname records:', subname.records);
```

## API Reference

### Creating a Client

```typescript
import { createIndexerClient, IndexerClientConfig } from '@thenamespace/indexer';

// Basic usage with default configuration
const client = createIndexerClient();

// Advanced configuration
const client = createIndexerClient({
  indexerUri: 'https://custom-indexer.namespace.ninja',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer your-token'
  }
});
```

### Supported Chain IDs

- `10` - Optimism
- `8453` - Base
- `84532` - Base Sepolia (Testnet)

### Methods

#### `getL2Subname(request: L2SubnameRequest): Promise<L2SubnameResponse>`

Get detailed information about a specific L2 subname.

```typescript
const subname = await client.getL2Subname({
  chainId: 10,
  nameOrNamehash: 'alice.namespace.eth' // or namehash
});

// Response includes:
// - name, namehash, owner, avatar
// - chainId, expiry, parentHash
// - records (addresses, texts, contenthash)
// - metadata (blockNumber, price, fee, tx)
```

#### `getL2Registry(request: L2SubnameRequest): Promise<L2RegistryResponse>`

Get registry information for a domain.

```typescript
const registry = await client.getL2Registry({
  chainId: 10,
  nameOrNamehash: 'namespace.eth'
});

// Response includes:
// - name, owner
// - tokenSymbol, tokenName, tokenAddress
// - is_expirable, is_burnable
// - chain_id
```

#### `getL2Subnames(request: L2SubnamesRequest): Promise<L2SubnamesResponse>`

Get a paginated list of L2 subnames with optional filtering.

```typescript
// Get all subnames owned by a specific address
const subnames = await client.getL2Subnames({
  owner: '0x1234...',
  chainId: 10,
  page: 0,
  size: 20
});

// Filter by parent domain
const subnames = await client.getL2Subnames({
  parent: 'namespace.eth',
  isTestnet: false
});

// Search by name
const subnames = await client.getL2Subnames({
  stringSearch: 'alice',
  chainId: 10
});
```

### Type Definitions

#### L2SubnameRequest
```typescript
interface L2SubnameRequest {
  chainId: 10 | 8453 | 84532;
  nameOrNamehash: string;
}
```

#### L2SubnameResponse
```typescript
interface L2SubnameResponse {
  name: string;
  namehash: string;
  owner: string;
  avatar?: string;
  chainId: number;
  expiry: number;
  parentHash: string;
  records: {
    addresses: Record<string, string>;
    texts: Record<string, string>;
    contenthash: string;
  };
  metadata: {
    blockNumber: number;
    price: number;
    fee: number;
    tx: string;
  };
}
```

#### L2SubnamesRequest
```typescript
interface L2SubnamesRequest {
  owner?: string;
  chainId?: number;
  page?: number;
  size?: number;
  parent?: string;
  isTestnet?: boolean;
  stringSearch?: string;
}
```

#### L2SubnamesResponse
```typescript
interface L2SubnamesResponse {
  size: number;
  page: number;
  items: L2SubnameResponse[];
  total: number;
}
```

## Examples

### Basic Usage

```typescript
import { createIndexerClient } from '@thenamespace/indexer';

async function main() {
  const client = createIndexerClient();

  try {
    // Get a specific subname
    const subname = await client.getL2Subname({
      chainId: 10,
      nameOrNamehash: 'lucas.oppunk.eth'
    });

    console.log('Subname:', subname.name);
    console.log('Owner:', subname.owner);
    console.log('ETH Address:', subname.records.addresses['60']); // ETH coin type

    // Get registry info
    const registry = await client.getL2Registry({
      chainId: 10,
      nameOrNamehash: 'oppunk.eth'
    });

    console.log('Registry owner:', registry.owner);
    console.log('Token symbol:', registry.tokenSymbol);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Advanced Filtering

```typescript
import { createIndexerClient } from '@thenamespace/indexer';

async function getSubnamesByOwner(ownerAddress: string) {
  const client = createIndexerClient();
  
  const subnames = await client.getL2Subnames({
    owner: ownerAddress,
    chainId: 10,
    page: 0,
    size: 50
  });

  console.log(`Found ${subnames.total} subnames for ${ownerAddress}`);
  
  subnames.items.forEach(subname => {
    console.log(`- ${subname.name} (${subname.chainId})`);
  });

  return subnames;
}
```

### Error Handling

```typescript
import { createIndexerClient } from '@thenamespace/indexer';

async function safeGetSubname(chainId: number, name: string) {
  const client = createIndexerClient();

  try {
    const subname = await client.getL2Subname({ chainId, nameOrNamehash: name });
    return { success: true, data: subname };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, error: 'Subname not found' };
    }
    return { success: false, error: error.message };
  }
}
```

## Configuration

### IndexerClientConfig

```typescript
interface IndexerClientConfig extends AxiosRequestConfig {
  indexerUri?: string; // Custom API endpoint
}
```

All standard axios configuration options are supported:

- `timeout` - Request timeout in milliseconds
- `headers` - Custom headers
- `auth` - Basic authentication
- `proxy` - Proxy configuration
- And more...

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Clean Build

```bash
npm run clean
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- 📖 [Documentation](https://github.com/thenamespace/namespacesdk)
- 🐛 [Issues](https://github.com/thenamespace/namespacesdk/issues)
- 💬 [Discussions](https://github.com/thenamespace/namespacesdk/discussions)
