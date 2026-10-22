import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OrgDirectoryView from './views/OrgDirectoryView';
import SalaryCompensationAdminView from './views/SalaryCompensationAdminView';
import OnboardingOffboardingView from './views/OnboardingOffboardingView';
import TimeAttendanceAdminView from './views/TimeAttendanceAdminView';
import PerformanceView from './views/PerformanceView';
import HelpDeskView from './views/HelpDeskView';
import DocumentsView from './views/DocumentsView';
import AnalyticsReportsView from './views/AnalyticsReportsView';
import ManagerApprovalsView from './views/ManagerApprovalsView';
import ManagerSupervisionView from './views/ManagerSupervisionView';
import ManagerProjectsView from './views/ManagerProjectsView';
import EmployeeAttendanceLeaveView from './views/EmployeeAttendanceLeaveView';
import EmployeeTimeTrackingView from './views/EmployeeTimeTrackingView';
import EmployeeSelfAppraisalView from './views/EmployeeSelfAppraisalView';
import EmployeeProfilePayrollView from './views/EmployeeProfilePayrollView';
import EmployeeTicketsView from './views/EmployeeTicketsView';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import RegistrationApprovalsModal from './components/RegistrationApprovalsModal';
import NotificationDrawer from './components/NotificationDrawer';
import AuthModal from './components/AuthModal';
import NotificationToast from './components/NotificationToast';
import Toast from './components/Toast';
import { api } from './api/api';

export default function App() {
  // Authentication State: Requires explicit login or demo selection on visit
  const [currentUser, setCurrentUser] = useState(() => {
    // Proactively clean up legacy auto-login localStorage so first visit always shows login
    try {
      localStorage.removeItem('hrhub_user');
    } catch (e) {}

    // Check sessionStorage only if authenticated during active tab session
    const saved = sessionStorage.getItem('hrhub_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const isEmployee = currentUser?.role === 'Employee';
  const isManager = currentUser?.role === 'Engineering Manager';
  const isHR = currentUser?.role === 'HR Director' || !currentUser?.role;

  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = sessionStorage.getItem('hrhub_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === 'Employee') return 'emp-attendance-leave';
        if (u.role === 'Engineering Manager') return 'mgr-approvals';
        return 'org-directory';
      } catch (e) {}
    }
    return 'org-directory';
  });

  // Application Data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [insightsData, setInsightsData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [activeCasesCount, setActiveCasesCount] = useState(0);
  const [pendingTimesheetsCount, setPendingTimesheetsCount] = useState(0);
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
        }).catch(() => ({ success: false })),
        api.getTickets().catch(() => ({ success: false })),
        api.getOnboardingCases().catch(() => ({ success: false })),
        api.getTimeLogs({ status: 'Pending Approval' }).catch(() => ({ success: false }))
      ];

      if (currentUser?.role === 'HR Director') {
        promises.push(api.getPendingRegistrations().catch(() => ({ success: false })));
      }

      const results = await Promise.all(promises);
      const [
        analyticsRes,
        employeesRes,
        insightsRes,
        reportRes,
        notifRes,
        ticketsRes,
        casesRes,
        timeLogsRes,
        regRes
      ] = results;

      if (analyticsRes?.success) setAnalyticsData(analyticsRes);
      if (employeesRes?.success) setEmployees(employeesRes.employees || []);
      if (insightsRes?.success) setInsightsData(insightsRes);
      if (reportRes?.success) setReportData(reportRes);
      if (ticketsRes?.success) {
        setOpenTicketsCount((ticketsRes.tickets || []).filter(t => t.status === 'Open' || t.status === 'In Progress').length);
      }
      if (casesRes?.success) {
        setActiveCasesCount((casesRes.cases || []).filter(c => c.status !== 'Completed').length);
      }
      if (timeLogsRes?.success) {
        setPendingTimesheetsCount((timeLogsRes.timeLogs || []).length);
      }
      if (notifRes?.success && notifRes.notifications) {
        setNotifications(notifRes.notifications);
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
      if (currentUser.role === 'Employee' && (activeTab === 'org-directory' || activeTab === 'dashboard')) {
        setActiveTab('emp-attendance-leave');
      } else if (currentUser.role === 'Engineering Manager' && (activeTab === 'org-directory' || activeTab === 'dashboard')) {
        setActiveTab('mgr-approvals');
      }
    }
  }, [currentUser]);

  // Handle Login Success
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem('hrhub_user', JSON.stringify(user));
    if (user.role === 'Employee') {
      setActiveTab('emp-attendance-leave');
    } else if (user.role === 'Engineering Manager') {
      setActiveTab('mgr-approvals');
    } else {
      setActiveTab('org-directory');
    }
    showToast(`Authenticated as ${user.name} (${user.role})`, 'success');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('hrhub_user');
    localStorage.removeItem('hrhub_user');
    showToast('Signed out successfully. Select or sign in with another account.', 'info');
  };

  // Handle Demo Reset
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

  // Save Employee
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

      {/* Authentication Gate: Shows only when explicitly logged out */}
      {!currentUser ? (
        <AuthModal onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* Top-Right 5-Second HR Notification Popup */}
          {showNotificationPopup && (
            <NotificationToast
              notifications={notifications}
              onViewLeaves={() => setActiveTab('time-attendance')}
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
              pendingLeaves: pendingLeavesCount,
              openTickets: openTicketsCount,
              activeCases: activeCasesCount,
              pendingTimesheets: pendingTimesheetsCount
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

              {/* ========================================= */}
              {/* HR DIRECTOR VIEWS                         */}
              {/* ========================================= */}
              
              {/* 1. Organization & Employee Directory */}
              {activeTab === 'org-directory' && isHR && (
                <OrgDirectoryView
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

              {/* Compensation & Payroll Administration */}
              {activeTab === 'salary-compensation' && isHR && (
                <SalaryCompensationAdminView
                  currentUser={currentUser}
                  employees={employees}
                  onUpdateEmployee={handleSaveEmployee}
                  onRefreshData={loadAllData}
                  showToast={showToast}
                />
              )}

              {/* 2. Onboarding & Offboarding (HR Process) */}
              {activeTab === 'onboarding-offboarding' && isHR && (
                <OnboardingOffboardingView showToast={showToast} />
              )}

              {/* 3. Time & Attendance Administration */}
              {activeTab === 'time-attendance' && isHR && (
                <TimeAttendanceAdminView
                  currentUser={currentUser}
                  employees={employees}
                  onRefreshData={loadAllData}
                  showToast={showToast}
                />
              )}

              {/* 4. Talent Management & Appraisals */}
              {activeTab === 'talent-management' && isHR && (
                <PerformanceView
                  employees={employees}
                  onUpdateEmployeeMetrics={handleUpdateEmployeeMetrics}
                  onSelectEmployee={handleSelectEmployee}
                  showToast={showToast}
                />
              )}

              {/* 5. HR Help Desk & Requests */}
              {activeTab === 'helpdesk' && isHR && (
                <HelpDeskView
                  currentUser={currentUser}
                  showToast={showToast}
                />
              )}

              {/* 6. Files & Document Management */}
              {activeTab === 'documents' && isHR && (
                <DocumentsView
                  currentUser={currentUser}
                  showToast={showToast}
                />
              )}

              {/* 7. Analytics & Reports */}
              {activeTab === 'analytics-reports' && isHR && (
                <AnalyticsReportsView
                  analyticsData={analyticsData}
                  insightsData={insightsData}
                  reportData={reportData}
                  employees={employees}
                  onSelectEmployee={handleSelectEmployee}
                  onExportCsv={handleExportCsv}
                />
              )}

              {/* ========================================= */}
              {/* ENGINEERING MANAGER VIEWS                 */}
              {/* ========================================= */}

              {/* 1. Approval Center */}
              {activeTab === 'mgr-approvals' && isManager && (
                <ManagerApprovalsView
                  currentUser={currentUser}
                  showToast={showToast}
                />
              )}

              {/* 2. Team Supervision */}
              {activeTab === 'mgr-supervision' && isManager && (
                <ManagerSupervisionView
                  employees={employees}
                  onSelectEmployee={handleSelectEmployee}
                  onAddTask={handleAddTask}
                  showToast={showToast}
                />
              )}

              {/* 3. Performance & Goal Tracking */}
              {activeTab === 'mgr-performance' && isManager && (
                <PerformanceView
                  employees={employees.filter(e => e.department === 'Engineering')}
                  onUpdateEmployeeMetrics={handleUpdateEmployeeMetrics}
                  onSelectEmployee={handleSelectEmployee}
                  showToast={showToast}
                />
              )}

              {/* 4. Time Logs & Projects */}
              {activeTab === 'mgr-projects' && isManager && (
                <ManagerProjectsView showToast={showToast} />
              )}

              {/* ========================================= */}
              {/* EMPLOYEE SELF-SERVICE VIEWS               */}
              {/* ========================================= */}

              {/* 1. Self Attendance & Leave */}
              {activeTab === 'emp-attendance-leave' && isEmployee && (
                <EmployeeAttendanceLeaveView
                  currentUser={currentUser}
                  employees={employees}
                  onRefreshData={loadAllData}
                  showToast={showToast}
                />
              )}

              {/* 2. Time Tracking */}
              {activeTab === 'emp-time-tracking' && isEmployee && (
                <EmployeeTimeTrackingView
                  currentUser={currentUser}
                  employees={employees}
                  onToggleTaskStatus={handleToggleTaskStatus}
                  showToast={showToast}
                />
              )}

              {/* 3. Performance & Self-Appraisal */}
              {activeTab === 'emp-performance-appraisal' && isEmployee && (
                <EmployeeSelfAppraisalView
                  currentUser={currentUser}
                  employees={employees}
                  showToast={showToast}
                />
              )}

              {/* 4. Profile & Payroll Documents */}
              {activeTab === 'emp-profile-payroll' && isEmployee && (
                <EmployeeProfilePayrollView
                  currentUser={currentUser}
                  employees={employees}
                  showToast={showToast}
                />
              )}

              {/* 5. HR Tickets */}
              {activeTab === 'emp-hr-tickets' && isEmployee && (
                <EmployeeTicketsView
                  currentUser={currentUser}
                  employees={employees}
                  showToast={showToast}
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
