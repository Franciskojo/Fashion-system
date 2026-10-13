import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET() {
  try {
    const attendance = await DbService.getAttendance();
    return NextResponse.json({ success: true, data: attendance });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const record = await DbService.markAttendance(body);
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
