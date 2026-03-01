#!/usr/bin/env bash

set -euo pipefail

REMOTE="${APP_STORE_REMOTE:-root@78.46.189.129}"
REMOTE_DIR="${APP_STORE_REMOTE_DIR:-/data/apps}"
APK_PATH=""
ICON_PATH=""
DISPLAY_NAME=""
VERSION=""
DESCRIPTION=""

usage() {
  cat <<USAGE
Usage:
  scripts/upload-apk.sh --apk <path-to.apk> [options]

Required:
  --apk <file>            Path to APK file

Optional:
  --icon <file>           Path to app icon (.png/.jpg/.jpeg/.webp/.svg)
  --name <text>           Display name in apps.json
  --version <text>        Version in apps.json
  --description <text>    Description in apps.json
  --remote <user@host>    SSH target (default: root@78.46.189.129)
  --remote-dir <path>     Remote apps directory (default: /data/apps)
  -h, --help              Show this help

Examples:
  scripts/upload-apk.sh --apk app/build/outputs/apk/debug/app-debug.apk --icon app/src/main/res/mipmap-xxxhdpi/ic_launcher.png --name "My App" --version "1.2.3"
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apk)
      APK_PATH="$2"
      shift 2
      ;;
    --icon)
      ICON_PATH="$2"
      shift 2
      ;;
    --name)
      DISPLAY_NAME="$2"
      shift 2
      ;;
    --version)
      VERSION="$2"
      shift 2
      ;;
    --description)
      DESCRIPTION="$2"
      shift 2
      ;;
    --remote)
      REMOTE="$2"
      shift 2
      ;;
    --remote-dir)
      REMOTE_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$APK_PATH" ]]; then
  echo "Error: --apk is required" >&2
  usage
  exit 1
fi

if [[ ! -f "$APK_PATH" ]]; then
  echo "Error: APK file not found: $APK_PATH" >&2
  exit 1
fi

apk_filename="$(basename "$APK_PATH")"
if [[ "${apk_filename##*.}" != "apk" ]]; then
  echo "Error: APK file must have .apk extension" >&2
  exit 1
fi

apk_basename="${apk_filename%.apk}"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

existing_meta_path="$tmp_dir/apps.json"
if ! scp -q "$REMOTE:$REMOTE_DIR/apps.json" "$existing_meta_path"; then
  echo "{}" > "$existing_meta_path"
fi

icon_filename=""
icon_url=""
if [[ -n "$ICON_PATH" ]]; then
  if [[ ! -f "$ICON_PATH" ]]; then
    echo "Error: Icon file not found: $ICON_PATH" >&2
    exit 1
  fi

  icon_extension=".${ICON_PATH##*.}"
  icon_extension="$(echo "$icon_extension" | tr '[:upper:]' '[:lower:]')"

  case "$icon_extension" in
    .png|.jpg|.jpeg|.webp|.svg) ;;
    *)
      echo "Error: Unsupported icon format. Use .png, .jpg, .jpeg, .webp, or .svg" >&2
      exit 1
      ;;
  esac

  icon_filename="${apk_basename}${icon_extension}"
  icon_url="/api/icons/${icon_filename}"
fi

UPDATED_META_PATH="$existing_meta_path" \
APK_FILENAME="$apk_filename" \
DISPLAY_NAME="$DISPLAY_NAME" \
VERSION="$VERSION" \
DESCRIPTION="$DESCRIPTION" \
ICON_URL="$icon_url" \
node --input-type=module <<'NODE'
import fs from "node:fs";

const metaPath = process.env.UPDATED_META_PATH;
const apkFilename = process.env.APK_FILENAME;
const displayName = process.env.DISPLAY_NAME;
const version = process.env.VERSION;
const description = process.env.DESCRIPTION;
const iconUrl = process.env.ICON_URL;

let meta = {};
try {
  const parsed = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  meta = typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : {};
} catch {
  meta = {};
}

const current =
  typeof meta[apkFilename] === "object" && meta[apkFilename] !== null
    ? meta[apkFilename]
    : {};

meta[apkFilename] = {
  ...current,
  ...(displayName ? { displayName } : {}),
  ...(version ? { version } : {}),
  ...(description ? { description } : {}),
  ...(iconUrl ? { iconUrl } : {}),
};

fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
NODE

echo "Preparing remote directory: $REMOTE:$REMOTE_DIR"
ssh "$REMOTE" "mkdir -p '$REMOTE_DIR' '$REMOTE_DIR/icons'"

echo "Uploading APK: $apk_filename"
scp "$APK_PATH" "$REMOTE:$REMOTE_DIR/$apk_filename"

if [[ -n "$ICON_PATH" ]]; then
  echo "Uploading icon: $icon_filename"
  scp "$ICON_PATH" "$REMOTE:$REMOTE_DIR/icons/$icon_filename"
fi

echo "Uploading metadata: apps.json"
scp "$existing_meta_path" "$REMOTE:$REMOTE_DIR/apps.json"

echo "Upload completed successfully."
