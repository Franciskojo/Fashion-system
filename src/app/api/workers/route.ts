import { DbService } from '@/lib/db-service';
import { json, readJsonBody, requireSession, serverError } from '@/lib/api-guard';

/** PUT { action: 'toggle_clock', workerId, deviceId } — workers clock themselves in/out; staff can do it for anyone. */
export async function PUT(req: Request) {
  try {
    const auth = await requireSession(req, ['owner', 'admin', 'worker']);
    if ('response' in auth) return auth.response;
    const { session } = auth;

    const body = await readJsonBody(req);
    if (!body || body.action !== 'toggle_clock' || typeof body.workerId !== 'string') {
      return json({ success: false, error: 'Invalid action' }, 400);
    }
    const deviceId = typeof body.deviceId === 'string' ? body.deviceId.slice(0, 100) : undefined;

    if (session.role === 'worker') {
      const worker = await DbService.getWorkerById(body.workerId);
      if (!worker || worker.userId !== session.userId) {
        return json({ success: false, error: 'You can only clock yourself in or out.' }, 403);
      }
    }

    const result = await DbService.toggleWorkerClock(body.workerId, deviceId);
    return json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'ALREADY_CLOCKED_IN_TODAY') {
      return json(
        { success: false, error: 'You have already clocked in today. Only one shift per day is allowed.' },
        409
      );
    }
    if (message === 'DEVICE_ALREADY_USED_TODAY') {
      return json(
        { success: false, error: 'This device has already been used to clock in another worker today. Each device can clock in only one worker per day.' },
        409
      );
    }
    return serverError(error);
  }
}
