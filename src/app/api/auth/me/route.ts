import { json, requireSession, serverError } from '@/lib/api-guard';

/** Returns the signed-in user (re-validated against the database). */
export async function GET(req: Request) {
  try {
    const auth = await requireSession(req);
    if ('response' in auth) return json({ success: false, user: null }, 401);
    return json({ success: true, user: auth.session });
  } catch (error) {
    return serverError(error);
  }
}
