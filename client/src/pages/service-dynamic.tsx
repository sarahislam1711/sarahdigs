import { ServiceLayout } from "@/components/service-layout";
import { useQuery } from "@tanstack/react-query";
import type { Service } from "@shared/schema";
import { useParams } from "wouter";
import { Loader2 } from "lucide-react";
import SEO from "@/components/SEO";

interface ServiceContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaBook: string;
    ctaService: string;
  };
  diagnostic: {
    title: string;
    items: string[];
  };
  promise: string;
  whatYouGet: {
    title: string;
    description: string;
    items: { title: string; desc: string }[];
  };
  whatToExpect: {
    items: string[];
  };
  proof: {
    stat: string;
    text: string;
    projectLink: string;
    projectTitle: string;
  };
  nextSteps: {
    steps: { title: string; desc: string; bullets: string[] }[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    buttonText: string;
    microProof: string;
  };
}

function transformServiceToContent(service: Service): ServiceContent {
  return {
    hero: {
      title: service.heroTitle || service.title,
      subtitle: service.heroSubtitle || "",
      description: service.heroDescription || service.shortDescription || "",
      ctaBook: service.ctaBookText || "Book a Free Consultation",
      ctaService: service.ctaServiceText || "Start Digging"
    },
    diagnostic: {
      title: service.diagnosticTitle || "Is this for you?",
      items: service.diagnosticItems || []
    },
    promise: service.promiseText || "",
    whatYouGet: {
      title: service.whatYouGetTitle || "What you'll get",
      description: service.whatYouGetDescription || "",
      items: (service.whatYouGetItems as { title: string; desc: string }[] | null) || []
    },
    whatToExpect: {
      items: service.whatToExpectItems || []
    },
    proof: {
      stat: service.proofStat || "",
      text: service.proofText || "",
      projectLink: service.proofProjectLink || "",
      projectTitle: service.proofProjectTitle || ""
    },
    nextSteps: {
      steps: (service.nextSteps as { title: string; desc: string; bullets: string[] }[] | null) || []
    },
    finalCta: {
      title: service.finalCtaTitle || "",
      subtitle: service.finalCtaSubtitle || "",
      buttonText: service.finalCtaButtonText || "Book Your Strategy Call",
      microProof: service.finalCtaMicroProof || ""
    }
  };
}

interface ServiceDynamicProps {
  slug?: string;
}

export default function ServiceDynamic({ slug: slugProp }: ServiceDynamicProps = {}) {
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;

  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: ["/api/services", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B1421]" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const content = transformServiceToContent(service);

  const description = service.heroDescription || service.shortDescription || undefined;

  // Flagship service lives at /the-full-dig; all others use /services/<slug>
  const canonicalPath = service.slug === "seo" ? "/the-full-dig" : `/services/${service.slug}`;
  const canonicalUrl = `https://www.sarahdigs.com${canonicalPath}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description,
    url: canonicalUrl,
    provider: { "@type": "Organization", name: "SarahDigs", url: "https://www.sarahdigs.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sarahdigs.com/" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://www.sarahdigs.com/" },
      { "@type": "ListItem", position: 3, name: service.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <SEO
        title={service.title}
        description={description}
        canonical={canonicalPath}
        jsonLd={[serviceJsonLd, breadcrumbJsonLd]}
      />
      <ServiceLayout content={content} />
    </>
  );
}
