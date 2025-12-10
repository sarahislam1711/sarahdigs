import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Wrench, Newspaper, FlaskConical, Lightbulb, FileText, ChevronRight, Loader2, Search, Layout, BarChart3, Users, Briefcase, Rocket, Target, Zap, Heart, Star, Globe, Code, Database, Settings, MessageSquare, BookOpen, PenTool, Camera, Video, Mail, Calendar, Tag, Award, TrendingUp, Cpu, Cloud, Layers, Plane } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost, Category } from "@shared/schema";

const JournalHero = () => {
  return (
    <section className="pt-40 pb-20 bg-[#FBFCFE]">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[0.95]">
            A living archive of what I'm <span className="text-[#4D00FF]">testing</span>, <span className="text-[#4D00FF]">learning</span> & fixing
          </h1>
          <p className="text-xl md:text-2xl font-light text-[#1B1B1B]/80 leading-relaxed max-w-2xl">
            Welcome to my Journal — the inside of my brain, organized... well, mostly
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturedPieces = () => {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  // Get posts marked as featured, or fall back to first 3 posts
  const featuredPosts = posts?.filter((p: any) => p.isFeatured) || [];
  const featured = featuredPosts.length > 0 ? featuredPosts.slice(0, 3) : posts?.slice(0, 3) || [];

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

  const colors = ["bg-[#F4F2FF]", "bg-[#1B1B1B]", "bg-[#4D00FF]"];

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#4D00FF]" />
          </div>
        </div>
      </section>
    );
  }

  if (!featured.length) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-bold uppercase tracking-widest text-[#1B1B1B] text-[19px]">Featured Pieces</h2>
          </div>
          <div className="text-center py-12 text-[#1B1B1B]/50">
            <p className="text-lg">No posts yet. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-bold uppercase tracking-widest text-[#1B1B1B] text-[19px]">Featured Pieces</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((post, i) => (
            <Link key={post.id} href={`/journal/post/${post.slug}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`aspect-[4/3] ${post.featuredImageUrl ? '' : colors[i % 3]} rounded-3xl mb-6 relative overflow-hidden group-hover:shadow-xl transition-all duration-500`}>
                  {post.featuredImageUrl && (
                    <img 
                      src={post.featuredImageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#1B1B1B]">
                    Blog
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <ArrowUpRight className="absolute top-6 right-6 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0" />
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-[#1B1B1B]/50 mb-3 uppercase tracking-wider">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="w-1 h-1 bg-[#1B1B1B]/20 rounded-full"></span>
                  <span>{getReadTime(post.content)}</span>
                </div>
                <h3 className="text-2xl font-bold leading-tight group-hover:text-[#4D00FF] transition-colors">
                  {post.title}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const AllPosts = () => {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  // Get posts that are not featured
  const featuredPosts = posts?.filter((p: any) => p.isFeatured) || [];
  // If there are featured posts, show non-featured in All Posts
  // Otherwise, skip first 3 (which are shown in Featured) from All Posts
  const allPosts = featuredPosts.length > 0 
    ? posts?.filter((p: any) => !p.isFeatured) || []
    : posts?.slice(3) || [];

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

  if (isLoading || !allPosts.length) return null;

  return (
    <section className="py-12 bg-white border-t border-[#1B1B1B]/5">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-bold uppercase tracking-widest text-[#1B1B1B] text-[19px]">All Posts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post, i) => (
            <Link key={post.id} href={`/journal/post/${post.slug}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer flex flex-col h-full"
              >
                <div className="bg-[#F4F2FF] rounded-[2rem] p-8 mb-6 group-hover:shadow-xl transition-all duration-300 border border-[#1B1B1B]/5 group-hover:border-[#4D00FF]/20 relative overflow-hidden flex-1 flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4D00FF]/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150"></div>
                  
                  <div className="mb-auto">
                    <h3 className="text-2xl font-bold leading-tight mb-4 group-hover:text-[#4D00FF] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[#1B1B1B]/70 leading-relaxed text-sm">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#1B1B1B]/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1B1B1B]/50">
                    <span>{formatDate(post.publishedAt)}</span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#4D00FF] group-hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionsGrid = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Icon mapping for category icons
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    FlaskConical,
    Newspaper,
    Wrench,
    Lightbulb,
    FileText,
    Search,
    Layout,
    BarChart3,
    Users,
    Briefcase,
    Rocket,
    Target,
    Zap,
    Heart,
    Star,
    Globe,
    Code,
    Database,
    Settings,
    MessageSquare,
    BookOpen,
    PenTool,
    Camera,
    Video,
    Mail,
    Calendar,
    Tag,
    Award,
    TrendingUp,
    Cpu,
    Cloud,
    Layers,
    Plane,
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white border-t border-[#1B1B1B]/5">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold tracking-tighter mb-16">Browse by <span className="text-[#4D00FF]">Category</span></h2>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#4D00FF]" />
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="py-24 bg-white border-t border-[#1B1B1B]/5">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold tracking-tighter mb-16">Browse by <span className="text-[#4D00FF]">Category</span></h2>
          <div className="text-center py-12 text-[#1B1B1B]/50">
            <p className="text-lg">No categories yet. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white border-t border-[#1B1B1B]/5">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tighter mb-16">Browse by <span className="text-[#4D00FF]">Category</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, i) => {
            const IconComponent = iconMap[category.iconName || 'FileText'] || FileText;
            const bgColor = category.bgColor || '#F4F2FF';
            const textColor = category.textColor || '#4D00FF';
            
            return (
              <Link key={category.id} href={`/journal/${category.slug}`} className="block h-full">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-8 rounded-[2rem] border border-[#1B1B1B]/10 hover:border-[#4D00FF] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[300px] h-full relative overflow-hidden"
                  style={{ backgroundColor: bgColor }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4D00FF]/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150"></div>
                  
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#1B1B1B]/5 flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6" style={{ color: textColor }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: textColor }}>{category.name}</h3>
                    <p className="text-lg leading-relaxed opacity-70" style={{ color: textColor }}>
                      {category.description || ''}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:text-[#4D00FF] transition-colors" style={{ color: textColor }}>
                    Explore <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  return (
    <section className="py-24 bg-[#F4F2FF]">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Get the digest.
          </h2>
          <p className="text-xl text-[#1B1B1B]/70 mb-10">
            I send one email a month with my best findings. No spam, just signal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-6 py-4 rounded-full border border-[#1B1B1B]/10 bg-white focus:outline-none focus:border-[#4D00FF] transition-colors"
            />
            <Button size="lg" className="rounded-full px-8 h-auto py-4 bg-[#1B1B1B] hover:bg-[#4D00FF] text-white text-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Journal() {
  return (
    <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />
      <JournalHero />
      <FeaturedPieces />
      <AllPosts />
      <SectionsGrid />
      <Newsletter />
      <Footer />
    </div>
  );
}