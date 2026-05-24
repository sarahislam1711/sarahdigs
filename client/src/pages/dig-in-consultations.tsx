import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowDown, Sparkles, Brain, LineChart, BookOpen, Mail, Zap, FileText, MessageSquare, X, Check, Loader2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { openCalendly } from "@/lib/calendly";

interface ConsultationType {
  title: string;
  slug: string;
  desc: string;
  iconName: string;
  color: string;
}

const iconComponents = {
  Sparkles,
  Brain,
  LineChart,
  Zap,
  BookOpen,
  Mail,
  FileText,
  MessageSquare,
};

type IconName = keyof typeof iconComponents;

const getIconComponent = (iconName: string): React.ElementType => {
  if (iconName in iconComponents) {
    return iconComponents[iconName as IconName];
  }
  return Sparkles;
};

const defaultConsultations: ConsultationType[] = [
  { title: "Strategic Deep Dive", slug: "strategic-deep-dive", desc: "Comprehensive analysis of your business model, market position, and growth levers.", iconName: "Sparkles", color: "bg-[#1B1B1B]" },
  { title: "AI Workflow Optimization", slug: "ai-workflow-optimization", desc: "Tailoring AI integration to your specific team structure and operational needs.", iconName: "Brain", color: "bg-[#6B1421]" },
  { title: "Leadership Advisory", slug: "leadership-advisory", desc: "One-on-one guidance for executives on navigating market shifts and technology trends.", iconName: "LineChart", color: "bg-[#E7E2D6] text-[#181612] border-[#181612]/10" },
];

// ──────────────────────────────────────────────────────────────────────────────
// Lead magnet popup
// TODO (lead-magnet email automation):
//   When email tool is set up (Resend / Postmark / SendGrid):
//   1. Replace this popup's POST to /api/contact with a dedicated /api/lead-magnet route
//   2. Backend should send the appropriate resource based on `kind`:
//      - kind="article" → email the "how I think about websites" article
//      - kind="sample"  → email the sanitized sample action plan
//   3. Upload the actual resources somewhere linkable (Drive / public URL)
//   4. Remove this TODO once wired
// ──────────────────────────────────────────────────────────────────────────────
type LeadMagnetKind = "article" | "sample";

const LEAD_MAGNETS: Record<LeadMagnetKind, { title: string; description: string; successMessage: string }> = {
  article: {
    title: "get the article",
    description: "drop your email and i'll send you a short read on how sarahdigs approaches website strategy, design, and growth.",
    successMessage: "the article is on its way to your inbox.",
  },
  sample: {
    title: "get the sample plan",
    description: "drop your email and i'll send you a sanitized example of the kind of action plan you'll receive after a dig-in session.",
    successMessage: "the sample plan is on its way to your inbox.",
  },
};

const LeadMagnetPopup = ({
  isOpen,
  kind,
  onClose,
}: {
  isOpen: boolean;
  kind: LeadMagnetKind | null;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async (userEmail: string) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: kind === "article" ? "Lead Magnet: Article" : "Lead Magnet: Sample Plan",
          email: userEmail,
          companyWebsite: "",
          jobRole: "Not specified",
          companySize: "Not specified",
          projectType: kind === "article" ? "Lead Magnet — Article" : "Lead Magnet — Sample Plan",
          budget: "Not specified",
          message: `User requested the "${kind}" lead magnet from the dig-in consultations page. Email: ${userEmail}`,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  const handleClose = () => {
    setShowSuccess(false);
    mutation.reset();
    onClose();
  };

  const content = kind ? LEAD_MAGNETS[kind] : null;

  return (
    <AnimatePresence>
      {isOpen && content && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-bone rounded-md p-8 md:p-10 max-w-md w-full mx-6 shadow-2xl border border-ink/10 relative"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone flex items-center justify-center text-ink-mid hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {showSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-oxblood rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-bone" />
                </div>
                <h3 className="font-display font-bold text-2xl text-ink mb-3 lowercase">you're on the list</h3>
                <p className="text-ink-mid leading-relaxed lowercase">{content.successMessage}</p>
                <Button
                  onClick={handleClose}
                  className="mt-6 bg-oxblood hover:bg-oxblood-soft text-bone rounded-md px-8 lowercase font-medium"
                >
                  got it
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 text-oxblood text-[10px] font-mono uppercase tracking-[0.22em]">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-oxblood" />
                    <span>free</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink mb-3 lowercase">{content.title}</h3>
                  <p className="text-ink-mid text-sm leading-relaxed lowercase">{content.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full p-4 bg-[#FBF9F3] border border-ink/15 rounded-md focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none text-ink placeholder:text-ink/30 transition-all"
                  />
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    size="lg"
                    className="w-full h-14 bg-oxblood hover:bg-oxblood-soft text-bone rounded-md lowercase font-medium gap-2"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        sending...
                      </>
                    ) : (
                      <>
                        send it to me <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {mutation.isError && (
                  <p className="text-red-500 text-sm text-center mt-3 lowercase">
                    something went wrong. please try again.
                  </p>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 1 — HERO
// ──────────────────────────────────────────────────────────────────────────────
const Hero = () => {
  const scrollToHow = () =>
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="h-screen bg-bone relative flex flex-col overflow-hidden">
      {/* Top meta rail */}
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl pt-24 md:pt-28">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4 text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
          <span>sarahdigs · creative website studio</span>
          <span className="hidden md:inline">vol. 02 · dig-in</span>
          <span>2026</span>
        </div>
      </div>

      {/* Centered content */}
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl flex-1 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center w-full max-w-5xl mx-auto"
        >
          {/* Anchor pill — centered */}
          <div className="inline-flex items-center gap-2.5 mb-8 bg-oxblood text-bone rounded-full pl-3 pr-4 py-2">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-bone opacity-75 animate-ping" />
              <span className="relative inline-block w-2 h-2 rounded-full bg-bone" />
            </span>
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em]">
              the dig-in consultation
            </span>
          </div>

          <h1 className="font-display font-semibold tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] lowercase mb-8">
            you know <span className="text-oxblood italic font-bold">something's off.</span>
            <br />
            you just don't know what to fix first.
          </h1>

          <p className="font-display text-xl md:text-2xl text-ink font-medium italic lowercase leading-snug max-w-2xl mx-auto mb-12">
            a focused call. a custom <span className="text-oxblood">action plan</span> delivered after. clear direction for your business.
          </p>

          {/* CTA + secondary scroll link */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Button
              size="lg"
              onClick={() => openCalendly({ tier: "dig-in consultation" })}
              className="text-base h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2"
            >
              book a dig-in <ArrowRight className="w-4 h-4" />
            </Button>
            <button
              onClick={scrollToHow}
              className="text-ink hover:text-oxblood transition-colors text-sm font-medium lowercase inline-flex items-center gap-2 cursor-pointer"
            >
              or see how it works <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl pb-8">
        <div className="flex items-center justify-between border-t border-ink/10 pt-5 text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
          <span>start here ↓</span>
          <span className="hidden md:inline">section 01 / 07</span>
          <span className="inline-flex items-center gap-2">
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-oxblood opacity-75 animate-ping" />
              <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-oxblood" />
            </span>
            booking now
          </span>
        </div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 2 — SOUNDS FAMILIAR (pain points)
// ──────────────────────────────────────────────────────────────────────────────
const SOUNDS_FAMILIAR = [
  {
    num: "01",
    headline: "your website isn't bringing in business.",
    body: "we dig in & figure out whether it's positioning, design, visibility or all three.",
  },
  {
    num: "02",
    headline: "you're about to invest in a rebuild and don't want to waste money.",
    body: "we help you understand exactly what you need before you commit to anything.",
  },
  {
    num: "03",
    headline: "you don't know if the problem is your website, your marketing, or both.",
    body: "we diagnose what's actually broken and give you a clear order of operations.",
  },
];

const SoundsFamiliar = () => {
  return (
    <section className="bg-bone py-16 md:py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="mb-12 md:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-oxblood/40" />
            <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
              sounds familiar?
            </span>
          </div>
          <h2 className="font-display font-bold tracking-tighter text-4xl md:text-5xl leading-none lowercase max-w-3xl">
            3 reasons people book a <span className="text-oxblood">dig-in</span>
          </h2>
        </div>

        {/* Connected sequence of numbered statements */}
        <div className="h-px bg-oxblood/30" />
        {SOUNDS_FAMILIAR.map((item, i) => (
          <motion.div
            key={item.num}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
            className="group grid grid-cols-12 gap-4 md:gap-8 py-7 md:py-9 border-b border-ink/10 transition-colors duration-300 hover:border-oxblood/40"
          >
            <div className="col-span-12 md:col-span-2">
              <span className="font-display font-extrabold text-oxblood text-3xl md:text-4xl tabular-nums tracking-tighter leading-none block transition-colors duration-300 group-hover:text-ink">
                {item.num}
              </span>
            </div>
            <div className="col-span-12 md:col-span-10 space-y-2 md:space-y-3">
              <h3 className="font-display font-medium text-xl md:text-2xl tracking-tight lowercase leading-tight">
                {item.headline}
              </h3>
              <p className="text-ink-mid text-[15px] md:text-base leading-relaxed lowercase max-w-2xl">
                {item.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// CONSULTATIONS CAROUSEL (kept from original, brand-aligned)
// ──────────────────────────────────────────────────────────────────────────────
const ConsultationsCarousel = ({ consultations }: { consultations: ConsultationType[] }) => {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: false });

  return (
    <section className="pt-12 pb-24 bg-bone">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-oxblood/40" />
            <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
              consultation types
            </span>
          </div>
          <h2 className="font-display font-bold tracking-tighter text-3xl md:text-4xl lowercase max-w-3xl">
            every session, tailored.
          </h2>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6">
            {consultations.map((consultation, i) => {
              const IconComponent = getIconComponent(consultation.iconName);
              const isLightBg = consultation.color.includes("bg-[#E7E2D6]") || consultation.color.includes("bg-bone") || consultation.color.includes("bg-stone");
              return (
                <div key={i} className="flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_33.4%] pl-6 min-w-0">
                  <div className={`h-full rounded-md p-6 md:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-80 transition-transform hover:-translate-y-2 hover:shadow-2xl ${consultation.color} ${consultation.color.includes("border") ? "border" : ""}`}>
                    <div>
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-6 ${isLightBg ? "bg-ink text-bone" : "bg-white/10 text-white"}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className={`font-display font-bold text-2xl tracking-tight lowercase mb-3 ${isLightBg ? "text-ink" : "text-bone"}`}>
                        {consultation.title}
                      </h3>
                      <p className={`text-[15px] leading-relaxed lowercase ${isLightBg ? "text-ink-mid" : "text-bone/70"}`}>
                        {consultation.desc}
                      </p>
                    </div>
                    <div className="mt-8">
                      <Link href={`/dig-in-consultations/${consultation.slug}`}>
                        <Button
                          variant="ghost"
                          className={`p-0 hover:bg-transparent lowercase font-medium ${isLightBg ? "text-oxblood hover:text-ink" : "text-bone hover:text-bone/70"}`}
                        >
                          learn more <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 3 — WHAT YOU WALK AWAY WITH
// ──────────────────────────────────────────────────────────────────────────────
const WHAT_YOU_GET = [
  {
    num: "01",
    title: "the call",
    body: "a focused session where we dig into your business, audience, and current online presence. no fluff. no pitch. just diagnosis.",
  },
  {
    num: "02",
    title: "the action plan",
    body: "a written document delivered within 48 hours. clear priorities, specific recommendations, and next steps you can act on immediately. whether you work with us or not.",
  },
];

const WhatYouGet = () => {
  return (
    <section className="bg-stone py-16 md:py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="mb-12 md:mb-14 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-oxblood/40" />
            <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
              what you get
            </span>
          </div>
          <h2 className="font-display font-bold tracking-tighter text-4xl md:text-5xl leading-none lowercase">
            two deliverables.<br />both <span className="text-oxblood">yours to keep</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WHAT_YOU_GET.map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
              className="bg-bone border border-ink/10 rounded-md p-7 md:p-9"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display font-extrabold text-oxblood text-lg tabular-nums tracking-tight">
                  {item.num}
                </span>
                <span className="h-px flex-1 bg-ink/10" />
              </div>
              <h3 className="font-display font-medium text-2xl md:text-3xl tracking-tight lowercase mb-4">
                {item.title}
              </h3>
              <p className="text-ink-mid text-base leading-relaxed lowercase">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 4 — HOW IT WORKS
// ──────────────────────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    num: "01",
    title: "book",
    body: "pick a time. you'll get a short intake form so we can make the most of the session.",
  },
  {
    num: "02",
    title: "dig",
    body: "we go deep into your situation. your business, your site, your goals. the questions most consultants skip.",
  },
  {
    num: "03",
    title: "deliver",
    body: "within 48 hours, a written action plan lands in your inbox. priorities, recommendations, next steps.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-bone py-16 md:py-20 scroll-mt-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="text-center mb-12 md:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-oxblood/40" />
            <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
              how it works
            </span>
            <span className="h-px w-8 bg-oxblood/40" />
          </div>
          <h2 className="font-display font-bold tracking-tighter text-4xl md:text-5xl leading-none lowercase">
            three steps. <span className="text-oxblood">no friction.</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Connecting hairline behind the numbered nodes (desktop only) */}
          <div className="hidden lg:block absolute left-0 right-0 top-[18px] h-px bg-ink/10" aria-hidden="true" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12 relative">
            {HOW_IT_WORKS.map((step, i, arr) => (
              <div
                key={step.num}
                className="space-y-4 relative group transition-transform duration-300 ease-out hover:-translate-y-1 cursor-default"
              >
                <div className="relative h-9 flex items-center">
                  <span className="relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-bone border border-ink/15 text-oxblood font-semibold text-xs tabular-nums transition-colors duration-300 group-hover:border-oxblood group-hover:bg-oxblood group-hover:text-white">
                    {step.num}
                  </span>
                  {i < arr.length - 1 && (
                    <ArrowRight
                      className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 text-ink/30 bg-bone px-0.5"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="font-display font-medium text-xl md:text-2xl tracking-tight lowercase transition-colors duration-300 group-hover:text-oxblood">
                  {step.title}
                </h3>
                <p className="text-ink-mid leading-relaxed text-[15px]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 5 — STEAL MY BRAIN
// ──────────────────────────────────────────────────────────────────────────────
const StealMyBrain = ({ onOpenLeadMagnet }: { onOpenLeadMagnet: (kind: LeadMagnetKind) => void }) => {
  return (
    <section className="bg-bone py-16 md:py-20 border-t border-ink/10">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="text-center mb-12 md:mb-14 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-oxblood/40" />
            <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
              free resources
            </span>
            <span className="h-px w-8 bg-oxblood/40" />
          </div>
          <h2 className="font-display font-bold tracking-tighter text-4xl md:text-5xl leading-none lowercase mb-5">
            steal my <span className="text-oxblood">brain</span>.
          </h2>
          <p className="text-ink-mid text-lg leading-relaxed lowercase">
            get a feel for how i think before you commit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Resource 1 — Article */}
          <button
            onClick={() => onOpenLeadMagnet("article")}
            className="group text-left bg-bone border border-ink/15 rounded-md p-7 md:p-9 transition-all duration-300 hover:-translate-y-1 hover:border-oxblood hover:shadow-lg hover:shadow-ink/5"
          >
            <div className="flex items-center gap-2 mb-4 text-[10px] font-mono uppercase tracking-[0.22em] text-oxblood">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-oxblood" />
              <span>article · 5 min read</span>
            </div>
            <h3 className="font-display font-medium text-2xl tracking-tight lowercase mb-4 group-hover:text-oxblood transition-colors">
              how i think about websites
            </h3>
            <p className="text-ink-mid text-[15px] leading-relaxed lowercase mb-6">
              a short read on how sarahdigs approaches website strategy, design, and growth.
            </p>
            <span className="inline-flex items-center gap-2 text-ink font-medium lowercase text-sm group-hover:text-oxblood transition-colors">
              read it
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </button>

          {/* Resource 2 — Sample Plan */}
          <button
            onClick={() => onOpenLeadMagnet("sample")}
            className="group text-left bg-bone border border-ink/15 rounded-md p-7 md:p-9 transition-all duration-300 hover:-translate-y-1 hover:border-oxblood hover:shadow-lg hover:shadow-ink/5"
          >
            <div className="flex items-center gap-2 mb-4 text-[10px] font-mono uppercase tracking-[0.22em] text-oxblood">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-oxblood" />
              <span>sample · pdf</span>
            </div>
            <h3 className="font-display font-medium text-2xl tracking-tight lowercase mb-4 group-hover:text-oxblood transition-colors">
              sample action plan
            </h3>
            <p className="text-ink-mid text-[15px] leading-relaxed lowercase mb-6">
              a sanitized example of the kind of action plan you'll receive after a dig-in session.
            </p>
            <span className="inline-flex items-center gap-2 text-ink font-medium lowercase text-sm group-hover:text-oxblood transition-colors">
              view sample
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 6 — FAQ
// ──────────────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "what exactly happens on the call?",
    a: "we spend the session focused on your business. i'll ask about your audience, your goals, your current site, and what's not working. by the end, i'll have a clear picture of where you stand and what to prioritize.",
  },
  {
    q: "what do i get after the session?",
    a: "a written action plan delivered within 48 hours. it covers what's working, what's not, and exactly what to do next. with specific recommendations, not vague advice.",
  },
  {
    q: "how is this different from a free discovery call?",
    a: "a discovery call is about deciding whether to work together. a dig-in is the work. you're paying for expertise, diagnosis, and a deliverable you can use immediately.",
  },
  {
    q: "what if i want to move forward with a full project after?",
    a: "many clients do. the dig-in often becomes the starting point for the full dig. but there's no pressure and no obligation. the action plan stands on its own.",
  },
  {
    q: "how much does it cost?",
    a: "pricing is confirmed when you book. it's a fixed fee. no hourly billing, no surprises.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-bone py-16 md:py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-oxblood/40" />
            <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
              common questions
            </span>
            <span className="h-px w-8 bg-oxblood/40" />
          </div>
          <h2 className="font-display font-bold tracking-tighter text-4xl md:text-5xl leading-none lowercase">
            things people ask.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-transparent border border-ink/15 rounded-md overflow-hidden cursor-pointer transition-colors hover:border-ink/30"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="p-6 flex justify-between items-center gap-4">
                <h3 className="font-display font-medium text-base md:text-lg text-ink lowercase">
                  {faq.q}
                </h3>
                <div
                  className={`w-8 h-8 rounded-full border border-ink/20 flex items-center justify-center shrink-0 transition-transform ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                >
                  <span className="text-xl leading-none">+</span>
                </div>
              </div>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-ink-mid leading-relaxed lowercase">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 7 — FINAL CTA
// ──────────────────────────────────────────────────────────────────────────────
const FinalCTA = () => {
  return (
    <section className="bg-bone py-16 md:py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-ink text-bone rounded-md p-10 md:p-16 lg:p-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left: eyebrow + headline */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-oxblood-tint/50" />
              <span className="text-oxblood-tint font-semibold uppercase tracking-[0.22em] text-xs">
                one call away
              </span>
            </div>
            <h2 className="font-display font-bold tracking-tighter text-3xl md:text-4xl lg:text-5xl leading-[1.05] lowercase mb-5">
              clarity is <span className="text-oxblood-tint italic">one call</span> away.
            </h2>
            <p className="text-bone/70 text-base md:text-lg leading-relaxed lowercase max-w-xl">
              book a dig-in and find out exactly where to start.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="lg:col-span-4 flex lg:justify-end">
            <Button
              size="lg"
              onClick={() => openCalendly({ tier: "dig-in consultation" })}
              className="group w-full lg:w-auto text-base h-14 px-8 bg-oxblood-tint hover:bg-oxblood text-ink hover:text-bone rounded-md cursor-pointer lowercase font-semibold gap-2 transition-colors"
            >
              book your dig-in
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// PAGE
// ──────────────────────────────────────────────────────────────────────────────
interface PageContentMap {
  consultations?: ConsultationType[];
}

export default function DigInConsultations() {
  const [leadMagnet, setLeadMagnet] = useState<LeadMagnetKind | null>(null);

  const { data: pageContent = {} } = useQuery<PageContentMap>({
    queryKey: ["/api/page-content", "consultations"],
    queryFn: async () => {
      const res = await fetch("/api/page-content/consultations");
      if (!res.ok) return {};
      return res.json();
    },
  });

  const consultations = (pageContent.consultations as ConsultationType[]) || defaultConsultations;

  return (
    <div className="min-h-screen bg-bone text-ink">
      <SEO
        title="dig-in consultations | sarahdigs"
        description="a focused call with a custom action plan delivered after. you leave with a clear sense of direction for your business."
        canonical="/dig-in-consultations"
      />
      <Navbar theme="light" />
      <Hero />
      <SoundsFamiliar />
      <ConsultationsCarousel consultations={consultations} />
      <WhatYouGet />
      <HowItWorks />
      <StealMyBrain onOpenLeadMagnet={(kind) => setLeadMagnet(kind)} />
      <FAQ />
      <FinalCTA />
      <Footer />
      <LeadMagnetPopup
        isOpen={leadMagnet !== null}
        kind={leadMagnet}
        onClose={() => setLeadMagnet(null)}
      />
    </div>
  );
}
