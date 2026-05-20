import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImageUrl: string | null;
  status: string;
  publishedAt: string | null;
  categories?: { id: string; name: string; slug: string }[];
  tags?: { id: string; name: string; slug: string }[];
}

export default function AdminPreview() {
  const [match, params] = useRoute("/admin/preview/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/admin/preview", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center">
        <div className="animate-spin rounded-md h-12 w-12 border-t-2 border-b-2 border-[#6B1421]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-[#181612] mb-4">Post not found</h1>
        <Link href="/admin/posts">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA]">
      <div className="bg-yellow-500 text-black text-center py-2 text-sm font-medium">
        Preview Mode - {post.status === "draft" ? "Draft" : "Published"}
        <Link href={`/admin/posts/${post.id}`} className="ml-4 underline">
          Edit Post
        </Link>
      </div>
      <Navbar />
      
      <article className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {post.featuredImageUrl && (
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-md mb-8"
            />
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories?.map((category) => (
              <span
                key={category.id}
                className="text-xs font-medium uppercase tracking-wider text-[#6B1421]"
              >
                {category.name}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#181612] mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-[#181612]/70 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags?.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-[#E7E2D6] text-[#6B1421] text-sm rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div 
            className="prose prose-lg max-w-none prose-headings:text-[#181612] prose-p:text-[#181612]/80 prose-a:text-[#6B1421] prose-blockquote:border-l-[#6B1421] prose-blockquote:text-[#181612]/70"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
}
