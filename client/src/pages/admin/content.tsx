import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, BarChart3, ListOrdered, Briefcase, FolderKanban } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Stat, ProcessStep, Service, Project } from "@shared/schema";

function StatsManager() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<Stat | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ value: "", label: "" });

  const { data: stats = [], isLoading } = useQuery<Stat[]>({
    queryKey: ["/api/admin/stats"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { value: string; label: string }) => {
      return await apiRequest("POST", "/api/admin/stats", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsDialogOpen(false);
      setFormData({ value: "", label: "" });
      toast({ title: "Stat created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create stat", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { value: string; label: string } }) => {
      return await apiRequest("PUT", `/api/admin/stats/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({ value: "", label: "" });
      toast({ title: "Stat updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update stat", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/stats/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Stat deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete stat", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (item: Stat) => {
    setEditingItem(item);
    setFormData({ value: item.value, label: item.label });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ value: "", label: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Statistics</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} data-testid="button-add-stat">
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">{editingItem ? "Edit Stat" : "Add New Stat"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Value (e.g., "$5M+", "100+")</Label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="$5M+"
                  data-testid="input-stat-value"
                />
              </div>
              <div>
                <Label className="text-gray-300">Label</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Revenue Generated"
                  data-testid="input-stat-label"
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-stat">
                {editingItem ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {stats.map((stat) => (
            <Card key={stat.id} className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="text-2xl font-bold text-[#4D00FF]">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(stat)} data-testid={`button-edit-stat-${stat.id}`}>
                    <Pencil className="w-4 h-4 text-gray-300" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(stat.id)} data-testid={`button-delete-stat-${stat.id}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProcessStepsManager() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<ProcessStep | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ stepNumber: "1", title: "", description: "" });

  const { data: steps = [], isLoading } = useQuery<ProcessStep[]>({
    queryKey: ["/api/admin/process-steps"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { stepNumber: string; title: string; description: string }) => {
      return await apiRequest("POST", "/api/admin/process-steps", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/process-steps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/process-steps"] });
      setIsDialogOpen(false);
      setFormData({ stepNumber: "1", title: "", description: "" });
      toast({ title: "Process step created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create process step", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { stepNumber: string; title: string; description: string } }) => {
      return await apiRequest("PUT", `/api/admin/process-steps/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/process-steps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/process-steps"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Process step updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update process step", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/process-steps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/process-steps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/process-steps"] });
      toast({ title: "Process step deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete process step", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (item: ProcessStep) => {
    setEditingItem(item);
    setFormData({ stepNumber: item.stepNumber, title: item.title, description: item.description || "" });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ stepNumber: String((steps.length || 0) + 1), title: "", description: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Process Steps</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} data-testid="button-add-process-step">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white">{editingItem ? "Edit Process Step" : "Add New Process Step"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Step Number</Label>
                <Input
                  value={formData.stepNumber}
                  onChange={(e) => setFormData({ ...formData, stepNumber: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-step-number"
                />
              </div>
              <div>
                <Label className="text-gray-300">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Discovery"
                  data-testid="input-step-title"
                />
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Deep-dive into your data, brand, and goals."
                  data-testid="input-step-description"
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-process-step">
                {editingItem ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {steps.sort((a, b) => parseInt(a.stepNumber) - parseInt(b.stepNumber)).map((step) => (
            <Card key={step.id} className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="flex justify-between items-start p-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4D00FF] flex items-center justify-center text-white font-bold">
                    {step.stepNumber}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{step.title}</p>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(step)} data-testid={`button-edit-step-${step.id}`}>
                    <Pencil className="w-4 h-4 text-gray-300" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(step.id)} data-testid={`button-delete-step-${step.id}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ServicesManager() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    shortDescription: "",
    iconName: "Search",
  });

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
  });

  const iconOptions = ["Search", "BarChart3", "Users", "Layout", "TrendingUp"];

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/admin/services", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsDialogOpen(false);
      setFormData({ slug: "", title: "", shortDescription: "", iconName: "Search" });
      toast({ title: "Service created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create service", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      return await apiRequest("PUT", `/api/admin/services/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Service updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update service", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete service", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (item: Service) => {
    setEditingItem(item);
    setFormData({
      slug: item.slug,
      title: item.title,
      shortDescription: item.shortDescription || "",
      iconName: item.iconName || "Search",
    });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ slug: "", title: "", shortDescription: "", iconName: "Search" });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Services</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} data-testid="button-add-service">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">{editingItem ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Slug (URL path)</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="seo"
                    data-testid="input-service-slug"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Icon</Label>
                  <Select value={formData.iconName} onValueChange={(v) => setFormData({ ...formData, iconName: v })}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-service-icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon} className="text-white">{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="SEO & Organic"
                  data-testid="input-service-title"
                />
              </div>
              <div>
                <Label className="text-gray-300">Short Description (for cards)</Label>
                <Textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Comprehensive audit of your technical foundation..."
                  data-testid="input-service-short-desc"
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-service">
                {editingItem ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {services.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((service) => (
            <Card key={service.id} className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="flex justify-between items-start p-4">
                <div>
                  <p className="text-lg font-semibold text-white">{service.title}</p>
                  <p className="text-gray-400 text-sm">/services/{service.slug}</p>
                  <p className="text-gray-500 mt-2">{service.shortDescription}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(service)} data-testid={`button-edit-service-${service.id}`}>
                    <Pencil className="w-4 h-4 text-gray-300" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(service.id)} data-testid={`button-delete-service-${service.id}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsManager() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    website: "",
    industry: "",
    projectType: "",
    focus: "",
    results: "",
    iconName: "",
    imageUrl: "",
  });

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/admin/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Project created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create project", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      return await apiRequest("PUT", `/api/admin/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Project updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete project", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      name: "",
      website: "",
      industry: "",
      projectType: "",
      focus: "",
      results: "",
      iconName: "",
      imageUrl: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (item: Project) => {
    setEditingItem(item);
    setFormData({
      slug: item.slug,
      name: item.name,
      website: item.website || "",
      industry: item.industry || "",
      projectType: item.projectType || "",
      focus: item.focus || "",
      results: item.results || "",
      iconName: item.iconName || "",
      imageUrl: item.imageUrl || "",
    });
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Projects</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} data-testid="button-add-project">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">{editingItem ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Slug (URL path)</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="fintech-growth"
                    data-testid="input-project-slug"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Industry</Label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Fintech"
                    data-testid="input-project-industry"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="SEO Transformation"
                  data-testid="input-project-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="https://..."
                    data-testid="input-project-website"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Project Type</Label>
                  <Input
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="SEO & Growth"
                    data-testid="input-project-type"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://..."
                  data-testid="input-project-image"
                />
              </div>
              <div>
                <Label className="text-gray-300">Focus</Label>
                <Textarea
                  value={formData.focus}
                  onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-project-focus"
                />
              </div>
              <div>
                <Label className="text-gray-300">Results</Label>
                <Textarea
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-project-results"
                />
              </div>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-project">
                {editingItem ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="flex justify-between items-start p-4">
                <div>
                  <p className="text-lg font-semibold text-white">{project.name}</p>
                  <p className="text-[#4D00FF] text-sm">{project.industry} - {project.projectType}</p>
                  <p className="text-gray-500 text-sm mt-1">{project.focus}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(project)} data-testid={`button-edit-project-${project.id}`}>
                    <Pencil className="w-4 h-4 text-gray-300" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(project.id)} data-testid={`button-delete-project-${project.id}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminContent() {
  return (
    <AdminLayout title="Site Content">
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="bg-[#1a1a1a] border-gray-800 mb-6">
          <TabsTrigger value="stats" className="data-[state=active]:bg-[#4D00FF]" data-testid="tab-stats">
            <BarChart3 className="w-4 h-4 mr-2" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="process" className="data-[state=active]:bg-[#4D00FF]" data-testid="tab-process">
            <ListOrdered className="w-4 h-4 mr-2" />
            Process
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-[#4D00FF]" data-testid="tab-services">
            <Briefcase className="w-4 h-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-[#4D00FF]" data-testid="tab-projects">
            <FolderKanban className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <StatsManager />
        </TabsContent>

        <TabsContent value="process">
          <ProcessStepsManager />
        </TabsContent>

        <TabsContent value="services">
          <ServicesManager />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsManager />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
