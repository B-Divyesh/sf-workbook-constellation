import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = process.env.TAURI_CLI_PATH || fileURLToPath(new URL('../node_modules/@tauri-apps/cli/tauri.js', import.meta.url));
const env = { ...process.env };

// linuxdeploy's GTK plugin invokes its AppImage helper a second time. Force
// extraction for that nested process so packaging works without FUSE mounts.
if (process.platform === 'linux') env.APPIMAGE_EXTRACT_AND_RUN = '1';

const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  env,
  stdio: 'inherit'
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
