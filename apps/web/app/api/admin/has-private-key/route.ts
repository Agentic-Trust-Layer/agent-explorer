import { NextResponse } from 'next/server';
import { getAdminApp } from '@agentic-trust/core/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adminApp = await getAdminApp().catch(() => null);
    const hasPrivateKey = Boolean(adminApp?.hasPrivateKey);
    return NextResponse.json({ hasPrivateKey });
  } catch (error) {
    console.error('Error determining admin private key status:', error);
    return NextResponse.json({ hasPrivateKey: false });
  }
}
