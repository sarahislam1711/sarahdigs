import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.sarahdigs.com";
const SITE_NAME = "SarahDigs";
const DEFAULT_TITLE = "SarahDigs | SEO, Content & Growth Strategy";
const DEFAULT_DESCRIPTION =
  "SarahDigs helps brands grow organically through SEO, content strategy, and data-driven marketing. Book a free consultation today.";
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
    ? exactTitle
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const resolvedCanonical = absoluteUrl(canonical) || SITE_URL;
  const resolvedOgImage = absoluteUrl(ogImage) || DEFAULT_OG_IMAGE;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

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
