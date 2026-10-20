import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './views/DashboardView';
import EmployeesView from './views/EmployeesView';
import PerformanceView from './views/PerformanceView';
import OrganizationView from './views/OrganizationView';
import LeaveManagementView from './views/LeaveManagementView';
import EmployeePortalView from './views/EmployeePortalView';
import EmployeeFeedbackHistoryView from './views/EmployeeFeedbackHistoryView';
import DepartmentInfoView from './views/DepartmentInfoView';
import InsightsView from './views/InsightsView';
import ReportsView from './views/ReportsView';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import RegistrationApprovalsModal from './components/RegistrationApprovalsModal';
import NotificationDrawer from './components/NotificationDrawer';
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

  const isEmployee = currentUser?.role === 'Employee';
  const isHR = currentUser?.role === 'HR Director' || !currentUser?.role;

  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = localStorage.getItem('hrhub_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.role === 'Employee' ? 'portal' : 'dashboard';
      } catch (e) {}
    }
    return 'dashboard';
  });

  // Application Data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [insightsData, setInsightsData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOperatingData, setIsOperatingData] = useState(false);

  // Modals & Drawers
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
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
      const promises = [
        api.getDashboardAnalytics().catch(() => ({ success: false })),
        api.getEmployees({ limit: 100 }).catch(() => ({ success: false })),
        api.getInsights().catch(() => ({ success: false })),
        api.getMonthlyReport('Dec').catch(() => ({ success: false })),
        api.getNotifications({
          role: currentUser?.role,
          employeeId: currentUser?.employeeId,
          userId: currentUser?.id
        }).catch(() => ({ success: false }))
      ];

      if (currentUser?.role === 'HR Director') {
        promises.push(api.getPendingRegistrations().catch(() => ({ success: false })));
      }

      const results = await Promise.all(promises);
      const [analyticsRes, employeesRes, insightsRes, reportRes, notifRes, regRes] = results;

      if (analyticsRes?.success) setAnalyticsData(analyticsRes);
      if (employeesRes?.success) setEmployees(employeesRes.employees || []);
      if (insightsRes?.success) setInsightsData(insightsRes);
      if (reportRes?.success) setReportData(reportRes);
      if (notifRes?.success && notifRes.notifications) {
        setNotifications(notifRes.notifications);
        // Show 5-second popup on load for HR if unread items exist
        const unreadCount = notifRes.notifications.filter(n => !n.read).length;
        if (currentUser?.role === 'HR Director' && unreadCount > 0) {
          setShowNotificationPopup(true);
        }
      }
      if (regRes?.success) {
        setPendingRegistrations(regRes.registrations || []);
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
      if (currentUser.role === 'Employee' && activeTab === 'dashboard') {
        setActiveTab('portal');
      }
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
    showToast(`Authenticated as ${user.name} (${user.role})`, 'success');
  };

  // Handle Logout (To switch roles, user signs out and logs in as another role)
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hrhub_user');
    showToast('Signed out successfully. Select or sign in with another account.', 'info');
  };

  // Handle Demo Reset (Restores default 15 Indian employees)
  const handleResetDemoData = async () => {
    try {
      setIsOperatingData(true);
      const res = await api.seedDemoData();
      if (res.success) {
        await loadAllData();
        showToast('Demo environment reset to standard 15-employee Indian dataset', 'success');
      }
    } catch (err) {
      showToast('Error resetting demo: ' + err.message, 'error');
    } finally {
      setIsOperatingData(false);
    }
  };

  // Notification Mark Read Handlers
  const handleMarkNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id, currentUser?.id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead(currentUser?.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('All notifications marked as read', 'info');
    } catch (err) {
      console.error(err);
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
          showToast(`Updated profile for ${res.employee.name} successfully`, 'success');
          await loadAllData();
          if (selectedEmployee && (selectedEmployee._id === id || selectedEmployee.employeeId === id)) {
            setSelectedEmployee(res.employee);
          }
        }
      } else {
        const res = await api.createEmployee(empData);
        if (res.success) {
          showToast(`Enrolled ${res.employee.name} into Directory`, 'success');
          await loadAllData();
        }
      }
    } catch (err) {
      showToast('Error saving employee: ' + err.message, 'error');
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from active records?`)) return;
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
        showToast('Performance KPIs updated & composite index synchronized', 'success');
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
        showToast('New deliverable assigned', 'success');
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
      showToast('Failed to assign task: ' + err.message, 'error');
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
      'Attendance Compliance',
      'Deliverables Completion Rate',
      'Managerial Review Rating',
      'Composite KPI Score',
      'Performance Category'
    ];

    const rows = employees.map(e => [
      e.employeeId,
      `"${e.name}"`,
      e.email,
      e.department,
      `"${e.role}"`,
      `"${e.location || 'Bengaluru, India'}"`,
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

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingLeavesCount = notifications.filter(n => n.category === 'leave_request' && !n.read).length;

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
          {/* Top-Right 5-Second HR Notification Popup */}
          {showNotificationPopup && (
            <NotificationToast
              notifications={notifications}
              onViewLeaves={() => setActiveTab('leaves')}
              onClose={() => setShowNotificationPopup(false)}
            />
          )}

          {/* Sticky Top Navigation Menu Header (Does not scroll away) */}
          <Navbar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
            unreadNotificationsCount={unreadNotificationsCount}
            onResetDemo={handleResetDemoData}
            isOperatingData={isOperatingData}
            pendingRegistrationsCount={pendingRegistrations.length}
            onOpenRegistrationsModal={() => setIsRegistrationsModalOpen(true)}
            counts={{
              totalEmployees: employees.length,
              totalInsights: (insightsData?.needingImprovement?.length || 0) + (insightsData?.highPerformers?.length || 0),
              pendingLeaves: pendingLeavesCount
            }}
          />

          {/* Notification Slide-out Drawer */}
          <NotificationDrawer
            isOpen={isNotificationDrawerOpen}
            onClose={() => setIsNotificationDrawerOpen(false)}
            notifications={notifications}
            unreadCount={unreadNotificationsCount}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setIsNotificationDrawerOpen(false);
            }}
          />

          {/* Pending Registrations Modal for HR Director */}
          {isHR && (
            <RegistrationApprovalsModal
              isOpen={isRegistrationsModalOpen}
              onClose={() => setIsRegistrationsModalOpen(false)}
              onRefresh={loadAllData}
              showToast={showToast}
            />
          )}

          {/* Main Full-Width Container (Stretched to fit desktop displays) */}
          <main className="relative z-10 flex-1 w-full max-w-[98%] xl:max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 py-5">
            <div className="w-full">
              
              {/* Dynamic View Router */}
              
              {/* 1. Dashboard View (HR & Manager only) */}
              {activeTab === 'dashboard' && !isEmployee && (
                <DashboardView
                  analyticsData={analyticsData}
                  onSelectEmployee={handleSelectEmployee}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {/* 2. Employee Directory (HR & Manager only) */}
              {activeTab === 'employees' && !isEmployee && (
                <EmployeesView
                  employees={employees}
                  loading={loading}
                  onSelectEmployee={handleSelectEmployee}
                  onOpenAddModal={handleOpenAddModal}
                  onOpenEditModal={handleOpenEditModal}
                  onDeleteEmployee={handleDeleteEmployee}
                  onExportCsv={handleExportCsv}
                  onSeedDemoData={handleResetDemoData}
                  onClearAllData={async () => {
                    if (!window.confirm('Clear all employee records? System will enter empty state.')) return;
                    try {
                      setIsOperatingData(true);
                      const res = await api.clearAllEmployees();
                      if (res.success) {
                        await loadAllData();
                        showToast('All employee records cleared.', 'info');
                      }
                    } catch (err) {
                      showToast('Error: ' + err.message, 'error');
                    } finally {
                      setIsOperatingData(false);
                    }
                  }}
                  isOperatingData={isOperatingData}
                />
              )}

              {/* 3. Organization 3-in-1 Structure (HR & Manager only; Employees CANNOT see) */}
              {activeTab === 'organization' && !isEmployee && (
                <OrganizationView
                  employees={employees}
                  onSelectEmployee={handleSelectEmployee}
                />
              )}

              {/* 4. Real-Time KPI Simulator (HR & Manager only) */}
              {activeTab === 'performance' && !isEmployee && (
                <PerformanceView
                  employees={employees}
                  onUpdateEmployeeMetrics={handleUpdateEmployeeMetrics}
                  onSelectEmployee={handleSelectEmployee}
                  showToast={showToast}
                />
              )}

              {/* 5. Leave Management & Approvals (Accessible by all roles with role-tailored permissions) */}
              {activeTab === 'leaves' && (
                <LeaveManagementView
                  currentUser={currentUser}
                  onRefreshData={loadAllData}
                  showToast={showToast}
                />
              )}

              {/* 6. Employee Self-Service Overview (For Employee role) */}
              {activeTab === 'portal' && (
                <EmployeePortalView
                  currentUser={currentUser}
                  employees={employees}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {/* 7. Employee Past Feedbacks & Appraisal History (For Employee role) */}
              {activeTab === 'feedbacks' && (
                <EmployeeFeedbackHistoryView
                  currentUser={currentUser}
                  employeeRecord={employees.find(e => e.employeeId === (currentUser?.employeeId || 'EMP-1001')) || employees[0]}
                />
              )}

              {/* 8. Employee Department Information (For Employee role) */}
              {activeTab === 'department-info' && (
                <DepartmentInfoView
                  currentUser={currentUser}
                  employees={employees}
                />
              )}

              {/* 9. Strategic Insights (HR only) */}
              {activeTab === 'insights' && !isEmployee && (
                <InsightsView
                  insightsData={insightsData}
                  onSelectEmployee={handleSelectEmployee}
                />
              )}

              {/* 10. Monthly Executive Reports (HR only) */}
              {activeTab === 'reports' && !isEmployee && (
                <ReportsView
                  reportData={reportData}
                  employees={employees}
                  onExportCsv={handleExportCsv}
                />
              )}

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
