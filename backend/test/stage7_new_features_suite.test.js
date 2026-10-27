const BASE_URL = process.env.TEST_URL ? `${process.env.TEST_URL}/api` : 'http://localhost:5000/api';

async function runStage7Tests() {
  console.log('[TEST] Running Stage 7 Comprehensive Verification for New Features...\n');

  try {
    // Obtain tokens
    const hrAuthRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'HR Director' })
    });
    const hrAuthData = await hrAuthRes.json();
    const hrToken = hrAuthData.token;
    const hrHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hrToken}`
    };

    const mgrAuthRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'Engineering Manager' })
    });
    const mgrAuthData = await mgrAuthRes.json();
    const mgrToken = mgrAuthData.token;
    const mgrHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mgrToken}`
    };

    const empAuthRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'Employee' })
    });
    const empAuthData = await empAuthRes.json();
    const empToken = empAuthData.token;
    const empHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${empToken}`
    };

    // ==========================================
    // 1. HELP DESK & SUPPORT TICKETS
    // ==========================================
    console.log('--- 1. Testing HR Help Desk & Requests ---');
    const ticketsGetRes = await fetch(`${BASE_URL}/tickets`, { headers: hrHeaders });
    const ticketsGetData = await ticketsGetRes.json();
    if (!ticketsGetData.success || !Array.isArray(ticketsGetData.tickets)) {
      throw new Error('Failed to retrieve tickets list');
    }
    console.log(`- Retrieved ${ticketsGetData.tickets.length} initial support tickets`);

    // Create a new support ticket
    const newTicketRes = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: empHeaders,
      body: JSON.stringify({
        employeeId: 'EMP-1001',
        employeeName: 'Aarav Patel',
        department: 'Engineering',
        category: 'Hardware & IT Assets',
        priority: 'High',
        subject: 'Mechanical Keyboard Requisition for SDE II',
        description: 'Key switch failure on current workstation keyboard affecting code delivery.'
      })
    });
    const newTicketData = await newTicketRes.json();
    if (!newTicketData.success || !newTicketData.ticket) {
      throw new Error('Failed to create new ticket');
    }
    const createdTicketId = newTicketData.ticket._id;
    console.log(`- Successfully created ticket: ${newTicketData.ticket.ticketId} (${newTicketData.ticket.subject})`);

    // HR updates status & posts resolution note
    const updateTicketRes = await fetch(`${BASE_URL}/tickets/${createdTicketId}/status`, {
      method: 'PATCH',
      headers: hrHeaders,
      body: JSON.stringify({
        status: 'Resolved',
        resolutionNote: 'Replacement keyboard issued from IT stock inventory.',
        callerName: 'Priya Sharma (HR Director)'
      })
    });
    const updateTicketData = await updateTicketRes.json();
    if (!updateTicketData.success || updateTicketData.ticket.status !== 'Resolved') {
      throw new Error('Failed to update ticket status to Resolved');
    }
    console.log(`- Ticket #${newTicketData.ticket.ticketId} marked as Resolved with official HR note`);

    // ==========================================
    // 2. ONBOARDING & OFFBOARDING PROCESS
    // ==========================================
    console.log('\n--- 2. Testing Onboarding & Offboarding Lifecycle ---');
    const casesGetRes = await fetch(`${BASE_URL}/onboarding`, { headers: hrHeaders });
    const casesGetData = await casesGetRes.json();
    if (!casesGetData.success || !Array.isArray(casesGetData.cases)) {
      throw new Error('Failed to retrieve onboarding cases');
    }
    console.log(`- Retrieved ${casesGetData.cases.length} active onboarding/offboarding cases`);

    // Create a new onboarding case
    const newCaseRes = await fetch(`${BASE_URL}/onboarding`, {
      method: 'POST',
      headers: hrHeaders,
      body: JSON.stringify({
        type: 'Onboarding',
        candidateName: 'Pooja Bhatt',
        role: 'Data Scientist',
        department: 'Engineering',
        managerName: 'Rajesh Verma',
        targetDate: '2026-11-15',
        notes: 'Pre-boarding screening complete.'
      })
    });
    const newCaseData = await newCaseRes.json();
    if (!newCaseData.success || !newCaseData.case) {
      throw new Error('Failed to create onboarding case');
    }
    const createdCase = newCaseData.case;
    console.log(`- Initiated case: ${createdCase.caseId} for ${createdCase.candidateName} (${createdCase.role})`);

    // Toggle a checklist task
    const firstTask = createdCase.checklist[2]; // Uncompleted task
    const toggleRes = await fetch(`${BASE_URL}/onboarding/${createdCase._id}/tasks/${firstTask._id}/toggle`, {
      method: 'PATCH',
      headers: hrHeaders
    });
    const toggleData = await toggleRes.json();
    if (!toggleData.success) {
      throw new Error('Failed to toggle checklist task');
    }
    console.log(`- Checklist task toggled. Progress recalculated to: ${toggleData.case.progressPercent}%`);

    // ==========================================
    // 3. FILES & DOCUMENT MANAGEMENT
    // ==========================================
    console.log('\n--- 3. Testing Files & Document Management ---');
    const docsGetRes = await fetch(`${BASE_URL}/documents`, { headers: hrHeaders });
    const docsGetData = await docsGetRes.json();
    if (!docsGetData.success || !Array.isArray(docsGetData.documents)) {
      throw new Error('Failed to retrieve corporate documents');
    }
    console.log(`- Retrieved ${docsGetData.documents.length} corporate documents in catalog`);

    // Upload a new document
    const newDocRes = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: hrHeaders,
      body: JSON.stringify({
        title: 'Information Security & Encryption Policy 2026',
        category: 'Legal & Compliance',
        fileName: 'Infosec_Compliance_Policy_v4.pdf',
        fileSize: '1.8 MB',
        fileType: 'PDF',
        accessLevel: 'All Employees',
        description: 'Mandatory password rotation, 2FA protocols, and workstation lock standards.'
      })
    });
    const newDocData = await newDocRes.json();
    if (!newDocData.success || !newDocData.document) {
      throw new Error('Failed to upload document');
    }
    console.log(`- Published document: ${newDocData.document.docId} ("${newDocData.document.title}")`);

    // Download simulation
    const downloadRes = await fetch(`${BASE_URL}/documents/${newDocData.document._id}/download`, {
      method: 'POST',
      headers: hrHeaders
    });
    const downloadData = await downloadRes.json();
    if (!downloadData.success || downloadData.downloadCount !== 1) {
      throw new Error('Failed to record document download');
    }
    console.log(`- Download simulated and recorded (Count: ${downloadData.downloadCount})`);

    // ==========================================
    // 4. TIME LOGS & PROJECTS
    // ==========================================
    console.log('\n--- 4. Testing Time Logs & Sprint Projects ---');
    const timeLogsGetRes = await fetch(`${BASE_URL}/timelogs`, { headers: hrHeaders });
    const timeLogsGetData = await timeLogsGetRes.json();
    if (!timeLogsGetData.success || !Array.isArray(timeLogsGetData.timeLogs)) {
      throw new Error('Failed to retrieve time logs');
    }
    console.log(`- Retrieved ${timeLogsGetData.timeLogs.length} logged timesheet entries`);

    // Log hours as employee
    const newTimeLogRes = await fetch(`${BASE_URL}/timelogs`, {
      method: 'POST',
      headers: empHeaders,
      body: JSON.stringify({
        employeeId: 'EMP-1001',
        employeeName: 'Aarav Patel',
        department: 'Engineering',
        project: 'Real-Time KPI Engine',
        taskName: 'Decimal Rating Precision Tests',
        hours: 6.5,
        date: '2026-10-22',
        notes: 'Added automated tests for 0.1 precision review ratings.'
      })
    });
    const newTimeLogData = await newTimeLogRes.json();
    if (!newTimeLogData.success || !newTimeLogData.timeLog) {
      throw new Error('Failed to log time');
    }
    console.log(`- Logged ${newTimeLogData.timeLog.hours} hrs for "${newTimeLogData.timeLog.taskName}" on ${newTimeLogData.timeLog.project}`);

    // Manager approves the log
    const approveLogRes = await fetch(`${BASE_URL}/timelogs/${newTimeLogData.timeLog._id}/status`, {
      method: 'PATCH',
      headers: mgrHeaders,
      body: JSON.stringify({ status: 'Approved' })
    });
    const approveLogData = await approveLogRes.json();
    if (!approveLogData.success || approveLogData.timeLog.status !== 'Approved') {
      throw new Error('Failed to approve timesheet entry');
    }
    console.log(`- Engineering Manager approved timesheet entry (Status: Approved)`);

    console.log('\n[PASS] Stage 7 Comprehensive Verification: All New Enterprise Features Verified.\n');
  } catch (error) {
    console.error('\n[FAIL] Stage 7 Verification Failed:', error.message);
    process.exit(1);
  }
}

runStage7Tests();
