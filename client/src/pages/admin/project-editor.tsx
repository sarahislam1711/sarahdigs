import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation, Link } from "wouter";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

// Mirrors the `projects` table in shared/schema.ts (v1 minimal aligned model).
interface ProjectForm {
  id?: string;
  name: string;
  slug: string;
  website: string;
  industry: string;
  year: number | null;
  imageUrl: string;
  problem: string;
  approach: string;
  metricValue: string;
  metricLabel: string;
  status: string; // "live" | "coming_soon"
  serviceTags: string[];
  role: string;
  timeline: string;
  displayOrder: number;
  isVisible: boolean;
}

const defaultProject: ProjectForm = {
  name: "",
  slug: "",
  website: "",
  industry: "",
  year: new Date().getFullYear(),
  imageUrl: "",
  problem: "",
  approach: "",
  metricValue: "",
  metricLabel: "",
  status: "live",
  serviceTags: [],
  role: "",
  timeline: "",
  displayOrder: 0,
  isVisible: true,
};

export default function ProjectEditor() {
  const [, params] = useRoute("/admin/projects/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = params?.id === "new";
  const projectId = isNew ? null : params?.id;

  const [project, setProject] = useState<ProjectForm>(defaultProject);

  const { data: existingProject, isLoading } = useQuery({
    queryKey: ["/api/admin/projects", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const res = await fetch(`/api/admin/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json();
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (existingProject) {
      setProject({ ...defaultProject, ...existingProject });
    }
  }, [existingProject]);

  const saveMutation = useMutation({
    mutationFn: async (data: ProjectForm) => {
      const url = projectId ? `/api/admin/projects/${projectId}` : "/api/admin/projects";
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: projectId ? "Project updated!" : "Project created!" });
      if (isNew && data.id) navigate(`/admin/projects/${data.id}`);
    },
    onError: () => {
      toast({ title: "Failed to save project", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!project.name) {
      toast({ title: "Project name is required", variant: "destructive" });
      return;
    }
    saveMutation.mutate(project);
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const update = (field: keyof ProjectForm, value: any) =>
    setProject((prev) => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B1421]" />
        </div>
      </AdminLayout>
    );
  }

  const inputCls = "bg-[#FBF9F3] border-[#181612]/15 text-[#181612]";

  return (
    <AdminLayout title={isNew ? "New Project" : `Edit: ${project.name}`}>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/projects">
            <Button variant="ghost" className="text-[#6F6A5F] hover:text-[#181612]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-[#6B1421] hover:bg-[#8C2331] text-white"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Project
          </Button>
        </div>

        <div className="bg-white rounded-md border border-[#181612]/10 p-6 space-y-8">
          {/* ── Basics ── */}
          <section className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Basics</h2>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[#181612]">Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => {
                    update("name", e.target.value);
                    if (isNew) update("slug", generateSlug(e.target.value));
                  }}
                  placeholder="PLACES"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#181612]">Slug</Label>
                <Input
                  value={project.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="places"
                  className={inputCls}
                />
                <p className="text-[#6F6A5F] text-xs">URL: /projects/{project.slug || "…"}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label className="text-[#181612]">Industry</Label>
                <Input
                  value={project.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  placeholder="b2b real estate"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#181612]">Year</Label>
                <Input
                  type="number"
                  value={project.year ?? ""}
                  onChange={(e) => update("year", e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="2025"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#181612]">Live URL</Label>
                <Input
                  value={project.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="places-egy.com"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[#181612]">Role</Label>
                <Input
                  value={project.role}
                  onChange={(e) => update("role", e.target.value)}
                  placeholder="design & build"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#181612]">Timeline</Label>
                <Input
                  value={project.timeline}
                  onChange={(e) => update("timeline", e.target.value)}
                  placeholder="6 weeks"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#181612]">Hero / Screenshot Image URL</Label>
              <Input
                value={project.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="/src/assets/projects/places.png or https://…"
                className={inputCls}
              />
              {project.imageUrl && (
                <img src={project.imageUrl} alt="" className="mt-2 w-full max-w-sm rounded-md border border-[#181612]/10" />
              )}
            </div>
          </section>

          {/* ── Case study ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Case Study</h2>

            <div className="space-y-2">
              <Label className="text-[#181612]">The Problem (before)</Label>
              <Textarea
                value={project.problem}
                onChange={(e) => update("problem", e.target.value)}
                placeholder="what the client came to us with."
                className={inputCls}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#181612]">The Approach (what we built)</Label>
              <Textarea
                value={project.approach}
                onChange={(e) => update("approach", e.target.value)}
                placeholder="research, design, build narrative."
                className={inputCls}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#181612]">Service Tags</Label>
              <Input
                value={(project.serviceTags ?? []).join(", ")}
                onChange={(e) =>
                  update(
                    "serviceTags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="strategy, design & development, custom cms, seo architecture"
                className={inputCls}
              />
              <p className="text-[#6F6A5F] text-xs">
                comma-separated. add as many as you want — shown as tags on the work page.
              </p>
            </div>
          </section>

          {/* ── Result metric ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Headline Result</h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[#181612]">Metric Value</Label>
                <Input
                  value={project.metricValue}
                  onChange={(e) => update("metricValue", e.target.value)}
                  placeholder="+312%"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#181612]">Metric Label</Label>
                <Input
                  value={project.metricLabel}
                  onChange={(e) => update("metricLabel", e.target.value)}
                  placeholder="organic traffic"
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* ── Settings ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Settings</h2>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[#181612]">Status</Label>
                <select
                  value={project.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="w-full bg-[#FBF9F3] border border-[#181612]/15 text-[#181612] rounded-md px-3 py-2"
                >
                  <option value="live">live</option>
                  <option value="coming_soon">coming soon</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#181612]">Display Order</Label>
                <Input
                  type="number"
                  value={project.displayOrder}
                  onChange={(e) => update("displayOrder", parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
                <p className="text-[#6F6A5F] text-xs">Lower numbers appear first (drives lot order).</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FBF9F3] rounded-md">
              <div>
                <p className="text-[#181612] font-medium">Visible</p>
                <p className="text-[#6F6A5F] text-sm">Show this project on the public site</p>
              </div>
              <Switch
                checked={project.isVisible}
                onCheckedChange={(checked) => update("isVisible", checked)}
              />
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
