const API_BASE = '/api';

export const api = {
  // Authentication
  async demoLogin(role = 'HR Director') {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async getPendingRegistrations() {
    const res = await fetch(`${API_BASE}/auth/registrations/pending`);
    return res.json();
  },

  async approveRegistration(id) {
    const res = await fetch(`${API_BASE}/auth/registrations/${id}/approve`, {
      method: 'PUT'
    });
    return res.json();
  },

  async rejectRegistration(id) {
    const res = await fetch(`${API_BASE}/auth/registrations/${id}/reject`, {
      method: 'PUT'
    });
    return res.json();
  },

  // Employees Directory & Records
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/employees?${query}`);
    return res.json();
  },

  async getEmployeeById(id) {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    return res.json();
  },

  async createEmployee(employeeData) {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    return res.json();
  },

  async updateEmployee(id, employeeData) {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    return res.json();
  },

  async deleteEmployee(id) {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Real-Time Performance & KPI Simulator
  async updateMetrics(id, metrics) {
    const res = await fetch(`${API_BASE}/performance/${id}/metrics`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    });
    return res.json();
  },

  async addTask(id, taskData) {
    const res = await fetch(`${API_BASE}/performance/${id}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return res.json();
  },

  async updateTaskStatus(employeeId, taskId, statusData) {
    const res = await fetch(`${API_BASE}/performance/${employeeId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    return res.json();
  },

  // Analytics
  async getDashboardAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    return res.json();
  },

  // Insights
  async getInsights() {
    const res = await fetch(`${API_BASE}/insights`);
    return res.json();
  },

  // Monthly Reports
  async getMonthlyReport(month = 'Dec') {
    const res = await fetch(`${API_BASE}/reports/monthly?month=${month}`);
    return res.json();
  },

  // Leave Management & Requests
  async getLeaves() {
    const res = await fetch(`${API_BASE}/leaves`);
    return res.json();
  },

  async submitLeave(leaveData) {
    const res = await fetch(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData)
    });
    return res.json();
  },

  async updateLeaveStatus(leaveId, status, decisionNote = '', callerRole = 'HR Director') {
    const res = await fetch(`${API_BASE}/leaves/${leaveId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, decisionNote, callerRole })
    });
    return res.json();
  },

  // Multi-Message Notification Hub with 3-Day Scope & Role Separation
  async getNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/leaves/notifications?${query}`);
    return res.json();
  },

  async markNotificationRead(id, userIdentifier) {
    const res = await fetch(`${API_BASE}/leaves/notifications/${id}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIdentifier })
    });
    return res.json();
  },

  async markAllNotificationsRead(userIdentifier, role, employeeId) {
    const res = await fetch(`${API_BASE}/leaves/notifications/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIdentifier, role, employeeId })
    });
    return res.json();
  },

  // Feedback & Appraisals
  async sendFeedback(feedbackData) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    return res.json();
  },

  async getEmployeeFeedbacks(employeeId) {
    const res = await fetch(`${API_BASE}/feedback/${employeeId}`);
    return res.json();
  },

  // Help Desk & Support Tickets
  async getTickets(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tickets?${query}`);
    return res.json();
  },

  async createTicket(ticketData) {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    return res.json();
  },

  async updateTicketStatus(id, status, resolutionNote, callerName) {
    const res = await fetch(`${API_BASE}/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolutionNote, callerName })
    });
    return res.json();
  },

  async addTicketReply(id, replyData) {
    const res = await fetch(`${API_BASE}/tickets/${id}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData)
    });
    return res.json();
  },

  // Onboarding & Offboarding Lifecycle
  async getOnboardingCases(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/onboarding?${query}`);
    return res.json();
  },

  async createOnboardingCase(caseData) {
    const res = await fetch(`${API_BASE}/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData)
    });
    return res.json();
  },

  async toggleChecklistTask(caseId, taskId) {
    const res = await fetch(`${API_BASE}/onboarding/${caseId}/tasks/${taskId}/toggle`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async updateCaseStatus(caseId, status, notes) {
    const res = await fetch(`${API_BASE}/onboarding/${caseId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    return res.json();
  },

  // Corporate Documents Management
  async getDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/documents?${query}`);
    return res.json();
  },

  async createDocument(docData) {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData)
    });
    return res.json();
  },

  async deleteDocument(id) {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async recordDocumentDownload(id) {
    const res = await fetch(`${API_BASE}/documents/${id}/download`, {
      method: 'POST'
    });
    return res.json();
  },

  // Time Logs & Projects
  async getTimeLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/timelogs?${query}`);
    return res.json();
  },

  async createTimeLog(logData) {
    const res = await fetch(`${API_BASE}/timelogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    return res.json();
  },

  async updateTimeLogStatus(id, status) {
    const res = await fetch(`${API_BASE}/timelogs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Demo Data Lifecycle (Zero-data state & 15-person Demo)
  async seedDemoData() {
    const res = await fetch(`${API_BASE}/employees/seed-demo`, {
      method: 'POST'
    });
    return res.json();
  },

  async clearAllEmployees() {
    const res = await fetch(`${API_BASE}/employees/clear-all`, {
      method: 'POST'
    });
    return res.json();
  }
};
