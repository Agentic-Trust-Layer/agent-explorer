/**
 * Veramo Agent Factory
 *
 * Creates a Veramo agent instance for AgenticTrust client use
 * This allows the core package to create agents internally without requiring
 * the consuming application to set up Veramo
 */
import { createAgent } from '@veramo/core';
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { EthrDIDProvider } from '@veramo/did-provider-ethr';
import { generatePrivateKey } from 'viem/accounts';
import Web3 from 'web3';
import { getAAResolver as aaDidResolver, getAgentResolver as agentDidResolver, AAKeyManagementSystem, AgentKeyManagementSystem, AgentCredentialIssuerEIP1271, } from '@agentic-trust/veramo-agent-extension';
/**
 * Create a Veramo agent instance for AgenticTrust client
 *
 * @param privateKey - Optional Ethereum private key (hex string with or without 0x prefix)
 *                     If not provided, a key will be generated for the session
 * @param rpcUrl - Optional Sepolia testnet RPC URL
 */
export async function createVeramoAgentForClient(privateKey, rpcUrl) {
    // Initialize DID providers for AA and Agent DIDs
    const aaDidProviders = {};
    const agentDidProviders = {};
    // Initialize KMS instances
    const aaKMS = new AAKeyManagementSystem(aaDidProviders);
    const agentKMS = new AgentKeyManagementSystem(agentDidProviders);
    // Get Ethereum RPC URLs from parameters or defaults
    const rpc = rpcUrl || 'https://sepolia.drpc.org';
    // Create Web3 providers for ethr-did-resolver
    const web3SepoliaProvider = new Web3.providers.HttpProvider(rpc);
    // Create ethr DID provider for client DIDs
    const ethrDidProvider = new EthrDIDProvider({
        defaultKms: 'local',
        networks: [
            {
                name: 'sepolia',
                rpcUrl: rpc,
            },
        ],
    });
    // Create the agent with required plugins
    const agent = createAgent({
        plugins: [
            // Credential issuer for EIP-1271 signatures
            new AgentCredentialIssuerEIP1271(),
            // Key Manager with AA, Agent, and local KMS
            // Local KMS is needed for ethr DIDs and importing private keys
            new KeyManager({
                store: new MemoryKeyStore(),
                kms: {
                    local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
                    aa: aaKMS,
                    agent: agentKMS,
                },
            }),
            // DID Manager - use ethr for client DIDs (simpler than agent DIDs)
            new DIDManager({
                store: new MemoryDIDStore(),
                defaultProvider: 'did:ethr',
                providers: {
                    'did:ethr': ethrDidProvider,
                    ...agentDidProviders,
                },
            }),
            // DID Resolver for multiple DID methods
            new DIDResolverPlugin({
                resolver: new Resolver({
                    ...aaDidResolver(),
                    ...agentDidResolver(),
                    ...ethrDidResolver({
                        networks: [
                            {
                                name: 'sepolia',
                                provider: web3SepoliaProvider,
                            },
                        ],
                    }),
                }),
            }),
        ],
    });
    // If a private key is provided, import it and create DID with it
    // Otherwise, generate a key for this session
    let finalPrivateKey = privateKey;
    if (!finalPrivateKey) {
        // Generate a new private key for this session
        finalPrivateKey = generatePrivateKey();
    }
    else {
    }
    // Normalize and validate private key
    // Remove any whitespace, newlines, or other invalid characters
    let cleanedKey = finalPrivateKey.trim().replace(/\s+/g, '');
    // Remove 0x prefix if present (we'll add it back)
    if (cleanedKey.startsWith('0x')) {
        cleanedKey = cleanedKey.slice(2);
    }
    // Validate it's a valid hex string (64 characters for 32 bytes)
    if (!/^[0-9a-fA-F]{64}$/.test(cleanedKey)) {
        throw new Error(`Invalid private key format. Expected 64 hex characters (32 bytes), ` +
            `got ${cleanedKey.length} characters. ` +
            `Key starts with: ${cleanedKey.substring(0, 10)}...`);
    }
    // Add 0x prefix
    const normalizedKey = `0x${cleanedKey}`;
    // Import the private key into the key manager
    const importedKey = await agent.keyManagerImport({
        type: 'Secp256k1',
        privateKeyHex: normalizedKey,
        kms: 'local',
    });
    // Create DID with the imported key
    const identifier = await agent.didManagerCreate({
        alias: 'default',
        provider: 'did:ethr',
        options: {
            keyRef: importedKey.kid,
        },
    });
    return agent;
}
//# sourceMappingURL=veramoFactory.js.map