import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * HalaJapan case-study carousel.
 * Each slide pairs a CSS-drawn mockup of the real HalaJapan product (using the
 * client's restrained palette — ink navy #1B2432 on cream #F1F0EB, a muted
 * forest-green accent #38513E, elegant serif display) with a tag / name /
 * description / pills block. Project-specific — rendered only for `halajapan`.
 * All sample content is generic; no private client data.
 */

// HalaJapan's real palette (from the brand): paper, snow, mist, ink, and pine
// as the only accent.
const INK = "#1A2230";
const CREAM = "#F1F2EE";   // paper
const PAPER = "#FAFAF8";   // snow
const GREEN = "#2C5F53";   // pine — the only accent
const SAND = "#DADDD8";    // mist
const MUTED = "#4A5462";   // ink soft

const serif = "'Merriweather', Georgia, serif";

// ── 1. Homepage hero ──
const Home = () => (
  <div className="w-full h-full flex flex-col" style={{ background: CREAM }}>
    <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b" style={{ borderColor: SAND }}>
      <span style={{ fontFamily: serif }} className="text-base"><span style={{ color: GREEN }}>hala</span><span style={{ color: INK }}>japan</span></span>
      <div className="hidden md:flex items-center gap-3 text-[9px]" style={{ color: INK }}>
        <span>summer journeys</span><span>private japan</span><span>family services</span><span>experiences</span>
        <span style={{ color: MUTED }}>for travel advisors</span>
      </div>
    </div>
    <div className="flex-1 flex flex-col justify-center px-6 md:px-8">
      <div style={{ fontFamily: serif, color: INK }} className="text-2xl md:text-[2.1rem] leading-[1.08] mb-4">
        private journeys in japan.<br />planned for one household.
      </div>
      <div className="flex gap-6">
        <div className="max-w-[55%]">
          <p className="text-[11px] leading-relaxed mb-1" style={{ color: INK }}>we plan private trips for families who travel as one household.</p>
          <p className="text-[11px] leading-relaxed" style={{ color: MUTED }}>working directly from tokyo and osaka.</p>
        </div>
        <div className="border-l pl-4" style={{ borderColor: SAND }}>
          <p className="text-[8px] uppercase tracking-wide mb-1" style={{ color: MUTED }}>japan travel registration</p>
          <p className="text-[9px]" style={{ color: INK }}>licensed & accredited</p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 border-t px-6 py-4 gap-6" style={{ borderColor: SAND }}>
      {[["summer journeys", "the lead product, planned with close attention to the season."], ["private japan", "a year-round offer for families travelling together."]].map(([t, d], i) => (
        <div key={i} className={i === 0 ? "border-r pr-6" : ""} style={{ borderColor: SAND }}>
          <div style={{ fontFamily: serif, color: INK }} className="text-sm mb-1">{t}</div>
          <p className="text-[9px] leading-snug" style={{ color: MUTED }}>{d}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── 2. Itinerary cards ("where families often start") ──
const Itineraries = () => (
  <div className="w-full h-full p-6 flex flex-col" style={{ background: CREAM }}>
    <div style={{ fontFamily: serif, color: INK }} className="text-xl mb-4">where families often start</div>
    <div className="grid grid-cols-2 gap-4 flex-1">
      {[
        { places: ["tokyo", "mt fuji"], title: "tokyo and mt fuji", bg: "#8FA6B8" },
        { places: ["osaka", "kyoto", "nara"], title: "osaka, kyoto and nara", bg: "#9AA38C" },
      ].map((c, i) => (
        <div key={i} className="rounded-lg overflow-hidden flex flex-col" style={{ background: PAPER, border: `1px solid ${SAND}` }}>
          <div className="h-16" style={{ background: c.bg }} />
          <div className="p-3 flex flex-col flex-1">
            <div className="text-[11px] font-semibold mb-1" style={{ color: GREEN }}>4–5 <span className="font-normal text-[8px]" style={{ color: MUTED }}>days</span></div>
            <div style={{ fontFamily: serif, color: INK }} className="text-[13px] mb-2">{c.title}</div>
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {c.places.map((p, j) => (
                <span key={j} className="flex items-center gap-1 text-[8px]" style={{ color: INK }}>
                  {j > 0 && <span className="w-3 h-px" style={{ background: SAND }} />}
                  <span className="w-1 h-1 rounded-full" style={{ background: GREEN }} />{p}
                </span>
              ))}
            </div>
            <span className="mt-auto self-start text-[9px] px-2.5 py-1.5 rounded text-white" style={{ background: INK }}>+ add to my trip</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── 3. Experiences grid (kanji filters) ──
const Experiences = () => (
  <div className="w-full h-full p-5 flex" style={{ background: CREAM }}>
    {/* filter rail */}
    <div className="w-24 shrink-0 pr-3 border-r" style={{ borderColor: SAND }}>
      <div className="text-[8px] mb-2" style={{ color: MUTED }}>when?</div>
      <div className="grid grid-cols-2 gap-1 mb-3">
        {["春", "夏", "秋", "冬"].map((k) => (
          <div key={k} className="text-center">
            <div style={{ fontFamily: serif, color: SAND }} className="text-base leading-none">{k}</div>
          </div>
        ))}
      </div>
      <div className="text-[8px] mb-1.5" style={{ color: MUTED }}>type</div>
      <div className="flex flex-col gap-1">
        <span className="text-[8px] px-2 py-1 rounded-full text-white text-center" style={{ background: INK }}>all</span>
        {["遊 family", "寺 culture", "山 nature", "食 food"].map((t) => (
          <span key={t} className="text-[8px]" style={{ color: GREEN }}>{t}</span>
        ))}
      </div>
    </div>
    {/* grid */}
    <div className="flex-1 pl-4">
      <div className="mb-3"><span style={{ color: GREEN }} className="text-lg font-semibold">12</span> <span className="text-[9px]" style={{ color: MUTED }}>experiences</span></div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["遊 family · tokyo", "tokyo disneyland, paced for every age", "#B8A99A"],
          ["遊 family · osaka", "universal studios japan", "#9AA38C"],
          ["遊 family · nara", "deer, temples and nara park", "#A8A290"],
          ["寺 culture · kyoto", "a tea ceremony in a kyoto tea house", "#8C9A82"],
        ].map(([tag, title, bg], i) => (
          <div key={i} className="rounded-md overflow-hidden relative h-[72px] flex flex-col justify-end p-2.5" style={{ background: bg as string }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(27,36,50,0.55), rgba(27,36,50,0.1))" }} />
            <div className="relative">
              <div className="text-[7px] text-white/85 mb-0.5">{tag}</div>
              <div style={{ fontFamily: serif }} className="text-[10px] text-white leading-tight">{title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── 4. The "plan your trip" guided wizard (the differentiator) ──
const Planner = () => (
  <div className="w-full h-full p-5 flex gap-3" style={{ background: CREAM }}>
    <div className="flex-1 rounded-lg p-4 flex flex-col" style={{ background: PAPER, border: `1px solid ${SAND}` }}>
      <div style={{ fontFamily: serif, color: INK }} className="text-base mb-3">plan your trip.</div>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-0.5 flex-1 rounded-full" style={{ background: n === 1 ? GREEN : SAND }} />
        ))}
      </div>
      <div className="text-[8px] mb-1" style={{ color: MUTED }}>01 / 06</div>
      <div style={{ fontFamily: serif, color: INK }} className="text-sm mb-3">who is coming?</div>
      <div className="flex flex-col gap-1.5">
        {[["adults", "1"], ["grandparents", "1"], ["children", "0"]].map(([l, v]) => (
          <div key={l} className="flex items-center justify-between rounded px-2.5 py-1.5" style={{ background: CREAM }}>
            <span className="text-[9px]" style={{ color: INK }}>{l}</span>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[8px]" style={{ borderColor: SAND, color: MUTED }}>−</span>
              <span className="text-[9px] w-3 text-center" style={{ color: INK }}>{v}</span>
              <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[8px]" style={{ borderColor: SAND, color: MUTED }}>+</span>
            </div>
          </div>
        ))}
      </div>
      <span className="mt-auto self-end text-[9px] px-3 py-1.5 rounded text-white" style={{ background: INK }}>continue →</span>
    </div>
    {/* live "your plan so far" panel */}
    <div className="w-[38%] rounded-lg p-4" style={{ background: GREEN }}>
      <div style={{ fontFamily: serif }} className="text-[13px] text-white mb-3">your plan so far</div>
      {[["added to my trip", "tokyo disneyland, universal studios, nara park"], ["travelling", "adults 1 · grandparents 1"], ["months", "april, may, june"]].map(([l, v]) => (
        <div key={l} className="mb-2.5">
          <div className="text-[7px] mb-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{l}</div>
          <div className="text-[8px] leading-snug" style={{ color: "rgba(255,255,255,0.92)" }}>{v}</div>
        </div>
      ))}
      <div className="text-[7px] mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>your answers stay on this device until you send them.</div>
    </div>
  </div>
);

// ── 5. "My trip" builder panel ──
const MyTrip = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ background: INK }}>
    <div className="w-[230px] rounded-lg overflow-hidden" style={{ background: PAPER }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: SAND }}>
        <span style={{ fontFamily: serif, color: INK }} className="text-sm">my trip</span>
        <span className="text-[9px] underline" style={{ color: INK }}>close</span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {[["#B8A99A", "tokyo disneyland, paced for every age"], ["#9AA38C", "universal studios japan, osaka"], ["#A8A290", "deer, temples and nara park"]].map(([bg, title], i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-md p-2" style={{ background: CREAM }}>
            <div className="w-8 h-8 rounded shrink-0" style={{ background: bg as string }} />
            <span style={{ fontFamily: serif, color: INK }} className="text-[9px] leading-tight flex-1">{title}</span>
            <span className="text-[8px] underline" style={{ color: MUTED }}>remove</span>
          </div>
        ))}
      </div>
      <div className="p-3 pt-1">
        <div className="text-center text-[10px] text-white rounded-md py-2" style={{ background: INK }}>plan my trip</div>
      </div>
    </div>
  </div>
);

// ── 6. Arabic RTL view ──
const Arabic = () => (
  <div className="w-full h-full flex flex-col" dir="rtl" style={{ background: CREAM }}>
    <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b" style={{ borderColor: SAND }}>
      <span style={{ fontFamily: serif }} className="text-base"><span style={{ color: GREEN }}>هلا</span> <span style={{ color: INK }}>يابان</span></span>
      <div className="flex items-center gap-3 text-[9px]" style={{ color: INK }}>
        <span>رحلات الصيف</span><span>اليابان الخاصة</span><span>خدمات العائلة</span>
        <span className="px-2 py-0.5 rounded text-[8px]" style={{ background: INK, color: "#fff" }}>EN</span>
      </div>
    </div>
    <div className="flex-1 flex flex-col justify-center px-8">
      <div style={{ fontFamily: serif, color: INK }} className="text-2xl md:text-[1.9rem] leading-[1.15] mb-4">
        رحلات خاصة في اليابان.<br />مصممة لعائلة واحدة.
      </div>
      <p className="text-[11px] leading-relaxed mb-1" style={{ color: INK }}>نخطط رحلات خاصة للعائلات التي تسافر معًا.</p>
      <p className="text-[11px] leading-relaxed mb-5" style={{ color: MUTED }}>نعمل مباشرة من طوكيو وأوساكا.</p>
      <span className="self-start text-[10px] px-4 py-2 rounded text-white" style={{ background: INK }}>ابدأ الاستفسار ←</span>
    </div>
    <div className="border-t px-6 py-3 text-[8px]" style={{ borderColor: SAND, color: MUTED }}>
      مكتوب بالعربية، وليس مترجمًا — بتصميم من اليمين إلى اليسار بالكامل.
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
    visual: <Home />,
    tag: "Brand & site",
    name: "Built to pass a quiet background check",
    desc: "advisors read the site alone before recommending the agency. so it's built to survive that check: a restrained identity, declarative copy, and a design where every claim sits beside its proof.",
    pills: ["Credential, not a sales funnel", "Every claim shown with its proof", "'hala' = welcome, in pine + ink", "Finished on type and space alone"],
  },
  {
    visual: <Itineraries />,
    tag: "Journeys",
    name: "Itineraries families can actually picture",
    desc: "named, specific journeys with routes, pacing, and duration — not generic tour language. each one can be added straight into a trip the family is shaping.",
    pills: ["Named, specific journeys", "Route + pacing shown", "Add to my trip", "No pricing, enquiry-led"],
  },
  {
    visual: <Experiences />,
    tag: "Experiences",
    name: "A filterable library of real experiences",
    desc: "experiences organised by season and type, with japanese character markers, duration, and lead time — deep enough to feed both the family and corporate sides of the business.",
    pills: ["Filter by season + type", "Duration + book-ahead", "Feeds every silo", "SEO depth by design"],
  },
  {
    visual: <Planner />,
    tag: "Trip planner",
    name: "A guided planner that becomes the enquiry",
    desc: "a six-step tool that lets a family shape their own journey — who's coming, when, where — with a live summary that sends to the desk or straight to whatsapp, with server checks, a bot trap, and rate limiting.",
    pills: ["6-step guided flow", "Live 'your plan' summary", "Sends to desk or whatsapp", "Server checks + bot trap"],
  },
  {
    visual: <MyTrip />,
    tag: "Trip builder",
    name: "Everything collected in one place",
    desc: "selected experiences gather in a personal 'my trip' tray the family can review and refine before sending, so the enquiry arrives already shaped around what they want.",
    pills: ["Personal trip tray", "Add / remove freely", "One clear next step", "No account required"],
  },
  {
    visual: <Arabic />,
    tag: "Bilingual · RTL",
    name: "Written in arabic, not translated into it",
    desc: "a full right-to-left arabic experience — layout, navigation, and forms all mirrored, with copy written natively for register and gulf etiquette rather than machine-translated after the fact.",
    pills: ["True RTL build", "Native arabic copy", "Mirrored layout + forms", "Gulf etiquette throughout"],
  },
];

export function HalaJapanCaseStudy() {
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
                  <div className="lg:col-span-7">
                    <div className="rounded-md overflow-hidden border border-ink/10 h-56 md:h-[340px]">
                      {s.visual}
                    </div>
                  </div>
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
