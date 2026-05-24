import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Project } from "@shared/schema";

export default function AdminProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
    queryFn: async () => {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project visibility updated" });
    },
    onError: () => toast({ title: "Failed to update project", variant: "destructive" }),
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted" });
      setDeleteId(null);
    },
    onError: () => toast({ title: "Failed to delete project", variant: "destructive" }),
  });

  const sorted = [...projects].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return (
    <AdminLayout title="Projects">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-[#6F6A5F] text-sm">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
          <Link href="/admin/projects/new">
            <Button className="bg-[#6B1421] hover:bg-[#8C2331] text-white">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#6B1421]" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#181612]/20 rounded-md">
            <p className="text-[#6F6A5F] mb-4">No projects yet.</p>
            <Link href="/admin/projects/new">
              <Button variant="outline" className="border-[#181612]/20 text-[#181612]">
                <Plus className="w-4 h-4 mr-2" /> Create your first project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-md border border-[#181612]/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#181612]/10 text-left">
                  <th className="px-4 py-3 text-[#6F6A5F] font-medium text-sm">Image</th>
                  <th className="px-4 py-3 text-[#6F6A5F] font-medium text-sm">Project</th>
                  <th className="px-4 py-3 text-[#6F6A5F] font-medium text-sm">Industry</th>
                  <th className="px-4 py-3 text-[#6F6A5F] font-medium text-sm">Status</th>
                  <th className="px-4 py-3 text-[#6F6A5F] font-medium text-sm text-center">Visible</th>
                  <th className="px-4 py-3 text-[#6F6A5F] font-medium text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((project) => (
                  <tr key={project.id} className="border-b border-[#181612]/10 hover:bg-[#F4F1EA]/60 transition-colors">
                    <td className="px-4 py-4">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.name} className="w-12 h-12 rounded-md object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-[#E7E2D6] flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-[#6F6A5F]/50" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[#181612] font-medium">{project.name}</p>
                      <p className="text-[#6F6A5F] text-sm">/projects/{project.slug}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[#6F6A5F] text-sm">{project.industry || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${project.status === "coming_soon" ? "bg-[#E7E2D6] text-[#6F6A5F]" : "bg-[#6B1421]/10 text-[#6B1421]"}`}>
                        {project.status === "coming_soon" ? "coming soon" : "live"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleVisibility.mutate({ id: project.id, isVisible: !project.isVisible })}
                        className={`p-2 rounded-md transition-colors ${project.isVisible ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-[#E7E2D6] text-[#6F6A5F] hover:bg-[#dcd6c8]"}`}
                        title={project.isVisible ? "Visible" : "Hidden"}
                      >
                        {project.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {project.website && (
                          <a
                            href={project.website.startsWith("http") ? project.website : `https://${project.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-md bg-[#E7E2D6] text-[#6F6A5F] hover:text-[#181612] transition-colors"
                            title="Visit live site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link href={`/admin/projects/${project.id}`}>
                          <button className="p-2 rounded-md bg-[#E7E2D6] text-[#6F6A5F] hover:text-[#181612] transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(project.id)}
                          className="p-2 rounded-md bg-[#E7E2D6] text-red-600 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white border-[#181612]/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#181612]">Delete project?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6F6A5F]">
              This permanently removes the project and its case study. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-[#181612]/20 text-[#181612]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteProject.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
