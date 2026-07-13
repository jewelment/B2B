import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';


export async function GET(req: Request) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 401 }
      );
    }

    const secretKey = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development';
    const secret = new TextEncoder().encode(secretKey);

    // Verify the JWT
    let payload;
    try {
      const { payload: jwtPayload } = await jwtVerify(token, secret);
      payload = jwtPayload;
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Malformed token payload' },
        { status: 401 }
      );
    }

    // Fetch the latest user profile from the database
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        tenantId: true,
        assignedSalesmanId: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // --- B2B GATEKEEPER CONTINUAL CHECK ---
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

    // Return the fresh user profile
    return NextResponse.json({
      success: true,
      user
    });

  } catch (error: any) {
    console.error('Mobile Auth Validation Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
