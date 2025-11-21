import { NextRequest, NextResponse } from 'next/server';
import { buildDid8004 } from '@agentic-trust/core';
import { getAgenticTrustClient, DEFAULT_CHAIN_ID } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, chainId } = body ?? {};

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
        { status: 400 }
      );
    }

    const normalizedChainId =
      typeof chainId === 'number' && Number.isFinite(chainId) ? chainId : undefined;

    const client = await getAgenticTrustClient();
    const did =
      normalizedChainId !== undefined
        ? buildDid8004(normalizedChainId, agentId)
        : buildDid8004(DEFAULT_CHAIN_ID, agentId);

    const result = await (client.agents as any).refreshAgentByDid(did);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('Error refreshing agent:', error);
    return NextResponse.json(
      {
        error: 'Failed to refresh agent',
        message: error?.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}

