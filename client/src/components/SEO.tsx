import { Helmet } from "react-helmet-async";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const SITE_URL = "https://www.sarahdigs.com";
const SITE_NAME = "sarahdigs";
const DEFAULT_TITLE = "sarahdigs | creative website studio";
const DEFAULT_DESCRIPTION =
  "sarahdigs is a creative website studio that designs and builds high-performing websites for businesses. book a dig-in to get started.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.png`;

interface SEOProps {
  title?: string;
  /** If true, render `title` exactly as-is instead of appending "| SarahDigs". */
  exactTitle?: boolean;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  noindex?: boolean;
  jsonLd?: object | object[];
}

function absoluteUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function SEO({
  title,
  exactTitle,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noindex,
  jsonLd,
}: SEOProps) {
  const resolvedTitle = title
    ? exactTitle || title.toLowerCase().includes(SITE_NAME.toLowerCase())
      ? title // already branded — don't append a second "| sarahdigs"
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const resolvedCanonical = absoluteUrl(canonical) || SITE_URL;
  const resolvedOgImage = absoluteUrl(ogImage) || DEFAULT_OG_IMAGE;

  // Organization + WebSite are injected on every page; page-specific schema is appended.
  const pageJsonLd = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const jsonLdArray = [organizationSchema, websiteSchema, ...pageJsonLd];

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={resolvedCanonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={resolvedOgImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {jsonLdArray.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
