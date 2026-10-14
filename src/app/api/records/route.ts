import { DbService, COLLECTION_NAMES, CollectionName } from '@/lib/db-service';
import { authorizeWrite } from '@/lib/policy';
import { hasUnsafeKeys, json, readJsonBody, requireSession, serverError } from '@/lib/api-guard';

/** GET: the data the signed-in user is allowed to see (used to load the app). */
export async function GET(req: Request) {
  try {
    const auth = await requireSession(req);
    if ('response' in auth) return auth.response;

    const data = await DbService.bootstrapFor(auth.session);
    return json({ success: true, data });
  } catch (error) {
    return serverError(error);
  }
}

/** PUT: insert-or-update one record: { collection, doc } (authorized per role) */
export async function PUT(req: Request) {
  try {
    const auth = await requireSession(req);
    if ('response' in auth) return auth.response;

    const body = await readJsonBody(req);
    const collection = body?.collection;
    const doc = body?.doc as Record<string, unknown> | undefined;

    if (
      typeof collection !== 'string' ||
      !COLLECTION_NAMES.includes(collection as CollectionName) ||
      !doc || typeof doc !== 'object' || Array.isArray(doc) ||
      typeof doc.id !== 'string' || doc.id.length === 0 || doc.id.length > 100 ||
      hasUnsafeKeys(doc)
    ) {
      return json({ success: false, error: 'Invalid collection or record.' }, 400);
    }

    const decision = await authorizeWrite(auth.session, collection as CollectionName, doc as Record<string, unknown> & { id: string });
    if (!decision.ok) return json({ success: false, error: decision.error }, decision.status);

    const saved = await DbService.saveRecord(collection as CollectionName, decision.doc as Record<string, unknown> & { id: string });
    return json({ success: true, data: saved });
  } catch (error) {
    return serverError(error);
  }
}
