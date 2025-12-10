import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
      <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans">
        <Navbar />
        <div className="pt-40 pb-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D00FF]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />
      
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <Link href="/journal" className="inline-flex items-center text-[#1B1B1B]/60 hover:text-[#4D00FF] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <span 
                    key={category.id}
                    className="bg-[#4D00FF]/10 text-[#4D00FF] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-[#1B1B1B]/60 mb-12">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getReadTime(post.content)}</span>
              </div>
            </div>

            {post.featuredImageUrl && (
              <div className="rounded-3xl overflow-hidden mb-12">
                <img 
                  src={post.featuredImageUrl} 
                  alt={post.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {post.excerpt && (
              <p className="text-xl text-[#1B1B1B]/80 leading-relaxed mb-12 font-light border-l-4 border-[#4D00FF] pl-6">
                {post.excerpt}
              </p>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#4D00FF] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#1B1B1B]/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B]/50 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag.id}
                      className="bg-[#F4F2FF] text-[#1B1B1B] px-4 py-2 rounded-full text-sm font-medium"
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
