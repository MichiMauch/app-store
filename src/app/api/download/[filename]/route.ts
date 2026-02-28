import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const APPS_DIR =
  process.env.NODE_ENV === "production" ? "/data/apps" : "./apps";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Path traversal protection
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\") ||
    !filename.endsWith(".apk")
  ) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filePath = path.join(path.resolve(APPS_DIR), filename);

  // Verify the resolved path is still within the apps directory
  if (!filePath.startsWith(path.resolve(APPS_DIR))) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": stat.size.toString(),
    },
  });
}
