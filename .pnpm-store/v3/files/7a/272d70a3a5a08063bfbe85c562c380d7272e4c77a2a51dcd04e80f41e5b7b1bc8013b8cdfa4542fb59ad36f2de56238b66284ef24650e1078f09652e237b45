const ETHR_DID_PREFIX = 'did:ethr:';
function encodeIfNeeded(value, encode) {
    return encode === false ? value : encodeURIComponent(value);
}
/**
 * Parse a did:ethr identifier.
 *
 * Accepts encoded or decoded strings and supports:
 *   did:ethr:chainId:0x..., did:ethr:0x...
 */
export function parseEthrDid(raw) {
    const encodedInput = (raw ?? '').toString().trim();
    if (!encodedInput) {
        throw new Error('Missing ETHR DID parameter');
    }
    let decoded;
    try {
        decoded = decodeURIComponent(encodedInput);
    }
    catch (error) {
        throw new Error(`Invalid percent-encoding in ETHR DID: ${error.message}`);
    }
    if (!decoded.startsWith(ETHR_DID_PREFIX)) {
        throw new Error(`Invalid ETHR DID format: ${decoded}. Expected format: did:ethr:chainId:account or did:ethr:account`);
    }
    const segments = decoded.split(':');
    const accountCandidate = segments[segments.length - 1];
    if (!accountCandidate || !accountCandidate.startsWith('0x')) {
        throw new Error('ETHR DID is missing account component');
    }
    const remaining = segments.slice(2, -1);
    let chainId = 0;
    for (let i = remaining.length - 1; i >= 0; i -= 1) {
        const value = remaining[i];
        if (value && /^\d+$/.test(value)) {
            const parsed = Number.parseInt(value, 10);
            if (Number.isFinite(parsed) && parsed > 0) {
                chainId = parsed;
                break;
            }
        }
    }
    if (!chainId) {
        throw new Error(`Missing or invalid chainId in ETHR DID: ${decoded}`);
    }
    if (accountCandidate.length !== 42 ||
        !/^0x[a-fA-F0-9]{40}$/.test(accountCandidate)) {
        throw new Error('Invalid account address in ETHR DID');
    }
    const did = `${ETHR_DID_PREFIX}${chainId}:${accountCandidate}`;
    return {
        did,
        method: 'ethr',
        chainId,
        account: accountCandidate,
        encoded: encodeIfNeeded(did, true),
    };
}
/**
 * Build a did:ethr identifier from chain id and account address.
 */
export function buildEthrDid(chainId, account, options) {
    const chainIdStr = typeof chainId === 'number'
        ? chainId.toString(10)
        : chainId?.toString() ?? '';
    const accountStr = account?.toString() ?? '';
    const normalizedChainId = chainIdStr.trim();
    const normalizedAccount = accountStr.trim();
    if (!normalizedChainId) {
        throw new Error('Chain ID is required to build ETHR DID');
    }
    if (!normalizedAccount) {
        throw new Error('Account address is required to build ETHR DID');
    }
    const chainIdNum = Number.parseInt(normalizedChainId, 10);
    if (!Number.isFinite(chainIdNum) || chainIdNum <= 0) {
        throw new Error(`Invalid chain ID: ${normalizedChainId}`);
    }
    if (normalizedAccount.length !== 42 ||
        !/^0x[a-fA-F0-9]{40}$/.test(normalizedAccount)) {
        throw new Error(`Invalid account address: ${normalizedAccount}`);
    }
    const did = `${ETHR_DID_PREFIX}${chainIdNum}:${normalizedAccount}`;
    const encode = options?.encode ?? true;
    return encodeIfNeeded(did, encode);
}
//# sourceMappingURL=didEthr.js.map