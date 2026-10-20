# HR Hub - Employee Performance Dashboard
### SkillOrbit Human Resources Capstone Project

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Embedded-47a248?logo=mongodb&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-ff6384?logo=chart.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)

HR Hub is a full-stack HR analytics web application engineered to monitor, evaluate, and visualize workforce performance metrics across an enterprise organization. It provides HR leadership and department managers with data-backed visibility into employee output, attendance compliance, task velocity, and organizational efficiency.

---

## Key Capabilities

* Multi-Department Management: Complete CRUD records management across Engineering, Product, Marketing, Sales, and Human Resources.
* Fully Editable Records: Direct in-app editing of all employee profiles, roles, departments, salaries, and individual KPI metrics.
* Dynamic Weighted KPI Engine: Calculates overall composite performance ratings based on standardized organizational weights:
  * Attendance Rate: 20%
  * Task Completion Rate: 25%
  * Productivity Score: 25%
  * Project Contribution: 15%
  * Work Efficiency: 15%
* Interactive Performance Simulator: Real-time slider tuner for simulating score outcomes and applying updates to any selected employee.
* Interactive Chart.js Visualizations: 6-month historical telemetry trends, department competency radar and bar charts, tier distribution doughnuts, and top-performer rankings.
* Automated Diagnostic Insights: Rule-based detection of underperforming personnel, attendance policy warnings (below 80%), leadership nominations (92%+), and workload optimization proposals.
* Automated Reporting: Client-side vector PDF generation compiling executive summaries, department rankings, and employee scorecards, alongside raw CSV exports.
* Role-Based Access Control (RBAC): Switchable demo perspectives for HR Director, Engineering Manager, and Individual Employee.
* Dual-Mode Database Engine: Seamlessly connects to MongoDB Atlas cloud instances or runs an embedded in-memory MongoDB engine locally without requiring pre-installed database services.

---

## Module Coverage

| Module | Core Deliverables | Status |
| :--- | :--- | :---: |
| Module 1: Employee Data Management | Full CRUD operations, department & role tracking, multi-field search, status filtering, dual Table/Grid views, CSV export. | Complete |
| Module 2: Performance Tracking System | Attendance %, Task completion rate, Productivity score, Project contribution, Work efficiency, interactive KPI Tuner simulator, task checklists. | Complete |
| Module 3: HR Analytics Dashboard | Executive KPI metric cards, 6-month historical trend line chart, department competency radar/bar chart, rating tier doughnut, top performers leaderboard. | Complete |
| Module 4: Performance Insights & Recommendations | Diagnostic alerts for underperforming staff, attendance threshold warnings, top talent recognition, and operational throughput recommendations. | Complete |
| Module 5: Report Generation | Downloadable multi-page Executive PDF Report (via jsPDF & autotable), raw CSV export, monthly audit snapshots (Jul - Dec 2026). | Complete |

---

## Tech Stack

* Frontend: React.js (Vite), Tailwind CSS v4, Lucide React, Chart.js, react-chartjs-2, jsPDF, jspdf-autotable.
* Backend: Node.js, Express.js (ES Modules), Mongoose ODM, MongoDB Memory Server (local fallback), JWT authentication, Morgan logger.
* Database: MongoDB (Atlas Cloud URI or Embedded In-Memory Database).
* Deployment Configurations: Vercel (`frontend/vercel.json`) and Render (`render.yaml`).

---

## Quick Start (Local Setup)

### Prerequisites
* Node.js (v18+ or v24+)
* npm (v9+)

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/Shron03/HR-Hub.git
cd HR-Hub

# Install dependencies for both backend and frontend
npm run install:all
```

### 2. Database Initialization
```bash
# Seeds initial 15-employee baseline across 5 departments
npm run seed
```

### 3. Running Development Servers
Open two terminal windows:

Terminal 1 (Backend API - Port 5000):
```bash
npm run start:backend
# API available at: http://localhost:5000
# Health check: http://localhost:5000/health
```

Terminal 2 (Frontend Client - Port 5173):
```bash
npm run start:frontend
# Web application available at: http://localhost:5173
```

---

## Verification and Quality Checks

The codebase includes an automated verification test suite:

* Stage 1: REST API & Schema Validation (`npm run test:backend`)
* Stage 2: Database Persistence & Task Lifecycle (`npm run test:stage2`)
* Stage 3: KPI Mathematical Precision & Boundary Conditions (`npm run test:stage3`)
* Stage 4: Production Bundle Compilation (`npm run build`)
* Stage 5: Full-Stack Integration, CORS & Resilience (`npm run test:stage5`)

---

## REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/health` | GET | Server health and uptime status |
| `/api/auth/demo-login` | POST | Role-based login switcher (HR Director, Manager, Employee) |
| `/api/employees` | GET | Paginated, filtered, and searchable employee roster |
| `/api/employees/:id` | GET | Detailed employee profile with dynamic recommendations |
| `/api/employees` | POST | Create new employee profile |
| `/api/employees/:id` | PUT | Update employee details or performance metrics |
| `/api/employees/:id` | DELETE | Delete employee profile |
| `/api/performance/:id/metrics` | PUT | Calibrate and recalculate 5-axis employee KPIs |
| `/api/performance/:id/tasks` | POST | Assign new project task to employee |
| `/api/performance/:id/tasks/:taskId` | PUT | Update task completion status and recalculate rate |
| `/api/analytics/dashboard` | GET | Executive KPI metrics, department analytics, and trends |
| `/api/insights` | GET | Diagnostic alerts, attendance warnings, and suggestions |
| `/api/reports/monthly` | GET | Structured monthly summary dataset for PDF export |
| `/api/reports/seed/reset` | POST | Restore baseline 15-employee demo dataset |

---

## Deployment Instructions

### Frontend (Vercel):
* Connect GitHub repository to Vercel.
* Root Directory: `frontend`
* Build Command: `npm run build`
* Output Directory: `dist`
* Routing handled by `frontend/vercel.json`.

### Backend (Render):
* Create a Web Service on Render from the GitHub repository.
* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`
* Optional: set `MONGODB_URI` environment variable for MongoDB Atlas cloud cluster.
