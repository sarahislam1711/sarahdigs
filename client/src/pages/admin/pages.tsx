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
import { Save, Plus, Trash2, FileText, Sparkles, Brain, LineChart, Mail, Zap, BookOpen, MessageSquare, AlertCircle, Home, LayoutList, CheckCircle, HelpCircle, ListOrdered, Briefcase} from "lucide-react";
import type { PageContent } from "@shared/schema";

const VALID_ICONS = ["Sparkles", "Brain", "LineChart", "Mail", "Zap", "BookOpen", "MessageSquare", "FileText"] as const;
const VALID_COLORS = ["bg-[#1B1B1B]", "bg-[#4D00FF]", "bg-[#F4F2FF] text-[#1B1B1B] border-[#1B1B1B]/10"] as const;

// ============ HOME PAGE EDITOR ============

interface HomeHeroContent {
  rotatingWords: string[];
  description: string;
  ctaText: string;
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

  // Hero state
  const [heroContent, setHeroContent] = useState<HomeHeroContent>({
    rotatingWords: ["goals", "users", "data", "market", "product"],
    description: "I help brands find the hidden gold in their analytics, content, and user journeys. No fluff, just deep excavation for growth.",
    ctaText: "Start Digging",
  });

  // Problems state
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

  // Solution state
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

  // Contact state
  const [contactContent, setContactContent] = useState<HomeContactContent>({
    email: "hello@sarahdigs.com",
    phone: "+1 (555) 000-0000",
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
  });
  // Process section state
  const [processContent, setProcessContent] = useState<HomeProcessContent>({
    headline: "How it works",
    subtitle: "A structured approach to uncovering value and driving growth.",
  });

  // Services section state
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

  const saveProcess = () => {
    saveMutation.mutate({ pageSlug: "home", sectionKey: "process", content: processContent });
  };

  const saveServices = () => {
    saveMutation.mutate({ pageSlug: "home", sectionKey: "services", content: servicesContent });
  };
  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
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
              placeholder="goals, users, data, market, product"
            />
            <p className="text-xs text-gray-500 mt-1">Words that rotate in the hero headline</p>
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
          <Button onClick={saveHero} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Hero
          </Button>
        </CardContent>
      </Card>

      {/* Problems Section */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Problems Section ("Does this sound familiar?")
            </span>
            <Button 
              size="sm" 
              onClick={() => setProblemsContent({
                ...problemsContent,
                items: [...problemsContent.items, ""]
              })}
            >
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
                placeholder={`Problem ${index + 1}`}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => {
                  const newItems = problemsContent.items.filter((_, i) => i !== index);
                  setProblemsContent({ ...problemsContent, items: newItems });
                }}
              >
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

      {/* Solution Section */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Solution Section ("Stop guessing. Start growing.")
            </span>
            <Button 
              size="sm" 
              onClick={() => setSolutionContent({
                ...solutionContent,
                benefits: [...solutionContent.benefits, ""]
              })}
            >
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
          <div>
            <Label className="text-gray-300">Benefits (checkmark items)</Label>
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
                placeholder={`Benefit ${index + 1}`}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => {
                  const newBenefits = solutionContent.benefits.filter((_, i) => i !== index);
                  setSolutionContent({ ...solutionContent, benefits: newBenefits });
                }}
              >
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

      {/* Process Section */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ListOrdered className="w-5 h-5" />
            Process Section ("How it works")
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Headline</Label>
            <Input
              value={processContent.headline}
              onChange={(e) => setProcessContent({ ...processContent, headline: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="How it works"
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
          <p className="text-gray-500 text-sm">Note: The process steps are managed in the Process section of the admin.</p>
          <Button onClick={saveProcess} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Process
          </Button>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Services Section ("Where do you wanna dig?")
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Headline</Label>
            <Input
              value={servicesContent.headline}
              onChange={(e) => setServicesContent({ ...servicesContent, headline: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Where do you wanna dig?"
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
          <p className="text-gray-500 text-sm">Note: The service cards are managed in the Services section of the admin.</p>
          <Button onClick={saveServices} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Services
          </Button>
        </CardContent>
      </Card>

      {/* Why Me Section */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Why Me Section
            </span>
            <Button 
              size="sm" 
              onClick={() => setWhyMeContent({
                ...whyMeContent,
                features: [...(whyMeContent.features || []), { title: "", description: "" }]
              })}
            >
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
          <div>
            <Label className="text-gray-300 mb-2 block">Feature Boxes</Label>
            {(whyMeContent.features || []).map((feature, index) => (
              <div key={index} className="border border-gray-700 rounded-lg p-4 mb-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Feature {index + 1}</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => {
                      const newFeatures = whyMeContent.features.filter((_, i) => i !== index);
                      setWhyMeContent({ ...whyMeContent, features: newFeatures });
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...whyMeContent.features];
                      newFeatures[index].title = e.target.value;
                      setWhyMeContent({ ...whyMeContent, features: newFeatures });
                    }}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., Data-First Approach"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...whyMeContent.features];
                      newFeatures[index].description = e.target.value;
                      setWhyMeContent({ ...whyMeContent, features: newFeatures });
                    }}
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button onClick={saveWhyMe} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Why Me
          </Button>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Headline</Label>
            <Input
              value={contactContent.headline || ""}
              onChange={(e) => setContactContent({ ...contactContent, headline: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Ready to dig deep?"
            />
          </div>
          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={contactContent.description || ""}
              onChange={(e) => setContactContent({ ...contactContent, description: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={2}
            />
          </div>
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
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => {
                    const newLinks = contactContent.socialLinks.filter((_, i) => i !== index);
                    setContactContent({ ...contactContent, socialLinks: newLinks });
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button 
              size="sm" 
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setContactContent({
                ...contactContent,
                socialLinks: [...contactContent.socialLinks, { platform: "", url: "" }]
              })}
            >
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
    { title: "Strategic Deep Dive", slug: "strategic-deep-dive", desc: "Comprehensive analysis of your business model, market position, and growth levers.", iconName: "Sparkles", color: "bg-[#1B1B1B]" },
    { title: "AI Integration Workshop", slug: "ai-integration", desc: "Hands-on session to identify AI opportunities and build an implementation roadmap.", iconName: "Brain", color: "bg-[#4D00FF]" },
    { title: "Growth Metrics Audit", slug: "growth-metrics", desc: "Deep analysis of your analytics setup, KPIs, and measurement framework.", iconName: "LineChart", color: "bg-[#1B1B1B]" },
    { title: "Fractional CMO", slug: "fractional-cmo", desc: "Ongoing strategic leadership without the full-time commitment.", iconName: "Mail", color: "bg-[#4D00FF]" },
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

  const saveHero = () => {
    saveMutation.mutate({ pageSlug: "consultations", sectionKey: "hero", content: heroContent });
  };

  const savePainPoints = () => {
    saveMutation.mutate({ pageSlug: "consultations", sectionKey: "painPoints", content: painPoints });
  };

  const saveConsultations = () => {
    saveMutation.mutate({ pageSlug: "consultations", sectionKey: "consultations", content: consultations });
  };

  const addPainPoint = () => {
    setPainPoints([...painPoints, { front: "", back: "" }]);
  };

  const removePainPoint = (index: number) => {
    setPainPoints(painPoints.filter((_, i) => i !== index));
  };

  const updatePainPoint = (index: number, field: "front" | "back", value: string) => {
    const updated = [...painPoints];
    updated[index][field] = value;
    setPainPoints(updated);
  };

  const addConsultation = () => {
    setConsultations([...consultations, { title: "", slug: "", desc: "", iconName: "Sparkles", color: "bg-[#1B1B1B]" }]);
  };

  const removeConsultation = (index: number) => {
    setConsultations(consultations.filter((_, i) => i !== index));
  };

  const updateConsultation = (index: number, field: keyof Consultation, value: string) => {
    const updated = [...consultations];
    updated[index][field] = value;
    setConsultations(updated);
  };

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
              <Label className="text-gray-300">Title (before highlight)</Label>
              <Input
                value={heroContent.title}
                onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-hero-title"
              />
            </div>
            <div>
              <Label className="text-gray-300">Highlight Word</Label>
              <Input
                value={heroContent.highlightWord}
                onChange={(e) => setHeroContent({ ...heroContent, highlightWord: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-hero-highlight"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Subtitle (after highlight)</Label>
            <Input
              value={heroContent.subtitle}
              onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              data-testid="input-hero-subtitle"
            />
          </div>
          <div>
            <Label className="text-gray-300">Rotating Words (comma-separated)</Label>
            <Input
              value={heroContent.rotatingWords.join(", ")}
              onChange={(e) => setHeroContent({ 
                ...heroContent, 
                rotatingWords: e.target.value.split(",").map(w => w.trim()).filter(Boolean)
              })}
              className="bg-gray-800 border-gray-700 text-white"
              data-testid="input-hero-rotating"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">CTA Button 1 Text</Label>
              <Input
                value={heroContent.ctaButton1Text}
                onChange={(e) => setHeroContent({ ...heroContent, ctaButton1Text: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-hero-cta1"
              />
            </div>
            <div>
              <Label className="text-gray-300">CTA Button 2 Text</Label>
              <Input
                value={heroContent.ctaButton2Text}
                onChange={(e) => setHeroContent({ ...heroContent, ctaButton2Text: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-hero-cta2"
              />
            </div>
          </div>
          <Button onClick={saveHero} disabled={saveMutation.isPending} data-testid="button-save-hero">
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
              Pain Points Cards
            </span>
            <Button size="sm" onClick={addPainPoint} data-testid="button-add-painpoint">
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
                <Button size="icon" variant="ghost" onClick={() => removePainPoint(index)} data-testid={`button-remove-painpoint-${index}`}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div>
                <Label className="text-gray-300">Front (Problem)</Label>
                <Input
                  value={point.front}
                  onChange={(e) => updatePainPoint(index, "front", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., Unsure where to focus"
                  data-testid={`input-painpoint-front-${index}`}
                />
              </div>
              <div>
                <Label className="text-gray-300">Back (Solution)</Label>
                <Textarea
                  value={point.back}
                  onChange={(e) => updatePainPoint(index, "back", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., I analyze your current state..."
                  data-testid={`input-painpoint-back-${index}`}
                />
              </div>
            </div>
          ))}
          <Button onClick={savePainPoints} disabled={saveMutation.isPending} data-testid="button-save-painpoints">
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
            <Button size="sm" onClick={addConsultation} data-testid="button-add-consultation">
              <Plus className="w-4 h-4 mr-2" />
              Add Consultation
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {consultations.map((consultation, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Consultation {index + 1}</span>
                <Button size="icon" variant="ghost" onClick={() => removeConsultation(index)} data-testid={`button-remove-consultation-${index}`}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={consultation.title}
                    onChange={(e) => updateConsultation(index, "title", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid={`input-consultation-title-${index}`}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Slug (URL path)</Label>
                  <Input
                    value={consultation.slug}
                    onChange={(e) => updateConsultation(index, "slug", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid={`input-consultation-slug-${index}`}
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={consultation.desc}
                  onChange={(e) => updateConsultation(index, "desc", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid={`input-consultation-desc-${index}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Icon</Label>
                  <Select
                    value={consultation.iconName}
                    onValueChange={(value) => updateConsultation(index, "iconName", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid={`select-consultation-icon-${index}`}>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {VALID_ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon} data-testid={`option-icon-${icon.toLowerCase()}-${index}`}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Color Style</Label>
                  <Select
                    value={consultation.color}
                    onValueChange={(value) => updateConsultation(index, "color", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid={`select-consultation-color-${index}`}>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-[#1B1B1B]" data-testid={`option-color-dark-${index}`}>Dark (Black)</SelectItem>
                      <SelectItem value="bg-[#4D00FF]" data-testid={`option-color-purple-${index}`}>Purple (Brand)</SelectItem>
                      <SelectItem value="bg-[#F4F2FF] text-[#1B1B1B] border-[#1B1B1B]/10" data-testid={`option-color-light-${index}`}>Light (Lavender)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={saveConsultations} disabled={saveMutation.isPending} data-testid="button-save-consultations">
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
  { slug: "consultations", label: "Consultations Page", icon: LayoutList },
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
              data-testid={`tab-${page.slug}`}
            >
              <page.icon className="w-4 h-4 mr-2" />
              {page.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="home">
          <HomePageEditor />
        </TabsContent>

        <TabsContent value="consultations">
          <ConsultationsPageEditor />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}