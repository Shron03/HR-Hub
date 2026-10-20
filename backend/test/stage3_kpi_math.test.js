// Verification Check 3: KPI Mathematical Precision & Boundary Conditions
const BASE_URL = 'http://localhost:5000';

async function testKpiMathAndEdgeCases() {
  console.log('[TEST] Running Verification Check 3: Real-Time KPI Precision & Boundary Conditions...\n');

  const testCases = [
    {
      label: 'Boundary 1: Perfect Score (100%)',
      input: { tasksGiven: 20, tasksCompleted: 20, reviewScore: 10.0, attendanceRate: 100 },
      expectedScore: 100,
      expectedCategory: 'Exceptional'
    },
    {
      label: 'Boundary 2: Exceptional High Rating (92%)',
      input: { tasksGiven: 25, tasksCompleted: 24, reviewScore: 9.0, attendanceRate: 95 },
      // TaskRate: (24/25)*100 = 96%. Review: 90%. Attendance: 95%.
      // Formula: 95*0.2 + 96*0.4 + 90*0.4 = 19 + 38.4 + 36 = 93.4 -> 93%
      expectedScore: 93,
      expectedCategory: 'Exceptional'
    },
    {
      label: 'Boundary 3: Strong Performer (88%)',
      input: { tasksGiven: 20, tasksCompleted: 18, reviewScore: 8.5, attendanceRate: 92 },
      // TaskRate: (18/20)*100 = 90%. Review: 85%. Attendance: 92%.
      // Formula: 92*0.2 + 90*0.4 + 85*0.4 = 18.4 + 36 + 34 = 88.4 -> 88%
      expectedScore: 88,
      expectedCategory: 'Strong Performer'
    },
    {
      label: 'Boundary 4: Decimal Review Score Precision (8.7)',
      input: { tasksGiven: 30, tasksCompleted: 27, reviewScore: 8.7, attendanceRate: 90 },
      // TaskRate: (27/30)*100 = 90%. Review: 87%. Attendance: 90%.
      // Formula: 90*0.2 + 90*0.4 + 87*0.4 = 18 + 36 + 34.8 = 88.8 -> 89%
      expectedScore: 89,
      expectedCategory: 'Strong Performer'
    },
    {
      label: 'Boundary 5: Needs Improvement (<70%)',
      input: { tasksGiven: 20, tasksCompleted: 12, reviewScore: 6.2, attendanceRate: 75 },
      // TaskRate: (12/20)*100 = 60%. Review: 62%. Attendance: 75%.
      // Formula: 75*0.2 + 60*0.4 + 62*0.4 = 15 + 24 + 24.8 = 63.8 -> 64%
      expectedScore: 64,
      expectedCategory: 'Needs Improvement'
    }
  ];

  for (const tc of testCases) {
    const res = await fetch(`${BASE_URL}/api/performance/EMP-1001/metrics`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tc.input)
    });

    const data = await res.json();
    if (!data.success) {
      console.error(`[FAIL] ${tc.label} - API returned error:`, data.message);
      process.exit(1);
    }

    const actualScore = data.metrics.overallScore;
    const actualCategory = data.performanceCategory;

    console.log(`- ${tc.label}`);
    console.log(`  Inputs: Tasks ${tc.input.tasksCompleted}/${tc.input.tasksGiven}, Review ${tc.input.reviewScore}/10, Attendance ${tc.input.attendanceRate}%`);
    console.log(`  Output: Score ${actualScore}% [${actualCategory}] (Expected: ~${tc.expectedScore}% [${tc.expectedCategory}])`);

    if (Math.abs(actualScore - tc.expectedScore) > 1 || actualCategory !== tc.expectedCategory) {
      console.error(`  [MISMATCH] Calculation differed: actual ${actualScore} vs expected ${tc.expectedScore}`);
      process.exit(1);
    }
  }

  // Restore Aarav Patel's standard baseline
  await fetch(`${BASE_URL}/api/performance/EMP-1001/metrics`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tasksGiven: 20,
      tasksCompleted: 18,
      reviewScore: 8.5,
      attendanceRate: 92,
      salary: 1250000,
      status: 'Active'
    })
  });

  console.log('\n[PASS] Verification Check 3: Real-Time KPI Precision Verified.\n');
}

testKpiMathAndEdgeCases().catch(err => {
  console.error('[ERROR] Verification Check 3 Failed:', err);
  process.exit(1);
});
