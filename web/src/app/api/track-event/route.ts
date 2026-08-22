import { NextResponse } from "next/server";
import { sendTikTokEvent } from "@/lib/tiktok-events";

const ALLOWED_EVENTS = new Set([
  "Pageview",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Contact",
  "CompletePayment",
  "SubmitForm",
  "Search",
]);

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      event?: string;
      eventId?: string;
      url?: string;
      referrer?: string;
      ttclid?: string;
      ttp?: string;
      properties?: Record<string, unknown>;
    };

    const event = body.event ?? "";
    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing event name" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await sendTikTokEvent({
      event,
      eventId: body.eventId,
      ip,
      userAgent,
      url: body.url ?? req.headers.get("referer") ?? undefined,
      referrer: body.referrer,
      ttclid: body.ttclid,
      ttp: body.ttp,
      properties: body.properties,
    });

    return NextResponse.json({ success: result.ok, detail: result.message });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
