import { NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeStudent, DEFAULT_WEIGHTS, DEFAULT_COHORT_BENCHMARKS } from '@/lib/engine';

const SubjectInternalSchema = z.object({
  subjectCode: z.string().default('SUB01'),
  subjectName: z.string().default('Course'),
  test1: z.number().min(0).max(100),
  test2: z.number().min(0).max(100),
  test3: z.number().min(0).max(100),
  average: z.number().min(0).max(100).optional(),
});

const MonthlyRecordSchema = z.object({
  monthIndex: z.number().int().min(1).max(12),
  monthName: z.string(),
  score: z.number().min(0).max(100),
});

const AnalyzeStudentInputSchema = z.object({
  rollNo: z.string().default('NEW-001'),
  name: z.string().min(1, 'Student name is required'),
  classId: z.string().default('CS-A'),
  attendance: z.number().min(0, 'Attendance cannot be negative').max(100, 'Attendance cannot exceed 100%'),
  weeklyStudyHours: z.number().min(0, 'Study hours cannot be negative').max(60, 'Study hours cannot exceed 60h/week'),
  assignmentCompletion: z.number().min(0).max(100),
  previousGpa: z.number().min(0).max(10),
  backlogs: z.number().int().min(0).max(20),
  participation: z.number().min(1).max(5),
  lateSubmissions: z.number().int().min(0).max(30),
  internalMarks: z.union([
    z.number().min(0).max(100),
    z.array(SubjectInternalSchema),
  ]),
  monthlyHistory: z.array(MonthlyRecordSchema).optional(),
  customWeights: z.record(z.number()).optional(),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validated = AnalyzeStudentInputSchema.safeParse(rawBody);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validated.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
        },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Use custom weights if passed, otherwise default
    const weights = data.customWeights
      ? { ...DEFAULT_WEIGHTS, ...data.customWeights }
      : DEFAULT_WEIGHTS;

    const analysis = analyzeStudent(
      {
        rollNo: data.rollNo,
        name: data.name,
        classId: data.classId,
        attendance: data.attendance,
        weeklyStudyHours: data.weeklyStudyHours,
        assignmentCompletion: data.assignmentCompletion,
        previousGpa: data.previousGpa,
        backlogs: data.backlogs,
        participation: data.participation,
        lateSubmissions: data.lateSubmissions,
        internalMarks: data.internalMarks,
        monthlyHistory: data.monthlyHistory,
      },
      weights,
      DEFAULT_COHORT_BENCHMARKS
    );

    return NextResponse.json({
      success: true,
      input: data,
      analysis,
    });
  } catch (error) {
    console.error('Instant analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to process student performance analysis' },
      { status: 500 }
    );
  }
}
