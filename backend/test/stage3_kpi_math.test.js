// Stage 3: KPI Mathematical Precision & Edge Cases Verification
const BASE_URL = 'http://localhost:5000';

async function testKpiMathAndEdgeCases() {
  console.log('🧪 Running Verification Check 3: KPI Precision & Boundary Conditions...\n');

  const testCases = [
    {
      label: 'Boundary 1: Perfect Score (100)',
      input: { attendanceRate: 100, taskCompletionRate: 100, productivityScore: 100, projectContribution: 100, workEfficiency: 100 },
      expectedScore: 100,
      expectedCategory: 'Exceptional'
    },
    {
      label: 'Boundary 2: Exceptional Threshold (92)',
      input: { attendanceRate: 92, taskCompletionRate: 92, productivityScore: 92, projectContribution: 92, workEfficiency: 92 },
      expectedScore: 92,
      expectedCategory: 'Exceptional'
    },
    {
      label: 'Boundary 3: Strong Performer (85)',
      input: { attendanceRate: 85, taskCompletionRate: 85, productivityScore: 85, projectContribution: 85, workEfficiency: 85 },
      expectedScore: 85,
      expectedCategory: 'Strong Performer'
    },
    {
      label: 'Boundary 4: Meets Expectations (75)',
      input: { attendanceRate: 75, taskCompletionRate: 75, productivityScore: 75, projectContribution: 75, workEfficiency: 75 },
      expectedScore: 75,
      expectedCategory: 'Meets Expectations'
    },
    {
      label: 'Boundary 5: Needs Improvement (65)',
      input: { attendanceRate: 65, taskCompletionRate: 65, productivityScore: 65, projectContribution: 65, workEfficiency: 65 },
      expectedScore: 65,
      expectedCategory: 'Needs Improvement'
    },
    {
      label: 'Boundary 6: Critical Attention (50)',
      input: { attendanceRate: 50, taskCompletionRate: 50, productivityScore: 50, projectContribution: 50, workEfficiency: 50 },
      expectedScore: 50,
      expectedCategory: 'Critical Attention'
    }
  ];

  for (const tc of testCases) {
    const res = await fetch(`${BASE_URL}/api/performance/EMP-1001/metrics`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tc.input)
    });

    const data = await res.json();
    if (!data.success) throw new Error(`API failed on ${tc.label}: ${data.message}`);

    const score = data.metrics.overallScore;
    const cat = data.performanceCategory;

    if (score !== tc.expectedScore) {
      throw new Error(`${tc.label}: Expected score ${tc.expectedScore}, got ${score}`);
    }
    if (cat !== tc.expectedCategory) {
      throw new Error(`${tc.label}: Expected category ${tc.expectedCategory}, got ${cat}`);
    }

    console.log(`  ✅ ${tc.label} -> Calculated: ${score}%, Tier: ${cat}`);
  }

  // Restore EMP-1001 to original baseline
  await fetch(`${BASE_URL}/api/performance/EMP-1001/metrics`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attendanceRate: 98, taskCompletionRate: 96, productivityScore: 95, projectContribution: 94, workEfficiency: 96 })
  });

  console.log('\n🎉 Verification Check 3: PASSED!\n');
}

testKpiMathAndEdgeCases().catch(err => {
  console.error('❌ Check 3 FAILED:', err);
  process.exit(1);
});
