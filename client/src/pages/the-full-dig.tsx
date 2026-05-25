import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { serviceSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown, Check, Users, X } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { openCalendly } from "@/lib/calendly";

const painPoints = [
  "you have no website, or one that's long overdue for a rebuild.",
  "your product is strong. your website doesn't show it.",
  "buyers visit, scroll, and leave without booking.",
  "you're guessing at design instead of following a strategy.",
  "your competitors show up on google. you don't.",
  "your site was built once and hasn't grown with you.",
];

const PainList = () => {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || hoveredIdx !== null) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % painPoints.length);
    }, 1000);
    return () => clearInterval(id);
  }, [inView, hoveredIdx]);

  const displayedIdx = hoveredIdx ?? activeIdx;

  return (
    <motion.ul
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
      }}
      className="lg:col-span-6 space-y-4 self-center"
    >
      {painPoints.map((text, i) => {
        const isActive = displayedIdx === i;
        return (
          <motion.li
            key={i}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex items-start gap-3.5 px-3 py-2.5 -mx-3 rounded-md transition-colors duration-500 ease-out cursor-default ${
              isActive ? "bg-oxblood/5" : ""
            }`}
          >
            <span
              className={`mt-0.5 shrink-0 flex items-center justify-center h-6 w-6 rounded-full transition-colors duration-500 ${
                isActive
                  ? "bg-oxblood border border-oxblood text-bone"
                  : "border border-ink/20 bg-bone text-ink-mid"
              }`}
            >
              <X className="h-3 w-3" strokeWidth={3} />
            </span>
            <span
              className={`text-[15px] md:text-base leading-snug lowercase transition-colors duration-500 ${
                isActive ? "text-oxblood font-semibold" : "text-ink-mid"
              }`}
            >
              {text}
            </span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const match = value.match(/^([^0-9]*)([0-9]+)(.*)$/);
  const prefix = match ? match[1] : "";
  const number = match ? parseInt(match[2]) : 0;
  const suffix = match ? match[3] : value;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const duration = 1600;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      if (p < 1) {
        setDisplay(Math.floor(p * number));
        requestAnimationFrame(tick);
      } else {
        setDisplay(number);
      }
    };
    requestAnimationFrame(tick);
  }, [isInView, number]);

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-oxblood-tint tabular-nums tracking-tight mb-3 lowercase">
        {match ? <>{prefix}{display}{suffix}</> : value}
      </div>
      <div className="text-bone text-sm leading-relaxed max-w-[180px] mx-auto md:mx-0 lowercase opacity-90">
        {label}
      </div>
    </div>
  );
};

const tiers = [
  {
    num: "01",
    name: "the dig",
    tagline: "the foundation.",
    groups: [
      {
        heading: "strategy",
        items: ["business and audience research", "positioning and messaging", "site architecture and wireframes"],
      },
      {
        heading: "design",
        items: ["ux design", "visual design", "responsive layouts"],
      },
      {
        heading: "build",
        items: ["custom immersive website", "cms setup", "mobile-first", "performance optimization"],
      },
    ],
    forWho: "for founders ready to launch",
    outcomes: ["a launch-ready website", "positioning that holds up", "a foundation to build on"],
    popular: false,
    extraTop: false,
  },
  {
    num: "02",
    name: "the deep dig",
    tagline: "the full system.",
    inherits: "everything in the dig, plus:",
    includes: ["seo structure", "ai search optimization", "conversion optimization"],
    forWho: "businesses ready to be found and convert",
    outcomes: ["a website built to be found", "a system that converts", "analytics that prove it"],
    popular: true,
    extraTop: true,
  },
  {
    num: "03",
    name: "the full dig",
    tagline: "the long game.",
    inherits: "everything in the deep dig, plus:",
    includes: ["analytics setup", "monthly strategy retainer", "performance tracking", "ongoing growth optimization"],
    forWho: "teams who want hands-on growth partners",
    outcomes: ["a growth engine, not a project", "a retained partner on call", "compounding results over time"],
    popular: false,
    extraTop: false,
  },
];

const caseStudies = [
  { client: "places", metric: "+312%", resultRest: "organic traffic", note: "in 90 days post-launch" },
  { client: "the 20s edit", metric: "3.1x", resultRest: "inbound leads", note: "first quarter after relaunch" },
];

export default function TheFullDig() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title="the full dig | sarahdigs"
        description="Research, design, build, and optimization, done together in the right order. The flagship sarahdigs service for founders who want a website that works."
        canonical="/the-full-dig"
        jsonLd={serviceSchema({
          name: "the full dig",
          description: "the flagship sarahdigs engagement: research, design, build, and optimization done together in the right order. a website that works.",
          url: "/the-full-dig",
          serviceType: "Website design and development",
        })}
      />
      <Navbar theme="light" />

      {/* 01 — HERO (editorial cover) */}
      <section className="h-screen pt-24 pb-8 bg-bone relative flex flex-col overflow-hidden">
        {/* Top hairline rail with mono meta */}
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
              sarahdigs · creative website studio
            </span>
            <span className="hidden md:inline text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
              vol. 01 · the full dig · 2026
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
              2026
            </span>
          </div>
        </div>

        {/* Top-left eyebrow */}
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-8 bg-oxblood/40" />
            <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
              the full dig · flagship service
            </span>
          </motion.div>
        </div>

        {/* Center headline */}
        <div className="container mx-auto px-6 lg:px-12 flex-1 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-center w-full max-w-6xl mx-auto"
          >
            <a
              href="#whats-included"
              onClick={(e) => { e.preventDefault(); scrollTo("whats-included"); }}
              className="inline-flex items-center gap-2.5 bg-oxblood text-bone rounded-full pl-3 pr-4 py-2 hover:bg-oxblood-soft transition-colors cursor-pointer mb-8"
            >
              <span className="relative inline-flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-bone opacity-75 animate-ping" />
                <span className="relative inline-block w-2 h-2 rounded-full bg-bone" />
              </span>
              <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em]">
                taking q3 2026 projects now
              </span>
            </a>

            <div className="mb-4 text-ink font-display font-semibold tracking-tighter leading-[1.05] text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] lowercase">
              a website
            </div>
            <h1 className="font-display font-semibold tracking-tighter text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] lowercase mb-6">
              designed to <span className="text-oxblood font-bold">impress</span><br />
              built to <span className="text-oxblood font-bold">sell</span>
            </h1>
            <p className="text-base md:text-lg text-ink-mid lowercase leading-snug">
              exceptional design. real business results.<br />one service. three depths.
            </p>
          </motion.div>
        </div>

        {/* Bottom rail: availability badge · CTA row */}
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="border-t border-ink/10 pt-6 flex justify-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-5">
              <button
                onClick={() => scrollTo("whats-included")}
                className="text-ink hover:text-oxblood transition-colors text-sm font-medium lowercase inline-flex items-center gap-2 cursor-pointer"
              >
                see what's included <ArrowDown className="w-4 h-4" />
              </button>
              <Button
                size="lg"
                onClick={() => openCalendly()}
                className="text-sm h-12 px-7 bg-ink hover:bg-oxblood text-white rounded-md cursor-pointer lowercase font-medium gap-2"
              >
                book a dig-in call <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 02 — PROBLEM (bone) ↔ SOLUTION (ink) side-by-side */}
      <section className="bg-bone py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          {/* Stacked headline at top, spans both columns */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-6 mb-10 md:mb-14 items-end"
          >
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-3 text-oxblood text-[10px] font-mono uppercase tracking-[0.28em]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-oxblood" />
                <span>the problem</span>
              </div>
              <h2 className="font-display font-bold tracking-tighter text-4xl md:text-5xl leading-[0.95] lowercase text-ink">
                what's <span className="text-oxblood">broken</span>
              </h2>
            </div>

            <div className="lg:col-start-7 lg:col-span-6">
              <div className="flex items-center gap-2 mb-3 text-oxblood text-[10px] font-mono uppercase tracking-[0.28em]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-oxblood" />
                <span>the fix</span>
              </div>
              <h2 className="font-display font-bold tracking-tighter text-4xl md:text-5xl leading-[0.95] lowercase text-ink">
                what we <span className="text-oxblood">build</span>
              </h2>
            </div>
          </motion.div>

          {/* Two columns: bone problem list ↔ ink solution card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
            {/* LEFT — problems on bone, auto-cycling highlight */}
            <PainList />

            {/* RIGHT — solution card on ink slab */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="lg:col-span-6 bg-ink text-bone rounded-2xl p-8 md:p-10 lg:p-12 flex flex-col justify-center"
            >

              <ul className="space-y-4">
                {[
                  "strategy and positioning before design",
                  "design that converts b2b buyers",
                  "copy and messaging rooted in how your buyers think",
                  "built to rank on google and show up in ai search",
                  "every page mapped to a stage in your sales cycle",
                  "conversion paths built for considered b2b decisions",
                  "a website build that's fast, clean, and yours to manage",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3.5">
                    <span className="mt-0.5 shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-oxblood text-bone ring-2 ring-oxblood/40 ring-offset-2 ring-offset-ink">
                      <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                    </span>
                    <span className="text-bone font-medium text-[15px] md:text-base leading-snug lowercase">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 04 — THREE TIERS */}
      <section id="whats-included" className="bg-stone py-16 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-oxblood/40" />
              <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
                one service · three depths
              </span>
              <span className="h-px w-8 bg-oxblood/40" />
            </div>
            <h2 className="font-display font-bold tracking-tighter text-3xl md:text-5xl leading-[0.95] mb-6 lowercase md:whitespace-nowrap">
              you pick how deep we go.
            </h2>
            <p className="text-ink-mid text-lg leading-relaxed lowercase">
              every tier includes strategy, design, and build. the difference is scope, depth, and what comes after.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tiers.map((t) => (
              <div key={t.name} className="flex flex-col">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openCalendly({ tier: t.name })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openCalendly({ tier: t.name });
                    }
                  }}
                  className={`relative bg-bone border ${t.popular ? "border-oxblood/40" : "border-ink/15"} rounded-md p-8 flex flex-col flex-1 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-xl hover:shadow-ink/5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-stone`}
                >
                {/* Oxblood top bar — silent "most popular" marker */}
                {t.popular && (
                  <span className="absolute top-0 left-0 right-0 h-1 bg-oxblood" />
                )}

                {/* For-who chip — leads the card */}
                <div className="inline-flex items-start gap-2.5 mb-6 max-w-fit bg-oxblood rounded-md px-3 py-2 font-bold">
                  <Users className="w-3.5 h-3.5 text-bone mt-[3px] shrink-0" strokeWidth={2.5} />
                  <span className="text-[12px] leading-snug lowercase text-bone">{t.forWho}</span>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display font-extrabold text-oxblood text-lg tabular-nums tracking-tight">
                    {t.num}
                  </span>
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
                <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tighter leading-none lowercase mb-3">
                  {t.name}
                </h3>
                <p className="text-ink-mid text-sm tracking-[0.18em] mb-8 lowercase">
                  {t.tagline}
                </p>

                {t.inherits && (
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-oxblood/30" />
                    <span className="italic font-display text-[13px] text-oxblood lowercase whitespace-nowrap">
                      {t.inherits}
                    </span>
                    <span className="h-px flex-1 bg-oxblood/30" />
                  </div>
                )}

                {t.groups ? (
                  <div className="space-y-5 mb-8 flex-1">
                    {t.groups.map((g) => (
                      <div key={g.heading}>
                        <div className="flex items-center gap-2 mb-2 text-oxblood text-[10px] font-semibold uppercase tracking-[0.22em]">
                          <span className="h-px w-4 bg-oxblood/40" />
                          <span>{g.heading}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {g.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-[14px] text-ink lowercase leading-snug">
                              <Check className="w-3.5 h-3.5 text-oxblood mt-[3px] shrink-0" strokeWidth={2.5} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : t.includes ? (
                  <ul className="space-y-1.5 mb-8 flex-1">
                    {t.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[14px] text-ink lowercase leading-snug">
                        <Check className="w-3.5 h-3.5 text-oxblood mt-[3px] shrink-0" strokeWidth={2.5} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Outcome strip — distinct prose summary, not another list */}
                <div className="mt-4 -mx-8 -mb-8 px-8 py-6 bg-oxblood/5 border-t-2 border-oxblood/40 rounded-b-md">
                  <div className="flex items-center gap-2 mb-3 text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-oxblood">
                    <span>you walk away with</span>
                    <ArrowDown className="w-3 h-3" strokeWidth={2.5} />
                  </div>
                  <p className="font-display font-medium text-[15px] md:text-base text-ink leading-snug lowercase">
                    {t.outcomes.map((o, i) => (
                      <span key={o}>
                        {o}
                        {i < t.outcomes.length - 1 && (
                          <span className="text-oxblood mx-2" aria-hidden="true">·</span>
                        )}
                      </span>
                    ))}
                    <span className="text-oxblood">.</span>
                  </p>
                </div>
                </div>
              </div>
            ))}
          </div>

          {/* Routing moment */}
          <div className="mt-20 text-center">
            <p className="text-ink-mid text-lg mb-6 lowercase">not sure which package fits you?</p>
            <div className="flex flex-col items-center gap-3">
              <Button
                size="lg"
                onClick={() => openCalendly()}
                className="text-base h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2"
              >
                book a dig-in call <ArrowRight className="w-4 h-4" />
              </Button>
              <span className="text-ink-mid text-sm lowercase">we'll figure it out together.</span>
            </div>
          </div>
        </div>
      </section>


      {/* 06 — SOCIAL PROOF / RESULTS — matches homepage Full Dig vibe */}
      <section className="py-12 md:py-16 bg-bone">
        <div className="container mx-auto px-6">
          <div className="bg-ink rounded-md p-8 md:p-12 lg:p-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* Left: intro + stats */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-oxblood-tint/40" />
                <span className="text-oxblood-tint font-semibold uppercase tracking-[0.22em] text-xs">
                  the work
                </span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tighter text-bone mb-8 lowercase">
                built to <span className="text-oxblood-tint italic">work.</span><br />
                results that <span className="text-oxblood-tint italic">show it.</span>
              </h2>

              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 md:gap-6 lg:gap-8">
                <Stat value="20+" label="websites shipped." />
                <Stat value="3x" label="avg inbound after launch." />
                <Stat value="6" label="weeks strategy to live." />
              </div>
            </div>

            {/* Right: case study rows (homepage attribute-row vibe) */}
            <div className="md:col-span-5">
              <div className="mb-6 p-5 md:p-6 rounded-md bg-bone/8 border border-bone/25">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-oxblood-tint mb-4">
                  recent work
                </div>
                {caseStudies.map((c, i) => (
                  <div
                    key={c.client}
                    className={`flex items-baseline gap-4 py-4 ${i !== 0 ? "border-t border-bone/10" : ""}`}
                  >
                    <span className="font-display text-xs text-bone tabular-nums shrink-0">
                      0{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-oxblood-tint mb-1">
                        {c.client}
                      </div>
                      <div className="font-display font-bold text-lg md:text-xl leading-tight lowercase">
                        <span className="text-bone">{c.metric}</span>
                        <span className="text-bone"> {c.resultRest}</span>
                      </div>
                      <div className="text-bone text-xs mt-1 lowercase opacity-80">
                        {c.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — THE NOT SURE MOMENT */}
      <section className="bg-stone py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-y-0">
            {/* LEFT — primary path: dig-in consultation (heavier, larger, recommended) */}
            <div className="lg:col-span-6 lg:pr-10 lg:border-r lg:border-ink/15 flex flex-col">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-display font-extrabold text-oxblood text-4xl md:text-5xl tabular-nums tracking-tighter leading-none">
                  01
                </span>
                <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
                  recommended
                </span>
              </div>
              <h2 className="font-display font-bold tracking-tighter text-3xl md:text-5xl leading-none mb-5 lowercase">
                not every project<br />needs <span className="text-oxblood italic">the full dig.</span>
              </h2>
              <p className="text-ink-mid text-base md:text-lg leading-relaxed mb-8 max-w-md lowercase">
                if you're still figuring out what you need, the dig-in consultation is the right first step. a focused call, a written action plan, and a clear view of what to do next.
              </p>
              <div className="mt-auto">
                <Button
                  size="lg"
                  onClick={() => openCalendly()}
                  className="text-base h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2"
                >
                  book a dig-in call <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* RIGHT — secondary path: custom dig (card, oxblood-tinted, interactive) */}
            <div className="lg:col-span-6 lg:pl-10 pt-10 lg:pt-0 flex">
              <a
                href="/dig-on-demand"
                className="group relative w-full flex flex-col bg-oxblood/6 border border-oxblood/20 rounded-md p-8 md:p-10 transition-all duration-300 hover:bg-oxblood/10 hover:border-oxblood/40 hover:-translate-y-1 overflow-hidden"
              >
                {/* corner accent */}
                <span
                  className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none"
                  aria-hidden="true"
                >
                  <span className="absolute top-0 right-0 w-24 h-px bg-oxblood/30 origin-top-right rotate-45 translate-y-4" />
                </span>

                <div className="flex items-center gap-2 mb-5 text-[10px] font-mono uppercase tracking-[0.28em] text-oxblood">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-oxblood" />
                  <span>02 · alternative</span>
                </div>

                <h2 className="font-display font-semibold tracking-tighter text-2xl md:text-3xl leading-snug mb-4 lowercase text-ink group-hover:text-oxblood transition-colors">
                  know your scope?<br />build it your way.
                </h2>
                <p className="text-ink-mid text-base leading-relaxed mb-8 max-w-sm lowercase">
                  if you already know what you need but it doesn't fit a package, the custom dig lets us scope a build around your exact situation.
                </p>

                <span className="mt-auto inline-flex items-center gap-3 text-sm text-oxblood font-medium lowercase">
                  explore custom dig
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-oxblood/30 group-hover:border-oxblood group-hover:bg-oxblood group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 08 — FINAL CTA */}
      <section className="bg-bone py-20 md:py-24">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="font-display font-semibold tracking-tighter text-6xl md:text-7xl lg:text-8xl leading-[1] mb-5 lowercase">
            ready to dig <span className="text-oxblood font-bold">in?</span>
          </h2>
          <p className="text-ink-mid text-base md:text-lg mb-8 leading-relaxed lowercase">
            30 minutes. one clear plan. no pitch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => openCalendly()}
              className="text-base h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2 w-full sm:w-auto min-w-60"
            >
              book a dig-in call <ArrowRight className="w-4 h-4" />
            </Button>
            <a
              href="/contact#contact-form"
              className="inline-flex items-center justify-center text-base h-14 px-8 bg-transparent border border-ink/25 text-ink hover:border-oxblood hover:text-oxblood transition-colors rounded-md cursor-pointer lowercase font-medium gap-2 w-full sm:w-auto min-w-60"
            >
              fill the project brief <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-12 text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
            sarahdigs · creative website studio
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
