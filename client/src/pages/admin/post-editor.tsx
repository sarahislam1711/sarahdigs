import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useRoute } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import { Save, ArrowLeft, Eye, Image as ImageIcon, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { BlogPost, Category, Tag } from "@shared/schema";
import { ImageUploader } from "@/components/ImageUploader";
import { RichTextEditor } from "@/components/RichTextEditor";

interface PostWithRelations extends BlogPost {
  categories?: Category[];
  tags?: Tag[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PostEditor() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/posts/:id");
  const isNew = params?.id === "new";
  const postId = isNew ? null : params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImageUrl: "",
    isFeatured: false,
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    categoryIds: [] as string[],
    tagIds: [] as string[],
  });

  const { data: post, isLoading: postLoading } = useQuery<PostWithRelations>({
    queryKey: ["/api/admin/posts", postId],
    enabled: !!postId,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: tags } = useQuery<Tag[]>({
    queryKey: ["/api/admin/tags"],
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        featuredImageUrl: post.featuredImageUrl || "",
        isFeatured: post.isFeatured || false,
        status: post.status || "draft",
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        metaKeywords: post.metaKeywords || "",
        categoryIds: post.categories?.map((c: any) => c.id) || [],
        tagIds: post.tags?.map((t: any) => t.id) || [],
      });
    }
  }, [post]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const publishedAt = data.status === "published" ? new Date().toISOString() : null;
      if (postId) {
        return await apiRequest("PUT", `/api/admin/posts/${postId}`, { ...data, publishedAt });
      } else {
        return await apiRequest("POST", "/api/admin/posts", { ...data, publishedAt });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({ title: postId ? "Post updated" : "Post created" });
      navigate("/admin/posts");
    },
    onError: (error: any) => {
      toast({ title: "Failed to save post", description: error.message, variant: "destructive" });
    },
  });

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleInlineImageUpload = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("isPublic", "true");
        try {
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            credentials: "include",
            body: formDataUpload,
          });
          if (response.ok) {
            const data = await response.json();
            resolve(data.url);
          } else {
            toast({ title: "Upload failed", variant: "destructive" });
            resolve(null);
          }
        } catch (error) {
          toast({ title: "Upload error", variant: "destructive" });
          resolve(null);
        }
      };
      input.click();
    });
  }, [toast]);

  if (postLoading && !isNew) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D00FF]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNew ? "Create New Post" : "Edit Post"}>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/posts")}
          className="text-gray-400 hover:text-white"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
        <div className="flex gap-2">
          {formData.slug && !isNew && (
            <Button
              variant="outline"
              onClick={() => window.open(`/admin/preview/${formData.slug}`, "_blank")}
              className="border-gray-700 text-gray-400 hover:text-white"
              data-testid="button-preview"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          <Button
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending || !formData.title || !formData.slug}
            className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
            data-testid="button-save"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-title"
                />
              </div>
              <div>
                <Label className="text-gray-400">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-url-slug"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-slug"
                />
              </div>
              <div>
                <Label className="text-gray-400">Content</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                  onImageUpload={handleInlineImageUpload}
                />
                <p className="text-gray-500 text-xs mt-2">
                  Use the toolbar to format text, add headings, quotes, and insert images.
                </p>
              </div>
              <div>
                <Label className="text-gray-400">Excerpt</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="A short summary of the post"
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                  data-testid="input-excerpt"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Meta Title</Label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO title (leave empty to use post title)"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-meta-title"
                />
              </div>
              <div>
                <Label className="text-gray-400">Meta Description</Label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO description for search engines"
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                  data-testid="input-meta-description"
                />
              </div>
              <div>
                <Label className="text-gray-400">Keywords</Label>
                <Input
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaKeywords: e.target.value }))}
                  placeholder="comma, separated, keywords"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-meta-keywords"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="draft" className="text-white">Draft</SelectItem>
                    <SelectItem value="published" className="text-white">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: checked === true }))}
                  className="border-gray-600 data-[state=checked]:bg-[#4D00FF] data-[state=checked]:border-[#4D00FF]"
                />
                <Label htmlFor="isFeatured" className="text-gray-400 cursor-pointer">
                  Feature this post
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.featuredImageUrl ? (
                <div className="relative">
                  <img
                    src={formData.featuredImageUrl}
                    alt="Featured"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData((prev) => ({ ...prev, featuredImageUrl: "" }))}
                    data-testid="button-remove-image"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-4">No featured image</p>
                  <ImageUploader
                    onUploadComplete={(objectPath) => setFormData((prev) => ({ ...prev, featuredImageUrl: objectPath }))}
                    buttonClassName="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {categories && categories.length > 0 ? (
                <div className="space-y-2">
                  {categories.map((category: any) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category.id}`}
                        checked={formData.categoryIds.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                        className="border-gray-600"
                        data-testid={`checkbox-category-${category.id}`}
                      />
                      <label
                        htmlFor={`cat-${category.id}`}
                        className="text-gray-300 text-sm cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No categories. Create some first.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {tags && tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <Badge
                      key={tag.id}
                      variant={formData.tagIds.includes(tag.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.tagIds.includes(tag.id)
                          ? "bg-[#4D00FF]"
                          : "border-gray-600 text-gray-400 hover:border-[#4D00FF]"
                      }`}
                      onClick={() => toggleTag(tag.id)}
                      data-testid={`badge-tag-${tag.id}`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No tags. Create some first.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}