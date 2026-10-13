import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET() {
  try {
    const students = await DbService.getStudents();
    return NextResponse.json({ success: true, data: students });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newStudent = await DbService.createStudent(body);
    return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { action, studentId, amount, completedModules } = body;

    if (action === 'pay_fee') {
      const updated = await DbService.updateStudentFeePayment(studentId, amount);
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'update_progress') {
      const updated = await DbService.updateStudentProgress(studentId, completedModules);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
