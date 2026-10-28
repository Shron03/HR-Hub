import jwt from 'jsonwebtoken';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_PORT = process.env.TEST_PORT || 5006;
const BASE_URL = process.env.TEST_URL || `http://localhost:${TEST_PORT}`;

let serverProcess = null;

async function isServerRunning(url) {
  try {
    const res = await fetch(`${url}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function startServerIfNeeded() {
  const running = await isServerRunning(BASE_URL);
  if (running) {
    console.log(`[TEST SETUP] Using already running server at: ${BASE_URL}`);
    return;
  }

  console.log(`[TEST SETUP] Spawning test backend server on port ${TEST_PORT}...`);
  const serverPath = path.resolve(__dirname, '../server.js');

  serverProcess = spawn('node', [serverPath], {
    env: {
      ...process.env,
      PORT: TEST_PORT,
      ALLOW_IN_MEMORY_DB: 'true',
      NODE_ENV: 'test'
    },
    stdio: 'inherit'
  });

  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    const ok = await isServerRunning(BASE_URL);
    if (ok) {
      console.log(`[TEST SETUP] Server ready on ${BASE_URL}`);
      return;
    }
  }

  throw new Error('Test server failed to start within timeout window');
}

function stopServer() {
  if (serverProcess) {
    console.log('[TEST TEARDOWN] Stopping test backend server...');
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
}

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

  try {
    await startServerIfNeeded();

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
      const badTokens = [
        'Bearer invalid-token-string',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        'Bearer '
      ];

      for (const authHeader of badTokens) {
        const res = await fetch(`${BASE_URL}/api/employees`, {
          headers: { 'Authorization': authHeader }
        });
        if (res.status !== 401) throw new Error(`Expected 401 for token: ${authHeader}, got ${res.status}`);
      }
    });

    // 4. Authentication: Expired Tokens
    await test('Reject expired JWT tokens (401 Unauthorized with expired flag)', async () => {
      const expiredPayload = {
        id: 'expired_user_id',
        role: 'Employee',
        email: 'expired@hrhub.in',
        iat: Math.floor(Date.now() / 1000) - 7200,
        exp: Math.floor(Date.now() / 1000) - 3600
      };
      const dummySecret = 'temporary_test_secret_for_jwt_verification_signature';
      const expiredToken = jwt.sign(expiredPayload, dummySecret);

      const res = await fetch(`${BASE_URL}/api/employees`, {
        headers: { 'Authorization': `Bearer ${expiredToken}` }
      });
      if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    });

    // 5. Account Login & Credential Verification
    await test('Login with valid credentials and reject invalid credentials', async () => {
      const validRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'hr@hrhub.in', password: 'password123' })
      });
      if (!validRes.ok) throw new Error(`Valid login failed with status ${validRes.status}`);
      const validData = await validRes.json();
      if (!validData.success || !validData.token) throw new Error('Valid login did not return token');

      const invalidRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'hr@hrhub.in', password: 'wrongpassword' })
      });
      if (invalidRes.status !== 401) throw new Error(`Expected 401 for wrong password, got ${invalidRes.status}`);
    });

    // 6. Defensive Registration: Privilege Escalation Prevention
    await test('Defensive Registration: Prevent privilege escalation to HR Director', async () => {
      const maliciousRegistration = {
        name: 'Attacker Attempting Escalation',
        email: `escalation_test_${Date.now()}@hrhub.in`,
        password: 'attackPassword123',
        role: 'HR Director',
        department: 'Human Resources'
      };

      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousRegistration)
      });
      if (!res.ok) throw new Error(`Registration failed with status ${res.status}`);
      const data = await res.json();
      if (data.user.role !== 'Employee') {
        throw new Error(`Privilege escalation succeeded! Assigned role was ${data.user.role}`);
      }
      if (data.user.approvalStatus !== 'Pending') {
        throw new Error('Self-registered user was not set to Pending approval');
      }
    });

    // 7. RBAC: Destructive Operations
    await test('Block regular Employees from clearing all database records (403 Forbidden)', async () => {
      const res = await fetch(`${BASE_URL}/api/employees/clear-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${employeeToken}` }
      });
      if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
    });

    await test('Block regular Employees from resetting and re-seeding database (403 Forbidden)', async () => {
      const res = await fetch(`${BASE_URL}/api/reports/seed/reset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${employeeToken}` }
      });
      if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
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

    // 9. RBAC: Registration Approvals Restricted to Registered HR Director
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

    // 10. RBAC: Leave Approval Restricted to HR Director
    await test('Block Engineering Managers and Employees from approving leaves (403 Forbidden)', async () => {
      const resMgr = await fetch(`${BASE_URL}/api/leaves/dummy_leave_id/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${managerToken}`
        },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (resMgr.status !== 403) throw new Error(`Expected 403 for manager, got ${resMgr.status}`);

      const resEmp = await fetch(`${BASE_URL}/api/leaves/dummy_leave_id/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${employeeToken}`
        },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (resEmp.status !== 403) throw new Error(`Expected 403 for employee, got ${resEmp.status}`);
    });

    // 11. IDOR Prevention: Employees Cannot Read Other Employees' Feedback
    await test('Prevent regular Employees from reading peer employee feedback (403 Forbidden)', async () => {
      const res = await fetch(`${BASE_URL}/api/feedback/EMP-1002`, {
        headers: { 'Authorization': `Bearer ${employeeToken}` }
      });
      if (res.status !== 403) throw new Error(`Expected 403 on viewing peer feedback, got ${res.status}`);
    });

    // 12. Privacy Protection: Salary Redaction on Peer Employee View
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

  } finally {
    stopServer();
  }

  console.log(`\n======================================================`);
  console.log(`  Security Test Results: Passed: ${passed} | Failed: ${failed}`);
  console.log(`======================================================\n`);

  if (failed > 0) process.exit(1);
}

runSecurityTests().catch(err => {
  console.error('Fatal Security Test Suite Error:', err);
  stopServer();
  process.exit(1);
});
