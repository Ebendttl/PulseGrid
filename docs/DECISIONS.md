# Architectural Decisions Log (ADR)

## ADR 1: Next.js 15 App Router & Server Components
- **Context:** Mobile-first Mini Student Information System requires instant initial loads and resilient client-side interactivity.
- **Decision:** Default to Server Components (`app/` App Router) for layout rendering, using Client Components (`"use client"`) exclusively where interactive state (Redux, React Hook Form, TanStack Query) requires it.

## ADR 2: Dual-Tier AI Risk Scoring Engine
- **Context:** Operational risk calculation must function reliably offline while offering optional server API integration.
- **Decision:** Implemented pure math rule-based weighted risk calculation `(1 - attendanceRate) * 0.5 + overdueFeeRatio * 0.3 + latenessRate * 0.2` for offline operation, wrapped in `getRiskInsight()` service with 3s timeout fallback.

## ADR 3: State Separation (Redux Toolkit vs TanStack Query)
- **Context:** UI drawer/modal state vs server entity caching.
- **Decision:** Redux Toolkit handles local UI state (drawers, active filters, role switching), while TanStack Query v5 handles server data caching, retries, and optimistic updates with cache rollback.

## ADR 4: Accessibility First & WCAG 2.1 AA
- **Context:** Instrument panel design must be accessible under intense operation.
- **Decision:** Standardized on Radix UI accessible primitives for Dialog, Tabs, and Dropdowns. Visual states always pair color with explicit icons or text labels. Min 44×44px tap targets enforced.
