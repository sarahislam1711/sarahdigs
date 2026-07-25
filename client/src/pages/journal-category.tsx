import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { ArrowUpRight, ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost, Category } from "@shared/schema";
import NotFound from "@/pages/not-found";

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

export default function JournalCategory() {
  const [, params] = useRoute("/journal/:category");
  const categorySlug = params?.category;

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const category = categories?.find((c) => c.slug === categorySlug);

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-oxblood" />
      </div>
    );
  }
  if (!categorySlug || !category) return <NotFound />;

  const categoryPosts = posts || [];
  const description =
    category.description || `essays and field notes on ${category.name.toLowerCase()} from sarahdigs.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sarahdigs.com/" },
      { "@type": "ListItem", position: 2, name: "Journal", item: "https://www.sarahdigs.com/journal" },
      { "@type": "ListItem", position: 3, name: category.name, item: `https://www.sarahdigs.com/journal/${category.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title={`${category.name} | journal`}
        description={description}
        canonical={`/journal/${category.slug}`}
        jsonLd={breadcrumbJsonLd}
      />
      <Navbar theme="light" />

      {/* MASTHEAD */}
      <section className="bg-bone pt-24 pb-10 md:pt-28 md:pb-12">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-mid hover:text-oxblood transition-colors lowercase mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> back to the journal
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-oxblood/40" />
              <span className="text-oxblood font-semibold uppercase tracking-[0.22em] text-xs">category</span>
            </div>
            <h1 className="font-display font-semibold tracking-tighter text-6xl md:text-8xl leading-none lowercase mb-5">
              {category.name.toLowerCase()}
            </h1>
            <p className="text-ink-mid text-base md:text-lg leading-snug lowercase max-w-xl">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* INDEX */}
      <section className="bg-bone pb-20 md:pb-28 min-h-[40vh]">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="flex items-center gap-3 text-oxblood font-semibold uppercase tracking-[0.22em] text-xs mb-2 border-t border-ink/10 pt-10">
            <span className="h-px w-8 bg-oxblood/40" /> the index
          </div>

          {postsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-oxblood" />
            </div>
          ) : categoryPosts.length === 0 ? (
            <p className="py-16 text-ink-mid lowercase">no posts in this category yet. check back soon.</p>
          ) : (
            <div>
              {categoryPosts.map((post, i) => (
                <Link key={post.id} href={`/journal/post/${post.slug}`} className="group block">
                  <motion.article
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.05, ease: "easeOut" }}
                    className="grid grid-cols-12 gap-4 md:gap-6 items-baseline py-6 border-b border-ink/10"
                  >
                    <span className="col-span-2 md:col-span-1 font-display font-extrabold text-oxblood text-2xl md:text-3xl tabular-nums tracking-tighter">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="col-span-10 md:col-span-8 font-display font-medium text-2xl md:text-3xl tracking-tight leading-snug lowercase group-hover:text-oxblood transition-colors">
                      {post.title}
                    </h2>
                    <span className="hidden md:block md:col-span-2 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mid">
                      {fmtDate(post.publishedAt)} · {readTime(post.content)}
                    </span>
                    <div className="hidden md:flex md:col-span-1 justify-end">
                      <ArrowUpRight className="w-5 h-5 text-ink/30 group-hover:text-oxblood group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
