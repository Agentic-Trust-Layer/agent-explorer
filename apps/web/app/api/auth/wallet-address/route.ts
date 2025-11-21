import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'wallet_address';
const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookie = cookies().get(COOKIE_NAME);
  return NextResponse.json({ address: cookie?.value ?? null });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const address =
      typeof body.address === 'string' && body.address.startsWith('0x')
        ? body.address
        : null;

    if (!address) {
      return NextResponse.json(
        { error: 'address is required' },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true, address });
    response.cookies.set({
      name: COOKIE_NAME,
      value: address,
      ...COOKIE_OPTIONS,
    });
    return response;
  } catch (error) {
    console.error('Error storing wallet address:', error);
    return NextResponse.json(
      { error: 'Failed to store wallet address' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete({
    name: COOKIE_NAME,
    path: COOKIE_OPTIONS.path,
  });
  return response;
}

