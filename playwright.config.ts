import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) }, // 1000 ms = 1 second pause per action
      },
    },
  ],
  // Starts the demo Provider Enrollment Portal automatically before tests run.
  // Skipped when BASE_URL points at another environment.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'node demo-app/server.js',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
