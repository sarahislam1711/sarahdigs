import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminPosts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/posts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({ title: "Post deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete post", variant: "destructive" });
    },
  });

  return (
    <AdminLayout title="Blog Posts">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">Manage your blog posts and articles</p>
        <Link href="/admin/posts/new">
          <Button className="bg-[#4D00FF] hover:bg-[#4D00FF]/80" data-testid="button-create-post">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D00FF]"></div>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <Card key={post.id} className="bg-[#0D0D0D] border-gray-800" data-testid={`card-post-${post.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {post.featuredImageUrl ? (
                      <img
                        src={post.featuredImageUrl}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{post.title}</h3>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {post.excerpt || "No excerpt available"}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            post.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {post.status}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-gray-500 text-sm">/{post.slug}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.status === "published" && (
                      <Link href={`/journal/${post.slug}`}>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" data-testid={`button-view-${post.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/posts/${post.id}`}>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" data-testid={`button-edit-${post.id}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" data-testid={`button-delete-${post.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#0D0D0D] border-gray-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete Post</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete "{post.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(post.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-[#0D0D0D] border-gray-800">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400 mb-4">Create your first blog post to get started</p>
            <Link href="/admin/posts/new">
              <Button className="bg-[#4D00FF] hover:bg-[#4D00FF]/80">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
