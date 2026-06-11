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
import { Save, ArrowLeft, Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

// Mirrors the `projects` table in shared/schema.ts (v1 minimal aligned model).
interface GallerySlide {
  imageUrl: string;
  caption: string;
}

interface Metric {
  value: string;
  label: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface ProjectForm {
  id?: string;
  name: string;
  slug: string;
  website: string;
  industry: string;
  year: number | null;
  imageUrl: string;
  logoUrl: string;
  problem: string;
  problemStory: string;
  approach: string;
  metricValue: string;
  metricLabel: string;
  status: string; // "live" | "coming_soon"
  serviceTags: string[];
  role: string;
  timeline: string;
  metaStatus: string;
  displayOrder: number;
  isVisible: boolean;
  gallery: GallerySlide[];
  metrics: Metric[];
  processSteps: ProcessStep[];
  beforeStates: string[];
  afterStates: string[];
}

const defaultProject: ProjectForm = {
  name: "",
  slug: "",
  website: "",
  industry: "",
  year: new Date().getFullYear(),
  imageUrl: "",
  logoUrl: "",
  problem: "",
  problemStory: "",
  approach: "",
  metricValue: "",
  metricLabel: "",
  status: "live",
  serviceTags: [],
  role: "",
  timeline: "",
  metaStatus: "",
  displayOrder: 0,
  isVisible: true,
  gallery: [],
  metrics: [],
  processSteps: [],
  beforeStates: [],
  afterStates: [],
};

export default function ProjectEditor() {
  const [, params] = useRoute("/admin/projects/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = params?.id === "new";
  const projectId = isNew ? null : params?.id;

  const [project, setProject] = useState<ProjectForm>(defaultProject);
  // Raw text backing the comma-separated Service Tags input. Kept separate from
  // the parsed array so typing a comma (which briefly leaves an empty segment)
  // doesn't get stripped mid-edit — we only trim/filter on save.
  const [serviceTagsText, setServiceTagsText] = useState("");

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
      const ex = existingProject as Partial<ProjectForm>;
      setProject({
        ...defaultProject,
        ...ex,
        gallery: Array.isArray(ex.gallery) ? ex.gallery : [],
        serviceTags: Array.isArray(ex.serviceTags) ? ex.serviceTags : [],
        metrics: Array.isArray(ex.metrics) ? ex.metrics : [],
        processSteps: Array.isArray(ex.processSteps) ? ex.processSteps : [],
        beforeStates: Array.isArray(ex.beforeStates) ? ex.beforeStates : [],
        afterStates: Array.isArray(ex.afterStates) ? ex.afterStates : [],
      });
      setServiceTagsText((Array.isArray(ex.serviceTags) ? ex.serviceTags : []).join(", "));
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
    // Parse the raw Service Tags text into a clean array only at save time.
    const serviceTags = serviceTagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    saveMutation.mutate({ ...project, serviceTags });
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const update = (field: keyof ProjectForm, value: any) =>
    setProject((prev) => ({ ...prev, [field]: value }));

  // ── gallery slide helpers ──
  const addSlide = () =>
    setProject((prev) => ({ ...prev, gallery: [...prev.gallery, { imageUrl: "", caption: "" }] }));
  const updateSlide = (i: number, field: keyof GallerySlide, value: string) =>
    setProject((prev) => ({
      ...prev,
      gallery: prev.gallery.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    }));
  const removeSlide = (i: number) =>
    setProject((prev) => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }));
  const moveSlide = (i: number, dir: -1 | 1) =>
    setProject((prev) => {
      const next = [...prev.gallery];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...prev, gallery: next };
    });

  // ── metrics helpers ──
  const addMetric = () =>
    setProject((prev) => ({ ...prev, metrics: [...prev.metrics, { value: "", label: "" }] }));
  const updateMetric = (i: number, field: keyof Metric, value: string) =>
    setProject((prev) => ({
      ...prev,
      metrics: prev.metrics.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    }));
  const removeMetric = (i: number) =>
    setProject((prev) => ({ ...prev, metrics: prev.metrics.filter((_, idx) => idx !== i) }));

  // ── process step helpers ──
  const addStep = () =>
    setProject((prev) => ({ ...prev, processSteps: [...prev.processSteps, { title: "", description: "" }] }));
  const updateStep = (i: number, field: keyof ProcessStep, value: string) =>
    setProject((prev) => ({
      ...prev,
      processSteps: prev.processSteps.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    }));
  const removeStep = (i: number) =>
    setProject((prev) => ({ ...prev, processSteps: prev.processSteps.filter((_, idx) => idx !== i) }));
  const moveStep = (i: number, dir: -1 | 1) =>
    setProject((prev) => {
      const next = [...prev.processSteps];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...prev, processSteps: next };
    });

  // ── before/after state helpers (plain string arrays) ──
  const addState = (field: "beforeStates" | "afterStates") =>
    setProject((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  const updateState = (field: "beforeStates" | "afterStates", i: number, value: string) =>
    setProject((prev) => ({
      ...prev,
      [field]: prev[field].map((s, idx) => (idx === i ? value : s)),
    }));
  const removeState = (field: "beforeStates" | "afterStates", i: number) =>
    setProject((prev) => ({ ...prev, [field]: prev[field].filter((_, idx) => idx !== i) }));

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
              <div className="space-y-2">
                <Label className="text-[#181612]">Status (meta pill)</Label>
                <Input
                  value={project.metaStatus}
                  onChange={(e) => update("metaStatus", e.target.value)}
                  placeholder="live, in progress, concept…"
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

            <div className="space-y-2">
              <Label className="text-[#181612]">Logo URL (shown in work list & "more work")</Label>
              <Input
                value={project.logoUrl}
                onChange={(e) => update("logoUrl", e.target.value)}
                placeholder="/projects/places-logo.png"
                className={inputCls}
              />
              {project.logoUrl && (
                <div className="mt-2 w-full max-w-sm aspect-video rounded-md border border-[#181612]/10 bg-[#F4F1EA] flex items-center justify-center p-8">
                  <img src={project.logoUrl} alt="" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>
          </section>

          {/* ── Gallery carousel ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Gallery Carousel</h2>
                <p className="text-[#6F6A5F] text-xs mt-1">screenshots shown in the "a closer look" carousel on the project page. each slide: image + short caption.</p>
              </div>
              <Button
                type="button"
                onClick={addSlide}
                className="bg-[#181612] text-[#F4F1EA] hover:bg-[#6B1421] gap-2"
              >
                <Plus className="w-4 h-4" /> add slide
              </Button>
            </div>

            {project.gallery.length === 0 ? (
              <p className="text-[#6F6A5F] text-sm italic">no slides yet. the carousel is hidden until you add one.</p>
            ) : (
              <div className="space-y-4">
                {project.gallery.map((slide, i) => (
                  <div key={i} className="rounded-md border border-[#181612]/15 bg-[#FBF9F3] p-4 flex gap-4">
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <span className="text-[#6B1421] font-bold text-sm tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <button type="button" onClick={() => moveSlide(i, -1)} disabled={i === 0} className="text-[#181612]/50 hover:text-[#181612] disabled:opacity-25"><ChevronUp className="w-4 h-4" /></button>
                      <button type="button" onClick={() => moveSlide(i, 1)} disabled={i === project.gallery.length - 1} className="text-[#181612]/50 hover:text-[#181612] disabled:opacity-25"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={slide.imageUrl}
                        onChange={(e) => updateSlide(i, "imageUrl", e.target.value)}
                        placeholder="/projects/places-2.jpg"
                        className={inputCls}
                      />
                      <Textarea
                        value={slide.caption}
                        onChange={(e) => updateSlide(i, "caption", e.target.value)}
                        placeholder="short caption describing this view..."
                        rows={2}
                        className={inputCls}
                      />
                      {slide.imageUrl && (
                        <div className="w-40 aspect-video rounded border border-[#181612]/10 bg-[#E7E2D6] overflow-hidden">
                          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => removeSlide(i)} className="text-[#181612]/40 hover:text-[#6B1421] self-start pt-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Case study ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Case Study</h2>

            <div className="space-y-2">
              <Label className="text-[#181612]">The Problem (short, shown in hero)</Label>
              <Textarea
                value={project.problem}
                onChange={(e) => update("problem", e.target.value)}
                placeholder="one-line summary of what the client came to us with."
                className={inputCls}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#181612]">The Problem Story (long, "where it started" section)</Label>
              <Textarea
                value={project.problemStory}
                onChange={(e) => update("problemStory", e.target.value)}
                placeholder="the full narrative of the problem the client faced. shown as a story section above the carousel. leave blank to hide."
                className={inputCls}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#181612]">Service Tags</Label>
              <Input
                value={serviceTagsText}
                onChange={(e) => setServiceTagsText(e.target.value)}
                placeholder="strategy, design & development, custom cms, seo architecture"
                className={inputCls}
              />
              <p className="text-[#6F6A5F] text-xs">
                comma-separated. add as many as you want. shown as tags on the work page.
              </p>
            </div>
          </section>

          {/* ── Result metric (index card) ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Headline Result</h2>
            <p className="text-[#6F6A5F] text-xs -mt-3">single metric shown on the work-list card. the stat cards on the project page itself come from "Result Metrics" below.</p>
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

          {/* ── Result metrics (stat cards on the project page) ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Result Metrics</h2>
                <p className="text-[#6F6A5F] text-xs mt-1">the row of stat cards on the project page. each: a value (e.g. "3") and a label (e.g. "platforms shipped").</p>
              </div>
              <Button type="button" onClick={addMetric} className="bg-[#181612] text-[#F4F1EA] hover:bg-[#6B1421] gap-2">
                <Plus className="w-4 h-4" /> add metric
              </Button>
            </div>
            {project.metrics.length === 0 ? (
              <p className="text-[#6F6A5F] text-sm italic">no metrics yet.</p>
            ) : (
              <div className="space-y-3">
                {project.metrics.map((m, i) => (
                  <div key={i} className="rounded-md border border-[#181612]/15 bg-[#FBF9F3] p-4 flex gap-3 items-start">
                    <span className="text-[#6B1421] font-bold text-sm tabular-nums pt-2">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input value={m.value} onChange={(e) => updateMetric(i, "value", e.target.value)} placeholder="+312%" className={inputCls} />
                      <Input value={m.label} onChange={(e) => updateMetric(i, "label", e.target.value)} placeholder="organic traffic" className={inputCls} />
                    </div>
                    <button type="button" onClick={() => removeMetric(i)} className="text-[#181612]/40 hover:text-[#6B1421] self-center"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Process steps ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Process Steps</h2>
                <p className="text-[#6F6A5F] text-xs mt-1">the snaking "process journey" on the project page. each step: a title + short description, shown in order.</p>
              </div>
              <Button type="button" onClick={addStep} className="bg-[#181612] text-[#F4F1EA] hover:bg-[#6B1421] gap-2">
                <Plus className="w-4 h-4" /> add step
              </Button>
            </div>
            {project.processSteps.length === 0 ? (
              <p className="text-[#6F6A5F] text-sm italic">no steps yet. the journey is hidden until you add one.</p>
            ) : (
              <div className="space-y-4">
                {project.processSteps.map((s, i) => (
                  <div key={i} className="rounded-md border border-[#181612]/15 bg-[#FBF9F3] p-4 flex gap-4">
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <span className="text-[#6B1421] font-bold text-sm tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} className="text-[#181612]/50 hover:text-[#181612] disabled:opacity-25"><ChevronUp className="w-4 h-4" /></button>
                      <button type="button" onClick={() => moveStep(i, 1)} disabled={i === project.processSteps.length - 1} className="text-[#181612]/50 hover:text-[#181612] disabled:opacity-25"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input value={s.title} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="strategy" className={inputCls} />
                      <Textarea value={s.description} onChange={(e) => updateStep(i, "description", e.target.value)} placeholder="what happened in this step..." rows={2} className={inputCls} />
                    </div>
                    <button type="button" onClick={() => removeStep(i)} className="text-[#181612]/40 hover:text-[#6B1421] self-start pt-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Before / After ── */}
          <section className="space-y-5 border-t border-[#181612]/10 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C58A92]">Before / After</h2>
            <p className="text-[#6F6A5F] text-xs -mt-3">the two-column "where it started vs. where it landed" lists. one short phrase per line.</p>
            <div className="grid grid-cols-2 gap-5">
              {(["beforeStates", "afterStates"] as const).map((field) => (
                <div key={field} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#181612]">{field === "beforeStates" ? "Before" : "After"}</Label>
                    <Button type="button" onClick={() => addState(field)} variant="ghost" className="text-[#6B1421] hover:text-[#8C2331] h-7 px-2 gap-1 text-xs">
                      <Plus className="w-3 h-3" /> add
                    </Button>
                  </div>
                  {project[field].length === 0 ? (
                    <p className="text-[#6F6A5F] text-xs italic">none yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {project[field].map((s, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <Textarea value={s} onChange={(e) => updateState(field, i, e.target.value)} placeholder="short phrase..." rows={2} className={inputCls} />
                          <button type="button" onClick={() => removeState(field, i)} className="text-[#181612]/40 hover:text-[#6B1421] pt-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
