import { describe, expect, it } from 'vitest';
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = new URL('../', import.meta.url);

function runShellInstaller(actualHash: string) {
  const directory = mkdtempSync(join(tmpdir(), 'workbook-constellation-checksum-'));
  const bin = join(directory, 'bin');
  const marker = join(directory, 'launched');
  const appName = 'Workbook.Constellation_test_amd64.AppImage';
  mkdirSync(bin);
  writeFileSync(join(bin, 'uname'), '#!/bin/sh\n[ "$1" = "-s" ] && printf Linux || printf x86_64\n');
  writeFileSync(join(bin, 'curl'), ['#!/bin/sh', 'output=""', 'last=""', 'while [ "$#" -gt 0 ]; do', '  if [ "$1" = "-o" ]; then output="$2"; shift 2; continue; fi', '  last="$1"; shift', 'done', 'case "$last" in', `  *api.github.com*) printf '{"browser_download_url": "https://downloads.example/${appName}"}\\n' ;;`, `  *${appName}) printf '#!/bin/sh\\nprintf launched > "$WC_LAUNCH_MARKER"\\n' > "$output" ;;`, `  *SHA256SUMS) printf 'goodhash  ${appName}\\n' > "$output" ;;`, 'esac'].join('\n'));
  writeFileSync(join(bin, 'sha256sum'), `#!/bin/sh\nprintf "${actualHash}  %s\\n" "$1"\n`);
  for (const command of ['uname', 'curl', 'sha256sum']) chmodSync(join(bin, command), 0o755);
  return { directory, bin, marker, appName };
}

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

  it('@claim:installer-safety accepts matching checksums and removes mismatching installers before launch', async () => {
    const good = runShellInstaller('goodhash');
    try {
      execFileSync('/bin/sh', [new URL('../public/install.sh', import.meta.url).pathname], {
        cwd: good.directory,
        encoding: 'utf8',
        env: { ...process.env, PATH: `${good.bin}:${process.env.PATH}`, WC_LAUNCH_MARKER: good.marker }
      });
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(readFileSync(good.marker, 'utf8')).toBe('launched');
      expect(statSync(join(good.directory, good.appName)).mode & 0o111).not.toBe(0);
    } finally {
      rmSync(good.directory, { recursive: true, force: true });
    }

    const bad = runShellInstaller('badhash');
    try {
      expect(() => execFileSync('/bin/sh', [new URL('../public/install.sh', import.meta.url).pathname], {
        cwd: bad.directory,
        stdio: 'pipe',
        env: { ...process.env, PATH: `${bad.bin}:${process.env.PATH}`, WC_LAUNCH_MARKER: bad.marker }
      })).toThrow();
      expect(() => statSync(join(bad.directory, bad.appName))).toThrow();
      expect(() => statSync(bad.marker)).toThrow();
    } finally {
      rmSync(bad.directory, { recursive: true, force: true });
    }

    const windowsCheck = readFileSync(new URL('tests/windows-installer-check.ps1', root), 'utf8');
    expect(windowsCheck).toContain('Invoke-InstallerCase $true');
    expect(windowsCheck).toContain('Invoke-InstallerCase $false');
    const powershell = process.platform === 'win32' ? 'powershell.exe' : '/usr/bin/pwsh';
    if (process.platform === 'win32' || existsSync(powershell)) execFileSync(powershell, ['-NoProfile', '-File', new URL('../tests/windows-installer-check.ps1', import.meta.url).pathname]);
  }, 15_000);

  it('uses shasum and the Intel asset on a Mac without sha256sum', () => {
    const directory = mkdtempSync(join(tmpdir(), 'workbook-constellation-mac-installer-'));
    const bin = join(directory, 'bin');
    const appName = 'Workbook.Constellation_0.1.4_x64.dmg';
    mkdirSync(bin);
    for (const command of ['basename', 'cp', 'cut', 'grep', 'head', 'mktemp', 'rm', 'sed']) {
      symlinkSync(`/usr/bin/${command}`, join(bin, command));
    }
    writeFileSync(join(bin, 'uname'), '#!/bin/sh\n[ "$1" = "-s" ] && printf Darwin || printf x86_64\n');
    writeFileSync(join(bin, 'curl'), ['#!/bin/sh', 'output=""', 'last=""', 'while [ "$#" -gt 0 ]; do', '  if [ "$1" = "-o" ]; then output="$2"; shift 2; continue; fi', '  last="$1"; shift', 'done', 'case "$last" in', `  *api.github.com*) printf '{"browser_download_url": "https://downloads.example/Workbook.Constellation_0.1.4_aarch64.dmg"}\\n{"browser_download_url": "https://downloads.example/${appName}"}\\n' ;;`, `  *${appName}) printf installer > "$output" ;;`, `  *SHA256SUMS) printf 'portablehash  ${appName}\\n' > "$output" ;;`, 'esac'].join('\n'));
    writeFileSync(join(bin, 'shasum'), '#!/bin/sh\nprintf "portablehash  %s\\n" "$3"\n');
    for (const command of ['uname', 'curl', 'shasum']) chmodSync(join(bin, command), 0o755);
    try {
      const output = execFileSync('/bin/sh', [new URL('../public/install.sh', import.meta.url).pathname], {
        cwd: directory,
        encoding: 'utf8',
        env: { PATH: bin }
      });
      expect(readFileSync(join(directory, appName), 'utf8')).toBe('installer');
      expect(output).toContain(`Verified and saved ${appName}`);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it('allows the GitHub release API in both web and desktop CSPs', () => {
    expect(config.globalHeaders['Content-Security-Policy']).toContain('https://api.github.com');
    const tauri = JSON.parse(readFileSync(new URL('src-tauri/tauri.conf.json', root), 'utf8'));
    expect(tauri.app.security.csp).toContain('https://api.github.com');
  });

  it('@claim:linux-launch makes a verified Linux AppImage executable and launches it', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'workbook-constellation-installer-'));
    const bin = join(directory, 'bin');
    const marker = join(directory, 'launched');
    const appName = 'Workbook.Constellation_0.1.4_amd64.AppImage';
    mkdirSync(bin);
    const curl = join(bin, 'curl');
    const checksum = join(bin, 'sha256sum');
    writeFileSync(curl, ['#!/bin/sh', 'output=""', 'last=""', 'while [ "$#" -gt 0 ]; do', '  if [ "$1" = "-o" ]; then output="$2"; shift 2; continue; fi', '  last="$1"; shift', 'done', 'case "$last" in', `  *api.github.com*) printf '{"browser_download_url": "https://downloads.example/${appName}"}\\n' ;;`, '  *AppImage) printf \'#!/bin/sh\\nprintf launched > "$WC_LAUNCH_MARKER"\\n\' > "$output" ;;', `  *SHA256SUMS) printf 'testsum  ${appName}\\n' > "$output" ;;`, 'esac'].join('\n'));
    writeFileSync(checksum, '#!/bin/sh\nprintf "testsum  %s\\n" "$1"\n');
    chmodSync(curl, 0o755);
    chmodSync(checksum, 0o755);
    try {
      const output = execFileSync('sh', [new URL('../public/install.sh', import.meta.url).pathname], {
        cwd: directory,
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, WC_LAUNCH_MARKER: marker }
      });
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(statSync(join(directory, appName)).mode & 0o111).not.toBe(0);
      expect(readFileSync(marker, 'utf8')).toBe('launched');
      expect(output).toContain('made Workbook.Constellation_0.1.4_amd64.AppImage executable, and launched');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it('@claim:release-workflow records a successful tag build with every desktop target and release metadata', () => {
    const workflow = readFileSync(new URL('.github/workflows/release.yml', root), 'utf8');
    const packageJson = JSON.parse(readFileSync(new URL('package.json', root), 'utf8')) as { version: string };
    const packageLock = JSON.parse(readFileSync(new URL('package-lock.json', root), 'utf8')) as { version: string; packages: Record<string, { version: string }> };
    const tauri = JSON.parse(readFileSync(new URL('src-tauri/tauri.conf.json', root), 'utf8')) as { version: string };
    const cargoVersion = readFileSync(new URL('src-tauri/Cargo.toml', root), 'utf8').match(/^version\s*=\s*"([^"]+)"/m)?.[1];
    const release = JSON.parse(readFileSync(new URL('tests/fixtures/release-v0.1.11.json', root), 'utf8')) as { tag_name: string; target_commitish: string; assets: string[] };
    const run = JSON.parse(readFileSync(new URL('tests/fixtures/release-run-v0.1.11.json', root), 'utf8')) as { head_sha: string; head_branch: string; status: string; conclusion: string; event: string; jobs: Array<{ name: string; conclusion: string; verified_step?: string }> };
    expect(workflow).toContain("tags: ['v*']");
    expect(workflow).toContain('ubuntu-22.04');
    expect(workflow).toContain('windows-latest');
    expect(workflow.match(/macos-latest/g)).toHaveLength(2);
    expect(workflow).toContain('Unsigned desktop builds.');
    expect(workflow).toContain('SHA256SUMS');
    expect(workflow).toContain('latest.json');
    expect(workflow).toContain("APPIMAGE_EXTRACT_AND_RUN: '1'");
    expect(workflow).toContain('install -y file ');
    expect(workflow.match(/ref: \$\{\{ env\.RELEASE_TAG \}\}/g)).toHaveLength(2);
    expect(workflow.match(/node scripts\/verify-release\.mjs/g)).toHaveLength(2);
    expect([packageLock.version, packageLock.packages[''].version, tauri.version, cargoVersion]).toEqual([
      packageJson.version, packageJson.version, packageJson.version, packageJson.version
    ]);
    expect(release.tag_name).toBe(`v${packageJson.version}`);
    expect(run.head_branch).toBe(release.tag_name);
    expect(run).toMatchObject({ head_sha: release.target_commitish, status: 'completed', conclusion: 'success', event: 'push' });
    expect(run.jobs).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'build (ubuntu-22.04)', conclusion: 'success', verified_step: 'Run unit tests' }),
      expect.objectContaining({ name: 'build (windows-latest)', conclusion: 'success', verified_step: 'Exercise Windows installer checksum handling' }),
      expect.objectContaining({ name: 'build (macos-latest, --target x86_64-apple-darwin)', conclusion: 'success' }),
      expect.objectContaining({ name: 'build (macos-latest, --target aarch64-apple-darwin)', conclusion: 'success' }),
      expect.objectContaining({ name: 'manifest', conclusion: 'success', verified_step: 'Write checksums and latest manifest' })
    ]));
    expect(release.assets).toEqual(expect.arrayContaining([
      'SHA256SUMS', 'latest.json',
      expect.stringMatching(/_amd64\.AppImage$/),
      expect.stringMatching(/_amd64\.deb$/),
      expect.stringMatching(/_x64-setup\.exe$/),
      expect.stringMatching(/_aarch64\.dmg$/),
      expect.stringMatching(/_x64\.dmg$/)
    ]));
  });

  it('forces nested AppImage tools to extract when the Tauri command runs on Linux', () => {
    const directory = mkdtempSync(join(tmpdir(), 'workbook-constellation-tauri-runner-'));
    const fakeCli = join(directory, 'fake-tauri.mjs');
    const capture = join(directory, 'capture.json');
    writeFileSync(fakeCli, `import { writeFileSync } from 'node:fs';\nwriteFileSync(process.env.TAURI_ENV_CAPTURE, JSON.stringify({ extract: process.env.APPIMAGE_EXTRACT_AND_RUN, args: process.argv.slice(2) }));\n`);
    try {
      execFileSync(process.execPath, [new URL('../scripts/run-tauri.mjs', import.meta.url).pathname, 'build', '--bundles', 'appimage'], {
        env: { ...process.env, APPIMAGE_EXTRACT_AND_RUN: '0', TAURI_CLI_PATH: fakeCli, TAURI_ENV_CAPTURE: capture }
      });
      const actual = JSON.parse(readFileSync(capture, 'utf8')) as { extract: string; args: string[] };
      expect(actual.args).toEqual(['build', '--bundles', 'appimage']);
      expect(actual.extract).toBe(process.platform === 'linux' ? '1' : '0');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it('rejects a release tag that does not point at the packaged candidate', () => {
    const directory = mkdtempSync(join(tmpdir(), 'workbook-constellation-provenance-'));
    const runGit = (...args: string[]) => execFileSync('git', args, { cwd: directory, encoding: 'utf8' });
    const { GITHUB_REF: _githubRef, GITHUB_SHA: _githubSha, ...isolatedEnv } = process.env;
    mkdirSync(join(directory, 'src-tauri'));
    mkdirSync(join(directory, 'public'));
    writeFileSync(join(directory, 'package.json'), '{"version":"1.2.3"}\n');
    writeFileSync(join(directory, 'package-lock.json'), '{"version":"1.2.3","packages":{"":{"version":"1.2.3"}}}\n');
    writeFileSync(join(directory, 'src-tauri', 'tauri.conf.json'), '{"version":"1.2.3"}\n');
    writeFileSync(join(directory, 'src-tauri', 'Cargo.toml'), '[package]\nname = "fixture"\nversion = "1.2.3"\n');
    writeFileSync(join(directory, 'public', '404.html'), '<footer>Version 1.2.3</footer>\n');
    try {
      runGit('init', '-q');
      runGit('config', 'user.email', 'test@example.com');
      runGit('config', 'user.name', 'Release Test');
      runGit('add', '.');
      runGit('commit', '-qm', 'candidate');
      runGit('tag', 'v1.2.3');
      const script = new URL('../scripts/verify-release.mjs', import.meta.url).pathname;
      const verified = execFileSync(process.execPath, [script], {
        cwd: directory,
        encoding: 'utf8',
        env: { ...isolatedEnv, RELEASE_TAG: 'v1.2.3' }
      });
      expect(verified).toContain('Release v1.2.3 matches version 1.2.3');

      writeFileSync(join(directory, 'candidate-change.txt'), 'later product change\n');
      runGit('add', '.');
      runGit('commit', '-qm', 'change after tag');
      expect(() => execFileSync(process.execPath, [script], {
        cwd: directory,
        encoding: 'utf8',
        stdio: 'pipe',
        env: { ...isolatedEnv, RELEASE_TAG: 'v1.2.3' }
      })).toThrow(/tag v1\.2\.3 points to .* but HEAD is/);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it('gives the static 404 the standard shell and complete metadata', () => {
    const page = readFileSync(new URL('public/404.html', root), 'utf8');
    for (const required of ['Skip to main content', '<header', '<main id="main"', '<footer', 'href="/privacy"', 'href="/terms"', 'name="description"', 'rel="canonical"', 'property="og:title"', 'name="twitter:title"', 'rel="icon"', 'rel="apple-touch-icon"']) {
      expect(page).toContain(required);
    }
    expect(page.match(/<h1/g)).toHaveLength(1);
  });
});
