import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const readJson = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const fail = message => {
  console.error(`Release provenance check failed: ${message}`);
  process.exit(1);
};

const packageJson = readJson('package.json');
const packageLock = readJson('package-lock.json');
const tauri = readJson('src-tauri/tauri.conf.json');
const cargo = readFileSync(resolve(root, 'src-tauri/Cargo.toml'), 'utf8');
const cargoVersion = cargo.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
const page404 = readFileSync(resolve(root, 'public/404.html'), 'utf8');
const version = packageJson.version;

const declared = [
  ['package-lock.json', packageLock.version],
  ['package-lock.json root package', packageLock.packages?.['']?.version],
  ['src-tauri/tauri.conf.json', tauri.version],
  ['src-tauri/Cargo.toml', cargoVersion]
];

for (const [source, candidate] of declared) {
  if (candidate !== version) fail(`${source} declares ${candidate ?? 'no version'}, expected ${version}`);
}
if (!page404.includes(`Version ${version}`)) fail(`public/404.html does not show version ${version}`);

const tag = process.env.RELEASE_TAG;
if (!tag) fail('RELEASE_TAG is required');
if (tag !== `v${version}`) fail(`tag ${tag} does not match package version ${version}`);

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
let tagCommit;
try {
  tagCommit = git('rev-list', '-n', '1', tag);
} catch {
  fail(`tag ${tag} does not exist in this checkout`);
}
const head = git('rev-parse', 'HEAD');
if (tagCommit !== head) fail(`tag ${tag} points to ${tagCommit}, but HEAD is ${head}`);
if (process.env.GITHUB_REF?.startsWith('refs/tags/') && process.env.GITHUB_SHA && process.env.GITHUB_SHA !== head) {
  fail(`GITHUB_SHA ${process.env.GITHUB_SHA} does not match HEAD ${head}`);
}

console.log(`Release ${tag} matches version ${version} at ${head}.`);
