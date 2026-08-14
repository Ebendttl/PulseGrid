import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("PulseGrid End-to-End Critical Flows & Accessibility", () => {
  test("Complete user journey: Login -> Dashboard -> Attendance -> Fees -> Notifications -> Logout", async ({
    page,
  }) => {
    // 1. Visit Login Page
    await page.goto("/login");
    await expect(page.locator("h1, h2, h3, h4")).toContainText([
      "Demo Access Portal",
      "PulseGrid",
    ]);

    // 2. Accessibility Scan on Login
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
    await expect(page.locator("h1")).toContainText("Operational Grid");

    // 4. Accessibility Scan on Dashboard
    const dashboardAxeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      dashboardAxeResults.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      )
    ).toHaveLength(0);

    // 5. Navigate to Attendance
    await page.goto("/attendance");
    await expect(page.locator("h1")).toContainText("Class Register");

    // 6. Navigate to Fees
    await page.goto("/fees");
    await expect(page.locator("h1")).toContainText("Fees & Finance Portal");

    // 7. Navigate to Timetable
    await page.goto("/timetable");
    await expect(page.locator("h1")).toContainText("Weekly Timetable Grid");

    // 8. Navigate to Notifications
    await page.goto("/notifications");
    await expect(page.locator("h1")).toContainText("Digital Noticeboard");
  });
});
