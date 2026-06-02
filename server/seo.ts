import { storage } from "./storage";

const SITE_URL = "https://www.sarahdigs.com";
const SITE_NAME = "sarahdigs";
const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.png`;

export type ResolvedMeta = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: "website" | "article";
  noindex: boolean;
};

const DEFAULTS: ResolvedMeta = {
  title: "sarahdigs | creative website studio",
  description:
    "sarahdigs is a creative website studio that designs and builds high-performing websites for businesses. book a dig-in to get started.",
  canonical: `${SITE_URL}/`,
  ogImage: DEFAULT_OG_IMAGE,
  ogType: "website",
  noindex: false,
};

const STATIC_ROUTES: Record<string, Partial<ResolvedMeta>> = {
  "/": {
    title: "sarahdigs | creative website studio",
  },
  "/about": {
    title: "about | sarahdigs",
    description:
      "sarahdigs is a creative website studio. meet the founder and the philosophy behind every build: a website should feel like walking into the business.",
  },
  "/contact": {
    title: "contact | sarahdigs",
    description:
      "tell us about your project. we reply within one business day and only take on work we're the right fit for.",
  },
  "/projects": {
    title: "selected work | sarahdigs",
    description:
      "case studies from the sarahdigs studio. brand-led websites built for businesses that want to be remembered.",
  },
  "/journal": {
    title: "the journal | sarahdigs",
    description:
      "essays and field notes from the sarahdigs studio on web design, ai search visibility, and building a brand that gets found.",
  },
  "/the-full-dig": {
    title: "the full dig | sarahdigs",
    description:
      "our end-to-end engagement: brand-led website design, build, and launch. for businesses ready to be remembered.",
  },
  "/dig-on-demand": {
    title: "dig on demand | sarahdigs",
    description:
      "ongoing design and dev support for businesses with a live site that needs to keep moving.",
  },
  "/dig-in-consultations": {
    title: "dig-in consultations | sarahdigs",
    description:
      "a focused call and written action plan. for when you need clarity before committing to a full engagement.",
  },
  "/privacy": {
    title: "privacy | sarahdigs",
    description: "how sarahdigs handles your data.",
    noindex: true,
  },
  "/terms": {
    title: "terms | sarahdigs",
    description: "terms of service for sarahdigs.",
    noindex: true,
  },
};

function absoluteUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function withTitleSuffix(title?: string | null): string | undefined {
  if (!title) return undefined;
  if (title.toLowerCase().includes("sarahdigs")) return title;
  return `${title} | ${SITE_NAME}`;
}

function withDefaults(
  partial: Partial<ResolvedMeta>,
  pathname: string,
): ResolvedMeta {
  return {
    title: partial.title ?? DEFAULTS.title,
    description: partial.description ?? DEFAULTS.description,
    canonical: partial.canonical ?? `${SITE_URL}${pathname}`,
    ogImage: partial.ogImage ?? DEFAULTS.ogImage,
    ogType: partial.ogType ?? "website",
    noindex: partial.noindex ?? false,
  };
}

export async function resolveMeta(rawUrl: string): Promise<ResolvedMeta> {
  // strip query + hash, drop trailing slash (except root)
  const pathname = (rawUrl.split("?")[0].split("#")[0] || "/").replace(
    /\/+$/,
    "",
  ) || "/";

  // admin routes — never index
  if (pathname.startsWith("/admin")) {
    return withDefaults({ title: "admin | sarahdigs", noindex: true }, pathname);
  }

  // project detail: /projects/:slug
  const projectMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    try {
      const project = await storage.getProjectBySlug(projectMatch[1]);
      if (project) {
        return withDefaults(
          {
            title: withTitleSuffix(project.name),
            description:
              project.problem ?? project.focus ?? project.results ?? DEFAULTS.description,
            canonical: `${SITE_URL}${pathname}`,
            ogImage: absoluteUrl(project.imageUrl) ?? DEFAULTS.ogImage,
            ogType: "article",
          },
          pathname,
        );
      }
    } catch (err) {
      console.error("[seo] project lookup failed", err);
    }
  }

  // blog post: /journal/post/:slug
  const postMatch = pathname.match(/^\/journal\/post\/([^/]+)$/);
  if (postMatch) {
    try {
      const post = await storage.getBlogPostBySlug(postMatch[1]);
      if (post) {
        return withDefaults(
          {
            title: withTitleSuffix(post.metaTitle ?? post.title),
            description:
              post.metaDescription ?? post.excerpt ?? DEFAULTS.description,
            canonical: `${SITE_URL}${pathname}`,
            ogImage: absoluteUrl(post.featuredImageUrl) ?? DEFAULTS.ogImage,
            ogType: "article",
          },
          pathname,
        );
      }
    } catch (err) {
      console.error("[seo] post lookup failed", err);
    }
  }

  // static routes
  const staticMeta = STATIC_ROUTES[pathname];
  if (staticMeta) return withDefaults(staticMeta, pathname);

  // fallback — keep canonical pointed at the URL itself, not the homepage
  return withDefaults({}, pathname);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Replace the placeholder meta tags in index.html with per-route values.
 * Matches the exact tag shapes shipped in client/index.html.
 */
export function injectMeta(html: string, meta: ResolvedMeta): string {
  const t = esc(meta.title);
  const d = esc(meta.description);
  const c = esc(meta.canonical);
  const img = esc(meta.ogImage);

  let out = html;

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${t}</title>`);

  // <meta name="description" ...>
  out = out.replace(
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${d}" />`,
  );

  // <link rel="canonical" ...>
  out = out.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${c}" />`,
  );

  // og:type
  out = out.replace(
    /<meta\s+property="og:type"[^>]*>/i,
    `<meta property="og:type" content="${meta.ogType}" />`,
  );
  // og:title
  out = out.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${t}" />`,
  );
  // og:description
  out = out.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${d}" />`,
  );
  // og:url
  out = out.replace(
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${c}" />`,
  );
  // og:image
  out = out.replace(
    /<meta\s+property="og:image"[^>]*>/i,
    `<meta property="og:image" content="${img}" />`,
  );

  // twitter:card → upgrade to large image
  out = out.replace(
    /<meta\s+name="twitter:card"[^>]*>/i,
    `<meta name="twitter:card" content="summary_large_image" />`,
  );
  // twitter:title
  out = out.replace(
    /<meta\s+name="twitter:title"[^>]*>/i,
    `<meta name="twitter:title" content="${t}" />`,
  );
  // twitter:description
  out = out.replace(
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${d}" />`,
  );

  // Inject twitter:image right after twitter:description if not present.
  if (!/<meta\s+name="twitter:image"/i.test(out)) {
    out = out.replace(
      /(<meta\s+name="twitter:description"[^>]*>)/i,
      `$1\n    <meta name="twitter:image" content="${img}" />`,
    );
  } else {
    out = out.replace(
      /<meta\s+name="twitter:image"[^>]*>/i,
      `<meta name="twitter:image" content="${img}" />`,
    );
  }

  // Inject robots noindex if needed and not already present.
  if (meta.noindex && !/<meta\s+name="robots"/i.test(out)) {
    out = out.replace(
      /(<link\s+rel="canonical"[^>]*>)/i,
      `$1\n    <meta name="robots" content="noindex,nofollow" />`,
    );
  }

  return out;
}
