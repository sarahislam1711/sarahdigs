import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Calendar, ArrowLeft, User, Code, Megaphone, Briefcase, Clock, Star, Phone } from "lucide-react";
import { openCalendly } from "@/lib/calendly";

// Mock data for the consultations (mirroring what's in dig-in-consultations.tsx but with more detail)
const consultationData = {
  "strategic-deep-dive": {
    title: "Strategic Deep Dive",
    subtitle: "Comprehensive analysis of your business model, market position, and growth levers.",
    description: "We go beyond surface-level metrics to understand the fundamental drivers of your business. This isn't just an audit; it's a complete strategic overhaul designed to identify where you're leaving money on the table.",
    outcomes: [
      "Full technical and content audit report",
      "Competitor gap analysis",
      "Prioritized growth roadmap (3, 6, 12 months)",
      "Revenue projection modeling"
    ],
    benefit: "You'll walk away with absolute clarity on your biggest bottlenecks and a step-by-step roadmap to fix them. This session eliminates the 'what should we do next?' paralysis.",
    valueProp: "Stop guessing what works. Get a data-backed blueprint for your next phase of growth.",
    pricingOptions: [
      { duration: "30 Min", price: "$150", desc: "Quick Audit & Fixes" },
      { duration: "60 Min", price: "$300", desc: "Deep Dive & Roadmap" }
    ]
  },
  "ai-workflow-optimization": {
    title: "AI Workflow Optimization",
    subtitle: "Tailoring AI integration to your specific team structure and operational needs.",
    description: "AI isn't just about generating text; it's about operational efficiency. I help you build custom AI workflows that augment your team's capabilities, reduce manual grunt work, and increase output quality.",
    outcomes: [
      "Custom AI prompt library for your specific use cases",
      "Integration plan for existing tool stack",
      "Team training session on AI best practices",
      "Efficiency impact report"
    ],
    benefit: "You'll get a customized AI implementation plan that actually fits your workflow, not generic advice. Walk away with ready-to-use prompts and tools.",
    valueProp: "Scale your output without scaling your headcount.",
    pricingOptions: [
      { duration: "30 Min", price: "$150", desc: "Tool Stack Review" },
      { duration: "60 Min", price: "$300", desc: "Full Implementation Plan" }
    ]
  },
  "leadership-advisory": {
    title: "Leadership Advisory",
    subtitle: "One-on-one guidance for executives on navigating market shifts and technology trends.",
    description: "A confidential sounding board for marketing leaders and founders. We tackle high-level strategy, team structure, hiring decisions, and navigating complex market shifts.",
    outcomes: [
      "Bi-weekly strategy calls",
      "Direct access for urgent questions",
      "Second opinion on major decisions",
      "Executive briefing on market trends"
    ],
    benefit: "Gain an experienced partner to stress-test your decisions before you make them. Walk away with confidence in your strategic direction.",
    valueProp: "Navigate uncertainty with confidence and expert backing.",
    pricingOptions: [
      { duration: "30 Min", price: "$200", desc: "Decision Support" },
      { duration: "60 Min", price: "$400", desc: "Executive Deep Dive" }
    ]
  },
  "custom-growth-roadmap": {
    title: "Custom Growth Roadmap",
    subtitle: "Developing a bespoke step-by-step plan to achieve your specific business objectives.",
    description: "You have a goal? I build the bridge to get you there. This is a highly specific, tactical plan focused on achieving a singular major business objective, whether it's a product launch, market expansion, or turnaround.",
    outcomes: [
      "Detailed execution plan with timelines",
      "Resource and budget requirements",
      "Risk assessment and mitigation strategies",
      "Success metrics and milestones"
    ],
    benefit: "Turn a vague goal into a concrete action plan. Walk away with a document that tells you exactly what to do, when to do it, and what to expect.",
    valueProp: "Turn your ambitious goals into a clear, step-by-step execution plan.",
    pricingOptions: [
      { duration: "30 Min", price: "$150", desc: "Goal Assessment" },
      { duration: "60 Min", price: "$300", desc: "Full Roadmap Design" }
    ]
  }
};

const personas = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Founders",
    desc: "Looking for high-level direction without the cost of a full-time CMO."
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Technical Leads",
    desc: "Needing to bridge the gap between product capabilities and market needs."
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: "Marketers",
    desc: "Wanting to upgrade their skills or get a second opinion on their strategy."
  },
  {
    icon: <User className="w-6 h-6" />,
    title: "CEOs",
    desc: "Seeking clarity on ROI and validation of their company's growth trajectory."
  }
];

export default function ConsultationDetail() {
  const [match, params] = useRoute("/services/consultations/:slug");
  
  if (!match) return null;

  const slug = params.slug;
  const data = consultationData[slug as keyof typeof consultationData];

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FBFCFE] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Consultation Not Found</h1>
          <Link href="/services/consultations">
            <Button>Return to Consultations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <Link href="/services/consultations" className="inline-flex items-center text-[#1B1B1B]/60 hover:text-[#4D00FF] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Consultations
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-16">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-[#1B1B1B]">
                {data.title}
              </h1>
              <div className="inline-block bg-[#F4F2FF] text-[#4D00FF] px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm border border-[#4D00FF]/20">
                {data.subtitle}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-16">
                
                {/* Who is this for */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#1B1B1B]">Who is this for?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {personas.map((persona, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-[#1B1B1B]/10 flex flex-col gap-3 hover:border-[#4D00FF]/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-[#F4F2FF] flex items-center justify-center text-[#4D00FF]">
                          {persona.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{persona.title}</h4>
                          <p className="text-[#1B1B1B]/70 text-sm leading-relaxed">{persona.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold mb-4 text-[#1B1B1B]">What you get</h3>
                  <p className="text-[#1B1B1B]/80 leading-relaxed text-lg mb-6">
                    {data.description}
                  </p>
                  <div className="bg-white rounded-3xl p-8 border border-[#1B1B1B]/10 shadow-sm mb-8">
                    <h4 className="font-bold text-lg mb-4 uppercase tracking-wider text-[#4D00FF]">Outcomes</h4>
                    <ul className="space-y-4">
                      {data.outcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-[#4D00FF] shrink-0 mt-0.5" />
                          <span className="text-lg text-[#1B1B1B]/80">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                   <div className="bg-[#F4F2FF] rounded-3xl p-8 border border-[#4D00FF]/10">
                     <h4 className="font-bold text-lg mb-2 uppercase tracking-wider text-[#4D00FF]">The Benefit</h4>
                    <p className="text-xl font-medium text-[#1B1B1B]">
                      {data.benefit}
                    </p>
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#1B1B1B]">Why work with me?</h3>
                  <div className="bg-[#1B1B1B] text-white rounded-3xl p-8 relative overflow-hidden">
                     {/* Abstract bg shape */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#4D00FF] via-transparent to-transparent" />
                    
                    <div className="relative z-10 space-y-6">
                      <p className="text-lg leading-relaxed text-white/90">
                        I've spent over a decade not just advising, but <strong>doing</strong>. I've led growth for startups, optimized enterprise-level SEO strategies, and built products from scratch. I don't give you theory; I give you what works in the trenches.
                      </p>
                      <div className="flex flex-wrap gap-4">
                         <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">10+ Years Experience</div>
                         <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">$50M+ Revenue Generated</div>
                         <div className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">50+ Happy Clients</div>
                      </div>
                      <div className="pt-6 border-t border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="flex text-[#4D00FF]">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                          </div>
                          <p className="text-sm text-white/60 italic">"The most actionable hour I've spent on my business this year." — Sarah J., Founder</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sidebar / CTA */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 z-10 bg-white border border-[#1B1B1B]/10 rounded-3xl p-8 shadow-xl">
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">Pricing Options</h3>
                    <p className="text-[#1B1B1B]/60 text-sm">Choose the duration that fits your needs</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {data.pricingOptions.map((option, i) => (
                      <div key={i} className="border border-[#1B1B1B]/10 rounded-xl p-4 hover:border-[#4D00FF] hover:bg-[#F4F2FF] transition-all cursor-pointer group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-lg group-hover:text-[#4D00FF]">{option.duration}</span>
                          <span className="font-bold text-xl">{option.price}</span>
                        </div>
                        <p className="text-sm text-[#1B1B1B]/60">{option.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <Button className="w-full h-14 text-lg bg-[#1B1B1B] text-white hover:bg-[#4D00FF] hover:text-white transition-colors rounded-xl font-bold shadow-lg cursor-pointer" onClick={() => openCalendly()}>
                      Book a Session
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    
                     <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-[#1B1B1B]/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-[#1B1B1B]/40 font-bold tracking-widest">Or</span>
                        </div>
                      </div>

                    <Button variant="outline" className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-9 px-4 py-2 w-full h-14 border-[#1B1B1B]/20 text-[#1B1B1B] hover:bg-[#1B1B1B]/5 hover:text-[#4D00FF] rounded-xl text-[16px]">
                      <Phone className="mr-2 w-5 h-5" />
                      Free Discovery Call
                    </Button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-[#1B1B1B]/40 text-xs leading-relaxed">
                      Not ready to commit? The discovery call is 15 minutes to see if we're a good fit. No sales pressure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
