# HR Hub Enterprise - Workforce Operations and Performance Platform

HR Hub Enterprise is a full-stack human resources analytics and workforce operations platform engineered for modern organizations. Built with a responsive semi-transparent light interface modeled after Zoho People, it provides role-based workspaces for HR Directors, Engineering Managers, and Employees.

---

## Architectural Highlights

* Role-Based Access Control (RBAC):
  * HR Director: Administrative control across workforce records, salary CTC and status calibration, real-time KPI evaluations, leave approval queues, and direct appraisal feedback. Personal identity details of employees remain protected from unauthorized alteration.
  * Engineering Manager: Departmental oversight, sprint task allocations, team performance evaluations, and organization tree navigation.
  * Employee Self-Service: Dedicated read-only scorecard portal showing personal task throughput, review ratings, attendance compliance, leave application submission, and feedback inbox from HR leadership.

* Real-Time KPI Simulator:
  * Dynamic mathematical calculation using exact decimal precision (0.0 to 10.0 scale, 0.1 step).
  * Weighted formula: Task Completion Rate (40%) + HR Review Score (40%) + Attendance Compliance Rate (20%).
  * Instant automatic percentage evaluation and performance band categorizations: Exceptional (92%+), Strong Performer (82-91%), Meets Expectations (70-81%), Needs Improvement (60-69%), and Critical Attention (<60%).

* Organization Structure Panel (3-in-1 Unified Switcher):
  * Employee Hierarchy Tree: Interactive reporting chains from executive council to team contributors.
  * Department Tree: Corporate functional units branching into sub-teams and active headcounts.
  * Department Directory: Business unit profiles with operating budgets, average KPI composites, and team rosters.

* Leave Management and Automated Presence Sync:
  * Employee submits leave applications with type (Casual, Sick, Privilege, WFH), date ranges, and reasons.
  * HR review queue enables approval or rejection with custom decision notes.
  * Approved applications automatically transition employee status to "On Leave".
  * Top-right 5-second notification pop-up alerts HR upon dashboard entry whenever pending requests or presence changes occur.

* Appraisal Messaging and Feedback Channel:
  * HR Directors can dispatch direct performance notes categorized by Appraisal, Excellence Recognition, Improvement Plan, or Corporate Notice.
  * Delivered directly into the employee's personal profile feedback inbox.

* Zero-Data State and On-Demand Demo Lifecycle:
  * Platform functions without pre-loaded data, allowing manual employee onboarding and clean operational testing.
  * Single-click generation loads a standard 15-person Indian enterprise dataset across Engineering, Product, Marketing, Sales, and Human Resources.

* Automated Document Generation:
  * Client-side vector PDF generation compiling monthly executive summaries and workforce audit rosters.
  * Instant CSV data export for spreadsheet analysis.

---

## Technical Specifications

* Frontend:
  * React.js (Vite)
  * Tailwind CSS v4 (Light theme, semi-transparent frosted cards with backdrop blur)
  * Chart.js and React-Chartjs-2 (6-month trajectory line charts, radar benchmarking, tier doughnuts)
  * jsPDF and jspdf-autotable (vector PDF compilation)
  * Lucide React icons (corporate iconography, zero emoji characters)

* Backend:
  * Node.js and Express.js (ES Modules)
  * Mongoose ODM
  * Embedded In-Memory MongoDB Engine (automatic local fallback, no external database installation required)
  * JSON Web Token (JWT) role-based authorization
  * REST API architecture with input validation

---

## Directory Structure

* backend/
  * config/db.js - Dual-mode database connection manager
  * controllers/ - Business logic for auth, employees, performance, leaves, feedback, analytics, and reports
  * models/ - Mongoose schemas for Employee, Department, and User
  * routes/ - API endpoints
  * test/ - Verification test suites
  * seedData.js - 15-person Indian enterprise dataset
  * server.js - Express server configuration

* frontend/
  * src/api/api.js - Centralized API client
  * src/components/ - Reusable UI elements (Navbar, Sidebar, Avatar, AuthModal, NotificationToast, Toast, KpiCard, Modals)
  * src/views/ - DashboardView, EmployeesView, PerformanceView, OrganizationView, LeaveManagementView, EmployeePortalView, InsightsView, ReportsView

---

## Local Setup Instructions

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/Shron03/HR-Hub.git
cd HR-Hub

# Install dependencies
npm run install:all
```

### 2. Run the Application
Open two terminal windows:

Terminal 1 (Backend):
```bash
cd backend
node server.js
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

* Frontend Portal: http://localhost:5173
* Backend API: http://localhost:5000
* Health Endpoint: http://localhost:5000/health

---

## Default Authentication Credentials

* HR Director:
  * Email: hr@hrhub.in
  * Password: password123

* Engineering Manager:
  * Email: manager@hrhub.in
  * Password: password123

* Employee:
  * Email: aarav@hrhub.in
  * Password: password123
