import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    // SIMULATED LOGIC: 
    // In production, this would look up the user, generate a secure random JWT or DB token, 
    // save it to the DB with an expiration, and trigger an email via SendGrid.
    
    // We simulate a processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(`[SIMULATED] Forgot password request received for: ${email}`);
    console.log(`[SIMULATED] SendGrid Email Triggered -> "Password Reset Link"`);
    console.log(`[SIMULATED] Link: http://localhost:3000/reset-password?token=simulated-secure-token-123`);

    return NextResponse.json({ 
      success: true,
      message: "If an account exists, a recovery link has been sent."
    });

  } catch (error) {
    console.error('Forgot Password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request.' },
      { status: 500 }
    );
  }
}
