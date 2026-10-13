import { EngineWeights, DEFAULT_WEIGHTS } from './weights';
import { StudentInputData, SubjectInternalMark } from './types';

/**
 * Calculates normalized metrics and the composite weighted performance score (0-100).
 * Fully transparent, verifiable, and explainable.
 */
export function computeInternalMarksAverage(marks: SubjectInternalMark[] | number): number {
  if (typeof marks === 'number') {
    return Math.max(0, Math.min(100, marks));
  }
  if (!marks || marks.length === 0) return 0;

  const total = marks.reduce((acc, sub) => {
    const avg = sub.average ?? ((sub.test1 + sub.test2 + sub.test3) / 3);
    return acc + avg;
  }, 0);

  return Math.max(0, Math.min(100, total / marks.length));
}

export interface NormalizedMetrics {
  attendanceNorm: number;          // 0-100
  internalMarksNorm: number;       // 0-100
  assignmentCompletionNorm: number;// 0-100
  previousGpaNorm: number;         // 0-100 (scaled from 0-10)
  studyHoursNorm: number;          // 0-100 (scaled from target 20 hrs)
  participationNorm: number;       // 0-100 (scaled from 1-5)
  penaltyPoints: number;           // 0 - maxPenalty (typically 0 - 5)
  rawSubmissionsPenalty: number;
  rawBacklogsPenalty: number;
}

export function normalizeStudentMetrics(
  student: StudentInputData,
  weights: EngineWeights = DEFAULT_WEIGHTS
): NormalizedMetrics {
  const attendanceNorm = Math.max(0, Math.min(100, student.attendance));
  const internalMarksNorm = computeInternalMarksAverage(student.internalMarks);
  const assignmentCompletionNorm = Math.max(0, Math.min(100, student.assignmentCompletion));
  
  // GPA on 10.0 scale -> 0-100%
  const previousGpaNorm = Math.max(0, Math.min(100, (student.previousGpa / 10.0) * 100));

  // Study hours: 20 hrs/week = 100%, linearly scaled
  const studyHoursNorm = Math.max(0, Math.min(100, (student.weeklyStudyHours / 20.0) * 100));

  // Participation: 1 to 5 scale -> 20% to 100%
  const participationNorm = Math.max(0, Math.min(100, (student.participation / 5.0) * 100));

  // Penalty calculation: backlogs (-2 pts each) and late submissions (-0.75 pt each), capped at maxPenalty (5.0)
  const rawBacklogsPenalty = Math.max(0, student.backlogs * 2.0);
  const rawSubmissionsPenalty = Math.max(0, student.lateSubmissions * 0.75);
  const penaltyPoints = Math.min(weights.maxPenalty, rawBacklogsPenalty + rawSubmissionsPenalty);

  return {
    attendanceNorm,
    internalMarksNorm,
    assignmentCompletionNorm,
    previousGpaNorm,
    studyHoursNorm,
    participationNorm,
    penaltyPoints,
    rawSubmissionsPenalty,
    rawBacklogsPenalty,
  };
}

export function computeWeightedPerformanceScore(
  student: StudentInputData,
  weights: EngineWeights = DEFAULT_WEIGHTS
): { score: number; normalized: NormalizedMetrics } {
  const norm = normalizeStudentMetrics(student, weights);

  const rawSum = 
    (norm.attendanceNorm * weights.attendance) +
    (norm.internalMarksNorm * weights.internalMarks) +
    (norm.assignmentCompletionNorm * weights.assignmentCompletion) +
    (norm.previousGpaNorm * weights.previousGpa) +
    (norm.studyHoursNorm * weights.studyHours) +
    (norm.participationNorm * weights.participation);

  const finalScore = Math.max(0, Math.min(100, rawSum - norm.penaltyPoints));

  return {
    score: Math.round(finalScore * 10) / 10, // Round to 1 decimal place
    normalized: norm,
  };
}
