import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize Prisma
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Destructured all B2B fields coming from the frontend
    const { name, email, password, companyName, phone, gst } = body;

    // CHANGE: Removed `!gst` from the mandatory validation array
    if (!name || !email || !password || !companyName || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields. Please complete the entire form.' }, 
        { status: 400 }
      );
    }

    // Email Normalization to prevent duplicate/case-sensitive accounts
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered in our wholesale system.' }, 
        { status: 409 }
      );
    }

    // Cryptographically hash the password (Cost Factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Database Injection with complete commercial dataset
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        companyName,
        phone,
        gstin: gst || null, // CHANGE: Safely injects 'null' if the frontend string is empty
        // role and status will fall back to Prisma defaults ("CLIENT" and "PENDING")
      }
    });

    // Standardized Response Contract matching the React frontend
    return NextResponse.json(
      { success: true, message: 'Application received successfully.', userId: newUser.id }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('B2B Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during application submission.' }, 
      { status: 500 }
    );
  }
}