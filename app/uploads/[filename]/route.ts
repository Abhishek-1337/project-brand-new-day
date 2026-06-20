import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Prevent directory traversal and invalid file paths.
    if (!filename || filename !== path.basename(filename)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    const file = await readFile(filePath);

    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_BY_EXT[ext] || "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
