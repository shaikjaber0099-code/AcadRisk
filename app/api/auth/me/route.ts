import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = getCurrentUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        studentId: true,
        student: {
          select: {
            id: true,
            rollNo: true,
            classId: true,
          },
        },
      },
    });

    if (user) {
      return NextResponse.json({ authenticated: true, user });
    }
  } catch (err) {
    console.warn('Prisma /api/auth/me fallback to session payload:', err);
  }

  // Resilient fallback: return user data directly from signed token session
  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
      studentId: session.studentId,
    },
  });
}
