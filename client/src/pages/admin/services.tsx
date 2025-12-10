import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Plus, Trash2, Edit, Eye, EyeOff, Search, BarChart3, Users, Layout, TrendingUp, Briefcase, Rocket, Target, Zap, Settings, Globe, Code, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Service } from "@shared/schema";
import { Link } from "wouter";
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

const iconMap: Record<string, any> = {
  Search, BarChart3, Users, Layout, TrendingUp, Briefcase, Rocket, Target, Zap, Settings, Globe, Code
};

export default function AdminServices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete service", variant: "destructive" });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      return await apiRequest("PUT", `/api/admin/services/${id}`, { isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service visibility updated" });
    },
    onError: () => {
      toast({ title: "Failed to update service", variant: "destructive" });
    },
  });

  const sortedServices = [...services].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <AdminLayout title="Services">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">Manage your service pages</p>
        <Button asChild className="bg-[#4D00FF] hover:bg-[#4D00FF]/80">
          <Link href="/admin/services/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D00FF]"></div>
        </div>
      ) : sortedServices.length > 0 ? (
        <div className="space-y-3">
          {sortedServices.map((service) => {
            const IconComponent = iconMap[service.iconName || "Search"] || Search;
            return (
              <Card key={service.id} className="bg-[#1a1a1a] border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-gray-500 cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-[#4D00FF]/20 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-[#4D00FF]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{service.title}</h3>
                          {!service.isVisible && (
                            <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">Hidden</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">/services/{service.slug}</p>
                        {service.shortDescription && (
                          <p className="text-gray-400 text-sm mt-1 line-clamp-1 max-w-md">
                            {service.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibilityMutation.mutate({ 
                          id: service.id, 
                          isVisible: !service.isVisible 
                        })}
                        className="text-gray-400 hover:text-white"
                        title={service.isVisible ? "Hide service" : "Show service"}
                      >
                        {service.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-gray-400 hover:text-white"
                      >
                        <Link href={`/admin/services/${service.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500"
                          >
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
                            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No services yet</h3>
            <p className="text-gray-400 mb-4">Create your first service page</p>
            <Button asChild className="bg-[#4D00FF] hover:bg-[#4D00FF]/80">
              <Link href="/admin/services/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Service
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}