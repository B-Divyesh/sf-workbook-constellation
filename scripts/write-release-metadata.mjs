import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function fail(message) {
  throw new Error(`Release metadata generation failed: ${message}`);
}

const directory = resolve(process.argv[2] || 'release-assets');
const tag = process.env.RELEASE_TAG;
const commit = process.env.RELEASE_COMMIT?.toLowerCase();
const repository = process.env.GITHUB_REPOSITORY || 'B-Divyesh/sf-workbook-constellation';

if (!tag || !/^v\d+\.\d+\.\d+$/.test(tag)) fail('RELEASE_TAG must be a semantic version tag');
if (!commit || !/^[a-f0-9]{40}$/.test(commit)) fail('RELEASE_COMMIT must be a full Git commit');
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) fail('GITHUB_REPOSITORY is invalid');

const names = readdirSync(directory)
  .filter(name => !['SHA256SUMS', 'latest.json'].includes(name) && statSync(resolve(directory, name)).isFile())
  .sort();
if (!names.length) fail('no installer assets were found');

const assets = names.map(name => {
  const sha256 = createHash('sha256').update(readFileSync(resolve(directory, name))).digest('hex');
  return {
    name,
    url: `https://github.com/${repository}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(name)}`,
    sha256,
    commit
  };
});

const checksums = [
  `# Workbook Constellation ${tag} commit ${commit}`,
  ...assets.map(asset => `${asset.sha256}  ${asset.name}`)
].join('\n');
writeFileSync(resolve(directory, 'SHA256SUMS'), `${checksums}\n`);
writeFileSync(resolve(directory, 'latest.json'), `${JSON.stringify({ version: tag, commit, assets }, null, 2)}\n`);
console.log(`Wrote provenance for ${assets.length} ${tag} assets at ${commit}.`);
