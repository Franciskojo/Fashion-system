import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET() {
  try {
    const payroll = await DbService.getPayroll();
    return NextResponse.json({ success: true, data: payroll });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workerId, monthYear, bonus, deductions } = body;
    const record = await DbService.generatePayrollForWorker(workerId, monthYear, bonus, deductions);
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
