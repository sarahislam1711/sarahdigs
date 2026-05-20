declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export const CALENDLY_URL = "https://calendly.com/sarah-sarahdigs/30min";

// Prefetch the Calendly page in an invisible iframe so it loads instantly on click
let prefetched = false;
export function prefetchCalendly() {
  if (prefetched) return;
  prefetched = true;
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = CALENDLY_URL;
  document.head.appendChild(link);
}

// Auto-prefetch after page loads
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    setTimeout(prefetchCalendly, 2000);
  });
}

export function openCalendly(options?: { tier?: string }) {
  const url = options?.tier
    ? `${CALENDLY_URL}?a1=${encodeURIComponent(options.tier)}`
    : CALENDLY_URL;

  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url });
  } else {
    window.open(url, "_blank");
  }
}
