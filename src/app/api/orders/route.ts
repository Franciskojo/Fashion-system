import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET() {
  try {
    const orders = await DbService.getOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newOrder = await DbService.createOrder(body);
    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { action, orderId, status, note, updatedBy, amount } = body;

    if (action === 'update_status') {
      const updated = await DbService.updateOrderStatus(orderId, status, note, updatedBy || 'Staff');
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'record_payment') {
      const updated = await DbService.updateOrderPayment(orderId, amount);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
