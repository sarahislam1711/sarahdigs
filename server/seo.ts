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
  /** JSON-LD objects to render server-side into <head> (for crawlers that don't run JS). */
  jsonLd?: object[];
  /** Pre-rendered article body HTML injected into the page shell so crawlers see real content. */
  bodyHtml?: string;
};

const DEFAULTS: ResolvedMeta = {
  title: "sarahdigs | websites for the ai search era",
  description:
    "sarahdigs builds the online presence that brings work in and the internal tools that run it: websites, ai search visibility and custom systems for growth. book a dig-in.",
  canonical: `${SITE_URL}/`,
  ogImage: DEFAULT_OG_IMAGE,
  ogType: "website",
  noindex: false,
};

const STATIC_ROUTES: Record<string, Partial<ResolvedMeta>> = {
  "/": {
    title: "sarahdigs | websites for the ai search era",
    description:
      "sarahdigs builds the online presence that brings work in and the internal tools that run it: websites, ai search visibility and custom systems for growth. book a dig-in.",
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
      "essays, frameworks, and notes on websites, design, and growth.",
  },
  // NOTE: /the-full-dig, /dig-on-demand, /dig-in-consultations are handled by
  // SERVICE_PAGES below (body + Service/FAQ schema), not here.
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

// Content pages (home / about / contact). Hardcoded in the React components;
// we mirror the key headings + copy here so crawlers and AI bots get a real
// body instead of an empty shell. Keep roughly in sync with the components.
const CONTENT_PAGES: Record<
  string,
  { h1: string; sections: { heading?: string; body: string }[] }
> = {
  "/": {
    h1: "built to get you found & keep you running",
    sections: [
      {
        body: "sarahdigs builds the digital infrastructure a business runs on: the online presence that brings work in, and the internal tools that carry that work once it lands. two sides of the same system, built to get you found and keep you running.",
      },
      {
        heading: "get found: the public side",
        body: "websites: custom-built to turn visitors into customers, and structured so search engines and AI assistants can read, understand, and recommend the business. discoverability: SEO and AI search built in from the beginning, so you get found on Google, ChatGPT, and AI overviews.",
      },
      {
        heading: "get running: the internal side",
        body: "internal systems: custom software that runs the business day to day: dashboards, client portals, pipeline tracking, workflow automation, owned by you. email & growth: automated sequences tied to real triggers in your business, plus the ongoing work of positioning, offer clarity and messaging.",
      },
    ],
  },
  "/about": {
    h1: "meet the studio",
    sections: [
      {
        body: "sarahdigs is a creative website studio that designs websites people remember. a small studio, fewer clients, deeper work. founded by Sarah Islam.",
      },
      {
        heading: "the philosophy",
        body: "a website should feel like walking into the business. we spend real time learning your brand, your audience, and your market before a single page is designed, then build sites that get found on Google and AI search and loved by the people who land on them.",
      },
    ],
  },
  "/contact": {
    h1: "ready to start digging?",
    sections: [
      {
        body: "start a project or book a dig-in. sarahdigs is a creative website studio designing and building high-performing websites for founders and brands. we reply within one business day and only take on work we're the right fit for.",
      },
    ],
  },
};

// Service (offering) pages. Content is hardcoded in the React components, so we
// mirror the essentials here to server-render a crawler-facing body + Service
// (and optional FAQ) schema. Keep in sync with the page components.
const SERVICE_PAGES: Record<
  string,
  {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    intro: string;
    service: { name: string; description: string; serviceType: string };
    faqs?: { q: string; a: string }[];
  }
> = {
  "/the-full-dig": {
    metaTitle: "the full dig | sarahdigs",
    metaDescription:
      "research, design, build, and optimization, done together in the right order. the flagship sarahdigs service for founders who want a website that works.",
    h1: "designed to impress, built to sell",
    intro:
      "the full dig is the flagship sarahdigs engagement: research, design, build, and optimization done together in the right order. exceptional design and real business results, in one service across three depths.",
    service: {
      name: "the full dig",
      description:
        "the flagship sarahdigs engagement: research, design, build, and optimization done together in the right order. a website that works.",
      serviceType: "Website design and development",
    },
  },
  "/dig-on-demand": {
    metaTitle: "custom dig | sarahdigs",
    metaDescription:
      "a custom engagement scoped to your business, goals, and gaps. tell us what you need and we'll build the plan.",
    h1: "tell us what you need. we'll build the plan.",
    intro:
      "dig on demand is a custom engagement scoped to your business, goals, and gaps. ongoing design and development support for a live site that needs to keep moving. tell us what you need and we'll build the plan.",
    service: {
      name: "custom dig",
      description:
        "a custom engagement scoped to your business, goals, and gaps. tell us what you need and we'll build the plan.",
      serviceType: "Custom website engagement",
    },
  },
  "/dig-in-consultations": {
    metaTitle: "dig-in consultations | sarahdigs",
    metaDescription:
      "a focused call with a custom action plan delivered after. you leave with a clear sense of direction for your business.",
    h1: "a focused call, a custom action plan",
    intro:
      "a dig-in consultation is a focused diagnostic call and a written action plan delivered within 48 hours. you leave with a clear sense of direction for your website and business.",
    service: {
      name: "dig-in consultation",
      description:
        "a focused diagnostic call and a written action plan delivered within 48 hours. clear direction for your website and business.",
      serviceType: "Website strategy consultation",
    },
    faqs: [
      {
        q: "what exactly happens on the call?",
        a: "we spend the session focused on your business. i'll ask about your audience, your goals, your current site, and what's not working. by the end, i'll have a clear picture of where you stand and what to prioritize.",
      },
      {
        q: "what do i get after the session?",
        a: "a written action plan delivered within 48 hours. it covers what's working, what's not, and exactly what to do next. with specific recommendations, not vague advice.",
      },
      {
        q: "how is this different from a free discovery call?",
        a: "a discovery call is about deciding whether to work together. a dig-in is the work. you're paying for expertise, diagnosis, and a deliverable you can use immediately.",
      },
      {
        q: "what if i want to move forward with a full project after?",
        a: "many clients do. the dig-in often becomes the starting point for the full dig. but there's no pressure and no obligation. the action plan stands on its own.",
      },
      {
        q: "how much does it cost?",
        a: "pricing is confirmed when you book. it's a fixed fee. no hourly billing, no surprises.",
      },
    ],
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
    jsonLd: partial.jsonLd,
    bodyHtml: partial.bodyHtml,
  };
}

const ORG_PUBLISHER = {
  "@type": "Organization",
  name: SITE_NAME,
  logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE },
};

// ── Sitewide entity schema. Injected server-side into EVERY page so crawlers
// (and AI bots) that don't run JS still see the brand entity. Mirrors the
// client-side organizationSchema/websiteSchema in client/src/lib/schema.ts.
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "SarahDigs",
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  email: "sarah@sarahdigs.com",
  description:
    "sarahdigs builds the digital infrastructure a business runs on: the online presence that brings work in (websites and AI search visibility) and the internal systems and tools that carry the work once it lands.",
  founder: { "@type": "Person", name: "Sarah Islam" },
  contactPoint: {
    "@type": "ContactPoint",
    email: "sarah@sarahdigs.com",
    contactType: "customer support",
  },
  sameAs: ["https://www.linkedin.com/in/sarahislamm/"],
  knowsAbout: [
    "Website Design",
    "Web Development",
    "Brand Strategy",
    "UX Design",
    "SEO",
    "Answer Engine Optimization",
    "Generative Engine Optimization",
    "AI Search Optimization",
    "Conversion Optimization",
    "Custom Software Development",
    "Internal Tools & Dashboards",
    "Client Portals",
    "Workflow Automation",
    "Email Marketing",
    "Growth Strategy",
  ],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// Prepended to every page's server-rendered JSON-LD (unless the page is noindex).
const SITEWIDE_LD: object[] = [ORGANIZATION_LD, WEBSITE_LD];

function serviceLd(opts: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.url}`,
    ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide",
  };
}

function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function breadcrumbLd(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.url}`,
    })),
  };
}

/**
 * Minimal, crawler-facing article body. The React app hydrates over this with
 * the full styled layout; until then (and for non-JS crawlers) this carries the
 * real heading + prose so the page isn't an empty shell.
 */
function articleBodyHtml(opts: {
  title: string;
  contentHtml?: string | null;
  publishedAt?: Date | string | null;
}): string {
  const heading = `<h1>${esc(opts.title)}</h1>`;
  const date = opts.publishedAt
    ? `<p><time datetime="${esc(String(opts.publishedAt))}">${esc(
        String(opts.publishedAt),
      )}</time></p>`
    : "";
  // content is stored as HTML; pass through (it's authored in the admin editor).
  const body = opts.contentHtml ?? "";
  return `<article>${heading}${date}${body}</article>`;
}

/**
 * Crawler-facing project case-study body. The React app renders the full
 * interactive layout (carousels, journey diagram) over this on mount; this is
 * the plain-HTML version so the page isn't an empty shell for non-JS crawlers.
 */
function projectBodyHtml(project: any): string {
  const parts: string[] = [`<h1>${esc(project.name)}</h1>`];
  if (project.industry) parts.push(`<p>${esc(project.industry)}</p>`);
  if (project.problem) parts.push(`<p>${esc(project.problem)}</p>`);
  if (project.problemStory) parts.push(`<p>${esc(project.problemStory)}</p>`);

  const metrics = Array.isArray(project.metrics) ? project.metrics : [];
  if (metrics.length) {
    const items = metrics
      .map((m: any) => `<li>${esc(String(m?.value ?? ""))} — ${esc(String(m?.label ?? ""))}</li>`)
      .join("");
    parts.push(`<ul>${items}</ul>`);
  }

  const steps = Array.isArray(project.processSteps) ? project.processSteps : [];
  if (steps.length) {
    const items = steps
      .map(
        (s: any) =>
          `<li><strong>${esc(String(s?.title ?? ""))}</strong>: ${esc(String(s?.description ?? ""))}</li>`,
      )
      .join("");
    parts.push(`<h2>process</h2><ol>${items}</ol>`);
  }

  const before = Array.isArray(project.beforeStates) ? project.beforeStates : [];
  const after = Array.isArray(project.afterStates) ? project.afterStates : [];
  if (before.length) parts.push(`<h2>before</h2><ul>${before.map((s: any) => `<li>${esc(String(s))}</li>`).join("")}</ul>`);
  if (after.length) parts.push(`<h2>after</h2><ul>${after.map((s: any) => `<li>${esc(String(s))}</li>`).join("")}</ul>`);

  return `<article>${parts.join("")}</article>`;
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
        const description =
          project.problem ?? project.focus ?? project.results ?? DEFAULTS.description;
        const creativeWorkLd = {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.name,
          description,
          url: `${SITE_URL}${pathname}`,
          image: absoluteUrl(project.imageUrl) ?? undefined,
          dateModified: project.updatedAt,
          creator: ORG_PUBLISHER,
        };
        return withDefaults(
          {
            title: withTitleSuffix(project.name),
            description,
            canonical: `${SITE_URL}${pathname}`,
            ogImage: absoluteUrl(project.imageUrl) ?? DEFAULTS.ogImage,
            ogType: "article",
            jsonLd: [
              creativeWorkLd,
              breadcrumbLd([
                { name: "Home", url: "/" },
                { name: "Work", url: "/projects" },
                { name: project.name, url: pathname },
              ]),
            ],
            bodyHtml: projectBodyHtml(project),
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
        const description =
          post.metaDescription ?? post.excerpt ?? DEFAULTS.description;
        const image = absoluteUrl(post.featuredImageUrl) ?? DEFAULTS.ogImage;
        const blogPostingLd = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description,
          image: absoluteUrl(post.featuredImageUrl) ?? undefined,
          datePublished: post.publishedAt ?? post.createdAt,
          dateModified: post.updatedAt,
          author: {
            "@type": "Person",
            name: "Sarah Islam",
            url: `${SITE_URL}/about`,
          },
          publisher: ORG_PUBLISHER,
          mainEntityOfPage: `${SITE_URL}${pathname}`,
        };
        return withDefaults(
          {
            title: withTitleSuffix(post.metaTitle ?? post.title),
            description,
            canonical: `${SITE_URL}${pathname}`,
            ogImage: image,
            ogType: "article",
            jsonLd: [
              blogPostingLd,
              breadcrumbLd([
                { name: "Home", url: "/" },
                { name: "Journal", url: "/journal" },
                { name: post.title, url: pathname },
              ]),
            ],
            bodyHtml: articleBodyHtml({
              title: post.title,
              contentHtml: post.content,
              publishedAt: post.publishedAt ?? post.createdAt,
            }),
          },
          pathname,
        );
      }
    } catch (err) {
      console.error("[seo] post lookup failed", err);
    }
  }

  // journal index: /journal — list recent posts as crawler-facing links + Blog schema
  if (pathname === "/journal") {
    const base = STATIC_ROUTES["/journal"] ?? {};
    try {
      const posts = (await storage.getPublishedBlogPosts()).slice(0, 20);
      const links = posts
        .map(
          (p: any) =>
            `<li><a href="/journal/post/${esc(p.slug)}">${esc(p.title)}</a></li>`,
        )
        .join("");
      const blogLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "the journal | sarahdigs",
        url: `${SITE_URL}/journal`,
        blogPost: posts.map((p: any) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${SITE_URL}/journal/post/${p.slug}`,
          datePublished: p.publishedAt ?? p.createdAt,
        })),
      };
      return withDefaults(
        {
          ...base,
          canonical: `${SITE_URL}/journal`,
          jsonLd: [blogLd],
          bodyHtml: `<main><h1>the journal</h1><ul>${links}</ul></main>`,
        },
        pathname,
      );
    } catch (err) {
      console.error("[seo] journal index lookup failed", err);
      return withDefaults(base, pathname);
    }
  }

  // service (offering) pages — server-render body + Service/FAQ schema
  const service = SERVICE_PAGES[pathname];
  if (service) {
    const jsonLd: object[] = [
      serviceLd({ ...service.service, url: pathname }),
      breadcrumbLd([
        { name: "Home", url: "/" },
        { name: service.service.name, url: pathname },
      ]),
    ];
    if (service.faqs?.length) jsonLd.push(faqLd(service.faqs));
    const faqHtml = service.faqs?.length
      ? `<section><h2>faq</h2><dl>${service.faqs
          .map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`)
          .join("")}</dl></section>`
      : "";
    return withDefaults(
      {
        title: service.metaTitle,
        description: service.metaDescription,
        canonical: `${SITE_URL}${pathname}`,
        jsonLd,
        bodyHtml: `<main><h1>${esc(service.h1)}</h1><p>${esc(service.intro)}</p>${faqHtml}</main>`,
      },
      pathname,
    );
  }

  // content pages (home / about / contact) — attach a crawler-facing body to
  // the page's existing meta so the body isn't an empty shell.
  const content = CONTENT_PAGES[pathname];
  if (content) {
    const baseMeta = STATIC_ROUTES[pathname] ?? {};
    const sectionsHtml = content.sections
      .map(
        (s) =>
          `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}<p>${esc(s.body)}</p>`,
      )
      .join("");
    return withDefaults(
      {
        ...baseMeta,
        canonical: `${SITE_URL}${pathname}`,
        bodyHtml: `<main><h1>${esc(content.h1)}</h1>${sectionsHtml}</main>`,
      },
      pathname,
    );
  }

  // static routes (checked before the catch-all /journal/:category so that
  // /journal itself uses its own STATIC_ROUTES entry)
  const staticMeta = STATIC_ROUTES[pathname];
  if (staticMeta) return withDefaults(staticMeta, pathname);

  // journal category: /journal/:category
  const categoryMatch = pathname.match(/^\/journal\/([^/]+)$/);
  if (categoryMatch) {
    try {
      const categories = await storage.getCategories();
      const category = categories.find((c) => c.slug === categoryMatch[1]);
      if (category) {
        const description =
          category.description ??
          `essays and field notes on ${category.name.toLowerCase()} from ${SITE_NAME}.`;
        return withDefaults(
          {
            title: withTitleSuffix(`${category.name} | journal`),
            description,
            canonical: `${SITE_URL}${pathname}`,
            jsonLd: [
              breadcrumbLd([
                { name: "Home", url: "/" },
                { name: "Journal", url: "/journal" },
                { name: category.name, url: pathname },
              ]),
            ],
          },
          pathname,
        );
      }
    } catch (err) {
      console.error("[seo] category lookup failed", err);
    }
  }

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

  // Inject server-rendered JSON-LD into <head> so crawlers that don't execute
  // JS still see structured data. (react-helmet adds the same client-side; this
  // is the crawler-facing copy.) Marked data-ssr-jsonld for clarity.
  // Every indexable page gets the sitewide Organization + WebSite entity,
  // then any page-specific schema (BlogPosting, CreativeWork, breadcrumbs…).
  const allJsonLd = meta.noindex
    ? meta.jsonLd ?? []
    : [...SITEWIDE_LD, ...(meta.jsonLd ?? [])];
  if (allJsonLd.length) {
    const blocks = allJsonLd
      .map(
        (obj) =>
          `    <script type="application/ld+json" data-ssr-jsonld>${jsonForScript(
            obj,
          )}</script>`,
      )
      .join("\n");
    out = out.replace(/<\/head>/i, `${blocks}\n  </head>`);
  }

  // Inject crawler-facing body content inside the (otherwise empty) #root div.
  // React's createRoot().render() replaces these children on mount, so users
  // get the full app while crawlers/no-JS clients see real article HTML.
  //
  // The content is wrapped in a visually-hidden container so human visitors
  // don't see a flash of unstyled text before React mounts (FOUC). We use the
  // clip/off-screen technique rather than display:none because some crawlers
  // ignore display:none content — this stays fully readable to Google/AI bots.
  if (meta.bodyHtml) {
    const hiddenWrap = `<div data-ssr-body style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">${meta.bodyHtml}</div>`;
    out = out.replace(
      /(<div id="root">)(\s*)(<\/div>)/i,
      `$1${hiddenWrap}$3`,
    );
  }

  return out;
}

/**
 * Serialize an object for safe embedding inside a <script type="application/ld+json">.
 * Escapes `<` so a "</script>" inside any string value can't close the tag early.
 */
function jsonForScript(obj: object): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
