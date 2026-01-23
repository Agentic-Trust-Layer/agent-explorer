const ENS_DID_PREFIX = 'did:ens:';
function encodeIfNeeded(value, encode) {
    return encode === false ? value : encodeURIComponent(value);
}
/**
 * Parse a did:ens identifier.
 *
 * Accepts encoded or decoded strings and expects format:
 *   did:ens:chainId:ensname
 */
export function parseEnsDid(raw) {
    const encodedInput = (raw ?? '').toString().trim();
    if (!encodedInput) {
        throw new Error('Missing ENS DID parameter');
    }
    let decoded;
    try {
        decoded = decodeURIComponent(encodedInput);
    }
    catch (error) {
        throw new Error(`Invalid percent-encoding in ENS DID: ${error.message}`);
    }
    if (!decoded.startsWith(ENS_DID_PREFIX)) {
        throw new Error(`Invalid ENS DID format: ${decoded}. Expected format: did:ens:chainId:ensname`);
    }
    const parts = decoded.split(':');
    if (parts.length < 4) {
        throw new Error(`ENS DID missing components: ${decoded}. Expected format: did:ens:chainId:ensname`);
    }
    const chainIdPart = parts[2] ?? '';
    const ensNamePart = parts.slice(3).join(':').trim();
    const chainId = Number.parseInt(chainIdPart, 10);
    if (!Number.isFinite(chainId) || chainId <= 0) {
        throw new Error(`Invalid chainId in ENS DID: ${decoded}`);
    }
    if (!ensNamePart) {
        throw new Error(`Invalid ENS name in ENS DID: ${decoded}`);
    }
    // Validate that ENS name ends with .eth
    if (!ensNamePart.toLowerCase().endsWith('.eth')) {
        throw new Error(`Invalid ENS name in ENS DID: ${decoded}. ENS name must end with .eth`);
    }
    const did = `${ENS_DID_PREFIX}${chainId}:${ensNamePart}`;
    return {
        did,
        method: 'ens',
        chainId,
        ensName: ensNamePart,
        encoded: encodeIfNeeded(did, true),
    };
}
/**
 * Build a did:ens identifier from chain id and ENS name.
 */
export function buildEnsDid(chainId, ensName, options) {
    const chainIdStr = typeof chainId === 'number'
        ? chainId.toString(10)
        : chainId?.toString() ?? '';
    const ensNameStr = ensName?.toString() ?? '';
    const normalizedChainId = chainIdStr.trim();
    const normalizedEnsName = ensNameStr.trim();
    if (!normalizedChainId) {
        throw new Error('Chain ID is required to build ENS DID');
    }
    if (!normalizedEnsName) {
        throw new Error('ENS name is required to build ENS DID');
    }
    const chainIdNum = Number.parseInt(normalizedChainId, 10);
    if (!Number.isFinite(chainIdNum) || chainIdNum <= 0) {
        throw new Error(`Invalid chain ID: ${normalizedChainId}`);
    }
    // Ensure ENS name ends with .eth (case-insensitive check)
    const lowerEnsName = normalizedEnsName.toLowerCase();
    if (!lowerEnsName.endsWith('.eth')) {
        throw new Error(`Invalid ENS name: ${normalizedEnsName}. ENS name must end with .eth to be a valid did:ens`);
    }
    const did = `${ENS_DID_PREFIX}${chainIdNum}:${normalizedEnsName}`;
    const encode = options?.encode ?? true;
    return encodeIfNeeded(did, encode);
}
/**
 * Build an ENS DID from agent name and organization name.
 * e.g. agentName = "my-agent", orgName = "org", chainId = 11155111
 *  → did:ens:11155111:my-agent.org.eth
 */
export function buildEnsDidFromAgentAndOrg(chainId, agentName, orgName, options) {
    if (!agentName || typeof agentName !== 'string') {
        throw new Error('Agent name is required');
    }
    if (!orgName || typeof orgName !== 'string') {
        throw new Error('Organization name is required');
    }
    // Normalize agent name: lowercase and replace spaces with hyphens
    const agentNameLabel = agentName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!agentNameLabel) {
        throw new Error('Agent name cannot be empty');
    }
    // Normalize org name: lowercase and remove .eth suffix if present
    const orgNameClean = orgName.trim().toLowerCase().replace(/\.eth$/i, '');
    if (!orgNameClean) {
        throw new Error('Organization name cannot be empty');
    }
    // Construct full ENS name: agentName.orgName.eth
    const fullEnsName = `${agentNameLabel}.${orgNameClean}.eth`;
    return buildEnsDid(chainId, fullEnsName, options);
}
//# sourceMappingURL=didEns.js.map