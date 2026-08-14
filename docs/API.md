# PulseGrid REST API & Mock Contract Specification

PulseGrid connects to a mock REST API server running `json-server` on port `3001` (`http://localhost:3001`) during development and testing.

## Base URL
- Development API: `http://localhost:3001`
- Production / Standalone App: Configurable via `NEXT_PUBLIC_API_URL`

## Endpoints

### 1. Users (`/users`)
- `GET /users` — Returns list of all system users.
- `GET /users/:id` — Returns single user by ID.

### 2. Students (`/students`)
- `GET /students` — Returns list of all student domain records (25+ seeded).
- `GET /students/:id` — Returns single student domain record.
- `PATCH /students/:id` — Updates student risk indicators or profile details.

### 3. Class Sessions (`/classSessions`)
- `GET /classSessions` — Returns weekly scheduled classes.
- `GET /classSessions/:id` — Returns single session record.

### 4. Attendance Records (`/attendanceRecords`)
- `GET /attendanceRecords` — Query attendance history.
- `POST /attendanceRecords` — Log a new attendance record.
- `PATCH /attendanceRecords/:id` — Update existing attendance record status (optimistic UI).

### 5. Audit Logs (`/auditLogs`)
- `GET /auditLogs` — Admin-only audit trail of status changes.
- `POST /auditLogs` — Record immutable status modification event.

### 6. Invoices (`/invoices`)
- `GET /invoices` — List all student tuition & fee invoices.
- `PATCH /invoices/:id` — Update payment amount and invoice status.

### 7. Transactions (`/transactions`)
- `GET /transactions` — List fee payment transaction timeline.
- `POST /transactions` — Record new fee payment transaction.

### 8. Announcements (`/announcements`)
- `GET /announcements` — List active digital noticeboard items.
- `POST /announcements` — Post new announcement (Admin/Teacher only).

### 9. AI Risk Engine (`/api/risk`)
- `GET /api/risk?studentId=<id>` — Returns computed weighted risk score object.
