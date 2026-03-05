import { ServiceLayout } from "@/components/service-layout";

export default function ServiceBrand() {
  const content = {
    hero: {
      title: "Brand & Strategy",
      subtitle: "Be the signal in the noise.",
      description: "We craft brands that don't just look good—they work. Positioning, messaging, and visual identity that connects with your ideal customer.",
      ctaBook: "Book a Free Consultation",
      ctaService: "Start Digging"
    },
    diagnostic: {
      title: "Is this for you?",
      items: [
        "Your brand feels scattered or outdated",
        "Customers don't understand what you do",
        "You look exactly like your competitors",
        "You're embarrassed to share your website",
        "Messaging changes every week"
      ]
    },
    promise: "We build cohesive brands that command attention and trust.",
    whatYouGet: {
      title: "What you'll get",
      description: "A complete brand overhaul that aligns how you look with who you are.",
      items: [
        { title: "Brand Positioning", desc: "Defining exactly where you sit in the market." },
        { title: "Visual Identity", desc: "A design system that is distinct and scalable." },
        { title: "Messaging Framework", desc: "How to talk so your customers listen." },
        { title: "Strategic Roadmap", desc: "How to roll out your new brand to the world." }
      ]
    },
    whatToExpect: {
      items: [
        "A clear brand position",
        "Visual consistency across channels",
        "Messaging that resonates",
        "Increased brand equity",
        "Confidence in your market presence",
        "Differentiation from competitors"
      ]
    },
    proof: {
      stat: "Brand Refresh",
      text: "See how we helped TechFlow redefine their market presence and scale organic traffic by 450%.",
      projectLink: "/projects/techflow",
      projectTitle: "TechFlow SaaS"
    },
    nextSteps: {
      steps: [
        { 
          title: "Book a Call", 
          desc: "We discuss your brand vision and gaps.",
          bullets: [
            "Brand perception audit",
            "Target audience clarification",
            "Competitive landscape review"
          ]
        },
        { 
          title: "The Workshop", 
          desc: "We define your core values and positioning.",
          bullets: [
            "Core values definition exercise",
            "Brand personality mapping",
            "Unique value proposition drafting"
          ]
        },
        { 
          title: "The Creation", 
          desc: "We build your new identity and strategy.",
          bullets: [
            "Visual identity system design",
            "Brand voice & tone guidelines",
            "Go-to-market launch strategy"
          ]
        }
      ]
    },
    finalCta: {
      title: "Ready to stand out?",
      subtitle: "Build a brand you're proud to show off.",
      buttonText: "Book Your Strategy Call",
      microProof: "Crafting brands that convert"
    }
  };

  return <ServiceLayout content={content} />;
}
