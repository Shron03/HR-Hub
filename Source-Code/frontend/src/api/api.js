const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const TOKEN_KEY = 'hrhub_token';

export const getToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
};

/**
 * Universal authenticated fetch helper that attaches Bearer token and handles 401s
 */
const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    setToken(null);
    try {
      sessionStorage.removeItem('hrhub_user');
      localStorage.removeItem('hrhub_user');
    } catch {}
    window.dispatchEvent(new CustomEvent('hrhub_unauthorized'));
  }

  return response.json();
};

export const api = {
  // Authentication & Session
  async demoLogin(role = 'HR Director') {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (data.success && data.token) {
      setToken(data.token);
    }
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.token) {
      setToken(data.token);
    }
    return data;
  },

  logout() {
    setToken(null);
    try {
      sessionStorage.removeItem('hrhub_user');
      localStorage.removeItem('hrhub_user');
    } catch {}
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async getMe() {
    return authFetch('/auth/me');
  },

  async getPendingRegistrations() {
    return authFetch('/auth/registrations/pending');
  },

  async approveRegistration(id) {
    return authFetch(`/auth/registrations/${id}/approve`, {
      method: 'PUT'
    });
  },

  async rejectRegistration(id) {
    return authFetch(`/auth/registrations/${id}/reject`, {
      method: 'PUT'
    });
  },

  // Employees Directory & Records
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/employees?${query}`);
  },

  async getEmployeeById(id) {
    return authFetch(`/employees/${id}`);
  },

  async createEmployee(employeeData) {
    return authFetch('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData)
    });
  },

  async updateEmployee(id, employeeData) {
    return authFetch(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData)
    });
  },

  async deleteEmployee(id) {
    return authFetch(`/employees/${id}`, {
      method: 'DELETE'
    });
  },

  // Real-Time Performance & KPI Simulator
  async updateMetrics(id, metrics) {
    return authFetch(`/performance/${id}/metrics`, {
      method: 'PUT',
      body: JSON.stringify(metrics)
    });
  },

  async addTask(id, taskData) {
    return authFetch(`/performance/${id}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  async updateTaskStatus(employeeId, taskId, statusData) {
    return authFetch(`/performance/${employeeId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    });
  },

  // Analytics
  async getDashboardAnalytics() {
    return authFetch('/analytics/dashboard');
  },

  // Insights
  async getInsights() {
    return authFetch('/insights');
  },

  // Monthly Reports
  async getMonthlyReport(month = 'Dec') {
    return authFetch(`/reports/monthly?month=${month}`);
  },

  // Leave Management & Requests
  async getLeaves() {
    return authFetch('/leaves');
  },

  async submitLeave(leaveData) {
    return authFetch('/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData)
    });
  },

  async updateLeaveStatus(leaveId, status, decisionNote = '') {
    return authFetch(`/leaves/${leaveId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, decisionNote })
    });
  },

  // Multi-Message Notification Hub
  async getNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/leaves/notifications?${query}`);
  },

  async markNotificationRead(id) {
    return authFetch(`/leaves/notifications/${id}/read`, {
      method: 'POST'
    });
  },

  async markAllNotificationsRead() {
    return authFetch('/leaves/notifications/read-all', {
      method: 'POST'
    });
  },

  // Feedback & Appraisals
  async sendFeedback(feedbackData) {
    return authFetch('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    });
  },

  async getEmployeeFeedbacks(employeeId) {
    return authFetch(`/feedback/${employeeId}`);
  },

  // Help Desk & Support Tickets
  async getTickets(params = {}) {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/tickets?${query}`);
  },

  async createTicket(ticketData) {
    return authFetch('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  },

  async updateTicketStatus(id, status, resolutionNote, callerName) {
    return authFetch(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNote, callerName })
    });
  },

  async addTicketReply(id, replyData) {
    return authFetch(`/tickets/${id}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData)
    });
  },

  // Onboarding & Offboarding Lifecycle
  async getOnboardingCases(params = {}) {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/onboarding?${query}`);
  },

  async createOnboardingCase(caseData) {
    return authFetch('/onboarding', {
      method: 'POST',
      body: JSON.stringify(caseData)
    });
  },

  async toggleChecklistTask(caseId, taskId) {
    return authFetch(`/onboarding/${caseId}/tasks/${taskId}/toggle`, {
      method: 'PATCH'
    });
  },

  async updateCaseStatus(caseId, status, notes) {
    return authFetch(`/onboarding/${caseId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },

  // Corporate Documents Management
  async getDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/documents?${query}`);
  },

  async createDocument(docData) {
    return authFetch('/documents', {
      method: 'POST',
      body: JSON.stringify(docData)
    });
  },

  async deleteDocument(id) {
    return authFetch(`/documents/${id}`, {
      method: 'DELETE'
    });
  },

  async recordDocumentDownload(id) {
    return authFetch(`/documents/${id}/download`, {
      method: 'POST'
    });
  },

  // Time Logs & Projects
  async getTimeLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/timelogs?${query}`);
  },

  async createTimeLog(logData) {
    return authFetch('/timelogs', {
      method: 'POST',
      body: JSON.stringify(logData)
    });
  },

  async updateTimeLogStatus(id, status) {
    return authFetch(`/timelogs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Demo Data Lifecycle
  async seedDemoData() {
    return authFetch('/employees/seed-demo', {
      method: 'POST'
    });
  },

  async clearAllEmployees() {
    return authFetch('/employees/clear-all', {
      method: 'POST'
    });
  }
};
