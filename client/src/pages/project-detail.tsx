import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { ArrowUpRight, ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { openCalendly } from "@/lib/calendly";
import type { Project } from "@shared/schema";

type Step = { title: string; description: string };
type Metric = { value: string; label: string };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-oxblood" />
      </div>
    );
  }
  if (isError || !project) return <NotFound />;

  const ordered = [...allProjects]
    .filter((p) => p.isVisible !== false)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const idx = ordered.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  const cleanUrl = project.website?.replace(/^https?:\/\//, "");
  const steps = (project.processSteps as Step[] | null) ?? [];
  const metrics = (project.metrics as Metric[] | null) ?? [];
  const before = project.beforeStates ?? [];
  const after = project.afterStates ?? [];
  const tags = project.serviceTags ?? [];

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title={`${project.name} | sarahdigs`}
        description={project.problem || `${project.name} — a case study by sarahdigs.`}
        canonical={`/projects/${project.slug}`}
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
            </div>

            {/* meta sidebar */}
            <div className="lg:col-span-5 lg:pt-2">
              <dl className="space-y-4 text-sm">
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

      {/* ── HERO IMAGE ── */}
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

      {/* ── SERVICES SHOWCASE ── */}
      {tags.length > 0 && (
        <section className="bg-bone pb-16 md:pb-20">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
              <div className="lg:col-span-4">
                <h2 className="font-display font-semibold tracking-tighter text-3xl md:text-4xl leading-none lowercase">
                  what we<br /><span className="text-oxblood">built.</span>
                </h2>
              </div>
              <div className="lg:col-span-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-3 py-3 border-b border-ink/10">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-oxblood/10 shrink-0">
                        <Check className="w-3.5 h-3.5 text-oxblood" strokeWidth={3} />
                      </span>
                      <span className="text-base md:text-lg lowercase">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS ── */}
      {steps.length > 0 && (
        <section className="bg-stone py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
            <div className="flex items-center gap-3 mb-12">
              <span className="h-px w-8 bg-oxblood/40" />
              <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">the process</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="space-y-3"
                >
                  <span className="font-display font-extrabold text-oxblood text-3xl md:text-4xl tabular-nums tracking-tighter leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-medium text-xl tracking-tight lowercase">{s.title}</h3>
                  <p className="text-ink-mid text-[15px] leading-snug lowercase">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                    <li key={i} className="font-display font-medium text-xl md:text-2xl tracking-tight lowercase text-ink-mid leading-snug">
                      {b}
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
        <section className="bg-ink text-bone py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
            <div className="flex items-center gap-3 mb-12">
              <span className="h-px w-8 bg-oxblood-tint/40" />
              <span className="text-oxblood-tint font-semibold uppercase tracking-[0.22em] text-xs">the results</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {metrics.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                >
                  <span className="block font-display font-extrabold text-oxblood-tint text-5xl md:text-7xl tabular-nums tracking-tighter leading-none mb-3">
                    {m.value}
                  </span>
                  <span className="block text-sm md:text-base text-bone lowercase opacity-90">{m.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PREV / NEXT ── */}
      {(prev || next) && (
        <section className="bg-bone py-12 md:py-16 border-t border-ink/10">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl grid grid-cols-2 gap-6">
            <div>
              {prev && (
                <Link href={`/projects/${prev.slug}`} className="group block">
                  <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-ink-mid inline-flex items-center gap-2 mb-2">
                    <ArrowLeft className="w-3 h-3" /> previous
                  </span>
                  <span className="block font-display font-medium text-xl md:text-2xl tracking-tight lowercase group-hover:text-oxblood transition-colors">
                    {prev.name}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link href={`/projects/${next.slug}`} className="group block">
                  <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-ink-mid inline-flex items-center gap-2 mb-2 justify-end w-full">
                    next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="block font-display font-medium text-xl md:text-2xl tracking-tight lowercase group-hover:text-oxblood transition-colors">
                    {next.name}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="bg-bone py-16 md:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-ink text-bone rounded-md p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
          >
            <div className="lg:col-span-8">
              <h2 className="font-display font-semibold tracking-tighter text-3xl md:text-4xl leading-[1.05] lowercase">
                want something like{" "}
                <span className="text-oxblood-tint italic">this?</span>
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
