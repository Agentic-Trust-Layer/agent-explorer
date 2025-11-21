'use client';

import * as React from 'react';

export type OrgIdentityClientApi = {
  getOrgAccountByName: (orgName: string) => Promise<string | null>;
};

async function callOrgIdentityApi(method: string, args: any[] = []) {
  const response = await fetch('/api/org-identity-client', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, args }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Org identity client request failed');
  }
  return payload?.result ?? null;
}

const OrgIdentityClientContext = React.createContext<OrgIdentityClientApi | null>(null);

export function useOrgIdentityClient(): OrgIdentityClientApi {
  const client = React.useContext(OrgIdentityClientContext);
  if (!client) {
    throw new Error('useOrgIdentityClient must be used within OrgIdentityClientProvider');
  }
  return client;
}

type Props = { children: React.ReactNode };

export function OrgIdentityClientProvider({ children }: Props) {
  const client = React.useMemo<OrgIdentityClientApi>(() => ({
    getOrgAccountByName: (orgName: string) => callOrgIdentityApi('getOrgAccountByName', [orgName]),
  }), []);

  return (
    <OrgIdentityClientContext.Provider value={client}>
      {children}
    </OrgIdentityClientContext.Provider>
  );
}

