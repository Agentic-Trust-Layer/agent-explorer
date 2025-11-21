import { NextRequest, NextResponse } from 'next/server';
import { addAgentNameToL2Org } from '@agentic-trust/core/server';

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
    const orgName = typeof body.orgName === 'string' ? body.orgName.trim() : '';
    const agentAddress = typeof body.agentAddress === 'string' ? body.agentAddress.trim() : '';
    const agentUrl = typeof body.agentUrl === 'string' ? body.agentUrl.trim() : undefined;
    const agentDescription =
      typeof body.agentDescription === 'string' ? body.agentDescription.trim() : undefined;
    const agentImage =
      typeof body.agentImage === 'string' ? body.agentImage.trim() : undefined;
    const chainId =
      typeof body.chainId === 'number' && Number.isFinite(body.chainId)
        ? body.chainId
        : undefined;

    if (!agentName || !orgName || !agentAddress) {
      return NextResponse.json(
        { error: 'agentName, orgName, and agentAddress are required' },
        { status: 400 },
      );
    }

    const result = await addAgentNameToL2Org({
      agentName,
      orgName,
      agentAddress,
      agentUrl,
      agentDescription,
      agentImage,
      chainId,
    });

    return NextResponse.json(serializeBigInts(result));
  } catch (error) {
    console.error('Error preparing L2 ENS calls:', error);
    return NextResponse.json(
      {
        error: 'Failed to prepare L2 ENS calls',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


