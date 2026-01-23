const DEFAULT_BASE_PATH = '/api/agents';
function getFetch(config) {
    if (config?.fetch)
        return config.fetch;
    if (typeof fetch !== 'undefined')
        return fetch;
    throw new Error('Global fetch is not available. Provide a custom fetch implementation via config.fetch.');
}
function getBasePath(config) {
    return config?.basePath ?? DEFAULT_BASE_PATH;
}
export async function createAgent(input, config) {
    const fetchImpl = getFetch(config);
    const basePath = getBasePath(config);
    const response = await fetchImpl(`${basePath}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message = body?.message || body?.error || 'Failed to create agent';
        throw new Error(message);
    }
    return body;
}
export async function updateAgentRegistration(input, config) {
    const fetchImpl = getFetch(config);
    const basePath = getBasePath(config);
    const encodedDid = encodeURIComponent(input.did8004);
    const response = await fetchImpl(`${basePath}/${encodedDid}/registration`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            registration: input.registration,
        }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message = body?.message || body?.error || 'Failed to update agent registration';
        throw new Error(message);
    }
    return body;
}
//# sourceMappingURL=client.js.map