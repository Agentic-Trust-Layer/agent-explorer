type JsonRpcResponse = { result?: any; error?: any };

async function rpcCall(rpcUrl: string, method: string, params: any[]): Promise<JsonRpcResponse> {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`RPC HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ''}`);
  }
  return (await res.json().catch(() => ({}))) as JsonRpcResponse;
}

export async function isSmartAccountViaRpc(rpcUrl: string, address: string): Promise<boolean> {
  const addr = address.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) throw new Error(`Invalid address: ${address}`);
  const json = await rpcCall(rpcUrl, 'eth_getCode', [addr, 'latest']);
  if (json?.error) throw new Error(`RPC error: ${JSON.stringify(json.error).slice(0, 300)}`);
  const code = typeof json?.result === 'string' ? json.result : '';
  // "0x" (or "0x0") means no code => EOA
  const normalized = code.toLowerCase();
  return normalized !== '0x' && normalized !== '0x0';
}

