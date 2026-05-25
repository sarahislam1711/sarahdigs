import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * PLACES EGY case-study carousel.
 * Each slide pairs a CSS-drawn mockup of the real PLACES site (which uses the
 * client's own brand red #E8404A) with a tag / name / description / pills block.
 * Project-specific by design — rendered only for the `places` standalone page.
 */

const RED = "#E8404A";

// ── per-slide mockup visuals ──
const Platform = () => (
  <div className="w-full h-full flex flex-col items-start justify-end p-5 md:p-6" style={{ background: "#111" }}>
    <div className="text-3xl font-medium tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>
      PLACE<span style={{ color: RED }}>S</span>
    </div>
    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>commercial real estate advisory · cairo</div>
    <div className="flex gap-2 mt-3.5 flex-wrap">
      <span className="text-[11px] px-2.5 py-1 rounded" style={{ background: "rgba(232,64,74,0.18)", color: RED, border: "0.5px solid rgba(232,64,74,0.3)" }}>places-egy.com</span>
      <span className="text-[11px] px-2.5 py-1 rounded" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "0.5px solid rgba(255,255,255,0.12)" }}>Advisory + marketplace</span>
      <span className="text-[11px] px-2.5 py-1 rounded" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "0.5px solid rgba(255,255,255,0.12)" }}>Full platform</span>
    </div>
  </div>
);

const Listings = () => {
  const filters: [string, boolean][] = [["Sale", true], ["Rent", false], ["Admin", true], ["Commercial", false], ["New Cairo", true], ["Finished", false], ["Core & Shell", false]];
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2" style={{ background: "#f8f6f2" }}>
      <div className="flex gap-1.5 flex-wrap">
        {filters.map(([label, active], i) => (
          <span key={i} className="text-[11px] px-2.5 py-1 rounded-full" style={active ? { background: "#111", color: "white", border: "1px solid #111" } : { background: "white", color: "#555", border: "1px solid #ddd" }}>{label}</span>
        ))}
      </div>
      <div className="flex gap-2">
        {[
          { title: "Business Park · SODIC", meta: "New Cairo · 180 sqm", price: "3,200,000 EGP", img: "#ddd" },
          { title: "Mixed Use · Palm Hills", meta: "Sheikh Zayed · 240 sqm", price: "5,800,000 EGP", img: "#c8c2ba" },
        ].map((c, i) => (
          <div key={i} className="flex-1 rounded-md p-2.5" style={{ background: "white", border: "1px solid #e8e5e0" }}>
            <div className="w-full h-[52px] rounded mb-2" style={{ background: c.img }} />
            <div className="text-[10px] font-medium" style={{ color: "#111" }}>{c.title}</div>
            <div className="text-[9px]" style={{ color: "#888" }}>{c.meta}</div>
            <div className="text-[11px] font-medium mt-1" style={{ color: RED }}>{c.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Admin = () => (
  <div className="w-full h-full p-4 flex flex-col gap-2.5" style={{ background: "#f8f6f2" }}>
    <div className="flex gap-2">
      {[["48", "Active listings"], ["22", "Developers"], ["6", "Locations"]].map(([n, l]) => (
        <div key={l} className="flex-1 rounded-md px-2.5 py-2" style={{ background: "white", border: "1px solid #e8e5e0" }}>
          <div className="text-lg font-medium" style={{ color: "#111" }}>{n}</div>
          <div className="text-[9px] mt-0.5" style={{ color: "#888" }}>{l}</div>
        </div>
      ))}
    </div>
    <div className="flex gap-2 items-center">
      {[["All listings", true], ["Add new", false], ["Images", false]].map(([label, active]) => (
        <span key={label as string} className="text-[11px] px-3 py-1 rounded" style={active ? { background: "#111", color: "white", border: "1px solid #111" } : { background: "white", color: "#555", border: "1px solid #ddd" }}>{label}</span>
      ))}
    </div>
    <div className="rounded-md overflow-hidden" style={{ background: "white", border: "1px solid #e8e5e0" }}>
      <div className="flex items-center gap-2.5 px-3 py-2 text-[9px] uppercase tracking-[0.08em]" style={{ background: "#fafaf8", color: "#888" }}>
        <span className="flex-1">Title</span><span className="flex-[0.6]">Location</span><span className="flex-[0.6]">Price</span><span className="flex-[0.6]">Actions</span>
      </div>
      {[
        { title: "Business Park Unit · SODIC", loc: "New Cairo", price: "3.2M EGP" },
        { title: "Strip Mall · Al Futtaim", loc: "6th October", price: "8.1M EGP" },
      ].map((row) => (
        <div key={row.title} className="flex items-center gap-2.5 px-3 py-2 text-[10px]" style={{ borderTop: "1px solid #f0ede8", color: "#333" }}>
          <span className="flex-1">{row.title}</span>
          <span className="flex-[0.6]">{row.loc}</span>
          <span className="flex-[0.6]">{row.price}</span>
          <span className="flex-[0.6] flex gap-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ border: "1px solid #ddd", color: "#555" }}>Edit</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ border: `1px solid ${RED}`, color: RED }}>Del</span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Developers = () => (
  <div className="w-full h-full flex flex-col justify-center p-5" style={{ background: "white" }}>
    <div className="text-[11px] uppercase tracking-[0.1em] mb-3.5" style={{ color: "#888" }}>developer ecosystem</div>
    <div className="grid grid-cols-4 gap-2.5">
      {["SODIC", "EMAAR", "Palm Hills", "ORA", "Akoya", "Upwyde", "El Hazek", "SKY"].map((d) => (
        <div key={d} className="rounded-md py-2 px-1.5 text-center text-[10px] font-medium" style={{ border: "1px solid #eee", color: "#555" }}>{d}</div>
      ))}
    </div>
    <div className="flex items-baseline gap-2 mt-4">
      <div className="text-[28px] font-medium" style={{ color: "#111" }}>50+</div>
      <div className="text-xs" style={{ color: "#888" }}>developer pages built</div>
    </div>
  </div>
);

const Templates = () => {
  const tmpls = [
    ["Property pages", "Sub-property pages", "Service pages"],
    ["Hub pages", "Developer pages", "Location pages"],
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2 justify-center" style={{ background: "#f5f0ea" }}>
      {tmpls.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((name) => (
            <div key={name} className="flex-1 rounded-md p-2.5" style={{ background: "white", border: "1px solid #e5e0d8" }}>
              <div className="w-2 h-2 rounded-full mb-1.5" style={{ background: RED }} />
              <div className="text-[10px] font-medium" style={{ color: "#111" }}>{name}</div>
            </div>
          ))}
        </div>
      ))}
      <div className="mt-1 text-[11px]" style={{ color: "#888" }}>6 templates · infinitely scalable</div>
    </div>
  );
};

const Faq = () => (
  <div className="w-full h-full p-4 flex flex-col gap-2" style={{ background: "#f8f6f2" }}>
    <div className="flex items-center gap-2 rounded-md px-3 py-2 text-[11px]" style={{ background: "white", border: "1px solid #e0ddd8", color: "#999" }}>
      <span style={{ color: "#aaa" }}>⌕</span>
      <span>Search FAQs and glossary terms…</span>
    </div>
    <div className="flex gap-1.5 flex-wrap">
      {[["All", true], ["Leasing", false], ["Buying", false], ["Developers", false], ["Glossary", false]].map(([label, active]) => (
        <span key={label as string} className="text-[10px] px-2.5 py-0.5 rounded-full" style={active ? { background: "#111", color: "white", border: "1px solid #111" } : { background: "white", color: "#555", border: "1px solid #ddd" }}>{label}</span>
      ))}
    </div>
    <div className="flex flex-col gap-1.5">
      {[
        { q: "What is the difference between admin and commercial property?", a: "Admin offices are used for corporate or professional operations. Commercial spaces include retail, malls, and drive-throughs." },
        { q: "Core and shell — definition", a: "A unit delivered with structural framework only, no internal fit-out, flooring, or finishes. The tenant completes the interior." },
      ].map((item) => (
        <div key={item.q} className="rounded-md px-3 py-2.5" style={{ background: "white", border: "1px solid #e8e5e0" }}>
          <div className="text-[10px] font-medium mb-0.5" style={{ color: "#111" }}>{item.q}</div>
          <div className="text-[9px] leading-relaxed" style={{ color: "#888" }}>{item.a}</div>
        </div>
      ))}
    </div>
  </div>
);

const Blog = () => (
  <div className="w-full h-full p-5 flex flex-col justify-center" style={{ background: "#111" }}>
    <div className="text-[13px] font-medium mb-3 text-white">Blog content strategy · 5 pillars · 50 articles</div>
    <div className="flex flex-col gap-1.5">
      {[
        "Admin Offices in Cairo — The Complete Guide",
        "Commercial Spaces in Cairo — The Complete Guide",
        "Location Guides — Cairo's key commercial districts",
        "Investors & Buyers — ROI, market trends, what to look for",
      ].map((t) => (
        <div key={t} className="flex items-center gap-2.5 rounded-md px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div className="text-base font-medium min-w-[28px]" style={{ color: RED }}>~10</div>
          <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>{t}</div>
        </div>
      ))}
    </div>
  </div>
);

const DesignSystem = () => (
  <div className="w-full h-full p-5 flex flex-col justify-center gap-3.5" style={{ background: "white" }}>
    <div className="flex gap-1.5 items-center">
      <div className="w-7 h-7 rounded-md" style={{ background: "#E8404A" }} />
      <div className="w-7 h-7 rounded-md" style={{ background: "#111111" }} />
      <div className="w-7 h-7 rounded-md" style={{ background: "#F5F0EA", border: "1px solid #e8e5e0" }} />
      <div className="w-7 h-7 rounded-md" style={{ background: "#FFFFFF", border: "1px solid #e8e5e0" }} />
      <span className="text-[11px] ml-1" style={{ color: "#888" }}>brand colour system</span>
    </div>
    <div className="text-[22px] font-semibold leading-none" style={{ color: "#111", letterSpacing: "-0.02em" }}>Find Office Space.</div>
    <div className="flex flex-col gap-1.5">
      {[
        ["Confident", "Strong declarative statements. Every sentence earns its place."],
        ["Direct", "Speaks to decision-makers. No filler, no fluff."],
        ["Informed", "Grounded in market knowledge. Never overselling."],
      ].map(([label, text]) => (
        <div key={label} className="flex gap-2.5 items-start">
          <span className="text-[10px] font-medium min-w-[70px]" style={{ color: RED }}>{label}</span>
          <span className="text-[10px] leading-relaxed" style={{ color: "#555" }}>{text}</span>
        </div>
      ))}
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
    visual: <Platform />,
    tag: "Platform overview",
    name: "From zero to a full commercial property platform",
    desc: "End-to-end strategy, design, and build for a Cairo commercial property advisory firm, positioned as a trusted advisor, not just another listings portal.",
    pills: ["Strategy + design + build", "Advisory positioning", "Live marketplace", "Full platform"],
  },
  {
    visual: <Listings />,
    tag: "Listings system",
    name: "Live database with 7-filter search",
    desc: "A fully searchable listings experience with live results and detail modals that drive straight to WhatsApp and call CTAs.",
    pills: ["7 composable filters", "Image carousel modal", "WhatsApp + call CTAs", "Live database"],
  },
  {
    visual: <Admin />,
    tag: "Admin dashboard",
    name: "Full listings management, no developer needed",
    desc: "A private dashboard lets the PLACES team add, edit, and delete listings and upload images themselves, owning their content from day one.",
    pills: ["Add / edit / delete listings", "Drag-and-drop image upload", "Password protected"],
  },
  {
    visual: <Developers />,
    tag: "Developer pages",
    name: "50+ individual developer profiles",
    desc: "Every major Cairo developer gets a dedicated page with stats and a filterable portfolio, all on a shared template so new ones take minutes.",
    pills: ["Filterable project portfolio", "At-a-glance stats", "Explore others carousel", "Reusable template"],
  },
  {
    visual: <Templates />,
    tag: "Site architecture",
    name: "6 templates powering the entire site",
    desc: "The whole site runs on 6 reusable templates, so it scales to new developers, locations, and property types without the cost growing with it.",
    pills: ["6 reusable templates", "Every page templated", "Scales without extra cost"],
  },
  {
    visual: <Faq />,
    tag: "FAQ & Glossary",
    name: "Fully searchable FAQ database and glossary",
    desc: "A searchable, categorised FAQ and real estate glossary that builds trust with first-time buyers and cuts repetitive enquiries to the team.",
    pills: ["Full-text search", "Category filtering", "Real estate glossary", "Reduces inbound queries"],
  },
  {
    visual: <Blog />,
    tag: "Content strategy",
    name: "SEO content architecture: 5 pillars, 50 articles",
    desc: "A pillar-cluster content strategy that drives organic traffic and links every article back to live listings and five core pillar pages.",
    pills: ["Pillar + cluster model", "50 planned articles", "Internal linking strategy", "Independent publishing"],
  },
  {
    visual: <DesignSystem />,
    tag: "Brand & design system",
    name: "Voice, identity, and design language built from scratch",
    desc: "A complete brand system, palette, visual direction, and voice guide, that sounds like a trusted advisor: warm and human, never corporate.",
    pills: ["Full brand voice guide", "Colour system", "Visual direction", "Copy rules"],
  },
];

export function PlacesCaseStudy() {
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
