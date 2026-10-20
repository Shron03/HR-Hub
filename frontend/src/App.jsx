import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import EmployeesView from './views/EmployeesView';
import PerformanceView from './views/PerformanceView';
import OrganizationView from './views/OrganizationView';
import LeaveManagementView from './views/LeaveManagementView';
import EmployeePortalView from './views/EmployeePortalView';
import InsightsView from './views/InsightsView';
import ReportsView from './views/ReportsView';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import AuthModal from './components/AuthModal';
import NotificationToast from './components/NotificationToast';
import Toast from './components/Toast';
import { api } from './api/api';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hrhub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  // Application Data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [insightsData, setInsightsData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOperatingData, setIsOperatingData] = useState(false);

  // Modals & Popups
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'info' });
    }, 4500);
  };

  // Load all application data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, employeesRes, insightsRes, reportRes, notifRes] = await Promise.all([
        api.getDashboardAnalytics().catch(() => ({ success: false })),
        api.getEmployees({ limit: 100 }).catch(() => ({ success: false })),
        api.getInsights().catch(() => ({ success: false })),
        api.getMonthlyReport('Dec').catch(() => ({ success: false })),
        api.getNotifications().catch(() => ({ success: false }))
      ]);

      if (analyticsRes?.success) setAnalyticsData(analyticsRes);
      if (employeesRes?.success) setEmployees(employeesRes.employees || []);
      if (insightsRes?.success) setInsightsData(insightsRes);
      if (reportRes?.success) setReportData(reportRes);
      if (notifRes?.success && notifRes.notifications) {
        setNotifications(notifRes.notifications);
        // Show 5-second notification pop-up for HR upon loading or home visit
        if (currentUser?.role === 'HR Director' && notifRes.notifications.length > 0) {
          setShowNotificationPopup(true);
        }
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
      showToast('Connecting to HR Hub API...', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser]);

  // Handle Login Success
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('hrhub_user', JSON.stringify(user));
    if (user.role === 'Employee') {
      setActiveTab('portal');
    } else {
      setActiveTab('dashboard');
    }
    showToast(`Welcome back, ${user.name} (${user.role})`, 'success');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hrhub_user');
    showToast('Signed out successfully', 'info');
  };

  // Handle Role Switch
  const handleSwitchRole = async (newRole) => {
    try {
      const res = await api.demoLogin(newRole);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('hrhub_user', JSON.stringify(res.user));
        if (newRole === 'Employee') {
          setActiveTab('portal');
        } else {
          setActiveTab('dashboard');
        }
        showToast(`Switched active view to ${newRole}`, 'success');
        // Check for notifications
        if (newRole === 'HR Director') {
          const notifs = await api.getNotifications();
          if (notifs.success && notifs.notifications?.length > 0) {
            setNotifications(notifs.notifications);
            setShowNotificationPopup(true);
          }
        }
      }
    } catch (err) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
      showToast(`Switched active role: ${newRole}`, 'info');
    }
  };

  // Handle Demo Seeding (15 Indian Employees)
  const handleSeedDemoData = async () => {
    try {
      setIsOperatingData(true);
      const res = await api.seedDemoData();
      if (res.success) {
        await loadAllData();
        showToast('Generated 15 Indian employee records with KPI profiles', 'success');
      }
    } catch (err) {
      showToast('Error seeding demo data: ' + err.message, 'error');
    } finally {
      setIsOperatingData(false);
    }
  };

  // Handle Clear All Data (Zero-data state)
  const handleClearAllData = async () => {
    if (!window.confirm('Are you sure you want to clear all employee records? System will enter empty state.')) return;
    try {
      setIsOperatingData(true);
      const res = await api.clearAllEmployees();
      if (res.success) {
        await loadAllData();
        showToast('All employee records cleared. System in clean state.', 'info');
      }
    } catch (err) {
      showToast('Error clearing data: ' + err.message, 'error');
    } finally {
      setIsOperatingData(false);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEmployeeToEdit(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (emp) => {
    setEmployeeToEdit(emp);
    setIsDetailModalOpen(false);
    setIsAddModalOpen(true);
  };

  // View Employee Details
  const handleSelectEmployee = async (employeeId) => {
    try {
      const res = await api.getEmployeeById(employeeId);
      if (res.success && res.employee) {
        setSelectedEmployee(res.employee);
        setSelectedRecommendations(res.recommendations || []);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      showToast('Failed to load employee details', 'error');
    }
  };

  // Save (Create or Update) Employee
  const handleSaveEmployee = async (empData, id) => {
    try {
      if (id) {
        const res = await api.updateEmployee(id, empData);
        if (res.success) {
          showToast(`Updated ${res.employee.name} successfully`, 'success');
          await loadAllData();
          if (selectedEmployee && (selectedEmployee._id === id || selectedEmployee.employeeId === id)) {
            setSelectedEmployee(res.employee);
          }
        }
      } else {
        const res = await api.createEmployee(empData);
        if (res.success) {
          showToast(`Added ${res.employee.name} successfully`, 'success');
          await loadAllData();
        }
      }
    } catch (err) {
      showToast('Error saving employee: ' + err.message, 'error');
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      const res = await api.deleteEmployee(id);
      if (res.success) {
        showToast(`Removed employee ${name}`, 'info');
        await loadAllData();
      }
    } catch (err) {
      showToast('Failed to delete employee: ' + err.message, 'error');
    }
  };

  // Update Employee Metrics (KPI Simulator)
  const handleUpdateEmployeeMetrics = async (id, metrics) => {
    try {
      const res = await api.updateMetrics(id, metrics);
      if (res.success) {
        showToast('Performance KPIs updated & percentage recalculated', 'success');
        await loadAllData();
      }
    } catch (err) {
      showToast('Failed to update metrics: ' + err.message, 'error');
    }
  };

  // Toggle Task Status
  const handleToggleTaskStatus = async (employeeId, taskId, nextStatus) => {
    try {
      const res = await api.updateTaskStatus(employeeId, taskId, { status: nextStatus });
      if (res.success) {
        showToast(`Task marked as ${nextStatus}`, 'success');
        if (selectedEmployee) {
          const updatedTasks = selectedEmployee.tasks.map(t =>
            t._id === taskId ? { ...t, status: nextStatus } : t
          );
          setSelectedEmployee({
            ...selectedEmployee,
            tasks: updatedTasks,
            metrics: res.metrics || selectedEmployee.metrics
          });
        }
        await loadAllData();
      }
    } catch (err) {
      showToast('Failed to update task: ' + err.message, 'error');
    }
  };

  // Add Task to Employee
  const handleAddTask = async (employeeId, taskData) => {
    try {
      const res = await api.addTask(employeeId, taskData);
      if (res.success) {
        showToast('New task assigned', 'success');
        if (selectedEmployee) {
          setSelectedEmployee({
            ...selectedEmployee,
            tasks: res.tasks,
            metrics: res.metrics || selectedEmployee.metrics
          });
        }
        await loadAllData();
      }
    } catch (err) {
      showToast('Failed to add task: ' + err.message, 'error');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!employees || employees.length === 0) return;
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Department',
      'Role',
      'Location',
      'Salary (INR)',
      'Status',
      'Attendance Rate',
      'Task Completion Rate',
      'HR Review Score',
      'Overall Score',
      'Performance Category'
    ];

    const rows = employees.map(e => [
      e.employeeId,
      `"${e.name}"`,
      e.email,
      e.department,
      `"${e.role}"`,
      `"${e.location || 'India'}"`,
      e.salary || 850000,
      e.status,
      e.metrics?.attendanceRate,
      e.metrics?.taskCompletionRate,
      e.kpiData?.reviewScore !== undefined ? e.kpiData.reviewScore : 8.5,
      e.metrics?.overallScore,
      `"${e.performanceCategory}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HR_Hub_Enterprise_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported CSV dataset successfully', 'success');
  };

  // Pending leaves count
  const pendingLeavesCount = notifications.filter(n => n.type === 'leave_request').length;

  return (
    <div className="relative min-h-screen bg-[#f3f5f9] text-slate-900 flex flex-col font-sans">
      
      {/* Soft Ambient Background Mesh */}
      <div className="ambient-glow-mesh">
        <div className="ambient-sphere-1" />
        <div className="ambient-sphere-2" />
        <div className="ambient-sphere-3" />
      </div>

      {/* Authentication Gate */}
      {!currentUser ? (
        <AuthModal onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* Top-Right 5-Second HR Notification Toast */}
          {showNotificationPopup && (
            <NotificationToast
              notifications={notifications}
              onViewLeaves={() => setActiveTab('leaves')}
              onClose={() => setShowNotificationPopup(false)}
            />
          )}

          {/* Top Navbar */}
          <Navbar
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
            onLogout={handleLogout}
            onOpenNotifications={() => setShowNotificationPopup(true)}
            notificationsCount={pendingLeavesCount}
            onSeedDemoData={handleSeedDemoData}
            onClearAllData={handleClearAllData}
            isOperatingData={isOperatingData}
          />

          {/* Main Container */}
          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Sidebar */}
              <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentUser={currentUser}
                counts={{
                  totalEmployees: employees.length,
                  totalInsights: (insightsData?.needingImprovement?.length || 0) + (insightsData?.highPerformers?.length || 0),
                  pendingLeaves: pendingLeavesCount
                }}
              />

              {/* Dynamic View Router */}
              <section className="flex-1 min-w-0">
                
                {/* 1. Dashboard View */}
                {activeTab === 'dashboard' && (
                  <DashboardView
                    analyticsData={analyticsData}
                    onSelectEmployee={handleSelectEmployee}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {/* 2. Employee Directory */}
                {activeTab === 'employees' && (
                  <EmployeesView
                    employees={employees}
                    loading={loading}
                    onSelectEmployee={handleSelectEmployee}
                    onOpenAddModal={handleOpenAddModal}
                    onOpenEditModal={handleOpenEditModal}
                    onDeleteEmployee={handleDeleteEmployee}
                    onExportCsv={handleExportCsv}
                    onSeedDemoData={handleSeedDemoData}
                    onClearAllData={handleClearAllData}
                    isOperatingData={isOperatingData}
                  />
                )}

                {/* 3. Organization 3-in-1 Panel (Google/Zoho style) */}
                {activeTab === 'organization' && (
                  <OrganizationView
                    employees={employees}
                    onSelectEmployee={handleSelectEmployee}
                  />
                )}

                {/* 4. Real-Time KPI Simulator */}
                {activeTab === 'performance' && (
                  <PerformanceView
                    employees={employees}
                    onUpdateEmployeeMetrics={handleUpdateEmployeeMetrics}
                    onSelectEmployee={handleSelectEmployee}
                    showToast={showToast}
                  />
                )}

                {/* 5. Leave Management & Approvals */}
                {activeTab === 'leaves' && (
                  <LeaveManagementView
                    currentUser={currentUser}
                    onRefreshData={loadAllData}
                    showToast={showToast}
                  />
                )}

                {/* 6. Employee Self-Service Portal */}
                {activeTab === 'portal' && (
                  <EmployeePortalView
                    currentUser={currentUser}
                    employees={employees}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {/* 7. Strategic Insights */}
                {activeTab === 'insights' && (
                  <InsightsView
                    insightsData={insightsData}
                    onSelectEmployee={handleSelectEmployee}
                  />
                )}

                {/* 8. Monthly Reports */}
                {activeTab === 'reports' && (
                  <ReportsView
                    reportData={reportData}
                    employees={employees}
                    onExportCsv={handleExportCsv}
                  />
                )}

              </section>
            </div>
          </main>

          {/* Modals */}
          <AddEmployeeModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEmployeeToEdit(null);
            }}
            onSave={handleSaveEmployee}
            employeeToEdit={employeeToEdit}
          />

          <EmployeeDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            employee={selectedEmployee}
            recommendations={selectedRecommendations}
            onToggleTaskStatus={handleToggleTaskStatus}
            onAddTask={handleAddTask}
            onEdit={handleOpenEditModal}
          />

          {/* Toast Notification */}
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: 'info' })}
          />
        </>
      )}

    </div>
  );
}
