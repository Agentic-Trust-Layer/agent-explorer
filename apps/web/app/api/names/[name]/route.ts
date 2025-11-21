import { NextRequest, NextResponse } from 'next/server';
import { isENSNameAvailable } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const rawName = params?.name ? decodeURIComponent(params.name) : '';
    if (!rawName) {
      return NextResponse.json(
        { error: 'ENS name is required' },
        { status: 400 },
      );
    }

    const chainParam = request.nextUrl.searchParams.get('chainId');
    const chainId = chainParam ? Number.parseInt(chainParam, 10) : undefined;
    const normalizedChainId =
      typeof chainId === 'number' && Number.isFinite(chainId) ? chainId : undefined;

    let available: boolean | null = null;
    try {
      available = await isENSNameAvailable(rawName, normalizedChainId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('AbiDecodingZeroDataError')) {
        available = true;
      } else {
        throw error;
      }
    }

    if (available === null) {
      return NextResponse.json(
        {
          error: 'Unable to determine ENS availability',
          available: null,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      name: rawName,
      available,
    });
  } catch (error) {
    console.error('Error checking ENS availability:', error);
    return NextResponse.json(
      {
        error: 'Failed to check ENS availability',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


