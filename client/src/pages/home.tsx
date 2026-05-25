import { useState, useEffect, useCallback, useRef } from "react";
import type { ProcessStep, Service, Project, BlogPost } from "@shared/schema";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  Search,
  BarChart3,
  Users,
  Layout,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  TrendingUp,
  Compass,
  Pen,
  Code,
  LineChart,
  MessageCircle,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { Navbar } from "@/components/layout/navbar";
import TextReveal from "@/components/ui/TextReveal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import SEO from "@/components/SEO";
import { Footer as FooterComponent } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { openCalendly } from "@/lib/calendly";
import { renderMetricValue } from "@/lib/metric-value";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg-opt.jpg";
import sarahPhoto from "@/assets/sarah-home-opt.jpg";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  BarChart3,
  Users,
  Layout,
  TrendingUp,
};

// --- Components ---

const CountUp = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Parse value to separate number from non-numeric characters
  const match = value.match(/^([^0-9]*)([0-9]+)(.*)$/);
  const prefix = match ? match[1] : "";
  const number = match ? parseInt(match[2]) : 0;
  const suffix = match ? match[3] : value;

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Start time
      const start = Date.now();
      const duration = 2000; // 2 seconds

      const update = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);

        if (progress < 1) {
          // Show random number during animation
          // Generate random number with same number of digits as target
          const digits = number.toString().length;
          const min = Math.pow(10, digits - 1);
          const max = Math.pow(10, digits) - 1;
          const random = Math.floor(Math.random() * (max - min + 1)) + min;

          setDisplayValue(random);
          requestAnimationFrame(update);
        } else {
          // Set final value
          setDisplayValue(number);
        }
      };

      requestAnimationFrame(update);
    }
  }, [isInView, number]);

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="text-5xl md:text-6xl font-black text-[#181612] mb-2 tabular-nums">
        {match ? (
          <>
            {prefix}
            {displayValue}
            {suffix}
          </>
        ) : (
          value
        )}
      </div>
      <div className="text-sm font-bold uppercase tracking-widest text-[#6B1421]">
        {label}
      </div>
    </div>
  );
};

const ProofStat = ({ value, label }: { value: string; label: string }) => (
  <div className="group px-4 md:px-6 flex flex-col items-center text-center gap-2 cursor-default">
    <span className="font-display font-medium text-4xl md:text-5xl text-[#181612] group-hover:text-[#8C2331] tabular-nums leading-none transition-colors duration-300">
      {value}
    </span>
    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mid group-hover:text-[#181612] leading-tight transition-colors duration-300">
      {label}
    </span>
  </div>
);

const Proof = () => {
  const displayStats = [
    { value: "8+", label: "Years Experience" },
    { value: "27x", label: "Avg Organic Traffic Growth" },
    { value: "3x", label: "Inbound Leads After Launch" },
    { value: "6", label: "Weeks Strategy to Live" },
  ];

  return (
    <section className="bg-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        <div className="py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#181612]/12">
          {displayStats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <ProofStat value={stat.value} label={stat.label} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowWeWork = () => {
  const disciplines = [
    {
      title: "dig",
      desc: "we spend real time learning your business, audience and market before the project starts.",
    },
    {
      title: "design",
      desc: "we focus on immersive, interactive websites that make users feel like they're entering your world, not just scrolling a page.",
    },
    {
      title: "build",
      desc: "fast, clean, and built to grow with you.",
    },
    {
      title: "optimize",
      desc: "we optimize every touchpoint so your site consistently brings in business.",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-3 mb-12 md:mb-16">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B1421]">
              what goes into the work
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-[#181612] lowercase">
              every website we build runs on{" "}
              <span className="text-[#6B1421]">4 things</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disciplines.map((d, i) => (
            <ScrollReveal key={d.title} delay={i * 0.08}>
              <div className="group relative h-full p-8 md:p-10 border border-[#181612]/12 rounded-md transition-colors duration-300 hover:bg-[#E7E2D6]/40 hover:border-[#8C2331]/40">
                {/* Oxblood corner brackets — draw in on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-[#6B1421] opacity-0 -translate-x-1 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#6B1421] opacity-0 translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                />
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-md bg-[#6B1421] flex items-center justify-center text-[#F4F1EA] font-bold text-xs tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display font-medium text-2xl md:text-3xl text-[#181612] lowercase tracking-tight">
                    {d.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-ink-mid leading-relaxed lowercase">
                  {d.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2}>
          <div className="mt-6 md:mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => openCalendly()}
              className="group inline-flex items-center gap-2 text-base lowercase text-[#181612] hover:text-[#6B1421] transition-colors cursor-pointer"
            >
              <span className="relative font-medium">
                book a free advisory call
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#6B1421] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const FullDigTeaser = () => {
  return (
    <section className="py-12 md:py-16 bg-[#F4F1EA] text-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        <ScrollReveal>
        <div className="bg-[#181612] rounded-md p-10 md:p-16 lg:p-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Left: intro */}
          <div className="md:col-span-7">
            <div className="mb-6">
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-[#181612] bg-[#C58A92] rounded-[4px] px-2 py-1">
                the real deal
              </span>
            </div>
            <h2 className="font-display font-bold text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight text-[#F4F1EA] mb-10 md:mb-12 lowercase">
              the full dig
            </h2>
            <p className="font-display font-medium text-2xl md:text-3xl leading-snug tracking-tight text-[#F4F1EA] mb-8 lowercase">
              designed to make people{" "}
              <span className="text-[#C58A92] italic">feel</span> something. built
              to make them{" "}
              <span className="text-[#C58A92] italic">do</span> something.
            </p>
            <div className="mt-10 md:mt-14 flex flex-col items-start gap-2">
              <Link
                href="/the-full-dig"
                className="group inline-flex items-center gap-2 text-base lowercase text-[#F4F1EA] hover:text-[#C58A92] transition-colors"
              >
                <span className="relative font-medium">
                  see the full breakdown
                  <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#C58A92] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <span className="text-[13px] text-[#9B948A] lowercase">
                process · tiers · what's included
              </span>
            </div>
          </div>

          {/* Right: peek inside */}
          <div className="md:col-span-5">
            <div className="mb-12 p-6 md:p-8 rounded-md bg-[#F4F1EA]/[0.04] border border-[#F4F1EA]/15">
              <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-[#F4F1EA] mb-6 lowercase">
                every growth layer.
              </h3>
              <ul className="space-y-3">
                {[
                  "strategy + research",
                  "design + build",
                  "search + conversion optimization",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-base md:text-lg text-[#F4F1EA] lowercase"
                  >
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-[#C58A92] shrink-0">
                      <Check
                        className="h-3 w-3 text-[#181612]"
                        strokeWidth={3}
                      />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-20 md:mt-28">
              <div className="h-px bg-[#9B948A]/40" />
              {[
                "your business logic, built into every page.",
                "a website people actually want to scroll through.",
                "clean code. fast load. ready for google and AI search.",
              ].map((attr, i) => (
                <div key={attr}>
                  <div className="flex items-baseline gap-4 py-4 origin-left transition-transform duration-300 ease-out hover:scale-[1.02] cursor-default">
                    <span className="font-display text-xs text-[#C58A92] tabular-nums shrink-0">
                      0{i + 1}
                    </span>
                    <p className="text-base md:text-lg text-[#F4F1EA] leading-snug lowercase">
                      {attr}
                    </p>
                  </div>
                  <div className="h-px bg-[#9B948A]/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const TheShift = () => {
  return (
    <section className="py-20 md:py-28 bg-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        {/* Thin oxblood rule — visual "cut" / pivot */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-10 md:mb-14">
            <span className="block w-12 h-px bg-[#6B1421]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B1421]">
              the shift
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <ScrollReveal delay={0.05} className="md:col-span-8">
            <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#181612] lowercase">
              your website should show up where your{" "}
              <span className="text-[#6B1421]">clients</span> are looking.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="md:col-span-7 md:col-start-6 md:mt-8">
            <p className="text-base md:text-lg leading-relaxed text-ink-mid max-w-2xl lowercase">
              that's not just google anymore.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const Manifesto = () => {
  return (
    <section className="py-16 md:py-20 bg-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-[#181612] max-w-5xl mx-auto text-center lowercase">
            your website should show up where your{" "}
            <span className="text-[#6B1421]">customers</span> are looking.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-ink-mid max-w-2xl mx-auto text-center lowercase">
            that's not just google anymore.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

const MeetSarah = () => {
  return (
    <section className="py-16 md:py-20 bg-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <ScrollReveal>
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-md">
              <img
                src={sarahPhoto}
                alt="Sarah, founder of sarahdigs"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B1421] mb-5 block">
                who you'd be working with
              </span>
              <h2 className="font-display font-medium text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#181612] mb-6 lowercase">
                meet sarah.
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-ink-mid max-w-xl mb-8 lowercase">
                i started sarahdigs because too many businesses were paying for
                websites that didn't do anything for them. my team and i dig
                into your positioning, audience, and goals, then we design an
                immersive website that feels like entering your world, build it
                clean, and optimize it to bring you customers. that's sarahdigs.{" "}
                <span className="text-[#181612]">strategy first, always.</span>
              </p>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-base lowercase text-[#181612] hover:text-[#8C2331] transition-colors"
              >
                <span className="relative font-medium">
                  more about sarah
                  <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#6B1421] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const ProblemStatement = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <p className="font-display text-2xl md:text-4xl font-normal leading-[1.25] tracking-tight text-[#181612] max-w-4xl lowercase">
            most sites either look good and don't bring business, or rank well and feel like everyone else's.{" "}
            <span className="text-ink-mid">you've probably tried one. maybe both.</span>{" "}
            <span className="text-[#6B1421]">neither worked.</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

// Legacy ProblemSolution kept as a no-op so any stragglers don't break — remove once dust settles.
const ProblemSolution = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const problemsData = homeContent?.problems || {
    title: "Does this sound familiar?",
    items: [
      "You're drowning in data but starving for actionable insights.",
      "Your traffic is growing, but your revenue remains flat.",
      "You're creating content that no one seems to be finding or reading.",
      "Technical SEO feels like a black box you can't unlock.",
      "You're guessing at strategy instead of following a roadmap.",
    ],
  };

  const solutionData = homeContent?.solution || {
    title: "Stop guessing. Start growing.",
    description: "I turn chaotic data into a clear, actionable growth engine. No fluff, just results-driven strategy that bridges the gap between technical execution and brand storytelling.",
    benefits: [
      "Clear, prioritized roadmaps backed by data",
      "High-intent traffic that actually converts",
      "Technical foundation built for scale",
      "Content strategy that drives real revenue",
    ],
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const problems = problemsData.items || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % problems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [problems.length]);

  // Split the solution title at the period
  const titleParts = solutionData.title.split(".");
  const titleLine1 = titleParts[0] + ".";
  const titleLine2 = titleParts[1]?.trim() || "";

  return (
    <section className="py-20 bg-transparent text-[#181612]">
      <div className="container mx-auto px-6">
        {/* Problem Part */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-12">
          <ScrollReveal className="md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1]">
              {problemsData.title.split(" ").slice(0, -1).join(" ")} <br />
              <span className="text-[#6B1421]">{problemsData.title.split(" ").slice(-1)[0]}</span>
            </h2>
          </ScrollReveal>
          <div className="md:w-2/3">
            <div className="space-y-3">
              {problems.map((item: string, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-4 p-3 -ml-3 rounded-md transition-all duration-500 cursor-default",
                    activeIndex === i ? "bg-[#E7E2D6] scale-[1.02] shadow-sm" : "opacity-60 hover:opacity-100"
                  )}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <div className={cn(
                    "mt-1 shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-300",
                    activeIndex === i 
                      ? "border-red-500 text-red-500 bg-red-50" 
                      : "border-[#181612]/20 text-[#181612]/40"
                  )}>
                    <X className="w-3 h-3" />
                  </div>
                  <p className={cn(
                    "text-lg leading-snug transition-colors duration-300",
                    activeIndex === i ? "text-[#181612] font-medium" : "text-[#181612]"
                  )}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solution Part */}
        <div className="bg-[#1B1B1B] text-white rounded-md p-8 md:p-16 relative overflow-hidden">
          {/* Abstract bg shape */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#6B1421] via-transparent to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <ScrollReveal>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                {titleLine1} <br />
                <span className="text-[#6B1421]">{titleLine2}</span>
              </h3>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                {solutionData.description}
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-6">
              {(solutionData.benefits || []).map((benefit: string, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#6B1421] flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const heroData = homeContent?.hero || {
    rotatingWords: ["goals", "users", "data", "intent", "gaps", "story"],
    description: "beautiful websites built to get found and win you business.",
    ctaText: "Explore Services",
    backgroundImage: "",
  };

  const words = heroData.rotatingWords || ["goals", "users", "data", "intent", "gaps", "story"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section
      ref={heroRef}
      className="flex flex-col justify-center min-h-screen pt-[200px] pb-[120px] relative overflow-hidden"
    >
      {/* Faded background portrait — parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 48%',
            opacity: 0.32,
          }}
        />
        <div className="absolute inset-0 bg-[#181612]/10" />
      </motion.div>

      <motion.div style={{ y: textY }} className="container mx-auto px-6 relative z-10">
        <div className="max-w-fit md:pl-8 lg:pl-12">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-5 lowercase text-[#181612]"
          >
            sarah<span className="text-[#6B1421]">digs</span> <br />
            <div className="md:whitespace-nowrap">
              <span className="inline-block mr-4">into</span>
              <div className="h-[1em] overflow-hidden inline-flex align-top text-[#6B1421]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[index]}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="block text-[#6B1421] px-2 md:px-6 rounded-md border border-[#6B1421]"
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between gap-8 md:items-end w-full"
          >
            <p className="font-display text-2xl md:text-3xl font-medium leading-snug tracking-tight text-[#181612] max-w-3xl lowercase">
              building websites people remember. and keep coming back to.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 md:pl-8 lg:pl-12"
        >
          <Link href="/the-full-dig">
            <Button
              size="lg"
              className="text-base h-12 px-7 w-fit shrink-0 group cursor-pointer bg-[#181612] hover:bg-[#8C2331] text-[#F4F1EA] rounded-md transition-colors"
            >
              see how it works
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => openCalendly()}
            className="text-base h-12 px-7 w-fit shrink-0 cursor-pointer border border-[#181612] text-[#181612] hover:border-[#8C2331] hover:text-[#8C2331] hover:bg-transparent rounded-md transition-colors"
          >
            book a free strategy call
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

      </motion.div>
    </section>
  );
};

const ProofSection = () => {
  return (
    <section className="bg-[#F4F1EA] relative z-[2] pb-12 md:pb-14">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="border-t border-[#181612]/15 pt-12 md:pt-16">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B1421] block mb-6 text-center">
              the work, in numbers
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#181612]/15">
              {[
                { value: "8+", label: "Years Experience" },
                { value: "27x", label: "Avg Organic Traffic Growth" },
                { value: "3x", label: "Inbound Leads After Launch" },
                { value: "6", label: "Weeks Strategy to Live" },
              ].map((stat) => (
                <ProofStat key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Process = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const { data: processSteps = [] } = useQuery<ProcessStep[]>({
    queryKey: ["/api/process-steps"],
  });

  const processData = homeContent?.process || {
    headline: "How it works",
    subtitle: "A structured approach to uncovering value and driving growth.",
  };

  const defaultSteps = [
    { stepNumber: "01", title: "Discovery", description: "We start by unearthing your current data, challenges, and goals." },
    { stepNumber: "02", title: "Strategy", description: "I build a custom roadmap to bridge the gap between where you are and where you want to be." },
    { stepNumber: "03", title: "Execution", description: "We implement the plan with precision, focusing on high-impact actions." },
    { stepNumber: "04", title: "Optimization", description: "Continuous monitoring and refining to ensure sustainable growth." },
  ];

  const steps = processSteps.length > 0 ? processSteps : defaultSteps;

  return (
    <section className="pt-20 pb-32 bg-[#E7E2D6] text-[#181612]">
      <div className="container mx-auto px-6">
        <div className="mb-24 text-center md:text-left">
          <TextReveal text={processData.headline} tag="h2" className="text-5xl md:text-7xl font-bold tracking-tighter mb-6" />
          <ScrollReveal delay={0.2}>
            <p className="text-xl text-[#181612]/70 max-w-2xl">
              {processData.subtitle}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-[#1B1B1B]/10 -z-10" />

          {steps.map((step, i) => (
            <ScrollReveal key={step.stepNumber || i} delay={i * 0.1} className="group relative pt-8 md:pt-0">
              <div className="w-24 h-24 bg-[#F4F1EA] border border-[#181612]/20 rounded-full flex items-center justify-center text-3xl font-bold font-display mb-4 group-hover:border-[#8C2331] group-hover:text-[#8C2331] transition-colors z-10 relative mx-auto md:mx-0 text-[#181612]">
                {step.stepNumber}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center md:text-left text-[#181612]">
                {step.title}
              </h3>
              <p className="text-[#181612]/70 leading-relaxed text-center md:text-left">
                {step.description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};


const WhyMe = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const whyMeData = homeContent?.whyMe || {
    sectionLabel: "WHY SARAHDIGS?",
    headline: "Most consultants skim the surface. I bring a shovel.",
    features: [
      { title: "Data-First Approach", description: "I don't guess. Every recommendation is backed by hard data and user behavior analysis. If the numbers don't support it, we don't do it." },
      { title: "Technical + Creative", description: "I speak both developer and designer. I bridge the gap between technical SEO requirements and engaging brand storytelling." },
      { title: "Actionable Strategy", description: "No 50-page PDFs that gather dust. You get a prioritized roadmap with clear steps, expected impact, and measurable KPIs." },
    ],
  };

  const features = whyMeData.features || [];

  return (
    <section className="py-20 bg-transparent text-[#181612]">
      <div className="container mx-auto px-6">
        <div className="bg-[#1B1B1B] rounded-md p-12 md:p-24 text-white">
          <div className="mb-20">
            <ScrollReveal>
              <span className="text-[#E7E2D6] text-lg font-bold uppercase tracking-widest mb-4 block">
                {whyMeData.sectionLabel}
              </span>
            </ScrollReveal>
            <TextReveal text={whyMeData.headline} tag="h2" className="text-5xl md:text-6xl font-bold tracking-tighter max-w-3xl text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature: { title: string; description: string }, i: number) => (
              <ScrollReveal key={i} delay={i * 0.1} className="space-y-6">
                <div className="w-12 h-1 bg-[#E7E2D6] mb-8 rounded-full"></div>
                <h3 className="text-2xl font-bold text-[#E7E2D6]">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const testimonials = [
    { quote: "sarah completely transformed how we look at our data. within weeks, we had a clear roadmap that actually made sense.", clientName: "alex morgan", clientRole: "founder", clientCompany: "techflow" },
    { quote: "the deep dive uncovered opportunities we had been missing for years. our organic traffic doubled in under 6 months.", clientName: "jordan lee", clientRole: "e-commerce director", clientCompany: "urban collective" },
    { quote: "finally, a strategist who connects creative with technical SEO. sarah doesn't just advise, she rolls up her sleeves and delivers.", clientName: "casey smith", clientRole: "vp of marketing", clientCompany: "bloom health" },
    { quote: "we went from zero organic presence to 150+ qualified leads per month. the ROI has been unreal.", clientName: "taylor reed", clientRole: "ceo", clientCompany: "finsmart" },
    { quote: "sarah's audit saved us from a migration disaster. she found issues three agencies missed and fixed them in weeks, not months.", clientName: "morgan chen", clientRole: "head of growth", clientCompany: "scaleup labs" },
  ];

  return (
    <section className="pt-6 pb-12 md:pt-8 md:pb-14 bg-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-10 md:mb-14">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B1421]">
            in their words
          </span>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              aria-label="previous"
              className="h-9 w-9 flex items-center justify-center border border-[#181612] rounded-md hover:bg-[#8C2331] hover:border-[#8C2331] transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 text-[#181612] group-hover:text-[#F4F1EA] transition-colors" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="next"
              className="h-9 w-9 flex items-center justify-center border border-[#181612] rounded-md hover:bg-[#8C2331] hover:border-[#8C2331] transition-colors group"
            >
              <ChevronRight className="h-4 w-4 text-[#181612] group-hover:text-[#F4F1EA] transition-colors" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4"
              >
                <ScrollReveal delay={i * 0.08} className="h-full">
                  <figure className="group h-full flex flex-col justify-between border-t border-[#181612]/15 pt-6 pr-2 transition-colors duration-300 hover:border-[#6B1421]/50">
                    <div>
                      <span className="block font-display text-5xl leading-none text-[#6B1421] mb-3" aria-hidden>&ldquo;</span>
                      <blockquote className="font-display text-xl md:text-2xl leading-snug text-[#181612] lowercase">
                        {item.quote}
                      </blockquote>
                    </div>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <span className="h-px w-6 bg-[#6B1421]" />
                      <div>
                        <span className="font-display font-medium text-[#181612] lowercase">{item.clientName}</span>
                        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-mid lowercase block mt-0.5">
                          {[item.clientRole, item.clientCompany].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                    </figcaption>
                  </figure>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
    
const SelectedWork = () => {
  const projects = [
    {
      slug: "places",
      client: "places",
      headline: "real estate, turned into a brand.",
      emphasis: "brand",
      metricValue: "+312%",
      metricLabel: "organic traffic",
      logo: "/projects/places-logo.png",
    },
    {
      slug: "the-20s-edit",
      client: "the 20s edit",
      headline: "an editorial brand people stay on.",
      emphasis: "stay",
      metricValue: "3x",
      metricLabel: "avg session time",
      logo: "/projects/the-20s-edit-logo.png",
    },
  ];

  return (
    <section className="py-8 bg-[#F4F1EA] relative">
      <div className="container mx-auto px-6">
        <div>
          <ScrollReveal>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B1421] mb-5 block">
              selected work
            </span>
          </ScrollReveal>

          {/* Single outer box wrapping all projects */}
          <ScrollReveal delay={0.08}>
            <div className="border border-[#181612]/[0.12] rounded-md overflow-hidden divide-y divide-[#181612]/[0.12]">
              {projects.map((project, i) => {
                const reversed = i % 2 === 1;
                return (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group block transition-colors hover:bg-[#E7E2D6]/40"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
                      {/* Thumbnail — project logo on a bone tile */}
                      <div
                        className={cn(
                          "relative w-full aspect-[16/9] md:aspect-auto overflow-hidden bg-[#E7E2D6]/50 flex items-center justify-center p-6 md:p-8",
                          reversed && "md:order-2"
                        )}
                      >
                        <img
                          src={project.logo}
                          alt={project.client}
                          loading="lazy"
                          decoding="async"
                          className="max-w-[70%] max-h-[60%] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </div>

                      {/* Text */}
                      <div
                        className={cn(
                          "flex flex-col justify-center p-6 md:p-7 min-w-0",
                          reversed && "md:order-1"
                        )}
                      >
                        <span className="inline-flex items-center gap-2 mb-2.5">
                          <span className="h-px w-5 bg-[#6B1421]/50" />
                          <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#6B1421]">
                            {project.client}
                          </span>
                        </span>
                        <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight tracking-tight text-[#181612] mb-3.5 lowercase">
                          {project.headline.split(project.emphasis).map((part, idx, arr) => (
                            <span key={idx}>
                              {part}
                              {idx < arr.length - 1 && (
                                <span className="text-[#6B1421]">{project.emphasis}</span>
                              )}
                            </span>
                          ))}
                        </h3>

                        {/* Metric — visually distinct stat block */}
                        <div className="inline-flex items-baseline gap-3 mb-4 pb-3 border-b border-[#181612]/[0.12] w-fit">
                          <span className="font-display font-bold text-3xl md:text-4xl text-[#6B1421] leading-none tabular-nums whitespace-nowrap">
                            {renderMetricValue(project.metricValue)}
                          </span>
                          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-mid lowercase">
                            {project.metricLabel}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-2 text-[13px] font-medium lowercase text-[#6B1421] transition-transform group-hover:translate-x-0.5">
                          view project
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="mt-8">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-base lowercase text-[#181612] hover:text-[#6B1421] transition-colors"
            >
              <span className="relative font-medium">
                see all projects
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#6B1421] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const NotSureWhereToStart = () => {
  return (
    <section className="pt-12 pb-10 bg-[#F4F1EA] relative">
      <div className="container mx-auto px-6 relative">
        <ScrollReveal>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#181612] mb-8 lowercase max-w-4xl">
            not ready for the full dig yet?{" "}
            <span className="text-[#6B1421]">start here</span>.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dig-In Consultation — OXBLOOD TINT WASH (primary) */}
          <ScrollReveal delay={0.08}>
            <div className="group h-full flex flex-col bg-[#6B1421]/[0.06] border border-[#6B1421]/20 rounded-md p-6 md:p-8 transition-all hover:bg-[#6B1421]/[0.1] hover:border-[#6B1421]/40 hover:-translate-y-0.5">
              <div className="mb-5 inline-flex items-center justify-center w-11 h-11 rounded-md bg-[#6B1421]/10 border border-[#6B1421]/25 text-[#6B1421] transition-colors group-hover:bg-[#6B1421] group-hover:text-[#F4F1EA]">
                <MessageCircle className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-2xl md:text-[28px] leading-tight tracking-tight text-[#181612] mb-3 lowercase">
                dig-in consultation
              </h3>
              <p className="text-sm text-ink-mid leading-relaxed mb-8 lowercase">
                a focused call + written action plan. for when you need clarity
                before committing to anything.
              </p>
              <Link href="/dig-in-consultations" className="mt-auto w-fit">
                <span className="inline-flex items-center gap-2 text-sm font-medium lowercase bg-[#6B1421] text-[#F4F1EA] rounded-md px-4 py-2.5 hover:bg-[#8C2331] transition-colors group/cta">
                  book a consultation call
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
                </span>
              </Link>
            </div>
          </ScrollReveal>

          {/* Custom Dig — LIGHT OUTLINE (alternative) */}
          <ScrollReveal delay={0.14}>
            <div className="group h-full flex flex-col bg-[#F4F1EA] border border-[#181612]/[0.14] rounded-md p-6 md:p-8 transition-all hover:border-[#6B1421]/40 hover:-translate-y-0.5">
              <div className="mb-5 inline-flex items-center justify-center w-11 h-11 rounded-md bg-[#6B1421]/8 border border-[#6B1421]/20 text-[#6B1421] transition-colors group-hover:bg-[#6B1421] group-hover:text-[#F4F1EA]">
                <Wrench className="w-5 h-5" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-2xl md:text-[28px] leading-tight tracking-tight text-[#181612] mb-3 lowercase">
                custom dig
              </h3>
              <p className="text-sm text-ink-mid leading-relaxed mb-8 lowercase">
                a custom plan built around your business, goals, and gaps.
              </p>
              <Link href="/dig-on-demand" className="mt-auto w-fit">
                <span className="inline-flex items-center gap-2 text-sm font-medium lowercase border border-[#181612] text-[#181612] rounded-md px-4 py-2.5 hover:bg-[#181612] hover:text-[#F4F1EA] transition-colors group/cta">
                  explore custom plans
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const JournalTeaser = () => {
  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const recent = [...posts]
    .filter((p) => p.publishedAt)
    .sort((a, b) => {
      const aDate = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const bDate = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 3);

  // Fallback so the section always has something to render in dev/empty states
  const placeholderRows = [
    { slug: "#", title: "the case for stopping at 'good enough'", category: "strategy", date: "may 2026", read: "4 min read" },
    { slug: "#", title: "how to audit your own website in 30 minutes", category: "audits", date: "april 2026", read: "6 min read" },
    { slug: "#", title: "why your homepage isn't converting", category: "conversion", date: "march 2026", read: "5 min read" },
  ];

  const formatDate = (raw: Date | string | null | undefined) => {
    if (!raw) return "";
    const d = new Date(raw);
    return d
      .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      .toLowerCase();
  };

  const readTime = (content?: string | null) => {
    if (!content) return "3 min";
    const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
  };

  const rows =
    recent.length > 0
      ? recent.map((p) => {
          // Try to read first category if the API returned it embedded
          const cats = (p as unknown as { categories?: { name: string }[] }).categories;
          return {
            slug: p.slug,
            title: p.title,
            category: cats && cats.length > 0 ? cats[0].name.toLowerCase() : "",
            date: formatDate(p.publishedAt),
            read: readTime(p.content),
          };
        })
      : placeholderRows;

  return (
    <section className="pt-12 pb-14 bg-[#F4F1EA] relative z-[2]">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B1421] mb-3 block">
                from the journal
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-[#181612] lowercase">
                things worth <span className="text-[#6B1421]">reading</span>.
              </h2>
            </div>
            <Link
              href="/journal"
              className="group inline-flex items-center gap-2 text-sm font-medium lowercase text-[#181612] hover:text-[#6B1421] transition-colors self-start md:self-end"
            >
              <span className="relative">
                all posts
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#6B1421] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="border-y border-[#181612]/[0.12]">
          {rows.map((row, i) => (
            <ScrollReveal key={`${row.slug}-${i}`} delay={i * 0.06}>
              <Link
                href={row.slug.startsWith("/") || row.slug === "#" ? row.slug : `/journal/post/${row.slug}`}
                className="group flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-8 py-6 md:py-7 px-2 -mx-2 border-t border-[#181612]/[0.12] first:border-t-0 transition-all hover:bg-[#E7E2D6]/30 rounded-md"
              >
                <div className="flex items-center gap-4 md:gap-6 min-w-0 flex-1">
                  <span className="font-mono text-xs text-ink-mid tabular-nums shrink-0">
                    0{i + 1}
                  </span>
                  <span className="text-base md:text-lg font-medium text-[#181612] group-hover:text-[#6B1421] transition-colors lowercase truncate">
                    {row.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 md:pl-8">
                  {row.category && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#F4F1EA] bg-[#6B1421] rounded-md px-2 py-1 shrink-0">
                      {row.category}
                    </span>
                  )}
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mid">
                    {row.date} · {row.read}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-[#6B1421] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    strokeWidth={1.75}
                  />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    website: "",
    interestedIn: "not sure yet",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          companyWebsite: data.website || data.company,
          jobRole: "Not specified",
          companySize: "Not specified",
          projectType: data.interestedIn,
          budget: "Not specified",
          message: data.message,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit inquiry");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "got it.", description: "we'll be in touch shortly." });
      setFormData({ name: "", company: "", email: "", website: "", interestedIn: "not sure yet", message: "" });
    },
    onError: () => {
      toast({ title: "something went wrong", description: "please try again.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };


  return (
    <section className="py-12 md:py-16 bg-[#F4F1EA] text-[#181612] relative z-[2]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-8 lowercase">
              your next customer is{" "}
              <span className="text-[#6B1421]">searching right now</span>.
              can they find you?
            </h2>
            <p className="text-xl md:text-2xl text-[#181612]/80 mb-12 max-w-md lowercase">
              let's dig & find out. tell us about your business goals &
              aspirations & watch us turn them into reality.
            </p>
          </div>
          <div className="bg-[#FBF9F3] p-8 md:p-10 border border-[#181612]/10 rounded-md text-[#181612] shadow-[0_2px_12px_rgba(24,22,18,0.04)]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mid">
                    name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-[#181612]/20 focus:border-[#6B1421] outline-none py-3 transition-colors placeholder:text-[#181612]/30 text-[#181612] lowercase"
                    placeholder="jane doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mid">
                    company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-transparent border-b border-[#181612]/20 focus:border-[#6B1421] outline-none py-3 transition-colors placeholder:text-[#181612]/30 text-[#181612] lowercase"
                    placeholder="acme inc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mid">
                    email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-[#181612]/20 focus:border-[#6B1421] outline-none py-3 transition-colors placeholder:text-[#181612]/30 text-[#181612]"
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mid">
                    website url
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-transparent border-b border-[#181612]/20 focus:border-[#6B1421] outline-none py-3 transition-colors placeholder:text-[#181612]/30 text-[#181612]"
                    placeholder="acme.com"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mid block">
                  interested in
                </label>
                <div className="flex flex-wrap gap-2">
                  {["strategy", "design", "the full dig", "not sure yet"].map((opt) => {
                    const selected = formData.interestedIn === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({ ...formData, interestedIn: opt })}
                        className={cn(
                          "text-sm lowercase rounded-md px-4 py-2 border transition-colors",
                          selected
                            ? "bg-[#181612] text-[#F4F1EA] border-[#181612]"
                            : "bg-transparent text-[#181612] border-[#181612]/20 hover:border-[#6B1421] hover:text-[#6B1421]"
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-mid">
                  message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-[#181612]/20 focus:border-[#6B1421] outline-none py-3 transition-colors min-h-[100px] resize-none placeholder:text-[#181612]/30 text-[#181612] lowercase"
                  placeholder="tell us about your business..."
                />
              </div>
              <MagneticButton>
                <Button type="submit" size="lg" className="w-full text-lg h-14 bg-[#181612] hover:bg-[#6B1421] text-[#F4F1EA] rounded-md transition-colors lowercase" disabled={contactMutation.isPending}>
                  {contactMutation.isPending ? "sending..." : "let's dig in"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </MagneticButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};


const Footer = () => null;

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#F4F1EA] text-[#181612] font-sans selection:bg-[#6B1421] selection:text-[#F4F1EA]">
      <SEO
        title="sarahdigs | beautiful websites, built to convert"
        exactTitle
        description="sarahdigs is a creative website studio that designs and builds high-performing websites for founders and brands. beautiful websites, built to convert."
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sarah Islam",
          jobTitle: "Founder & Web Designer",
          url: "https://www.sarahdigs.com/about",
          worksFor: { "@id": "https://www.sarahdigs.com/#organization" },
          knowsAbout: [
            "Website Design",
            "Web Development",
            "UX Design",
            "Brand Strategy",
            "SEO",
          ],
        }}
      />
      <Navbar theme="light" />
      <Hero />
      <ProofSection />
      <Manifesto />
      <MeetSarah />
      <HowWeWork />
      <FullDigTeaser />
      <Testimonials />
      <SelectedWork />
      <NotSureWhereToStart />
      <JournalTeaser />
      <Contact />
      <FooterComponent />
    </div>
  );
}