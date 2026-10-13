import { StudentInputData, RecommendationItem, TrendAnalysis } from './types';
import { NormalizedMetrics } from './scoring';

/**
 * Transparent Rule-Based Pedagogical Recommendation Engine.
 * Evaluates student performance triggers and synthesizes prioritized, actionable interventions.
 */
export function generateRecommendations(
  student: StudentInputData,
  normalized: NormalizedMetrics,
  trend: TrendAnalysis,
  currentScore: number
): RecommendationItem[] {
  const recommendations: RecommendationItem[] = [];

  // 1. Critical Attendance Rule (< 75%)
  if (student.attendance < 75.0) {
    recommendations.push({
      id: 'rec-attendance-critical',
      category: 'Attendance & Compliance',
      priority: 'HIGH',
      title: 'Mandatory Attendance Recovery Contract & Advisor Mentoring',
      rationale: `Student attendance is at ${Math.round(student.attendance)}%, which breaches the institutional 75% threshold and poses an exam debarment risk.`,
      actionItems: [
        'Issue a formal academic attendance contract requiring 90%+ attendance over the next 4 weeks.',
        'Schedule a mandatory 1-on-1 meeting with the department student counselor.',
        'Set up bi-weekly SMS/email attendance notification alerts for faculty advisor.',
      ],
      expectedImpact: '+10% to +15% boost in attendance and qualification for end-semester exams',
      timeline: 'Immediate (Within 48 hours)',
    });
  } else if (student.attendance < 80.0) {
    recommendations.push({
      id: 'rec-attendance-warning',
      category: 'Attendance & Compliance',
      priority: 'MEDIUM',
      title: 'Attendance Buffer Safeguard Plan',
      rationale: `Attendance is hovering near the margin at ${Math.round(student.attendance)}%. Unplanned absences could breach the 75% threshold.`,
      actionItems: [
        'Commit to zero unexcused absences for the next 3 weeks to build a safety buffer.',
        'Utilize flexible lab makeup hours if available.',
      ],
      expectedImpact: 'Prevents slipping below 75% threshold',
      timeline: 'Next 7 days',
    });
  }

  // 2. Trajectory / Negative Trend Warning
  if (trend.isConsecutivelyDeclining || trend.slope < -1.5) {
    recommendations.push({
      id: 'rec-trend-critical',
      category: 'Performance Trajectory',
      priority: 'HIGH',
      title: 'Urgent Mid-Semester Coursework Diagnostic & Check-in',
      rationale: `Scores are declining at a rate of ${Math.abs(trend.slope)} points per month across consecutive evaluation periods.`,
      actionItems: [
        'Conduct a diagnostic review of weak test chapters with course instructors.',
        'Identify root causes (e.g. personal, health, course difficulty, or burnout).',
        'Establish weekly milestone evaluations to halt further decline.',
      ],
      expectedImpact: 'Arrests score deterioration and stabilizes performance trend',
      timeline: 'Immediate (Within 3 days)',
    });
  }

  // 3. Internal Examination Marks
  if (normalized.internalMarksNorm < 50.0) {
    recommendations.push({
      id: 'rec-internals-critical',
      category: 'Academic Core',
      priority: 'HIGH',
      title: 'Targeted Remedial Subject Workshops & Peer Tutoring',
      rationale: `Average internal marks are at ${Math.round(normalized.internalMarksNorm)}%, indicating comprehension gaps in core technical subjects.`,
      actionItems: [
        'Enroll in after-hours department remedial tutoring sessions (2 sessions/week).',
        'Pair with an assigned high-performing peer tutor for weekly problem-solving circles.',
        'Submit weekly practice problem sets for faculty review.',
      ],
      expectedImpact: '+12 to +18 marks on subsequent internal and final assessments',
      timeline: 'Next 2-4 weeks',
    });
  } else if (normalized.internalMarksNorm < 65.0) {
    recommendations.push({
      id: 'rec-internals-moderate',
      category: 'Academic Core',
      priority: 'MEDIUM',
      title: 'Conceptual Reinforcement & Mock Exam Prep',
      rationale: `Internal marks (${Math.round(normalized.internalMarksNorm)}%) are below cohort standard (68.2%), leaving little room for error on finals.`,
      actionItems: [
        'Review past 3 years of semester question papers with faculty solution keys.',
        'Attend weekly departmental doubt clearing office hours.',
      ],
      expectedImpact: '+8 to +10 marks improvement on final exam',
      timeline: 'Next 2 weeks',
    });
  }

  // 4. Study Hours Deficiency (< 8 hrs/week)
  if (student.weeklyStudyHours < 8.0) {
    recommendations.push({
      id: 'rec-study-hours-critical',
      category: 'Study Habits & Scheduling',
      priority: 'HIGH',
      title: 'Structured Weekly Study Timetable & Habit Coaching',
      rationale: `Student logs only ${student.weeklyStudyHours} hours of independent study per week, far below the recommended 15-20 hours.`,
      actionItems: [
        'Construct a fixed 2-hour daily study block into personal Google/phone calendar.',
        'Utilize the Pomodoro technique (25 min study / 5 min break) for focused sessions.',
        'Access campus quiet study zones or library study pods during scheduled blocks.',
      ],
      expectedImpact: 'Doubles productive study volume and improves retention',
      timeline: 'Start this week',
    });
  } else if (student.weeklyStudyHours < 12.0) {
    recommendations.push({
      id: 'rec-study-hours-moderate',
      category: 'Study Habits & Scheduling',
      priority: 'MEDIUM',
      title: 'Independent Study Expansion & Resource Utilization',
      rationale: `Current study volume (${student.weeklyStudyHours} hrs/week) meets baseline requirements but leaves little time for revision.`,
      actionItems: [
        'Increase weekly revision time by 3-4 hours focusing on highest-weight subjects.',
        'Form a 3-person study circle for collaborative code reviews and problem sets.',
      ],
      expectedImpact: '+5% to +8% performance gain',
      timeline: 'Next 10 days',
    });
  }

  // 5. Late Submissions & Assignment Completion
  if (student.lateSubmissions >= 3 || student.assignmentCompletion < 60.0) {
    recommendations.push({
      id: 'rec-assignments-deadlines',
      category: 'Time Management',
      priority: 'MEDIUM',
      title: 'Assignment Deadline Tracker & Milestone Checkpoints',
      rationale: `Student has logged ${student.lateSubmissions} late submissions with a ${Math.round(student.assignmentCompletion)}% completion rate, incurring unnecessary penalty points.`,
      actionItems: [
        'Implement an assignment milestone tracker (breaking projects into 3 progressive check-ins).',
        'Set personal submission deadlines 24 hours ahead of portal closure.',
        'Consult teaching assistants 3 days before project due dates for roadblock removal.',
      ],
      expectedImpact: 'Recovers up to 5 penalty points and secures full assignment credit',
      timeline: 'Immediate for all active assignments',
    });
  }

  // 6. Backlogs Accumulation
  if (student.backlogs > 0) {
    recommendations.push({
      id: 'rec-backlogs-clearance',
      category: 'Curriculum Clearance',
      priority: 'HIGH',
      title: 'Backlog Clearance Action Plan & Supplementary Exam Prep',
      rationale: `Student is carrying ${student.backlogs} backlog course(s), which causes cognitive overload alongside current semester coursework.`,
      actionItems: [
        'Register for the upcoming supplementary examination cycle.',
        'Allocate 4 dedicated hours every weekend exclusively to backlog syllabus revision.',
        'Obtain syllabus blueprints and question banks from department coordinator.',
      ],
      expectedImpact: 'Clears lingering academic debt and reduces academic stress',
      timeline: 'Entire current semester',
    });
  }

  // 7. Low Participation
  if (student.participation <= 2) {
    recommendations.push({
      id: 'rec-participation-low',
      category: 'Engagement & Collaboration',
      priority: 'LOW',
      title: 'Interactive Lab Engagement & Group Discussion Activation',
      rationale: `Classroom participation score is ${student.participation}/5. Active engagement strongly correlates with conceptual retention.`,
      actionItems: [
        'Volunteer to present one seminar topic or code walkthrough this semester.',
        'Engage actively in lab pair-programming exercises.',
      ],
      expectedImpact: 'Strengthens soft skills and secures full internal participation marks',
      timeline: 'Next 3 weeks',
    });
  }

  // 8. Positive Enrichment (for high achievers / low risk)
  if (currentScore >= 75.0 && recommendations.length === 0) {
    recommendations.push({
      id: 'rec-honors-mentorship',
      category: 'Academic Enrichment',
      priority: 'LOW',
      title: 'Advanced Honors Track & Peer Mentorship Opportunity',
      rationale: 'Student is demonstrating exemplary academic performance across all metrics.',
      actionItems: [
        'Apply for departmental undergraduate research assistantship (URA).',
        'Join the peer-tutoring fellowship to mentor first-year students.',
        'Explore inter-university hackathons and conference paper submissions.',
      ],
      expectedImpact: 'Prepares student for honors graduation and competitive placements',
      timeline: 'Ongoing semester',
    });
  }

  // Sort by priority: HIGH -> MEDIUM -> LOW
  const priorityOrder: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}
