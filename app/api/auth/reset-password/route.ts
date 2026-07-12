import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, error: 'Token and new password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // SIMULATED LOGIC: 
    // In production, this would look up the user by the secure token, verify it hasn't expired,
    // hash the new password using bcrypt, and save it to the DB.
    
    // We simulate a database update delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simulate invalid token if token is explicitly 'invalid'
    if (token === 'invalid') {
      return NextResponse.json({ success: false, error: 'The reset link is invalid or has expired.' }, { status: 400 });
    }

    console.log(`[SIMULATED] Password successfully updated for token: ${token}`);

    return NextResponse.json({ 
      success: true,
      message: "Password has been updated."
    });

  } catch (error) {
    console.error('Reset Password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request.' },
      { status: 500 }
    );
  }
}
