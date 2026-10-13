import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET() {
  try {
    const leaves = await DbService.getLeaveRequests();
    return NextResponse.json({ success: true, data: leaves });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const leave = await DbService.createLeaveRequest(body);
    return NextResponse.json({ success: true, data: leave }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { leaveId, status } = body;
    const updated = await DbService.updateLeaveStatus(leaveId, status);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
