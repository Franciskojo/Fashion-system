import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET() {
  try {
    const courses = await DbService.getCourses();
    return NextResponse.json({ success: true, data: courses });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
