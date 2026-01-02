import { useState, useEffect, useCallback, useRef } from "react";
import type { Stat, ProcessStep, Service, Project, Testimonial } from "@shared/schema";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  Search,
  BarChart3,
  Users,
  Layout,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer as FooterComponent } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  BarChart3,
  Users,
  Layout,
  TrendingUp,
};

// --- Components ---

const CountUp = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Parse value to separate number from non-numeric characters
  const match = value.match(/^([^0-9]*)([0-9]+)(.*)$/);
  const prefix = match ? match[1] : "";
  const number = match ? parseInt(match[2]) : 0;
  const suffix = match ? match[3] : value;

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Start time
      const start = Date.now();
      const duration = 2000; // 2 seconds

      const update = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);

        if (progress < 1) {
          // Show random number during animation
          // Generate random number with same number of digits as target
          const digits = number.toString().length;
          const min = Math.pow(10, digits - 1);
          const max = Math.pow(10, digits) - 1;
          const random = Math.floor(Math.random() * (max - min + 1)) + min;

          setDisplayValue(random);
          requestAnimationFrame(update);
        } else {
          // Set final value
          setDisplayValue(number);
        }
      };

      requestAnimationFrame(update);
    }
  }, [isInView, number]);

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="text-5xl md:text-6xl font-black text-[#1B1B1B] mb-2 tabular-nums">
        {match ? (
          <>
            {prefix}
            {displayValue}
            {suffix}
          </>
        ) : (
          value
        )}
      </div>
      <div className="text-sm font-bold uppercase tracking-widest text-[#4D00FF]">
        {label}
      </div>
    </div>
  );
};

const Proof = () => {
  const { data: stats = [] } = useQuery<Stat[]>({
    queryKey: ["/api/stats"],
  });

  const defaultStats = [
    { value: "10+", label: "Years Experience" },
    { value: "$50M+", label: "Revenue Generated" },
    { value: "400%", label: "Avg. Traffic Growth" },
    { value: "50+", label: "Happy Clients" },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-20 bg-[#F4F2FF] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-between gap-8 md:gap-0">
          {displayStats.map((stat, i) => (
            <CountUp key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProblemSolution = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const problemsData = homeContent?.problems || {
    title: "Does this sound familiar?",
    items: [
      "You're drowning in data but starving for actionable insights.",
      "Your traffic is growing, but your revenue remains flat.",
      "You're creating content that no one seems to be finding or reading.",
      "Technical SEO feels like a black box you can't unlock.",
      "You're guessing at strategy instead of following a roadmap.",
    ],
  };

  const solutionData = homeContent?.solution || {
    title: "Stop guessing. Start growing.",
    description: "I turn chaotic data into a clear, actionable growth engine. No fluff, just results-driven strategy that bridges the gap between technical execution and brand storytelling.",
    benefits: [
      "Clear, prioritized roadmaps backed by data",
      "High-intent traffic that actually converts",
      "Technical foundation built for scale",
      "Content strategy that drives real revenue",
    ],
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const problems = problemsData.items || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % problems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [problems.length]);

  // Split the solution title at the period
  const titleParts = solutionData.title.split(".");
  const titleLine1 = titleParts[0] + ".";
  const titleLine2 = titleParts[1]?.trim() || "";

  return (
    <section className="py-20 bg-transparent text-[#1B1B1B]">
      <div className="container mx-auto px-6">
        {/* Problem Part */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-12">
          <div className="md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1]">
              {problemsData.title.split(" ").slice(0, -1).join(" ")} <br />
              <span className="text-[#4D00FF]">{problemsData.title.split(" ").slice(-1)[0]}</span>
            </h2>
          </div>
          <div className="md:w-2/3">
            <div className="space-y-3">
              {problems.map((item: string, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-4 p-3 -ml-3 rounded-xl transition-all duration-500 cursor-default",
                    activeIndex === i ? "bg-[#F4F2FF] scale-[1.02] shadow-sm" : "opacity-60 hover:opacity-100"
                  )}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <div className={cn(
                    "mt-1 shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-300",
                    activeIndex === i 
                      ? "border-red-500 text-red-500 bg-red-50" 
                      : "border-[#1B1B1B]/20 text-[#1B1B1B]/40"
                  )}>
                    <X className="w-3 h-3" />
                  </div>
                  <p className={cn(
                    "text-lg leading-snug transition-colors duration-300",
                    activeIndex === i ? "text-[#1B1B1B] font-medium" : "text-[#1B1B1B]"
                  )}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solution Part */}
        <div className="bg-[#1B1B1B] text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
          {/* Abstract bg shape */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#4D00FF] via-transparent to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                {titleLine1} <br />
                <span className="text-[#4D00FF]">{titleLine2}</span>
              </h3>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                {solutionData.description}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {(solutionData.benefits || []).map((benefit: string, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#4D00FF] flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const heroData = homeContent?.hero || {
    rotatingWords: ["goals", "users", "data", "market", "product"],
    description: "I help brands find the hidden gold in their analytics, content, and user journeys. No fluff, just deep excavation for growth.",
    ctaText: "Start Digging",
    backgroundImage: "",
  };
  
  const words = heroData.rotatingWords || ["goals", "users", "data", "market", "product"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section 
      className="flex flex-col justify-center py-[130px] relative overflow-hidden"
      style={heroData.backgroundImage ? {
        backgroundImage: `url(${heroData.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      {/* Overlay for background image */}
      {heroData.backgroundImage && (
        <div className="absolute inset-0 bg-[#FBFCFE]/85 backdrop-blur-sm"></div>
      )}
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-fit">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-12"
          >
            sarah<span className="text-[#4D00FF]">digs</span> <br />
            <div className="whitespace-nowrap">
              <span className="text-[#1B1B1B] inline-block mr-4">into</span>
              <div className="h-[1em] overflow-hidden inline-flex align-top text-[#4d00ff]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[index]}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="block text-[#4D00FF] bg-[#F4F2FF] px-2 md:px-6 rounded-xl md:rounded-3xl border-2 border-[#4D00FF]"
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between gap-8 md:items-end w-full"
          >
            <p className="text-lg md:text-xl font-light leading-relaxed text-muted-foreground max-w-lg">
              {heroData.description}
            </p>
            <Button
              size="lg"
              className="text-lg h-14 px-8 w-fit shrink-0 group"
            >
              {heroData.ctaText}{" "}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const { data: processSteps = [] } = useQuery<ProcessStep[]>({
    queryKey: ["/api/process-steps"],
  });

  const processData = homeContent?.process || {
    headline: "How it works",
    subtitle: "A structured approach to uncovering value and driving growth.",
  };

  const defaultSteps = [
    { stepNumber: "01", title: "Discovery", description: "We start by unearthing your current data, challenges, and goals." },
    { stepNumber: "02", title: "Strategy", description: "I build a custom roadmap to bridge the gap between where you are and where you want to be." },
    { stepNumber: "03", title: "Execution", description: "We implement the plan with precision, focusing on high-impact actions." },
    { stepNumber: "04", title: "Optimization", description: "Continuous monitoring and refining to ensure sustainable growth." },
  ];

  const steps = processSteps.length > 0 ? processSteps : defaultSteps;

  return (
    <section className="pt-20 pb-32 bg-[#F4F2FF] text-[#1B1B1B]">
      <div className="container mx-auto px-6">
        <div className="mb-24 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            {processData.headline}
          </h2>
          <p className="text-xl text-[#1B1B1B]/70 max-w-2xl">
            {processData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-[#1B1B1B]/10 -z-10" />

          {steps.map((step, i) => (
            <div key={step.stepNumber || i} className="group relative pt-8 md:pt-0">
              <div className="w-24 h-24 bg-[#FBFCFE] border border-[#1B1B1B]/20 rounded-full flex items-center justify-center text-3xl font-bold font-display mb-4 group-hover:border-[#4D00FF] group-hover:text-[#4D00FF] transition-colors z-10 relative mx-auto md:mx-0 text-[#1B1B1B]">
                {step.stepNumber}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center md:text-left text-[#1B1B1B]">
                {step.title}
              </h3>
              <p className="text-[#1B1B1B]/70 leading-relaxed text-center md:text-left">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const { data: servicesData = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const servicesHeaderData = homeContent?.services || {
    headline: "Where do you wanna dig?",
    subtitle: "I don't just scratch the surface. I excavate the insight.",
  };

  const defaultServices = [
    { slug: "seo", title: "SEO & Organic", shortDescription: "Comprehensive audit of your technical foundation, content gaps, and opportunity landscape.", iconName: "Search" },
    { slug: "product", title: "Product-Led Marketing", shortDescription: "Data-backed content planning that targets high-intent users, not just traffic.", iconName: "Layout" },
    { slug: "brand", title: "Brand & Strategy", shortDescription: "Turning messy analytics into clear, actionable insights for conversion optimization.", iconName: "BarChart3" },
    { slug: "founder", title: "Founder-led Growth", shortDescription: "Qualitative digging to understand the 'why' behind the 'what' of user behavior.", iconName: "Users" },
  ];

  const services = servicesData.length > 0 ? servicesData : defaultServices;

  return (
    <section className="py-8 bg-transparent text-[#1B1B1B]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-8">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
            {servicesHeaderData.headline}
          </h2>
          <p className="mt-8 md:mt-0 max-w-md text-lg font-light text-[#1B1B1B]/80 text-right">
            {servicesHeaderData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const IconComponent = iconMap[service.iconName || "Search"] || Search;
            return (
              <Link href={`/services/${service.slug}`} key={service.slug || i}>
                <div
                  className="group border border-[#1B1B1B]/20 p-12 hover:bg-[#F4F2FF] hover:text-[#1B1B1B] transition-colors duration-500 cursor-pointer relative overflow-hidden rounded-[1.25rem]"
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-12 h-12 rounded-full bg-[#4D00FF] flex items-center justify-center text-white font-bold text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <IconComponent className="h-8 w-8 opacity-60 group-hover:text-[#4D00FF] transition-colors" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-300">
                    {service.title}
                  </h3>
                  <p className="text-lg font-light opacity-70 group-hover:opacity-100 transition-opacity">
                    {service.shortDescription}
                  </p>
                  <ArrowUpRight className="absolute bottom-8 right-8 h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-[#4D00FF]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const WhyMe = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const whyMeData = homeContent?.whyMe || {
    sectionLabel: "WHY SARAHDIGS?",
    headline: "Most consultants skim the surface. I bring a shovel.",
    features: [
      { title: "Data-First Approach", description: "I don't guess. Every recommendation is backed by hard data and user behavior analysis. If the numbers don't support it, we don't do it." },
      { title: "Technical + Creative", description: "I speak both developer and designer. I bridge the gap between technical SEO requirements and engaging brand storytelling." },
      { title: "Actionable Strategy", description: "No 50-page PDFs that gather dust. You get a prioritized roadmap with clear steps, expected impact, and measurable KPIs." },
    ],
  };

  const features = whyMeData.features || [];

  return (
    <section className="py-20 bg-transparent text-[#1B1B1B]">
      <div className="container mx-auto px-6">
        <div className="bg-[#1B1B1B] rounded-[2.5rem] p-12 md:p-24 text-white">
          <div className="mb-20">
            <span className="text-[#F4F2FF] text-lg font-bold uppercase tracking-widest mb-4 block">
              {whyMeData.sectionLabel}
            </span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter max-w-3xl text-white">
              {whyMeData.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature: { title: string; description: string }, i: number) => (
              <div key={i} className="space-y-6">
                <div className="w-12 h-1 bg-[#F4F2FF] mb-8 rounded-full"></div>
                <h3 className="text-2xl font-bold text-[#F4F2FF]">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [emblaApi]);

  // Fetch testimonials from database
  const { data: dbTestimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Fallback testimonials if database is empty
  const fallbackTestimonials = [
    { quote: "Sarah completely transformed how we look at our data.", clientName: "Alex Morgan", clientRole: "SaaS Founder", clientCompany: "" },
    { quote: "The deep dive uncovered opportunities we had been missing for years.", clientName: "Jordan Lee", clientRole: "E-commerce Director", clientCompany: "" },
    { quote: "Finally, a strategy that connects creative with technical SEO.", clientName: "Casey Smith", clientRole: "Marketing VP", clientCompany: "" },
    { quote: "Actionable, clear, and results-driven. Highly recommended.", clientName: "Taylor Reed", clientRole: "Fintech CEO", clientCompany: "" },
    { quote: "We saw a 40% increase in organic traffic within 3 months.", clientName: "Morgan Chen", clientRole: "Head of Growth", clientCompany: "" },
  ];

  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  return (
    <section className="py-20 bg-[#F4F2FF] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative z-10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <span className="text-[#4D00FF] text-lg font-bold uppercase tracking-widest block">
            What clients say
          </span>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 border border-[#1B1B1B]/20 hover:border-accent hover:text-accent rounded-full transition-colors group"
            >
              <ChevronLeft className="h-5 w-5 text-[#1B1B1B] group-hover:text-accent" />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 border border-[#1B1B1B]/20 hover:border-accent hover:text-accent rounded-full transition-colors group"
            >
              <ChevronRight className="h-5 w-5 text-[#1B1B1B] group-hover:text-accent" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4"
              >
                <div className="h-full bg-[#FBFCFE] p-8 rounded-[1.25rem] border border-[#1B1B1B]/10 flex flex-col justify-between hover:border-accent transition-colors duration-300">
                  <p className="text-lg font-medium leading-snug mb-6 text-[#1B1B1B]">
                    "{item.quote}"
                  </p>
                  <div>
                    <div className="font-bold text-[#1B1B1B]">{item.clientName}</div>
                    <div className="text-xs text-[#1B1B1B]/60 uppercase tracking-wide mt-1">
                      {[item.clientRole, item.clientCompany].filter(Boolean).join(" at ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
    
const Contact = () => {
  const { data: homeContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content/home"],
  });

  const contactData = homeContent?.contact || {
    headline: "Ready to dig deep?",
    description: "Let's uncover the Chances hidden in your business. Schedule a discovery call or drop me a line.",
    email: "hello@sarahdigs.com",
    phone: "+20 (106) 282-2666",
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
  };

  return (
    <section className="py-32 bg-transparent text-[#1B1B1B] relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
              Ready to <br />
              <span className="text-[#4D00FF]">dig</span> deep?
            </h2>
            <p className="text-xl text-[#1B1B1B]/80 mb-12 max-w-md">
              Let's uncover the opportunities hidden in your business. Schedule
              a discovery call or drop me a line.
            </p>
            <div className="space-y-4 text-lg">
              <a
                href={`mailto:${contactData.email}`}
                className="block hover:text-[#4D00FF] transition-colors text-[#1B1B1B]"
              >
                {contactData.email}
              </a>
              <a
                href={`tel:${contactData.phone.replace(/\s/g, '')}`}
                className="block hover:text-[#4D00FF] transition-colors text-[#1B1B1B]"
              >
                {contactData.phone}
              </a>
              <div className="flex gap-4 mt-8">
                {(contactData.socialLinks || []).map((link: { platform: string; url: string }, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    className="text-[#1B1B1B]/70 hover:text-[#4D00FF] transition-colors"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#F4F2FF] p-8 md:p-12 shadow-2xl border border-[#1B1B1B]/10 rounded-3xl text-[#1B1B1B] backdrop-blur-sm">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wider text-[#1B1B1B]/80">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-[#1B1B1B]/20 focus:border-[#4D00FF] outline-none py-3 transition-colors rounded-t-lg placeholder:text-[#1B1B1B]/30 text-[#1B1B1B]"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wider text-[#1B1B1B]/80">
                    Company
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-[#1B1B1B]/20 focus:border-[#4D00FF] outline-none py-3 transition-colors rounded-t-lg placeholder:text-[#1B1B1B]/30 text-[#1B1B1B]"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wider text-[#1B1B1B]/80">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-[#1B1B1B]/20 focus:border-[#4D00FF] outline-none py-3 transition-colors rounded-t-lg placeholder:text-[#1B1B1B]/30 text-[#1B1B1B]"
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wider text-[#1B1B1B]/80">
                  Project Type
                </label>
                <select className="w-full bg-transparent border-b border-[#1B1B1B]/20 focus:border-[#4D00FF] outline-none py-3 transition-colors rounded-t-lg [&>option]:text-black text-[#1B1B1B]">
                  <option>SEO and Organic Growth</option>
                  <option>Product-Led Marketing</option>
                  <option>Brand and Strategy</option>
                  <option>Founder-Led Growth</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wider text-[#1B1B1B]/80">
                  Message
                </label>
                <textarea
                  className="w-full bg-transparent border-b border-[#1B1B1B]/20 focus:border-[#4D00FF] outline-none py-3 transition-colors rounded-t-lg min-h-[100px] resize-none placeholder:text-[#1B1B1B]/30 text-[#1B1B1B]"
                  placeholder="Tell me about your project..."
                />
              </div>
              <Button size="lg" className="w-full text-lg h-14">
                Send Message
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};


const Footer = () => null;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBFCFE] text-foreground font-sans selection:bg-accent selection:text-white">
      <Navbar />
      <Hero />
      <Proof />
      <ProblemSolution />
      <Process />
      <Services />
      <WhyMe />
      <Testimonials />
      <Contact />
      <FooterComponent />
    </div>
  );
}