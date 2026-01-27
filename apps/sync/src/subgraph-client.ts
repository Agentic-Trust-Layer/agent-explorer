import { ETH_SEPOLIA_GRAPHQL_URL, BASE_SEPOLIA_GRAPHQL_URL, OP_SEPOLIA_GRAPHQL_URL, GRAPHQL_API_KEY } from './env';

export type SubgraphEndpoint = {
  url: string;
  chainId: number;
  name: string;
};

export const SUBGRAPH_ENDPOINTS: SubgraphEndpoint[] = [
  { url: ETH_SEPOLIA_GRAPHQL_URL, chainId: 11155111, name: 'eth-sepolia' },
  { url: BASE_SEPOLIA_GRAPHQL_URL, chainId: 84532, name: 'base-sepolia' },
  { url: OP_SEPOLIA_GRAPHQL_URL, chainId: 11155420, name: 'op-sepolia' },
].filter((ep) => ep.url && ep.url.trim());

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(
  graphqlUrl: string,
  body: { query: string; variables: Record<string, any> },
  maxRetries: number = 3,
): Promise<any> {
  // Normalize URL: some gateways expect <key>/<subgraph> without trailing /graphql
  const endpoint = (graphqlUrl || '').replace(/\/graphql\/?$/i, '');

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json',
  };

  if (GRAPHQL_API_KEY) {
    headers['Authorization'] = `Bearer ${GRAPHQL_API_KEY}`;
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const timeoutMs = 60_000;
    const controller = new AbortController();
    let timeoutHandle: any;
    try {
      const res = await Promise.race([
        fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        } as any),
        new Promise<never>((_, reject) => {
          timeoutHandle = setTimeout(() => {
            try {
              controller.abort();
            } catch {}
            reject(new Error(`GraphQL timeout after ${timeoutMs}ms`));
          }, timeoutMs);
        }),
      ]);

      if (timeoutHandle) clearTimeout(timeoutHandle);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`GraphQL ${res.status}: ${text || res.statusText}`);
      }

      const json = await res.json();
      return json;
    } catch (e: any) {
      if (timeoutHandle) clearTimeout(timeoutHandle);

      const msg = String(e?.message || e || '');
      const lower = msg.toLowerCase();
      const isRetryableHttp =
        lower.includes('graphql 429') ||
        lower.includes('graphql 502') ||
        lower.includes('graphql 503') ||
        lower.includes('graphql 504') ||
        lower.includes('timeout') ||
        lower.includes('econnreset') ||
        lower.includes('fetch failed');

      if (!isRetryableHttp || attempt >= maxRetries) {
        throw e;
      }

      const backoffMs = Math.min(30_000, 750 * Math.pow(2, attempt)) + Math.floor(Math.random() * 250);
      console.warn(`[subgraph] Retry ${attempt + 1}/${maxRetries} after ${backoffMs}ms: ${msg}`);
      await sleep(backoffMs);
    }
  }

  throw new Error('fetchJson: exhausted retries');
}

async function fetchQueryFieldNames(graphqlUrl: string): Promise<Set<string>> {
  const introspectionQuery = {
    query: `query IntrospectQueryFields {
      __schema {
        queryType {
          fields { name }
        }
      }
    }`,
    variables: {},
  };
  try {
    const resp = await fetchJson(graphqlUrl, introspectionQuery, 1);
    const fields = (resp?.data?.__schema?.queryType?.fields || []) as any[];
    return new Set(fields.map((f: any) => String(f?.name || '')).filter(Boolean));
  } catch (e) {
    console.warn('[subgraph] Introspection failed; cannot validate schema up-front:', e);
    return new Set<string>();
  }
}

export const AGENTS_QUERY = `query Agents($first: Int!, $skip: Int!) {
  agents(first: $first, skip: $skip, orderBy: mintedAt, orderDirection: asc) {
    id
    mintedAt
    agentURI
    name
    description
    image
    ensName
    agentWallet
    a2aEndpoint
    chatEndpoint
    registration {
      id
      agentURI
      raw
      type
      name
      description
      image
      supportedTrust
      a2aEndpoint
      chatEndpoint
      ensName
      updatedAt
    }
    owner { id }
  }
}`;

// NFT on-chain metadata KV rows (AgentMetadata entity)
// NOTE: some subgraphs expose this as agentMetadata_collection (not agentMetadatas).
export const AGENT_METADATA_COLLECTION_QUERY = `query AgentMetadataCollection($first: Int!, $skip: Int!) {
  agentMetadata_collection(first: $first, skip: $skip, orderBy: setAt, orderDirection: asc) {
    id
    key
    value
    indexedKey
    setAt
    setBy
    txHash
    blockNumber
    timestamp
  }
}`;

export const FEEDBACKS_QUERY = `query RepFeedbacks($first: Int!, $skip: Int!) {
  repFeedbacks(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
    id
    agent { id }
    clientAddress
    feedbackIndex
    score
    tag1
    tag2
    endpoint
    feedbackUri
    feedbackJson
    feedbackType
    domain
    comment
    ratingPct
    feedbackTimestamp
    feedbackHash
    txHash
    blockNumber
    timestamp
  }
}`;

export const FEEDBACK_REVOCATIONS_QUERY = `query RepFeedbackRevokeds($first: Int!, $skip: Int!) {
  repFeedbackRevokeds(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
    id
    agent { id }
    clientAddress
    feedbackIndex
    txHash
    blockNumber
    timestamp
  }
}`;

export const FEEDBACK_RESPONSES_QUERY = `query RepResponseAppendeds($first: Int!, $skip: Int!) {
  repResponseAppendeds(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
    id
    agent { id }
    clientAddress
    feedbackIndex
    responder
    responseUri
    responseJson
    responseHash
    txHash
    blockNumber
    timestamp
  }
}`;

export const VALIDATION_REQUESTS_QUERY = `query ValidationRequests($first: Int!, $skip: Int!) {
  validationRequests(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
    id
    validatorAddress
    agent { id }
    requestUri
    requestJson
    requestHash
    txHash
    blockNumber
    timestamp
  }
}`;

export const VALIDATION_RESPONSES_QUERY = `query ValidationResponses($first: Int!, $skip: Int!) {
  validationResponses(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
    id
    validatorAddress
    agent { id }
    requestHash
    response
    responseUri
    responseJson
    responseHash
    tag
    txHash
    blockNumber
    timestamp
  }
}`;

export const ASSOCIATIONS_QUERY = `query Associations($first: Int!, $skip: Int!) {
  associations(first: $first, skip: $skip, orderBy: lastUpdatedBlockNumber, orderDirection: asc) {
    id
    initiatorAccount { id }
    approverAccount { id }
    initiator
    approver
    validAt
    validUntil
    interfaceId
    data
    initiatorKeyType
    approverKeyType
    initiatorSignature
    approverSignature
    revokedAt
    createdTxHash
    createdBlockNumber
    createdTimestamp
    lastUpdatedTxHash
    lastUpdatedBlockNumber
    lastUpdatedTimestamp
  }
}`;

export const ASSOCIATION_REVOCATIONS_QUERY = `query AssociationRevocations($first: Int!, $skip: Int!) {
  associationRevocations(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
    id
    associationId
    revokedAt
    txHash
    blockNumber
    timestamp
  }
}`;

export async function fetchAllFromSubgraph(
  graphqlUrl: string,
  query: string,
  field: string,
  opts?: {
    optional?: boolean;
    first?: number;
    maxSkip?: number;
    maxRetries?: number;
    buildVariables?: (args: { first: number; skip: number }) => Record<string, any>;
  },
): Promise<any[]> {
  const pageSize = opts?.first ?? 500;
  const maxSkip = opts?.maxSkip ?? 5000;
  const optional = opts?.optional ?? false;
  const maxRetries = opts?.maxRetries ?? (optional ? 6 : 3);
  const allItems: any[] = [];
  let skip = 0;
  let hasMore = true;
  let batchNumber = 0;

  // Fail fast if schema missing required root field (best-effort; introspection can be disabled)
  const queryFields = await fetchQueryFieldNames(graphqlUrl);
  if (queryFields.size > 0 && !queryFields.has(field) && !optional) {
    const available = Array.from(queryFields).sort().slice(0, 80).join(', ');
    throw new Error(
      `Subgraph schema mismatch: Query has no field "${field}". ` +
        `Available query fields (first 80): ${available}`,
    );
  }

  while (hasMore) {
    if (skip > maxSkip) {
      console.warn(`[subgraph] Reached skip limit (${maxSkip}); stopping pagination after ${allItems.length} items`);
      break;
    }

    batchNumber++;
    if (batchNumber === 1) {
      console.info(`[subgraph] Fetching first page (pageSize=${pageSize}, field=${field})`);
    }

    const variables = opts?.buildVariables ? opts.buildVariables({ first: pageSize, skip }) : { first: pageSize, skip };

    let resp: any;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        resp = await fetchJson(graphqlUrl, { query, variables }, maxRetries);
        break;
      } catch (e: any) {
        const msg = String(e?.message || e || '');
        const lower = msg.toLowerCase();
        const isRetryableHttp =
          lower.includes('graphql 429') ||
          lower.includes('graphql 502') ||
          lower.includes('graphql 503') ||
          lower.includes('graphql 504') ||
          lower.includes('timeout') ||
          lower.includes('econnreset') ||
          lower.includes('fetch failed');
        if (!isRetryableHttp || attempt >= maxRetries) {
          if (optional) {
            console.warn(`[subgraph] Skipping due to fetch error (optional=true): ${msg}`);
            return allItems;
          }
          throw e;
        }
        const backoffMs = Math.min(30_000, 750 * Math.pow(2, attempt)) + Math.floor(Math.random() * 250);
        console.warn(`[subgraph] Network/HTTP retry ${attempt + 1}/${maxRetries} (skip=${skip}, batch=${batchNumber}) after ${backoffMs}ms: ${msg}`);
        await sleep(backoffMs);
      }
    }

    if (resp?.errors && Array.isArray(resp.errors) && resp.errors.length > 0) {
      const missingField = resp.errors.some((err: any) => {
        const message = err?.message || '';
        if (typeof message !== 'string') return false;
        return message.includes(`field "${field}"`) || message.includes(`field \`${field}\``) || message.includes(field);
      });
      const skipLimitError = resp.errors.some((err: any) => {
        const message = String(err?.message || '').toLowerCase();
        return message.includes('skip') && message.includes('argument');
      });
      const overloadedError = resp.errors.some((err: any) => {
        const message = String(err?.message || '').toLowerCase();
        return (
          message.includes('service is overloaded') ||
          (message.includes('overloaded') && message.includes('service')) ||
          message.includes('can not run the query right now') ||
          message.includes('try again in a few minutes') ||
          message.includes('rate limit') ||
          message.includes('too many requests')
        );
      });

      if (optional && missingField) {
        console.warn(`[subgraph] Skipping: subgraph does not expose field "${field}". Message: ${resp.errors[0]?.message || 'unknown'}`);
        return [];
      }
      if (optional && skipLimitError) {
        console.warn(`[subgraph] Skipping remaining pages: ${resp.errors[0]?.message || 'skip limit hit'}`);
        return allItems;
      }
      if (overloadedError) {
        let succeeded = false;
        const overloadRetries = optional ? maxRetries : 1;
        for (let attempt = 0; attempt < overloadRetries; attempt++) {
          const backoffMs = Math.min(60_000, 1_000 * Math.pow(2, attempt)) + Math.floor(Math.random() * 500);
          console.warn(`[subgraph] Subgraph overloaded; retry ${attempt + 1}/${overloadRetries} after ${backoffMs}ms. Error: ${resp.errors[0]?.message || 'unknown'}`);
          await sleep(backoffMs);
          const retryResp = await fetchJson(graphqlUrl, { query, variables }, 1).catch((e: any) => ({ errors: [{ message: String(e?.message || e || '') }] }));
          if (!retryResp?.errors || retryResp.errors.length === 0) {
            resp = retryResp;
            succeeded = true;
            break;
          }
        }
        if (!succeeded) {
          console.warn(`[subgraph] Skipping due to overload (optional=${optional}). itemsSoFar=${allItems.length}`);
          return allItems;
        }
      }

      if (resp?.errors && Array.isArray(resp.errors) && resp.errors.length > 0) {
        const errJson = JSON.stringify(resp.errors, null, 2) ?? String(resp.errors);
        if (optional) {
          console.warn(`[subgraph] Skipping due to GraphQL errors (optional=true). itemsSoFar=${allItems.length} errors=${errJson}`);
          return allItems;
        }
        throw new Error(`GraphQL query failed: ${errJson}`);
      }
    }

    const batchItems = (((resp?.data?.[field] as any[]) || []) as any[]).filter(Boolean);

    if (batchItems.length === 0) {
      hasMore = false;
      console.info(`[subgraph] No more rows found, stopping pagination`);
    } else {
      allItems.push(...batchItems);
      if (batchItems.length < pageSize) {
        hasMore = false;
        console.info(`[subgraph] Reached end (got ${batchItems.length} < ${pageSize})`);
      } else {
        skip += pageSize;
        if (skip > maxSkip) {
          console.warn(`[subgraph] Next skip (${skip}) would exceed limit (${maxSkip}); stopping pagination`);
          hasMore = false;
        }
      }
    }
  }

  return allItems;
}
