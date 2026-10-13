import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'acadrisk_jwt_super_secret_key_2026_demo_secure_key';

export interface AuthUserToken {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  studentId?: string | null;
}

export function signAuthToken(payload: AuthUserToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAuthToken(token: string): AuthUserToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserToken;
  } catch {
    return null;
  }
}

export function getCurrentUser(): AuthUserToken | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('acadrisk_session')?.value;
    if (!token) return null;
    return verifyAuthToken(token);
  } catch {
    return null;
  }
}
