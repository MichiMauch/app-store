import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const APPS_DIR =
  process.env.NODE_ENV === "production" ? "/data/apps" : "./apps";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Basic path traversal protection.
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const extension = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const iconsDir = path.join(path.resolve(APPS_DIR), "icons");
  const filePath = path.join(iconsDir, filename);

  if (!filePath.startsWith(iconsDir)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": CONTENT_TYPE_BY_EXTENSION[extension] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
