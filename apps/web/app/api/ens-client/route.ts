import { NextRequest, NextResponse } from 'next/server';
import { getENSClient } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

const ALLOWED_METHODS = new Set([
  'getAgentUrlByName',
  'getAgentImageByName',
  'getAgentDescriptionByName',
  'getAgentAccountByName',
  'getAgentIdentityByName',
  'hasAgentNameOwner',
  'prepareSetNameUriCalls',
  'prepareSetNameDescriptionCalls',
  'prepareSetNameImageCalls',
  'prepareSetAgentNameInfoCalls',
  'prepareAddAgentNameToOrgCalls',
  'prepareSetNameAgentIdentityCalls',
]);

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
    const method = typeof body.method === 'string' ? body.method : '';
    const args = Array.isArray(body.args) ? body.args : [];
    const chainId =
      typeof body.chainId === 'number' && Number.isFinite(body.chainId)
        ? body.chainId
        : undefined;

    if (!ALLOWED_METHODS.has(method)) {
      return NextResponse.json(
        { error: `Method ${method} is not allowed` },
        { status: 400 },
      );
    }

    const client = await getENSClient(chainId);
    const handler = (client as any)[method];
    if (typeof handler !== 'function') {
      return NextResponse.json(
        { error: `ENS client method ${method} is not available` },
        { status: 400 },
      );
    }

    const result = await handler.apply(client, args);
    return NextResponse.json({ result: serializeBigInts(result) });
  } catch (error) {
    console.error('Error executing ENS client method:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute ENS client method',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


