import { NextResponse } from 'next/server';
import { getAdminAddress } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const address = await getAdminAddress();
    if (!address || address.toLowerCase() === '0x' || address === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json(
        { error: 'Admin address not configured' },
        { status: 404 },
      );
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error('Error resolving admin address:', error);
    return NextResponse.json(
      {
        error: 'Failed to resolve admin address',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}


