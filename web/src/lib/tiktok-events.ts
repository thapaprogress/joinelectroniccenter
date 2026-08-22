const TIKTOK_EVENTS_ENDPOINT =
  "https://business-api.tiktok.com/open_api/v1.3/event/track/";

export interface TikTokEventInput {
  event: string;
  eventId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  referrer?: string;
  ttclid?: string;
  ttp?: string;
  properties?: Record<string, unknown>;
}

export async function sendTikTokEvent(input: TikTokEventInput): Promise<{
  ok: boolean;
  code?: number;
  message?: string;
}> {
  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const token = process.env.TIKTOK_EVENTS_ACCESS_TOKEN;

  if (!pixelId || !token) {
    return { ok: false, message: "TikTok Events API not configured" };
  }

  const payload = {
    event_source: "web",
    event_source_id: pixelId,
    data: [
      {
        event: input.event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId ?? crypto.randomUUID(),
        user: {
          ...(input.ip ? { ip: input.ip } : {}),
          ...(input.userAgent ? { user_agent: input.userAgent } : {}),
          ...(input.ttclid ? { ttclid: input.ttclid } : {}),
          ...(input.ttp ? { ttp: input.ttp } : {}),
        },
        page: {
          ...(input.url ? { url: input.url } : {}),
          ...(input.referrer ? { referrer: input.referrer } : {}),
        },
        properties: input.properties ?? {},
      },
    ],
  };

  try {
    const res = await fetch(TIKTOK_EVENTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = (await res.json().catch(() => ({}))) as {
      code?: number;
      message?: string;
    };

    if (!res.ok || (typeof json.code === "number" && json.code !== 0)) {
      return {
        ok: false,
        code: json.code ?? res.status,
        message: json.message ?? "TikTok Events API error",
      };
    }

    return { ok: true, code: json.code, message: json.message };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
