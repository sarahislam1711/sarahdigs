// Centralised JSON-LD structured-data helpers for SEO.
// Keep the brand entity consistent: sarahdigs is a creative website design studio.

const SITE = "https://www.sarahdigs.com";

// Social / external profiles that represent the sarahdigs entity.
const SAME_AS: string[] = [
  "https://www.linkedin.com/in/sarahislamm/",
];

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE}${path.startsWith("/") ? "" : "/"}${path}`);

// ── Organization — the brand entity. Inject site-wide. ──
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "sarahdigs",
  alternateName: "SarahDigs",
  url: SITE,
  logo: `${SITE}/favicon.png`,
  email: "sarah@sarahdigs.com",
  description:
    "sarahdigs is a creative website studio that designs and builds high-performing websites for businesses.",
  founder: { "@type": "Person", name: "Sarah Islam" },
  contactPoint: {
    "@type": "ContactPoint",
    email: "sarah@sarahdigs.com",
    contactType: "customer support",
  },
  knowsAbout: [
    "Website Design",
    "Web Development",
    "Brand Strategy",
    "UX Design",
    "SEO",
    "Conversion Optimization",
  ],
  ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
};

// ── WebSite — enables sitelinks / site identity. Inject site-wide. ──
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "sarahdigs",
  url: SITE,
  publisher: { "@id": `${SITE}/#organization` },
};

// ── Service — for the offering pages (full dig, custom dig, dig-in). ──
export function serviceSchema(opts: {
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
    url: abs(opts.url),
    ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
    provider: { "@id": `${SITE}/#organization` },
    areaServed: "Worldwide",
  };
}

// ── FAQPage — for pages with a real Q&A list (rich snippets). ──
export function faqSchema(items: { q: string; a: string }[]) {
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

// ── BreadcrumbList — reusable trail builder. ──
export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.url),
    })),
  };
}

// ── CreativeWork — for a portfolio/case-study project (the built website). ──
export function projectSchema(opts: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
  industry?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    ...(opts.image ? { image: abs(opts.image) } : {}),
    ...(opts.industry ? { about: opts.industry } : {}),
    creator: { "@id": `${SITE}/#organization` },
  };
}

// ── CollectionPage — for index pages like /projects, /journal. ──
export function collectionPageSchema(opts: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    isPartOf: { "@id": `${SITE}/#website` },
  };
}

// ── Generic typed page (AboutPage / ContactPage / Blog). ──
export function pageSchema(type: "AboutPage" | "ContactPage" | "Blog", opts: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    isPartOf: { "@id": `${SITE}/#website` },
  };
}
