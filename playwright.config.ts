import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  /* Primary configured project is Mobile Viewport per Section 12 spec */
  projects: [
    {
      name: "Mobile Chrome",
      use: {
        ...devices["iPhone 13"],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],

  webServer: [
    {
      command: "pnpm server",
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm dev:app",
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
