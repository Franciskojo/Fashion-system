import { NextResponse } from 'next/server';
import { AUTH_COOKIE, AuthSession, verifyAuthToken } from './auth';
import { DbService } from './db-service';
import { Role } from './types';

export const MAX_BODY_BYTES = 1_000_000;

export function json(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

/** Never leak internals to the client; log the details on the server only. */
export function serverError(error: unknown) {
  console.error('[api] unexpected error:', error);
  return json({ success: false, error: 'Something went wrong. Please try again.' }, 500);
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get('cookie');
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

/**
 * Verifies the session cookie, then re-checks the user in the database so that
 * deactivated users or changed roles take effect immediately.
 */
export async function requireSession(
  req: Request,
  roles?: Role[]
): Promise<{ session: AuthSession } | { response: NextResponse }> {
  const token = readCookie(req, AUTH_COOKIE);
  const claims = token ? await verifyAuthToken(token) : null;
  if (!claims) return { response: json({ success: false, error: 'Authentication required.' }, 401) };

  const user = await DbService.getUserById(claims.userId);
  if (!user || user.status !== 'active') {
    return { response: json({ success: false, error: 'Authentication required.' }, 401) };
  }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };

  if (roles && !roles.includes(session.role)) {
    return { response: json({ success: false, error: 'You do not have permission to do that.' }, 403) };
  }
  return { session };
}

/** Parses a JSON object body with a size limit. Returns null if invalid. */
export async function readJsonBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return null;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Rejects documents containing Mongo operators ($...) or prototype-pollution keys at any depth. */
export function hasUnsafeKeys(value: unknown, depth = 0): boolean {
  if (depth > 12) return true;
  if (Array.isArray(value)) return value.some((v) => hasUnsafeKeys(v, depth + 1));
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('$') || k.includes('.') || k === '__proto__' || k === 'constructor' || k === 'prototype') {
        return true;
      }
      if (hasUnsafeKeys(v, depth + 1)) return true;
    }
  }
  return false;
}
