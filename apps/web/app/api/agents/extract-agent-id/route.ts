import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const ZERO_TOPIC = '0x0000000000000000000000000000000000000000000000000000000000000000';

function extractAgentIdFromReceipt(receipt: any): string | null {
  if (!receipt || !Array.isArray(receipt.logs)) {
    return null;
  }

  for (const log of receipt.logs) {
    if (!log || !Array.isArray(log.topics) || log.topics.length < 3) {
      continue;
    }
    if (log.topics[0] !== TRANSFER_TOPIC) {
      continue;
    }
    if (log.topics[1] !== ZERO_TOPIC) {
      continue;
    }

    const tokenTopic = log.topics[3];
    if (typeof tokenTopic === 'string' && tokenTopic.length > 2) {
      try {
        return BigInt(tokenTopic).toString();
      } catch {
        // ignore parse errors
      }
    }

    const data = log.data;
    if (typeof data === 'string' && data.length > 2) {
      try {
        return BigInt(data).toString();
      } catch {
        // ignore parse errors
      }
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const receipt = body?.receipt;
    if (!receipt) {
      return NextResponse.json(
        { error: 'receipt is required' },
        { status: 400 },
      );
    }

    const agentId = extractAgentIdFromReceipt(receipt);
    return NextResponse.json({ agentId: agentId ?? null });
  } catch (error) {
    console.error('Error extracting agentId from receipt:', error);
    return NextResponse.json(
      {
        error: 'Failed to extract agentId',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


