import { NextRequest, NextResponse } from 'next/server';
import { getAgenticTrustClient } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

function serializeBigInts(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(serializeBigInts);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, serializeBigInts(val)]),
    );
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const agentName = typeof body.agentName === 'string' ? body.agentName.trim() : '';
    const rawAccount =
      typeof body.agentAccount === 'string'
        ? body.agentAccount
        : typeof body.account === 'string'
          ? body.account
          : '';
    const agentAccount = rawAccount.trim();

    if (!agentName || !agentAccount) {
      return NextResponse.json(
        { error: 'agentName and agentAccount are required' },
        { status: 400 },
      );
    }

    const chainId =
      typeof body.chainId === 'number' && Number.isFinite(body.chainId)
        ? body.chainId
        : undefined;

    const agentsClient = (await getAgenticTrustClient()).agents as any;

    const result = await agentsClient.createAgentForAAPK({
      agentName,
      agentAccount,
      description: typeof body.description === 'string' ? body.description : undefined,
      image: typeof body.image === 'string' ? body.image : undefined,
      agentUrl: typeof body.agentUrl === 'string' ? body.agentUrl : undefined,
      chainId,
      supportedTrust: Array.isArray(body.supportedTrust) ? body.supportedTrust : undefined,
      endpoints: Array.isArray(body.endpoints) ? body.endpoints : undefined,
    });

    return NextResponse.json(serializeBigInts(result));
  } catch (error) {
    console.error('Error creating AA agent via server key:', error);
    return NextResponse.json(
      {
        error: 'Failed to create AA agent via server key',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


