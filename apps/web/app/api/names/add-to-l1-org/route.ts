import { NextRequest, NextResponse } from 'next/server';
import { addAgentNameToL1Org } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

async function handleRequest(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const agentName = typeof body.agentName === 'string' ? body.agentName.trim() : '';
  const orgName = typeof body.orgName === 'string' ? body.orgName.trim() : '';
  const agentAddress = typeof body.agentAddress === 'string' ? body.agentAddress.trim() : '';
  const agentUrl = typeof body.agentUrl === 'string' ? body.agentUrl.trim() : undefined;
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

  await addAgentNameToL1Org({
    agentName,
    orgName,
    agentAddress,
    agentUrl,
    chainId,
  });

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  try {
    return await handleRequest(request);
  } catch (error) {
    console.error('Error adding agent name to L1 org:', error);
    return NextResponse.json(
      {
        error: 'Failed to add agent name to org',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


