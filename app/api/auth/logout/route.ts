import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Instantly invalidates the JWT and clears the secure cookie
    await destroySession();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to logout.' }, { status: 500 });
  }
}