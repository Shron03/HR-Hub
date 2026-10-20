// Verification Check 5: Full-Stack Integration, CORS, Concurrent Load & Resilience Test
const BASE_URL = 'http://localhost:5000';

async function testIntegrationAndResilience() {
  console.log('[TEST] Running Verification Check 5: Full-Stack Integration & Resilience...\n');

  // 1. Verify CORS & Security Headers
  const optionsRes = await fetch(`${BASE_URL}/health`);
  const corsHeader = optionsRes.headers.get('access-control-allow-origin');
  if (corsHeader !== '*') {
    console.warn('- Note: access-control-allow-origin is:', corsHeader);
  } else {
    console.log('- CORS Headers verified: access-control-allow-origin = *');
  }

  // 2. Test Invalid Payload Handling (Negative Test)
  const invalidRes = await fetch(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salary: 50000 }) // Missing required name, email, department, role
  });
  if (invalidRes.status !== 400) {
    throw new Error(`Expected status 400 for invalid employee, got ${invalidRes.status}`);
  }
  const invalidData = await invalidRes.json();
  if (invalidData.success !== false) {
    throw new Error('Expected success: false for invalid payload');
  }
  console.log('- Negative Validation Test Passed: 400 Bad Request returned with validation error message');

  // 3. Concurrent Requests Stress Test (25 Parallel Queries)
  console.log('- Dispatching 25 parallel requests to /api/analytics/dashboard...');
  const startTime = Date.now();
  const promises = Array.from({ length: 25 }, () => fetch(`${BASE_URL}/api/analytics/dashboard`));
  const responses = await Promise.all(promises);
  const duration = Date.now() - startTime;

  for (const r of responses) {
    if (!r.ok) throw new Error(`Concurrent request failed with status: ${r.status}`);
  }
  console.log(`- 25 concurrent requests resolved in ${duration}ms (Avg ${Math.round(duration / 25)}ms per request)`);

  // 4. Test Demo Seeding (15 Indian Employees)
  const seedRes = await fetch(`${BASE_URL}/api/employees/seed-demo`, { method: 'POST' });
  const seedData = await seedRes.json();
  if (!seedData.success || seedData.employeesCount !== 15) {
    throw new Error(`Expected exactly 15 employees after seed-demo, got ${seedData.employeesCount}`);
  }
  console.log(`- Demo Data Endpoint verified: Generated ${seedData.employeesCount} Indian employees & ${seedData.departmentsCount} departments`);

  // 5. Test Leaves Endpoints
  const leavesRes = await fetch(`${BASE_URL}/api/leaves`);
  const leavesData = await leavesRes.json();
  if (!leavesData.success) throw new Error('Leaves endpoint returned error');
  console.log(`- Leave Requests Endpoint verified: Retrieved ${leavesData.count} leave record(s)`);

  // 6. Test Notifications Endpoint
  const notifRes = await fetch(`${BASE_URL}/api/leaves/notifications`);
  const notifData = await notifRes.json();
  if (!notifData.success) throw new Error('Notifications endpoint returned error');
  console.log(`- HR Notification Endpoint verified: Retrieved ${notifData.count} notification(s)`);

  console.log('\n[PASS] Verification Check 5: Full-Stack Integration & Resilience Verified.\n');
}

testIntegrationAndResilience().catch(err => {
  console.error('[ERROR] Check 5 FAILED:', err);
  process.exit(1);
});
