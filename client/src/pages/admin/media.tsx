import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { Upload, Trash2, Edit, Image as ImageIcon, FileText, Copy, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Media } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function AdminMedia() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMedia, setEditingMedia] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mediaItems, isLoading } = useQuery<Media[]>({
    queryKey: ["/api/admin/media"],
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File size must be less than 10MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const { url, filename, originalFilename, fileType, fileSize } = await uploadRes.json();

      await apiRequest("POST", "/api/admin/media", {
        filename: originalFilename || filename,
        originalFilename: originalFilename,
        url: url,
        fileType: fileType,
        fileSize: fileSize,
        altText: "",
        caption: "",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { altText?: string; caption?: string } }) => {
      return await apiRequest("PUT", `/api/admin/media/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({ title: "Media updated" });
      setEditingMedia(null);
    },
    onError: () => {
      toast({ title: "Failed to update media", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({ title: "Media deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete media", variant: "destructive" });
    },
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "URL copied to clipboard" });
  };

  return (
    <AdminLayout title="Media Library">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">Upload and manage your images and files</p>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            data-testid="input-file-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
            data-testid="button-upload-media"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={!!editingMedia} onOpenChange={(open) => !open && setEditingMedia(null)}>
        <DialogContent className="bg-[#0D0D0D] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Media</DialogTitle>
          </DialogHeader>
          {editingMedia && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={editingMedia.url}
                  alt={editingMedia.altText || editingMedia.filename}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <Label className="text-gray-400">Alt Text</Label>
                <Input
                  value={editingMedia.altText || ""}
                  onChange={(e) => setEditingMedia({ ...editingMedia, altText: e.target.value })}
                  placeholder="Description of the image"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Caption</Label>
                <Textarea
                  value={editingMedia.caption || ""}
                  onChange={(e) => setEditingMedia({ ...editingMedia, caption: e.target.value })}
                  placeholder="Optional caption"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => updateMutation.mutate({
                    id: editingMedia.id,
                    data: { altText: editingMedia.altText, caption: editingMedia.caption }
                  })}
                  className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
                >
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setEditingMedia(null)} className="text-gray-400">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D00FF]"></div>
        </div>
      ) : mediaItems && mediaItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaItems.map((item: any) => (
            <Card
              key={item.id}
              className="bg-[#0D0D0D] border-gray-800 overflow-hidden group"
              data-testid={`card-media-${item.id}`}
            >
              <div className="aspect-square bg-gray-800 relative">
                {item.fileType?.startsWith("image") ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="text-white hover:bg-white/20"
                    data-testid={`button-copy-${item.id}`}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingMedia(item)}
                    className="text-white hover:bg-white/20"
                    data-testid={`button-edit-${item.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-red-500/50"
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0D0D0D] border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Media</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to delete this media file? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-white text-sm truncate">{item.filename}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-[#0D0D0D] border-gray-800">
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No media yet</h3>
            <p className="text-gray-400 mb-4">Add images and files to your media library</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
