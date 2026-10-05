import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Milliways SmartTests
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    // TestChimp reporter integration
    // Uncomment when @testchimp/playwright is configured:
    // ['@testchimp/playwright', {
    //   apiKey: process.env.TESTCHIMP_API_KEY,
    //   projectId: process.env.TESTCHIMP_PROJECT_ID,
    //   branchName: process.env.TESTCHIMP_BRANCH_NAME || 'main',
    // }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browsers as needed:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Start Angular dev server before tests (CI and local)
  // Comment out if starting manually or via separate CI step
  webServer: {
    command: 'cd ../web && npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
