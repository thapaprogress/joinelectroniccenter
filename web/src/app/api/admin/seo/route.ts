import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), "public", "data", "seo_settings.json");
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      return NextResponse.json({ success: true, settings: data });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jsonPath = path.join(process.cwd(), "public", "data", "seo_settings.json");
    fs.writeFileSync(jsonPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "SEO Settings updated successfully!", settings: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
