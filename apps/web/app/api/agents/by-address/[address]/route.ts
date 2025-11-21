import { NextRequest, NextResponse } from 'next/server';
import { getAddress } from 'viem';
import { buildDid8004 } from '@agentic-trust/core';
import { buildAgentDetail, getAgenticTrustClient } from '@agentic-trust/core/server';

const DEFAULT_CHAIN_ID = 11155111;

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const rawAddress = params.address;
    if (!rawAddress) {
      return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
    }

    let address: string;
    try {
      address = getAddress(rawAddress);
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Invalid address parameter',
          message: error instanceof Error ? error.message : 'Unable to parse address',
        },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const chainIdParam = searchParams.get('chainId');
    const chainIdFilter = chainIdParam ? Number.parseInt(chainIdParam, 10) : undefined;

    const agenticTrustClient = await getAgenticTrustClient();

    let discovery: any | null = null;
    try {
      const result = await agenticTrustClient.agents.searchAgents({
        params: {
          agentAccount: address as `0x${string}`,
          chains: chainIdFilter ? [chainIdFilter] : undefined,
        },
        page: 1,
        pageSize: 1,
        orderBy: 'agentId',
        orderDirection: 'DESC',
      });
      const agent = result?.agents?.[0];
      if (agent) {
        discovery = agent;
      }
    } catch (error) {
      console.warn('Failed to discover agent by address:', error);
    }

    if (!discovery) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const agentId = discovery.agentId ? String(discovery.agentId) : null;
    const chainId = chainIdFilter ?? discovery.chainId ?? DEFAULT_CHAIN_ID;

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID missing from discovery result' }, { status: 500 });
    }

    const did8004 = buildDid8004(chainId, agentId, { encode: false });
    const detail = await buildAgentDetail(agenticTrustClient, did8004);

    return NextResponse.json({
      address,
      ...detail,
    });
  } catch (error) {
    console.error('Error in get agent by address route:', error);
    return NextResponse.json(
      {
        error: 'Failed to get agent information by address',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
