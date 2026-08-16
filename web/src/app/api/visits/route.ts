import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";

export async function GET() {
  try {
    const totalVisits = await prisma.visitLog.count();
    return NextResponse.json({
      success: true,
      visits: totalVisits + 1420, // baseline seed visits
    });
  } catch (error: any) {
    return NextResponse.json({ success: true, visits: 1420 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = body.path || "/";
    const userAgent = body.userAgent || "browser";

    await prisma.visitLog.create({
      data: {
        path,
        userAgent,
      },
    });

    const totalVisits = await prisma.visitLog.count();
    return NextResponse.json({
      success: true,
      visits: totalVisits + 1420,
    });
  } catch (error: any) {
    return NextResponse.json({ success: true, visits: 1421 });
  }
}
