type TikTokProps = Record<string, unknown>;

interface TtqPixel {
  track: (
    event: string,
    params?: TikTokProps,
    options?: { event_id?: string }
  ) => void;
}

declare global {
  interface Window {
    ttq?: TtqPixel;
  }
}

export function trackEvent(event: string, properties?: TikTokProps): void {
  if (typeof window === "undefined") return;

  const eventId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    window.ttq?.track(event, properties, { event_id: eventId });
  } catch {
    // pixel not loaded yet — server event still fires
  }

  try {
    const params = new URLSearchParams(window.location.search);
    fetch("/api/track-event/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        eventId,
        url: window.location.href,
        referrer: document.referrer || undefined,
        ttclid: params.get("ttclid") || undefined,
        properties,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore tracking failures
  }
}
