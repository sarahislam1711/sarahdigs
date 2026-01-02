import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, Plus, Trash2, FileText, Sparkles, Brain, LineChart, Mail, Zap, BookOpen, MessageSquare, AlertCircle, Home, LayoutList, CheckCircle, HelpCircle, ListOrdered, Briefcase, User, Image } from "lucide-react";
import type { PageContent } from "@shared/schema";

const VALID_ICONS = ["Sparkles", "Brain", "LineChart", "Mail", "Zap", "BookOpen", "MessageSquare", "FileText"] as const;
const VALID_COLORS = ["bg-[#1B1B1B]", "bg-[#4D00FF]", "bg-[#F4F2FF] text-[#1B1B1B] border-[#1B1B1B]/10"] as const;

// ============ HOME PAGE EDITOR ============

interface HomeHeroContent {
  rotatingWords: string[];
  description: string;
  ctaText: string;
  backgroundImage?: string;
}

interface HomeProblemsContent {
  title: string;
  items: string[];
}

interface HomeSolutionContent {
  title: string;
  description: string;
  benefits: string[];
}

interface HomeWhyMeContent {
  sectionLabel: string;
  headline: string;
  features: { title: string; description: string }[];
}

interface HomeContactContent {
  email: string;
  phone: string;
  socialLinks: { platform: string; url: string }[];
  headline?: string;
  description?: string;
}

interface HomeProcessContent {
  headline: string;
  subtitle: string;
}

interface HomeServicesContent {
  headline: string;
  subtitle: string;
}

function HomePageEditor() {
  const { toast } = useToast();
  
  const { data: pageContent = [], isLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/admin/page-content", "home"],
    queryFn: async () => {
      const res = await fetch("/api/admin/page-content/home", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const getSection = (key: string) => {
    const section = pageContent.find(p => p.sectionKey === key);
    return section?.content || null;
  };

  const [heroContent, setHeroContent] = useState<HomeHeroContent>({
    rotatingWords: ["goals", "users", "data", "market", "product"],
    description: "I help brands find the hidden gold in their analytics, content, and user journeys. No fluff, just deep excavation for growth.",
    ctaText: "Start Digging",
    backgroundImage: "",
  });

  const [problemsContent, setProblemsContent] = useState<HomeProblemsContent>({
    title: "Does this sound familiar?",
    items: [
      "You're drowning in data but starving for actionable insights.",
      "Your traffic is growing, but your revenue remains flat.",
      "You're creating content that no one seems to be finding or reading.",
      "Technical SEO feels like a black box you can't unlock.",
      "You're guessing at strategy instead of following a roadmap.",
    ],
  });

  const [solutionContent, setSolutionContent] = useState<HomeSolutionContent>({
    title: "Stop guessing. Start growing.",
    description: "I turn chaotic data into a clear, actionable growth engine. No fluff, just results-driven strategy that bridges the gap between technical execution and brand storytelling.",
    benefits: [
      "Clear, prioritized roadmaps backed by data",
      "High-intent traffic that actually converts",
      "Technical foundation built for scale",
      "Content strategy that drives real revenue",
    ],
  });

  const [whyMeContent, setWhyMeContent] = useState<HomeWhyMeContent>({
    sectionLabel: "WHY SARAHDIGS?",
    headline: "Most consultants skim the surface. I bring a shovel.",
    features: [
      { title: "Data-First Approach", description: "I don't guess. Every recommendation is backed by hard data and user behavior analysis. If the numbers don't support it, we don't do it." },
      { title: "Technical + Creative", description: "I speak both developer and designer. I bridge the gap between technical SEO requirements and engaging brand storytelling." },
      { title: "Actionable Strategy", description: "No 50-page PDFs that gather dust. You get a prioritized roadmap with clear steps, expected impact, and measurable KPIs." },
    ],
  });

  const [contactContent, setContactContent] = useState<HomeContactContent>({
    email: "hello@sarahdigs.com",
    phone: "+1 (555) 000-0000",
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
  });

  const [processContent, setProcessContent] = useState<HomeProcessContent>({
    headline: "How it works",
    subtitle: "A structured approach to uncovering value and driving growth.",
  });

  const [servicesContent, setServicesContent] = useState<HomeServicesContent>({
    headline: "Where do you wanna dig?",
    subtitle: "I don't just scratch the surface. I excavate the insight.",
  });

  useEffect(() => {
    if (pageContent.length > 0) {
      const hero = getSection("hero") as HomeHeroContent | null;
      const problems = getSection("problems") as HomeProblemsContent | null;
      const solution = getSection("solution") as HomeSolutionContent | null;
      const whyMe = getSection("whyMe") as HomeWhyMeContent | null;
      const contact = getSection("contact") as HomeContactContent | null;
      const process = getSection("process") as HomeProcessContent | null;
      const services = getSection("services") as HomeServicesContent | null;
      
      if (hero) setHeroContent(hero);
      if (problems) setProblemsContent(problems);
      if (solution) setSolutionContent(solution);
      if (whyMe) setWhyMeContent(whyMe);
      if (contact) setContactContent(contact);
      if (process) setProcessContent(process);
      if (services) setServicesContent(services);
    }
  }, [pageContent]);

  const saveMutation = useMutation({
    mutationFn: async (data: { pageSlug: string; sectionKey: string; content: unknown }) => {
      return await apiRequest("PUT", "/api/admin/page-content", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-content", "home"] });
      queryClient.invalidateQueries({ queryKey: ["/api/page-content", "home"] });
      toast({ title: "Content saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save content", variant: "destructive" });
    },
  });

  const saveHero = () => saveMutation.mutate({ pageSlug: "home", sectionKey: "hero", content: heroContent });
  const saveProblems = () => saveMutation.mutate({ pageSlug: "home", sectionKey: "problems", content: problemsContent });
  const saveSolution = () => saveMutation.mutate({ pageSlug: "home", sectionKey: "solution", content: solutionContent });
  const saveWhyMe = () => saveMutation.mutate({ pageSlug: "home", sectionKey: "whyMe", content: whyMeContent });
  const saveContact = () => saveMutation.mutate({ pageSlug: "home", sectionKey: "contact", content: contactContent });
  const saveProcess = () => saveMutation.mutate({ pageSlug: "home", sectionKey: "process", content: processContent });
  const saveServices = () => saveMutation.mutate({ pageSlug: "home", sectionKey: "services", content: servicesContent });

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Home className="w-5 h-5" />
            Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Rotating Words (comma-separated)</Label>
            <Input
              value={heroContent.rotatingWords.join(", ")}
              onChange={(e) => setHeroContent({ 
                ...heroContent, 
                rotatingWords: e.target.value.split(",").map(w => w.trim()).filter(Boolean)
              })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={heroContent.description}
              onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-gray-300">CTA Button Text</Label>
            <Input
              value={heroContent.ctaText}
              onChange={(e) => setHeroContent({ ...heroContent, ctaText: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          {/* Hero Background Image */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <Label className="text-gray-300 flex items-center gap-2 mb-2">
              <Image className="w-4 h-4" />
              Hero Background Image
            </Label>
            <Input
              value={heroContent.backgroundImage || ""}
              onChange={(e) => setHeroContent({ ...heroContent, backgroundImage: e.target.value })}
              placeholder="https://res.cloudinary.com/..."
              className="bg-gray-800 border-gray-700 text-white"
            />
            {heroContent.backgroundImage && (
              <img 
                src={heroContent.backgroundImage} 
                alt="Hero background preview" 
                className="mt-2 w-full h-32 object-cover rounded border border-gray-700"
              />
            )}
            <p className="text-gray-500 text-xs mt-1">Upload to Media Library first, then paste URL here</p>
          </div>
          
          <Button onClick={saveHero} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Hero
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Problems Section
            </span>
            <Button size="sm" onClick={() => setProblemsContent({ ...problemsContent, items: [...problemsContent.items, ""] })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Problem
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Section Title</Label>
            <Input
              value={problemsContent.title}
              onChange={(e) => setProblemsContent({ ...problemsContent, title: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {problemsContent.items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...problemsContent.items];
                  newItems[index] = e.target.value;
                  setProblemsContent({ ...problemsContent, items: newItems });
                }}
                className="bg-gray-800 border-gray-700 text-white flex-1"
              />
              <Button size="icon" variant="ghost" onClick={() => {
                const newItems = problemsContent.items.filter((_, i) => i !== index);
                setProblemsContent({ ...problemsContent, items: newItems });
              }}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button onClick={saveProblems} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Problems
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Solution Section
            </span>
            <Button size="sm" onClick={() => setSolutionContent({ ...solutionContent, benefits: [...solutionContent.benefits, ""] })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Benefit
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Title</Label>
            <Input
              value={solutionContent.title}
              onChange={(e) => setSolutionContent({ ...solutionContent, title: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={solutionContent.description}
              onChange={(e) => setSolutionContent({ ...solutionContent, description: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
          {solutionContent.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={benefit}
                onChange={(e) => {
                  const newBenefits = [...solutionContent.benefits];
                  newBenefits[index] = e.target.value;
                  setSolutionContent({ ...solutionContent, benefits: newBenefits });
                }}
                className="bg-gray-800 border-gray-700 text-white flex-1"
              />
              <Button size="icon" variant="ghost" onClick={() => {
                const newBenefits = solutionContent.benefits.filter((_, i) => i !== index);
                setSolutionContent({ ...solutionContent, benefits: newBenefits });
              }}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button onClick={saveSolution} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Solution
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ListOrdered className="w-5 h-5" />
            Process Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Headline</Label>
            <Input
              value={processContent.headline}
              onChange={(e) => setProcessContent({ ...processContent, headline: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Subtitle</Label>
            <Input
              value={processContent.subtitle}
              onChange={(e) => setProcessContent({ ...processContent, subtitle: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button onClick={saveProcess} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Process
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Services Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Headline</Label>
            <Input
              value={servicesContent.headline}
              onChange={(e) => setServicesContent({ ...servicesContent, headline: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Subtitle</Label>
            <Input
              value={servicesContent.subtitle}
              onChange={(e) => setServicesContent({ ...servicesContent, subtitle: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button onClick={saveServices} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Services
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Why Me Section
            </span>
            <Button size="sm" onClick={() => setWhyMeContent({ ...whyMeContent, features: [...(whyMeContent.features || []), { title: "", description: "" }] })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Section Label</Label>
            <Input
              value={whyMeContent.sectionLabel}
              onChange={(e) => setWhyMeContent({ ...whyMeContent, sectionLabel: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Headline</Label>
            <Input
              value={whyMeContent.headline}
              onChange={(e) => setWhyMeContent({ ...whyMeContent, headline: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {(whyMeContent.features || []).map((feature, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Feature {index + 1}</span>
                <Button size="icon" variant="ghost" onClick={() => {
                  const newFeatures = whyMeContent.features.filter((_, i) => i !== index);
                  setWhyMeContent({ ...whyMeContent, features: newFeatures });
                }}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <Input
                value={feature.title}
                onChange={(e) => {
                  const newFeatures = [...whyMeContent.features];
                  newFeatures[index].title = e.target.value;
                  setWhyMeContent({ ...whyMeContent, features: newFeatures });
                }}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Title"
              />
              <Textarea
                value={feature.description}
                onChange={(e) => {
                  const newFeatures = [...whyMeContent.features];
                  newFeatures[index].description = e.target.value;
                  setWhyMeContent({ ...whyMeContent, features: newFeatures });
                }}
                className="bg-gray-800 border-gray-700 text-white"
                rows={2}
                placeholder="Description"
              />
            </div>
          ))}
          <Button onClick={saveWhyMe} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Why Me
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input
                value={contactContent.email}
                onChange={(e) => setContactContent({ ...contactContent, email: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Phone</Label>
              <Input
                value={contactContent.phone}
                onChange={(e) => setContactContent({ ...contactContent, phone: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300 mb-2 block">Social Links</Label>
            {contactContent.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={link.platform}
                  onChange={(e) => {
                    const newLinks = [...contactContent.socialLinks];
                    newLinks[index].platform = e.target.value;
                    setContactContent({ ...contactContent, socialLinks: newLinks });
                  }}
                  className="bg-gray-800 border-gray-700 text-white w-32"
                  placeholder="Platform"
                />
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...contactContent.socialLinks];
                    newLinks[index].url = e.target.value;
                    setContactContent({ ...contactContent, socialLinks: newLinks });
                  }}
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                  placeholder="URL"
                />
                <Button size="icon" variant="ghost" onClick={() => {
                  const newLinks = contactContent.socialLinks.filter((_, i) => i !== index);
                  setContactContent({ ...contactContent, socialLinks: newLinks });
                }}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" onClick={() => setContactContent({ ...contactContent, socialLinks: [...contactContent.socialLinks, { platform: "", url: "" }] })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
          <Button onClick={saveContact} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Contact
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ ABOUT PAGE EDITOR ============

function AboutPageEditor() {
  const { toast } = useToast();
  
  const { data: pageContent = [], isLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/admin/page-content", "about"],
    queryFn: async () => {
      const res = await fetch("/api/admin/page-content/about", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const getSection = (key: string) => {
    const section = pageContent.find(p => p.sectionKey === key);
    return section?.content || null;
  };

  const [heroContent, setHeroContent] = useState({
    title: "Meet",
    name: "Sarah!",
    intro: "I'm Sarah, a marketing consultant who digs deep into search, data, and user behavior to help brands grow organically.",
    tagline1: "Depth over Speed",
    tagline2: "Data over Guesswork",
    tagline3: "Clarity over Jargon",
    imageUrl: "",
    backgroundImage: "",
  });

  const [storyContent, setStoryContent] = useState({
    paragraph1: "I started SarahDigs because I believe every brand deserves strategy that's grounded in real data—not guesswork.",
    paragraph2: "My approach is different. I dig into the numbers, understand your audience, and build strategies that actually convert.",
    paragraph3: "When I'm not deep in analytics dashboards, you'll find me exploring new coffee shops or testing the latest AI tools.",
  });

  const [ctaContent, setCtaContent] = useState({
    title: "Let's work together",
    subtitle: "Ready to build a marketing strategy that actually works?",
    buttonText: "Book a Call",
  });

  useEffect(() => {
    if (pageContent.length > 0) {
      const hero = getSection("hero");
      const story = getSection("story");
      const cta = getSection("cta");
      
      if (hero) setHeroContent(hero as typeof heroContent);
      if (story) setStoryContent(story as typeof storyContent);
      if (cta) setCtaContent(cta as typeof ctaContent);
    }
  }, [pageContent]);

  const saveMutation = useMutation({
    mutationFn: async (data: { pageSlug: string; sectionKey: string; content: unknown }) => {
      return await apiRequest("PUT", "/api/admin/page-content", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-content", "about"] });
      queryClient.invalidateQueries({ queryKey: ["/api/page-content", "about"] });
      toast({ title: "Content saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save content", variant: "destructive" });
    },
  });

  const saveHero = () => saveMutation.mutate({ pageSlug: "about", sectionKey: "hero", content: heroContent });
  const saveStory = () => saveMutation.mutate({ pageSlug: "about", sectionKey: "story", content: storyContent });
  const saveCta = () => saveMutation.mutate({ pageSlug: "about", sectionKey: "cta", content: ctaContent });

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Title</Label>
              <Input
                value={heroContent.title}
                onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                value={heroContent.name}
                onChange={(e) => setHeroContent({ ...heroContent, name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Introduction</Label>
            <Textarea
              value={heroContent.intro}
              onChange={(e) => setHeroContent({ ...heroContent, intro: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-300">Tagline 1</Label>
              <Input
                value={heroContent.tagline1}
                onChange={(e) => setHeroContent({ ...heroContent, tagline1: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Tagline 2</Label>
              <Input
                value={heroContent.tagline2}
                onChange={(e) => setHeroContent({ ...heroContent, tagline2: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Tagline 3</Label>
              <Input
                value={heroContent.tagline3}
                onChange={(e) => setHeroContent({ ...heroContent, tagline3: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Profile Image URL</Label>
            <Input
              value={heroContent.imageUrl || ""}
              onChange={(e) => setHeroContent({ ...heroContent, imageUrl: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="https://... or upload to Media Library first"
            />
            {heroContent.imageUrl && (
              <div className="mt-2">
                <img 
                  src={heroContent.imageUrl} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Upload image to Media Library first, then paste the URL here</p>
          </div>
          
          {/* Hero Background Image */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <Label className="text-gray-300 flex items-center gap-2 mb-2">
              <Image className="w-4 h-4" />
              Hero Background Image
            </Label>
            <Input
              value={heroContent.backgroundImage || ""}
              onChange={(e) => setHeroContent({ ...heroContent, backgroundImage: e.target.value })}
              placeholder="https://res.cloudinary.com/..."
              className="bg-gray-800 border-gray-700 text-white"
            />
            {heroContent.backgroundImage && (
              <img 
                src={heroContent.backgroundImage} 
                alt="Hero background preview" 
                className="mt-2 w-full h-32 object-cover rounded border border-gray-700"
              />
            )}
            <p className="text-gray-500 text-xs mt-1">Upload to Media Library first, then paste URL here</p>
          </div>
          
          <Button onClick={saveHero} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Hero
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Story Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Paragraph 1</Label>
            <Textarea
              value={storyContent.paragraph1}
              onChange={(e) => setStoryContent({ ...storyContent, paragraph1: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
          </div>
          <div>
            <Label className="text-gray-300">Paragraph 2</Label>
            <Textarea
              value={storyContent.paragraph2}
              onChange={(e) => setStoryContent({ ...storyContent, paragraph2: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
          </div>
          <div>
            <Label className="text-gray-300">Paragraph 3</Label>
            <Textarea
              value={storyContent.paragraph3}
              onChange={(e) => setStoryContent({ ...storyContent, paragraph3: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
          </div>
          <Button onClick={saveStory} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Story
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Call to Action
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Title</Label>
            <Input
              value={ctaContent.title}
              onChange={(e) => setCtaContent({ ...ctaContent, title: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Subtitle</Label>
            <Input
              value={ctaContent.subtitle}
              onChange={(e) => setCtaContent({ ...ctaContent, subtitle: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Button Text</Label>
            <Input
              value={ctaContent.buttonText}
              onChange={(e) => setCtaContent({ ...ctaContent, buttonText: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button onClick={saveCta} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save CTA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ CONSULTATIONS PAGE EDITOR ============

interface ConsultationsHeroContent {
  title: string;
  highlightWord: string;
  subtitle: string;
  rotatingWords: string[];
  ctaButton1Text: string;
  ctaButton2Text: string;
}

interface PainPoint {
  front: string;
  back: string;
}

interface Consultation {
  title: string;
  slug: string;
  desc: string;
  iconName: string;
  color: string;
}

function ConsultationsPageEditor() {
  const { toast } = useToast();
  
  const { data: pageContent = [], isLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/admin/page-content", "consultations"],
    queryFn: async () => {
      const res = await fetch("/api/admin/page-content/consultations", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const getSection = (key: string) => {
    const section = pageContent.find(p => p.sectionKey === key);
    return section?.content || null;
  };

  const [heroContent, setHeroContent] = useState<ConsultationsHeroContent>({
    title: "Expert Guidance to",
    highlightWord: "Future-Proof",
    subtitle: "Your Strategy.",
    rotatingWords: ["Future-Proof", "Strategic", "Data-Driven", "AI-Ready", "Actionable"],
    ctaButton1Text: "Get Consulting Deck",
    ctaButton2Text: "Book a Session",
  });

  const [painPoints, setPainPoints] = useState<PainPoint[]>([
    { front: "Unsure where to focus", back: "I analyze your current state and identify the highest-impact opportunities." },
    { front: "Missed growth opportunities", back: "We uncover hidden revenue channels and optimize your existing funnel." },
    { front: "Inefficient processes", back: "I streamline your workflows with AI and automation for maximum output." },
    { front: "Strategy feels stagnant", back: "We inject fresh perspectives and data-backed tactics to reignite growth." },
  ]);

  const [consultations, setConsultations] = useState<Consultation[]>([
    { title: "Strategic Deep Dive", slug: "strategic-deep-dive", desc: "Comprehensive analysis of your business model.", iconName: "Sparkles", color: "bg-[#1B1B1B]" },
    { title: "AI Integration Workshop", slug: "ai-integration", desc: "Hands-on session to identify AI opportunities.", iconName: "Brain", color: "bg-[#4D00FF]" },
    { title: "Growth Metrics Audit", slug: "growth-metrics", desc: "Deep analysis of your analytics setup.", iconName: "LineChart", color: "bg-[#1B1B1B]" },
    { title: "Fractional CMO", slug: "fractional-cmo", desc: "Ongoing strategic leadership.", iconName: "Mail", color: "bg-[#4D00FF]" },
  ]);

  useEffect(() => {
    if (pageContent.length > 0) {
      const hero = getSection("hero") as ConsultationsHeroContent | null;
      const points = getSection("painPoints") as PainPoint[] | null;
      const consults = getSection("consultations") as Consultation[] | null;
      
      if (hero) setHeroContent(hero);
      if (points) setPainPoints(points);
      if (consults) setConsultations(consults);
    }
  }, [pageContent]);

  const saveMutation = useMutation({
    mutationFn: async (data: { pageSlug: string; sectionKey: string; content: unknown }) => {
      return await apiRequest("PUT", "/api/admin/page-content", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/page-content", "consultations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/page-content", "consultations"] });
      toast({ title: "Content saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save content", variant: "destructive" });
    },
  });

  const saveHero = () => saveMutation.mutate({ pageSlug: "consultations", sectionKey: "hero", content: heroContent });
  const savePainPoints = () => saveMutation.mutate({ pageSlug: "consultations", sectionKey: "painPoints", content: painPoints });
  const saveConsultations = () => saveMutation.mutate({ pageSlug: "consultations", sectionKey: "consultations", content: consultations });

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Title</Label>
              <Input
                value={heroContent.title}
                onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Highlight Word</Label>
              <Input
                value={heroContent.highlightWord}
                onChange={(e) => setHeroContent({ ...heroContent, highlightWord: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Subtitle</Label>
            <Input
              value={heroContent.subtitle}
              onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Rotating Words (comma-separated)</Label>
            <Input
              value={heroContent.rotatingWords.join(", ")}
              onChange={(e) => setHeroContent({ ...heroContent, rotatingWords: e.target.value.split(",").map(w => w.trim()).filter(Boolean) })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">CTA Button 1</Label>
              <Input
                value={heroContent.ctaButton1Text}
                onChange={(e) => setHeroContent({ ...heroContent, ctaButton1Text: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">CTA Button 2</Label>
              <Input
                value={heroContent.ctaButton2Text}
                onChange={(e) => setHeroContent({ ...heroContent, ctaButton2Text: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <Button onClick={saveHero} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Hero
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Pain Points
            </span>
            <Button size="sm" onClick={() => setPainPoints([...painPoints, { front: "", back: "" }])}>
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {painPoints.map((point, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Card {index + 1}</span>
                <Button size="icon" variant="ghost" onClick={() => setPainPoints(painPoints.filter((_, i) => i !== index))}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div>
                <Label className="text-gray-300">Front (Problem)</Label>
                <Input
                  value={point.front}
                  onChange={(e) => {
                    const updated = [...painPoints];
                    updated[index].front = e.target.value;
                    setPainPoints(updated);
                  }}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Back (Solution)</Label>
                <Textarea
                  value={point.back}
                  onChange={(e) => {
                    const updated = [...painPoints];
                    updated[index].back = e.target.value;
                    setPainPoints(updated);
                  }}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          ))}
          <Button onClick={savePainPoints} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Pain Points
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Consultation Types
            </span>
            <Button size="sm" onClick={() => setConsultations([...consultations, { title: "", slug: "", desc: "", iconName: "Sparkles", color: "bg-[#1B1B1B]" }])}>
              <Plus className="w-4 h-4 mr-2" />
              Add Type
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {consultations.map((c, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Type {index + 1}</span>
                <Button size="icon" variant="ghost" onClick={() => setConsultations(consultations.filter((_, i) => i !== index))}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={c.title}
                    onChange={(e) => {
                      const updated = [...consultations];
                      updated[index].title = e.target.value;
                      setConsultations(updated);
                    }}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Slug</Label>
                  <Input
                    value={c.slug}
                    onChange={(e) => {
                      const updated = [...consultations];
                      updated[index].slug = e.target.value;
                      setConsultations(updated);
                    }}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={c.desc}
                  onChange={(e) => {
                    const updated = [...consultations];
                    updated[index].desc = e.target.value;
                    setConsultations(updated);
                  }}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Icon</Label>
                  <Select value={c.iconName} onValueChange={(value) => {
                    const updated = [...consultations];
                    updated[index].iconName = value;
                    setConsultations(updated);
                  }}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VALID_ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Color</Label>
                  <Select value={c.color} onValueChange={(value) => {
                    const updated = [...consultations];
                    updated[index].color = value;
                    setConsultations(updated);
                  }}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-[#1B1B1B]">Dark</SelectItem>
                      <SelectItem value="bg-[#4D00FF]">Purple</SelectItem>
                      <SelectItem value="bg-[#F4F2FF] text-[#1B1B1B] border-[#1B1B1B]/10">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={saveConsultations} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Consultations
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ MAIN COMPONENT ============

const availablePages = [
  { slug: "home", label: "Home Page", icon: Home },
  { slug: "about", label: "About Page", icon: User },
  { slug: "consultations", label: "Consultations", icon: LayoutList },
];

export default function AdminPages() {
  return (
    <AdminLayout title="Page Content Editor">
      <div className="mb-6">
        <p className="text-gray-400">
          Edit content for specific pages. Changes are saved to the database and will appear on the live site.
        </p>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="bg-[#1a1a1a] border-gray-800 mb-6">
          {availablePages.map((page) => (
            <TabsTrigger
              key={page.slug}
              value={page.slug}
              className="data-[state=active]:bg-[#4D00FF]"
            >
              <page.icon className="w-4 h-4 mr-2" />
              {page.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="home">
          <HomePageEditor />
        </TabsContent>

        <TabsContent value="about">
          <AboutPageEditor />
        </TabsContent>

        <TabsContent value="consultations">
          <ConsultationsPageEditor />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}