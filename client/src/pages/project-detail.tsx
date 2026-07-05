import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { projectSchema, breadcrumbSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { ArrowUpRight, ArrowRight, ArrowLeft, Loader2, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { openCalendly } from "@/lib/calendly";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { renderMetricValue } from "@/lib/metric-value";
import { PlacesCaseStudy } from "@/components/places-case-study";
import { The20sEditCaseStudy } from "@/components/the-20s-edit-case-study";
import type { Project } from "@shared/schema";

type Step = { title: string; description: string };
type Metric = { value: string; label: string };
type Slide = { imageUrl: string; caption: string };

// Emphasise pivotal phrases in a problem story (oxblood). Phrases not present are
// simply ignored, so this is safe for any project's copy.
const STORY_HIGHLIGHTS = [
  // places
  "no digital presence",
  "depth of the developer relationships and market knowledge",
  "the brief:",
  "the expert in the room",
  // the 20s edit
  "build the entire machine from scratch",
  "looks like a magazine, reads like a friend, and earns on every click",
];
function highlightStory(text: string) {
  // build a single regex of the phrases, escaped, longest first so nested matches win
  const phrases = [...STORY_HIGHLIGHTS].sort((a, b) => b.length - a.length).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${phrases.join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    STORY_HIGHLIGHTS.some((p) => p.toLowerCase() === part.toLowerCase())
      ? <span key={i} className="text-oxblood">{part}</span>
      : <span key={i}>{part}</span>
  );
}

// ── Process journey: gently curved snaking path with U-turns, nodes + labels ──
function ProcessJourney({ steps }: { steps: Step[] }) {
  const cols = Math.min(4, steps.length);             // up to 4 per row
  const rows = Math.ceil(steps.length / cols);

  // normalized geometry (viewBox units)
  const W = 1000;
  const r = 13;                                       // node radius (small open-circle style)
  const inset = 60;                                   // side margin so the path never touches the edges
  const turnR = 44;                                   // U-turn loop radius
  const left = inset;
  const right = W - inset;
  const colSpan = cols > 1 ? (right - left) / (cols - 1) : 0; // distance between adjacent columns
  const colGap = colSpan || (right - left);
  const xAt = (c: number) => (cols === 1 ? (left + right) / 2 : left + c * colSpan); // column x-center
  // row gap must clear a node's full label (number + up-to-2-line title + 3-line desc).
  // long titles wrap to 2 lines, so reserve enough room or rows collide.
  const rowH = 230;                                   // vertical distance between rows
  const yAt = (rw: number) => 28 + rw * rowH;         // node y-center for row rw
  const labelGap = 130;                               // space reserved under the last row for its label
  const H = yAt(rows - 1) + labelGap;

  // node positions, snaking (even rows L→R, odd rows R→L)
  const nodes = steps.map((step, i) => {
    const row = Math.floor(i / cols);
    const within = i % cols;
    const col = row % 2 === 0 ? within : cols - 1 - within;
    return { step, i, x: xAt(col), y: yAt(row), row };
  });

  // build a structured path: straight horizontal segments + clean rounded U-turns
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    if (a.row === b.row) {
      d += ` L ${b.x} ${b.y}`;
    } else {
      // U-turn between rows. a and b are the two edge nodes (same x = edge).
      // A smooth cubic bulges outward past the edge so BOTH nodes sit on the curve.
      const goingRight = a.row % 2 === 0;
      const reach = goingRight ? a.x + turnR * 1.6 : a.x - turnR * 1.6;
      d += ` C ${reach} ${a.y}, ${reach} ${b.y}, ${b.x} ${b.y}`;
    }
  }

  return (
    <section className="bg-bone pt-4 pb-16 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex items-center gap-3 mb-12 md:mb-16">
          <span className="h-px w-8 bg-oxblood/40" />
          <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">the journey</span>
        </div>

        {/* DESKTOP: gently curved snaking path */}
        <div className="hidden md:block relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
            {/* connecting path */}
            <path d={d} fill="none" stroke="#6B1421" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* nodes (HTML circles, on the path) + labels — grouped per step so hover affects both */}
          {nodes.map((n) => {
            // label cell spans halfway to each neighbour, clamped to the canvas
            const half = colSpan / 2 || (right - left) / 2;
            const cellLeft = Math.max(0, n.x - half);
            const cellRight = Math.min(W, n.x + half);
            const cellW = cellRight - cellLeft;
            const nodePct = (r * 2 / W) * 100; // circle diameter as % of width
            return (
              <div key={n.i} className="group absolute inset-0 pointer-events-none cursor-default">
                {/* node circle, centered on the path point */}
                <span
                  className="absolute aspect-square rounded-full bg-bone border-2 border-[#3A2A22] pointer-events-auto transition-all duration-300 group-hover:scale-125 group-hover:border-oxblood group-hover:bg-oxblood/10"
                  style={{
                    left: `${(n.x / W) * 100}%`,
                    top: `${(n.y / H) * 100}%`,
                    width: `${nodePct}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
                {/* label cell under the node */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: n.i * 0.08, ease: "easeOut" }}
                  className="absolute px-2 text-center pointer-events-auto transition-transform duration-300 group-hover:-translate-y-0.5"
                  style={{
                    top: `${((n.y + r + 16) / H) * 100}%`,
                    left: `${(cellLeft / W) * 100}%`,
                    width: `${(cellW / W) * 100}%`,
                  }}
                >
                  <span className="block font-mono text-[10px] tracking-[0.22em] text-oxblood mb-1.5">
                    {String(n.i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-medium text-base lg:text-lg tracking-tight lowercase mb-1.5 min-h-[2.6em] flex items-start justify-center transition-all duration-300 group-hover:text-oxblood group-hover:font-semibold">{n.step.title}</h3>
                  <p className="text-ink-mid text-[13px] leading-snug lowercase line-clamp-3 min-h-[4.1em] transition-colors duration-300 group-hover:text-ink">{n.step.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* MOBILE: simple stacked list (the snake doesn't read on narrow screens) */}
        <div className="md:hidden space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#3A2A22] text-bone font-display font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="font-display font-medium text-lg tracking-tight lowercase mb-1">{step.title}</h3>
                <p className="text-ink-mid text-[15px] leading-snug lowercase">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Gallery carousel: image + caption per slide, arrows + dots ──
function ProjectGallery({ slides }: { slides: Slide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: slides.length > 1 });
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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-bone pb-16 md:pb-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-oxblood/40" />
            <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">a closer look</span>
          </div>
          {slides.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                aria-label="previous"
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink hover:bg-ink hover:text-bone transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="next"
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink hover:bg-ink hover:text-bone transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((s, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 px-0">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-10 items-center">
                  <div className="lg:col-span-7">
                    <div className="rounded-md overflow-hidden border border-ink/10 bg-stone aspect-video">
                      <img
                        src={s.imageUrl}
                        alt={s.caption || ""}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-3 lg:pl-2">
                    <span className="font-display font-extrabold text-oxblood text-2xl md:text-3xl tabular-nums tracking-tighter leading-none block mb-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-ink-mid/70 mb-3">
                      what you're seeing
                    </span>
                    <p className="text-ink text-base md:text-lg leading-snug lowercase">
                      {s.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="flex items-center gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === selected ? "w-8 bg-oxblood" : "w-1.5 bg-ink/20 hover:bg-ink/40"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug;

  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: ["/api/projects", slug],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${slug}`);
      if (!res.ok) throw new Error("not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Show the loader while the route param is still resolving OR the query is
  // loading. Without the `!slug` guard, a disabled query (enabled: !!slug)
  // reports isLoading:false with data:undefined for a tick, briefly flashing
  // the 404 page before the real content mounts.
  if (!slug || isLoading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-oxblood" />
      </div>
    );
  }
  if (isError || !project) return <NotFound />;

  const ordered = [...allProjects]
    .filter((p) => p.isVisible !== false && p.status !== "coming_soon")
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  // everything except the project we're viewing — the rest of the collection
  const otherProjects = ordered.filter((p) => p.slug !== project.slug);

  const cleanUrl = project.website?.replace(/^https?:\/\//, "");
  const steps = (project.processSteps as Step[] | null) ?? [];
  const metrics = (project.metrics as Metric[] | null) ?? [];
  const before = project.beforeStates ?? [];
  const after = project.afterStates ?? [];
  const tags = project.serviceTags ?? [];
  const gallery = ((project.gallery as Slide[] | null) ?? []).filter((s) => s?.imageUrl);

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title={`${project.name} | sarahdigs`}
        description={project.problem || `${project.name}: a case study by sarahdigs.`}
        canonical={`/projects/${project.slug}`}
        ogImage={project.imageUrl || undefined}
        jsonLd={[
          projectSchema({
            name: project.name,
            description: project.problem || `${project.name}: a case study by sarahdigs.`,
            url: `/projects/${project.slug}`,
            image: project.imageUrl,
            industry: project.industry,
          }),
          breadcrumbSchema([
            { name: "home", url: "/" },
            { name: "work", url: "/projects" },
            { name: project.name, url: `/projects/${project.slug}` },
          ]),
        ]}
      />
      <Navbar theme="light" />

      {/* ── HERO ── */}
      <section className="bg-bone pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-mid hover:text-oxblood transition-colors lowercase mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> back to the work
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* name + tags */}
            <div className="lg:col-span-7">
              {project.industry && (
                <span className="inline-block bg-oxblood text-bone text-[10px] font-mono font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full mb-6">
                  {project.industry}
                </span>
              )}
              <h1 className="font-display font-semibold tracking-tighter text-5xl md:text-7xl leading-[0.95] lowercase mb-5">
                {project.name}
              </h1>
              {project.problem && (
                <p className="text-lg md:text-xl text-ink-mid lowercase leading-snug max-w-xl">
                  {project.problem}
                </p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-block bg-oxblood/8 text-oxblood text-xs font-medium lowercase px-3 py-1.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* meta sidebar */}
            <div className="lg:col-span-5 lg:pt-2">
              <dl className="space-y-4 text-sm">
                {project.metaStatus && (
                  <div className="flex justify-between items-center border-b border-ink/10 pb-3">
                    <dt className="font-mono uppercase tracking-[0.18em] text-[11px] text-ink-mid">status</dt>
                    <dd>
                      <span className="inline-flex items-center gap-1.5 lowercase text-[12px] font-medium text-oxblood border border-oxblood/30 bg-oxblood/6 rounded-full px-2.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-oxblood" />
                        {project.metaStatus}
                      </span>
                    </dd>
                  </div>
                )}
                {project.year && (
                  <div className="flex justify-between border-b border-ink/10 pb-3">
                    <dt className="font-mono uppercase tracking-[0.18em] text-[11px] text-ink-mid">year</dt>
                    <dd className="lowercase">{project.year}</dd>
                  </div>
                )}
                {project.role && (
                  <div className="flex justify-between border-b border-ink/10 pb-3">
                    <dt className="font-mono uppercase tracking-[0.18em] text-[11px] text-ink-mid">role</dt>
                    <dd className="lowercase">{project.role}</dd>
                  </div>
                )}
                {project.timeline && (
                  <div className="flex justify-between border-b border-ink/10 pb-3">
                    <dt className="font-mono uppercase tracking-[0.18em] text-[11px] text-ink-mid">timeline</dt>
                    <dd className="lowercase">{project.timeline}</dd>
                  </div>
                )}
                {cleanUrl && (
                  <div className="flex justify-between border-b border-ink/10 pb-3">
                    <dt className="font-mono uppercase tracking-[0.18em] text-[11px] text-ink-mid">live</dt>
                    <dd>
                      <a
                        href={project.website?.startsWith("http") ? project.website : `https://${project.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 lowercase hover:text-oxblood transition-colors"
                      >
                        {cleanUrl} <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM (story) ── */}
      {project.problemStory && (
        <section className="bg-bone pb-14 md:pb-20">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-8 bg-oxblood/40" />
                  <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">the problem</span>
                </div>
                <h2 className="font-display font-semibold tracking-tighter text-3xl md:text-4xl leading-none lowercase">
                  where it<br /><span className="text-oxblood">started.</span>
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="font-display text-xl md:text-2xl lg:text-[26px] text-ink leading-snug lowercase max-w-3xl">
                  {highlightStory(project.problemStory)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LEAD VISUAL: places gets its bespoke case-study carousel; others use gallery or static image ── */}
      {project.slug === "places" ? (
        <PlacesCaseStudy />
      ) : project.slug === "the-20s-edit" ? (
        <The20sEditCaseStudy />
      ) : gallery.length > 0 ? (
        <ProjectGallery slides={gallery} />
      ) : (
        <section className="bg-bone pb-16 md:pb-24">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
            <div className="rounded-md overflow-hidden border border-ink/10 bg-stone aspect-video">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #6B1421 0%, #4A0E16 100%)" }} />
              )}
            </div>
          </div>
        </section>
      )}


      {/* ── PROCESS (horizontal curved journey) ── */}
      {steps.length > 0 && <ProcessJourney steps={steps} />}

      {/* ── BEFORE / AFTER ── */}
      {(before.length > 0 || after.length > 0) && (
        <section className="bg-bone py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
              {/* BEFORE panel — muted stone */}
              <div className="bg-stone rounded-md p-8 md:p-10">
                <span className="block text-[11px] font-mono uppercase tracking-[0.28em] text-ink-mid mb-6">before</span>
                <ul className="space-y-4">
                  {before.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 font-display font-medium text-xl md:text-2xl tracking-tight lowercase text-ink-mid leading-snug">
                      <span className="mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-ink-mid/30 text-ink-mid/60">
                        <X className="w-3 h-3" strokeWidth={2.5} />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* AFTER panel — ink slab with oxblood-tint */}
              <div className="bg-ink text-bone rounded-md p-8 md:p-10">
                <span className="block text-[11px] font-mono uppercase tracking-[0.28em] text-oxblood-tint mb-6">after</span>
                <ul className="space-y-4">
                  {after.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 font-display font-medium text-xl md:text-2xl tracking-tight lowercase leading-snug">
                      <Check className="w-5 h-5 text-oxblood-tint mt-1 shrink-0" strokeWidth={2.5} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── RESULTS ── */}
      {metrics.length > 0 && (
        <section className="bg-bone pt-4 pb-20 md:pb-28">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
            <p className="font-display text-2xl md:text-3xl tracking-tight lowercase text-ink mb-12 md:mb-16 max-w-2xl">
              <span className="text-ink-mid">and the </span>
              <span className="text-oxblood italic">payoff.</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
              {metrics.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                >
                  <span className="block font-display font-semibold text-oxblood text-[clamp(2.75rem,13vw,3.75rem)] md:text-8xl tabular-nums tracking-tight leading-none mb-4 whitespace-nowrap">
                    {renderMetricValue(m.value)}
                  </span>
                  <span className="block text-sm md:text-base text-ink-mid lowercase">{m.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── KEEP EXPLORING + CTA (one seamless ink section) ── */}
      <section className="bg-ink text-bone pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          {/* more work — the rest of the collection */}
          {otherProjects.length > 0 && (
            <div className="mb-16 md:mb-24">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-px w-8 bg-oxblood-tint/40" />
                <span className="text-oxblood-tint font-semibold uppercase tracking-[0.22em] text-xs">
                  more work
                </span>
              </div>

              <div className="divide-y divide-bone/10 border-t border-bone/10">
                {otherProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="group flex items-center gap-5 md:gap-8 py-5 md:py-6"
                  >
                    {/* thumbnail */}
                    <div className="shrink-0 w-20 h-14 md:w-28 md:h-18 rounded-md overflow-hidden bg-bone">
                      {p.logoUrl ? (
                        <div className="w-full h-full flex items-center justify-center p-3 md:p-4">
                          <img src={p.logoUrl} alt="" loading="lazy" decoding="async" className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : p.imageUrl ? (
                        <img src={p.imageUrl} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#6B1421,#4A0E16)" }} />
                      )}
                    </div>
                    {/* name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-medium text-2xl md:text-4xl tracking-tight lowercase leading-none group-hover:text-oxblood-tint transition-colors truncate">
                        {p.name}
                      </h3>
                    </div>
                    {/* industry tag + arrow */}
                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      {p.industry && (
                        <span className="inline-block border border-bone/20 text-bone/70 text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded-full group-hover:border-oxblood-tint/50 group-hover:text-oxblood-tint transition-colors">
                          {p.industry}
                        </span>
                      )}
                      <ArrowUpRight className="w-5 h-5 text-bone/40 group-hover:text-oxblood-tint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA — flows from the collection above, no separate box */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pt-12 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
          >
            <div className="lg:col-span-8">
              <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-6xl leading-none lowercase">
                let's build{" "}
                <span className="text-oxblood-tint italic">yours next.</span>
              </h2>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Button
                size="lg"
                onClick={() => openCalendly({ tier: "dig-in consultation" })}
                className="group w-full lg:w-auto text-base h-14 px-8 bg-oxblood-tint hover:bg-oxblood text-ink hover:text-bone rounded-md cursor-pointer lowercase font-semibold gap-2 transition-colors"
              >
                book a dig-in
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
