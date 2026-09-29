const API_BASE = '/api';

export const api = {
  // Auth
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

  // Employees (Module 1)
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

  // Performance (Module 2)
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

  // Analytics (Module 3)
  async getDashboardAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    return res.json();
  },

  // Insights (Module 4)
  async getInsights() {
    const res = await fetch(`${API_BASE}/insights`);
    return res.json();
  },

  // Reports (Module 5)
  async getMonthlyReport(month = 'Dec') {
    const res = await fetch(`${API_BASE}/reports/monthly?month=${month}`);
    return res.json();
  },

  // Reset / Re-seed Demo Data
  async resetDemoData() {
    const res = await fetch(`${API_BASE}/reports/seed/reset`, {
      method: 'POST'
    });
    return res.json();
  }
};
