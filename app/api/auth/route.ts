import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // THE FIX: Removed gstNumber from the destructured payload
    const { action, email, password, companyName, phone, contactName } = body;

    // 1. HANDLE REGISTRATION (Partner Application)
    if (action === 'request_access') {
      const existingUser = await prisma.user.findFirst({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already registered.' }, { status: 400 });
      }

      if (!phone) {
        return NextResponse.json({ error: 'Contact number is required.' }, { status: 400 });
      }
      
      const parsedNumber = parsePhoneNumberFromString(phone);
      if (!parsedNumber || !parsedNumber.isValid()) {
        return NextResponse.json({ error: 'Invalid international mobile number format.' }, { status: 400 });
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash: password, 
          companyName,
          phone: parsedNumber.number, 
          contactName,
          isApproved: false, 
          role: 'CLIENT'
        }
      });

      return NextResponse.json({ success: true, message: 'Application submitted successfully.' });
    }

    // 2. HANDLE LOGIN
    if (action === 'login') {
      const user = await prisma.user.findFirst({ where: { email } });
      
      if (!user || user.passwordHash !== password) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
      }

      if (!user.isApproved && user.role === 'CLIENT') {
        return NextResponse.json({ error: 'Account pending administrative approval.' }, { status: 403 });
      }

      await createSession(user.id, user.role, user.isApproved);

      return NextResponse.json({ 
        success: true, 
        user: { id: user.id, email: user.email, role: user.role, company: user.companyName } 
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}