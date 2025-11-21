import { NextRequest, NextResponse } from 'next/server';
import { getCounterfactualAAAddressByAgentName } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawAgentName = typeof body.agentName === 'string' ? body.agentName.trim() : '';
    if (!rawAgentName) {
      return NextResponse.json(
        { error: 'agentName is required' },
        { status: 400 },
      );
    }

    const chainId =
      typeof body.chainId === 'number' && Number.isFinite(body.chainId)
        ? body.chainId
        : undefined;

    const address = await getCounterfactualAAAddressByAgentName(rawAgentName, chainId);
    return NextResponse.json({ address });
  } catch (error) {
    console.error('Error computing counterfactual account:', error);
    return NextResponse.json(
      {
        error: 'Failed to compute counterfactual account',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


