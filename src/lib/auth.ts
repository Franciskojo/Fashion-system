import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { Role } from './types';

export const AUTH_COOKIE = 'stitchflow_token';
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

const ISSUER = 'stitchflow';
const ROLES: Role[] = ['owner', 'admin', 'student', 'worker', 'customer'];
const BCRYPT_ROUNDS = 12;

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
}

/** The signing secret must come from the environment. Only development gets a fallback. */
function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not set (or shorter than 32 characters).');
  }
  return new TextEncoder().encode('dev-only-insecure-secret-never-use-in-production');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function isPasswordHash(value: unknown): value is string {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

export async function signAuthToken(payload: AuthSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
      issuer: ISSUER,
    });
    const { userId, email, name, role, avatar } = payload as Record<string, unknown>;
    if (
      typeof userId !== 'string' ||
      typeof email !== 'string' ||
      typeof name !== 'string' ||
      typeof role !== 'string' ||
      !ROLES.includes(role as Role)
    ) {
      return null;
    }
    return { userId, email, name, role: role as Role, avatar: typeof avatar === 'string' ? avatar : '' };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  };
}
