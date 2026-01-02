import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ServiceLayout } from "@/components/service-layout";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Loader2 } from "lucide-react";

export default function ServicePage() {
  const [, params] = useRoute("/services/:slug");
  const slug = params?.slug;

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["/api/services", slug],
    queryFn: async () => {
      const res = await fetch(`/api/services/${slug}`);
      if (!res.ok) throw new Error("Service not found");
      return res.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFCFE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4D00FF]" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#FBFCFE]">
        <Navbar />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Transform database service to ServiceLayout format
  const content = {
    hero: {
      title: service.heroTitle || service.title,
      subtitle: service.heroSubtitle || "",
      description: service.heroDescription || service.shortDescription || "",
      ctaBook: service.ctaBookText || "Book a Free Consultation",
      ctaService: service.ctaServiceText || "Learn More",
    },
    diagnostic: {
      title: service.diagnosticTitle || "Is this for you?",
      items: service.diagnosticItems || [],
    },
    promise: service.promiseText || "",
    whatYouGet: {
      title: service.whatYouGetTitle || "What you'll get",
      description: service.whatYouGetDescription || "",
      items: (service.whatYouGetItems || []).map((item: any) => ({
        title: item.title,
        desc: item.description,
      })),
      images: service.whatYouGetImages || [],
    },
    whatToExpect: {
      items: service.whatToExpectItems || [],
    },
    proof: {
      stat: service.proofStat || "",
      text: service.proofText || "",
      projectLink: service.proofProjectLink || "",
      projectTitle: service.proofProjectTitle || "",
      beforeImage: service.proofBeforeImage || "",
      afterImage: service.proofAfterImage || "",
    },
    nextSteps: {
      steps: (service.nextSteps || []).map((step: any) => ({
        title: step.title,
        desc: step.description,
        bullets: step.bullets || [],
      })),
    },
    finalCta: {
      title: service.finalCtaTitle || "Ready to get started?",
      subtitle: service.finalCtaSubtitle || "",
      buttonText: service.finalCtaButtonText || "Book a Call",
      microProof: service.finalCtaMicroProof || "",
    },
  };

  return <ServiceLayout content={content} />;
}