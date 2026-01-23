import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
/**
 * Org Identity Client - ENS utilities for organizations
 * Uses AccountProvider (Ports & Adapters pattern) for chain I/O.
 * Provides helpers to resolve an org's ENS name to its account address and URL text record.
 */
export class OrgIdentityClient {
    accountProvider;
    ensRegistryAddress;
    publicClient = null;
    constructor(accountProvider, options) {
        this.accountProvider = accountProvider;
        this.ensRegistryAddress = (options?.ensRegistry || '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e');
        if (options?.rpcUrl) {
            // @ts-ignore - viem version compatibility issue
            this.publicClient = createPublicClient({ chain: sepolia, transport: http(options.rpcUrl) });
        }
        // Try to extract publicClient from AccountProvider if it's a ViemAccountProvider
        const viemProvider = accountProvider;
        if (viemProvider.publicClient) {
            this.publicClient = viemProvider.publicClient;
        }
    }
    /** Resolve the account address for an org ENS name via resolver.addr(namehash(name)). */
    async getOrgAccountByName(orgName) {
        const ensName = this.normalizeEnsName(orgName);
        if (!ensName)
            return null;
        const node = this.namehash(ensName);
        const resolver = await this.getResolver(node);
        if (!resolver)
            return null;
        const RESOLVER_ABI = [
            { name: 'addr', type: 'function', stateMutability: 'view', inputs: [{ name: 'node', type: 'bytes32' }], outputs: [{ name: '', type: 'address' }] },
        ];
        try {
            const addr = await this.accountProvider.call({
                to: resolver,
                abi: RESOLVER_ABI,
                functionName: 'addr',
                args: [node],
            });
            if (addr && /^0x[a-fA-F0-9]{40}$/.test(addr) && !this.isZeroAddress(addr)) {
                return addr;
            }
        }
        catch { }
        return null;
    }
    async getOrgEoaByAccount(orgAccount) {
        if (this.publicClient) {
            // @ts-ignore - viem version compatibility issue
            const eoa = await this.publicClient.readContract({
                address: orgAccount,
                abi: [{ name: 'owner', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] }],
                functionName: 'owner',
            });
            return eoa;
        }
        return null;
    }
    /** Resolve the URL text record for an org ENS name via resolver.text(namehash(name), 'url'). */
    async getOrgUrlByName(orgName) {
        const ensName = this.normalizeEnsName(orgName);
        if (!ensName)
            return null;
        const node = this.namehash(ensName);
        const resolver = await this.getResolver(node);
        if (!resolver)
            return null;
        const RESOLVER_ABI = [
            { name: 'text', type: 'function', stateMutability: 'view', inputs: [{ name: 'node', type: 'bytes32' }, { name: 'key', type: 'string' }], outputs: [{ name: '', type: 'string' }] },
        ];
        try {
            const value = await this.accountProvider.call({
                to: resolver,
                abi: RESOLVER_ABI,
                functionName: 'text',
                args: [node, 'url'],
            });
            const trimmed = (value || '').trim();
            return trimmed.length > 0 ? trimmed : null;
        }
        catch { }
        return null;
    }
    /** Reverse lookup: account address -> ENS name via resolver.name(reverseNode) */
    async getOrgNameByAccount(account) {
        const ENS_REGISTRY_ABI = [
            { name: 'resolver', type: 'function', stateMutability: 'view', inputs: [{ name: 'node', type: 'bytes32' }], outputs: [{ name: '', type: 'address' }] },
        ];
        const RESOLVER_ABI = [
            { name: 'name', type: 'function', stateMutability: 'view', inputs: [{ name: 'node', type: 'bytes32' }], outputs: [{ name: '', type: 'string' }] },
        ];
        const lower = account.toLowerCase();
        const reverseNode = this.namehash(`${lower.slice(2)}.addr.reverse`);
        let resolver = null;
        try {
            resolver = await this.accountProvider.call({
                to: this.ensRegistryAddress,
                abi: ENS_REGISTRY_ABI,
                functionName: 'resolver',
                args: [reverseNode],
            });
        }
        catch { }
        if (!resolver || this.isZeroAddress(resolver))
            return null;
        try {
            const name = await this.accountProvider.call({
                to: resolver,
                abi: RESOLVER_ABI,
                functionName: 'name',
                args: [reverseNode],
            });
            const normalized = (name || '').trim().toLowerCase();
            return normalized.length > 0 ? normalized : null;
        }
        catch {
            return null;
        }
    }
    // --- internals ---
    async getResolver(node) {
        const ENS_REGISTRY_ABI = [
            { name: 'resolver', type: 'function', stateMutability: 'view', inputs: [{ name: 'node', type: 'bytes32' }], outputs: [{ name: '', type: 'address' }] },
        ];
        try {
            const resolver = await this.accountProvider.call({
                to: this.ensRegistryAddress,
                abi: ENS_REGISTRY_ABI,
                functionName: 'resolver',
                args: [node],
            });
            if (resolver && !this.isZeroAddress(resolver))
                return resolver;
        }
        catch { }
        return null;
    }
    normalizeEnsName(name) {
        const cleaned = (name || '').trim().toLowerCase().replace(/^ens:\s*/i, '');
        if (!cleaned)
            return '';
        if (!/\./.test(cleaned))
            return `${cleaned}.eth`;
        return cleaned;
    }
    namehash(name) {
        const { keccak256, toUtf8Bytes } = require('ethers');
        let node = '0x' + '00'.repeat(32);
        if (!name)
            return node;
        const labels = name.split('.');
        for (let i = labels.length - 1; i >= 0; i--) {
            const label = labels[i];
            if (!label)
                continue;
            const labelSha = keccak256(toUtf8Bytes(label));
            node = keccak256(Buffer.concat([Buffer.from(node.slice(2), 'hex'), Buffer.from(labelSha.slice(2), 'hex')]));
        }
        return node;
    }
    isZeroAddress(addr) {
        return /^0x0{40}$/i.test(addr);
    }
}
//# sourceMappingURL=OrgIdentityClient.js.map