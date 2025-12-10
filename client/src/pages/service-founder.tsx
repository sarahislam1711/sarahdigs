import { ServiceLayout } from "@/components/service-layout";

export default function ServiceFounder() {
  const content = {
    hero: {
      title: "Founder-Led Growth",
      subtitle: "Scale yourself, scale your company.",
      description: "We help founders turn their personal expertise into a powerful distribution channel. Build authority, attract talent, and drive revenue through personal branding.",
      ctaBook: "Book a Free Consultation",
      ctaService: "Start Digging"
    },
    diagnostic: {
      title: "Is this for you?",
      items: [
        "You're the face of the company but have no time",
        "You have deep expertise but small reach",
        "You want to attract top talent and investors",
        "Marketing feels inauthentic to you",
        "You want to lead by example"
      ]
    },
    promise: "We turn your unique perspective into your company's biggest unfair advantage.",
    whatYouGet: {
      title: "What you'll get",
      description: "A system to extract, polish, and distribute your expertise without taking over your calendar.",
      items: [
        { title: "Narrative Design", desc: "Crafting your founder story and core pillars." },
        { title: "Content System", desc: "A workflow to produce high-quality content efficiently." },
        { title: "Platform Strategy", desc: "Dominate LinkedIn, Twitter/X, or your channel of choice." },
        { title: "Distribution Engine", desc: "Getting your ideas in front of the right people." }
      ]
    },
    whatToExpect: {
      items: [
        "Established thought leadership",
        "Inbound deal flow",
        "Easier recruiting",
        "Network expansion",
        "Trust at scale",
        "Authentic voice"
      ]
    },
    proof: {
      stat: "Authority",
      text: "Founders we work with see a 3x increase in inbound opportunities within 6 months.",
      projectLink: "/projects/techflow",
      projectTitle: "See our work with TechFlow"
    },
    nextSteps: {
      steps: [
        { 
          title: "Book a Call", 
          desc: "Let's see if founder-led growth fits you.",
          bullets: [
            "Personal goals alignment",
            "Current social presence review",
            "Time commitment assessment"
          ]
        },
        { 
          title: "The Extraction", 
          desc: "We interview you to get the gold out of your head.",
          bullets: [
            "Deep-dive interview sessions",
            "Content pillar development",
            "Voice & tone calibration"
          ]
        },
        { 
          title: "The Amplification", 
          desc: "We build the system to share it with the world.",
          bullets: [
            "Content calendar creation",
            "Platform distribution strategy",
            "Engagement workflow setup"
          ]
        }
      ]
    },
    finalCta: {
      title: "Ready to lead loudly?",
      subtitle: "Stop being the best kept secret in your industry.",
      buttonText: "Book Your Strategy Call",
      microProof: "Join founders building in public"
    }
  };

  return <ServiceLayout content={content} />;
}
