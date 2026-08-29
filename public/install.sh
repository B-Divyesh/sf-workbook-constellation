#!/bin/sh
set -eu
repo="B-Divyesh/sf-workbook-constellation"
os=$(uname -s)
case "$os" in
  Darwin)
    case "$(uname -m)" in
      arm64|aarch64) pattern='_aarch64\.dmg$' ;;
      x86_64|amd64) pattern='_x64\.dmg$' ;;
      *) echo "This Mac architecture does not have a published installer."; exit 1 ;;
    esac
    ;;
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
if command -v sha256sum >/dev/null 2>&1; then
  actual=$(sha256sum "$tmpdir/$name" | cut -d' ' -f1)
elif command -v shasum >/dev/null 2>&1; then
  actual=$(shasum -a 256 "$tmpdir/$name" | cut -d' ' -f1)
else
  echo "No SHA-256 tool was found. Nothing was installed."
  exit 1
fi
[ "$expected" = "$actual" ] || { echo "Checksum did not match. Nothing was installed."; exit 1; }
cp "$tmpdir/$name" "$PWD/$name"
if [ "$os" = "Linux" ]; then
  chmod +x "$PWD/$name"
  "$PWD/$name" &
  echo "Verified, made $name executable, and launched Workbook Constellation."
else
  echo "Verified and saved $name in $PWD. Open the disk image to install Workbook Constellation."
fi
