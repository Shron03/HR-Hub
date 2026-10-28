# HR Hub - Enterprise HR Analytics & Workforce Operations Platform

HR Hub is a full-stack human resources analytics, performance management, and workforce operations web application. Engineered as an executive demonstration platform, it provides role-based workspaces for HR Directors, Engineering Managers, and Employees with real-time KPI simulation, automated leave workflows, help desk ticketing, onboarding management, and document archiving.

* Repository: https://github.com/Shron03/HR-Hub
* Intended Purpose: Portfolio demonstration and evaluation of defensive full-stack HR platform architecture.

---

## Architectural Highlights

### Two-Tier Experience: Public Interactive Demo vs. Registered Accounts

HR Hub provides two distinct, architecturally separated experiences:

1. **Public Interactive Demo (Zero Registration Required)**
   * Instant Visitor Onboarding: Visitors can enter the demonstration immediately without creating an account or providing credentials.
   * Isolated Demo Workspaces: Every visitor receives an independent workspace identified by an unguessable session token (`demo-*`). Visitor edits, additions, and deletions are strictly isolated from other visitors and from the registered database.
   * Safe Instant Role Switching: Visitors can switch freely between three roles in the top navigation bar to explore the application from different perspectives:
     * **HR Director:** Full administrative capabilities within the visitor's isolated workspace (add/edit/delete synthetic employees, calibrate salaries and KPIs, approve leaves, manage onboarding, publish policy documents).
     * **Engineering Manager:** Manager-level capabilities (team supervision, timesheet approvals, performance metric calibration).
     * **Employee:** Employee self-service capabilities (personal scorecard, leave applications, support tickets, timesheet logs).
   * Workspace Persistence & Reset: A visitor's modifications persist within their workspace across browser reloads. The "Reset Demo" button instantly restores only that visitor's workspace to the baseline 15-employee synthetic dataset without affecting other visitors or registered users.
   * Automatic TTL Cleanup: Demo workspaces that are inactive for more than 7 days are automatically pruned via MongoDB TTL indexing.

2. **Registered Accounts (Separate Protected Production Experience)**
   * Dedicated registered database scope (`workspaceId: 'registered'`).
   * Standard cryptographic JWT authentication with password hashing (`bcryptjs`).
   * Registration Approval Queue: Public self-registrations default to the `Employee` role with `approvalStatus: 'Pending'` and require explicit authorization by a registered HR Director before system access is granted.
   * Complete Privilege Separation: Demo tokens cannot access registered administrative routes (e.g. pending registrations or registered employee account management). Registered accounts cannot be reset via public demo controls.

---

## Real-Time KPI Simulator & Operations Modules

* Dynamic Weighted Scoring:
  * Task Completion Rate (40%)
  * HR Review Score (40%)
  * Attendance Compliance Rate (20%)
* Exact decimal review score tuner (0.0 to 10.0 scale, 0.1 increments).
* Automated performance band categorization:
  * Exceptional (92%+)
  * Strong Performer (82-91%)
  * Meets Expectations (70-81%)
  * Needs Improvement (60-69%)
  * Critical Attention (<60%)
* Workforce Operations Modules:
  * Time Off & Leave Management: Automated presence sync transitioning approved employees to "On Leave".
  * Help Desk & Support Tickets: Multi-category support tickets with HR resolution replies.
  * Onboarding & Offboarding: Structured checklist trackers with dynamic progress recalculation.
  * Corporate Document Repository: Categorized document catalog with download tracking and access policies.
  * Timesheet & Project Tracking: Time log submissions with Engineering Manager approval queues.

---

## Security Architecture & Defensive Controls

1. Server-Side Scoping & Workspace Isolation:
   * Every database read, write, update, delete, aggregate, and notification is strictly filtered by `{ workspaceId }`.
   * Cross-tenant access attempts are rejected at the database query level.

2. Server-Side JWT Authentication & Role Verification:
   * All protected endpoints require a verified cryptographic JSON Web Token (`Authorization: Bearer <token>`).
   * Token claims include user ID, verified role, email, employee ID, and workspace ID. Client-supplied role claims are never trusted.
   * `JWT_SECRET` is strictly loaded via `dotenv/config` at application launch. In development mode, an ephemeral 256-bit secret is generated per process run if omitted.

3. Strict Role-Based Authorization (RBAC):
   * Administrative routes require the `HR Director` role.
   * Leave approvals are restricted exclusively to `HR Director`.
   * Timesheet approvals are restricted to `HR Director` and `Engineering Manager`.
   * Sensitive real-user registration approvals require a registered account (`requireRegisteredUser`); demo HR Director tokens receive `403 Forbidden`.

4. Broken Object-Level Authorization (BOLA/IDOR) Defense:
   * Regular employees querying tickets, timelogs, or feedback are strictly scoped to their own `employeeId`.
   * Cross-employee requests for private appraisal feedback are rejected with `403 Forbidden`.
   * Salary and compensation breakdown fields are automatically redacted when employees view colleague profiles.

5. Document Access Policy Enforcement:
   * Server-side filtering ensures regular employees can only access documents marked "All Employees".
   * Documents marked "Management Only" or "Confidential" are completely hidden from regular employees.

6. Registration Privilege Escalation Prevention:
   * Public registration ignores client-supplied role parameters and forces the role to `Employee`.
   * New accounts default to `approvalStatus: 'Pending'` and are blocked from login until authorized by an HR Director.

7. Database Safety & CORS Hardening:
   * Configurable CORS allowlist (`CLIENT_URL`) with automatic support for Render (`*.onrender.com`) and Vercel (`*.vercel.app`) preview deployments.
   * Rate limiting on authentication and demo session endpoints prevents resource exhaustion.
   * Production error handlers suppress stack traces and internal paths.

8. Synthetic Demo Data Notice:
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
ALLOW_IN_MEMORY_DB=true
CLIENT_URL=http://localhost:5173,http://localhost:5000
ENABLE_DESTRUCTIVE_OPERATIONS=false
```

### 3. Run Automated Regression Test Suites
```bash
# Run all test suites (Demo Isolation + Security Hardening):
npm run test:all

# Or run individual test suites:
npm run test:isolation  # 12 demo workspace isolation & role switching tests
npm run test:security   # 14 security & authorization tests
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
| `POST` | `/api/demo/session` | Public (Rate Limited) | Create or resume isolated visitor demo workspace |
| `POST` | `/api/demo/switch-role` | Authenticated (Demo) | Switch role instantly within visitor demo workspace |
| `POST` | `/api/demo/reset` | Authenticated (Demo) | Reset visitor workspace back to baseline synthetic data |
| `POST` | `/api/auth/login` | Public (Rate Limited) | Authenticate registered user credentials and return JWT |
| `POST` | `/api/auth/demo-login` | Public (Rate Limited) | Backward-compatible entrypoint to demo session |
| `POST` | `/api/auth/register` | Public (Rate Limited) | Submit registration (queued for HR approval) |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/auth/registrations/pending` | HR Director (Registered) | Retrieve pending account registrations |
| `PUT` | `/api/auth/registrations/:id/approve` | HR Director (Registered) | Approve registration and provision employee |
| `PUT` | `/api/auth/registrations/:id/reject` | HR Director (Registered) | Reject pending registration |
| `GET` | `/api/employees` | Authenticated | Retrieve workforce directory (peer salary redacted for employees) |
| `GET` | `/api/employees/:id` | Authenticated | Retrieve individual profile with recommendations |
| `POST` | `/api/employees` | HR Director | Create a new employee record |
| `PUT` | `/api/employees/:id` | HR Director | Update role, salary, department, or presence |
| `DELETE` | `/api/employees/:id` | HR Director | Delete employee profile |
| `POST` | `/api/employees/seed-demo` | HR Director | Re-seed active workspace baseline dataset |
| `POST` | `/api/employees/clear-all` | HR Director (Guarded) | Purge employee records in active workspace |
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
| `GET` | `/api/documents` | Authenticated | Browse corporate document repository (access policy enforced) |
| `POST` | `/api/documents` | HR Director | Publish corporate policy document |
| `GET` | `/api/onboarding` | HR Director / Manager | Retrieve onboarding/offboarding workflows |
| `POST` | `/api/onboarding` | HR Director | Initiate onboarding or offboarding case |
| `GET` | `/api/reports/monthly` | HR Director / Manager | Compile monthly organizational report |
| `GET` | `/api/analytics/dashboard` | Authenticated | Aggregate workforce performance metrics |
| `GET` | `/api/insights` | Authenticated | Generate automated diagnostic suggestions |
| `GET` | `/health` | Public | System status and uptime monitor |

---

## Known Demo Considerations

1. In-Memory Database Mode:
   * When running without an external `MONGODB_URI`, the server uses `mongodb-memory-server`. Any new records or metric updates persist across page reloads during the process runtime, but reset when the backend process restarts.
   * For persistent deployments, configure `MONGODB_URI` pointing to MongoDB Atlas.

2. Free Cloud Tier Spin-Down:
   * When deployed on free cloud instances (e.g., Render free tier), the container may spin down after inactivity. The first request may experience a 30 to 50 second cold-start delay while the instance initializes.

3. Client-Side Document Generation:
   * Executive PDF reports are compiled in-browser using vector coordinate layout. Very large datasets exceeding 1,000 employees should be exported as CSV for spreadsheet processing.
