import React, { useState } from 'react';
import {
  X,
  Calendar,
  Building2,
  MapPin,
  Award,
  CheckSquare,
  Plus,
  Clock,
  Briefcase,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import Avatar from './Avatar';

export default function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  recommendations = [],
  onToggleTaskStatus,
  onAddTask,
  onEdit
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [isAddingTask, setIsAddingTask] = useState(false);

  if (!isOpen || !employee) return null;

  const { metrics = {}, kpiData = {} } = employee;

  // Radar Data for Employee's 5 Core KPIs
  const radarData = {
    labels: ['Attendance', 'Tasks', 'Review', 'Contribution', 'Efficiency'],
    datasets: [
      {
        label: `${employee.name} KPI Profile`,
        data: [
          metrics.attendanceRate || 92,
          metrics.taskCompletionRate || 90,
          metrics.productivityScore || 85,
          metrics.projectContribution || 85,
          metrics.workEfficiency || 86
        ],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: '#2563eb',
        borderWidth: 2,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointHoverRadius: 5
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(226, 232, 240, 0.9)' },
        grid: { color: 'rgba(226, 232, 240, 0.9)' },
        pointLabels: { color: '#334155', font: { size: 10, weight: '600' } },
        ticks: { backdropColor: 'transparent', color: '#64748b', stepSize: 20, min: 40, max: 100 }
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await onAddTask(employee._id || employee.employeeId, {
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      project: 'Core Assignment',
      status: 'In Progress'
    });

    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/95 shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col animate-fade-in text-slate-800">
        
        {/* Header Profile Row */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <Avatar
              name={employee.name}
              initials={employee.initials}
              bg={employee.avatarBg}
              size="lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {employee.employeeId}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  employee.status === 'On Leave'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {employee.status || 'Active'}
                </span>
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                {employee.role} • <span className="text-blue-600 font-semibold">{employee.department}</span>
              </div>
              <div className="flex items-center space-x-4 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{employee.location || 'Bengaluru, India'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Joined {new Date(employee.joinDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Overall KPI
              </span>
              <span className="text-2xl font-bold font-mono text-blue-600">
                {metrics.overallScore}%
              </span>
            </div>
            {onEdit && (
              <button
                onClick={() => onEdit(employee)}
                className="btn-large bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs shadow-sm cursor-pointer"
                title="Calibrate Compensation & Status"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Calibrate</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-4 space-y-5 text-xs pr-1">
          
          {/* Top Section: Radar Chart & KPI Metrics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* KPI Radar */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-700">
                5-Axis Competency Radar
              </span>
              <div className="w-full h-48 flex items-center justify-center">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            {/* Individual KPI Numbers */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Attendance</span>
                <div className="text-xl font-mono font-bold text-blue-600 mt-1">
                  {metrics.attendanceRate}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Weighted 20%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Task Rate</span>
                <div className="text-xl font-mono font-bold text-emerald-600 mt-1">
                  {metrics.taskCompletionRate}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {kpiData.tasksCompleted || 18} / {kpiData.tasksGiven || 20} (40%)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">HR Review</span>
                <div className="text-xl font-mono font-bold text-orange-600 mt-1">
                  {(kpiData.reviewScore !== undefined ? kpiData.reviewScore : 8.5).toFixed(1)} / 10
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Weighted 40%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Annual CTC</span>
                <div className="text-base font-mono font-bold text-slate-900 mt-1">
                  ₹ {(employee.salary || 850000).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Authorized HR scale</div>
              </div>
            </div>

          </div>

          {/* Smart Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-orange-500" />
                <span>Performance Diagnostic Recommendations</span>
              </h3>
              <div className="space-y-2">
                {recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs flex items-start space-x-2"
                  >
                    <span className="text-blue-600 font-bold">•</span>
                    <div>
                      <span className="font-bold text-slate-900">{rec.title}: </span>
                      <span className="text-slate-600">{rec.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Tasks & Projects Roster */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Assigned Tasks & Projects</span>
              </h3>
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>

            {isAddingTask && (
              <form onSubmit={handleCreateTask} className="mb-3 p-3 rounded-xl bg-slate-50 border border-blue-300 space-y-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                />
                <div className="flex justify-between items-center">
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="px-2 py-1 rounded bg-white border border-slate-300 text-xs text-slate-700"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {employee.tasks && employee.tasks.length > 0 ? (
                employee.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() =>
                          onToggleTaskStatus(
                            employee._id || employee.employeeId,
                            task._id,
                            task.status === 'Completed' ? 'In Progress' : 'Completed'
                          )
                        }
                        className={`p-1 rounded cursor-pointer transition-colors ${
                          task.status === 'Completed'
                            ? 'text-emerald-600'
                            : 'text-slate-400 hover:text-blue-600'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div>
                        <span
                          className={`text-xs font-semibold ${
                            task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {task.project} • Priority: {task.priority}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : task.status === 'Overdue'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs py-3 text-center">No tasks currently assigned.</div>
              )}
            </div>
          </div>

          {/* Feedback Received */}
          {employee.feedbacks && employee.feedbacks.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>HR Feedback & Appraisal Notes</span>
              </h3>
              <div className="space-y-2">
                {employee.feedbacks.map((fb, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {fb.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(fb.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      "{fb.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
