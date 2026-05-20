import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
      toast({ title: "Post deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete post", variant: "destructive" });
    },
  });

  return (
    <AdminLayout title="journal">
      <div className="flex justify-between items-center mb-8">
        <p className="text-[#6F6A5F] lowercase">manage your blog posts</p>
        <Link href="/admin/posts/new">
          <Button
            className="bg-[#181612] hover:bg-[#6B1421] text-[#F4F1EA] rounded-md lowercase"
            data-testid="button-create-post"
          >
            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
            new post
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#181612]/15 border-t-[#6B1421]" />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post: any) => (
            <div
              key={post.id}
              className="group bg-[#FBF9F3] border border-[#181612]/10 rounded-md p-5 transition-colors hover:border-[#6B1421]/40"
              data-testid={`card-post-${post.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0">
                  {post.featuredImageUrl ? (
                    <img
                      src={post.featuredImageUrl}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-md shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#E7E2D6] rounded-md flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-[#6F6A5F]" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[#181612] mb-1 lowercase truncate">
                      {post.title}
                    </h3>
                    <p className="text-[#6F6A5F] text-sm mb-3 line-clamp-2">
                      {post.excerpt || "no excerpt"}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] rounded-md ${
                          post.status === "published"
                            ? "bg-[#1F4D3A]/12 text-[#1F4D3A]"
                            : "bg-[#181612]/8 text-[#6F6A5F]"
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-[#6F6A5F] text-xs lowercase">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[#6F6A5F] text-xs font-mono">/{post.slug}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {post.status === "published" && (
                    <Link href={`/journal/post/${post.slug}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#6F6A5F] hover:text-[#181612] hover:bg-[#181612]/5 rounded-md"
                        data-testid={`button-view-${post.id}`}
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.75} />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/admin/posts/${post.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#6F6A5F] hover:text-[#181612] hover:bg-[#181612]/5 rounded-md"
                      data-testid={`button-edit-${post.id}`}
                    >
                      <Edit className="w-4 h-4" strokeWidth={1.75} />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#6F6A5F] hover:text-[#6B1421] hover:bg-[#6B1421]/5 rounded-md"
                        data-testid={`button-delete-${post.id}`}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#F4F1EA] border border-[#181612]/15 rounded-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#181612] lowercase">delete post</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#6F6A5F]">
                          Are you sure you want to delete "{post.title}"? This can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent text-[#181612] border-[#181612]/20 hover:bg-[#181612]/5 rounded-md">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(post.id)}
                          className="bg-[#6B1421] hover:bg-[#4A0E16] text-[#F4F1EA] rounded-md"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FBF9F3] border border-[#181612]/10 rounded-md py-16 text-center">
          <FileText className="w-10 h-10 text-[#6F6A5F]/50 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold text-[#181612] mb-2 lowercase">no posts yet</h3>
          <p className="text-[#6F6A5F] mb-6 lowercase">create your first blog post to get started.</p>
          <Link href="/admin/posts/new">
            <Button className="bg-[#181612] hover:bg-[#6B1421] text-[#F4F1EA] rounded-md lowercase">
              <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
              new post
            </Button>
          </Link>
        </div>
      )}
    </AdminLayout>
  );
}
