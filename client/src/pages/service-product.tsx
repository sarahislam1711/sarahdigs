import { ServiceLayout } from "@/components/service-layout";

export default function ServiceProduct() {
  const content = {
    hero: {
      title: "Product-Led Marketing",
      subtitle: "Let your product do the talking.",
      description: "Shift from traditional marketing to product-led growth. We help you build loops that turn users into advocates and features into marketing assets.",
      ctaBook: "Book a Free Consultation",
      ctaService: "Start Digging"
    },
    diagnostic: {
      title: "Is this for you?",
      items: [
        "Users sign up but don't activate",
        "Your product is great but hard to explain",
        "Marketing and Product teams are siloed",
        "You rely heavily on sales-led motion",
        "Churn is higher than you'd like"
      ]
    },
    promise: "We align your product value with your marketing message to drive autonomous growth.",
    whatYouGet: {
      title: "What you'll get",
      description: "A strategy that puts your product at the center of your growth engine.",
      items: [
        { title: "User Journey Mapping", desc: "Identifying friction points and activation opportunities." },
        { title: "Onboarding Optimization", desc: "Turning signups into active, power users." },
        { title: "Viral Loop Design", desc: "Mechanisms that encourage users to invite others." },
        { title: "Product Messaging", desc: "Copy that highlights value, not just features." }
      ]
    },
    whatToExpect: {
      items: [
        "Higher activation rates",
        "Lower customer acquisition costs",
        "Better retention and LTV",
        "Product-market fit clarity",
        "Aligned teams",
        "Scalable growth loops"
      ]
    },
    proof: {
      stat: "150+ Leads/Mo",
      text: "How FinSmart built a content engine that drives qualified product signups on autopilot.",
      projectLink: "/projects/finsmart",
      projectTitle: "FinSmart"
    },
    nextSteps: {
      steps: [
        { 
          title: "Book a Call", 
          desc: "Let's look at your current user flows.",
          bullets: [
            "Product walkthrough & demo",
            "Review current funnel metrics",
            "Discuss user feedback loops"
          ]
        },
        { 
          title: "The Analysis", 
          desc: "We identify where users are dropping off.",
          bullets: [
            "User session recordings analysis",
            "Activation flow friction audit",
            "Churn trigger identification"
          ]
        },
        { 
          title: "The Growth Plan", 
          desc: "We implement product-led strategies to fix leaks.",
          bullets: [
            "Quick-win optimization list",
            "Viral loop experiment backlog",
            "Long-term retention strategy"
          ]
        }
      ]
    },
    finalCta: {
      title: "Turn your product into a magnet.",
      subtitle: "Stop pushing users. Start pulling them in.",
      buttonText: "Book Your Strategy Call",
      microProof: "Proven strategies for SaaS & Digital Products"
    }
  };

  return <ServiceLayout content={content} />;
}
