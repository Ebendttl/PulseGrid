# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> PulseGrid End-to-End Critical Flows & Accessibility >> Complete user journey: Login -> Dashboard -> Attendance -> Fees -> Notifications -> Logout
- Location: tests/e2e/e2e.spec.ts:5:3

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  [{"description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds", "help": "Elements must meet minimum color contrast ratio thresholds", "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/color-contrast?application=playwright", "id": "color-contrast", "impact": "serious", "nodes": [{"all": [], "any": [{"data": {"bgColor": "#f6f7f5", "contrastRatio": 4.49, "expectedContrastRatio": "4.5:1", "fgColor": "#6b7280", "fontSize": "9.0pt (12px)", "fontWeight": "normal", "messageKey": null}, "id": "color-contrast", "impact": "serious", "message": "Element has insufficient color contrast of 4.49 (foreground color: #6b7280, background color: #f6f7f5, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1", "relatedNodes": [{"html": "<div class=\"min-h-screen w-full flex items-center justify-center p-4 bg-pg-paper\">", "target": [".min-h-screen"]}]}], "failureSummary": "Fix any of the following:
  Element has insufficient color contrast of 4.49 (foreground color: #6b7280, background color: #f6f7f5, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1", "html": "<p class=\"text-xs text-pg-muted italic\">“The heartbeat of your campus, in one grid.”</p>", "impact": "serious", "none": [], "target": [".italic"]}, {"all": [], "any": [{"data": {"bgColor": "#e7f5f3", "contrastRatio": 3.01, "expectedContrastRatio": "4.5:1", "fgColor": "#0f9d8c", "fontSize": "9.0pt (12px)", "fontWeight": "normal", "messageKey": null}, "id": "color-contrast", "impact": "serious", "message": "Element has insufficient color contrast of 3.01 (foreground color: #0f9d8c, background color: #e7f5f3, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1", "relatedNodes": [{"html": "<div class=\"inline-flex items-ce...\">", "target": [".bg-pg-pulse-teal\\/10"]}, {"html": "<div class=\"p-4 rounded-[6px] border border-pg-line hover:border-pg-signal-blue/50 bg-pg-surface hover:bg-pg-paper/50 transition-all flex flex-col gap-2 cursor-pointer group\">", "target": [".hover\\:border-pg-signal-blue\\/50.hover\\:bg-pg-paper\\/50.transition-all:nth-child(2)"]}]}], "failureSummary": "Fix any of the following:
  Element has insufficient color contrast of 3.01 (foreground color: #0f9d8c, background color: #e7f5f3, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1", "html": "<div class=\"inline-flex items-ce...\">", "impact": "serious", "none": [], "target": [".bg-pg-pulse-teal\\/10"]}, {"all": [], "any": [{"data": {"bgColor": "#f9f2e7", "contrastRatio": 2.96, "expectedContrastRatio": "4.5:1", "fgColor": "#c77d14", "fontSize": "9.0pt (12px)", "fontWeight": "normal", "messageKey": null}, "id": "color-contrast", "impact": "serious", "message": "Element has insufficient color contrast of 2.96 (foreground color: #c77d14, background color: #f9f2e7, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1", "relatedNodes": [{"html": "<div class=\"inline-flex items-ce...\">", "target": [".bg-pg-alert-amber\\/10"]}, {"html": "<div class=\"p-4 rounded-[6px] border border-pg-line hover:border-pg-signal-blue/50 bg-pg-surface hover:bg-pg-paper/50 transition-all flex flex-col gap-2 cursor-pointer group\">", "target": [".hover\\:border-pg-signal-blue\\/50.hover\\:bg-pg-paper\\/50.transition-all:nth-child(3)"]}]}], "failureSummary": "Fix any of the following:
  Element has insufficient color contrast of 2.96 (foreground color: #c77d14, background color: #f9f2e7, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1", "html": "<div class=\"inline-flex items-ce...\">", "impact": "serious", "none": [], "target": [".bg-pg-alert-amber\\/10"]}, {"all": [], "any": [{"data": {"bgColor": "#f6f7f5", "contrastRatio": 4.49, "expectedContrastRatio": "4.5:1", "fgColor": "#6b7280", "fontSize": "9.0pt (12px)", "fontWeight": "normal", "messageKey": null}, "id": "color-contrast", "impact": "serious", "message": "Element has insufficient color contrast of 4.49 (foreground color: #6b7280, background color: #f6f7f5, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1", "relatedNodes": [{"html": "<div class=\"min-h-screen w-full flex items-center justify-center p-4 bg-pg-paper\">", "target": [".min-h-screen"]}]}], "failureSummary": "Fix any of the following:
  Element has insufficient color contrast of 4.49 (foreground color: #6b7280, background color: #f6f7f5, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1", "html": "<p class=\"text-center text-xs text-pg-muted\">PulseGrid SIMS Portal • Senior Engineering Portfolio Deliverable • MIT License</p>", "impact": "serious", "none": [], "target": [".text-center:nth-child(3)"]}], "tags": ["cat.color", "wcag2aa", "wcag143", "TTv5", "TT13.c", "EN-301-549", "EN-9.1.4.3", "ACT", "RGAAv4", "RGAA-3.2.1"]}]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: PulseGrid
      - paragraph [ref=e9]: “The heartbeat of your campus, in one grid.”
    - generic [ref=e10]:
      - generic [ref=e11]:
        - heading "Demo Access Portal" [level=3] [ref=e12]
        - paragraph [ref=e13]: Select a role below to launch the role-aware cockpit dashboard.
      - generic [ref=e14]:
        - generic [ref=e15] [cursor=pointer]:
          - generic [ref=e16]:
            - generic [ref=e22]:
              - heading "Dr. Eleanor Vance" [level=4] [ref=e23]
              - paragraph [ref=e24]: Campus Registrar & Administrator
            - generic [ref=e25]: admin
          - paragraph [ref=e26]: Full system access, fee approvals, notice posting, risk alerts audit
          - button "Launch as ADMIN" [ref=e27]
        - generic [ref=e28] [cursor=pointer]:
          - generic [ref=e29]:
            - generic [ref=e36]:
              - heading "Prof. Marcus Thorne" [level=4] [ref=e37]
              - paragraph [ref=e38]: Computer Science Lead Faculty
            - generic [ref=e39]: teacher
          - paragraph [ref=e40]: Assigned class registers, optimistic attendance marking, timetable grid
          - button "Launch as TEACHER" [ref=e41]
        - generic [ref=e42] [cursor=pointer]:
          - generic [ref=e43]:
            - generic [ref=e49]:
              - heading "Aria Chen" [level=4] [ref=e50]
              - paragraph [ref=e51]: Computer Science 3A Student
            - generic [ref=e52]: student
          - paragraph [ref=e53]: Personal academic overview, fee receipts, class timetable, notices
          - button "Launch as STUDENT" [ref=e54]
    - paragraph [ref=e55]: PulseGrid SIMS Portal • Senior Engineering Portfolio Deliverable • MIT License
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e61] [cursor=pointer]
  - alert [ref=e65]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import AxeBuilder from "@axe-core/playwright";
  3  | 
  4  | test.describe("PulseGrid End-to-End Critical Flows & Accessibility", () => {
  5  |   test("Complete user journey: Login -> Dashboard -> Attendance -> Fees -> Notifications -> Logout", async ({
  6  |     page,
  7  |   }) => {
  8  |     // 1. Visit Login Page
  9  |     await page.goto("/login");
  10 |     await expect(page.getByText("Demo Access Portal")).toBeVisible();
  11 |     await expect(page.getByText("PulseGrid", { exact: true })).toBeVisible();
  12 | 
  13 |     // 2. Accessibility Scan on Login Page
  14 |     const loginAxeResults = await new AxeBuilder({ page })
  15 |       .withTags(["wcag2a", "wcag2aa"])
  16 |       .analyze();
  17 |     expect(
  18 |       loginAxeResults.violations.filter(
  19 |         (v) => v.impact === "serious" || v.impact === "critical"
  20 |       )
> 21 |     ).toHaveLength(0);
     |       ^ Error: expect(received).toHaveLength(expected)
  22 | 
  23 |     // 3. Login as Admin
  24 |     await page.click("text=Launch as ADMIN");
  25 |     await page.waitForURL("/dashboard");
  26 |     await expect(page.getByText("Operational Grid")).toBeVisible();
  27 | 
  28 |     // 4. Accessibility Scan on Dashboard Page
  29 |     const dashboardAxeResults = await new AxeBuilder({ page })
  30 |       .withTags(["wcag2a", "wcag2aa"])
  31 |       .analyze();
  32 |     expect(
  33 |       dashboardAxeResults.violations.filter(
  34 |         (v) => v.impact === "serious" || v.impact === "critical"
  35 |       )
  36 |     ).toHaveLength(0);
  37 | 
  38 |     // 5. Navigate to Attendance Module
  39 |     await page.goto("/attendance");
  40 |     await expect(page.getByText("Class Register & Attendance")).toBeVisible();
  41 | 
  42 |     // 6. Navigate to Fees Module
  43 |     await page.goto("/fees");
  44 |     await expect(page.getByText("Fees & Finance Portal")).toBeVisible();
  45 | 
  46 |     // 7. Navigate to Timetable Module
  47 |     await page.goto("/timetable");
  48 |     await expect(page.getByText("Weekly Timetable Grid")).toBeVisible();
  49 | 
  50 |     // 8. Navigate to Notifications Module
  51 |     await page.goto("/notifications");
  52 |     await expect(page.getByText("Digital Noticeboard")).toBeVisible();
  53 |   });
  54 | });
  55 | 
```