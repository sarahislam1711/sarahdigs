import AdminLayout from "@/components/layout/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Save, Globe, Palette, Share2, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SettingsForm {
  site_name: string;
  site_tagline: string;
  site_description: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  favicon_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  tiktok_url: string;
  youtube_url: string;
  facebook_url: string;
  header_scripts: string;
  footer_scripts: string;
  contact_email: string;
  contact_phone: string;
}

const defaultSettings: SettingsForm = {
  site_name: "Sarah Digs",
  site_tagline: "Marketing Consultant",
  site_description: "",
  primary_color: "#4D00FF",
  secondary_color: "#1B1B1B",
  logo_url: "",
  favicon_url: "",
  twitter_url: "",
  instagram_url: "",
  linkedin_url: "",
  tiktok_url: "",
  youtube_url: "",
  facebook_url: "",
  header_scripts: "",
  footer_scripts: "",
  contact_email: "",
  contact_phone: "",
};

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<SettingsForm>(defaultSettings);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const settingsMap = settings.reduce((acc: SettingsForm, s: any) => {
        (acc as any)[s.settingKey] = s.settingValue || "";
        return acc;
      }, { ...defaultSettings });
      setFormData(settingsMap);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      const settingsArray = Object.entries(data).map(([key, value]) => ({
        settingKey: key,
        settingValue: value,
        settingType: "text",
      }));
      return await apiRequest("PUT", "/api/admin/settings", { settings: settingsArray });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Settings saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save settings", variant: "destructive" });
    },
  });

  const handleChange = (key: keyof SettingsForm, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <AdminLayout title="Site Settings">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4D00FF]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">Configure your website settings and branding</p>
        <Button
          onClick={() => saveMutation.mutate(formData)}
          disabled={saveMutation.isPending}
          className="bg-[#4D00FF] hover:bg-[#4D00FF]/80"
          data-testid="button-save-settings"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-[#0D0D0D] border border-gray-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-[#4D00FF]">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="data-[state=active]:bg-[#4D00FF]">
            <Palette className="w-4 h-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-[#4D00FF]">
            <Share2 className="w-4 h-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-[#4D00FF]">
            <Code className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Site Name</Label>
                  <Input
                    value={formData.site_name}
                    onChange={(e) => handleChange("site_name", e.target.value)}
                    placeholder="Your Site Name"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-site-name"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Tagline</Label>
                  <Input
                    value={formData.site_tagline}
                    onChange={(e) => handleChange("site_tagline", e.target.value)}
                    placeholder="Your tagline"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-site-tagline"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Site Description</Label>
                <Textarea
                  value={formData.site_description}
                  onChange={(e) => handleChange("site_description", e.target.value)}
                  placeholder="A brief description of your website"
                  className="bg-gray-800 border-gray-700 text-white"
                  data-testid="input-site-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Contact Email</Label>
                  <Input
                    value={formData.contact_email}
                    onChange={(e) => handleChange("contact_email", e.target.value)}
                    placeholder="hello@example.com"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Contact Phone</Label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-contact-phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Branding</CardTitle>
              <CardDescription className="text-gray-400">
                Customize your site's visual identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Logo URL</Label>
                  <Input
                    value={formData.logo_url}
                    onChange={(e) => handleChange("logo_url", e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-logo-url"
                  />
                  {formData.logo_url && (
                    <div className="mt-2 p-4 bg-gray-800 rounded-lg">
                      <img src={formData.logo_url} alt="Logo preview" className="max-h-16" />
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-gray-400">Favicon URL</Label>
                  <Input
                    value={formData.favicon_url}
                    onChange={(e) => handleChange("favicon_url", e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-favicon-url"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => handleChange("primary_color", e.target.value)}
                      className="w-16 h-10 p-1 bg-gray-800 border-gray-700"
                      data-testid="input-primary-color"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => handleChange("primary_color", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => handleChange("secondary_color", e.target.value)}
                      className="w-16 h-10 p-1 bg-gray-800 border-gray-700"
                      data-testid="input-secondary-color"
                    />
                    <Input
                      value={formData.secondary_color}
                      onChange={(e) => handleChange("secondary_color", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Social Media Links</CardTitle>
              <CardDescription className="text-gray-400">
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Twitter / X</Label>
                  <Input
                    value={formData.twitter_url}
                    onChange={(e) => handleChange("twitter_url", e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-twitter-url"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Instagram</Label>
                  <Input
                    value={formData.instagram_url}
                    onChange={(e) => handleChange("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-instagram-url"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">LinkedIn</Label>
                  <Input
                    value={formData.linkedin_url}
                    onChange={(e) => handleChange("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-linkedin-url"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">TikTok</Label>
                  <Input
                    value={formData.tiktok_url}
                    onChange={(e) => handleChange("tiktok_url", e.target.value)}
                    placeholder="https://tiktok.com/@username"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-tiktok-url"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">YouTube</Label>
                  <Input
                    value={formData.youtube_url}
                    onChange={(e) => handleChange("youtube_url", e.target.value)}
                    placeholder="https://youtube.com/@channel"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-youtube-url"
                  />
                </div>
                <div>
                  <Label className="text-gray-400">Facebook</Label>
                  <Input
                    value={formData.facebook_url}
                    onChange={(e) => handleChange("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/page"
                    className="bg-gray-800 border-gray-700 text-white"
                    data-testid="input-facebook-url"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card className="bg-[#0D0D0D] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Custom Scripts</CardTitle>
              <CardDescription className="text-gray-400">
                Add custom code to your website (analytics, tracking, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Header Scripts</Label>
                <Textarea
                  value={formData.header_scripts}
                  onChange={(e) => handleChange("header_scripts", e.target.value)}
                  placeholder="<!-- Scripts to include in <head> -->"
                  className="bg-gray-800 border-gray-700 text-white font-mono text-sm min-h-[150px]"
                  data-testid="input-header-scripts"
                />
                <p className="text-gray-500 text-xs mt-1">
                  These scripts will be added to the &lt;head&gt; section of your site.
                </p>
              </div>
              <div>
                <Label className="text-gray-400">Footer Scripts</Label>
                <Textarea
                  value={formData.footer_scripts}
                  onChange={(e) => handleChange("footer_scripts", e.target.value)}
                  placeholder="<!-- Scripts to include before </body> -->"
                  className="bg-gray-800 border-gray-700 text-white font-mono text-sm min-h-[150px]"
                  data-testid="input-footer-scripts"
                />
                <p className="text-gray-500 text-xs mt-1">
                  These scripts will be added before the closing &lt;/body&gt; tag.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
