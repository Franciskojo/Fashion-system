import { NextResponse } from 'next/server';
import { DbService, COLLECTION_NAMES, CollectionName } from '@/lib/db-service';

/** GET: every collection at once (used to load the app). */
export async function GET() {
  try {
    const data = await DbService.bootstrap();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/** PUT: insert-or-replace one record: { collection, doc } */
export async function PUT(req: Request) {
  try {
    const { collection, doc } = await req.json();
    if (!COLLECTION_NAMES.includes(collection) || !doc || typeof doc.id !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid collection or record.' }, { status: 400 });
    }
    const saved = await DbService.saveRecord(collection as CollectionName, doc);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
