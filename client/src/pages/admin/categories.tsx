import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Trash2, Edit, Save, X, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Category } from "@shared/schema";
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

export default function AdminCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/admin/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category created" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create category", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      return await apiRequest("PUT", `/api/admin/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category updated" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update category", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete category", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.slug) return;
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingId ? generateSlug(name) : prev.slug,
    }));
  };

  return (
    <AdminLayout title="Categories">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#6F6A5F] text-sm">{categories?.length ?? 0} categor{(categories?.length ?? 0) !== 1 ? "ies" : "y"} · organize your blog posts with categories</p>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
          data-testid="button-create-category"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-md border border-[#181612]/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#181612] font-semibold">{editingId ? "Edit Category" : "New Category"}</h2>
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
                  placeholder="category name"
                  className="bg-[#FBF9F3] border-[#181612]/15 text-[#181612]"
                  data-testid="input-category-name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#181612]">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                  className="bg-[#FBF9F3] border-[#181612]/15 text-[#181612]"
                  data-testid="input-category-slug"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#181612]">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="optional description"
                className="bg-[#FBF9F3] border-[#181612]/15 text-[#181612]"
                data-testid="input-category-description"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.slug}
                className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
                data-testid="button-save-category"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Update" : "Create"}
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
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: any) => (
            <div key={category.id} className="bg-white rounded-md border border-[#181612]/10 p-4" data-testid={`card-category-${category.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-[#6B1421]/10">
                    <Folder className="w-5 h-5 text-[#6B1421]" />
                  </div>
                  <div>
                    <h3 className="text-[#181612] font-medium lowercase">{category.name}</h3>
                    <p className="text-[#6F6A5F] text-sm">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                    className="text-[#6F6A5F] hover:text-[#181612]"
                    data-testid={`button-edit-category-${category.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#6F6A5F] hover:text-[#6B1421]"
                        data-testid={`button-delete-category-${category.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border-[#181612]/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#181612]">Delete Category</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#6F6A5F]">
                          Are you sure you want to delete "{category.name}"? Posts will be unlinked from this category.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white text-[#181612] border-[#181612]/15 hover:bg-[#F4F1EA]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(category.id)}
                          className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {category.description && (
                <p className="text-[#6F6A5F] text-sm mt-3 lowercase">{category.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-md border border-[#181612]/10 py-12 text-center">
          <Folder className="w-12 h-12 text-[#181612]/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#181612] mb-2">No categories yet</h3>
          <p className="text-[#6F6A5F] mb-4">Create categories to organize your blog posts</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Category
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}
