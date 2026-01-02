import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useLocation, useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Save, ArrowLeft, Eye, Plus, Trash2, Loader2, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Service } from "@shared/schema";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServiceEditor() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/admin/services/:id");
  const isNew = params?.id === "new";
  const serviceId = isNew ? null : params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    // Basic
    title: "",
    slug: "",
    shortDescription: "",
    iconName: "Briefcase",
    displayOrder: 0,
    isVisible: true,
    // Hero
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    ctaBookText: "Book a Call",
    ctaServiceText: "Learn More",
    // Diagnostic
    diagnosticTitle: "",
    diagnosticItems: [] as string[],
    promiseText: "",
    // What You Get
    whatYouGetTitle: "",
    whatYouGetDescription: "",
    whatYouGetItems: [] as { title: string; description: string }[],
    whatYouGetImages: [] as string[],
    // What to Expect
    whatToExpectItems: [] as string[],
    // Proof
    proofStat: "",
    proofText: "",
    proofProjectLink: "",
    proofProjectTitle: "",
    proofBeforeImage: "",
    proofAfterImage: "",
    // Next Steps
    nextSteps: [] as { title: string; description: string; bullets: string[] }[],
    // Final CTA
    finalCtaTitle: "",
    finalCtaSubtitle: "",
    finalCtaButtonText: "",
    finalCtaMicroProof: "",
  });

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ["/api/admin/services", serviceId],
    enabled: !!serviceId,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        slug: service.slug || "",
        shortDescription: service.shortDescription || "",
        iconName: service.iconName || "Briefcase",
        displayOrder: service.displayOrder || 0,
        isVisible: service.isVisible ?? true,
        heroTitle: service.heroTitle || "",
        heroSubtitle: service.heroSubtitle || "",
        heroDescription: service.heroDescription || "",
        ctaBookText: service.ctaBookText || "Book a Call",
        ctaServiceText: service.ctaServiceText || "Learn More",
        diagnosticTitle: service.diagnosticTitle || "",
        diagnosticItems: service.diagnosticItems || [],
        promiseText: service.promiseText || "",
        whatYouGetTitle: service.whatYouGetTitle || "",
        whatYouGetDescription: service.whatYouGetDescription || "",
        whatYouGetItems: service.whatYouGetItems || [],
        whatYouGetImages: (service as any).whatYouGetImages || [],
        whatToExpectItems: service.whatToExpectItems || [],
        proofStat: service.proofStat || "",
        proofText: service.proofText || "",
        proofProjectLink: service.proofProjectLink || "",
        proofProjectTitle: service.proofProjectTitle || "",
        proofBeforeImage: (service as any).proofBeforeImage || "",
        proofAfterImage: (service as any).proofAfterImage || "",
        nextSteps: service.nextSteps || [],
        finalCtaTitle: service.finalCtaTitle || "",
        finalCtaSubtitle: service.finalCtaSubtitle || "",
        finalCtaButtonText: service.finalCtaButtonText || "",
        finalCtaMicroProof: service.finalCtaMicroProof || "",
      });
    }
  }, [service]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Clean up empty items
      const cleanedData = {
        ...data,
        diagnosticItems: data.diagnosticItems.filter(item => item.trim() !== ""),
        whatYouGetItems: data.whatYouGetItems.filter(item => item.title.trim() !== ""),
        whatYouGetImages: data.whatYouGetImages.filter(url => url.trim() !== ""),
        whatToExpectItems: data.whatToExpectItems.filter(item => item.trim() !== ""),
        nextSteps: data.nextSteps.filter(step => step.title.trim() !== "").map(step => ({
          ...step,
          bullets: step.bullets.filter(b => b.trim() !== "")
        })),
      };

      if (serviceId) {
        return await apiRequest("PUT", `/api/admin/services/${serviceId}`, cleanedData);
      } else {
        return await apiRequest("POST", "/api/admin/services", cleanedData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({
        title: isNew ? "Service created" : "Service updated",
        description: "Your changes have been saved.",
      });
      if (isNew) {
        navigate("/admin/services");
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save service.",
        variant: "destructive",
      });
    },
  });

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  if (isLoading && serviceId) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#4D00FF]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNew ? "New Service" : `Edit: ${formData.title}`}>
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/services")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
        <div className="flex gap-2">
          {formData.slug && !isNew && (
            <Button
              variant="outline"
              onClick={() => window.open(`/services/${formData.slug}`, "_blank")}
              className="border-gray-700 text-gray-400 hover:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          <Button
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending || !formData.title || !formData.slug}
            className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="bg-[#0D0D0D] border border-gray-800 p-1">
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
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Service title"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="service-url-slug"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Short Description</Label>
                <Textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for listings"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Display Order</Label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  className="bg-gray-800 border-gray-700 text-white w-24"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isVisible: checked }))}
                />
                <Label className="text-gray-400">Visible on site</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Hero Title</Label>
                <Input
                  value={formData.heroTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="Main headline"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Hero Subtitle</Label>
                <Input
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                  placeholder="Subtitle text"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Hero Description</Label>
                <Textarea
                  value={formData.heroDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heroDescription: e.target.value }))}
                  placeholder="Detailed description"
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Book CTA Text</Label>
                  <Input
                    value={formData.ctaBookText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ctaBookText: e.target.value }))}
                    placeholder="Book a Call"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Service CTA Text</Label>
                  <Input
                    value={formData.ctaServiceText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ctaServiceText: e.target.value }))}
                    placeholder="Learn More"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnostic Tab */}
        <TabsContent value="diagnostic">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Diagnostic Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Section Title</Label>
                <Input
                  value={formData.diagnosticTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diagnosticTitle: e.target.value }))}
                  placeholder="e.g., Does this sound familiar?"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Checkbox Items</Label>
                {formData.diagnosticItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...formData.diagnosticItems];
                        newItems[index] = e.target.value;
                        setFormData((prev) => ({ ...prev, diagnosticItems: newItems }));
                      }}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = formData.diagnosticItems.filter((_, i) => i !== index);
                        setFormData((prev) => ({ ...prev, diagnosticItems: newItems }));
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData((prev) => ({ ...prev, diagnosticItems: [...prev.diagnosticItems, ""] }))}
                  className="mt-2 border-gray-700 text-gray-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div>
                <Label className="text-gray-400">Promise Text</Label>
                <Textarea
                  value={formData.promiseText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, promiseText: e.target.value }))}
                  placeholder="What you promise to deliver"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* What You Get Tab */}
        <TabsContent value="whatyouget">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">What You Get Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-400">Section Title</Label>
                <Input
                  value={formData.whatYouGetTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, whatYouGetTitle: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Section Description</Label>
                <Textarea
                  value={formData.whatYouGetDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, whatYouGetDescription: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Items</Label>
                {formData.whatYouGetItems.map((item, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4 mt-2 space-y-2">
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...formData.whatYouGetItems];
                        newItems[index] = { ...newItems[index], title: e.target.value };
                        setFormData((prev) => ({ ...prev, whatYouGetItems: newItems }));
                      }}
                      placeholder="Item title"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...formData.whatYouGetItems];
                        newItems[index] = { ...newItems[index], description: e.target.value };
                        setFormData((prev) => ({ ...prev, whatYouGetItems: newItems }));
                      }}
                      placeholder="Item description"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newItems = formData.whatYouGetItems.filter((_, i) => i !== index);
                        setFormData((prev) => ({ ...prev, whatYouGetItems: newItems }));
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData((prev) => ({ 
                    ...prev, 
                    whatYouGetItems: [...prev.whatYouGetItems, { title: "", description: "" }] 
                  }))}
                  className="mt-2 border-gray-700 text-gray-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Image Grid Section */}
              <div className="border-t border-gray-700 pt-6">
                <Label className="text-gray-400 flex items-center gap-2 mb-3">
                  <Image className="w-4 h-4" />
                  Image Grid (Screenshots/Visuals)
                </Label>
                <p className="text-gray-500 text-sm mb-4">
                  Upload images to Media Library first, then paste URLs here.
                </p>
                {formData.whatYouGetImages.map((url, index) => (
                  <div key={index} className="flex gap-2 mt-2 items-start">
                    <div className="flex-1">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const newImages = [...formData.whatYouGetImages];
                          newImages[index] = e.target.value;
                          setFormData((prev) => ({ ...prev, whatYouGetImages: newImages }));
                        }}
                        placeholder="https://res.cloudinary.com/..."
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      {url && (
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="mt-2 w-32 h-20 object-cover rounded border border-gray-700"
                        />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newImages = formData.whatYouGetImages.filter((_, i) => i !== index);
                        setFormData((prev) => ({ ...prev, whatYouGetImages: newImages }));
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData((prev) => ({ 
                    ...prev, 
                    whatYouGetImages: [...prev.whatYouGetImages, ""] 
                  }))}
                  className="mt-2 border-gray-700 text-gray-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* What to Expect Tab */}
        <TabsContent value="expect">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">What to Expect Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Timeline/Process Items</Label>
                {formData.whatToExpectItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...formData.whatToExpectItems];
                        newItems[index] = e.target.value;
                        setFormData((prev) => ({ ...prev, whatToExpectItems: newItems }));
                      }}
                      placeholder={`Step ${index + 1}`}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = formData.whatToExpectItems.filter((_, i) => i !== index);
                        setFormData((prev) => ({ ...prev, whatToExpectItems: newItems }));
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData((prev) => ({ ...prev, whatToExpectItems: [...prev.whatToExpectItems, ""] }))}
                  className="mt-2 border-gray-700 text-gray-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Proof Tab */}
        <TabsContent value="proof">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Proof Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Stat Number</Label>
                  <Input
                    value={formData.proofStat}
                    onChange={(e) => setFormData((prev) => ({ ...prev, proofStat: e.target.value }))}
                    placeholder="e.g., +450%"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Stat Text</Label>
                  <Input
                    value={formData.proofText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, proofText: e.target.value }))}
                    placeholder="e.g., Traffic"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Case Study Link</Label>
                <Input
                  value={formData.proofProjectLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, proofProjectLink: e.target.value }))}
                  placeholder="/projects/case-study-slug"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Case Study Title</Label>
                <Input
                  value={formData.proofProjectTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, proofProjectTitle: e.target.value }))}
                  placeholder="View Case Study: TechFlow SaaS"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Before/After Images Section */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <Label className="text-gray-400 flex items-center gap-2 mb-3">
                  <Image className="w-4 h-4" />
                  Before/After Comparison Images
                </Label>
                <p className="text-gray-500 text-sm mb-4">
                  Upload images to Media Library first, then paste URLs here.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500 text-sm">Before Image URL</Label>
                    <Input
                      value={formData.proofBeforeImage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, proofBeforeImage: e.target.value }))}
                      placeholder="https://res.cloudinary.com/..."
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    {formData.proofBeforeImage && (
                      <img 
                        src={formData.proofBeforeImage} 
                        alt="Before preview" 
                        className="mt-2 w-full h-32 object-cover rounded border border-gray-700"
                      />
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-500 text-sm">After Image URL</Label>
                    <Input
                      value={formData.proofAfterImage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, proofAfterImage: e.target.value }))}
                      placeholder="https://res.cloudinary.com/..."
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    {formData.proofAfterImage && (
                      <img 
                        src={formData.proofAfterImage} 
                        alt="After preview" 
                        className="mt-2 w-full h-32 object-cover rounded border border-gray-700"
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Next Steps Tab */}
        <TabsContent value="nextsteps">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Next Steps Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.nextSteps.map((step, stepIndex) => (
                <div key={stepIndex} className="border border-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-white font-medium">Step {stepIndex + 1}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSteps = formData.nextSteps.filter((_, i) => i !== stepIndex);
                        setFormData((prev) => ({ ...prev, nextSteps: newSteps }));
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...formData.nextSteps];
                      newSteps[stepIndex] = { ...newSteps[stepIndex], title: e.target.value };
                      setFormData((prev) => ({ ...prev, nextSteps: newSteps }));
                    }}
                    placeholder="Step title"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Textarea
                    value={step.description}
                    onChange={(e) => {
                      const newSteps = [...formData.nextSteps];
                      newSteps[stepIndex] = { ...newSteps[stepIndex], description: e.target.value };
                      setFormData((prev) => ({ ...prev, nextSteps: newSteps }));
                    }}
                    placeholder="Step description"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <div>
                    <Label className="text-gray-400 text-sm">Bullet Points</Label>
                    {step.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2 mt-1">
                        <Input
                          value={bullet}
                          onChange={(e) => {
                            const newSteps = [...formData.nextSteps];
                            const newBullets = [...newSteps[stepIndex].bullets];
                            newBullets[bulletIndex] = e.target.value;
                            newSteps[stepIndex] = { ...newSteps[stepIndex], bullets: newBullets };
                            setFormData((prev) => ({ ...prev, nextSteps: newSteps }));
                          }}
                          className="bg-gray-800 border-gray-700 text-white text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newSteps = [...formData.nextSteps];
                            const newBullets = step.bullets.filter((_, i) => i !== bulletIndex);
                            newSteps[stepIndex] = { ...newSteps[stepIndex], bullets: newBullets };
                            setFormData((prev) => ({ ...prev, nextSteps: newSteps }));
                          }}
                          className="text-red-400 hover:text-red-300 h-8 w-8"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSteps = [...formData.nextSteps];
                        newSteps[stepIndex] = { 
                          ...newSteps[stepIndex], 
                          bullets: [...newSteps[stepIndex].bullets, ""] 
                        };
                        setFormData((prev) => ({ ...prev, nextSteps: newSteps }));
                      }}
                      className="mt-1 text-gray-400 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Bullet
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setFormData((prev) => ({ 
                  ...prev, 
                  nextSteps: [...prev.nextSteps, { title: "", description: "", bullets: [] }] 
                }))}
                className="border-gray-700 text-gray-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final CTA Tab */}
        <TabsContent value="finalcta">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Final CTA Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Title</Label>
                <Input
                  value={formData.finalCtaTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, finalCtaTitle: e.target.value }))}
                  placeholder="Ready to get started?"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Subtitle</Label>
                <Input
                  value={formData.finalCtaSubtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, finalCtaSubtitle: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Button Text</Label>
                <Input
                  value={formData.finalCtaButtonText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, finalCtaButtonText: e.target.value }))}
                  placeholder="Book a Call"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Micro-proof Text</Label>
                <Input
                  value={formData.finalCtaMicroProof}
                  onChange={(e) => setFormData((prev) => ({ ...prev, finalCtaMicroProof: e.target.value }))}
                  placeholder="e.g., Join 50+ founders scaling with organic search"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}