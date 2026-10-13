import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const classId = searchParams.get('classId')?.trim() || '';
    const riskLevel = searchParams.get('riskLevel')?.trim() || '';
    const earlyWarningOnly = searchParams.get('earlyWarning') === 'true';
    const sortBy = searchParams.get('sortBy') || 'predictedScore';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Build Prisma where query
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { rollNo: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (classId && classId !== 'ALL') {
      where.classId = classId;
    }

    if (riskLevel && riskLevel !== 'ALL') {
      where.riskLevel = riskLevel.toUpperCase();
    }

    if (earlyWarningOnly) {
      where.earlyWarning = true;
    }

    // Build orderBy
    let orderBy: any = {};
    if (sortBy === 'name') orderBy = { name: order };
    else if (sortBy === 'rollNo') orderBy = { rollNo: order };
    else if (sortBy === 'attendance') orderBy = { attendance: order };
    else if (sortBy === 'currentScore') orderBy = { currentScore: order };
    else if (sortBy === 'trendSlope') orderBy = { trendSlope: order };
    else orderBy = { predictedScore: order };

    const total = await prisma.student.count({ where });
    const students = await prisma.student.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        monthlyHistory: {
          orderBy: { monthIndex: 'asc' },
        },
      },
    });

    const parsedStudents = students.map(s => ({
      ...s,
      earlyWarningReasons: JSON.parse(s.earlyWarningReasons || '[]'),
      internalMarks: JSON.parse(s.internalMarksJson || '[]'),
    }));

    return NextResponse.json({
      students: parsedStudents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to retrieve students' }, { status: 500 });
  }
}
