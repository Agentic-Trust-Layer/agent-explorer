import { NextRequest, NextResponse } from 'next/server';
import { OrgIdentityClient } from '../../../../erc8004-agentic-trust-sdk/OrgIdentityClient';
import { EthersAdapter } from '@agentic-trust/8004-sdk';
import { ethers } from 'ethers';

export const dynamic = 'force-dynamic';

const ALLOWED_METHODS = new Set(['getOrgAccountByName']);

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

function createOrgIdentityClient() {
  const rpcUrl = process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL;
  const ensRegistry = process.env.NEXT_PUBLIC_ETH_SEPOLIA_ENS_REGISTRY as `0x${string}` | undefined;
  if (!rpcUrl || !ensRegistry) {
    throw new Error('NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL and NEXT_PUBLIC_ETH_SEPOLIA_ENS_REGISTRY must be configured');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const adapter = new EthersAdapter(provider as any);
  return new OrgIdentityClient(adapter as any, { ensRegistry });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const method = typeof body.method === 'string' ? body.method : '';
    const args = Array.isArray(body.args) ? body.args : [];

    if (!ALLOWED_METHODS.has(method)) {
      return NextResponse.json(
        { error: `Method ${method} is not allowed` },
        { status: 400 },
      );
    }

    const client = createOrgIdentityClient();
    const handler = (client as any)[method];
    if (typeof handler !== 'function') {
      return NextResponse.json(
        { error: `Org identity client method ${method} is not available` },
        { status: 400 },
      );
    }

    const result = await handler.apply(client, args);
    return NextResponse.json({ result: serializeBigInts(result) });
  } catch (error) {
    console.error('Error executing org identity client method:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute org identity client method',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


