import { DbService } from '@/lib/db-service';
import { json, requireSession, serverError } from '@/lib/api-guard';

/** GET: attendance records the signed-in user may see (staff: all, others: their own). */
export async function GET(req: Request) {
  try {
    const auth = await requireSession(req);
    if ('response' in auth) return auth.response;

    const attendance = await DbService.attendanceFor(auth.session);
    return json({ success: true, data: attendance });
  } catch (error) {
    return serverError(error);
  }
}
