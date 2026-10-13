import { MonthlyRecord, TrendAnalysis } from './types';
import { EngineThresholds, DEFAULT_THRESHOLDS } from './weights';

/**
 * Hand-crafted Ordinary Least Squares (OLS) Linear Regression
 * NO external Machine Learning library used.
 * Computes:
 *   slope m = sum((x - x_bar)(y - y_bar)) / sum((x - x_bar)^2)
 *   intercept c = y_bar - m * x_bar
 *   R^2 coefficient of determination
 */
export function computeLinearRegressionTrend(
  history: MonthlyRecord[],
  currentWeightedScore: number,
  thresholds: EngineThresholds = DEFAULT_THRESHOLDS
): { trend: TrendAnalysis; blendedProjectedScore: number } {
  // If insufficient points, generate baseline from current score
  const points: { x: number; y: number; name: string }[] = 
    history && history.length >= 2
      ? history.map((h, idx) => ({
          x: h.monthIndex ?? (idx + 1),
          y: h.score,
          name: h.monthName || `M${idx + 1}`,
        }))
      : [
          { x: 1, y: Math.max(0, currentWeightedScore - 5), name: 'M1' },
          { x: 2, y: Math.max(0, currentWeightedScore - 2), name: 'M2' },
          { x: 3, y: currentWeightedScore, name: 'M3' },
        ];

  const n = points.length;
  let sumX = 0;
  let sumY = 0;

  for (let i = 0; i < n; i++) {
    sumX += points[i].x;
    sumY += points[i].y;
  }

  const xBar = sumX / n;
  const yBar = sumY / n;

  let ssXX = 0;
  let ssYY = 0;
  let ssXY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = points[i].x - xBar;
    const diffY = points[i].y - yBar;
    ssXX += diffX * diffX;
    ssYY += diffY * diffY;
    ssXY += diffX * diffY;
  }

  const slope = ssXX !== 0 ? ssXY / ssXX : 0;
  const intercept = yBar - (slope * xBar);

  const denom = ssXX * ssYY;
  const rSquared = denom > 0 ? Math.min(1.0, Math.max(0.0, (ssXY * ssXY) / denom)) : 0.0;

  // Check 3 consecutive drops
  let consecutiveDrops = 0;
  if (n >= 4) {
    for (let i = n - 1; i >= n - 3; i--) {
      if (points[i].y < points[i - 1].y) {
        consecutiveDrops++;
      }
    }
  } else if (n >= 3) {
    for (let i = n - 1; i >= 1; i--) {
      if (points[i].y < points[i - 1].y) {
        consecutiveDrops++;
      }
    }
  }
  const isConsecutivelyDeclining = consecutiveDrops >= 2 && slope < -0.3;

  // Project to exam month (month N + 1)
  const examMonthIndex = n + 1;
  const rawProjectedScore = slope * examMonthIndex + intercept;
  const clampedProjected = Math.max(0, Math.min(100, rawProjectedScore));

  // Blend: 70% linear trend projection + 30% current weighted score
  const blended = 
    (clampedProjected * thresholds.projectionWeightTrend) +
    (currentWeightedScore * thresholds.projectionWeightScore);

  const finalProjectedScore = Math.round(Math.max(0, Math.min(100, blended)) * 10) / 10;

  // Format monthly points for charting
  const monthlyChartPoints: { month: string; actual: number; projected?: number }[] = points.map(p => ({
    month: p.name,
    actual: Math.round(p.y * 10) / 10,
  }));

  // Append projected point
  monthlyChartPoints.push({
    month: 'Exam Projected',
    actual: Math.round(points[points.length - 1].y * 10) / 10,
    projected: finalProjectedScore,
  });

  const trendDirection: 'improving' | 'declining' | 'stable' = 
    slope > 0.5 ? 'improving' : slope < -0.5 ? 'declining' : 'stable';

  const trend: TrendAnalysis = {
    slope: Math.round(slope * 100) / 100,
    intercept: Math.round(intercept * 100) / 100,
    rSquared: Math.round(rSquared * 100) / 100,
    trendDirection,
    isConsecutivelyDeclining,
    projectedMonthScore: Math.round(rawProjectedScore * 10) / 10,
    monthlyPoints: monthlyChartPoints,
  };

  return {
    trend,
    blendedProjectedScore: finalProjectedScore,
  };
}
