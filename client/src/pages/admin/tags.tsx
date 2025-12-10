import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Trash2, X, Tags as TagsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
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
        <p className="text-gray-400">Add tags to your blog posts for better organization</p>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
          data-testid="button-create-tag"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {showForm && (
        <Card className="bg-[#0D0D0D] border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              New Tag
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Tag name"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-tag-name"
                />
              </div>
              <div>
                <Label className="text-gray-400">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="tag-slug"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-tag-slug"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.slug}
                className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
                data-testid="button-save-tag"
              >
                Create Tag
              </Button>
              <Button variant="ghost" onClick={resetForm} className="text-gray-400">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D00FF]"></div>
        </div>
      ) : tags && tags.length > 0 ? (
        <Card className="bg-[#0D0D0D] border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag: any) => (
                <div
                  key={tag.id}
                  className="group flex items-center gap-2 bg-gray-800 rounded-full pl-4 pr-2 py-2"
                  data-testid={`tag-${tag.id}`}
                >
                  <span className="text-white">{tag.name}</span>
                  <span className="text-gray-500 text-sm">/{tag.slug}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-delete-tag-${tag.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0D0D0D] border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Tag</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to delete "{tag.name}"? Posts will be unlinked from this tag.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(tag.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#0D0D0D] border-gray-800">
          <CardContent className="py-12 text-center">
            <TagsIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No tags yet</h3>
            <p className="text-gray-400 mb-4">Create tags to label your blog posts</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Tag
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
