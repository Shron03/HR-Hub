import React from 'react';
import { Building2, Users, MapPin, Award, CheckCircle, Mail, Phone, Clock } from 'lucide-react';
import Avatar from '../components/Avatar';

export default function DepartmentInfoView({ currentUser, employees = [] }) {
  const userDept = currentUser?.department || 'Engineering';

  const deptDetails = {
    'Engineering': {
      lead: 'Rajesh Verma',
      leadRole: 'Engineering Manager',
      location: 'Bengaluru, India',
      operatingHours: '09:00 AM – 06:00 PM IST',
      budget: '₹ 1.85 Cr',
      mission: 'Architecting resilient cloud software, high-throughput backend APIs, and intuitive user experiences for enterprise operations.',
      objectives: [
        'Maintain 99.95% system uptime across microservices',
        'Achieve sub-50ms API response latency for real-time telemetry',
        'Deploy bi-weekly continuous integration enhancements'
      ]
    },
    'Product': {
      lead: 'Sneha Rao',
      leadRole: 'Lead Product Manager',
      location: 'Bengaluru, India',
      operatingHours: '09:30 AM – 06:30 PM IST',
      budget: '₹ 1.10 Cr',
      mission: 'Driving product strategy, user discovery research, roadmap execution, and measurable workforce impact.',
      objectives: [
        'Streamline people operations workflows with zero friction',
        'Conduct monthly customer advisory sessions',
        'Deliver feature parity with enterprise benchmark standards'
      ]
    },
    'Marketing': {
      lead: 'Rohan Gupta',
      leadRole: 'Marketing Director',
      location: 'Mumbai, India',
      operatingHours: '09:00 AM – 06:00 PM IST',
      budget: '₹ 85 Lakhs',
      mission: 'Expanding enterprise brand presence, product storytelling, and qualified customer acquisition pipelines.',
      objectives: [
        'Increase brand awareness across regional enterprise summits',
        'Produce weekly technical case studies and whitepapers',
        'Optimize inbound customer acquisition ROI'
      ]
    },
    'Sales': {
      lead: 'Arjun Kapoor',
      leadRole: 'Enterprise Sales Lead',
      location: 'Delhi NCR, India',
      operatingHours: '09:00 AM – 06:00 PM IST',
      budget: '₹ 95 Lakhs',
      mission: 'Partnering with organizations to implement modern people management and workforce evaluation solutions.',
      objectives: [
        'Accelerate sales cycle duration for mid-market clients',
        'Expand enterprise customer retention above 95%',
        'Deliver personalized product demonstrations'
      ]
    },
    'Human Resources': {
      lead: 'Priya Sharma',
      leadRole: 'HR Director',
      location: 'Bengaluru, India',
      operatingHours: '09:00 AM – 06:00 PM IST',
      budget: '₹ 75 Lakhs',
      mission: 'Championing talent development, compensation equity, positive workplace culture, and workforce well-being.',
      objectives: [
        'Foster inclusive leadership development across all business units',
        'Maintain employee satisfaction scores above 90%',
        'Ensure rigorous compliance with labor and presence regulations'
      ]
    }
  };

  const currentDeptInfo = deptDetails[userDept] || deptDetails['Engineering'];
  const departmentPeers = employees.filter(e => e.department === userDept);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Department Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Department Portal
            </span>
            <span className="text-xs text-slate-500">
              {departmentPeers.length} Active Team Members
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            {userDept} Department Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {currentDeptInfo.mission}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs font-bold text-slate-900">{currentDeptInfo.lead}</div>
            <div className="text-[10px] text-slate-500">Department Lead</div>
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Operating Hub</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {currentDeptInfo.location}
          </div>
          <div className="text-xs text-slate-500">
            Core Hours: {currentDeptInfo.operatingHours}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Operational Allocation</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            Annual Budget: {currentDeptInfo.budget}
          </div>
          <div className="text-xs text-slate-500">
            Team Size: {departmentPeers.length} Dedicated Professionals
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase">
            <Award className="w-4 h-4 text-orange-600" />
            <span>Department Performance</span>
          </div>
          <div className="text-sm font-bold text-blue-600">
            {departmentPeers.length > 0
              ? `${Math.round(departmentPeers.reduce((acc, c) => acc + (c.metrics?.overallScore || 85), 0) / departmentPeers.length)}% Aggregate KPI`
              : '88% Aggregate KPI'}
          </div>
          <div className="text-xs text-slate-500">
            Consistently delivering sprint commitments
          </div>
        </div>
      </div>

      {/* Strategic Objectives & Peer Team Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Objectives */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Current Strategic Deliverables</span>
            </h3>

            <div className="space-y-3">
              {currentDeptInfo.objectives.map((obj, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peers List */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Colleagues in {userDept} ({departmentPeers.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {departmentPeers.map(peer => (
              <div
                key={peer.employeeId}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all flex items-center space-x-3"
              >
                <Avatar
                  name={peer.name}
                  initials={peer.initials}
                  bg={peer.avatarBg}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {peer.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {peer.role}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {peer.location || 'India'}
                  </div>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  peer.status === 'On Leave'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {peer.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
