export type TrustLedgerBadgeDefinition = {
  badgeId: string;
  program: string;
  name: string;
  description: string | null;
  iconRef: string | null;
  points: number;
  ruleId: string;
  ruleJson: string | null;
  active: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TrustLedgerBadgeDefinitionInput = {
  badgeId: string;
  program: string;
  name: string;
  description?: string | null;
  iconRef?: string | null;
  points: number;
  ruleId: string;
  ruleJson?: string | null;
  active: boolean;
};

export type BadgeAdminConfig = {
  graphqlUrl: string;
  accessCode: string;
};

type GraphQLError = { message: string };

async function graphqlRequest<T>(
  cfg: BadgeAdminConfig,
  query: string,
  variables?: Record<string, any>,
): Promise<T> {
  if (!cfg.graphqlUrl) {
    throw new Error('Missing GraphQL URL (set VITE_BADGE_ADMIN_GRAPHQL_URL)');
  }
  if (!cfg.accessCode) {
    throw new Error('Missing access code (set VITE_BADGE_ADMIN_ACCESS_CODE)');
  }
  let resp: Response;
  try {
    resp = await fetch(cfg.graphqlUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${cfg.accessCode}`,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (e: any) {
    // Browser fetch throws TypeError("Failed to fetch") for network errors and CORS blocks.
    const msg = e?.message || String(e);
    throw new Error(
      `Failed to reach GraphQL server at ${cfg.graphqlUrl}. ` +
        `This is usually a network/CORS issue between badge-admin and the GraphQL server. ` +
        `Underlying error: ${msg}`,
    );
  }
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`HTTP ${resp.status}: ${text || resp.statusText}`);
  }
  const json = (await resp.json()) as { data?: any; errors?: GraphQLError[] };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'));
  }
  return json.data as T;
}

export async function listBadgeDefinitions(
  cfg: BadgeAdminConfig,
  args?: { program?: string; active?: boolean },
): Promise<TrustLedgerBadgeDefinition[]> {
  const query = `
    query ListTrustLedgerBadgeDefinitions($program: String, $active: Boolean) {
      trustLedgerBadgeDefinitions(program: $program, active: $active) {
        badgeId
        program
        name
        description
        iconRef
        points
        ruleId
        ruleJson
        active
        createdAt
        updatedAt
      }
    }
  `;
  const data = await graphqlRequest<{ trustLedgerBadgeDefinitions: TrustLedgerBadgeDefinition[] }>(
    cfg,
    query,
    args ?? {},
  );
  return data.trustLedgerBadgeDefinitions;
}

export async function upsertBadgeDefinition(
  cfg: BadgeAdminConfig,
  input: TrustLedgerBadgeDefinitionInput,
): Promise<TrustLedgerBadgeDefinition> {
  const mutation = `
    mutation UpsertTrustLedgerBadgeDefinition($input: TrustLedgerBadgeDefinitionInput!) {
      upsertTrustLedgerBadgeDefinition(input: $input) {
        badgeId
        program
        name
        description
        iconRef
        points
        ruleId
        ruleJson
        active
        createdAt
        updatedAt
      }
    }
  `;
  const data = await graphqlRequest<{ upsertTrustLedgerBadgeDefinition: TrustLedgerBadgeDefinition }>(
    cfg,
    mutation,
    { input },
  );
  return data.upsertTrustLedgerBadgeDefinition;
}

export async function setBadgeActive(
  cfg: BadgeAdminConfig,
  badgeId: string,
  active: boolean,
): Promise<TrustLedgerBadgeDefinition> {
  const mutation = `
    mutation SetTrustLedgerBadgeActive($badgeId: String!, $active: Boolean!) {
      setTrustLedgerBadgeActive(badgeId: $badgeId, active: $active) {
        badgeId
        program
        name
        description
        iconRef
        points
        ruleId
        ruleJson
        active
        createdAt
        updatedAt
      }
    }
  `;
  const data = await graphqlRequest<{ setTrustLedgerBadgeActive: TrustLedgerBadgeDefinition }>(
    cfg,
    mutation,
    { badgeId, active },
  );
  return data.setTrustLedgerBadgeActive;
}

export async function fetchAgentCard(
  cfg: BadgeAdminConfig,
  url: string,
  authHeader?: string,
): Promise<any> {
  const query = `
    query FetchAgentCard($url: String!, $authHeader: String) {
      fetchAgentCard(url: $url, authHeader: $authHeader)
    }
  `;
  const data = await graphqlRequest<{ fetchAgentCard: string }>(
    cfg,
    query,
    { url, authHeader },
  );
  return JSON.parse(data.fetchAgentCard);
}


