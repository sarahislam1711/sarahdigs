import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { collectionPageSchema } from "@/lib/schema";
import { renderMetricValue } from "@/lib/metric-value";
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

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title="projects | sarahdigs"
        description="the work. selected websites designed and built by sarahdigs for b2b and lifestyle brands."
        canonical="/projects"
        jsonLd={collectionPageSchema({
          name: "the work",
          description: "selected websites designed and built by sarahdigs for b2b and lifestyle brands.",
          url: "/projects",
        })}
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
        /* ── ALTERNATING PROJECT ROWS ── */
        <section className="bg-bone pb-20 md:pb-28">
          <div className="container mx-auto px-6 lg:px-12 max-w-7xl space-y-20 md:space-y-32">
            {ordered.map((p, i) => {
              const comingSoon = p.status === "coming_soon";
              const flip = i % 2 === 1; // every other row: info left / image right

              const image = (
                <div className={comingSoon ? "" : "group"}>
                  <Link
                    href={comingSoon ? "#" : `/projects/${p.slug}`}
                    className={comingSoon ? "block pointer-events-none" : "block"}
                  >
                    <div className="rounded-md overflow-hidden border border-ink/10 bg-bone aspect-video transition-all duration-300 group-hover:border-oxblood/40">
                      {comingSoon ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink-mid">in progress</span>
                        </div>
                      ) : p.logoUrl ? (
                        <div className="w-full h-full flex items-center justify-center p-10 md:p-16">
                          <img
                            src={p.logoUrl}
                            alt={p.name}
                            loading="lazy"
                            decoding="async"
                            className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                      ) : p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div
                          className="w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                          style={{ background: i % 2 === 0 ? "linear-gradient(135deg,#6B1421,#4A0E16)" : "linear-gradient(135deg,#E7E2D6,#C58A92)" }}
                        />
                      )}
                    </div>
                  </Link>
                </div>
              );

              const info = (
                <div className="flex flex-col justify-center">
                  {/* number + industry */}
                  <div className="flex items-center gap-4 mb-5">
                    <span className="font-display font-extrabold text-oxblood text-2xl md:text-3xl tabular-nums tracking-tighter leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {p.industry && (
                      <span className="inline-block bg-oxblood text-bone text-[10px] font-mono font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                        {comingSoon ? "in progress" : p.industry}
                      </span>
                    )}
                  </div>

                  <h2 className={`font-display font-semibold tracking-tighter text-4xl md:text-6xl leading-[0.95] lowercase mb-5 ${comingSoon ? "text-ink-mid" : ""}`}>
                    {comingSoon ? "coming soon" : p.name}
                  </h2>

                  {!comingSoon && p.problem && (
                    <p className="text-ink-mid text-base md:text-lg leading-snug lowercase mb-6 max-w-md">
                      {p.problem}
                    </p>
                  )}

                  {!comingSoon && p.metricValue && (
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="font-mono font-bold text-oxblood text-3xl md:text-4xl tabular-nums leading-none whitespace-nowrap">
                        {renderMetricValue(p.metricValue)}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mid">
                        {p.metricLabel}
                      </span>
                    </div>
                  )}

                  {!comingSoon && p.serviceTags && p.serviceTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {p.serviceTags.slice(0, 4).map((tag) => (
                        <span key={tag} className="inline-block bg-oxblood/8 text-oxblood text-xs font-medium lowercase px-3 py-1.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {!comingSoon && (
                    <Link
                      href={`/projects/${p.slug}`}
                      className="group inline-flex items-center gap-2 text-sm font-medium lowercase text-oxblood w-fit"
                    >
                      view project
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              );

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                >
                  {/* alternate column order on desktop */}
                  <div className={flip ? "lg:order-2" : "lg:order-1"}>{image}</div>
                  <div className={flip ? "lg:order-1" : "lg:order-2"}>{info}</div>
                </motion.div>
              );
            })}
          </div>
        </section>
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
            <h2 className="font-display font-semibold tracking-tighter text-5xl md:text-7xl leading-none lowercase mb-8">
              ready to build <span className="text-oxblood">yours?</span>
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
