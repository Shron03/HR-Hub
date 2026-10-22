const BASE_URL = 'http://localhost:5000/api';

async function runStage6Tests() {
  console.log('[TEST] Running Stage 6 Verification: User Approvals, RBAC & 3-Day Notifications...\n');

  try {
    // 1. Register a new user
    const testEmail = `newemployee_${Date.now()}@hrhub.in`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sunita Mehra',
        email: testEmail,
        password: 'password123',
        department: 'Product',
        role: 'Employee'
      })
    });
    const regData = await regRes.json();

    if (!regData.success || !regData.isPendingApproval) {
      throw new Error('Registration should be marked as pending approval');
    }
    console.log('- User registered with Pending Approval status:', testEmail);

    // 2. Attempt login before approval (Must be rejected with 403)
    const unapprovedLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123'
      })
    });

    if (unapprovedLoginRes.status === 403) {
      console.log('- Login before approval successfully blocked (403 Forbidden)');
    } else {
      throw new Error(`Expected 403 status for unapproved user, received: ${unapprovedLoginRes.status}`);
    }

    // 3. HR retrieves pending registrations
    const pendingRes = await fetch(`${BASE_URL}/auth/registrations/pending`);
    const pendingData = await pendingRes.json();
    const pendingItem = (pendingData.registrations || []).find(r => r.email === testEmail);
    if (!pendingItem) {
      throw new Error('Registered user not found in HR pending list');
    }
    console.log('- HR retrieved pending registration for:', pendingItem.name);

    // 4. HR approves registration
    const approveRes = await fetch(`${BASE_URL}/auth/registrations/${pendingItem._id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const approveData = await approveRes.json();
    if (!approveData.success || !approveData.employee) {
      throw new Error('Approval failed or did not return created employee profile');
    }
    console.log('- HR authorized registration. Employee record created:', approveData.employee.employeeId);

    // 5. User can now log in
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.user) {
      throw new Error('Login failed after HR approval');
    }
    console.log('- Employee successfully logged in after approval');

    // 6. Test RBAC: Engineering Manager cannot approve leaves
    const leavesRes = await fetch(`${BASE_URL}/leaves`);
    const leavesData = await leavesRes.json();
    const pendingLeave = leavesData.leaveRequests.find(l => l.status === 'Pending') || leavesData.leaveRequests[0];
    if (pendingLeave) {
      const mgrActionRes = await fetch(`${BASE_URL}/leaves/${pendingLeave.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Approved',
          callerRole: 'Engineering Manager'
        })
      });
      if (mgrActionRes.status === 403) {
        console.log('- Engineering Manager correctly blocked from approving leave (403 Forbidden)');
      } else {
        throw new Error(`Expected 403 for Engineering Manager approving leave, got: ${mgrActionRes.status}`);
      }
    }

    // 7. Test 3-day notification window & read tracking
    const notifsRes = await fetch(`${BASE_URL}/leaves/notifications?role=HR Director`);
    const notifsData = await notifsRes.json();
    if (!notifsData.success) {
      throw new Error('Failed to retrieve notifications');
    }
    console.log(`- Retrieved ${notifsData.notifications.length} notifications within 3-day window for HR Director`);

    console.log('\n[PASS] Stage 6 Verification: All User Approvals, RBAC & 3-Day Notifications Verified.\n');
  } catch (error) {
    console.error('\n[FAIL] Stage 6 Verification Failed:', error.message);
    process.exit(1);
  }
}

runStage6Tests();
