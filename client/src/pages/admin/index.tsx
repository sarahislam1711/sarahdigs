import AdminLayout from "@/components/layout/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image, FolderOpen, Tags, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost, Media, Category, Tag } from "@shared/schema";

export default function AdminDashboard() {
  const { data: posts } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/posts"],
  });

  const { data: media } = useQuery<Media[]>({
    queryKey: ["/api/admin/media"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: tags } = useQuery<Tag[]>({
    queryKey: ["/api/admin/tags"],
  });

  const stats = [
    {
      title: "Blog Posts",
      value: posts?.length || 0,
      icon: FileText,
      href: "/admin/posts",
      color: "bg-[#4D00FF]",
    },
    {
      title: "Media Files",
      value: media?.length || 0,
      icon: Image,
      href: "/admin/media",
      color: "bg-purple-600",
    },
    {
      title: "Categories",
      value: categories?.length || 0,
      icon: FolderOpen,
      href: "/admin/categories",
      color: "bg-blue-600",
    },
    {
      title: "Tags",
      value: tags?.length || 0,
      icon: Tags,
      href: "/admin/tags",
      color: "bg-green-600",
    },
  ];

  const publishedPosts = posts?.filter((p: any) => p.status === "published") || [];
  const draftPosts = posts?.filter((p: any) => p.status === "draft") || [];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <a className="block">
              <Card className="bg-[#0D0D0D] border-gray-800 hover:border-[#4D00FF] transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0D0D0D] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#4D00FF]" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.slice(0, 5).map((post: any) => (
                  <Link key={post.id} href={`/admin/posts/${post.id}`}>
                    <a className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                      <div>
                        <p className="text-white font-medium">{post.title}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No posts yet. Create your first post!
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#4D00FF]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/posts/new">
              <a className="flex items-center gap-3 p-4 rounded-lg bg-[#4D00FF]/10 hover:bg-[#4D00FF]/20 border border-[#4D00FF]/30 transition-colors" data-testid="button-new-post">
                <FileText className="w-5 h-5 text-[#4D00FF]" />
                <span className="text-white font-medium">Create New Post</span>
              </a>
            </Link>
            <Link href="/admin/media">
              <a className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-colors" data-testid="button-upload-media">
                <Image className="w-5 h-5 text-purple-500" />
                <span className="text-white font-medium">Upload Media</span>
              </a>
            </Link>
            <Link href="/admin/settings">
              <a className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-colors" data-testid="button-site-settings">
                <Tags className="w-5 h-5 text-blue-500" />
                <span className="text-white font-medium">Site Settings</span>
              </a>
            </Link>
            <Link href="/admin/content">
              <a className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 transition-colors" data-testid="button-site-content">
                <FolderOpen className="w-5 h-5 text-green-500" />
                <span className="text-white font-medium">Manage Site Content</span>
              </a>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-[#0D0D0D] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Post Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Published</span>
                <span className="text-white font-bold">{publishedPosts.length}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${posts?.length ? (publishedPosts.length / posts.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Drafts</span>
                <span className="text-white font-bold">{draftPosts.length}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${posts?.length ? (draftPosts.length / posts.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Media</CardTitle>
          </CardHeader>
          <CardContent>
            {media && media.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {media.slice(0, 8).map((item: any) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg bg-gray-800 overflow-hidden"
                  >
                    {item.fileType?.startsWith("image") ? (
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No media uploaded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
