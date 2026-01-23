# @agentic-trust/veramo-agent-extension

Veramo agent extensions for agent-to-agent (A2A) communication and account abstraction (AA) support. This package provides Veramo plugins and utilities for building agent systems with DID management, credential issuance, and key management capabilities.

## Features

- **Agent DID Provider**: Create and manage DIDs for agents
- **Account Abstraction DID Provider**: Support for account abstraction wallets
- **Agent Key Management System**: Key management for agent identities
- **Account Abstraction Key Management System**: Key management for AA wallets
- **EIP-1271 Credential Issuance**: Issue verifiable credentials with EIP-1271 signatures
- **Agent Resolver**: Resolve agent DIDs and identities
- **Identity Registry**: Registry for managing agent identities

## Installation

```bash
npm install @agentic-trust/veramo-agent-extension
# or
pnpm add @agentic-trust/veramo-agent-extension
# or
yarn add @agentic-trust/veramo-agent-extension
```

## Usage

### Agent DID Provider

```typescript
import { AgentDidProvider } from '@agentic-trust/veramo-agent-extension';

// Create an agent DID provider instance
const agentDidProvider = new AgentDidProvider({
  // Configuration options
});
```

### Account Abstraction Support

```typescript
import { AADidProvider, AAKeyManagementSystem } from '@agentic-trust/veramo-agent-extension';

// Set up account abstraction providers
const aaDidProvider = new AADidProvider({
  // AA configuration
});

const aaKeyManagementSystem = new AAKeyManagementSystem({
  // KMS configuration
});
```

### EIP-1271 Credential Issuance

```typescript
import { AgentCredentialIssuerEIP1271 } from '@agentic-trust/veramo-agent-extension';

// Create credential issuer
const credentialIssuer = new AgentCredentialIssuerEIP1271({
  // Configuration
});

// Issue a credential
const credential = await credentialIssuer.createVerifiableCredential({
  // Credential payload
});
```

### Complete Veramo Agent Setup

```typescript
import { createAgent } from '@veramo/core';
import { AgentDidProvider } from '@agentic-trust/veramo-agent-extension';

const agent = createAgentForEOA({
  plugins: [
    new AgentDidProvider({
      // Provider config
    }),
    // ... other plugins
  ],
});
```

## Exports

### Main Exports

- `AgentDidProvider` - DID provider for agents
- `AADidProvider` - DID provider for account abstraction
- `AgentKeyManagementSystem` - Key management for agents
- `AAKeyManagementSystem` - Key management for AA wallets
- `AgentCredentialIssuerEIP1271` - EIP-1271 credential issuer for agents
- `AACredentialIssuerEIP1271` - EIP-1271 credential issuer for AA
- `AgentResolver` - DID resolver for agents
- `AAResolver` - DID resolver for account abstraction
- `IdentityRegistry` - Identity registry utility

### Type Exports

- `ICredentialEIP1271` - Interface for EIP-1271 credentials
- `AgentTypes` - Type definitions for agents
- `AATypes` - Type definitions for account abstraction

## Development

```bash
# Build the package
pnpm build

# Run in watch mode
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0.0
- Veramo >= 6.0.0

## License

MIT

