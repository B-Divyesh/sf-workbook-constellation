import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);

describe('static deployment policy', () => {
  const config = JSON.parse(readFileSync(new URL('public/staticwebapp.config.json', root), 'utf8'));

  it('serves only known application routes through the SPA and preserves HTTP 404 responses', () => {
    expect(config).not.toHaveProperty('navigationFallback');
    expect(config.routes.filter((route: { rewrite?: string }) => route.rewrite === '/index.html').map((route: { route: string }) => route.route)).toEqual([
      '/demo', '/privacy', '/terms'
    ]);
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
    expect(readFileSync(new URL('public/404.html', root), 'utf8')).not.toContain('http-equiv="refresh"');
  });

  it('immutably caches versioned assets while forcing service-worker revalidation', () => {
    const byRoute = Object.fromEntries(config.routes.map((route: { route: string; headers?: Record<string, string> }) => [route.route, route.headers]));
    expect(byRoute['/assets/*']['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(byRoute['/art/*']['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(byRoute['/sw.js']['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
  });

  it('@claim:installer-safety verifies downloaded installers before keeping them', () => {
    const shell = readFileSync(new URL('public/install.sh', root), 'utf8');
    const powershell = readFileSync(new URL('public/install.ps1', root), 'utf8');
    expect(shell).toContain('SHA256SUMS');
    expect(shell).toContain('[ "$expected" = "$actual" ]');
    expect(powershell).toContain('Get-FileHash');
    expect(powershell).toContain('Remove-Item $target');
  });

  it('@claim:release-workflow defines every desktop target, checksums, and the release manifest', () => {
    const workflow = readFileSync(new URL('.github/workflows/release.yml', root), 'utf8');
    expect(workflow).toContain("tags: ['v*']");
    expect(workflow).toContain('ubuntu-22.04');
    expect(workflow).toContain('windows-latest');
    expect(workflow.match(/macos-latest/g)).toHaveLength(2);
    expect(workflow).toContain('Unsigned desktop builds.');
    expect(workflow).toContain('SHA256SUMS');
    expect(workflow).toContain('latest.json');
  });
});
