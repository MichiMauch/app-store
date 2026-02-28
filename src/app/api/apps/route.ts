import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const APPS_DIR =
  process.env.NODE_ENV === "production" ? "/data/apps" : "./apps";

interface AppMeta {
  displayName?: string;
  description?: string;
  version?: string;
  iconUrl?: string;
}

interface AppInfo {
  filename: string;
  displayName: string;
  description: string;
  version: string;
  size: number;
  sizeFormatted: string;
  lastModified: string;
  iconUrl: string | null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function GET() {
  const appsDir = path.resolve(APPS_DIR);

  if (!fs.existsSync(appsDir)) {
    return NextResponse.json([]);
  }

  // Load optional metadata
  let metaMap: Record<string, AppMeta> = {};
  const metaPath = path.join(appsDir, "apps.json");
  if (fs.existsSync(metaPath)) {
    try {
      const raw = fs.readFileSync(metaPath, "utf-8");
      metaMap = JSON.parse(raw);
    } catch {
      // ignore invalid JSON
    }
  }

  const files = fs.readdirSync(appsDir).filter((f) => f.endsWith(".apk"));

  const apps: AppInfo[] = files.map((filename) => {
    const filePath = path.join(appsDir, filename);
    const stat = fs.statSync(filePath);
    const meta = metaMap[filename] || {};
    const baseName = filename.replace(/\.apk$/, "").replace(/[-_]/g, " ");

    return {
      filename,
      displayName: meta.displayName || baseName,
      description: meta.description || "",
      version: meta.version || "",
      size: stat.size,
      sizeFormatted: formatSize(stat.size),
      lastModified: stat.mtime.toISOString(),
      iconUrl: meta.iconUrl || null,
    };
  });

  // Sort by last modified descending
  apps.sort(
    (a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );

  return NextResponse.json(apps);
}
