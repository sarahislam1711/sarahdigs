import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { serviceSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { openCalendly } from "@/lib/calendly";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// focus areas grouped by discipline
const MODULE_GROUPS: { label: string; items: string[] }[] = [
  { label: "strategy", items: ["Website Strategy", "Positioning & Messaging", "Audience Research", "Competitive Analysis"] },
  { label: "design", items: ["UX Audit", "Design Direction", "Interaction Design", "Mobile Experience"] },
  { label: "build", items: ["Website Development", "CMS & Content Structure", "Performance Optimization", "Site Migration"] },
  { label: "growth", items: ["SEO Strategy", "AI Search Optimization", "Conversion Optimization", "Analytics Setup"] },
];

const Eyebrow = ({ children, center }: { children: React.ReactNode; center?: boolean }) => (
  <div className={`flex items-center gap-3 mb-5 ${center ? "justify-center" : ""}`}>
    <span className="h-px w-8 bg-oxblood/40" />
    <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">{children}</span>
  </div>
);

// ── 01 — OPENING ──
const Hero = () => (
  <section className="bg-bone pt-24 pb-12 md:pt-28 md:pb-16">
    <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
      <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-12 text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
        <span>sarahdigs · creative website studio</span>
        <span className="hidden md:inline">vol. 03 · custom dig</span>
        <span>2026</span>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <h1 className="font-display font-semibold tracking-tighter text-5xl md:text-7xl leading-[0.98] lowercase mb-6">
          tell us what you need.<br /><span className="text-oxblood italic">we'll build the plan.</span>
        </h1>
        <p className="font-display text-xl md:text-2xl text-ink font-medium italic lowercase leading-snug max-w-2xl mb-9">
          a custom engagement scoped to your business, goals, and gaps.
        </p>
        <Button
          size="lg"
          onClick={() => document.getElementById("focus-areas")?.scrollIntoView({ behavior: "smooth" })}
          className="group h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2 text-base"
        >
          start your plan
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Button>
      </motion.div>
    </div>
  </section>
);

// ── 02 — HOW IT WORKS ──
const HowItWorks = () => {
  const steps = [
    { num: "01", title: "tell", desc: "fill out the brief below. tell us where you are and what you need." },
    { num: "02", title: "plan", desc: "we design a custom scope that fits your goals, timeline, and budget." },
    { num: "03", title: "build", desc: "we get to work. clear milestones, direct communication, real output." },
  ];
  return (
    <section className="bg-bone pb-14 md:pb-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="pt-2 md:pt-4">
          <Eyebrow>how it works</Eyebrow>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="border-t border-oxblood/30 pt-5"
              >
                <span className="font-display font-extrabold text-oxblood text-3xl md:text-4xl tabular-nums tracking-tighter leading-none block mb-4">{s.num}</span>
                <h3 className="font-display font-medium text-2xl tracking-tight lowercase mb-2">{s.title}</h3>
                <p className="text-ink-mid text-[15px] leading-snug lowercase max-w-xs">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── 03 — INTERACTIVE PICKER ──
const FocusPicker = ({ selectedModules, toggleModule }: { selectedModules: string[]; toggleModule: (m: string) => void }) => (
  <section id="focus-areas" className="bg-stone py-14 md:py-20 scroll-mt-24">
    <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
      <div>
        <Eyebrow>what do you need help with</Eyebrow>
        <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl leading-none lowercase mb-10">
          pick your <span className="text-oxblood">focus areas.</span>
        </h2>

        <div className="space-y-8">
          {MODULE_GROUPS.map((group) => (
            <div key={group.label} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <span className="md:col-span-2 text-xs font-mono font-semibold uppercase tracking-[0.22em] text-ink md:pt-2.5">{group.label}</span>
              <div className="md:col-span-10 flex flex-wrap gap-2.5">
                {group.items.map((mod) => {
                  const isSelected = selectedModules.includes(mod);
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => toggleModule(mod)}
                      className={`px-4 py-2 rounded-full text-sm lowercase border transition-all duration-200 ${
                        isSelected
                          ? "bg-oxblood border-oxblood text-bone"
                          : "bg-transparent border-ink/15 text-ink-mid hover:border-oxblood/50 hover:text-ink"
                      }`}
                    >
                      {mod.toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-10 pt-8 border-t border-ink/10">
          <span className="text-sm text-ink-mid lowercase tabular-nums">
            {selectedModules.length} {selectedModules.length === 1 ? "area" : "areas"} selected
          </span>
          <Button
            size="lg"
            onClick={() => document.getElementById("custom-plan-form")?.scrollIntoView({ behavior: "smooth" })}
            className="group h-12 px-7 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2 sm:ml-auto"
          >
            build my plan
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

// ── 04 — FORM (functionality preserved, rebranded only) ──
const ConversionForm = ({ selectedModules }: { selectedModules: string[] }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessDescription: "",
    mainChallenge: "",
    budgetRange: "",
  });

  const customPlanMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; businessDescription: string; mainChallenge: string; selectedModules: string[]; budgetRange: string }) => {
      const response = await fetch("/api/custom-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit custom plan inquiry");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "brief sent!", description: "we'll review your needs and get back to you within 48 hours." });
      setFormData({ name: "", email: "", businessDescription: "", mainChallenge: "", budgetRange: "" });
    },
    onError: () => {
      toast({ title: "error", description: "failed to send your brief. please try again.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    customPlanMutation.mutate({ ...formData, selectedModules });
  };

  const inputCls = "w-full p-4 bg-[#FBF9F3] rounded-md border border-ink/15 focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none text-ink placeholder:text-ink/30 transition-all";
  const labelCls = "text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1";

  return (
    <section id="custom-plan-form" className="bg-bone pb-16 md:pb-24 scroll-mt-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <div className="border-t border-ink/10 pt-10 md:pt-14 mb-10">
          <Eyebrow>the brief</Eyebrow>
          <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl leading-none lowercase">
            let's build your <span className="text-oxblood">custom plan.</span>
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelCls}>Your Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="jane doe" />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>Your Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} placeholder="jane@company.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelCls}>What's your business about?</label>
            <textarea required value={formData.businessDescription} onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })} className={`${inputCls} min-h-[100px] resize-none`} placeholder="briefly describe your product/service..." />
          </div>

          <div className="space-y-2">
            <label className={labelCls}>What's your main challenge right now?</label>
            <textarea required value={formData.mainChallenge} onChange={(e) => setFormData({ ...formData, mainChallenge: e.target.value })} className={`${inputCls} min-h-[100px] resize-none`} placeholder="e.g. traffic but no conversions, no clear strategy..." />
          </div>

          <div className="space-y-2">
            <label className={labelCls}>Selected Focus Areas</label>
            <div className="p-4 bg-[#FBF9F3] rounded-md border border-ink/15 min-h-[60px] flex flex-wrap gap-2 items-center">
              {selectedModules.length > 0 ? (
                selectedModules.map((m) => (
                  <span key={m} className="bg-oxblood/8 text-oxblood text-xs lowercase px-2.5 py-1 rounded-full">{m.toLowerCase()}</span>
                ))
              ) : (
                <span className="text-ink-mid/60 text-sm italic lowercase">no specific areas selected yet (optional)</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelCls}>Budget Range</label>
            <div className="relative">
              <select
                required
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className={`${inputCls} appearance-none lowercase`}
              >
                <option value="" disabled>select your budget</option>
                <option value="under-5k">under $5k</option>
                <option value="5k-10k">$5k – $10k</option>
                <option value="10k-20k">$10k – $20k</option>
                <option value="20k+">$20k+</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-4 h-4 text-ink-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={customPlanMutation.isPending}
              size="lg"
              className="group w-full h-14 text-base bg-oxblood hover:bg-oxblood-soft text-white rounded-md lowercase font-medium gap-2"
            >
              {customPlanMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> sending…</>
              ) : (
                <>send brief <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

// ── 05 — WHAT HAPPENS NEXT ──
const WhatHappensNext = () => {
  const deliverables = [
    { title: "a proposed scope", desc: "exactly what we'd build, tailored to your brief." },
    { title: "a timeline", desc: "clear milestones from kickoff to launch." },
    { title: "transparent pricing", desc: "no surprises, no hidden line items." },
  ];
  return (
    <section className="bg-bone pb-14 md:pb-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="border-t border-ink/10 pt-10 md:pt-14">
          <Eyebrow>what happens next</Eyebrow>
          <p className="font-display text-2xl md:text-3xl text-ink leading-snug lowercase max-w-2xl mb-10">
            within <span className="text-oxblood">48 hours</span>, you'll get:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            {deliverables.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="border-t border-oxblood/30 pt-5"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-oxblood/10 mb-4">
                  <Check className="w-4 h-4 text-oxblood" strokeWidth={3} />
                </span>
                <h3 className="font-display font-medium text-xl tracking-tight lowercase mb-1.5">{d.title}</h3>
                <p className="text-ink-mid text-[15px] leading-snug lowercase">{d.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-ink-mid text-base lowercase mt-10">no obligation. no pressure.</p>
        </div>
      </div>
    </section>
  );
};

// ── 06 — CATCH-NET ──
const CatchNet = () => (
  <section className="bg-bone pb-20 md:pb-28">
    <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
      <div className="bg-oxblood/5 border border-oxblood/20 rounded-md p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        <div className="lg:col-span-8">
          <h2 className="font-display font-semibold tracking-tighter text-3xl md:text-4xl leading-tight lowercase mb-3">
            not sure what to pick? <span className="text-oxblood italic">that's what the dig-in is for.</span>
          </h2>
          <p className="text-ink-mid text-base md:text-lg leading-snug lowercase max-w-xl">
            a focused consultation to figure out what you actually need before committing to anything.
          </p>
        </div>
        <div className="lg:col-span-4 flex lg:justify-end">
          <Button
            size="lg"
            onClick={() => openCalendly({ tier: "dig-in consultation" })}
            className="group w-full lg:w-auto h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2"
          >
            book a dig-in instead
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default function DigOnDemand() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const toggleModule = (module: string) =>
    setSelectedModules((prev) => (prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]));

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title="custom dig | sarahdigs"
        description="a custom engagement scoped to your business, goals, and gaps. tell us what you need and we'll build the plan."
        canonical="/dig-on-demand"
        jsonLd={serviceSchema({
          name: "custom dig",
          description: "a custom engagement scoped to your business, goals, and gaps. tell us what you need and we'll build the plan.",
          url: "/dig-on-demand",
          serviceType: "Custom website engagement",
        })}
      />
      <Navbar theme="light" />
      <Hero />
      <HowItWorks />
      <FocusPicker selectedModules={selectedModules} toggleModule={toggleModule} />
      <ConversionForm selectedModules={selectedModules} />
      <WhatHappensNext />
      <CatchNet />
      <Footer />
    </div>
  );
}
