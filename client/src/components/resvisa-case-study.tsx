import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ResVisa case-study carousel.
 * Each slide pairs a CSS-drawn mockup of the real ResVisa product (using the
 * client's "Warm Mediterranean" palette — terracotta #C56B4A on cream #FCFAF5,
 * Iberian navy #1B2537 text) with a tag / name / description / pills block.
 * Project-specific by design — rendered only for the `resvisa` standalone page.
 */

const TERRA = "#C56B4A";
const NAVY = "#1B2537";
const CREAM = "#FCFAF5";
const SAND = "#D6CBB8";
const BEIGE = "#F0E8DA";
const TINT = "#F3E0D6";
const SLATE = "#636C80";
const GREEN = "#5A7E52";
const AMBER = "#C99A2E";

// ── 1. Marketing homepage ──
const Marketing = () => (
  <div className="w-full h-full flex flex-col" style={{ background: NAVY }}>
    {/* nav */}
    <div className="flex items-center justify-between px-5 pt-4">
      <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
        <span className="inline-block w-3.5 h-4 rounded-sm rounded-t-lg" style={{ background: TERRA }} />
        resvisa
      </div>
      <div className="hidden md:flex items-center gap-3 text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
        <span>which visa?</span><span>life in spain</span><span>faq</span>
        <span className="px-2.5 py-1 rounded-md text-white text-[10px] font-medium" style={{ background: TERRA }}>check eligibility</span>
      </div>
    </div>
    {/* hero */}
    <div className="flex-1 flex flex-col justify-center px-5 md:px-6">
      <div className="text-[9px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: TERRA }}>licensed immigration experts</div>
      <div className="font-serif text-2xl md:text-4xl leading-[0.95] text-white mb-2" style={{ fontFamily: "Merriweather, Georgia, serif", letterSpacing: "-0.01em" }}>
        become a<br />european resident.
      </div>
      <div className="text-[11px] max-w-xs mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>legal residency in spain — for you and your family. every step handled.</div>
      <span className="self-start text-[11px] px-3.5 py-2 rounded-lg text-white font-medium" style={{ background: TERRA }}>check if you qualify →</span>
    </div>
    {/* stat row */}
    <div className="grid grid-cols-3 border-t px-5 py-3" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
      {[["100+", "individuals relocated"], ["7", "years guiding residency"], ["95%", "approval rate"]].map(([n, l]) => (
        <div key={l}>
          <div className="text-white font-serif text-lg leading-none" style={{ fontFamily: "Merriweather, Georgia, serif" }}>{n}</div>
          <div className="text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</div>
        </div>
      ))}
    </div>
  </div>
);

// ── 2. Eligibility quiz ──
const Quiz = () => (
  <div className="w-full h-full flex flex-col justify-center px-6 md:px-10" style={{ background: CREAM }}>
    <div className="flex items-center justify-between text-[10px] mb-1.5" style={{ color: SLATE }}>
      <span>step 1 of 17</span><span>0%</span>
    </div>
    <div className="h-1.5 rounded-full mb-5" style={{ background: TINT }}>
      <div className="h-full w-[3%] rounded-full" style={{ background: TERRA }} />
    </div>
    <div className="font-serif text-lg md:text-2xl mb-4" style={{ color: NAVY, fontFamily: "Merriweather, Georgia, serif" }}>
      what's your situation with spain right now?
    </div>
    <div className="flex flex-col gap-2">
      {["outside spain, no residency yet", "in spain, i already hold residency", "i hold spanish residency but live abroad"].map((o, i) => (
        <div key={i} className="text-[11px] px-4 py-2.5 rounded-xl bg-white font-medium" style={{ color: NAVY, border: `1px solid ${SAND}` }}>{o}</div>
      ))}
    </div>
    <span className="self-end mt-3 text-[10px] px-4 py-2 rounded-lg text-white font-medium" style={{ background: "#D9A488" }}>continue</span>
  </div>
);

// ── 3. Quiz result (the completion ring) ──
const Result = () => {
  const pct = 95;
  const r = 30, c = 2 * Math.PI * r;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6" style={{ background: CREAM }}>
      <div className="text-[9px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: SLATE }}>your eligibility result</div>
      <svg width="86" height="86" viewBox="0 0 80 80" className="mb-3">
        <circle cx="40" cy="40" r={r} fill="none" stroke={SAND} strokeWidth="7" opacity="0.5" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={GREEN} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 40 40)" />
        <text x="40" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fill={NAVY} fontFamily="Merriweather, Georgia, serif">{pct}%</text>
      </svg>
      <div className="font-serif text-lg md:text-xl text-center leading-tight mb-1.5" style={{ color: NAVY, fontFamily: "Merriweather, Georgia, serif" }}>
        spain looks like a strong fit for you
      </div>
      <div className="w-full max-w-[240px] rounded-xl px-3.5 py-2.5 mt-2" style={{ background: TINT }}>
        <div className="text-[8px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: TERRA }}>your recommended route</div>
        <div className="text-[12px] font-semibold" style={{ color: NAVY }}>Non-Lucrative Visa</div>
      </div>
      <div className="w-full max-w-[240px] rounded-xl px-3.5 py-2 mt-2" style={{ background: BEIGE }}>
        <div className="text-[9px] font-semibold" style={{ color: NAVY }}>✉ check your email</div>
        <div className="text-[10px] font-medium mt-0.5" style={{ color: TERRA }}>open my email →</div>
      </div>
    </div>
  );
};

// ── 4. Admin case board (3-phase) ──
const CaseBoard = () => {
  const phases: [string, string, string, number][] = [
    ["1", "pre-steps", "#2F6BD8", 15],
    ["2", "the process", "#E8940F", 0],
    ["3", "after approval", "#2E7D55", 0],
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2" style={{ background: "#F7F8FA" }}>
      <div className="text-[11px] font-semibold" style={{ color: NAVY }}>ResVisa team · cases</div>
      <div className="text-[8px]" style={{ color: SLATE }}>drag a case between phases to move it — the applicant and team are notified</div>
      <div className="grid grid-cols-3 gap-2 flex-1">
        {phases.map(([num, title, color, count]) => (
          <div key={num} className="rounded-md overflow-hidden flex flex-col" style={{ background: "white", border: "1px solid #eceef2" }}>
            <div className="flex items-center justify-between px-2.5 py-1.5" style={{ background: color }}>
              <span className="text-[9px] font-semibold text-white lowercase">{title}</span>
              <span className="text-[9px] font-semibold text-white">{count}</span>
            </div>
            <div className="p-1.5 flex flex-col gap-1.5 flex-1">
              {num === "1" ? (
                [["Applicant A", "35%"], ["Applicant B", "60%"]].map(([n, p]) => (
                  <div key={n} className="rounded p-1.5" style={{ background: "white", border: "1px solid #eceef2" }}>
                    <div className="text-[9px] font-semibold" style={{ color: NAVY }}>{n}</div>
                    <div className="text-[7px] mb-1" style={{ color: SLATE }}>Non-Lucrative</div>
                    <div className="h-1 rounded-full" style={{ background: "#eceef2" }}>
                      <div className="h-full rounded-full" style={{ background: "#2F6BD8", width: p }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-[8px]" style={{ color: "#b7bdc7" }}>no cases</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 5. Leads table ──
const Leads = () => {
  // Placeholder rows — generic sample names only, no real applicant data.
  const rows: [string, string, string, string][] = [
    ["Applicant A", "strong fit", "Non-Lucrative", "94"],
    ["Applicant B", "possible fit", "Entrepreneur", "71"],
    ["Applicant C", "strong fit", "Digital Nomad", "88"],
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2.5" style={{ background: "#F7F8FA" }}>
      <div className="text-[11px] font-semibold" style={{ color: NAVY }}>ResVisa team · leads</div>
      <div className="grid grid-cols-4 gap-1.5">
        {[["0", "needs review"], ["42", "new leads"], ["0", "contacted"], ["22", "qualified"]].map(([n, l]) => (
          <div key={l} className="rounded-md px-2 py-1.5" style={{ background: "white", border: "1px solid #eceef2" }}>
            <div className="text-sm font-semibold" style={{ color: n === "42" ? "#2F6BD8" : n === "22" ? GREEN : NAVY }}>{n}</div>
            <div className="text-[7px]" style={{ color: SLATE }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="rounded-md overflow-hidden flex-1" style={{ background: "white", border: "1px solid #eceef2" }}>
        <div className="grid grid-cols-[1.3fr_1fr_1fr_0.5fr] px-2.5 py-1.5 text-[7px] font-semibold uppercase tracking-wide" style={{ color: SLATE, background: "#fbfbfc" }}>
          <span>name</span><span>fit</span><span>visa type</span><span>score</span>
        </div>
        {rows.map(([name, fit, visa, score]) => (
          <div key={name} className="grid grid-cols-[1.3fr_1fr_1fr_0.5fr] items-center px-2.5 py-1.5 text-[9px] border-t" style={{ borderColor: "#f0f1f4", color: NAVY }}>
            <span className="font-semibold">{name}</span>
            <span><span className="px-1.5 py-0.5 rounded text-[7px] font-medium" style={fit === "strong fit" ? { background: "#e5f0e2", color: GREEN } : { background: "#faf0dc", color: AMBER }}>{fit}</span></span>
            <span style={{ color: SLATE }}>{visa}</span>
            <span className="font-semibold">{score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 6. AI chatbot ──
const Chatbot = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ background: NAVY }}>
    <div className="w-[210px] rounded-xl overflow-hidden shadow-xl" style={{ background: CREAM }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ background: TERRA }}>
        <span className="text-[11px] font-semibold text-white">🤖 resvisa assistant</span>
        <span className="text-white text-[11px]">×</span>
      </div>
      <div className="p-3 flex flex-col gap-2" style={{ minHeight: 120 }}>
        <div className="self-start text-[10px] px-3 py-2 rounded-xl bg-white max-w-[85%]" style={{ color: NAVY, border: `1px solid ${SAND}` }}>
          hello! how can i help you with your move to spain?
        </div>
        <div className="self-start flex gap-1.5 flex-wrap">
          {["start the quiz", "which visa?"].map((c) => (
            <span key={c} className="text-[8px] px-2 py-1 rounded-full font-medium" style={{ background: TINT, color: TERRA }}>{c}</span>
          ))}
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: BEIGE }}>
          <span className="text-[9px] flex-1" style={{ color: SLATE }}>type a message…</span>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px]" style={{ background: "#D9A488" }}>➤</span>
        </div>
      </div>
    </div>
  </div>
);

type CaseSlide = {
  visual: React.ReactNode;
  tag: string;
  name: string;
  desc: string;
  pills: string[];
};

const slides: CaseSlide[] = [
  {
    visual: <Marketing />,
    tag: "Marketing site",
    name: "A bilingual marketing site, built to convert",
    desc: "A full EN/AR site — homepage, visa guide, life in spain, faq, contact, and blog — positioning resvisa as licensed experts who handle every step from the first question to the residency card.",
    pills: ["Bilingual EN + AR (RTL)", "4 visa routes explained", "Rich SEO + schema", "Built to convert"],
  },
  {
    visual: <Quiz />,
    tag: "Eligibility engine",
    name: "A ~15-question quiz that scores every route",
    desc: "The lead-generation engine: a guided quiz that scores each person against all four visa routes with hard gates, cap flags, and weighted per-route logic — auto-advancing as they go.",
    pills: ["Scores all 4 routes", "Hard gates + cap flags", "Auto-advance UX", "Green / amber / red result"],
  },
  {
    visual: <Result />,
    tag: "Result + onboarding",
    name: "A clear result, then straight into the portal",
    desc: "Each person gets a percentage, a fit band, and their recommended route — then a magic link that creates their account and drops them into the portal in one click, no signup step.",
    pills: ["Fit % + recommended route", "Warm, honest copy", "One-click magic-link onboarding", "No signup friction"],
  },
  {
    visual: <CaseBoard />,
    tag: "Admin ERP",
    name: "A 3-phase case board for the whole team",
    desc: "Staff move each case through pre-steps, process, and after-approval — drag to advance, and the applicant and team are notified automatically. The operational core of the business.",
    pills: ["3-phase drag board", "Auto notifications on move", "Document review + comments", "Work-queue stats"],
  },
  {
    visual: <Leads />,
    tag: "Lead management",
    name: "Every lead scored, filtered, and triaged",
    desc: "A live leads dashboard with fit bands, visa type, score, and status — filterable and searchable — so the team always knows who's worth pursuing and who needs review first.",
    pills: ["Fit band + score per lead", "Filter by fit + status", "Search by name / email", "Qualified-lead stats"],
  },
  {
    visual: <Chatbot />,
    tag: "AI chatbot",
    name: "A Claude-powered assistant, grounded in the FAQ",
    desc: "A genuinely conversational assistant grounded in the 197-entry faq database — multi-message replies like texting, tappable suggestion chips, and a direct 'start the quiz' action.",
    pills: ["Claude-powered", "Grounded in FAQ database", "Tappable suggestion chips", "Quiz-aware"],
  },
];

export function ResVisaCaseStudy() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-bone pb-10 md:pb-14">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex items-center gap-3 mb-8 md:mb-10">
          <span className="h-px w-8 bg-oxblood/40" />
          <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">a closer look</span>
        </div>

        <div className="overflow-hidden rounded-md" ref={emblaRef}>
          <div className="flex">
            {slides.map((s, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-10 items-stretch px-px">
                  {/* visual ~70% */}
                  <div className="lg:col-span-7">
                    <div className="rounded-md overflow-hidden border border-ink/10 h-56 md:h-[340px]">
                      {s.visual}
                    </div>
                  </div>
                  {/* body ~30% */}
                  <div className="lg:col-span-3 flex flex-col justify-center">
                    <span className="inline-block self-start text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mid border border-ink/15 rounded-full px-3 py-1 mb-4">
                      {s.tag}
                    </span>
                    <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight text-ink leading-snug mb-3">
                      {s.name}
                    </h3>
                    <p className="text-ink-mid text-sm md:text-[15px] leading-relaxed mb-5">
                      {s.desc}
                    </p>
                    <ul className="space-y-2 border-t border-ink/10 pt-4">
                      {s.pills.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[13px] font-medium text-oxblood leading-snug lowercase">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-oxblood shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* nav: counter · dots · arrows */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-ink-mid tabular-nums">{selected + 1} / {slides.length}</span>
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === selected ? "w-6 bg-ink" : "w-1.5 bg-ink/25 hover:bg-ink/45"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => emblaApi?.scrollPrev()} aria-label="previous" className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink hover:bg-ink hover:text-bone transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} aria-label="next" className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink hover:bg-ink hover:text-bone transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
