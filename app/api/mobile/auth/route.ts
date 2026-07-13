import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // --- B2B GATEKEEPER LOGIC ---
    if (user.role === 'CLIENT' && user.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Access Denied: Your wholesale account is pending administrative approval.' },
        { status: 403 }
      );
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Access Denied: Your account has been suspended. Contact your procurement manager.' },
        { status: 403 }
      );
    }

    // Prepare JWT Payload
    const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      assignedSalesmanId: user.assignedSalesmanId
    };

    const secretKey = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development';
    const secret = new TextEncoder().encode(secretKey);

    // Sign the JWT using jose (90 days expiration for mobile)
    const token = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('90d')
      .sign(secret);

    // Return the token and user profile
    return NextResponse.json({
      success: true,
      token,
      user: jwtPayload
    });

  } catch (error: any) {
    console.error('Mobile Auth Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
