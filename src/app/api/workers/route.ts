import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET() {
  try {
    const workers = await DbService.getWorkers();
    return NextResponse.json({ success: true, data: workers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newWorker = await DbService.createWorker(body);
    return NextResponse.json({ success: true, data: newWorker }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { action, workerId } = body;

    if (action === 'toggle_clock') {
      const result = await DbService.toggleWorkerClock(workerId, body.deviceId);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'ALREADY_CLOCKED_IN_TODAY') {
      return NextResponse.json(
        { success: false, error: 'You have already clocked in today. Only one shift per day is allowed.' },
        { status: 409 }
      );
    }
    if (message === 'DEVICE_ALREADY_USED_TODAY') {
      return NextResponse.json(
        { success: false, error: 'This device has already been used to clock in another worker today. Each device can clock in only one worker per day.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
