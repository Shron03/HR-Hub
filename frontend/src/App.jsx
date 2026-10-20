import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import EmployeesView from './views/EmployeesView';
import PerformanceView from './views/PerformanceView';
import InsightsView from './views/InsightsView';
import ReportsView from './views/ReportsView';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import Toast from './components/Toast';
import { api } from './api/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState({
    name: 'Victoria Chen',
    role: 'HR Director',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  });

  // Data states
  const [analyticsData, setAnalyticsData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [insightsData, setInsightsData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

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
    }, 4000);
  };

  // Load all data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, employeesRes, insightsRes, reportRes] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getEmployees({ limit: 100 }),
        api.getInsights(),
        api.getMonthlyReport('Dec')
      ]);

      if (analyticsRes.success) setAnalyticsData(analyticsRes);
      if (employeesRes.success) setEmployees(employeesRes.employees || []);
      if (insightsRes.success) setInsightsData(insightsRes);
      if (reportRes.success) setReportData(reportRes);
    } catch (err) {
      console.error('Failed to load application data:', err);
      showToast('Connecting to backend API...', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle Role Switch
  const handleSwitchRole = async (newRole) => {
    try {
      const res = await api.demoLogin(newRole);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        showToast(`Switched active view to ${newRole}`, 'success');
      }
    } catch (err) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
      showToast(`Switched active role: ${newRole}`, 'info');
    }
  };

  // Handle Demo Reset
  const handleResetData = async () => {
    try {
      setIsResetting(true);
      const res = await api.resetDemoData();
      if (res.success) {
        await loadAllData();
        showToast('Database reset to fresh 15-employee baseline', 'success');
      }
    } catch (err) {
      showToast('Error resetting data: ' + err.message, 'error');
    } finally {
      setIsResetting(false);
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
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
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

  // Update Employee Metrics (KPI Calibrator)
  const handleUpdateEmployeeMetrics = async (id, metrics) => {
    try {
      const res = await api.updateMetrics(id, metrics);
      if (res.success) {
        showToast('Performance KPIs updated & recalculated', 'success');
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
        // Update selected employee tasks in place
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
      'Salary',
      'Attendance Rate',
      'Task Completion Rate',
      'Productivity Score',
      'Overall Score',
      'Performance Category'
    ];

    const rows = employees.map(e => [
      e.employeeId,
      `"${e.name}"`,
      e.email,
      e.department,
      `"${e.role}"`,
      `"${e.location}"`,
      e.salary,
      e.metrics?.attendanceRate,
      e.metrics?.taskCompletionRate,
      e.metrics?.productivityScore,
      e.metrics?.overallScore,
      `"${e.performanceCategory}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HR_Hub_Employees_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported CSV dataset successfully', 'success');
  };

  return (
    <div className="relative min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Ambient Cyber Lighting Mesh */}
      <div className="ambient-glow-mesh">
        <div className="ambient-sphere-1" />
        <div className="ambient-sphere-2" />
        <div className="ambient-sphere-3" />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={{
              totalEmployees: employees.length,
              totalInsights: (insightsData?.needingImprovement?.length || 0) + (insightsData?.highPerformers?.length || 0)
            }}
          />

          {/* Dynamic View Router */}
          <section className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardView
                analyticsData={analyticsData}
                onSelectEmployee={handleSelectEmployee}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeesView
                employees={employees}
                loading={loading}
                onSelectEmployee={handleSelectEmployee}
                onOpenAddModal={handleOpenAddModal}
                onOpenEditModal={handleOpenEditModal}
                onDeleteEmployee={handleDeleteEmployee}
                onExportCsv={handleExportCsv}
              />
            )}

            {activeTab === 'performance' && (
              <PerformanceView
                employees={employees}
                onUpdateEmployeeMetrics={handleUpdateEmployeeMetrics}
                onSelectEmployee={handleSelectEmployee}
              />
            )}

            {activeTab === 'insights' && (
              <InsightsView
                insightsData={insightsData}
                onSelectEmployee={handleSelectEmployee}
              />
            )}

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
    </div>
  );
}
