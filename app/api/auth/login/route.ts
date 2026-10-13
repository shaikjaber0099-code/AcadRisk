import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signAuthToken } from '@/lib/auth';

const DEMO_ACCOUNTS: Record<string, { role: 'STUDENT' | 'TEACHER' | 'ADMIN'; name: string; password: string; studentId?: string; studentRollNo?: string }> = {
  'teacher@acadrisk.edu': {
    role: 'TEACHER',
    name: 'Prof. E Mahendher',
    password: 'Teacher@123',
  },
  'admin@acadrisk.edu': {
    role: 'ADMIN',
    name: 'Dr. Evelyn Vance (Dean)',
    password: 'Admin@123',
  },
  'student@acadrisk.edu': {
    role: 'STUDENT',
    name: 'Aarav Sharma',
    password: 'Student@123',
    studentId: 'demo-student-id',
    studentRollNo: '24R11A0543',
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user: any = null;
    let isValid = false;

    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: { student: true },
      });

      if (user) {
        isValid = await bcrypt.compare(password, user.passwordHash);
      }
    } catch (dbError) {
      console.warn('Database lookup unavailable, checking institutional credentials:', dbError);
    }

    // Resilient fallback for demo accounts if database is cold-starting or uninitialized
    if (!user || !isValid) {
      const demo = DEMO_ACCOUNTS[normalizedEmail];
      if (demo && demo.password === password) {
        user = {
          id: `demo-${demo.role.toLowerCase()}`,
          email: normalizedEmail,
          name: demo.name,
          role: demo.role,
          studentId: demo.studentId || null,
          student: demo.studentRollNo ? { rollNo: demo.studentRollNo } : null,
        };
        isValid = true;
      }
    }

    if (!user || !isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'STUDENT' | 'TEACHER' | 'ADMIN',
      studentId: user.studentId,
    };

    const token = signAuthToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
        studentRollNo: user.student?.rollNo,
      },
    });

    response.cookies.set('acadrisk_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }
}
