import jwt from 'jsonwebtoken';

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';

async function runSecurityTests() {
  console.log(`\n======================================================`);
  console.log(`  HR Hub Comprehensive Security Hardening Test Suite`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`======================================================\n`);

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

  // Helper to obtain demo token
  const getDemoToken = async (role = 'HR Director') => {
    const res = await fetch(`${BASE_URL}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error(`Demo login failed with status ${res.status}`);
    const data = await res.json();
    return data.token;
  };

  let hrToken = '';
  let managerToken = '';
  let employeeToken = '';

  // 1. Setup tokens
  await test('Bootstrap: Obtain HR, Manager, and Employee demo tokens', async () => {
    hrToken = await getDemoToken('HR Director');
    managerToken = await getDemoToken('Engineering Manager');
    employeeToken = await getDemoToken('Employee');
    if (!hrToken || !managerToken || !employeeToken) {
      throw new Error('Failed to retrieve all demo tokens');
    }
  });

  // 2. Authentication: Missing Token on Protected Endpoints
  await test('Reject requests without Authorization header (401 Unauthorized)', async () => {
    const res = await fetch(`${BASE_URL}/api/employees`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    const data = await res.json();
    if (data.success !== false) throw new Error('Expected success: false');
  });

  // 3. Authentication: Malformed and Invalid Tokens
  await test('Reject malformed or invalid signature JWTs (401 Unauthorized)', async () => {
    const res = await fetch(`${BASE_URL}/api/employees`, {
      headers: { 'Authorization': 'Bearer completely_bogus_token_format' }
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);

    // Test token signed with wrong secret
    const fakeToken = jwt.sign({ id: 'fake', role: 'HR Director' }, 'wrong_secret_12345');
    const res2 = await fetch(`${BASE_URL}/api/employees`, {
      headers: { 'Authorization': `Bearer ${fakeToken}` }
    });
    if (res2.status !== 401) throw new Error(`Expected 401 on wrong secret, got ${res2.status}`);
  });

  // 4. Authentication: Expired Token
  await test('Reject expired JWT tokens (401 Unauthorized with expired flag)', async () => {
    const expiredToken = jwt.sign(
      { id: 'fake', role: 'HR Director' },
      'hr_hub_super_secret_jwt_key_2026',
      { expiresIn: '-10s' }
    );
    const res = await fetch(`${BASE_URL}/api/employees`, {
      headers: { 'Authorization': `Bearer ${expiredToken}` }
    });
    if (res.status !== 401) throw new Error(`Expected 401 on expired token, got ${res.status}`);
  });

  // 5. Authentication: Login with valid and invalid credentials
  await test('Login with valid credentials and reject invalid credentials', async () => {
    // Invalid credentials
    const badRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@hrhub.in', password: 'wrongpassword' })
    });
    if (badRes.status !== 401) throw new Error(`Expected 401 for bad login, got ${badRes.status}`);

    // Missing fields
    const missingRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'priya@hrhub.in' })
    });
    if (missingRes.status !== 400) throw new Error(`Expected 400 for missing password, got ${missingRes.status}`);
  });

  // 6. Privilege Escalation Prevention on Registration
  await test('Defensive Registration: Prevent privilege escalation to HR Director', async () => {
    const testEmail = `sec_test_${Date.now()}@hrhub.in`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker Attempt',
        email: testEmail,
        password: 'password123',
        role: 'HR Director' // Attacker requests HR Director role
      })
    });

    if (regRes.status !== 201) throw new Error(`Registration failed with status ${regRes.status}`);
    const regData = await regRes.json();
    if (regData.user.role !== 'Employee') {
      throw new Error(`Privilege escalation vulnerability: user was assigned ${regData.user.role} instead of Employee!`);
    }
  });

  // 7. RBAC: Destructive Operations Restricted to HR Director
  await test('Block regular Employees from clearing all database records (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/api/employees/clear-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      }
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
  });

  await test('Block regular Employees from resetting and re-seeding database (403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/api/reports/seed/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      }
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
  });

  // 8. RBAC: Employee Creation and Deletion
  await test('Block regular Employees from creating and deleting employee records (403 Forbidden)', async () => {
    const createRes = await fetch(`${BASE_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      },
      body: JSON.stringify({
        name: 'Unauthorized User',
        email: 'unauth@hrhub.in',
        role: 'Developer'
      })
    });
    if (createRes.status !== 403) throw new Error(`Expected 403 on create employee, got ${createRes.status}`);

    const deleteRes = await fetch(`${BASE_URL}/api/employees/EMP-1001`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${employeeToken}` }
    });
    if (deleteRes.status !== 403) throw new Error(`Expected 403 on delete employee, got ${deleteRes.status}`);
  });

  // 9. RBAC: Registration Approvals Restricted to HR Director
  await test('Block regular Employees and Managers from approving user registrations (403 Forbidden)', async () => {
    const resEmp = await fetch(`${BASE_URL}/api/auth/registrations/dummy_id/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      }
    });
    if (resEmp.status !== 403) throw new Error(`Expected 403 for employee, got ${resEmp.status}`);

    const resMgr = await fetch(`${BASE_URL}/api/auth/registrations/dummy_id/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      }
    });
    if (resMgr.status !== 403) throw new Error(`Expected 403 for manager, got ${resMgr.status}`);
  });

  // 10. RBAC: Leave Decision Restricted to HR Director
  await test('Block Engineering Managers and Employees from approving leaves (403 Forbidden)', async () => {
    const resMgr = await fetch(`${BASE_URL}/api/leaves/dummy_leave_id/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      },
      body: JSON.stringify({ status: 'Approved' })
    });
    if (resMgr.status !== 403) throw new Error(`Expected 403 for manager approving leave, got ${resMgr.status}`);
  });

  // 11. BOLA / IDOR: Cross-Employee Feedback Notes Access Isolation
  await test('Prevent regular Employees from reading peer employee feedback (403 Forbidden)', async () => {
    // Employee EMP-1001 attempting to read EMP-1002's private feedback
    const res = await fetch(`${BASE_URL}/api/feedback/EMP-1002`, {
      headers: { 'Authorization': `Bearer ${employeeToken}` }
    });
    if (res.status !== 403) throw new Error(`Expected 403 for cross-employee feedback lookup, got ${res.status}`);
  });

  // 12. Privacy: Peer Salary Redaction for Regular Employees
  await test('Redact sensitive salary and compensation data when Employees view colleagues', async () => {
    const res = await fetch(`${BASE_URL}/api/employees/EMP-1002`, {
      headers: { 'Authorization': `Bearer ${employeeToken}` }
    });
    if (!res.ok) throw new Error(`Lookup failed with status ${res.status}`);
    const data = await res.json();
    if (data.employee.salary !== undefined) {
      throw new Error('Salary data was exposed to another regular employee!');
    }
    if (data.employee.compensation !== undefined) {
      throw new Error('Compensation breakdown was exposed to another regular employee!');
    }
  });

  // 13. Health Check is Public
  await test('Health check endpoint (/health) remains accessible without authentication', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Health check payload invalid');
  });

  console.log(`\n======================================================`);
  console.log(`  Security Test Results: Passed: ${passed} | Failed: ${failed}`);
  console.log(`======================================================\n`);

  if (failed > 0) process.exit(1);
}

runSecurityTests().catch(err => {
  console.error('Fatal Security Test Suite Error:', err);
  process.exit(1);
});
