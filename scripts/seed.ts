import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { analyzeStudent, SubjectInternalMark } from '../lib/engine';

const prisma = new PrismaClient();

const SUBJECTS = [
  { code: 'CS301', name: 'Data Structures & Algorithms' },
  { code: 'CS302', name: 'Database Management Systems' },
  { code: 'CS303', name: 'Computer Networks' },
  { code: 'CS304', name: 'Operating Systems' },
  { code: 'CS305', name: 'Software Engineering' },
];

const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

const FIRST_NAMES = [
  'Aarav', 'Aditi', 'Advait', 'Ananya', 'Aryan', 'Bhavya', 'Chirag', 'Dev',
  'Diya', 'Esha', 'Gaurav', 'Isha', 'Ishaan', 'Kavya', 'Karan', 'Khushi',
  'Manish', 'Meera', 'Neha', 'Nikhil', 'Pooja', 'Pranav', 'Priya', 'Rahul',
  'Riya', 'Rohan', 'Sakshi', 'Sameer', 'Sanya', 'Shreya', 'Siddharth', 'Sneha',
  'Tanvi', 'Tarun', 'Utkarsh', 'Varun', 'Vidya', 'Vikram', 'Yash', 'Zara',
  'Ayush', 'Divya', 'Harsh', 'Jatin', 'Kritika', 'Mohit', 'Nandini', 'Parth',
  'Ritika', 'Sanket', 'Simran', 'Tejas', 'Vaishnavi', 'Vivek', 'Zoya'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Singh', 'Gupta',
  'Deshmukh', 'Joshi', 'Kulkarni', 'Bhat', 'Rao', 'Iyer', 'Menon', 'Chopra',
  'Kapoor', 'Malhotra', 'Bansal', 'Agarwal', 'Chatterjee', 'Das', 'Sen', 'Ghosh'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number, decimals = 1): number {
  const val = Math.random() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

async function seed() {
  console.log('--- Cleaning previous records ---');
  await prisma.performanceHistory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.student.deleteMany();

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const teacherHash = await bcrypt.hash('Teacher@123', 10);
  const studentHash = await bcrypt.hash('Student@123', 10);

  console.log('--- Seeding 150 synthetic students ---');

  const classes = ['CS-A', 'CS-B', 'CS-C'];
  let rollCounter = 1;
  const createdStudents = [];

  for (let cIdx = 0; cIdx < classes.length; cIdx++) {
    const classId = classes[cIdx];
    
    for (let i = 0; i < 50; i++) {
      const rollNo = `CS2026-${String(rollCounter).padStart(3, '0')}`;
      const firstName = getRandomItem(FIRST_NAMES);
      const lastName = getRandomItem(LAST_NAMES);
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rollCounter}@acadrisk.edu`;

      // Assign student archetypes for realistic diversity
      // Archetypes: 20% High Risk, 38% Medium Risk, 42% Low Risk
      const archetypeRoll = Math.random();
      let attendance: number;
      let weeklyStudyHours: number;
      let assignmentCompletion: number;
      let previousGpa: number;
      let backlogs: number;
      let participation: number;
      let lateSubmissions: number;
      let marksBase: number;
      let trendType: 'declining' | 'improving' | 'stable';

      if (archetypeRoll < 0.20) {
        // High Risk profile
        attendance = randomBetween(52, 73, 1);
        weeklyStudyHours = randomBetween(3, 7.5, 1);
        assignmentCompletion = randomBetween(40, 62, 1);
        previousGpa = randomBetween(4.0, 5.8, 2);
        backlogs = Math.floor(randomBetween(1, 4, 0));
        participation = Math.floor(randomBetween(1, 2.5, 0));
        lateSubmissions = Math.floor(randomBetween(3, 8, 0));
        marksBase = randomBetween(38, 52, 1);
        trendType = Math.random() < 0.7 ? 'declining' : 'stable';
      } else if (archetypeRoll < 0.58) {
        // Medium Risk profile
        attendance = randomBetween(74, 84, 1);
        weeklyStudyHours = randomBetween(8, 13.5, 1);
        assignmentCompletion = randomBetween(65, 82, 1);
        previousGpa = randomBetween(6.0, 7.4, 2);
        backlogs = Math.random() < 0.25 ? 1 : 0;
        participation = Math.floor(randomBetween(2.5, 4, 0));
        lateSubmissions = Math.floor(randomBetween(1, 3, 0));
        marksBase = randomBetween(56, 69, 1);
        trendType = Math.random() < 0.35 ? 'declining' : Math.random() < 0.7 ? 'stable' : 'improving';
      } else {
        // Low Risk profile
        attendance = randomBetween(85, 98, 1);
        weeklyStudyHours = randomBetween(14, 24, 1);
        assignmentCompletion = randomBetween(85, 99, 1);
        previousGpa = randomBetween(7.6, 9.8, 2);
        backlogs = 0;
        participation = Math.floor(randomBetween(3.5, 5, 0));
        lateSubmissions = Math.random() < 0.2 ? 1 : 0;
        marksBase = randomBetween(72, 94, 1);
        trendType = Math.random() < 0.6 ? 'improving' : 'stable';
      }

      // 5 Subjects with 3 tests each
      const internalMarks: SubjectInternalMark[] = SUBJECTS.map(sub => {
        const t1 = Math.max(20, Math.min(100, Math.round(marksBase + randomBetween(-10, 10))));
        const t2 = Math.max(20, Math.min(100, Math.round(marksBase + randomBetween(-8, 12))));
        const t3 = Math.max(20, Math.min(100, Math.round(marksBase + randomBetween(-6, 14))));
        const avg = Math.round(((t1 + t2 + t3) / 3) * 10) / 10;
        return {
          subjectCode: sub.code,
          subjectName: sub.name,
          test1: t1,
          test2: t2,
          test3: t3,
          average: avg,
        };
      });

      // 6 Monthly historical points
      const monthlyHistory = [];
      let baseScore = marksBase * 0.8 + (attendance / 100) * 15;
      for (let m = 0; m < 6; m++) {
        let step = 0;
        if (trendType === 'declining') {
          step = -randomBetween(1.2, 3.5, 1);
        } else if (trendType === 'improving') {
          step = randomBetween(1.0, 3.0, 1);
        } else {
          step = randomBetween(-1.2, 1.2, 1);
        }
        baseScore = Math.max(25, Math.min(98, baseScore + step));
        monthlyHistory.push({
          monthIndex: m + 1,
          monthName: MONTHS[m],
          score: Math.round(baseScore * 10) / 10,
        });
      }

      // Analyze with the Smart Analysis Engine
      const studentInput = {
        rollNo,
        name: fullName,
        email,
        classId,
        attendance,
        weeklyStudyHours,
        assignmentCompletion,
        internalMarks,
        previousGpa,
        backlogs,
        participation,
        lateSubmissions,
        monthlyHistory,
      };

      const analysis = analyzeStudent(studentInput);

      const created = await prisma.student.create({
        data: {
          rollNo,
          name: fullName,
          email,
          classId,
          attendance,
          weeklyStudyHours,
          assignmentCompletion,
          previousGpa,
          backlogs,
          participation,
          lateSubmissions,
          internalMarksJson: JSON.stringify(internalMarks),
          currentScore: analysis.currentWeightedScore,
          predictedScore: analysis.projectedScore,
          riskLevel: analysis.riskLevel,
          earlyWarning: analysis.earlyWarning,
          earlyWarningReasons: JSON.stringify(analysis.earlyWarningReasons),
          trendSlope: analysis.trend.slope,
          trendDirection: analysis.trend.trendDirection,
          monthlyHistory: {
            create: monthlyHistory.map(mh => ({
              monthIndex: mh.monthIndex,
              monthName: mh.monthName,
              score: mh.score,
            })),
          },
        },
      });

      createdStudents.push(created);
      rollCounter++;
    }
  }

  console.log(`Seeded ${createdStudents.length} students across 3 classes.`);

  // Create demo user accounts
  console.log('--- Creating demo accounts ---');
  await prisma.user.create({
    data: {
      email: 'admin@acadrisk.edu',
      passwordHash,
      name: 'Dr. Evelyn Vance (Dean)',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'teacher@acadrisk.edu',
      passwordHash: teacherHash,
      name: 'Prof. Marcus Holloway',
      role: 'TEACHER',
    },
  });

  // Link first student to student demo account
  const demoStudent = createdStudents[0];
  await prisma.user.create({
    data: {
      email: 'student@acadrisk.edu',
      passwordHash: studentHash,
      name: demoStudent.name,
      role: 'STUDENT',
      studentId: demoStudent.id,
    },
  });

  console.log('✅ Demo accounts seeded:');
  console.log('  Admin:   admin@acadrisk.edu   / Admin@123');
  console.log('  Teacher: teacher@acadrisk.edu / Teacher@123');
  console.log('  Student: student@acadrisk.edu / Student@123');
  console.log('✅ Database setup complete!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
