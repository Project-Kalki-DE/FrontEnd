import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:8080',
    browserName: 'chromium',
    headless: true,
  },
  webServer: {
    command: 'docker-compose up',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
