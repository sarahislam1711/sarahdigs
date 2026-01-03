import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  ArrowLeft, 
  Loader2,
  Image as ImageIcon,
  X,
  Plus,
  GripVertical,
  Calendar,
  Flag
} from "lucide-react";
import { Link } from "wouter";

interface TimelineItem {
  phase: string;
  title: string;
  description: string;
  date?: string;
}

interface Project {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  clientName: string;
  clientLogo: string;
  featuredImage: string;
  galleryImages: string[];
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  testimonial: { quote: string; author: string; role: string };
  projectUrl: string;
  completedDate: string;
  tags: string[];
  isVisible: boolean;
  isFeatured: boolean;
  displayOrder: number;
  timeline: TimelineItem[];
}

const defaultProject: Project = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  category: "",
  clientName: "",
  clientLogo: "",
  featuredImage: "",
  galleryImages: [],
  challenge: "",
  solution: "",
  results: [],
  testimonial: { quote: "", author: "", role: "" },
  projectUrl: "",
  completedDate: "",
  tags: [],
  isVisible: true,
  isFeatured: false,
  displayOrder: 0,
  timeline: [],
};

export default function ProjectEditor() {
  const [, params] = useRoute("/admin/projects/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = params?.id === "new";
  const projectId = isNew ? null : params?.id;

  const [project, setProject] = useState<Project>(defaultProject);
  const [activeTab, setActiveTab] = useState("basic");

  // Fetch existing project
  const { data: existingProject, isLoading } = useQuery({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json();
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (existingProject) {
      setProject({
        ...defaultProject,
        ...existingProject,
        galleryImages: existingProject.galleryImages || [],
        results: existingProject.results || [],
        testimonial: existingProject.testimonial || { quote: "", author: "", role: "" },
        tags: existingProject.tags || [],
        timeline: existingProject.timeline || [],
      });
    }
  }, [existingProject]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Project) => {
      const url = projectId ? `/api/projects/${projectId}` : "/api/projects";
      const method = projectId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save project");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: projectId ? "Project updated!" : "Project created!" });
      if (isNew && data.id) {
        navigate(`/admin/projects/${data.id}`);
      }
    },
    onError: () => {
      toast({ title: "Failed to save project", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!project.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    saveMutation.mutate(project);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const updateField = (field: keyof Project, value: any) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  // Results functions
  const addResult = () => {
    setProject((prev) => ({
      ...prev,
      results: [...prev.results, { label: "", value: "" }],
    }));
  };

  const updateResult = (index: number, field: "label" | "value", value: string) => {
    setProject((prev) => ({
      ...prev,
      results: prev.results.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      ),
    }));
  };

  const removeResult = (index: number) => {
    setProject((prev) => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index),
    }));
  };

  // Gallery functions
  const addGalleryImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setProject((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, url],
      }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setProject((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  // Timeline functions
  const addTimelineItem = () => {
    const nextPhase = String(project.timeline.length + 1).padStart(2, "0");
    setProject((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { phase: nextPhase, title: "", description: "", date: "" },
      ],
    }));
  };

  const updateTimelineItem = (
    index: number,
    field: keyof TimelineItem,
    value: string
  ) => {
    setProject((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeTimelineItem = (index: number) => {
    setProject((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const moveTimelineItem = (index: number, direction: "up" | "down") => {
    const newTimeline = [...project.timeline];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newTimeline.length) return;
    
    [newTimeline[index], newTimeline[targetIndex]] = [
      newTimeline[targetIndex],
      newTimeline[index],
    ];
    
    // Update phase numbers
    newTimeline.forEach((item, i) => {
      item.phase = String(i + 1).padStart(2, "0");
    });
    
    setProject((prev) => ({ ...prev, timeline: newTimeline }));
  };

  if (isLoading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4D00FF]" />
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "content", label: "Content" },
    { id: "media", label: "Media" },
    { id: "results", label: "Results" },
    { id: "timeline", label: "Timeline" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <AdminLayout title={isNew ? "New Project" : `Edit: ${project.title}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/projects">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-[#4D00FF] hover:bg-[#3D00CC] text-white"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Project
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-800 pb-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-[#4D00FF] text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#0D0D0D] rounded-xl border border-gray-800 p-6">
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Title *</Label>
                  <Input
                    value={project.title}
                    onChange={(e) => {
                      updateField("title", e.target.value);
                      if (isNew) {
                        updateField("slug", generateSlug(e.target.value));
                      }
                    }}
                    placeholder="Project title"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Slug</Label>
                  <Input
                    value={project.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="project-slug"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Short Description</Label>
                <Textarea
                  value={project.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  placeholder="Brief description for cards and previews"
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Client Name</Label>
                  <Input
                    value={project.clientName}
                    onChange={(e) => updateField("clientName", e.target.value)}
                    placeholder="Client or company name"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <Input
                    value={project.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    placeholder="e.g., Web Design, Branding, SEO"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Project URL</Label>
                  <Input
                    value={project.projectUrl}
                    onChange={(e) => updateField("projectUrl", e.target.value)}
                    placeholder="https://example.com"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Completed Date</Label>
                  <Input
                    type="date"
                    value={project.completedDate}
                    onChange={(e) => updateField("completedDate", e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Full Description</Label>
                <Textarea
                  value={project.fullDescription}
                  onChange={(e) => updateField("fullDescription", e.target.value)}
                  placeholder="Detailed project description"
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">The Challenge</Label>
                <Textarea
                  value={project.challenge}
                  onChange={(e) => updateField("challenge", e.target.value)}
                  placeholder="What problem did the client face?"
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">The Solution</Label>
                <Textarea
                  value={project.solution}
                  onChange={(e) => updateField("solution", e.target.value)}
                  placeholder="How did you solve it?"
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-white">Client Testimonial</Label>
                <Textarea
                  value={project.testimonial.quote}
                  onChange={(e) =>
                    updateField("testimonial", { ...project.testimonial, quote: e.target.value })
                  }
                  placeholder="Client quote..."
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={project.testimonial.author}
                    onChange={(e) =>
                      updateField("testimonial", { ...project.testimonial, author: e.target.value })
                    }
                    placeholder="Author name"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  <Input
                    value={project.testimonial.role}
                    onChange={(e) =>
                      updateField("testimonial", { ...project.testimonial, role: e.target.value })
                    }
                    placeholder="Author role/title"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Featured Image URL</Label>
                <Input
                  value={project.featuredImage}
                  onChange={(e) => updateField("featuredImage", e.target.value)}
                  placeholder="https://..."
                  className="bg-gray-900 border-gray-700 text-white"
                />
                {project.featuredImage && (
                  <img
                    src={project.featuredImage}
                    alt="Featured"
                    className="mt-2 w-full max-w-md rounded-lg"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white">Client Logo URL</Label>
                <Input
                  value={project.clientLogo}
                  onChange={(e) => updateField("clientLogo", e.target.value)}
                  placeholder="https://..."
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Gallery Images</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addGalleryImage}
                    className="border-gray-700 text-gray-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Image
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {project.galleryImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-white">Key Results / Stats</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addResult}
                  className="border-gray-700 text-gray-400 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Result
                </Button>
              </div>

              <div className="space-y-4">
                {project.results.map((result, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <Input
                        value={result.value}
                        onChange={(e) => updateResult(i, "value", e.target.value)}
                        placeholder="e.g., +150%"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      <Input
                        value={result.label}
                        onChange={(e) => updateResult(i, "label", e.target.value)}
                        placeholder="e.g., Organic Traffic"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResult(i)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {project.results.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No results added yet. Click "Add Result" to showcase your impact.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white text-lg">Project Timeline</Label>
                  <p className="text-gray-500 text-sm mt-1">
                    Add phases or milestones to show the project progression
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTimelineItem}
                  className="border-gray-700 text-gray-400 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Phase
                </Button>
              </div>

              <div className="space-y-4">
                {project.timeline.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-900/50"
                  >
                    <div className="flex items-start gap-4">
                      {/* Phase number indicator */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-[#4D00FF] flex items-center justify-center text-white font-bold">
                          {item.phase}
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <button
                            onClick={() => moveTimelineItem(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveTimelineItem(index, "down")}
                            disabled={index === project.timeline.length - 1}
                            className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      {/* Content fields */}
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Phase Title *</Label>
                            <Input
                              value={item.title}
                              onChange={(e) =>
                                updateTimelineItem(index, "title", e.target.value)
                              }
                              placeholder="e.g., Discovery & Research"
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Date / Duration (optional)
                            </Label>
                            <Input
                              value={item.date || ""}
                              onChange={(e) =>
                                updateTimelineItem(index, "date", e.target.value)
                              }
                              placeholder="e.g., Week 1-2 or Jan 2024"
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">Description</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) =>
                              updateTimelineItem(index, "description", e.target.value)
                            }
                            placeholder="What happened during this phase? What was delivered?"
                            className="bg-gray-800 border-gray-700 text-white"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimelineItem(index)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {project.timeline.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
                    <Flag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No timeline phases added yet</p>
                    <p className="text-gray-600 text-sm mb-4">
                      Add phases to showcase your project process and milestones
                    </p>
                    <Button
                      variant="outline"
                      onClick={addTimelineItem}
                      className="border-gray-700 text-gray-400 hover:text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Phase
                    </Button>
                  </div>
                )}
              </div>

              {project.timeline.length > 0 && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    <strong className="text-white">Tip:</strong> A good project timeline typically includes 
                    3-5 phases such as: Discovery, Strategy, Design, Development, Launch & Results.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">Visible</p>
                  <p className="text-gray-500 text-sm">Show this project on the public site</p>
                </div>
                <Switch
                  checked={project.isVisible}
                  onCheckedChange={(checked) => updateField("isVisible", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">Featured</p>
                  <p className="text-gray-500 text-sm">Highlight this project on the homepage</p>
                </div>
                <Switch
                  checked={project.isFeatured}
                  onCheckedChange={(checked) => updateField("isFeatured", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Display Order</Label>
                <Input
                  type="number"
                  value={project.displayOrder}
                  onChange={(e) => updateField("displayOrder", parseInt(e.target.value) || 0)}
                  className="bg-gray-900 border-gray-700 text-white w-32"
                />
                <p className="text-gray-500 text-sm">Lower numbers appear first</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}