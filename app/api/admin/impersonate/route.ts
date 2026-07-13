import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  try {
    // 1. Verify caller is an Administrator
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. No active session.' }, { status: 401 });
    }

    const callerRole = (session.user as any).role;
    const callerId = (session.user as any).id;

    if (callerRole !== 'SUPER_ADMIN' && callerRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Access Denied. Insufficient privileges to impersonate users.' }, { status: 403 });
    }

    // 2. Extract target parameters
    const body = await req.json();
    const { targetEmail, targetUserId } = body;

    if (!targetEmail && !targetUserId) {
      return NextResponse.json({ error: 'Must provide either targetEmail or targetUserId.' }, { status: 400 });
    }

    // 3. Look up target user
    const targetUser = await prisma.user.findFirst({
      where: targetUserId ? { id: targetUserId } : { email: targetEmail?.toLowerCase() }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found.' }, { status: 404 });
    }

    // --- AUDIT LOGGING ---
    console.warn(`🔒 SECURITY AUDIT: Admin [${session.user.email}] generated an impersonation token for target user [${targetUser.email}].`);

    // 4. Generate the Impersonation JWT Token
    const jwtPayload = {
      id: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      tenantId: targetUser.tenantId,
      assignedSalesmanId: targetUser.assignedSalesmanId,
      impersonatedBy: callerId // Crucial for tracking in future API calls
    };

    const secretKey = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development';
    const secret = new TextEncoder().encode(secretKey);

    // Impersonation tokens should have a very short lifespan to minimize security risks (e.g., 2 hours)
    const token = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret);

    return NextResponse.json({
      success: true,
      message: `Successfully impersonated ${targetUser.email}`,
      token,
      user: jwtPayload
    });

  } catch (error: any) {
    console.error('Impersonation Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
  }
}
