import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
import type { Service } from "@shared/schema";

export default function AdminServices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service.",
        variant: "destructive",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      return await apiRequest("PUT", `/api/admin/services/${id}`, { isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({
        title: "Visibility updated",
        description: "Service visibility has been updated.",
      });
    },
  });

  const sortedServices = services?.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) || [];

  return (
    <AdminLayout title="Services">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-400">Manage your service pages</p>
        <Link href="/admin/services/new">
          <Button className="bg-[#4D00FF] hover:bg-[#4D00FF]/80">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#4D00FF]" />
        </div>
      ) : sortedServices.length === 0 ? (
        <Card className="bg-[#0D0D0D] border-gray-800 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No services yet</h3>
          <p className="text-gray-400 mb-6">Create your first service page to get started.</p>
          <Link href="/admin/services/new">
            <Button className="bg-[#4D00FF] hover:bg-[#4D00FF]/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map((service) => (
            <Card key={service.id} className="bg-[#0D0D0D] border-gray-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#4D00FF]/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[#4D00FF]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{service.title}</h3>
                    <p className="text-gray-500 text-sm">/{service.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleVisibilityMutation.mutate({ 
                    id: service.id, 
                    isVisible: !service.isVisible 
                  })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {service.isVisible ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {service.shortDescription || "No description"}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                <Link href={`/admin/services/${service.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-gray-700 text-gray-400 hover:text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-700 text-red-400 hover:text-red-300 hover:border-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#0D0D0D] border-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Service</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete "{service.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(service.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}