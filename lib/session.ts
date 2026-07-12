import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// In production, this MUST be a long random string inside your .env file
const secretKey = process.env.JWT_SECRET || 'ashok-jewels-b2b-super-secret-key-2026';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Session lasts for 24 hours
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function createSession(userId: string, role: string, isApproved: boolean) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ userId, role, isApproved, expires });

  const cookieStore = await cookies();
  cookieStore.set('b2b_session', session, {
    expires,
    httpOnly: true, // Prevents JavaScript from reading the cookie (Highly Secure)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('b2b_session')?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set('b2b_session', '', { expires: new Date(0) });
}