// Stage 2: Database Persistence & Task Lifecycle Test
const BASE_URL = 'http://localhost:5000';

async function testDatabaseAndTasks() {
  console.log('🧪 Running Verification Check 2: Database Persistence & Task Management...\n');

  // 1. Create a dynamic test employee
  const testEmpData = {
    employeeId: 'TEST-EMP-999',
    name: 'Verification Tester',
    email: 'tester.verify@hrhub.io',
    department: 'Engineering',
    role: 'Quality Automation Lead',
    metrics: {
      attendanceRate: 95,
      taskCompletionRate: 80,
      productivityScore: 85,
      projectContribution: 80,
      workEfficiency: 85
    }
  };

  const createRes = await fetch(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testEmpData)
  });

  const createData = await createRes.json();
  if (!createData.success) throw new Error(`Create failed: ${createData.message}`);
  const empId = createData.employee._id;
  console.log(`  ✅ Employee created: ${testEmpData.name} (_id: ${empId})`);

  // 2. Add Task 1 (Completed)
  const task1Res = await fetch(`${BASE_URL}/api/performance/${empId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Task 1 - Unit Test', status: 'Completed', priority: 'High' })
  });
  const task1Data = await task1Res.json();
  if (!task1Data.success) throw new Error('Failed to add Task 1');

  // 3. Add Task 2 (In Progress)
  const task2Res = await fetch(`${BASE_URL}/api/performance/${empId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Task 2 - Load Test', status: 'In Progress', priority: 'Medium' })
  });
  const task2Data = await task2Res.json();
  if (!task2Data.success) throw new Error('Failed to add Task 2');

  // Task completion rate should now be 1/2 = 50%
  const updatedEmp = await (await fetch(`${BASE_URL}/api/employees/${empId}`)).json();
  if (updatedEmp.employee.metrics.taskCompletionRate !== 50) {
    throw new Error(`Expected task completion rate 50%, got ${updatedEmp.employee.metrics.taskCompletionRate}%`);
  }
  console.log(`  ✅ Task completion dynamically calculated: ${updatedEmp.employee.metrics.taskCompletionRate}% (1 of 2 completed)`);

  // 4. Clean up: Delete test employee
  const delRes = await fetch(`${BASE_URL}/api/employees/${empId}`, { method: 'DELETE' });
  const delData = await delRes.json();
  if (!delData.success) throw new Error('Failed to delete test employee');
  console.log(`  ✅ Test employee purged cleanly: ${delData.employeeId}`);

  console.log('\n🎉 Verification Check 2: PASSED!\n');
}

testDatabaseAndTasks().catch(err => {
  console.error('❌ Check 2 FAILED:', err);
  process.exit(1);
});
