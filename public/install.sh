#!/bin/sh
set -eu
repo="B-Divyesh/sf-workbook-constellation"
os=$(uname -s)
case "$os" in
  Darwin) pattern='\.dmg$' ;;
  Linux) pattern='\.AppImage$' ;;
  *) echo "Use the Windows installer from the release page."; exit 1 ;;
esac
api="https://api.github.com/repos/$repo/releases/latest"
url=$(curl -fsSL "$api" | sed -n 's/.*"browser_download_url": "\([^"]*\)".*/\1/p' | grep -E "$pattern" | head -n 1)
[ -n "$url" ] || { echo "No matching release is available yet."; exit 1; }
name=$(basename "$url")
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
curl -fsSL "$url" -o "$tmpdir/$name"
curl -fsSL "https://github.com/$repo/releases/latest/download/SHA256SUMS" -o "$tmpdir/SHA256SUMS"
expected=$(grep " $name$" "$tmpdir/SHA256SUMS" | cut -d' ' -f1)
actual=$(sha256sum "$tmpdir/$name" 2>/dev/null | cut -d' ' -f1 || shasum -a 256 "$tmpdir/$name" | cut -d' ' -f1)
[ "$expected" = "$actual" ] || { echo "Checksum did not match. Nothing was installed."; exit 1; }
cp "$tmpdir/$name" "$PWD/$name"
echo "Verified and saved $name in $PWD. Open it to install Workbook Constellation."
