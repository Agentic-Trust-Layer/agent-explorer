import { useState } from 'react';
import type { BadgeAdminConfig } from './api';
import { fetchAgentCard as fetchAgentCardViaGraphQL } from './api';

interface EndpointConfig {
  name: string;
  endpoint: string;
  version: string;
  mcpTools?: string[];
  mcpResources?: string[];
  mcpPrompts?: string[];
}

interface AgentCard {
  name?: string;
  description?: string;
  url?: string; // A2A protocol: service endpoint URL (some cards use this as base/service)
  protocolVersion?: string;
  version?: string;
  provider?: {
    organization?: string;
    url?: string;
  };
  skills?: Array<{
    id?: string;
    name: string;
    description?: string;
    inputSchema?: any;
    outputSchema?: any;
    tags?: string[];
    examples?: string[];
    inputModes?: string[];
    outputModes?: string[];
  }>;
  endpoints?: Array<{
    name: string;
    endpoint?: string;
    url?: string;
    version?: string;
  }>;
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function loadEnvConfig(): BadgeAdminConfig {
  const envUrl = import.meta.env.VITE_BADGE_ADMIN_GRAPHQL_URL as string | undefined;
  const envCode = import.meta.env.VITE_BADGE_ADMIN_ACCESS_CODE as string | undefined;
  return {
    graphqlUrl: (typeof envUrl === 'string' && envUrl.trim()) ? envUrl.trim() : '',
    accessCode: (typeof envCode === 'string' && envCode.trim()) ? envCode.trim() : '',
  };
}

export function EndpointTester() {
  const cfg = loadEnvConfig();
  const [endpointJson, setEndpointJson] = useState<string>('');
  const [endpointType, setEndpointType] = useState<'a2a' | 'mcp'>('a2a');
  const [authHeader, setAuthHeader] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [skillInput, setSkillInput] = useState<string>('{}');
  const [skillResult, setSkillResult] = useState<any>(null);
  const [skillLoading, setSkillLoading] = useState(false);

  const parseEndpoint = (): EndpointConfig | null => {
    try {
      const parsed = JSON.parse(endpointJson.trim());
      if (parsed.name && parsed.endpoint) {
        return parsed;
      }
      setError('Invalid endpoint config: missing name or endpoint');
      return null;
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      return null;
    }
  };

  const testA2AEndpoint = async (config: EndpointConfig) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      // Determine the agent card URL
      // If endpoint already points to an agent card file, use it directly
      // Otherwise, try to construct the path
      let agentCardUrl: string;
      const endpoint = config.endpoint.trim();
      
      if (endpoint.includes('/.well-known/agent') || endpoint.includes('/.well-known/agent-card')) {
        // Already points to agent card file
        agentCardUrl = endpoint;
      } else {
        // Try agent.json first (ERC-8004 standard), then agent-card.json as fallback
        const baseUrl = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
        agentCardUrl = `${baseUrl}/.well-known/agent.json`;
      }

      console.log(`[A2A] Fetching agent card from: ${agentCardUrl}`);
      
      // Use server-side GraphQL query to bypass CORS restrictions
      let agentCard: AgentCard;
      try {
        if (!cfg.graphqlUrl || !cfg.accessCode) {
          throw new Error('Missing GraphQL configuration. Cannot fetch agent card server-side.');
        }
        agentCard = await fetchAgentCardViaGraphQL(cfg, agentCardUrl, authHeader.trim() || undefined);
      } catch (fetchError: any) {
        // If GraphQL fetch fails, try fallback URL
        if (fetchError.message?.includes('404') && !endpoint.includes('/.well-known/agent')) {
          const baseUrl = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
          agentCardUrl = `${baseUrl}/.well-known/agent-card.json`;
          console.log(`[A2A] Trying fallback: ${agentCardUrl}`);
          try {
            agentCard = await fetchAgentCardViaGraphQL(cfg, agentCardUrl, authHeader.trim() || undefined);
          } catch (fallbackError: any) {
            throw new Error(`Failed to fetch agent card: ${fallbackError.message}`);
          }
        } else {
          throw new Error(`Failed to fetch agent card: ${fetchError.message}`);
        }
      }
      console.log('[A2A] Agent card fetched:', agentCard);

      const skills = agentCard.skills || [];
      const endpoints = agentCard.endpoints || [];

      // Find the A2A endpoint from the agent card
      // A2A protocol spec: agent card can have:
      // Prefer explicit A2A endpoint entry if present.
      // Fallback to provider.url (some publishers put service URL here).
      // Final fallback to top-level url.
      let a2aServiceEndpoint: string | null = null;
      
      // 1) endpoints[]: accept either `endpoint` or `url` as the actual endpoint string.
      const a2aEndpointFromCard = endpoints.find((e: any) =>
        String(e?.name ?? '').toLowerCase() === 'a2a' || String(e?.name ?? '').toLowerCase() === 'agent-to-agent'
      );
      if (a2aEndpointFromCard) {
        const raw = (a2aEndpointFromCard as any).endpoint ?? (a2aEndpointFromCard as any).url;
        if (typeof raw === 'string' && raw.trim()) a2aServiceEndpoint = raw.trim();
      }

      // 2) provider.url as fallback (some cards put service endpoint here)
      if (!a2aServiceEndpoint && typeof agentCard.provider?.url === 'string' && agentCard.provider.url.trim()) {
        a2aServiceEndpoint = agentCard.provider.url.trim();
      }

      // 3) top-level url as final fallback
      if (!a2aServiceEndpoint && typeof agentCard.url === 'string' && agentCard.url.trim()) {
        a2aServiceEndpoint = agentCard.url.trim();
      }

      // Remove trailing slash if present (we'll add it back when needed)
      if (a2aServiceEndpoint) {
        a2aServiceEndpoint = a2aServiceEndpoint.replace(/\/+$/, '');
      }

      setResults({
        type: 'a2a',
        agentCard,
        agentCardJson: JSON.stringify(agentCard, null, 2),
        skills,
        endpoints,
        reachable: true,
        registrationEndpoint: config.endpoint, // The endpoint that points to agent.json
        a2aServiceEndpoint, // The A2A service endpoint from the agent card (for calling skills)
      });

      // Auto-select first skill if available
      if (skills.length > 0) {
        setSelectedSkill(skills[0].name);
      }
    } catch (e: any) {
      setError(`Failed to fetch agent card: ${e.message}`);
      setResults({ type: 'a2a', reachable: false, error: e.message });
    } finally {
      setLoading(false);
    }
  };

  const testMCPEndpoint = async (config: EndpointConfig) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const endpoint = config.endpoint;
      console.log(`[MCP] Testing MCP endpoint: ${endpoint}`);

      // MCP uses JSON-RPC 2.0 protocol
      // First, try to initialize the connection
      const initResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'badge-admin-tester',
              version: '1.0.0',
            },
          },
        }),
      });

      if (!initResponse.ok) {
        throw new Error(`HTTP ${initResponse.status}: ${initResponse.statusText}`);
      }

      const initResult = await initResponse.json();
      console.log('[MCP] Initialize response:', initResult);

      // List tools
      const toolsResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
        }),
      });

      const toolsResult = toolsResponse.ok ? await toolsResponse.json() : null;

      // List resources
      const resourcesResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'resources/list',
        }),
      });

      const resourcesResult = resourcesResponse.ok ? await resourcesResponse.json() : null;

      // List prompts
      const promptsResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 4,
          method: 'prompts/list',
        }),
      });

      const promptsResult = promptsResponse.ok ? await promptsResponse.json() : null;

      setResults({
        type: 'mcp',
        endpoint,
        reachable: true,
        init: initResult,
        tools: toolsResult?.result?.tools || config.mcpTools || [],
        resources: resourcesResult?.result?.resources || config.mcpResources || [],
        prompts: promptsResult?.result?.prompts || config.mcpPrompts || [],
      });
    } catch (e: any) {
      setError(`Failed to test MCP endpoint: ${e.message}`);
      setResults({ type: 'mcp', reachable: false, error: e.message });
    } finally {
      setLoading(false);
    }
  };

  const testEndpoint = async () => {
    const config = parseEndpoint();
    if (!config) return;

    if (endpointType === 'a2a') {
      await testA2AEndpoint(config);
    } else {
      await testMCPEndpoint(config);
    }
  };

  const callA2ASkill = async () => {
    if (!results || !selectedSkill || !results.agentCard) return;

    // Find skill by id or name
    const skill = results.agentCard.skills?.find((s: any) => 
      (s.id && s.id === selectedSkill) || (s.name && s.name === selectedSkill)
    );
    if (!skill) {
      setError(`Skill "${selectedSkill}" not found`);
      return;
    }

    setSkillLoading(true);
    setError(null);
    setSkillResult(null);

    try {
      // Parse input
      let input: any = {};
      try {
        input = JSON.parse(skillInput.trim() || '{}');
      } catch (e: any) {
        throw new Error(`Invalid JSON input: ${e.message}`);
      }

      // Use the A2A service endpoint from the agent card (not the registration endpoint)
      // According to A2A protocol spec: POST directly to the endpoint specified in agent card
      let a2aServiceEndpoint = (results as any).a2aServiceEndpoint;

      if (!a2aServiceEndpoint) {
        throw new Error('No A2A service endpoint found in agent card. The agent card should contain an endpoints array with an A2A entry.');
      }

      // Remove trailing slash from endpoint
      a2aServiceEndpoint = a2aServiceEndpoint.replace(/\/+$/, '');

      // A2A protocol specification: JSON-RPC 2.0 format
      // Try different method name formats as some servers may expect different formats
      const methodCandidates: string[] = [];
      
      // Add skill.id and skill.name as candidates
      if (skill.id) methodCandidates.push(skill.id);
      if (skill.name) methodCandidates.push(skill.name);
      
      // Try prefixed formats (some servers may use namespaces)
      if (skill.id) {
        methodCandidates.push(`skill.${skill.id}`);
        methodCandidates.push(`agent.${skill.id}`);
      }
      if (skill.name) {
        const normalizedName = skill.name.toLowerCase().replace(/\s+/g, '-');
        methodCandidates.push(`skill.${normalizedName}`);
        methodCandidates.push(`agent.${normalizedName}`);
      }
      
      // Remove duplicates
      const uniqueMethods = [...new Set(methodCandidates)];
      
      console.log(`[A2A] Skill details:`, { id: skill.id, name: skill.name, selectedSkill, methodCandidates: uniqueMethods });

      let lastError: Error | null = null;
      let success = false;

      for (const methodName of uniqueMethods) {
        const a2aPayload = {
          jsonrpc: '2.0',
          method: methodName,
          params: input,
          id: Date.now().toString(),
        };
        
        console.log(`[A2A] Trying method "${methodName}" at A2A endpoint: ${a2aServiceEndpoint}`);

        try {
          // A2A protocol: POST directly to the A2A endpoint (no path modifications)
          const response = await fetch(a2aServiceEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(a2aPayload),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
          }

          // A2A protocol returns JSON-RPC 2.0 response
          const jsonRpcResponse = await response.json();
          
          // Handle JSON-RPC 2.0 response format
          if (jsonRpcResponse.error) {
            const errorCode = jsonRpcResponse.error.code;
            // -32601 is "Method not found" - try next candidate
            if (errorCode === -32601 && uniqueMethods.indexOf(methodName) < uniqueMethods.length - 1) {
              console.log(`[A2A] Method "${methodName}" not found (code: -32601), trying next candidate...`);
              lastError = new Error(
                `Method not found: ${methodName}`
              );
              continue;
            }
            // Other errors or last candidate - throw with details
            const errorMsg = jsonRpcResponse.error.message || JSON.stringify(jsonRpcResponse.error);
            throw new Error(
              `A2A Error${errorCode ? ` (code: ${errorCode})` : ''}: ${errorMsg}. ` +
              `Method used: "${methodName}". ` +
              `Tried methods: ${uniqueMethods.join(', ')}. ` +
              `Available skill IDs: ${results.agentCard.skills?.map((s: any) => s.id || s.name).join(', ') || 'none'}`
            );
          }
          
          // Success: result is in jsonRpcResponse.result
          setSkillResult(jsonRpcResponse.result || jsonRpcResponse);
          console.log('[A2A] Skill result:', jsonRpcResponse);
          success = true;
          break;
        } catch (e: any) {
          // If it's a method not found error and we have more candidates, continue
          if (e.message?.includes('Method not found') && uniqueMethods.indexOf(methodName) < uniqueMethods.length - 1) {
            lastError = e;
            continue;
          }
          // If it's the last candidate or a different error, throw
          if (uniqueMethods.indexOf(methodName) === uniqueMethods.length - 1) {
            throw e;
          }
          lastError = e;
        }
      }

      if (!success && lastError) {
        throw new Error(
          `Failed to call skill. Tried methods: ${uniqueMethods.join(', ')}. ` +
          `Last error: ${lastError.message}. ` +
          `The A2A server may not support these method names, or the skill may not be available.`
        );
      }
    } catch (e: any) {
      setError(`Failed to call skill: ${e.message}`);
    } finally {
      setSkillLoading(false);
    }
  };

  const callMCPTool = async (toolName: string) => {
    if (!results || !results.endpoint) return;

    setSkillLoading(true);
    setError(null);
    setSkillResult(null);

    try {
      const response = await fetch(results.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: {},
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setSkillResult(result);
      console.log('[MCP] Tool result:', result);
    } catch (e: any) {
      setError(`Failed to call tool: ${e.message}`);
    } finally {
      setSkillLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="mb-4 text-lg font-semibold">Endpoint Tester</h2>
      
      <div className="mb-4">
        <label className="mb-2 block text-xs text-slate-400">Endpoint Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="a2a"
              checked={endpointType === 'a2a'}
              onChange={(e) => setEndpointType(e.target.value as 'a2a' | 'mcp')}
            />
            A2A
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="mcp"
              checked={endpointType === 'mcp'}
              onChange={(e) => setEndpointType(e.target.value as 'a2a' | 'mcp')}
            />
            MCP
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs text-slate-400">
          Endpoint JSON (ERC-8004 format)
        </label>
        <textarea
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs"
          rows={8}
          value={endpointJson}
          onChange={(e) => setEndpointJson(e.target.value)}
          placeholder={
            endpointType === 'a2a'
              ? '{"name":"A2A","endpoint":"http://example.com/.well-known/agent-card.json","version":"0.3.0"}'
              : '{"name":"MCP","endpoint":"https://example.com/mcp","version":"2024-11-05","mcpTools":["tool1"],"mcpResources":["resource1"],"mcpPrompts":["prompt1"]}'
          }
        />
      </div>

      {endpointType === 'a2a' ? (
        <div className="mb-4">
          <label className="mb-2 block text-xs text-slate-400">
            Authentication (optional)
          </label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs"
            type="password"
            value={authHeader}
            onChange={(e) => setAuthHeader(e.target.value)}
            placeholder="API key, Bearer token, or Basic auth"
          />
          <div className="mt-1 text-xs text-slate-500">
            Required if the agent card endpoint requires authentication. 
            <br />
            <strong>If browser access works:</strong> Check browser DevTools → Network tab → Request Headers to find the Authorization header or API key.
            <br />
            Formats: API key (auto-converted to Basic auth), "Bearer token", or "Basic base64string"
          </div>
        </div>
      ) : null}

      <button
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm hover:bg-indigo-500 disabled:opacity-50"
        onClick={() => void testEndpoint()}
        disabled={loading || !endpointJson.trim()}
      >
        {loading ? 'Testing...' : 'Test Endpoint'}
      </button>

      {error ? (
        <div className="mt-4 rounded-md border border-rose-900 bg-rose-950/40 p-3 text-sm text-rose-200">
          <div className="font-semibold mb-2">Error</div>
          <div className="mb-2">{error}</div>
          {error.includes('CORS') ? (
            <div className="mt-3 pt-3 border-t border-rose-800 text-xs text-rose-300">
              <div className="font-semibold mb-1">CORS Issue - Server Configuration Required:</div>
              <div className="space-y-1">
                <div>The server needs to include CORS headers in its response. For development/testing, you can:</div>
                <div className="font-mono bg-rose-950/50 p-2 rounded mt-2">
                  <div>Access-Control-Allow-Origin: *</div>
                  <div className="mt-1">Access-Control-Allow-Methods: GET, POST, OPTIONS</div>
                  <div className="mt-1">Access-Control-Allow-Headers: Content-Type, Accept</div>
                </div>
                <div className="mt-2">Or for production, specify your exact origin instead of '*'.</div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {results ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={classNames(
                  'inline-flex rounded-full px-2 py-0.5 text-xs',
                  results.reachable
                    ? 'bg-emerald-900/50 text-emerald-200'
                    : 'bg-rose-900/50 text-rose-200',
                )}
              >
                {results.reachable ? '✓ Reachable' : '✗ Not Reachable'}
              </span>
              <span className="text-xs text-slate-400">{results.type.toUpperCase()}</span>
            </div>

            {results.type === 'a2a' && results.agentCard ? (
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-xs text-slate-400">Registration Endpoint</div>
                  <div className="text-xs font-mono text-slate-300 break-all">
                    {(results as any).registrationEndpoint || 'N/A'}
                  </div>
                </div>
                {(results as any).a2aServiceEndpoint ? (
                  <div>
                    <div className="text-xs text-slate-400">A2A Service Endpoint (from agent card)</div>
                    <div className="text-xs font-mono text-slate-300 break-all">
                      {(results as any).a2aServiceEndpoint}
                    </div>
                  </div>
                ) : (
                  <div className="rounded border border-amber-900 bg-amber-950/40 p-2">
                    <div className="text-xs text-amber-200">
                      ⚠️ No A2A service endpoint found in agent card. The agent card should contain either a `url` field or an `endpoints` array with an A2A entry.
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-400">Agent Name</div>
                  <div className="text-sm font-semibold">{results.agentCard.name || 'N/A'}</div>
                </div>
                {results.agentCard.description ? (
                  <div>
                    <div className="text-xs text-slate-400">Description</div>
                    <div className="text-sm">{results.agentCard.description}</div>
                  </div>
                ) : null}
                {(results as any).agentCardJson ? (
                  <div>
                    <div className="text-xs text-slate-400">Agent Card JSON (retrieved)</div>
                    <textarea
                      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200"
                      rows={10}
                      readOnly
                      value={(results as any).agentCardJson}
                    />
                  </div>
                ) : null}
                <div>
                  <div className="text-xs text-slate-400">Skills ({results.skills?.length || 0})</div>
                  <div className="mt-1 space-y-1">
                    {results.skills && results.skills.length > 0 ? (
                      results.skills.map((skill: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded border border-slate-800 bg-slate-900 p-2 text-xs"
                        >
                          <div className="font-semibold">{skill.name || skill.id}</div>
                          {skill.description ? (
                            <div className="mt-1 text-slate-400">{skill.description}</div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">No skills found</div>
                    )}
                  </div>
                </div>
                {results.skills && results.skills.length > 0 ? (
                  <div>
                    <div className="mb-2 text-xs text-slate-400">Test Skill</div>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                      >
                        <option value="">Select a skill...</option>
                        {results.skills.map((skill: any, idx: number) => (
                          <option key={idx} value={skill.id || skill.name}>
                            {skill.name || skill.id}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedSkill ? (
                      <div className="mt-2 space-y-2">
                        <div>
                          <label className="mb-1 block text-xs text-slate-400">Input (JSON)</label>
                          <textarea
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs"
                            rows={4}
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder='{"key": "value"}'
                          />
                        </div>
                        <button
                          className="rounded-md bg-indigo-600 px-4 py-2 text-sm hover:bg-indigo-500 disabled:opacity-50"
                          onClick={() => void callA2ASkill()}
                          disabled={skillLoading}
                        >
                          {skillLoading ? 'Calling...' : `Call ${selectedSkill}`}
                        </button>
                        {skillResult ? (
                          <div className="mt-2 rounded-md border border-slate-800 bg-slate-950 p-3">
                            <div className="mb-1 text-xs text-slate-400">Result</div>
                            <pre className="overflow-auto text-xs">
                              {JSON.stringify(skillResult, null, 2)}
                            </pre>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {results.type === 'mcp' ? (
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-xs text-slate-400">Endpoint</div>
                  <div className="text-sm font-mono">{results.endpoint}</div>
                </div>
                {results.tools && results.tools.length > 0 ? (
                  <div>
                    <div className="text-xs text-slate-400">Tools ({results.tools.length})</div>
                    <div className="mt-1 space-y-1">
                      {results.tools.map((tool: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded border border-slate-800 bg-slate-900 p-2 text-xs"
                        >
                          <div>
                            <div className="font-semibold">
                              {typeof tool === 'string' ? tool : tool.name || tool}
                            </div>
                            {typeof tool === 'object' && tool.description ? (
                              <div className="mt-1 text-slate-400">{tool.description}</div>
                            ) : null}
                          </div>
                          <button
                            className="rounded bg-indigo-600 px-2 py-1 text-xs hover:bg-indigo-500 disabled:opacity-50"
                            onClick={() => void callMCPTool(typeof tool === 'string' ? tool : tool.name || tool)}
                            disabled={skillLoading}
                          >
                            {skillLoading ? 'Calling...' : 'Call'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {results.resources && results.resources.length > 0 ? (
                  <div>
                    <div className="text-xs text-slate-400">Resources ({results.resources.length})</div>
                    <div className="mt-1 space-y-1">
                      {results.resources.map((resource: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded border border-slate-800 bg-slate-900 p-2 text-xs"
                        >
                          {typeof resource === 'string' ? resource : resource.name || resource}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {results.prompts && results.prompts.length > 0 ? (
                  <div>
                    <div className="text-xs text-slate-400">Prompts ({results.prompts.length})</div>
                    <div className="mt-1 space-y-1">
                      {results.prompts.map((prompt: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded border border-slate-800 bg-slate-900 p-2 text-xs"
                        >
                          {typeof prompt === 'string' ? prompt : prompt.name || prompt}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {skillResult ? (
                  <div className="mt-4 rounded-md border border-slate-800 bg-slate-950 p-3">
                    <div className="mb-1 text-xs text-slate-400">Tool Result</div>
                    <pre className="overflow-auto text-xs">
                      {JSON.stringify(skillResult, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

