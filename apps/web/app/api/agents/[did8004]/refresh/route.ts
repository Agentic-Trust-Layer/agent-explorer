import { NextRequest, NextResponse } from 'next/server';
import { getAgenticTrustClient } from '@agentic-trust/core/server';
import { buildDid8004, parseDid8004 } from '@agentic-trust/core';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { 'did:8004': string } }
) {
  try {
    const didParam = params['did:8004'];
    let parsed;
    try {
      parsed = parseDid8004(didParam);
    } catch (parseError) {
      const message =
        parseError instanceof Error ? parseError.message : 'Invalid 8004 DID';
      return NextResponse.json(
        { error: 'Invalid 8004 DID', message },
        { status: 400 }
      );
    }

    let chainIdOverride: number | undefined;
    try {
      const body = await request.json();
      chainIdOverride =
        typeof body.chainId === 'number' && Number.isFinite(body.chainId)
          ? body.chainId
          : undefined;
    } catch {
      chainIdOverride = undefined;
    }

    const chainIdToUse = chainIdOverride ?? parsed.chainId;
    const client = await getAgenticTrustClient();
    const effectiveDid =
      chainIdToUse === parsed.chainId
        ? didParam
        : buildDid8004(chainIdToUse, parsed.agentId);

    const refreshFn =
      typeof (client.agents as any).refreshAgentByDid === 'function'
        ? (client.agents as any).refreshAgentByDid.bind(client.agents)
        : async (did: string) => {
            const { agentId, chainId } = parseDid8004(did);
            return client.agents.refreshAgent(agentId, chainId);
          };

    const result = await refreshFn(effectiveDid);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    console.error('Error refreshing agent:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        error: 'Failed to refresh agent',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

