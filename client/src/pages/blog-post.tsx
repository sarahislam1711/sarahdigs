import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost, Category, Tag } from "@shared/schema";
import NotFound from "@/pages/not-found";

interface PostWithDetails extends BlogPost {
  categories?: Category[];
  tags?: Tag[];
}

export default function BlogPostPage() {
  const [match, params] = useRoute("/journal/post/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery<PostWithDetails>({
    queryKey: [`/api/blog/posts/${slug}`],
    enabled: !!slug,
  });

  const getReadTime = (content: string | null) => {
    if (!content) return "3 min read";
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] text-[#181612] font-sans">
        <Navbar theme="light" />
        <div className="pt-40 pb-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6B1421]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return <NotFound />;
  }

  const description =
    post.metaDescription ||
    post.excerpt ||
    (post.content ? `${post.content.replace(/<[^>]+>/g, "").slice(0, 155).trim()}…` : undefined);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sarahdigs.com/" },
      { "@type": "ListItem", position: 2, name: "Journal", item: "https://www.sarahdigs.com/journal" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.sarahdigs.com/journal/post/${post.slug}` },
    ],
  };

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: post.featuredImageUrl || undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: "Sarah Islam", url: "https://www.sarahdigs.com/about" },
    publisher: {
      "@type": "Organization",
      name: "SarahDigs",
      logo: { "@type": "ImageObject", url: "https://www.sarahdigs.com/favicon.png" },
    },
    mainEntityOfPage: `https://www.sarahdigs.com/journal/post/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#181612] font-sans selection:bg-[#6B1421] selection:text-white">
      <SEO
        title={post.metaTitle || post.title}
        description={description}
        canonical={`/journal/post/${post.slug}`}
        ogImage={post.featuredImageUrl || undefined}
        ogType="article"
        jsonLd={[blogPostingJsonLd, breadcrumbJsonLd]}
      />
      <Navbar theme="light" />

      <article className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <Link href="/journal" className="inline-flex items-center gap-2 text-sm font-medium text-ink-mid hover:text-oxblood transition-colors lowercase mb-10">
            <ArrowLeft className="w-4 h-4" />
            back to the journal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-oxblood/8 text-oxblood px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-[0.18em]"
                  >
                    {category.name.toLowerCase()}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display font-semibold tracking-tighter text-4xl md:text-6xl leading-[1.0] lowercase mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mid mb-10">
              <span>{formatDate(post.publishedAt).toLowerCase()}</span>
              <span className="w-1 h-1 rounded-full bg-ink/25" />
              <span>{getReadTime(post.content)}</span>
            </div>

            {post.featuredImageUrl && (
              <div className="rounded-md overflow-hidden border border-ink/10 bg-ink mb-12 flex items-center justify-center">
                <img
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {post.excerpt && (
              <p className="font-display text-xl md:text-2xl text-ink leading-snug italic lowercase mb-12 border-l-2 border-oxblood pl-6">
                {post.excerpt}
              </p>
            )}

            <div
              className="
                text-[#181612] text-lg leading-relaxed
                [&>p]:mb-6
                [&>h1]:font-display [&>h1]:font-semibold [&>h1]:tracking-tighter [&>h1]:text-4xl [&>h1]:leading-tight [&>h1]:mt-12 [&>h1]:mb-5 [&>h1]:lowercase
                [&>h2]:font-display [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:text-3xl [&>h2]:leading-snug [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:lowercase
                [&>h3]:font-display [&>h3]:font-medium [&>h3]:tracking-tight [&>h3]:text-2xl [&>h3]:mt-10 [&>h3]:mb-3 [&>h3]:lowercase
                [&_a]:text-[#6B1421] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#8C2331]
                [&_strong]:font-semibold [&_strong]:text-[#181612]
                [&_em]:italic
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2
                [&_li]:leading-relaxed [&_li]:marker:text-[#6B1421]
                [&>blockquote]:border-l-2 [&>blockquote]:border-[#6B1421] [&>blockquote]:pl-6 [&>blockquote]:my-8 [&>blockquote]:font-display [&>blockquote]:text-2xl [&>blockquote]:italic [&>blockquote]:text-[#181612] [&>blockquote]:lowercase
                [&>hr]:border-0 [&>hr]:border-t [&>hr]:border-[#181612]/15 [&>hr]:my-10
                [&_img]:rounded-md [&_img]:my-8 [&_img]:border [&_img]:border-[#181612]/10
                [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:bg-[#E7E2D6]/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
              "
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-14 pt-8 border-t border-ink/10">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] text-ink-mid mb-4">tagged</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="border border-ink/15 text-ink-mid px-3 py-1.5 rounded-md text-sm lowercase"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
