# PulseGrid — Autonomous Build Prompt for Antigravity IDE

> **Copy everything below this line into Antigravity as a single build instruction.**
> This prompt is written to be executed **end-to-end, autonomously, with zero follow-up debugging required.** Every ambiguity has been pre-resolved. Do not ask clarifying questions — where a decision is needed and not specified, default to the choice documented in this file.

---

## 0. Identity & Branding

| Field | Value |
|---|---|
| **Product name** | **PulseGrid** |
| **Tagline** | *"The heartbeat of your campus, in one grid."* |
| **GitHub repo (slug)** | `pulsegrid` |
| **Alternate/verbose slug (if `pulsegrid` is taken)** | `pulsegrid-sims` |
| **Package name (`package.json`)** | `@pulsegrid/app` |
| **Primary domain metaphor** | A living dashboard — data pulses in real time across attendance, fees, timetable, and alerts, visualized as a "grid" of modular cards. |
| **Brand voice** | Calm, precise, operational — never cutesy. Copy speaks like a campus-ops system of record, not a consumer toy. |
| **License** | MIT |

Create the repository with this exact structure for the README badge row: build status, license, TypeScript, Next.js, Vercel deployment — all as shields.io badges. The README title must read `# PulseGrid` with the tagline as a subtitle italic line directly beneath it.

---

## 1. Mission Statement

Build **PulseGrid**, a production-grade, mobile-first Mini Student Information Management System (Mini-SIMS) Portal. It unifies four operational modules — **Attendance**, **Fees**, **Timetable**, and **Notifications/Alerts** — into a single role-aware dashboard for school administrators, teachers, and students. The system must demonstrate senior-level (10+ years) front-end and full-stack engineering discipline: strict typing, resilient error handling, optimistic UI with rollback, accessibility compliance, and full test coverage on all business logic.

This is a **portfolio-grade flagship project**. Treat every decision — architecture, naming, spacing, copy — as something that will be scrutinized by a senior engineering hiring panel.

---

## 2. Non-Negotiable Engineering Standards

1. **TypeScript strict mode** (`strict: true`, `noUncheckedIndexedAccess: true`) across the entire codebase. No `any` types. No `@ts-ignore` except with a comment justifying it and a linked issue.
2. **Zero console errors/warnings** in dev or prod builds.
3. **Zero ESLint errors**, zero unused variables/imports, zero dead code.
4. **100% of PR-blocking CI checks must pass before the build is considered "done":** typecheck, lint, unit tests, integration tests, build.
5. **No placeholder content, no `TODO` comments, no `lorem ipsum`** anywhere in the final deliverable. Every screen must render with realistic seed data.
6. **No debugging required post-handoff.** Before declaring the project complete, run the full verification checklist in Section 14 and fix every failure yourself.
7. **Mobile-first, always.** Every component is designed and built starting at a 360px viewport and progressively enhanced upward. Nothing may be designed desktop-first and "made responsive" after the fact.

---

## 3. Tech Stack (Exact Versions — Do Not Substitute)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Use Server Components by default; Client Components only where interactivity requires it (`"use client"` explicitly justified per file). |
| Language | **TypeScript 5.x** | Strict mode per Section 2. |
| Styling | **Tailwind CSS 4** | Config-driven design tokens — see Section 6. No inline styles except for dynamically computed values (e.g., chart colors). |
| Component primitives | **shadcn/ui** (Radix-based) | For accessible primitives (dialog, dropdown, tabs, toast) only — every visual surface is re-skinned per Section 6, never left in default shadcn styling. |
| State (global/app) | **Redux Toolkit** | Slices: `attendanceSlice`, `financeSlice`, `scheduleSlice`, `notificationsSlice`, `authSlice`, `uiSlice`. |
| Server-state / caching | **TanStack Query v5** | Wraps all Axios calls; handles caching, retries, background refetch, and optimistic updates in tandem with Redux for UI-only state. |
| HTTP client | **Axios** | Central `apiClient.ts` with interceptors for auth headers, error normalization, and request/response logging (dev only). |
| Mock backend | **JSON Server** (`db.json`) run via `concurrently` alongside `next dev` | Seed with realistic data per Section 8. |
| Forms | **React Hook Form + Zod** | Every form has a Zod schema; validation errors surface inline, never via `alert()`. |
| Charts | **Recharts** | Attendance and fee trend visualizations. |
| PDF export | **html2pdf.js** (receipts) | Section 8.2. |
| Dates | **date-fns** | No moment.js. |
| Icons | **lucide-react** | |
| Testing (unit/integration) | **Vitest + React Testing Library** | |
| Testing (E2E) | **Playwright** | Mobile viewport emulation required (see Section 12). |
| Linting/formatting | **ESLint (next/core-web-vitals + typescript) + Prettier** | Pre-commit hook via Husky + lint-staged. |
| CI/CD | **GitHub Actions** → **Vercel** | Pipeline defined in Section 13. |
| Package manager | **pnpm** | Lockfile committed. |

---

## 4. Roles & Access Model

Three roles, seeded as demo accounts (documented in README, never hardcoded credentials in source — use seeded `db.json` users with hashed mock passwords):

- **Admin** — full access to all modules, all students, approval workflows.
- **Teacher** — attendance marking for assigned classes, timetable view, notifications (read + post to their classes only).
- **Student** — read-only dashboard scoped to their own attendance, fees, timetable, and notifications.

Implement route protection via a `middleware.ts` that checks a mock session cookie and redirects unauthenticated/unauthorized users to `/login` or a 403 page — never a blank screen or silent failure.

---

## 5. Information Architecture (Route Map)

```
/                          → redirect to /login or /dashboard based on session
/login                     → auth screen (role-based demo login selector)
/dashboard                 → role-aware overview grid (the "pulse" home)
/attendance                → attendance module (list/mark/audit)
/attendance/[classId]      → per-class register
/fees                      → fee summary, invoices, payment history
/fees/[invoiceId]          → invoice detail + receipt (PDF export)
/timetable                 → weekly grid view with conflict indicators
/notifications             → announcement feed, filters, admin composer
/settings/profile          → user profile (mobile-first single column)
/403                       → access-denied state
/404                       → not-found state
/offline                   → PWA offline fallback (see Section 11)
```

Every route must have: a loading skeleton state, an empty state, and an error boundary — see Section 9.4.

---

## 6. Design System (Token Spec — Follow Exactly)

**Design direction:** Operational-calm, data-dense-but-legible, inspired by aviation cockpit displays and modern fintech dashboards — *not* a generic SaaS "cream + terracotta" template, and *not* a dark neon dashboard cliché. PulseGrid should feel like an instrument panel: precise, legible under pressure, quietly confident.

### 6.1 Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--pg-ink` | `#10131A` | Primary text, headers |
| `--pg-paper` | `#F6F7F5` | App background (light, cool-neutral — not warm cream) |
| `--pg-surface` | `#FFFFFF` | Card surfaces |
| `--pg-line` | `#E1E4E1` | Hairline borders/dividers |
| `--pg-signal-blue` | `#1D4ED8` | Primary actions, links, active states |
| `--pg-pulse-teal` | `#0F9D8C` | Positive/present/paid states, the signature accent |
| `--pg-alert-amber` | `#C77D14` | Warnings, upcoming due dates |
| `--pg-risk-red` | `#C0362C` | Absent/overdue/at-risk states |
| `--pg-muted` | `#6B7280` | Secondary text, captions |

Dark mode: derive a parallel token set (`--pg-ink-dark: #F6F7F5`, `--pg-paper-dark: #0B0D10`, `--pg-surface-dark: #14171C`, accents unchanged for consistency) and implement via `next-themes` with a persisted toggle in the top nav.

### 6.2 Typography

- **Display/Headings:** `Space Grotesk` (600/700) — carries the "instrument panel" precision.
- **Body:** `Inter` (400/500) — high legibility at small sizes for dense data tables.
- **Numeric/data (grids, GPA, currency):** `IBM Plex Mono` (500) with tabular-nums — every number in the app (attendance %, currency, GPA) uses this face so figures always align in columns.

Type scale (mobile base, rem): `12/14/16/18/22/28/34` — no arbitrary sizes outside this scale anywhere in the app.

### 6.3 Layout & Signature Element

- **Grid system:** CSS Grid-based "card grid" on `/dashboard` — 1 column on mobile (< 640px), 2 columns tablet (≥ 640px), 3–4 columns desktop (≥ 1024px). This card grid **is the signature element** the whole product is named after — every module surfaces a summary card into this grid, and tapping a card is the primary navigation gesture on mobile.
- **Border radius:** `8px` on cards, `6px` on inputs/buttons — sharp enough to feel operational, not bubbly.
- **Shadows:** flat elevation only (`0 1px 2px rgba(16,19,26,0.06)`), no soft glow/blur-heavy shadows.
- **Spacing scale:** 4px base unit (`4/8/12/16/24/32/48/64`).
- **Motion:** one orchestrated page-load stagger for the dashboard cards (120ms stagger, 200ms ease-out), micro-interactions on tap/hover (scale 0.98 on press), respect `prefers-reduced-motion` everywhere — disable stagger and scale transforms when set.

### 6.4 Mobile-First Interaction Rules

- Minimum tap target: **44×44px**.
- Primary navigation is a **bottom tab bar** on mobile (Dashboard / Attendance / Fees / Timetable / Notifications), converting to a **left sidebar** at ≥ 1024px.
- All tables (attendance registers, fee history) convert to **stacked card rows** below 640px — never horizontally scrolling tables as the default mobile pattern.
- Forms are single-column, full-width inputs, sticky submit button on mobile.
- Modals become full-screen sheets on mobile (slide-up), centered dialogs on desktop.

---

## 7. Module-by-Module Feature Spec

### 7.1 Dashboard (`/dashboard`)
- Role-aware summary cards: Fees Due, Attendance Rate (7-day), Next Class, Unread Notifications, **Risk Alerts** (admin/teacher only).
- Empty state per card if no data (e.g., "No classes scheduled today").
- Skeleton loaders matching final card layout exactly (no layout shift on data arrival).

### 7.2 Attendance Module
- Mark Present/Absent/Late per student per class session, with optimistic UI (instant toggle, rollback + inline error toast on failed mock request).
- Audit log: every attendance change records `{ studentId, prevStatus, newStatus, changedBy, timestamp }`, visible in an admin-only audit drawer.
- Daily summary counts (present/absent/late) computed client-side and memoized.
- **Edge cases to handle explicitly:**
  - Marking attendance for a class with zero enrolled students → show explicit empty state, disable submit.
  - Duplicate submission (double-tap) → debounce + disable button during in-flight request.
  - Marking attendance for a future date → blocked with inline validation message.
  - Network failure mid-toggle → optimistic state reverts, toast reads: *"Couldn't save — attendance reverted. Check your connection and try again."*

### 7.3 Fees Module
- Fee summary (paid/outstanding/overdue), transaction history, mock payment form (Zod-validated), PDF receipt generation via `html2pdf.js`.
- Currency formatting via `Intl.NumberFormat` — **never** hand-rolled string concatenation for money.
- **Edge cases:** zero-balance state ("All fees settled — nothing due"), overdue items visually distinct (`--pg-risk-red` left border on stacked card), partial payments correctly reduce balance and log a transaction line, PDF generation failure shows a retry affordance rather than a silent no-op.

### 7.4 Timetable Module
- Weekly grid (mobile: swipeable day-by-day view with day-tabs; desktop: full week grid).
- Conflict indicators (overlapping sessions) computed via interval-overlap comparison, tested with unit tests covering adjacent-but-not-overlapping, fully-overlapping, and partial-overlap cases.
- **Edge cases:** empty day ("No classes today — enjoy the break"), single-session day, back-to-back sessions with zero gap (must not be flagged as a conflict — boundary condition explicitly unit-tested).

### 7.5 Notifications / Digital Noticeboard
- Category filters (Academic/Events/General), timestamped feed, admin composer (role-gated).
- Auto-refresh via TanStack Query background refetch (30s interval) — **not** a naive `setInterval` that leaks on unmount; must be cleaned up correctly and paused when tab is backgrounded (`document.visibilitychange`).
- **Edge cases:** empty feed, extremely long announcement text (truncate with "Read more" expand, never overflow layout), rapid successive posts (list must not jump/reflow jarringly — use stable keys).

### 7.6 AI-Powered Feature — Risk Scoring (Required)
Implement **both** tiers, toggleable via an environment flag (`NEXT_PUBLIC_AI_MODE=rule|api`):
- **Rule-based (default, must work fully offline):** weighted score = `(1 - attendanceRate) * 0.5 + (overdueFeeRatio) * 0.3 + (latenessRate) * 0.2`, bucketed into Low/Medium/High risk tiers with explicit thresholds documented in code comments and covered by unit tests at each boundary.
- **API-integrated (optional path):** a typed `getRiskInsight()` service function with a clean interface, mocked in tests via MSW, gracefully falling back to the rule-based tier if the call fails or times out (3s timeout, one retry, then fallback — never a hung UI).

---

## 8. Data Model & Mock API Contract

Define TypeScript interfaces in `types/` for: `User`, `Student`, `ClassSession`, `AttendanceRecord`, `Invoice`, `Transaction`, `Announcement`, `RiskScore`. Every field explicitly typed, no optional-everything — mark fields required unless genuinely optional in the domain.

`db.json` (JSON Server) must be seeded with **realistic, internally consistent data**: at minimum 25 students, 6 classes, 8 weeks of attendance history (including gaps/absences to exercise risk scoring), a mix of paid/overdue invoices, and 15+ announcements across all three categories. Data must be consistent — a student marked "overdue" in fees must actually have an invoice past its due date in the seed, etc.

REST endpoints (JSON Server default conventions): `GET/POST/PATCH /students`, `/classSessions`, `/attendanceRecords`, `/invoices`, `/transactions`, `/announcements`. Document the full contract in `docs/API.md`.

---

## 9. Resilience, Errors & Edge States (Apply Globally)

1. **Every async boundary** (route segment, data-fetching component) has: a loading skeleton, an empty state, and an error boundary with a retry button. No bare spinners with no context, no unhandled promise rejections.
2. **Network offline detection** via `navigator.onLine` + online/offline event listeners — show a persistent, dismissible banner, and queue non-critical writes (attendance toggles) for retry on reconnect.
3. **Form validation** is always inline and field-level (Zod + RHF resolver) — never a top-of-page error dump disconnected from the offending field.
4. **Toast system** (`sonner` or shadcn `toast`) for all async success/failure feedback — copy follows the voice rules in Section 6 (state what happened, state the fix, never apologize, active voice matching the triggering action).
5. **Session expiry** mid-session (mock 401) → redirect to `/login` with a preserved "continue where you left off" return URL, not a silent logout.
6. **Slow network simulation** — Axios interceptor supports an artificial delay env var for manual QA of loading states; Playwright tests explicitly assert skeletons render before data.
7. **Malformed/missing seed data** — every list-rendering component guards against `undefined`/empty arrays and renders the defined empty state rather than crashing (`noUncheckedIndexedAccess` will surface most of these at compile time — treat every resulting compiler error as a real edge case to design for, not a type to silence).

---

## 10. Accessibility (WCAG 2.1 AA — Mandatory)

- Full keyboard navigation: every interactive element reachable and operable via keyboard, visible focus rings using `--pg-signal-blue` at 2px offset outline (never `outline: none` without a replacement).
- Correct semantic HTML and ARIA roles on all custom components (tabs, dialogs, toasts use Radix primitives specifically because they ship correct ARIA behavior).
- Color is never the sole indicator of state — risk/status colors are always paired with an icon or text label (e.g., red dot **and** the word "Overdue").
- All images/icons have `alt` text or `aria-hidden` if purely decorative.
- Color contrast: verify every text/background pair against the token set in Section 6.1 meets 4.5:1 (body) / 3:1 (large text) — adjust any token that fails before build completion.
- `prefers-reduced-motion` respected everywhere motion is used (Section 6.3).

---

## 11. Performance & PWA

- Target Lighthouse scores (mobile): **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90.**
- Route-level code splitting via Next.js defaults; heavy chart/PDF libraries dynamically imported (`next/dynamic`) and only loaded on the routes that need them.
- Images via `next/image` with explicit `sizes` for responsive loading.
- Add a minimal PWA manifest + service worker (via `next-pwa` or manual) providing an `/offline` fallback page — this is a mobile-first product and should behave gracefully on a flaky connection.
- Memoize expensive derived calculations (attendance aggregates, conflict detection, risk scores) with `useMemo`/`reselect` selectors — no recomputation on every render.

---

## 12. Testing Strategy (Required Before "Done")

| Layer | Tool | Coverage requirement |
|---|---|---|
| Unit — business logic | Vitest | 100% of pure functions in `lib/` (GPA/risk/conflict math, currency formatting, date utilities) — this logic is money- and grade-adjacent, it must be bulletproof. |
| Unit — components | Vitest + RTL | All shared UI components (`components/ui`, `components/shared`) render, handle empty/error/loading props correctly. |
| Integration | Vitest + RTL + MSW | Each module's primary flow (mark attendance, submit payment, post announcement) mocked at the network layer, asserting optimistic update + rollback behavior explicitly. |
| E2E | Playwright, **mobile viewport (390×844) as the primary configured project**, desktop as a secondary project | Critical paths: login → dashboard → mark attendance → view fee receipt → post announcement (admin) → logout. Assert no console errors during any flow. |
| Accessibility | `@axe-core/playwright` | Run against every route in CI; zero violations of "serious" or "critical" impact allowed. |
| Visual regression (optional but recommended) | Playwright screenshot snapshots | Dashboard, attendance table→card breakpoint transition, timetable week view. |

Minimum overall coverage gate: **85% lines / 80% branches**, enforced in CI — build fails below threshold.

---

## 13. CI/CD Pipeline (`.github/workflows/ci.yml`)

Stages, in order, any failure halts the pipeline:
1. Install (`pnpm install --frozen-lockfile`)
2. Typecheck (`tsc --noEmit`)
3. Lint (`eslint .`)
4. Unit + integration tests with coverage gate
5. Build (`next build`)
6. Playwright E2E (against the built app, `next start`)
7. Deploy preview to Vercel on PRs; deploy to production on merge to `main`

Commit convention: **Conventional Commits** (`feat:`, `fix:`, `chore:`, `test:`, `docs:`). Branch protection on `main` requires all checks green.

---

## 14. Definition of Done — Final Verification Checklist

Before considering this build complete, explicitly verify **every** item below and fix any failure — do not hand back a build with any box unchecked:

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass with zero errors/warnings.
- [ ] All routes in Section 5 render correctly at 360px, 390px, 768px, 1024px, 1440px.
- [ ] Every async view has working loading, empty, and error states — manually verified by simulating each.
- [ ] All forms reject invalid input with inline errors and accept valid input without page reload.
- [ ] Optimistic updates (attendance, notifications) roll back correctly on simulated failure.
- [ ] Lighthouse mobile scores meet Section 11 thresholds on `/dashboard` and `/attendance`.
- [ ] Axe accessibility scan is clean on every route.
- [ ] Dark mode toggle works with no unstyled/mismatched-contrast elements.
- [ ] Risk scoring produces correct tiers for boundary-value test students in seed data.
- [ ] README includes: project description, tagline, screenshots/GIF, tech stack table, local setup instructions (`pnpm i && pnpm dev`, JSON Server startup), demo login credentials for all 3 roles, and a link to the deployed Vercel URL.
- [ ] No `TODO`, `FIXME`, `console.log`, or commented-out code blocks remain in the final source.
- [ ] Git history follows Conventional Commits; final state is tagged `v1.0.0`.

---

## 15. Build Order (Execute in This Sequence)

1. Scaffold Next.js 15 + TS + Tailwind 4 project; configure ESLint/Prettier/Husky; set up `pnpm` workspace.
2. Implement design tokens (Section 6) in `tailwind.config.ts` and `globals.css`; build the core UI primitives (`Button`, `Card`, `Badge`, `Input`, `Tabs`, `Dialog`, `Toast`, `Skeleton`) themed to spec, with Storybook-free manual visual check via a temporary `/dev/ui-kit` route (delete before final commit).
3. Set up `db.json` + JSON Server + seed script; define all TypeScript domain types; build the Axios client + TanStack Query provider + Redux store shell.
4. Build auth (`/login`, `middleware.ts`, role-based route guards, `authSlice`).
5. Build the Dashboard shell (bottom tab bar / sidebar responsive nav) with empty card grid.
6. Build each module end-to-end in this order: Attendance → Fees → Timetable → Notifications — for each: data layer → UI → optimistic logic → edge cases → unit/integration tests, before moving to the next module.
7. Implement Risk Scoring service (rule-based first, API-integrated path second) and wire into Dashboard risk alert card.
8. Implement dark mode, PWA/offline shell, and performance passes (dynamic imports, image optimization).
9. Write Playwright E2E suite and axe accessibility CI job.
10. Write README, `docs/API.md`, and finalize CI workflow.
11. Run the full Section 14 checklist and fix everything before final commit and `v1.0.0` tag.

---

*End of build prompt. Execute autonomously per the above; do not deviate from the specified stack, tokens, or structure without a documented, justified reason recorded in `docs/DECISIONS.md`.*
