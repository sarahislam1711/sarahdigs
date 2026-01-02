import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical,
  Loader2,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";
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

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  clientName: string;
  featuredImage: string;
  isVisible: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project visibility updated" });
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured }),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project featured status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete project", variant: "destructive" });
    },
  });

  const sortedProjects = [...projects].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <AdminLayout title="Projects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400">
              Manage your portfolio projects. Showcase your best work.
            </p>
          </div>
          <Link href="/admin/projects/new">
            <Button className="bg-[#4D00FF] hover:bg-[#3D00CC] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </Link>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#4D00FF]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-[#0D0D0D] rounded-xl border border-gray-800 p-12 text-center">
            <p className="text-gray-400 mb-4">No projects yet</p>
            <Link href="/admin/projects/new">
              <Button className="bg-[#4D00FF] hover:bg-[#3D00CC] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#0D0D0D] rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="w-10 px-4 py-3"></th>
                  <th className="w-16 px-4 py-3"></th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-sm">Project</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium text-sm">Featured</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium text-sm">Visible</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.map((project) => (
                  <tr 
                    key={project.id} 
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <GripVertical className="w-4 h-4 text-gray-600 cursor-grab" />
                    </td>
                    <td className="px-4 py-4">
                      {project.featuredImage ? (
                        <img 
                          src={project.featuredImage} 
                          alt={project.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white font-medium">{project.title}</p>
                        <p className="text-gray-500 text-sm">
                          {project.clientName && <span>{project.clientName}</span>}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-400 text-sm">
                        {project.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleFeatured.mutate({ 
                          id: project.id, 
                          isFeatured: !project.isFeatured 
                        })}
                        className={`p-2 rounded-lg transition-colors ${
                          project.isFeatured 
                            ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" 
                            : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                        }`}
                        title={project.isFeatured ? "Remove from featured" : "Add to featured"}
                      >
                        ★
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleVisibility.mutate({ 
                          id: project.id, 
                          isVisible: !project.isVisible 
                        })}
                        className={`p-2 rounded-lg transition-colors ${
                          project.isVisible 
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
                            : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                        }`}
                        title={project.isVisible ? "Hide project" : "Show project"}
                      >
                        {project.isVisible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                          title="View live page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link href={`/admin/projects/${project.id}`}>
                          <button
                            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                            title="Edit project"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(project.id)}
                          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete project"
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0D0D0D] rounded-xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm">Total Projects</p>
            <p className="text-3xl font-bold text-white mt-1">{projects.length}</p>
          </div>
          <div className="bg-[#0D0D0D] rounded-xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm">Featured</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">
              {projects.filter(p => p.isFeatured).length}
            </p>
          </div>
          <div className="bg-[#0D0D0D] rounded-xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm">Visible</p>
            <p className="text-3xl font-bold text-green-500 mt-1">
              {projects.filter(p => p.isVisible).length}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1B1B1B] border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Project?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the project
              and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteProject.mutate(deleteId)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}