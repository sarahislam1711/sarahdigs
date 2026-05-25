import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Trash2, X, Tags as TagsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Tag } from "@shared/schema";
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminTags() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: ["/api/admin/tags"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/admin/tags", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tags"] });
      toast({ title: "Tag created" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create tag", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tags"] });
      toast({ title: "Tag deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete tag", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", slug: "" });
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.slug) return;
    createMutation.mutate(formData);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      name,
      slug: generateSlug(name),
    });
  };

  return (
    <AdminLayout title="Tags">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#6F6A5F] text-sm">{tags?.length ?? 0} tag{(tags?.length ?? 0) !== 1 ? "s" : ""} · add tags to label and organize your blog posts</p>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
          data-testid="button-create-tag"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-md border border-[#181612]/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#181612] font-semibold">New Tag</h2>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="w-4 h-4 text-[#6F6A5F]" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#181612]">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="tag name"
                  className="bg-[#FBF9F3] border-[#181612]/15 text-[#181612]"
                  data-testid="input-tag-name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#181612]">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="tag-slug"
                  className="bg-[#FBF9F3] border-[#181612]/15 text-[#181612]"
                  data-testid="input-tag-slug"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.slug}
                className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
                data-testid="button-save-tag"
              >
                Create Tag
              </Button>
              <Button variant="ghost" onClick={resetForm} className="text-[#6F6A5F]">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6B1421]"></div>
        </div>
      ) : tags && tags.length > 0 ? (
        <div className="bg-white rounded-md border border-[#181612]/10 p-6">
          <div className="flex flex-wrap gap-3">
            {tags.map((tag: any) => (
              <div
                key={tag.id}
                className="group flex items-center gap-2 bg-[#F4F1EA] border border-[#181612]/10 rounded-full pl-4 pr-2 py-2"
                data-testid={`tag-${tag.id}`}
              >
                <span className="text-[#181612] lowercase">{tag.name}</span>
                <span className="text-[#6F6A5F] text-sm">/{tag.slug}</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-[#6F6A5F] hover:text-[#6B1421] opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-delete-tag-${tag.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border-[#181612]/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#181612]">Delete Tag</AlertDialogTitle>
                      <AlertDialogDescription className="text-[#6F6A5F]">
                        Are you sure you want to delete "{tag.name}"? Posts will be unlinked from this tag.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white text-[#181612] border-[#181612]/15 hover:bg-[#F4F1EA]">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(tag.id)}
                        className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-[#181612]/10 py-12 text-center">
          <TagsIcon className="w-12 h-12 text-[#181612]/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#181612] mb-2">No tags yet</h3>
          <p className="text-[#6F6A5F] mb-4">Create tags to label your blog posts</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Tag
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}
