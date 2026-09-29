import React, { useState } from 'react';
import {
  X,
  Calendar,
  Building2,
  DollarSign,
  MapPin,
  Award,
  CheckSquare,
  Plus,
  Clock,
  Briefcase,
  AlertCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { Radar, Line } from 'react-chartjs-2';

export default function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  recommendations = [],
  onToggleTaskStatus,
  onAddTask
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [isAddingTask, setIsAddingTask] = useState(false);

  if (!isOpen || !employee) return null;

  const { metrics = {} } = employee;

  // Radar Data for Employee's 5 Core KPIs
  const radarData = {
    labels: ['Attendance', 'Tasks', 'Productivity', 'Contribution', 'Efficiency'],
    datasets: [
      {
        label: `${employee.name} KPI Profile`,
        data: [
          metrics.attendanceRate || 90,
          metrics.taskCompletionRate || 85,
          metrics.productivityScore || 88,
          metrics.projectContribution || 82,
          metrics.workEfficiency || 86
        ],
        backgroundColor: 'rgba(6, 182, 212, 0.3)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointHoverRadius: 6
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
        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: { color: '#cbd5e1', font: { size: 10 } },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Profile Row */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">{employee.name}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {employee.employeeId}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  {employee.status || 'Active'}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">
                {employee.role} • <span className="text-cyan-400">{employee.department}</span>
              </div>
              <div className="flex items-center space-x-4 text-[11px] text-slate-400 mt-1.5">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{employee.location || 'HQ'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Overall KPI
              </span>
              <span className="text-2xl font-bold font-mono text-cyan-400">
                {metrics.overallScore}%
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-300">
                5-Axis KPI Competency Radar
              </span>
              <div className="w-full h-48 flex items-center justify-center">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            {/* Individual KPI Numbers */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Attendance</span>
                <div className="text-xl font-mono font-bold text-cyan-400 mt-1">
                  {metrics.attendanceRate}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Weighted 20%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Task Completion</span>
                <div className="text-xl font-mono font-bold text-indigo-400 mt-1">
                  {metrics.taskCompletionRate}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Weighted 25%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Productivity</span>
                <div className="text-xl font-mono font-bold text-purple-400 mt-1">
                  {metrics.productivityScore}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Weighted 25%</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Efficiency</span>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                  {metrics.workEfficiency}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Weighted 15%</div>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Automated Performance Recommendations</span>
              </h3>
              <div className="space-y-2">
                {recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-start space-x-2"
                  >
                    <span className="text-cyan-400 font-bold">•</span>
                    <div>
                      <span className="font-semibold text-white">{rec.title}: </span>
                      <span className="text-slate-300">{rec.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Tasks & Projects Roster */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Assigned Tasks & Projects</span>
              </h3>
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>

            {isAddingTask && (
              <form onSubmit={handleCreateTask} className="mb-3 p-3 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
                <div className="flex justify-between items-center">
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
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
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
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
                            ? 'text-emerald-400 hover:text-emerald-300'
                            : 'text-slate-500 hover:text-cyan-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div>
                        <span
                          className={`text-xs font-medium ${
                            task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'
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
                      className={`px-2 py-0.5 text-[9px] font-semibold rounded-full border ${
                        task.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : task.status === 'Overdue'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-xs py-3 text-center">No tasks currently assigned.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
