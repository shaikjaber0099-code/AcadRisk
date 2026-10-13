import { StudentInputData, AnalysisOutput } from './types';
import { EngineWeights, DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS, DEFAULT_COHORT_BENCHMARKS, CohortBenchmarks } from './weights';
import { computeWeightedPerformanceScore, computeInternalMarksAverage } from './scoring';
import { computeLinearRegressionTrend } from './regression';
import { evaluateRisk } from './risk';
import { explainStudentRisk } from './explainability';
import { generateRecommendations } from './recommendations';

export * from './types';
export * from './weights';
export * from './scoring';
export * from './regression';
export * from './risk';
export * from './explainability';
export * from './recommendations';
export * from './simulator';

/**
 * Master pipeline function for AcadRisk Smart Analysis Engine.
 * Transparent, verifiable, and free of opaque ML models.
 */
export function analyzeStudent(
  student: StudentInputData,
  weights: EngineWeights = DEFAULT_WEIGHTS,
  benchmarks: CohortBenchmarks = DEFAULT_COHORT_BENCHMARKS
): AnalysisOutput {
  // 1. Compute weighted composite score (0-100)
  const { score: currentWeightedScore, normalized } = computeWeightedPerformanceScore(student, weights);

  // 2. Compute Linear Regression trend & blended final exam projection (0-100)
  const { trend, blendedProjectedScore } = computeLinearRegressionTrend(
    student.monthlyHistory || [],
    currentWeightedScore,
    DEFAULT_THRESHOLDS
  );

  // 3. Classify risk level & early warnings
  const { riskLevel, earlyWarning, earlyWarningReasons } = evaluateRisk(
    blendedProjectedScore,
    student.attendance,
    trend,
    DEFAULT_THRESHOLDS
  );

  // 4. Generate factor contributions & explainability
  const internalAvg = computeInternalMarksAverage(student.internalMarks);
  const explainability = explainStudentRisk(
    {
      attendance: student.attendance,
      internalMarks: internalAvg,
      assignmentCompletion: student.assignmentCompletion,
      previousGpa: student.previousGpa,
      weeklyStudyHours: student.weeklyStudyHours,
      participation: student.participation,
      backlogs: student.backlogs,
      lateSubmissions: student.lateSubmissions,
    },
    normalized,
    weights,
    benchmarks
  );

  // 5. Synthesize prioritized pedagogical recommendations
  const recommendations = generateRecommendations(
    student,
    normalized,
    trend,
    currentWeightedScore
  );

  return {
    currentWeightedScore,
    projectedScore: blendedProjectedScore,
    riskLevel,
    earlyWarning,
    earlyWarningReasons,
    trend,
    explainability,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}
