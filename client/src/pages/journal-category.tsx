import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { ArrowUpRight, ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost, Category } from "@shared/schema";
import NotFound from "@/pages/not-found";

export default function JournalCategory() {
  const [, params] = useRoute("/journal/:category");
  const categorySlug = params?.category;

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const category = categories?.find(c => c.slug === categorySlug);
  
  const getReadTime = (content: string | null) => {
    if (!content) return "3 min read";
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B1421]" />
      </div>
    );
  }

  if (!categorySlug || !category) {
    return <NotFound />;
  }

  const categoryPosts = posts || [];

  const description =
    category.description ||
    `Essays and field notes on ${category.name.toLowerCase()} from Sarah Islam.`;

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
    <div className="min-h-screen bg-[#F4F1EA] text-[#181612] font-sans selection:bg-[#6B1421] selection:text-white">
      <SEO
        title={`${category.name} — Journal`}
        description={description}
        canonical={`/journal/${category.slug}`}
        jsonLd={breadcrumbJsonLd}
      />
      <Navbar />

      <section className="pt-40 pb-20 bg-[#F4F1EA]">
        <div className="container mx-auto px-6">
          <Link href="/journal" className="inline-flex items-center text-[#181612]/60 hover:text-[#6B1421] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Link>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[0.95]"
              style={{ color: category.textColor || '#6B1421' }}
            >
              {category.name}
            </h1>
            <p className="text-xl md:text-2xl font-light text-[#181612]/80 leading-relaxed max-w-2xl">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white min-h-[60vh] border-t border-[#181612]/5">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#181612]">All Posts</h2>
          </div>

          {postsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B1421]" />
            </div>
          ) : categoryPosts.length === 0 ? (
            <div className="text-center py-20 text-[#181612]/50">
              <p className="text-lg">No posts in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryPosts.map((post, i) => (
                <Link key={post.id} href={`/journal/post/${post.slug}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer flex flex-col h-full"
                  >
                    <div className="bg-[#E7E2D6] rounded-[2rem] p-8 mb-6 group-hover:shadow-xl transition-all duration-300 border border-[#181612]/5 group-hover:border-[#6B1421]/20 relative overflow-hidden flex-1 flex flex-col">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B1421]/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150"></div>
                      
                      <div className="mb-auto">
                        <h3 className="text-2xl font-bold leading-tight mb-4 group-hover:text-[#6B1421] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[#181612]/70 leading-relaxed text-sm">
                          {post.excerpt || post.content?.substring(0, 150) + '...'}
                        </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-[#181612]/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#181612]/50">
                        <span>{formatDate(post.publishedAt)}</span>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#6B1421] group-hover:text-white transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
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