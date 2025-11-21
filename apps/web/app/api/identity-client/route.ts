import { NextRequest, NextResponse } from 'next/server';
import { getIdentityClient } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

const ALLOWED_METHODS = new Set([
  'getAgentAccount',
  'getAgentName',
  'getAgentAccountByName',
  'prepareRegisterCalls',
  'prepareSetRegistrationUriCalls',
  'extractAgentIdFromReceiptPublic',
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

function normalizeArgs(method: string, args: any[]) {
  if (!Array.isArray(args)) return [];

  switch (method) {
    case 'getAgentAccount':
      return [BigInt(args[0]), ...args.slice(1)];
    case 'prepareSetRegistrationUriCalls':
      return [BigInt(args[0]), ...args.slice(1)];
    default:
      return args;
  }
}

async function resolveIdentityClient(chainId?: number) {
  if (typeof chainId === 'number') {
    return getIdentityClient(chainId);
  }

  // Fallback to default chain configured via env (if getIdentityClient without args supported)
  return getIdentityClient();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const method = typeof body.method === 'string' ? body.method : '';
    const rawArgs = Array.isArray(body.args) ? body.args : [];
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

    const client = await resolveIdentityClient(chainId);
    if (!client) {
      return NextResponse.json(
        { error: 'Identity client is not available' },
        { status: 500 },
      );
    }

    const handler = (client as any)[method];
    if (typeof handler !== 'function') {
      return NextResponse.json(
        { error: `Identity client method ${method} is not available` },
        { status: 400 },
      );
    }

    const normalizedArgs = normalizeArgs(method, rawArgs);
    const result = await handler.apply(client, normalizedArgs);
    return NextResponse.json({ result: serializeBigInts(result) });
  } catch (error) {
    console.error('Error executing identity client method:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute identity client method',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


