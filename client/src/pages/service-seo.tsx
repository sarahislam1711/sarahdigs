import { ServiceLayout } from "@/components/service-layout";

export default function ServiceSEO() {
  const content = {
    hero: {
      title: "SEO & Organic Growth",
      subtitle: "Stop renting your audience. Start owning it.",
      description: "We build data-backed organic growth engines that compound over time. No hacks, just deep technical foundations and content that converts.",
      ctaBook: "Book a Free Consultation",
      ctaService: "Start Digging"
    },
    diagnostic: {
      title: "Is this for you?",
      items: [
        "You have traffic but it doesn't convert",
        "You've been hit by an algorithm update and can't recover",
        "You're publishing content but nobody is reading it",
        "You want to reduce reliance on paid ads",
        "Technical SEO feels like a black box"
      ]
    },
    promise: "We turn search into your most profitable, predictable revenue channel.",
    whatYouGet: {
      title: "What you'll get",
      description: "A comprehensive excavation of your current organic performance and a roadmap to market dominance.",
      items: [
        { title: "Technical Deep Dive", desc: "Full audit of crawlability, indexability, and site architecture." },
        { title: "Keyword Excavation", desc: "Finding high-intent terms your competitors are missing." },
        { title: "Content Strategy", desc: "A calendar of content designed to rank and convert." },
        { title: "Authority Building", desc: "Ethical link acquisition strategies that actually work." }
      ]
    },
    whatToExpect: {
      items: [
        "Clear roadmap for 6-12 months",
        "Fixes for critical technical debt",
        "Content that drives qualified leads",
        "Transparent monthly reporting",
        "Sustainable traffic growth",
        "Reduced CAC"
      ]
    },
    proof: {
      stat: "+450% Traffic",
      text: "See how we helped TechFlow scale their organic traffic from 5k to 50k monthly visitors in just 12 months.",
      projectLink: "/projects/techflow",
      projectTitle: "TechFlow SaaS"
    },
    nextSteps: {
      steps: [
        { 
          title: "Book a Call", 
          desc: "We discuss your current challenges and goals.",
          bullets: [
            "Review current performance metrics",
            "Discuss immediate growth goals",
            "Identify technical blockers"
          ]
        },
        { 
          title: "The Audit", 
          desc: "We dig deep into your data to find the opportunities.",
          bullets: [
            "Comprehensive technical health check",
            "Competitor gap analysis",
            "Keyword opportunity mapping"
          ]
        },
        { 
          title: "The Roadmap", 
          desc: "We present a clear plan of action to hit your targets.",
          bullets: [
            "Prioritized action plan",
            "Resource & timeline estimation",
            "Projected traffic & revenue impact"
          ]
        }
      ]
    },
    finalCta: {
      title: "Ready to grow organically?",
      subtitle: "Stop guessing and start growing with data-backed SEO.",
      buttonText: "Book Your Strategy Call",
      microProof: "Join 50+ founders scaling with organic search"
    }
  };

  return <ServiceLayout content={content} />;
}
