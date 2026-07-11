import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { pageSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { BlogPost, Category, Tag as TagType } from "@shared/schema";

// ── helpers ──
const readTime = (content: string | null) => {
  if (!content) return "3 min";
  return `${Math.ceil(content.split(/\s+/).length / 200)} min`;
};
const fmtDate = (date: Date | string | null) => {
  if (!date) return "";
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toLowerCase();
};
const excerptOf = (p: BlogPost) => p.excerpt || p.content?.slice(0, 160) || "";

type PostWithTags = BlogPost & { tags?: TagType[] };
const usePosts = () => useQuery<PostWithTags[]>({ queryKey: ["/api/blog/posts"] });
const useCats = () => useQuery<Category[]>({ queryKey: ["/api/categories"] });
const useTags = () => useQuery<TagType[]>({ queryKey: ["/api/tags"] });

// ════════════════════════════════════════════════════════════════════
// JOURNAL — index / table of contents layout
// Quiet bone masthead, latest as a wide split, posts as a numbered index.
// ════════════════════════════════════════════════════════════════════
function JournalLayout() {
  const { data: posts = [], isLoading } = usePosts();
  const { data: cats = [] } = useCats();

  // featured-first ordering
  const ordered = [...posts].sort((a: any, b: any) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  const featured = ordered[0];
  const rest = ordered.slice(1);

  return (
    <>
      {/* MASTHEAD */}
      <section className="bg-bone pt-24 pb-4 md:pt-28 md:pb-6">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-10 text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
            <span>sarahdigs · creative website studio</span>
            <span>the journal · 2026</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <h1 className="font-display font-semibold tracking-tighter text-6xl md:text-8xl leading-none lowercase mb-5">
              the <span className="text-oxblood italic">journal</span>
            </h1>
            <p className="text-ink-mid text-base md:text-lg leading-snug lowercase max-w-xl">
              essays, frameworks, and notes on websites, design, and growth.
            </p>
          </motion.div>
          {/* topics as numbered pills (option A style) */}
          {cats.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 mt-8">
              {cats.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/journal/${c.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/15 pl-3 pr-4 py-2 transition-all duration-300 hover:bg-oxblood hover:border-oxblood hover:-translate-y-0.5"
                >
                  <span className="font-mono text-[10px] tabular-nums text-oxblood group-hover:text-bone/70">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium text-sm lowercase text-ink group-hover:text-bone">{c.name.toLowerCase()}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {isLoading ? (
        <section className="bg-bone py-24 text-center"><Loader2 className="w-7 h-7 animate-spin text-oxblood mx-auto" /></section>
      ) : ordered.length === 0 ? (
        <section className="bg-bone py-24 text-center text-ink-mid lowercase">writing coming soon.</section>
      ) : (
        <>
          {/* FEATURED — on a slightly darker stone band to set it apart */}
          <section className="bg-stone py-12 md:py-16 mt-6 md:mt-8">
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
              <Link href={`/journal/post/${featured.slug}`} className="group block">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                >
                  <div className="rounded-md overflow-hidden border border-ink/10 bg-ink aspect-video flex items-center justify-center">
                    {featured.featuredImageUrl ? (
                      <img src={featured.featuredImageUrl} alt={featured.title} loading="lazy" decoding="async" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#6B1421,#4A0E16)" }} />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-oxblood font-semibold uppercase tracking-[0.22em] text-xs mb-5">
                      <span className="h-px w-8 bg-oxblood/40" /> the latest
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mid mb-4">
                      <span>{fmtDate(featured.publishedAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-ink/25" />
                      <span>{readTime(featured.content)}</span>
                    </div>
                    <h2 className="font-display font-semibold tracking-tighter text-3xl md:text-5xl leading-[0.98] lowercase group-hover:text-oxblood transition-colors mb-5">
                      {featured.title}
                    </h2>
                    {featured.tags && featured.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featured.tags.slice(0, 4).map((t) => (
                          <span key={t.id} className="inline-block bg-oxblood/8 text-oxblood text-xs font-medium lowercase px-3 py-1.5 rounded-full">{t.name}</span>
                        ))}
                      </div>
                    )}
                    <span className="inline-flex items-center gap-2 text-base font-medium lowercase text-oxblood w-fit">
                      read the piece <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </div>
          </section>

          {/* REST — 2 per row, smaller titles */}
          {rest.length > 0 && (
            <section className="bg-bone py-14 md:py-20">
              <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
                  {rest.map((post, i) => (
                    <Link key={post.id} href={`/journal/post/${post.slug}`} className="group">
                      <motion.article
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.06, ease: "easeOut" }}
                      >
                        <div className="rounded-md overflow-hidden border border-ink/10 bg-ink aspect-video mb-5 flex items-center justify-center group-hover:border-oxblood/40 transition-colors">
                          {post.featuredImageUrl ? (
                            <img src={post.featuredImageUrl} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
                          ) : (
                            <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#E7E2D6,#C58A92)" }} />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mid mb-2">
                          <span>{fmtDate(post.publishedAt)}</span>
                          <span className="w-1 h-1 rounded-full bg-ink/25" />
                          <span>{readTime(post.content)}</span>
                        </div>
                        <h3 className="font-display font-medium text-2xl md:text-3xl tracking-tight leading-snug lowercase group-hover:text-oxblood transition-colors mb-3">{post.title}</h3>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((t) => (
                              <span key={t.id} className="inline-block bg-oxblood/8 text-oxblood text-xs font-medium lowercase px-2.5 py-1 rounded-full">{t.name}</span>
                            ))}
                          </div>
                        )}
                      </motion.article>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}

// ── NEWSLETTER (shared) ──
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: async (userEmail: string) => {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, source: "journal", assetRequested: "newsletter" }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      return res.json();
    },
    onSuccess: () => setEmail(""),
  });
  const subscribed = mutation.isSuccess;
  return (
    <section className="bg-bone pb-20 md:pb-28">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="border-t border-ink/10 pt-12 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-oxblood/40" />
              <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">the digest</span>
            </div>
            <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl lg:text-6xl leading-[1.02] lowercase">
              get the good stuff,<br /><span className="text-oxblood italic">monthly.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pl-4">
            {subscribed ? (
              <div className="h-14 flex items-center gap-2 text-oxblood font-medium lowercase">
                <ArrowRight className="w-4 h-4" /> you're in. talk soon.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) mutation.mutate(email.trim());
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email"
                  className="flex-1 h-14 px-5 rounded-md border border-ink/15 bg-transparent text-ink placeholder:text-ink-mid/60 lowercase focus:outline-none focus:border-oxblood transition-colors"
                />
                <Button size="lg" type="submit" disabled={mutation.isPending} className="h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-medium gap-2">
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>subscribe <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </form>
            )}
            <p className="text-ink-mid text-sm lowercase mt-3">
              {mutation.isError ? "something went wrong — try again." : "no spam. unsubscribe anytime."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Journal() {
  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title="journal | sarahdigs"
        description="essays, frameworks, and field notes on websites, design, and growth from sarahdigs."
        canonical="/journal"
        ogType="website"
        jsonLd={pageSchema("Blog", {
          name: "the journal",
          description: "essays, frameworks, and field notes on websites, design, and growth from sarahdigs.",
          url: "/journal",
        })}
      />
      <Navbar theme="light" />
      <JournalLayout />
      <Newsletter />
      <Footer />
    </div>
  );
}
