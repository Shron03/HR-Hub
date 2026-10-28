import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_PORT = process.env.TEST_PORT || 5005;
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

  // Wait for server to become healthy
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

async function runTests() {
  console.log('\n======================================================');
  console.log('  HR Hub Demo Workspace Isolation & Product Security');
  console.log(`  Target: ${BASE_URL}`);
  console.log('======================================================\n');

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

    let visitorAToken = '';
    let visitorAWorkspaceId = '';
    let visitorBToken = '';
    let visitorBWorkspaceId = '';

    // Test 1: Start Demo Session for Visitor A
    await test('Visitor A enters demo immediately without registration', async () => {
      const res = await fetch(`${BASE_URL}/api/demo/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'HR Director' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.token || !data.workspaceId) {
        throw new Error('Missing token or workspaceId in demo session response');
      }
      if (data.user.role !== 'HR Director' || !data.user.isDemo) {
        throw new Error('User profile did not reflect demo HR Director');
      }
      visitorAToken = data.token;
      visitorAWorkspaceId = data.workspaceId;
    });

    // Test 2: Visitor A reads employees from isolated workspace
    await test('Visitor A accesses baseline synthetic employees in isolated workspace', async () => {
      const res = await fetch(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${visitorAToken}` }
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.employees)) {
        throw new Error('Failed to retrieve employees');
      }
      if (data.totalCount !== 15) {
        throw new Error(`Expected 15 baseline employees, found ${data.totalCount}`);
      }
    });

    // Test 3: Safe Demo Role Switching for Visitor A
    await test('Visitor A switches demo role to Engineering Manager without registration', async () => {
      const res = await fetch(`${BASE_URL}/api/demo/switch-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${visitorAToken}`
        },
        body: JSON.stringify({ role: 'Engineering Manager' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.user.role !== 'Engineering Manager') {
        throw new Error('Failed to switch to Engineering Manager');
      }
      if (data.workspaceId !== visitorAWorkspaceId) {
        throw new Error('Workspace ID unexpectedly changed on role switch');
      }
      // Update Visitor A's token
      visitorAToken = data.token;
    });

    await test('Visitor A switches demo role to Employee without registration', async () => {
      const res = await fetch(`${BASE_URL}/api/demo/switch-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${visitorAToken}`
        },
        body: JSON.stringify({ role: 'Employee' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.user.role !== 'Employee') {
        throw new Error('Failed to switch to Employee');
      }
      if (data.workspaceId !== visitorAWorkspaceId) {
        throw new Error('Workspace ID unexpectedly changed on role switch');
      }
      visitorAToken = data.token;
    });

    await test('Switch demo role rejects invalid roles (400 Bad Request)', async () => {
      const res = await fetch(`${BASE_URL}/api/demo/switch-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${visitorAToken}`
        },
        body: JSON.stringify({ role: 'RootAdministrator' })
      });
      if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    });

    // Switch Visitor A back to HR Director for subsequent tests
    const switchBackRes = await fetch(`${BASE_URL}/api/demo/switch-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${visitorAToken}`
      },
      body: JSON.stringify({ role: 'HR Director' })
    });
    const switchBackData = await switchBackRes.json();
    visitorAToken = switchBackData.token;

    // Test 4: Start Demo Session for Visitor B
    await test('Visitor B enters demo and receives a distinct isolated workspace', async () => {
      const res = await fetch(`${BASE_URL}/api/demo/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'HR Director' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      visitorBToken = data.token;
      visitorBWorkspaceId = data.workspaceId;

      if (visitorBWorkspaceId === visitorAWorkspaceId) {
        throw new Error('Visitor B received same workspace ID as Visitor A! Isolation failure.');
      }
    });

    // Test 5: Visitor A creates a new synthetic employee in their workspace
    let customEmpAId = '';
    await test('Visitor A creates a synthetic employee in Workspace A', async () => {
      const newEmp = {
        name: 'Custom Test Employee A',
        email: 'test.employee.a@hrhub.test',
        department: 'Engineering',
        role: 'Lead Architect',
        salary: 1200000
      };
      const res = await fetch(`${BASE_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${visitorAToken}`
        },
        body: JSON.stringify(newEmp)
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.employee) throw new Error('Failed to create employee in Workspace A');
      customEmpAId = data.employee.employeeId;
    });

    // Test 6: Verify Visitor A sees 16 employees, but Visitor B still sees 15 employees
    await test('Cross-session workspace isolation: Visitor B does NOT see Visitor A edits', async () => {
      // Check Visitor A
      const resA = await fetch(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${visitorAToken}` }
      });
      const dataA = await resA.json();
      if (dataA.totalCount !== 16) {
        throw new Error(`Expected 16 employees for Visitor A, got ${dataA.totalCount}`);
      }

      // Check Visitor B
      const resB = await fetch(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${visitorBToken}` }
      });
      const dataB = await resB.json();
      if (dataB.totalCount !== 15) {
        throw new Error(`Visitor B was corrupted by Visitor A edits! Expected 15, got ${dataB.totalCount}`);
      }
      const leaked = dataB.employees.find(e => e.employeeId === customEmpAId);
      if (leaked) {
        throw new Error('Custom employee from Workspace A leaked into Workspace B!');
      }
    });

    // Test 7: Resetting Workspace A does not affect Workspace B
    await test('Workspace reset isolation: Resetting Workspace A leaves Workspace B intact', async () => {
      // Create a unique employee in Workspace B first
      const empB = {
        name: 'Custom Test Employee B',
        email: 'test.employee.b@hrhub.test',
        department: 'Marketing',
        role: 'Marketing Lead',
        salary: 950000
      };
      const resCreateB = await fetch(`${BASE_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${visitorBToken}`
        },
        body: JSON.stringify(empB)
      });
      const dataCreateB = await resCreateB.json();
      if (!dataCreateB.success) throw new Error('Failed to create employee in Workspace B');

      // Now reset Workspace A
      const resResetA = await fetch(`${BASE_URL}/api/demo/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${visitorAToken}`
        }
      });
      if (!resResetA.ok) throw new Error(`Status ${resResetA.status}`);
      const dataResetA = await resResetA.json();
      visitorAToken = dataResetA.token;

      // Verify Workspace A is back to 15 employees
      const checkA = await fetch(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${visitorAToken}` }
      });
      const dataCheckA = await checkA.json();
      if (dataCheckA.totalCount !== 15) {
        throw new Error(`Expected Workspace A to reset to 15, got ${dataCheckA.totalCount}`);
      }

      // Verify Workspace B still has its custom employee and 16 total employees
      const checkB = await fetch(`${BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${visitorBToken}` }
      });
      const dataCheckB = await checkB.json();
      if (dataCheckB.totalCount !== 16) {
        throw new Error(`Workspace B was corrupted by Workspace A reset! Expected 16, got ${dataCheckB.totalCount}`);
      }
    });

    // Test 8: Demo tokens cannot access registered administrative governance
    await test('Demo tokens blocked from registered account approvals (403 Forbidden)', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/registrations/pending`, {
        headers: { Authorization: `Bearer ${visitorAToken}` }
      });
      if (res.status !== 403) {
        throw new Error(`Expected 403 Forbidden for demo token on registrations/pending, got ${res.status}`);
      }
      const data = await res.json();
      if (data.success !== false) throw new Error('Expected success: false');
    });

    // Test 9: Server-side document access policies
    await test('Server-side document access policies: Employees cannot view Management Only documents', async () => {
      // Switch Visitor A to Employee
      const switchRes = await fetch(`${BASE_URL}/api/demo/switch-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${visitorAToken}`
        },
        body: JSON.stringify({ role: 'Employee' })
      });
      const switchData = await switchRes.json();
      const empToken = switchData.token;

      // As Employee, fetch documents
      const docsRes = await fetch(`${BASE_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${empToken}` }
      });
      if (!docsRes.ok) throw new Error(`Status ${docsRes.status}`);
      const docsData = await docsRes.json();
      const mgmtDocs = docsData.documents.filter(d => d.accessLevel === 'Management Only' || d.accessLevel === 'Confidential');
      if (mgmtDocs.length > 0) {
        throw new Error(`Management Only documents leaked to Employee role! Found ${mgmtDocs.length}`);
      }

      // As HR Director, verify all documents are visible
      const hrDocsRes = await fetch(`${BASE_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${visitorBToken}` }
      });
      const hrDocsData = await hrDocsRes.json();
      const hasMgmtDocs = hrDocsData.documents.some(d => d.accessLevel === 'Management Only');
      if (!hasMgmtDocs) {
        throw new Error('HR Director should be able to view Management Only documents');
      }
    });

    // Test 10: Backward Compatibility: /api/auth/demo-login returns isolated workspace session
    await test('Backward compatibility: /api/auth/demo-login returns scoped demo token', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'HR Director' })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.token || !data.workspaceId) {
        throw new Error('Missing token or workspaceId on /api/auth/demo-login');
      }
      if (!data.workspaceId.startsWith('demo-')) {
        throw new Error(`Expected demo-* workspace ID, got ${data.workspaceId}`);
      }
    });

  } finally {
    stopServer();
  }

  console.log('\n------------------------------------------------------');
  console.log(`  Tests Passed: ${passed} | Tests Failed: ${failed}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('[FATAL TEST ERROR]', err);
  stopServer();
  process.exit(1);
});
