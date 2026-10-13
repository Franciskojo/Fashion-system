import { NextResponse } from 'next/server';
import { DbService } from '@/lib/db-service';

export async function GET() {
  try {
    const certs = await DbService.getCertificates();
    return NextResponse.json({ success: true, data: certs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, grade } = body;
    const cert = await DbService.issueCertificate(studentId, grade);
    return NextResponse.json({ success: true, data: cert }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
