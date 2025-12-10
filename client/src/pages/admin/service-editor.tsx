import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft, Search, BarChart3, Users, Layout, TrendingUp, Briefcase, Rocket, Target, Zap, Settings, Globe, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Service } from "@shared/schema";
import { Link, useParams, useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const iconOptions = [
  { name: "Search", icon: Search },
  { name: "BarChart3", icon: BarChart3 },
  { name: "Users", icon: Users },
  { name: "Layout", icon: Layout },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Briefcase", icon: Briefcase },
  { name: "Rocket", icon: Rocket },
  { name: "Target", icon: Target },
  { name: "Zap", icon: Zap },
  { name: "Settings", icon: Settings },
  { name: "Globe", icon: Globe },
  { name: "Code", icon: Code },
];

const iconMap: Record<string, any> = {
  Search, BarChart3, Users, Layout, TrendingUp, Briefcase, Rocket, Target, Zap, Settings, Globe, Code
};

interface ServiceFormData {
  // Basic
  title: string;
  slug: string;
  shortDescription: string;
  iconName: string;
  displayOrder: number;
  isVisible: boolean;
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  ctaBookText: string;
  ctaServiceText: string;
  // Diagnostic
  diagnosticTitle: string;
  diagnosticItems: string[];
  // Promise
  promiseText: string;
  // What You Get
  whatYouGetTitle: string;
  whatYouGetDescription: string;
  whatYouGetItems: { title: string; desc: string }[];
  // What to Expect
  whatToExpectItems: string[];
  // Proof
  proofStat: string;
  proofText: string;
  proofProjectLink: string;
  proofProjectTitle: string;
  // Next Steps
  nextSteps: { title: string; desc: string; bullets: string[] }[];
  // Final CTA
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalCtaButtonText: string;
  finalCtaMicroProof: string;
}

const defaultFormData: ServiceFormData = {
  title: "",
  slug: "",
  shortDescription: "",
  iconName: "Search",
  displayOrder: 0,
  isVisible: true,
  heroTitle: "",
  heroSubtitle: "",
  heroDescription: "",
  ctaBookText: "Book a Free Consultation",
  ctaServiceText: "Start Digging",
  diagnosticTitle: "Is this for you?",
  diagnosticItems: [""],
  promiseText: "",
  whatYouGetTitle: "What you'll get",
  whatYouGetDescription: "",
  whatYouGetItems: [{ title: "", desc: "" }],
  whatToExpectItems: [""],
  proofStat: "",
  proofText: "",
  proofProjectLink: "",
  proofProjectTitle: "",
  nextSteps: [{ title: "", desc: "", bullets: [""] }],
  finalCtaTitle: "",
  finalCtaSubtitle: "",
  finalCtaButtonText: "Book Your Strategy Call",
  finalCtaMicroProof: "",
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServiceEditor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = id && id !== "new";

  const [formData, setFormData] = useState<ServiceFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState("basic");

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ["/api/admin/services", id],
    enabled: isEditing,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        slug: service.slug || "",
        shortDescription: service.shortDescription || "",
        iconName: service.iconName || "Search",
        displayOrder: service.displayOrder || 0,
        isVisible: service.isVisible ?? true,
        heroTitle: service.heroTitle || "",
        heroSubtitle: service.heroSubtitle || "",
        heroDescription: service.heroDescription || "",
        ctaBookText: service.ctaBookText || "Book a Free Consultation",
        ctaServiceText: service.ctaServiceText || "Start Digging",
        diagnosticTitle: service.diagnosticTitle || "Is this for you?",
        diagnosticItems: service.diagnosticItems?.length ? service.diagnosticItems : [""],
        promiseText: service.promiseText || "",
        whatYouGetTitle: service.whatYouGetTitle || "What you'll get",
        whatYouGetDescription: service.whatYouGetDescription || "",
        whatYouGetItems: (service.whatYouGetItems as any)?.length ? service.whatYouGetItems as any : [{ title: "", desc: "" }],
        whatToExpectItems: service.whatToExpectItems?.length ? service.whatToExpectItems : [""],
        proofStat: service.proofStat || "",
        proofText: service.proofText || "",
        proofProjectLink: service.proofProjectLink || "",
        proofProjectTitle: service.proofProjectTitle || "",
        nextSteps: (service.nextSteps as any)?.length ? service.nextSteps as any : [{ title: "", desc: "", bullets: [""] }],
        finalCtaTitle: service.finalCtaTitle || "",
        finalCtaSubtitle: service.finalCtaSubtitle || "",
        finalCtaButtonText: service.finalCtaButtonText || "Book Your Strategy Call",
        finalCtaMicroProof: service.finalCtaMicroProof || "",
      });
    }
  }, [service]);

  const saveMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      // Clean up empty items
      const cleanedData = {
        ...data,
        diagnosticItems: data.diagnosticItems.filter(item => item.trim() !== ""),
        whatYouGetItems: data.whatYouGetItems.filter(item => item.title.trim() !== "" || item.desc.trim() !== ""),
        whatToExpectItems: data.whatToExpectItems.filter(item => item.trim() !== ""),
        nextSteps: data.nextSteps.filter(step => step.title.trim() !== "").map(step => ({
          ...step,
          bullets: step.bullets.filter(b => b.trim() !== "")
        })),
      };

      if (isEditing) {
        return await apiRequest("PUT", `/api/admin/services/${id}`, cleanedData);
      } else {
        return await apiRequest("POST", "/api/admin/services", cleanedData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: isEditing ? "Service updated" : "Service created" });
      setLocation("/admin/services");
    },
    onError: () => {
      toast({ title: "Failed to save service", variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.slug) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug,
      heroTitle: !prev.heroTitle ? title : prev.heroTitle,
    }));
  };

  // Array field helpers
  const addDiagnosticItem = () => {
    setFormData(prev => ({ ...prev, diagnosticItems: [...prev.diagnosticItems, ""] }));
  };

  const removeDiagnosticItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      diagnosticItems: prev.diagnosticItems.filter((_, i) => i !== index)
    }));
  };

  const updateDiagnosticItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      diagnosticItems: prev.diagnosticItems.map((item, i) => i === index ? value : item)
    }));
  };

  const addWhatYouGetItem = () => {
    setFormData(prev => ({ ...prev, whatYouGetItems: [...prev.whatYouGetItems, { title: "", desc: "" }] }));
  };

  const removeWhatYouGetItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      whatYouGetItems: prev.whatYouGetItems.filter((_, i) => i !== index)
    }));
  };

  const updateWhatYouGetItem = (index: number, field: "title" | "desc", value: string) => {
    setFormData(prev => ({
      ...prev,
      whatYouGetItems: prev.whatYouGetItems.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const addWhatToExpectItem = () => {
    setFormData(prev => ({ ...prev, whatToExpectItems: [...prev.whatToExpectItems, ""] }));
  };

  const removeWhatToExpectItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      whatToExpectItems: prev.whatToExpectItems.filter((_, i) => i !== index)
    }));
  };

  const updateWhatToExpectItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      whatToExpectItems: prev.whatToExpectItems.map((item, i) => i === index ? value : item)
    }));
  };

  const addNextStep = () => {
    setFormData(prev => ({ ...prev, nextSteps: [...prev.nextSteps, { title: "", desc: "", bullets: [""] }] }));
  };

  const removeNextStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.filter((_, i) => i !== index)
    }));
  };

  const updateNextStep = (index: number, field: "title" | "desc", value: string) => {
    setFormData(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.map((step, i) => i === index ? { ...step, [field]: value } : step)
    }));
  };

  const addNextStepBullet = (stepIndex: number) => {
    setFormData(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.map((step, i) => i === stepIndex ? { ...step, bullets: [...step.bullets, ""] } : step)
    }));
  };

  const removeNextStepBullet = (stepIndex: number, bulletIndex: number) => {
    setFormData(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.map((step, i) => i === stepIndex ? { ...step, bullets: step.bullets.filter((_, bi) => bi !== bulletIndex) } : step)
    }));
  };

  const updateNextStepBullet = (stepIndex: number, bulletIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.map((step, i) => i === stepIndex ? { ...step, bullets: step.bullets.map((b, bi) => bi === bulletIndex ? value : b) } : step)
    }));
  };

  if (isLoading && isEditing) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D00FF]"></div>
        </div>
      </AdminLayout>
    );
  }

  const IconComponent = iconMap[formData.iconName] || Search;

  return (
    <AdminLayout title={isEditing ? `Edit: ${formData.title}` : "New Service"}>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/services" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Link>
        <div className="flex gap-2">
          {isEditing && formData.slug && (
            <Button variant="outline" asChild>
              <a href={`/services/${formData.slug}`} target="_blank" rel="noopener noreferrer">
                Preview
              </a>
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={saveMutation.isPending} className="bg-[#4D00FF] hover:bg-[#4D00FF]/80">
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#1a1a1a] border border-gray-800 p-1">
          <TabsTrigger value="basic" className="data-[state=active]:bg-[#4D00FF]">Basic</TabsTrigger>
          <TabsTrigger value="hero" className="data-[state=active]:bg-[#4D00FF]">Hero</TabsTrigger>
          <TabsTrigger value="diagnostic" className="data-[state=active]:bg-[#4D00FF]">Diagnostic</TabsTrigger>
          <TabsTrigger value="whatyouget" className="data-[state=active]:bg-[#4D00FF]">What You Get</TabsTrigger>
          <TabsTrigger value="expect" className="data-[state=active]:bg-[#4D00FF]">What to Expect</TabsTrigger>
          <TabsTrigger value="proof" className="data-[state=active]:bg-[#4D00FF]">Proof</TabsTrigger>
          <TabsTrigger value="nextsteps" className="data-[state=active]:bg-[#4D00FF]">Next Steps</TabsTrigger>
          <TabsTrigger value="finalcta" className="data-[state=active]:bg-[#4D00FF]">Final CTA</TabsTrigger>
        </TabsList>

        {/* Basic Tab */}
        <TabsContent value="basic">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Service Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="SEO & Organic Growth"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">URL Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="seo"
                  />
                  <p className="text-gray-500 text-xs mt-1">/services/{formData.slug || "slug"}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Short Description (for cards on homepage)</Label>
                <Textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Comprehensive audit of your technical foundation, content gaps, and opportunity landscape."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Icon</Label>
                  <Select value={formData.iconName} onValueChange={(v) => setFormData(prev => ({ ...prev, iconName: v }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {formData.iconName}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {iconOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <SelectItem key={opt.name} value={opt.name} className="text-white">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {opt.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Display Order</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
                  />
                  <Label className="text-gray-300">Visible</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Hero Title</Label>
                <Input
                  value={formData.heroTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroTitle: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="SEO & Organic Growth"
                />
              </div>
              <div>
                <Label className="text-gray-300">Hero Subtitle</Label>
                <Input
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Get found. Get traffic. Get revenue."
                />
              </div>
              <div>
                <Label className="text-gray-300">Hero Description</Label>
                <Textarea
                  value={formData.heroDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroDescription: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                  placeholder="I help brands build sustainable organic growth engines..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">CTA Button 1 Text</Label>
                  <Input
                    value={formData.ctaBookText}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaBookText: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Book a Free Consultation"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">CTA Button 2 Text</Label>
                  <Input
                    value={formData.ctaServiceText}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaServiceText: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Start Digging"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnostic Tab */}
        <TabsContent value="diagnostic">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Diagnostic Section ("Is this for you?")
                <Button size="sm" onClick={addDiagnosticItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Section Title</Label>
                <Input
                  value={formData.diagnosticTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosticTitle: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Is this for you?"
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block">Diagnostic Items (checkbox items)</Label>
                {formData.diagnosticItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={item}
                      onChange={(e) => updateDiagnosticItem(index, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                      placeholder="You're getting traffic but not conversions..."
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeDiagnosticItem(index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-gray-300">Promise Text (after checkboxes)</Label>
                <Textarea
                  value={formData.promiseText}
                  onChange={(e) => setFormData(prev => ({ ...prev, promiseText: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={2}
                  placeholder="If you checked even one of these, we should talk."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* What You Get Tab */}
        <TabsContent value="whatyouget">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                What You Get Section
                <Button size="sm" onClick={addWhatYouGetItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Section Title</Label>
                <Input
                  value={formData.whatYouGetTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatYouGetTitle: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="What you'll get"
                />
              </div>
              <div>
                <Label className="text-gray-300">Section Description</Label>
                <Textarea
                  value={formData.whatYouGetDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatYouGetDescription: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={2}
                  placeholder="A complete roadmap to organic growth..."
                />
              </div>
              <div>
                <Label className="text-gray-300 mb-2 block">Items</Label>
                {formData.whatYouGetItems.map((item, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4 mb-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Item {index + 1}</span>
                      <Button size="icon" variant="ghost" onClick={() => removeWhatYouGetItem(index)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <div>
                      <Label className="text-gray-300">Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateWhatYouGetItem(index, "title", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Technical SEO Audit"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={item.desc}
                        onChange={(e) => updateWhatYouGetItem(index, "desc", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        rows={2}
                        placeholder="Deep dive into your site's technical health..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* What to Expect Tab */}
        <TabsContent value="expect">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                What to Expect Section
                <Button size="sm" onClick={addWhatToExpectItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300 mb-2 block">Expectation Items (timeline/process items)</Label>
                {formData.whatToExpectItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={item}
                      onChange={(e) => updateWhatToExpectItem(index, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                      placeholder="Week 1-2: Discovery & Audit"
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeWhatToExpectItem(index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proof Tab */}
        <TabsContent value="proof">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Proof Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Stat (e.g., "400%")</Label>
                  <Input
                    value={formData.proofStat}
                    onChange={(e) => setFormData(prev => ({ ...prev, proofStat: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="400%"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Stat Description</Label>
                  <Input
                    value={formData.proofText}
                    onChange={(e) => setFormData(prev => ({ ...prev, proofText: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="average traffic increase"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Case Study Project Link</Label>
                  <Input
                    value={formData.proofProjectLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, proofProjectLink: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="/projects/project-slug"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Case Study Title</Label>
                  <Input
                    value={formData.proofProjectTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, proofProjectTitle: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="View Case Study: TravelEgypt"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Next Steps Tab */}
        <TabsContent value="nextsteps">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Next Steps Section
                <Button size="sm" onClick={addNextStep}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.nextSteps.map((step, stepIndex) => (
                <div key={stepIndex} className="border border-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Step {stepIndex + 1}</span>
                    <Button size="icon" variant="ghost" onClick={() => removeNextStep(stepIndex)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={step.title}
                      onChange={(e) => updateNextStep(stepIndex, "title", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Book a Discovery Call"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      value={step.desc}
                      onChange={(e) => updateNextStep(stepIndex, "desc", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={2}
                      placeholder="We'll discuss your goals and challenges..."
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-gray-300">Bullet Points</Label>
                      <Button size="sm" variant="outline" onClick={() => addNextStepBullet(stepIndex)}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add Bullet
                      </Button>
                    </div>
                    {step.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2 mb-2">
                        <Input
                          value={bullet}
                          onChange={(e) => updateNextStepBullet(stepIndex, bulletIndex, e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white flex-1"
                          placeholder="15-minute intro call"
                        />
                        <Button size="icon" variant="ghost" onClick={() => removeNextStepBullet(stepIndex, bulletIndex)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final CTA Tab */}
        <TabsContent value="finalcta">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Final Call to Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">CTA Title</Label>
                <Input
                  value={formData.finalCtaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, finalCtaTitle: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Ready to grow your organic traffic?"
                />
              </div>
              <div>
                <Label className="text-gray-300">CTA Subtitle</Label>
                <Textarea
                  value={formData.finalCtaSubtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, finalCtaSubtitle: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={2}
                  placeholder="Let's build your organic growth engine together."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Button Text</Label>
                  <Input
                    value={formData.finalCtaButtonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, finalCtaButtonText: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Book Your Strategy Call"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Micro Proof Text</Label>
                  <Input
                    value={formData.finalCtaMicroProof}
                    onChange={(e) => setFormData(prev => ({ ...prev, finalCtaMicroProof: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Join 50+ brands already growing"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}