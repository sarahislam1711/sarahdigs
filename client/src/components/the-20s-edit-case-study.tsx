import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * The 20s Edit case-study carousel.
 * Each slide pairs a CSS-drawn mockup of the real platform (built in the
 * client's own editorial palette — deep oxblood #530909, cream #FAF8F4, rose
 * #c97070) with a tag / name / description / pills block.
 * Project-specific by design — rendered only for the `the-20s-edit` page.
 */

const PLUM = "#530909";
const PLUM2 = "#7A0E0E";
const BROWN = "#2B2623";
const CREAM = "#FAF8F4";
const ROSE = "#c97070";
const BORDER = "#E8E4DD";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans = { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" } as const;

// ── per-slide mockup visuals ──

// 1 · Brand identity — logotype + palette swatches
const Brand = () => (
  <div className="w-full h-full flex flex-col justify-center px-6 md:px-10" style={{ background: CREAM }}>
    <div className="text-3xl md:text-4xl" style={{ ...serif, color: PLUM, letterSpacing: "-0.01em" }}>
      the 20s edit
    </div>
    <div className="mt-1 text-[11px] uppercase" style={{ ...sans, color: BROWN, letterSpacing: "0.28em" }}>
      a curated lifestyle, for your twenties
    </div>
    <div className="flex gap-2 mt-6">
      {[PLUM, PLUM2, ROSE, BROWN, "#fff"].map((c) => (
        <div key={c} className="h-10 w-10 rounded-full border" style={{ background: c, borderColor: BORDER }} />
      ))}
    </div>
    <div className="mt-5 flex items-baseline gap-4" style={{ color: BROWN }}>
      <span className="text-2xl" style={serif}>Aa</span>
      <span className="text-sm" style={sans}>Aa Bb Cc</span>
    </div>
  </div>
);

// 2 · Homepage — magazine hero + grid
const Homepage = () => (
  <div className="w-full h-full flex flex-col" style={{ background: "#fff" }}>
    <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: BORDER }}>
      <span style={{ ...serif, color: PLUM }} className="text-lg">the 20s edit</span>
      <div className="flex gap-3 text-[10px] uppercase" style={{ ...sans, color: BROWN, letterSpacing: "0.18em" }}>
        <span>the edit</span><span>blog</span><span>about</span>
      </div>
    </div>
    <div className="flex-1 grid grid-cols-3 gap-3 p-5">
      <div className="col-span-2 rounded-md flex items-end p-4" style={{ background: PLUM }}>
        <span style={{ ...serif, color: CREAM }} className="text-xl md:text-2xl leading-tight">
          things worth<br />keeping this season
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex-1 rounded-md" style={{ background: ROSE }} />
        <div className="flex-1 rounded-md border" style={{ background: CREAM, borderColor: BORDER }} />
      </div>
    </div>
  </div>
);

// 3 · The Edit — product discovery grid
const TheEdit = () => (
  <div className="w-full h-full flex flex-col p-5" style={{ background: CREAM }}>
    <div className="flex items-center justify-between mb-4">
      <span style={{ ...serif, color: PLUM }} className="text-lg">the edit</span>
      <div className="flex gap-2">
        {["all", "home", "beauty", "style"].map((t, i) => (
          <span key={t} className="text-[9px] uppercase px-2 py-1 rounded-full" style={{ ...sans, letterSpacing: "0.14em", color: i === 0 ? "#fff" : BROWN, background: i === 0 ? PLUM : "#fff", border: `1px solid ${BORDER}` }}>{t}</span>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-4 gap-3 flex-1">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="rounded-md border flex flex-col overflow-hidden" style={{ background: "#fff", borderColor: BORDER }}>
          <div className="flex-1" style={{ background: i % 3 === 0 ? ROSE : i % 3 === 1 ? PLUM2 : "#EFE9E0" }} />
          <div className="h-2 m-1.5 rounded-full" style={{ background: BORDER }} />
        </div>
      ))}
    </div>
  </div>
);

// 4 · Blog — editorial article layout
const Blog = () => (
  <div className="w-full h-full flex" style={{ background: "#fff" }}>
    <div className="flex-1 p-6 flex flex-col justify-center">
      <span className="text-[10px] uppercase" style={{ ...sans, color: ROSE, letterSpacing: "0.22em" }}>journal · slow living</span>
      <h4 className="mt-2 text-2xl md:text-3xl leading-tight" style={{ ...serif, color: BROWN }}>
        the case for buying<br />less, but better
      </h4>
      <div className="mt-4 space-y-1.5">
        <div className="h-1.5 rounded-full w-full" style={{ background: BORDER }} />
        <div className="h-1.5 rounded-full w-11/12" style={{ background: BORDER }} />
        <div className="h-1.5 rounded-full w-4/5" style={{ background: BORDER }} />
      </div>
    </div>
    <div className="w-2/5" style={{ background: PLUM }} />
  </div>
);

// 5 · SEO — pillar/cluster structure
const Seo = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-6" style={{ background: CREAM }}>
    <div className="px-5 py-2.5 rounded-md text-sm" style={{ ...sans, background: PLUM, color: CREAM }}>
      pillar: the twenties guide
    </div>
    <div className="flex gap-3 flex-wrap justify-center">
      {["beauty edits", "home & space", "money habits", "style basics"].map((t) => (
        <div key={t} className="px-3 py-2 rounded-md text-[11px] border" style={{ ...sans, background: "#fff", color: BROWN, borderColor: BORDER }}>{t}</div>
      ))}
    </div>
    <div className="flex gap-2 flex-wrap justify-center">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-2 w-12 rounded-full" style={{ background: i % 2 ? ROSE : BORDER }} />
      ))}
    </div>
  </div>
);

// 6 · Affiliate — connected revenue links
const Affiliate = () => (
  <div className="w-full h-full flex flex-col justify-center gap-3 px-6 md:px-10" style={{ background: "#fff" }}>
    {[
      { label: "amazon associates", v: "linked" },
      { label: "pinterest", v: "linked" },
      { label: "embedded product links", v: "live" },
    ].map((r) => (
      <div key={r.label} className="flex items-center justify-between px-4 py-3 rounded-md border" style={{ borderColor: BORDER, background: CREAM }}>
        <span style={{ ...sans, color: BROWN }} className="text-sm">{r.label}</span>
        <span className="text-[10px] uppercase px-2 py-1 rounded-full" style={{ ...sans, letterSpacing: "0.16em", color: "#fff", background: PLUM }}>{r.v}</span>
      </div>
    ))}
    <div className="mt-1 text-[11px]" style={{ ...sans, color: ROSE }}>earns on every click, from day one</div>
  </div>
);

type Slide = { visual: React.ReactNode; tag: string; name: string; desc: string; pills: string[] };

const slides: Slide[] = [
  {
    visual: <Brand />,
    tag: "Brand strategy & identity",
    name: "A full brand world built from the ground up",
    desc: "Before a single page existed, we built the brand: a name, a voice, a palette, and a point of view. The result feels editorial and human, never like a store.",
    pills: ["Brand positioning", "Colour & type system", "Voice & tone guide", "Brand kit"],
  },
  {
    visual: <Homepage />,
    tag: "Homepage design",
    name: "A homepage that reads like a magazine cover",
    desc: "The homepage leads with a curated editorial hero and a clean grid of featured finds. It sets the tone instantly: considered, warm, and worth scrolling.",
    pills: ["Editorial hero", "Featured grid", "Clear navigation", "Mobile-first layout"],
  },
  {
    visual: <TheEdit />,
    tag: "The Edit, product discovery",
    name: "A curated product discovery platform",
    desc: "The Edit is the heart of the site: a filterable, category-driven feed of hand-picked products. It turns browsing into discovery without ever feeling like a catalogue.",
    pills: ["Category filtering", "Curated collections", "Reusable product template", "Discovery-led layout"],
  },
  {
    visual: <Blog />,
    tag: "Blog & editorial setup",
    name: "A journal that builds trust and traffic",
    desc: "A full editorial system gives the brand somewhere to talk, recommend, and rank. Every article is structured to read beautifully and feed the SEO engine.",
    pills: ["Editorial templates", "Author voice", "Internal linking", "Content workflow"],
  },
  {
    visual: <Seo />,
    tag: "SEO strategy",
    name: "Built for long-term organic growth",
    desc: "A pillar-and-cluster content strategy maps every article back to core topics. It's an architecture designed to compound organic traffic over months, not days.",
    pills: ["Pillar + cluster model", "Keyword mapping", "On-page SEO", "Long-term roadmap"],
  },
  {
    visual: <Affiliate />,
    tag: "Affiliate setup",
    name: "A fully connected revenue system",
    desc: "Amazon Associates, Pinterest, and embedded links all wired together from launch. The platform doesn't just look good — it earns on every click from day one.",
    pills: ["Amazon Associates", "Pinterest integration", "Embedded affiliate links", "Revenue from day one"],
  },
];

export function The20sEditCaseStudy() {
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
