import type { Request, Response, NextFunction } from "express";

/**
 * Redirect rules. Add new entries here.
 *
 *  - `from`: path to match. Can be a literal ("/old-page") or use Express
 *    params ("/old/:slug"). Match is case-insensitive.
 *  - `to`: destination. Can interpolate :params from `from`
 *    (e.g. "/new/:slug").
 *  - `status`: 301 (permanent, default — transfers SEO) or 302 (temporary).
 *
 * Order matters — first match wins.
 */
export interface RedirectRule {
  from: string;
  to: string;
  status?: 301 | 302;
}

export const redirects: RedirectRule[] = [
  // Flagship service — moved from /services/seo to /the-full-dig.
  { from: "/services/seo", to: "/the-full-dig" },
  // Retired service pages — all flow into the flagship.
  { from: "/services/product", to: "/the-full-dig" },
  { from: "/services/brand", to: "/the-full-dig" },
  { from: "/services/founder", to: "/the-full-dig" },
  // Retired placeholder project case studies — flow into the work index.
  { from: "/projects/techflow", to: "/projects" },
  { from: "/projects/finsmart", to: "/projects" },
  { from: "/projects/lumina", to: "/projects" },
  // Flattened canonical routes — drop the /services/ prefix.
  { from: "/services/dig-on-demand", to: "/dig-on-demand" },
  { from: "/services/consultations", to: "/dig-in-consultations" },
  { from: "/services/consultations/:slug", to: "/dig-in-consultations/:slug" },
];

/**
 * Express middleware. Mounted before static serving so it intercepts
 * matching URLs and issues an HTTP redirect.
 */
export function redirectsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only act on GET/HEAD — never redirect form POSTs or API calls.
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api")) return next();

  const reqPath = req.path.toLowerCase();

  for (const rule of redirects) {
    const fromParts = rule.from.toLowerCase().split("/").filter(Boolean);
    const reqParts = reqPath.split("/").filter(Boolean);

    if (fromParts.length !== reqParts.length) continue;

    const params: Record<string, string> = {};
    let matches = true;
    for (let i = 0; i < fromParts.length; i++) {
      const f = fromParts[i];
      const r = reqParts[i];
      if (f.startsWith(":")) {
        params[f.slice(1)] = r;
      } else if (f !== r) {
        matches = false;
        break;
      }
    }
    if (!matches) continue;

    // Build the destination by substituting :params.
    let to = rule.to;
    for (const [key, value] of Object.entries(params)) {
      to = to.replace(`:${key}`, value);
    }

    // Preserve querystring.
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";

    return res.redirect(rule.status ?? 301, to + query);
  }

  next();
}
