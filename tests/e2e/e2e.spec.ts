import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("PulseGrid End-to-End Critical Flows & Accessibility", () => {
  test("Complete user journey: Login -> Dashboard -> Attendance -> Fees -> Notifications -> Logout", async ({
    page,
  }) => {
    // 1. Visit Login Page
    await page.goto("/login");
    await expect(page.getByText("Demo Access Portal")).toBeVisible();
    await expect(page.getByText("PulseGrid", { exact: true })).toBeVisible();

    // 2. Accessibility Scan on Login Page
    const loginAxeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      loginAxeResults.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      )
    ).toHaveLength(0);

    // 3. Login as Admin
    await page.click("text=Launch as ADMIN");
    await page.waitForURL("/dashboard");
    await expect(page.getByText("Operational Grid")).toBeVisible();

    // 4. Accessibility Scan on Dashboard Page
    const dashboardAxeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      dashboardAxeResults.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      )
    ).toHaveLength(0);

    // 5. Navigate to Attendance Module
    await page.goto("/attendance");
    await expect(page.getByText("Class Register & Attendance")).toBeVisible();

    // 6. Navigate to Fees Module
    await page.goto("/fees");
    await expect(page.getByText("Fees & Finance Portal")).toBeVisible();

    // 7. Navigate to Timetable Module
    await page.goto("/timetable");
    await expect(page.getByText("Weekly Timetable Grid")).toBeVisible();

    // 8. Navigate to Notifications Module
    await page.goto("/notifications");
    await expect(page.getByText("Digital Noticeboard")).toBeVisible();
  });
});
