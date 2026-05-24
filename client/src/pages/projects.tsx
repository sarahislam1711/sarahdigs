import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { openCalendly } from "@/lib/calendly";

export default function Projects() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const ordered = [...projects]
    .filter((p) => p.isVisible !== false)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const featured = ordered.find((p) => p.status !== "coming_soon") ?? ordered[0];
  const rest = ordered.filter((p) => p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title="projects | sarahdigs"
        description="the work — selected websites designed and built by sarahdigs for b2b and lifestyle brands."
        canonical="/projects"
      />
      <Navbar theme="light" />

      {/* ── SECTION 1 — OPENING ── */}
      <section className="bg-bone pt-28 pb-8 md:pt-32 md:pb-10">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-display font-semibold tracking-tighter text-6xl md:text-8xl lg:text-9xl leading-none lowercase"
          >
            the <span className="text-oxblood">work.</span>
          </motion.h1>
        </div>
      </section>

      {isLoading ? (
        <section className="bg-bone py-24 text-center text-ink-mid lowercase">loading…</section>
      ) : ordered.length === 0 ? (
        <section className="bg-bone py-24 text-center text-ink-mid lowercase">work coming soon.</section>
      ) : (
        <>
          {/* ── SECTION 2 — FEATURED PROJECT (8-col image + 4-col spec sheet) ── */}
          {featured && (
            <section className="bg-bone pb-16 md:pb-24">
              <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
                >
                  {/* LEFT — industry tag above image (8 cols) */}
                  <div className="lg:col-span-8">
                    {featured.industry && (
                      <div className="mb-4">
                        <span className="inline-block bg-oxblood text-bone text-[10px] font-mono font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                          {featured.industry}
                        </span>
                      </div>
                    )}
                    <Link href={`/projects/${featured.slug}`} className="group block">
                      <div className="rounded-md overflow-hidden border border-ink/10 bg-stone aspect-video transition-all duration-300 group-hover:border-oxblood/40">
                        {featured.imageUrl ? (
                          <img
                            src={featured.imageUrl}
                            alt={featured.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div
                            className="w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
                            style={{ background: "linear-gradient(135deg, #6B1421 0%, #4A0E16 100%)" }}
                          />
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* RIGHT — spec sheet (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col">
                    {/* featured eyebrow */}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="h-px w-8 bg-oxblood/40" />
                      <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">
                        featured
                      </span>
                    </div>

                    {/* name */}
                    <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl leading-[0.95] lowercase mb-4">
                      {featured.name}
                    </h2>

                    {/* one-liner */}
                    {featured.problem && (
                      <p className="text-ink-mid text-base leading-snug lowercase mb-6 max-w-sm">
                        {featured.problem}
                      </p>
                    )}

                    {/* key result */}
                    {featured.metricValue && (
                      <div className="mb-6 pb-6 border-b border-ink/10">
                        <span className="block font-mono font-bold text-oxblood text-4xl tabular-nums leading-none">
                          {featured.metricValue}
                        </span>
                        <span className="block text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mid mt-2">
                          {featured.metricLabel}
                        </span>
                      </div>
                    )}

                    {/* SERVICE TAGS — soft oxblood-tinted chips (catchy, distinct from industry pill) */}
                    {featured.serviceTags && featured.serviceTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {featured.serviceTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-oxblood/8 text-oxblood text-xs font-medium lowercase px-3 py-1.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* meta + CTA */}
                    <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-mid">
                        {featured.year}
                      </span>
                      <Link
                        href={`/projects/${featured.slug}`}
                        className="group inline-flex items-center gap-2 text-sm font-medium lowercase text-oxblood"
                      >
                        view project
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* ── SECTION 3 — OTHER PROJECTS ── */}
          {rest.length > 0 && (
            <section className="bg-bone pb-20 md:pb-28">
              <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  {rest.map((p) => {
                    const comingSoon = p.status === "coming_soon";

                    const card = (
                      <div className="group">
                        {/* industry tag above image — same style as featured */}
                        {!comingSoon && p.industry && (
                          <div className="mb-3">
                            <span className="inline-block bg-oxblood text-bone text-[10px] font-mono font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                              {p.industry}
                            </span>
                          </div>
                        )}
                        {/* thumbnail */}
                        <div
                          className={`rounded-md overflow-hidden border aspect-16/10 mb-5 ${
                            comingSoon
                              ? "bg-stone border-ink/10"
                              : "border-ink/10 bg-stone transition-all duration-300 group-hover:border-oxblood/40"
                          }`}
                        >
                          {comingSoon ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-mid">
                                in progress
                              </span>
                            </div>
                          ) : p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                          ) : (
                            <div
                              className="w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
                              style={{ background: "linear-gradient(135deg, #E7E2D6 0%, #C58A92 100%)" }}
                            />
                          )}
                        </div>

                        {/* text */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className={`font-display font-bold text-xl md:text-2xl tracking-tight lowercase ${comingSoon ? "text-ink-mid" : "group-hover:text-oxblood transition-colors"}`}>
                              {comingSoon ? "in progress" : p.name}
                            </h3>
                          </div>
                          {!comingSoon && p.metricValue && (
                            <span className="font-mono text-xs text-oxblood tabular-nums shrink-0 pt-1">
                              {p.metricValue}
                            </span>
                          )}
                        </div>

                        {/* service tags — capped at 3 soft oxblood-tinted chips */}
                        {!comingSoon && p.serviceTags && p.serviceTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {p.serviceTags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block bg-oxblood/8 text-oxblood text-[11px] font-medium lowercase px-2.5 py-1 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );

                    return comingSoon ? (
                      <div key={p.id}>{card}</div>
                    ) : (
                      <Link key={p.id} href={`/projects/${p.slug}`} className="block">{card}</Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* ── SECTION 4 — CTA ── */}
      <section className="bg-bone py-16 md:py-24 border-t border-ink/10">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="font-display font-extrabold tracking-tighter text-5xl md:text-7xl leading-none lowercase mb-8">
              want to be <span className="text-oxblood">next?</span>
            </h2>
            <Link href="/contact">
              <Button
                size="lg"
                className="group text-base h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2"
              >
                get in touch
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
