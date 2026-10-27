# HR Hub - Enterprise HR Analytics & Workforce Operations Platform

HR Hub is a full-stack human resources analytics, performance management, and workforce operations web application. Engineered as an executive demonstration platform, it provides role-based workspaces for HR Directors, Engineering Managers, and Employees with real-time KPI simulation, automated leave workflows, help desk ticketing, onboarding management, and document archiving.

* Repository: https://github.com/Shron03/HR-Hub
* Intended Purpose: Portfolio demonstration and evaluation of defensive full-stack HR platform architecture.

---

## Architectural Highlights

* Role-Based Access Control (RBAC):
  * HR Director: Administrative control across employee roster, salary/compensation calibration, designation updates, leave approval queues, user registration approvals, and direct appraisal notes.
  * Engineering Manager: Team oversight, timesheet approvals, performance metric calibration, and organization tree navigation.
  * Employee Self-Service: Dedicated portal for personal scorecard, task throughput tracking, leave application submission, support ticket creation, and appraisal feedback inbox. Peer employee salaries and private documents are protected from unauthorized view.

* Real-Time KPI Simulator & Analytics Engine:
  * Dynamic weighted scoring: Task Completion Rate (40%), HR Review Score (40%), Attendance Compliance Rate (20%).
  * Exact decimal review score tuner (0.0 to 10.0 scale, 0.1 increments).
  * Automated performance band categorization: Exceptional (92%+), Strong Performer (82-91%), Meets Expectations (70-81%), Needs Improvement (60-69%), Critical Attention (<60%).

* Workforce Operations Modules:
  * Time Off & Leave Management: Automated presence sync transitioning approved employees to "On Leave".
  * Help Desk & Support Tickets: Multi-category support tickets with HR resolution replies.
  * Onboarding & Offboarding: Structured checklist trackers with dynamic progress recalculation.
  * Corporate Document Repository: Categorized document catalog with download tracking and access policies.
  * Timesheet & Project Tracking: Time log submissions with Engineering Manager approval queues.

---

## Security Architecture & Defensive Controls

1. Server-Side JWT Authentication:
   * All API routes (except public login, registration, and health check) require a verified cryptographic JSON Web Token (`Authorization: Bearer <token>`).
   * Token claims include user ID, verified role, email, and associated employee ID.
   * `JWT_SECRET` is strictly required in production; the server refuses to boot if the secret is omitted. In development mode, an ephemeral random 32-byte secret is generated per process run without static hardcoded fallbacks.

2. Strict Role-Based Authorization:
   * Administrative routes (`/api/employees/clear-all`, `/api/employees/seed-demo`, `/api/employees`, `/api/reports/seed/reset`, `/api/auth/registrations/:id/approve`) require the `HR Director` role.
   * Leave approvals are restricted exclusively to the `HR Director`. Client-supplied role claims are completely ignored.
   * Timesheet and ticket approvals are restricted to `HR Director` and `Engineering Manager`.

3. Broken Object-Level Authorization (BOLA/IDOR) Defense:
   * Regular employees querying tickets, timelogs, or feedback are strictly scoped to their own `employeeId`.
   * Cross-employee requests for private appraisal feedback are rejected with `403 Forbidden`.
   * Salary and compensation breakdown fields are automatically redacted when employees view colleague profiles.

4. Registration Privilege Escalation Prevention:
   * Public registration ignores any client-supplied role parameter and forces the role to `Employee`.
   * New accounts default to `approvalStatus: 'Pending'` and are blocked from login until an HR Director authorizes access.

5. Database Safety in Production:
   * In production (`NODE_ENV=production`), `MONGODB_URI` is required. The system will fail fast rather than silently falling back to an in-memory database to prevent unintended data loss.
   * Destructive purge operations are guarded by `ENABLE_DESTRUCTIVE_OPERATIONS`.

6. Network Hardening & Rate Limiting:
   * Configurable CORS allowlist (`CLIENT_URL`) restricts external cross-origin requests.
   * Strict rate limiting is applied to `/api/auth/login`, `/api/auth/register`, and `/api/auth/demo-login` to prevent credential stuffing and brute-force attempts.
   * Production error handlers suppress stack traces and internal runtime paths.

7. Synthetic Demo Data Notice:
   * All employee records, names, phone numbers, and compensation numbers in the seed dataset are entirely synthetic and generated for demonstration purposes.

---

## Technical Specifications

* Frontend:
  * React.js 19 with Vite bundler
  * Tailwind CSS v4 (Glassmorphic light theme, semi-transparent frosted cards)
  * Chart.js 4.5 and React-Chartjs-2 (6-month line trajectories, radar benchmarking, doughnuts)
  * jsPDF and html2canvas for vector client-side report generation
  * Lucide React icons (corporate iconography, zero emoji characters)

* Backend:
  * Node.js and Express.js (ES Modules)
  * MongoDB with Mongoose ODM (Atlas cloud connection or embedded in-memory mode)
  * JSON Web Token (`jsonwebtoken`) and `bcryptjs` password hashing
  * `express-rate-limit` for authentication protection
  * Centralized error and security header middleware

---

## Local Setup & Development Instructions

### Prerequisites
* Node.js (version 18.0 or higher)
* npm (version 9.0 or higher)
* Optional: A local or cloud MongoDB instance (leave blank to run the embedded in-memory MongoDB engine automatically)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Shron03/HR-Hub.git
cd HR-Hub

# Install dependencies for both backend and frontend
npm run install:all
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
# On Windows PowerShell:
Copy-Item backend\.env.example backend\.env
Copy-Item .env.example .env
```

Key environment variables in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=replace_with_a_secure_random_key_min_32_characters
MONGODB_URI=
ALLOW_IN_MEMORY_DB=false
CLIENT_URL=http://localhost:5173,http://localhost:5000
ENABLE_DESTRUCTIVE_OPERATIONS=false
```

### 3. Run Verification Tests
```bash
# Run complete test verification suite:
npm run test:all

# Or run individual verification suites:
npm run test:security  # 14 security & authorization tests
npm run test:backend   # API integration tests
npm run test:stage2    # Database persistence & task management
npm run test:stage3    # KPI math precision & boundary conditions
npm run test:stage5    # Concurrent load & resilience
npm run test:stage6    # User registration approvals & notifications
npm run test:stage7    # Enterprise help desk, onboarding, documents & time logs
```

### 4. Start Development Servers
Start backend and frontend in separate terminals:

Terminal 1 (Backend API):
```bash
npm run start:backend
```

Terminal 2 (Frontend Client):
```bash
npm run start:frontend
```

* Frontend Portal: http://localhost:5173
* Backend API: http://localhost:5000
* Server Health Check: http://localhost:5000/health

---

## API Routes Reference

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public (Rate Limited) | Authenticate user credentials and return JWT |
| `POST` | `/api/auth/demo-login` | Public (Rate Limited) | Fast demo authentication for evaluation |
| `POST` | `/api/auth/register` | Public (Rate Limited) | Submit registration (queued for HR approval) |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/auth/registrations/pending` | HR Director | Retrieve pending account registrations |
| `PUT` | `/api/auth/registrations/:id/approve` | HR Director | Approve registration and provision employee |
| `PUT` | `/api/auth/registrations/:id/reject` | HR Director | Reject pending registration |
| `GET` | `/api/employees` | Authenticated | Retrieve workforce directory (peer salary redacted for employees) |
| `GET` | `/api/employees/:id` | Authenticated | Retrieve individual profile with recommendations |
| `POST` | `/api/employees` | HR Director | Create a new employee record |
| `PUT` | `/api/employees/:id` | HR Director | Update role, salary, department, or presence |
| `DELETE` | `/api/employees/:id` | HR Director | Delete employee profile |
| `POST` | `/api/employees/seed-demo` | HR Director | Load 15-employee baseline demo dataset |
| `POST` | `/api/employees/clear-all` | HR Director (Guarded) | Purge employee records |
| `PUT` | `/api/performance/:id/metrics` | HR Director / Manager | Recalculate employee performance metrics |
| `POST` | `/api/performance/:id/tasks` | HR Director / Manager | Assign sprint task |
| `PUT` | `/api/performance/:id/tasks/:taskId` | Authenticated (Self/Mgr/HR) | Update task completion status |
| `GET` | `/api/leaves` | Authenticated | Retrieve leaves (scoped to self for employees) |
| `POST` | `/api/leaves` | Authenticated | Submit time off request |
| `PUT` | `/api/leaves/:id/status` | HR Director | Approve or decline leave request |
| `GET` | `/api/tickets` | Authenticated | Retrieve help desk tickets (scoped to self for employees) |
| `POST` | `/api/tickets` | Authenticated | Submit a support ticket |
| `PATCH` | `/api/tickets/:id/status` | HR Director / Manager | Resolve or update ticket status |
| `GET` | `/api/timelogs` | Authenticated | Retrieve timesheet logs (scoped to self for employees) |
| `POST` | `/api/timelogs` | Authenticated | Submit hours worked |
| `PATCH` | `/api/timelogs/:id/status` | HR Director / Manager | Approve timesheet submission |
| `GET` | `/api/documents` | Authenticated | Browse corporate document repository |
| `POST` | `/api/documents` | HR Director | Publish corporate policy document |
| `GET` | `/api/onboarding` | HR Director / Manager | Retrieve onboarding/offboarding workflows |
| `POST` | `/api/onboarding` | HR Director | Initiate onboarding or offboarding case |
| `GET` | `/api/reports/monthly` | HR Director / Manager | Compile monthly organizational report |
| `GET` | `/api/analytics/dashboard` | Authenticated | Aggregate workforce performance metrics |
| `GET` | `/api/insights` | Authenticated | Generate automated diagnostic suggestions |
| `GET` | `/health` | Public | System status and uptime monitor |

---

## Demo Accounts & Role Permissions

The platform includes switchable demo accounts for portfolio exploration:

* **HR Director** (`hr@hrhub.in` / `password123`)
  * Full administrative governance across all workforce modules.
  * Can modify salaries, approve leaves, authorize user registrations, and publish documents.

* **Engineering Manager** (`manager@hrhub.in` / `password123`)
  * Departmental supervision across Engineering team members.
  * Can assign tasks, tune metrics, review timesheets, and resolve support tickets.
  * Cannot modify salaries or approve leave requests.

* **Employee** (`aarav@hrhub.in` / `password123`)
  * Self-service access to personal scorecard, attendance, and task list.
  * Can apply for leave, submit timesheets, and raise tickets.
  * Cannot access other employees' tickets, timesheets, feedback, or salary figures.

---

## Known Demo Limitations & Considerations

1. In-Memory Database Persistence:
   * When running without an external `MONGODB_URI`, the server uses `mongodb-memory-server`. Any new records or metric updates persist across page reloads during the process runtime, but reset when the backend process restarts.
   * For persistent deployments, configure `MONGODB_URI` pointing to MongoDB Atlas.

2. Free Cloud Tier Spin-Down:
   * When deployed on free cloud instances (e.g., Render free tier), the container may spin down after inactivity. The first request may experience a 30 to 50 second cold-start delay while the instance initializes.

3. Client-Side Document Generation:
   * Executive PDF reports are compiled in-browser using vector coordinate layout. Very large datasets exceeding 1,000 employees should be exported as CSV for spreadsheet processing.
