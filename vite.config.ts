import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as { version: string };
const buildCommit = (process.env.BUILD_COMMIT || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()).toLowerCase();
if (!/^[a-f0-9]{40}$/.test(buildCommit)) throw new Error('BUILD_COMMIT must be a full Git commit');

export default defineConfig({
  base: '/',
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_COMMIT__: JSON.stringify(buildCommit)
  },
  build: { target: 'es2022', sourcemap: true },
  server: { host: '127.0.0.1', port: 4173 },
  preview: { host: '127.0.0.1', port: 4173 },
  plugins: [{
    name: 'version-service-worker-from-shell',
    writeBundle(output) {
      const outDir = output.dir || resolve(process.cwd(), 'dist/site');
      const shell = readFileSync(resolve(outDir, 'index.html'));
      const worker = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');
      const buildId = createHash('sha256').update(shell).digest('hex').slice(0, 16);
      writeFileSync(resolve(outDir, 'sw.js'), worker.replace('__BUILD_ID__', buildId));
      writeFileSync(resolve(outDir, 'release-provenance.json'), `${JSON.stringify({ version: `v${packageJson.version}`, commit: buildCommit }, null, 2)}\n`);
    }
  }]
});
