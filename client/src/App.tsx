import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import Journal from "@/pages/journal";
import JournalCategory from "@/pages/journal-category";
import BlogPostPage from "@/pages/blog-post";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import ServiceDynamic from "@/pages/service-dynamic";
import DigInConsultations from "@/pages/dig-in-consultations";
import ConsultationDetail from "@/pages/consultation-detail";
import DigOnDemand from "@/pages/dig-on-demand";
import AdminDashboard from "@/pages/admin/index";
import AdminLogin from "@/pages/admin/login";
import AdminPosts from "@/pages/admin/posts";
import PostEditor from "@/pages/admin/post-editor";
import AdminCategories from "@/pages/admin/categories";
import AdminTags from "@/pages/admin/tags";
import AdminMedia from "@/pages/admin/media";
import AdminSettings from "@/pages/admin/settings";
import AdminPreview from "@/pages/admin/preview";
import AdminContent from "@/pages/admin/content";
import AdminPages from "@/pages/admin/pages";
import AdminServices from "@/pages/admin/services";
import ServiceEditor from "@/pages/admin/service-editor";
import AdminProjects from "@/pages/admin/projects";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/journal" component={Journal} />
      <Route path="/journal/post/:slug" component={BlogPostPage} />
      <Route path="/journal/:category" component={JournalCategory} />
      
      {/* Admin routes - MUST come before /services/:slug */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/posts/:id" component={PostEditor} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/tags" component={AdminTags} />
      <Route path="/admin/media" component={AdminMedia} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/admin/pages" component={AdminPages} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/services/new" component={ServiceEditor} />
      <Route path="/admin/services/:id" component={ServiceEditor} />
      <Route path="/admin/preview/:slug" component={AdminPreview} />
      
      {/* Public service routes - after admin */}
      <Route path="/services/dig-on-demand" component={DigOnDemand} />
      <Route path="/services/consultations" component={DigInConsultations} />
      <Route path="/services/consultations/:slug" component={ConsultationDetail} />
      <Route path="/services/:slug" component={ServiceDynamic} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
