import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  computeWeightedPerformanceScore,
  computeLinearRegressionTrend,
  evaluateRisk,
  explainStudentRisk,
  generateRecommendations,
  simulateStudentPerformance,
  analyzeStudent,
  DEFAULT_WEIGHTS,
  DEFAULT_THRESHOLDS,
  StudentInputData,
} from '../lib/engine';

describe('AcadRisk Smart Analysis Engine Tests', () => {
  const sampleStudent: StudentInputData = {
    rollNo: 'CS2026-001',
    name: 'Aarav Sharma',
    classId: 'CS-A',
    attendance: 80,
    weeklyStudyHours: 14,
    assignmentCompletion: 80,
    internalMarks: 70,
    previousGpa: 8.0,
    backlogs: 0,
    participation: 4,
    lateSubmissions: 1,
    monthlyHistory: [
      { monthIndex: 1, monthName: 'Aug', score: 65 },
      { monthIndex: 2, monthName: 'Sep', score: 68 },
      { monthIndex: 3, monthName: 'Oct', score: 70 },
      { monthIndex: 4, monthName: 'Nov', score: 72 },
      { monthIndex: 5, monthName: 'Dec', score: 74 },
      { monthIndex: 6, monthName: 'Jan', score: 76 },
    ],
  };

  const atRiskStudent: StudentInputData = {
    rollNo: 'CS2026-088',
    name: 'Rohan Verma',
    classId: 'CS-B',
    attendance: 62, // Critical attendance
    weeklyStudyHours: 5, // Critical study hours
    assignmentCompletion: 45,
    internalMarks: 42,
    previousGpa: 4.8,
    backlogs: 2,
    participation: 2,
    lateSubmissions: 4,
    monthlyHistory: [
      { monthIndex: 1, monthName: 'Aug', score: 60 },
      { monthIndex: 2, monthName: 'Sep', score: 56 },
      { monthIndex: 3, monthName: 'Oct', score: 52 },
      { monthIndex: 4, monthName: 'Nov', score: 48 },
      { monthIndex: 5, monthName: 'Dec', score: 44 },
      { monthIndex: 6, monthName: 'Jan', score: 40 },
    ],
  };

  it('1. Computes weighted score with zero external ML', () => {
    const { score, normalized } = computeWeightedPerformanceScore(sampleStudent);
    // Calculated: 16 (att) + 21 (int) + 12 (assign) + 12 (gpa) + 7 (study) + 4 (part) - 0.75 (late sub) = 71.25 -> 71.3
    assert.ok(score >= 70 && score <= 73, `Score should be around 71.3, got ${score}`);
    assert.strictEqual(normalized.penaltyPoints, 0.75);
    assert.strictEqual(normalized.attendanceNorm, 80);
  });

  it('2. Hand-crafted linear regression computes correct slope and projection', () => {
    const { trend, blendedProjectedScore } = computeLinearRegressionTrend(
      sampleStudent.monthlyHistory!,
      71.3,
      DEFAULT_THRESHOLDS
    );

    // 65 to 76 across 6 points -> slope is ~2.2
    assert.ok(trend.slope > 0, `Slope should be positive, got ${trend.slope}`);
    assert.strictEqual(trend.trendDirection, 'improving');
    assert.ok(trend.rSquared > 0.95, `R^2 should be strong for linear sequence, got ${trend.rSquared}`);
    assert.ok(blendedProjectedScore >= 72, `Blended projected score should be >= 72, got ${blendedProjectedScore}`);
  });

  it('3. Detects early warning flags for at-risk students', () => {
    const result = analyzeStudent(atRiskStudent);
    
    assert.strictEqual(result.riskLevel, 'HIGH');
    assert.strictEqual(result.earlyWarning, true);
    assert.ok(result.earlyWarningReasons.length >= 1);
    assert.ok(result.earlyWarningReasons.some(r => r.includes('Attendance critical')));
  });

  it('4. Provides transparent explainability factor gap breakdown', () => {
    const result = analyzeStudent(atRiskStudent);
    const { topNegativeDrivers, allFactors } = result.explainability;

    assert.ok(topNegativeDrivers.length >= 3, 'Should provide top 3 reasons student is at risk');
    assert.ok(allFactors.length === 7, 'Should cover all 7 academic factors');
    // Internal marks and attendance should be among the top negative drivers
    const drivers = topNegativeDrivers.map(d => d.factor);
    assert.ok(drivers.includes('Internal Examination Marks') || drivers.includes('Classroom Attendance'));
  });

  it('5. Generates prioritized, rule-based recommendations', () => {
    const result = analyzeStudent(atRiskStudent);
    const highPriorityRecs = result.recommendations.filter(r => r.priority === 'HIGH');

    assert.ok(highPriorityRecs.length >= 2, 'Should have multiple high priority interventions for at-risk student');
    assert.ok(result.recommendations.some(r => r.category.includes('Attendance')));
    assert.ok(result.recommendations.some(r => r.category.includes('Curriculum Clearance')));
  });

  it('6. What-if simulator accurately projects improvements with interactive sliders', () => {
    const simulation = simulateStudentPerformance(atRiskStudent, {
      attendance: 85,
      weeklyStudyHours: 16,
      assignmentCompletion: 80,
    });

    assert.ok(simulation.simulatedScore > simulation.originalScore, 'Simulated score must increase');
    assert.ok(simulation.projectedDelta > 0, 'Projected score delta must be positive');
    assert.strictEqual(simulation.isImproved, true);
  });
});
