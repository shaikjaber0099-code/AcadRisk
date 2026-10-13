import { StudentInputData, RiskLevel, RecommendationItem } from './types';
import { computeWeightedPerformanceScore } from './scoring';
import { computeLinearRegressionTrend } from './regression';
import { evaluateRisk } from './risk';
import { generateRecommendations } from './recommendations';
import { EngineWeights, DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS } from './weights';

export interface SimulationOverrides {
  attendance?: number;
  weeklyStudyHours?: number;
  assignmentCompletion?: number;
  internalMarksAvg?: number;
  backlogs?: number;
  lateSubmissions?: number;
}

export interface SimulationResult {
  originalScore: number;
  originalProjectedScore: number;
  originalRiskLevel: RiskLevel;
  simulatedScore: number;
  simulatedProjectedScore: number;
  simulatedRiskLevel: RiskLevel;
  scoreDelta: number;            // + or - difference
  projectedDelta: number;
  riskChanged: boolean;
  isImproved: boolean;
  newRecommendations: RecommendationItem[];
  simulationSummary: string;
}

export function simulateStudentPerformance(
  baseStudent: StudentInputData,
  overrides: SimulationOverrides,
  weights: EngineWeights = DEFAULT_WEIGHTS
): SimulationResult {
  // 1. Calculate original state
  const originalWeighted = computeWeightedPerformanceScore(baseStudent, weights);
  const originalRegression = computeLinearRegressionTrend(
    baseStudent.monthlyHistory || [],
    originalWeighted.score,
    DEFAULT_THRESHOLDS
  );
  const originalRisk = evaluateRisk(
    originalRegression.blendedProjectedScore,
    baseStudent.attendance,
    originalRegression.trend,
    DEFAULT_THRESHOLDS
  );

  // 2. Clone student and apply overrides
  const simulatedStudent: StudentInputData = {
    ...baseStudent,
    attendance: overrides.attendance !== undefined ? overrides.attendance : baseStudent.attendance,
    weeklyStudyHours: overrides.weeklyStudyHours !== undefined ? overrides.weeklyStudyHours : baseStudent.weeklyStudyHours,
    assignmentCompletion: overrides.assignmentCompletion !== undefined ? overrides.assignmentCompletion : baseStudent.assignmentCompletion,
    backlogs: overrides.backlogs !== undefined ? overrides.backlogs : baseStudent.backlogs,
    lateSubmissions: overrides.lateSubmissions !== undefined ? overrides.lateSubmissions : baseStudent.lateSubmissions,
    internalMarks: overrides.internalMarksAvg !== undefined ? overrides.internalMarksAvg : baseStudent.internalMarks,
  };

  const simulatedWeighted = computeWeightedPerformanceScore(simulatedStudent, weights);
  
  // Adjust trend projection based on score delta
  const scoreDelta = Math.round((simulatedWeighted.score - originalWeighted.score) * 10) / 10;
  
  // Adjust monthly history if available to project new trend slope
  const adjustedHistory = (baseStudent.monthlyHistory || []).map((h, i, arr) => {
    if (i === arr.length - 1) {
      return { ...h, score: Math.max(0, Math.min(100, h.score + scoreDelta)) };
    }
    return h;
  });

  const simulatedRegression = computeLinearRegressionTrend(
    adjustedHistory,
    simulatedWeighted.score,
    DEFAULT_THRESHOLDS
  );

  const simulatedRisk = evaluateRisk(
    simulatedRegression.blendedProjectedScore,
    simulatedStudent.attendance,
    simulatedRegression.trend,
    DEFAULT_THRESHOLDS
  );

  const newRecommendations = generateRecommendations(
    simulatedStudent,
    simulatedWeighted.normalized,
    simulatedRegression.trend,
    simulatedWeighted.score
  );

  const projectedDelta = Math.round((simulatedRegression.blendedProjectedScore - originalRegression.blendedProjectedScore) * 10) / 10;
  const riskChanged = originalRisk.riskLevel !== simulatedRisk.riskLevel;
  const isImproved = projectedDelta > 0 || (riskChanged && simulatedRisk.riskLevel === 'LOW');

  let simulationSummary = '';
  if (projectedDelta > 0) {
    simulationSummary = `Targeted improvements would yield a +${projectedDelta} point gain in projected final score, transitioning student to ${simulatedRisk.riskLevel} risk status.`;
  } else if (projectedDelta < 0) {
    simulationSummary = `Projected score decreases by ${Math.abs(projectedDelta)} points under these simulated conditions.`;
  } else {
    simulationSummary = 'Performance parameters remain unchanged relative to baseline.';
  }

  return {
    originalScore: originalWeighted.score,
    originalProjectedScore: originalRegression.blendedProjectedScore,
    originalRiskLevel: originalRisk.riskLevel,
    simulatedScore: simulatedWeighted.score,
    simulatedProjectedScore: simulatedRegression.blendedProjectedScore,
    simulatedRiskLevel: simulatedRisk.riskLevel,
    scoreDelta,
    projectedDelta,
    riskChanged,
    isImproved,
    newRecommendations,
    simulationSummary,
  };
}
