import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Briefcase, Code, Megaphone, User } from "lucide-react";
import { openCalendly } from "@/lib/calendly";

// Consultation content. Slugs preserved so existing links keep working.
const consultationData = {
  "strategic-deep-dive": {
    title: "strategic deep dive",
    subtitle: "a full read on your business model, market position, and growth levers.",
    description:
      "we go past surface metrics to the real drivers of your business. not just an audit, a strategic overhaul that finds where you're leaving money on the table.",
    outcomes: [
      "full technical and content audit",
      "competitor gap analysis",
      "prioritised growth roadmap (3, 6, 12 months)",
      "revenue projection modelling",
    ],
    benefit:
      "you leave with absolute clarity on your biggest bottlenecks and a step-by-step plan to fix them. no more 'what do we do next?' paralysis.",
    pricingOptions: [
      { duration: "30 min", price: "$150", desc: "quick audit & fixes" },
      { duration: "60 min", price: "$300", desc: "deep dive & roadmap" },
    ],
  },
  "ai-workflow-optimization": {
    title: "ai workflow optimization",
    subtitle: "ai integration tailored to your team structure and how you actually work.",
    description:
      "ai isn't just about generating text, it's operational efficiency. we build custom workflows that augment your team, cut manual work, and raise output quality.",
    outcomes: [
      "custom ai prompt library for your use cases",
      "integration plan for your existing tools",
      "team training on ai best practices",
      "efficiency impact report",
    ],
    benefit:
      "you get an implementation plan that fits your workflow, not generic advice. walk away with ready-to-use prompts and tools.",
    pricingOptions: [
      { duration: "30 min", price: "$150", desc: "tool stack review" },
      { duration: "60 min", price: "$300", desc: "full implementation plan" },
    ],
  },
  "leadership-advisory": {
    title: "leadership advisory",
    subtitle: "one-on-one guidance for founders and leaders navigating shifts.",
    description:
      "a confidential sounding board for marketing leaders and founders. we tackle high-level strategy, team structure, hiring calls, and navigating complex market shifts.",
    outcomes: [
      "bi-weekly strategy calls",
      "direct access for urgent questions",
      "a second opinion on major decisions",
      "executive briefing on market trends",
    ],
    benefit:
      "an experienced partner to stress-test your decisions before you make them. walk away confident in your direction.",
    pricingOptions: [
      { duration: "30 min", price: "$200", desc: "decision support" },
      { duration: "60 min", price: "$400", desc: "executive deep dive" },
    ],
  },
  "custom-growth-roadmap": {
    title: "custom growth roadmap",
    subtitle: "a bespoke, step-by-step plan to hit a specific business objective.",
    description:
      "you have a goal, we build the bridge to it. a tactical plan focused on one major objective, whether it's a product launch, market expansion, or turnaround.",
    outcomes: [
      "detailed execution plan with timelines",
      "resource and budget requirements",
      "risk assessment and mitigation",
      "success metrics and milestones",
    ],
    benefit:
      "turn a vague goal into a concrete plan. walk away with a document that says exactly what to do, when, and what to expect.",
    pricingOptions: [
      { duration: "30 min", price: "$150", desc: "goal assessment" },
      { duration: "60 min", price: "$300", desc: "full roadmap design" },
    ],
  },
};

const personas = [
  { icon: Briefcase, title: "founders", desc: "high-level direction without the cost of a full-time cmo." },
  { icon: Code, title: "technical leads", desc: "bridging the gap between product capabilities and market needs." },
  { icon: Megaphone, title: "marketers", desc: "upgrading their skills or getting a second opinion on strategy." },
  { icon: User, title: "ceos", desc: "clarity on roi and validation of the growth trajectory." },
];

export default function ConsultationDetail() {
  const [match, params] = useRoute("/dig-in-consultations/:slug");
  if (!match) return null;

  const slug = params.slug;
  const data = consultationData[slug as keyof typeof consultationData];

  if (!data) {
    return (
      <div className="min-h-screen bg-bone text-ink flex items-center justify-center font-sans">
        <div className="text-center px-6">
          <h1 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl lowercase mb-6">
            consultation <span className="text-oxblood">not found.</span>
          </h1>
          <Link href="/dig-in-consultations">
            <Button className="h-12 px-7 bg-oxblood hover:bg-oxblood-soft text-white rounded-md lowercase font-medium gap-2">
              back to consultations <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sarahdigs.com/" },
      { "@type": "ListItem", position: 2, name: "Consultations", item: "https://www.sarahdigs.com/dig-in-consultations" },
      { "@type": "ListItem", position: 3, name: data.title, item: `https://www.sarahdigs.com/dig-in-consultations/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title={`${data.title} | sarahdigs`}
        description={data.subtitle}
        canonical={`/dig-in-consultations/${slug}`}
        jsonLd={breadcrumbJsonLd}
      />
      <Navbar theme="light" />

      {/* ── HERO ── */}
      <section className="bg-bone pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <Link
            href="/dig-in-consultations"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-mid hover:text-oxblood transition-colors lowercase mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> back to consultations
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-oxblood/40" />
              <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">the dig-in consultation</span>
            </div>
            <h1 className="font-display font-semibold tracking-tighter text-5xl md:text-7xl leading-[0.95] lowercase mb-5">
              {data.title}
            </h1>
            <p className="font-display text-xl md:text-2xl text-ink font-medium italic lowercase leading-snug max-w-2xl">
              {data.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── WHO IT'S FOR (moved up, right under the hero) ── */}
      <section className="bg-bone pb-12 md:pb-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="border-t border-ink/10 pt-10 md:pt-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-oxblood/40" />
              <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">who it's for</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-1">
              {personas.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="flex items-start gap-4 py-5 border-b border-ink/10">
                    <span className="flex items-center justify-center w-10 h-10 rounded-md bg-oxblood/8 text-oxblood shrink-0">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-medium text-lg tracking-tight lowercase mb-1">{p.title}</h3>
                      <p className="text-ink-mid text-sm leading-snug lowercase">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone pb-20 md:pb-28">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* ── MAIN ── */}
            <div className="lg:col-span-8 space-y-14 md:space-y-16">
              {/* what you get */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-8 bg-oxblood/40" />
                  <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">what you get</span>
                </div>
                <p className="font-display text-2xl md:text-3xl text-ink leading-snug lowercase max-w-2xl mb-8">
                  {data.description}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                  {data.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-center gap-3 py-3 border-b border-ink/10">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-oxblood/10 shrink-0">
                        <Check className="w-3.5 h-3.5 text-oxblood" strokeWidth={3} />
                      </span>
                      <span className="text-base lowercase">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* the benefit — ink slab */}
              <div className="bg-ink text-bone rounded-md p-8 md:p-10">
                <span className="text-oxblood-tint font-semibold uppercase tracking-[0.22em] text-xs">the benefit</span>
                <p className="font-display font-medium text-2xl md:text-3xl tracking-tight leading-snug lowercase mt-4">
                  {data.benefit}
                </p>
              </div>
            </div>

            {/* ── SIDEBAR — book your session ── */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 border border-ink/12 rounded-md p-7 md:p-8 bg-stone/40">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px w-8 bg-oxblood/40" />
                  <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">book your session</span>
                </div>
                <p className="font-display text-2xl tracking-tight lowercase text-ink mb-6">
                  pick the depth that <span className="text-oxblood italic">fits.</span>
                </p>

                <div className="space-y-3 mb-7">
                  {data.pricingOptions.map((option) => (
                    <div
                      key={option.duration}
                      className="group flex items-start gap-4 border border-ink/10 rounded-md p-4 hover:border-oxblood/40 transition-colors cursor-pointer"
                    >
                      <span className="font-display font-semibold text-lg text-oxblood tabular-nums shrink-0 leading-snug">{option.duration}</span>
                      <p className="text-sm text-ink-mid lowercase leading-snug group-hover:text-ink transition-colors">{option.desc}</p>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-14 text-base bg-oxblood hover:bg-oxblood-soft text-white rounded-md font-medium lowercase gap-2 cursor-pointer"
                  onClick={() => openCalendly({ tier: "dig-in consultation" })}
                >
                  book a session <ArrowRight className="w-4 h-4" />
                </Button>

                <p className="text-ink-mid text-xs leading-relaxed lowercase mt-5 text-center">
                  a focused call, a written plan, and clear direction. we'll confirm scope and details before anything's booked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
