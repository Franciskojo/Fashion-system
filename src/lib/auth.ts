import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { User, Role } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'stitchflow_super_secure_jwt_secret_key_2026_fashion_erp'
);

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAuthToken(payload: AuthSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthSession;
  } catch (err) {
    return null;
  }
}
