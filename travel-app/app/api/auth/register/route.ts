import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'नाम, इमेल र पासवर्ड आवश्यक छ' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'यो इमेल पहिले नै प्रयोग भएको छ' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      }
    });

    return NextResponse.json({
      message: 'खाता सफलतापूर्वक सिर्जना भयो',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'खाता सिर्जना गर्न सकिएन' },
      { status: 500 }
    );
  }
}