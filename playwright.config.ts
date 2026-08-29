import { defineConfig } from '@playwright/test';

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: { baseURL: externalBaseUrl || 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: externalBaseUrl ? undefined : { command: 'npm run build:site && npx vite preview --host 127.0.0.1 --port 4173 --outDir dist/site', url: 'http://127.0.0.1:4173', reuseExistingServer: true }
});
