import { randomUUID } from 'node:crypto';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { AUTH_COOKIE, sessionCookieOptions, signAuthToken } from '@/lib/auth';
import { DbService } from '@/lib/db-service';
import { MIN_PASSWORD_LENGTH } from '@/lib/policy';
import { json, readJsonBody, serverError } from '@/lib/api-guard';
import { User } from '@/lib/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public self-registration. Accounts are always created as customers; staff accounts are provisioned by an admin. */
export async function POST(req: Request) {
  try {
    const limit = rateLimit(`register:${clientIp(req)}`, 5, 60 * 60_000);
    if (!limit.allowed) {
      return json(
        { success: false, error: 'Too many sign-ups. Please try again later.' },
        429,
        { 'Retry-After': String(limit.retryAfter) }
      );
    }

    const body = await readJsonBody(req);
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim().slice(0, 30) : '';

    if (!name || name.length > 100 || !EMAIL_RE.test(email) || email.length > 254) {
      return json({ success: false, error: 'Please provide a valid name and email address.' }, 400);
    }
    if (password.length < MIN_PASSWORD_LENGTH || password.length > 200) {
      return json({ success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` }, 400);
    }

    if (await DbService.getUserByEmail(email)) {
      return json({ success: false, error: 'An account with this email already exists.' }, 409);
    }

    const newUser: User = {
      id: `user-${randomUUID()}`,
      name,
      email,
      password,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: phone || undefined,
      status: 'active',
    };
    await DbService.createUser(newUser);

    const sessionData = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    const response = json({ success: true, user: sessionData });
    response.cookies.set(AUTH_COOKIE, await signAuthToken(sessionData), sessionCookieOptions());
    return response;
  } catch (error) {
    return serverError(error);
  }
}
