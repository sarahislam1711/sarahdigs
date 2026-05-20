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
  ExternalLink
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

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  iconName: string;
  isVisible: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminServices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
      });
      if (!res.ok) throw new Error("Failed to update service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service visibility updated" });
    },
    onError: () => {
      toast({ title: "Failed to update service", variant: "destructive" });
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete service", variant: "destructive" });
    },
  });

  const sortedServices = [...services].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <AdminLayout title="Services">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400">
              Manage your service pages. Drag to reorder, click to edit.
            </p>
          </div>
          <Link href="/admin/services/new">
            <Button className="bg-[#6B1421] hover:bg-[#3D00CC] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </Link>
        </div>

        {/* Services List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#6B1421]" />
          </div>
        ) : services.length === 0 ? (
          <div className="bg-[#0D0D0D] rounded-md border border-gray-800 p-12 text-center">
            <p className="text-gray-400 mb-4">No services yet</p>
            <Link href="/admin/services/new">
              <Button className="bg-[#6B1421] hover:bg-[#3D00CC] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Service
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-[#0D0D0D] rounded-md border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="w-10 px-4 py-3"></th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-sm">Service</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-sm">Slug</th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium text-sm">Visible</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedServices.map((service) => (
                  <tr 
                    key={service.id} 
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <GripVertical className="w-4 h-4 text-gray-600 cursor-grab" />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white font-medium">{service.title}</p>
                        <p className="text-gray-500 text-sm truncate max-w-md">
                          {service.shortDescription}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-[#6B1421] bg-[#6B1421]/10 px-2 py-1 rounded-md text-sm">
                        /services/{service.slug}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleVisibility.mutate({ 
                          id: service.id, 
                          isVisible: !service.isVisible 
                        })}
                        className={`p-2 rounded-md transition-colors ${
                          service.isVisible 
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
                            : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                        }`}
                        title={service.isVisible ? "Hide service" : "Show service"}
                      >
                        {service.isVisible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/services/${service.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                          title="View live page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link href={`/admin/services/${service.id}`}>
                          <button
                            className="p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                            title="Edit service"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(service.id)}
                          className="p-2 rounded-md bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete service"
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
          <div className="bg-[#0D0D0D] rounded-md border border-gray-800 p-6">
            <p className="text-gray-400 text-sm">Total Services</p>
            <p className="text-3xl font-bold text-white mt-1">{services.length}</p>
          </div>
          <div className="bg-[#0D0D0D] rounded-md border border-gray-800 p-6">
            <p className="text-gray-400 text-sm">Visible</p>
            <p className="text-3xl font-bold text-green-500 mt-1">
              {services.filter(s => s.isVisible).length}
            </p>
          </div>
          <div className="bg-[#0D0D0D] rounded-md border border-gray-800 p-6">
            <p className="text-gray-400 text-sm">Hidden</p>
            <p className="text-3xl font-bold text-gray-500 mt-1">
              {services.filter(s => !s.isVisible).length}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1B1B1B] border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Service?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the service
              and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteService.mutate(deleteId)}
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