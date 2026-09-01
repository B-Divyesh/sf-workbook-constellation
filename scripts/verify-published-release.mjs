import { createHash } from 'node:crypto';

const requiredPlatformAssets = [
  ['Linux AppImage', /_amd64\.AppImage$/],
  ['Linux DEB', /_amd64\.deb$/],
  ['Linux RPM', /\.x86_64\.rpm$/],
  ['Windows setup EXE', /_x64-setup\.exe$/],
  ['Windows MSI', /_x64_en-US\.msi$/],
  ['Apple silicon DMG', /_aarch64\.dmg$/],
  ['Intel macOS DMG', /_x64\.dmg$/],
  ['Apple silicon app archive', /_aarch64\.app\.tar\.gz$/],
  ['Intel macOS app archive', /_x64\.app\.tar\.gz$/]
];

function fail(message) {
  throw new Error(`Published release verification failed: ${message}`);
}

async function responseText(response, label) {
  if (!response.ok) fail(`${label} returned HTTP ${response.status}`);
  return response.text();
}

async function responseBytes(response, label) {
  if (!response.ok) fail(`${label} returned HTTP ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}

function checksumManifest(text) {
  const checksums = new Map();
  const lines = text.trim().split(/\r?\n/);
  const provenance = lines.shift()?.match(/^# Workbook Constellation (v\d+\.\d+\.\d+) commit ([a-f0-9]{40})$/i);
  if (!provenance) fail('SHA256SUMS is missing exact tag and commit provenance');
  for (const line of lines) {
    const match = line.match(/^([a-f0-9]{64}) {2}(.+)$/i);
    if (!match) fail(`SHA256SUMS contains an invalid line: ${line}`);
    if (checksums.has(match[2])) fail(`SHA256SUMS lists ${match[2]} more than once`);
    checksums.set(match[2], match[1].toLowerCase());
  }
  return { tag: provenance[1], commit: provenance[2].toLowerCase(), checksums };
}

function sameAssetSet(expected, actual, label) {
  const expectedNames = [...expected].sort();
  const actualNames = [...actual].sort();
  if (expectedNames.length !== actualNames.length || expectedNames.some((name, index) => name !== actualNames[index])) {
    fail(`${label} does not list exactly the published installer assets`);
  }
}

export async function verifyPublishedRelease({ tag, commit, apiUrl, token, fetchImpl = fetch }) {
  if (!tag || !commit) fail('RELEASE_TAG and RELEASE_COMMIT are required');
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const releaseResponse = await fetchImpl(apiUrl, { headers });
  const release = JSON.parse(await responseText(releaseResponse, 'release metadata'));
  if (release.tag_name !== tag) fail(`metadata names ${release.tag_name}, expected ${tag}`);
  if (release.target_commitish !== commit) {
    fail(`published ${tag} targets ${release.target_commitish}, but the candidate is ${commit}`);
  }

  const assets = Array.isArray(release.assets) ? release.assets : [];
  const installers = assets.filter(asset => asset.name !== 'SHA256SUMS' && asset.name !== 'latest.json');
  const checksums = assets.find(asset => asset.name === 'SHA256SUMS');
  const manifest = assets.find(asset => asset.name === 'latest.json');
  if (!checksums || !manifest) fail('published metadata is missing SHA256SUMS or latest.json');
  for (const [platform, matcher] of requiredPlatformAssets) {
    if (!installers.some(asset => matcher.test(asset.name))) fail(`published metadata is missing the ${platform} asset`);
  }

  const checksumText = await responseText(await fetchImpl(checksums.browser_download_url, { headers }), 'SHA256SUMS');
  const checksumManifestData = checksumManifest(checksumText);
  if (checksumManifestData.tag !== tag || checksumManifestData.commit !== commit.toLowerCase()) {
    fail(`SHA256SUMS identifies ${checksumManifestData.tag} at ${checksumManifestData.commit}, expected ${tag} at ${commit}`);
  }
  const listedChecksums = checksumManifestData.checksums;
  sameAssetSet(installers.map(asset => asset.name), listedChecksums.keys(), 'SHA256SUMS');

  const latest = JSON.parse(await responseText(await fetchImpl(manifest.browser_download_url, { headers }), 'latest.json'));
  if (latest.version !== tag || !Array.isArray(latest.assets)) fail('latest.json has an invalid version or asset list');
  if (latest.commit !== commit) fail(`latest.json identifies commit ${latest.commit ?? 'none'}, expected ${commit}`);
  const manifestAssets = new Map(latest.assets.map(asset => [asset.name, asset]));
  const manifestUrls = new Map(latest.assets.map(asset => [asset.name, asset.url]));
  sameAssetSet(installers.map(asset => asset.name), manifestUrls.keys(), 'latest.json');

  for (const asset of installers) {
    const manifestAsset = manifestAssets.get(asset.name);
    if (manifestUrls.get(asset.name) !== asset.browser_download_url) fail(`latest.json URL for ${asset.name} differs from the release metadata`);
    if (manifestAsset.commit !== commit) fail(`latest.json asset ${asset.name} identifies commit ${manifestAsset.commit ?? 'none'}, expected ${commit}`);
    if (manifestAsset.sha256 !== listedChecksums.get(asset.name)) fail(`latest.json checksum for ${asset.name} differs from SHA256SUMS`);
    const bytes = await responseBytes(await fetchImpl(asset.browser_download_url, { headers }), asset.name);
    const actual = createHash('sha256').update(bytes).digest('hex');
    if (actual !== listedChecksums.get(asset.name)) fail(`${asset.name} does not match SHA256SUMS`);
  }

  return { tag, commit, assetCount: installers.length };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const repo = process.env.GITHUB_REPOSITORY || 'B-Divyesh/sf-workbook-constellation';
  const tag = process.env.RELEASE_TAG;
  const commit = process.env.RELEASE_COMMIT;
  const apiUrl = process.env.RELEASE_API_URL || `https://api.github.com/repos/${repo}/releases/tags/${tag}`;
  try {
    const verified = await verifyPublishedRelease({ tag, commit, apiUrl, token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN });
    console.log(`Verified ${verified.assetCount} ${verified.tag} installer assets at ${verified.commit}.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
