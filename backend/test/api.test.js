// Standalone API verification script for backend
const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';

async function runTests() {
  console.log(`\n🔍 Starting Backend Verification Tests against: ${BASE_URL}\n`);
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  };

  // Test 1: Health Check
  await test('Server Health Check (/health)', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Status not ok');
  });

  // Test 2: Auth Demo Login
  let token = '';
  await test('Demo Login as HR Director (/api/auth/demo-login)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'HR Director' })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.token) throw new Error('Failed to get token');
    token = data.token;
  });

  // Test 3: Employees List & Pagination
  await test('Get Employees List (/api/employees)', async () => {
    const res = await fetch(`${BASE_URL}/api/employees`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.employees)) throw new Error('Invalid employees payload');
    if (data.totalCount !== 15) throw new Error(`Expected exactly 15 employees, got ${data.totalCount}`);
  });

  // Test 4: Single Employee Lookup by EMP-ID
  await test('Get Single Employee (/api/employees/EMP-1001)', async () => {
    const res = await fetch(`${BASE_URL}/api/employees/EMP-1001`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.employee.employeeId !== 'EMP-1001') throw new Error('Mismatch employee ID');
    if (!data.recommendations) throw new Error('Missing smart recommendations');
  });

  // Test 5: Metrics Recalculation Engine
  await test('Update Employee Metrics & KPI Recalculation', async () => {
    const res = await fetch(`${BASE_URL}/api/performance/EMP-1001/metrics`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attendanceRate: 99,
        productivityScore: 98,
        taskCompletionRate: 97,
        workEfficiency: 96,
        projectContribution: 95
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.metrics.overallScore < 95) {
      throw new Error(`Recalculated score mismatch: ${data.metrics?.overallScore}`);
    }
  });

  // Test 6: Analytics Dashboard Aggregates
  await test('Analytics Dashboard Aggregates (/api/analytics/dashboard)', async () => {
    const res = await fetch(`${BASE_URL}/api/analytics/dashboard`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.stats || !data.departmentAnalytics || !data.topPerformers) {
      throw new Error('Analytics payload incomplete');
    }
  });

  // Test 7: Insights Engine
  await test('HR Insights & Recommendations (/api/insights)', async () => {
    const res = await fetch(`${BASE_URL}/api/insights`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.summary || !data.productivitySuggestions) {
      throw new Error('Insights payload incomplete');
    }
  });

  // Test 8: Report Generation
  await test('Monthly Executive Report Data (/api/reports/monthly)', async () => {
    const res = await fetch(`${BASE_URL}/api/reports/monthly?month=Dec`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.reportMetadata || !data.departmentRankings) {
      throw new Error('Report data incomplete');
    }
  });

  console.log(`\n========================================`);
  console.log(`  Tests Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
