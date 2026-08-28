import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/live',
  timeout: 30_000,
  use: {
    baseURL: process.env.LIVE_URL || 'https://workbook-constellation.sociobot.in',
    serviceWorkers: 'block',
    trace: 'retain-on-failure'
  }
});
