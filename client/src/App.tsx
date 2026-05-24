import { useLenis } from "@/hooks/useLenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieConsent from "@/components/cookie-consent";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import PageTransition from "@/components/layout/PageTransition";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Journal from "@/pages/journal";
import JournalCategory from "@/pages/journal-category";
import BlogPostPage from "@/pages/blog-post";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import ServiceDynamic from "@/pages/service-dynamic";
import DigInConsultations from "@/pages/dig-in-consultations";
import ConsultationDetail from "@/pages/consultation-detail";
import DigOnDemand from "@/pages/dig-on-demand";
import TheFullDig from "@/pages/the-full-dig";
import AdminLogin from "@/pages/admin/login";
import AdminPosts from "@/pages/admin/posts";
import PostEditor from "@/pages/admin/post-editor";
import AdminPreview from "@/pages/admin/preview";
import AdminInquiries from "@/pages/admin/inquiries";
import AdminProjects from "@/pages/admin/projects";
import ProjectEditor from "@/pages/admin/project-editor";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function ScrollProgressGate() {
  const [location] = useLocation();
  if (location === "/") return null;
  return <ScrollProgress />;
}

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="sync" initial={false}>
      <Switch key={location} location={location}>
        <Route path="/"><PageTransition><Home /></PageTransition></Route>
        <Route path="/about"><PageTransition><About /></PageTransition></Route>
        <Route path="/contact"><PageTransition><Contact /></PageTransition></Route>
        <Route path="/privacy"><PageTransition><Privacy /></PageTransition></Route>
        <Route path="/terms"><PageTransition><Terms /></PageTransition></Route>
        <Route path="/projects"><PageTransition><Projects /></PageTransition></Route>
        <Route path="/projects/:slug"><PageTransition><ProjectDetail /></PageTransition></Route>
        <Route path="/journal"><PageTransition><Journal /></PageTransition></Route>
        <Route path="/journal/post/:slug"><PageTransition><BlogPostPage /></PageTransition></Route>
        <Route path="/journal/:category"><PageTransition><JournalCategory /></PageTransition></Route>

        {/* Admin routes - MUST come before /services/:slug */}
        {/* Admin — Journal only */}
        <Route path="/admin"><Redirect to="/admin/posts" /></Route>
        <Route path="/admin/login"><PageTransition><AdminLogin /></PageTransition></Route>
        <Route path="/admin/posts"><PageTransition><AdminPosts /></PageTransition></Route>
        <Route path="/admin/posts/:id"><PageTransition><PostEditor /></PageTransition></Route>
        <Route path="/admin/inquiries"><PageTransition><AdminInquiries /></PageTransition></Route>
        <Route path="/admin/projects"><PageTransition><AdminProjects /></PageTransition></Route>
        <Route path="/admin/projects/:id"><PageTransition><ProjectEditor /></PageTransition></Route>
        <Route path="/admin/preview/:slug"><PageTransition><AdminPreview /></PageTransition></Route>

        {/* Public service routes - after admin */}
        <Route path="/the-full-dig"><PageTransition><TheFullDig /></PageTransition></Route>
        <Route path="/dig-on-demand"><PageTransition><DigOnDemand /></PageTransition></Route>
        <Route path="/dig-in-consultations"><PageTransition><DigInConsultations /></PageTransition></Route>
        <Route path="/dig-in-consultations/quarterly-strategy-review">
          <Redirect to="/dig-in-consultations" />
        </Route>
        <Route path="/dig-in-consultations/:slug"><PageTransition><ConsultationDetail /></PageTransition></Route>
        <Route path="/services/:slug"><PageTransition><ServiceDynamic /></PageTransition></Route>

        <Route><PageTransition><NotFound /></PageTransition></Route>
      </Switch>
    </AnimatePresence>
  );
}

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useLenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenisRef]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CustomCursor />
        <ScrollProgressGate />
        <Toaster />
        <ScrollToTop />
        <Router />
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;