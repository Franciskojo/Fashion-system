import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('stitchflow_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: payload });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
