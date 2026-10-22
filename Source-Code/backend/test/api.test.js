// Standalone API verification script for backend
const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';

async function runTests() {
  console.log(`\n[START] Backend Verification Tests against: ${BASE_URL}\n`);
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name} ->`, err.message);
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

  // Test 5: Metrics Recalculation Engine with Tasks & Decimal Review Score
  await test('Update Employee Metrics & Real-Time KPI Recalculation', async () => {
    const res = await fetch(`${BASE_URL}/api/performance/EMP-1001/metrics`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tasksGiven: 20,
        tasksCompleted: 19,
        reviewScore: 9.4,
        attendanceRate: 98,
        salary: 1350000,
        status: 'Active'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || data.metrics.overallScore < 90) {
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
  await test('Workforce Insights & Diagnostics (/api/insights)', async () => {
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

  // Test 9: Leaves Management & Auto Status Update
  await test('Leave Application & Approval Lifecycle', async () => {
    // Submit leave
    const applyRes = await fetch(`${BASE_URL}/api/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: 'EMP-1001',
        type: 'Privilege Leave',
        reason: 'Annual family leave',
        startDate: '2026-11-01',
        endDate: '2026-11-05',
        days: 5
      })
    });
    const applyData = await applyRes.json();
    if (!applyData.success) throw new Error('Leave submission failed');

    const leaveId = applyData.leaveRequest._id;

    // Approve leave
    const approveRes = await fetch(`${BASE_URL}/api/leaves/${leaveId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved', decisionNote: 'Approved by HR Director' })
    });
    const approveData = await approveRes.json();
    if (!approveData.success || approveData.employeeStatus !== 'On Leave') {
      throw new Error('Failed to auto-update employee status to On Leave');
    }
  });

  // Test 10: Feedback Dispatch
  await test('Feedback Message Dispatch & Retrieval', async () => {
    const sendRes = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: 'EMP-1001',
        message: 'Outstanding sprint delivery and architectural leadership.',
        category: 'Recognition',
        from: 'Priya Sharma (HR Director)'
      })
    });
    const sendData = await sendRes.json();
    if (!sendData.success) throw new Error('Feedback dispatch failed');

    const getRes = await fetch(`${BASE_URL}/api/feedback/EMP-1001`);
    const getData = await getRes.json();
    if (!getData.success || getData.feedbacks.length === 0) {
      throw new Error('Feedback retrieval failed');
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
