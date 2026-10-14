import { clearRateLimit, clientIp, rateLimit } from '@/lib/rate-limit';
import { AUTH_COOKIE, comparePassword, sessionCookieOptions, signAuthToken } from '@/lib/auth';
import { DbService } from '@/lib/db-service';
import { json, readJsonBody, serverError } from '@/lib/api-guard';

const GENERIC_ERROR = 'Invalid email or password.';
// Used to keep response time similar whether or not the account exists.
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5pT0aH0QhbVYt3sdWbR1wKQ0yK8sQm2';

export async function POST(req: Request) {
  try {
    const body = await readJsonBody(req);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password || email.length > 254 || password.length > 200) {
      return json({ success: false, error: GENERIC_ERROR }, 400);
    }

    const ipKey = `login:ip:${clientIp(req)}`;
    const accountKey = `login:acct:${email}`;
    const ipLimit = rateLimit(ipKey, 30, 15 * 60_000);
    const accountLimit = rateLimit(accountKey, 5, 15 * 60_000);
    if (!ipLimit.allowed || !accountLimit.allowed) {
      const retryAfter = Math.max(ipLimit.retryAfter, accountLimit.retryAfter);
      return json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        429,
        { 'Retry-After': String(retryAfter) }
      );
    }

    const user = await DbService.getUserByEmail(email);
    const hash = typeof user?.password === 'string' ? user.password : DUMMY_HASH;
    const valid = await comparePassword(password, hash).catch(() => false);

    if (!user || !valid || user.status !== 'active') {
      return json({ success: false, error: GENERIC_ERROR }, 401);
    }

    clearRateLimit(accountKey);

    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };

    const response = json({ success: true, user: sessionData });
    response.cookies.set(AUTH_COOKIE, await signAuthToken(sessionData), sessionCookieOptions());
    return response;
  } catch (error) {
    return serverError(error);
  }
}
