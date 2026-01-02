import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Download, Calendar, Sparkles, Brain, LineChart, BookOpen, Mail, Zap, FileText, MessageSquare } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import type { PageContent } from "@shared/schema";

interface HeroContent {
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

interface ConsultationType {
  title: string;
  slug: string;
  desc: string;
  iconName: string;
  color: string;
}

const iconComponents = {
  Sparkles,
  Brain,
  LineChart,
  Zap,
  BookOpen,
  Mail,
  FileText,
  MessageSquare,
};

type IconName = keyof typeof iconComponents;

const getIconComponent = (iconName: string): React.ElementType => {
  if (iconName in iconComponents) {
    return iconComponents[iconName as IconName];
  }
  return Sparkles;
};

const defaultHeroContent: HeroContent = {
  title: "Expert Guidance to",
  highlightWord: "Future-Proof",
  subtitle: "Your Strategy.",
  rotatingWords: ["Future-Proof", "Strategic", "Data-Driven", "AI-Ready", "Actionable"],
  ctaButton1Text: "Get Consulting Deck",
  ctaButton2Text: "Book a Session",
};

const defaultPainPoints: PainPoint[] = [
  { front: "Unsure where to focus", back: "I analyze your current state and identify the highest-impact opportunities." },
  { front: "Missed growth opportunities", back: "We uncover hidden revenue channels and optimize your existing funnel." },
  { front: "Inefficient processes", back: "I streamline your workflows with AI and automation for maximum output." },
  { front: "Strategy feels stagnant", back: "We inject fresh perspectives and data-backed tactics to reignite growth." },
];

const defaultConsultations: ConsultationType[] = [
  { title: "Strategic Deep Dive", slug: "strategic-deep-dive", desc: "Comprehensive analysis of your business model, market position, and growth levers.", iconName: "Sparkles", color: "bg-[#1B1B1B]" },
  { title: "AI Workflow Optimization", slug: "ai-workflow-optimization", desc: "Tailoring AI integration to your specific team structure and operational needs.", iconName: "Brain", color: "bg-[#4D00FF]" },
  { title: "Leadership Advisory", slug: "leadership-advisory", desc: "One-on-one guidance for executives on navigating market shifts and technology trends.", iconName: "LineChart", color: "bg-[#F4F2FF] text-[#1B1B1B] border-[#1B1B1B]/10" },
  { title: "Quarterly Strategy Review", slug: "quarterly-strategy-review", desc: "Regular check-ins to assess performance, adjust course, and set new targets.", iconName: "Zap", color: "bg-[#1B1B1B]" },
  { title: "Custom Growth Roadmap", slug: "custom-growth-roadmap", desc: "Developing a bespoke step-by-step plan to achieve your specific business objectives.", iconName: "BookOpen", color: "bg-[#4D00FF]" },
];

// Flip Card Component with proper 3D animation
const FlipCard = ({ card, index }: { card: PainPoint; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-52 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-lg border border-[#1B1B1B]/5 p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-10 h-10 rounded-full bg-[#F4F2FF] flex items-center justify-center text-[#4D00FF]">
            <span className="font-bold text-lg">{index + 1}</span>
          </div>
          <h3 className="text-xl font-bold text-[#1B1B1B] leading-tight">
            {card.front}
          </h3>
          <div className="w-8 h-8 rounded-full border border-[#1B1B1B]/10 flex items-center justify-center self-end text-[#1B1B1B]/40">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 w-full h-full bg-[#4D00FF] rounded-3xl shadow-xl p-6 flex flex-col justify-center text-white"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <h3 className="text-lg font-bold mb-4">How I guide you:</h3>
          <p className="text-white/90 leading-relaxed">
            {card.back}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Hero = ({ content, painPoints }: { content: HeroContent; painPoints: PainPoint[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % content.rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [content.rotatingWords.length]);

  return (
    <section className="pt-32 pb-12 bg-[#F4F2FF] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-[#4D00FF]/5 to-transparent -z-10 blur-3xl rounded-full translate-x-1/4"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1] text-[#1B1B1B]">
              {content.title} <span className="text-[#4D00FF]">{content.highlightWord}</span> {content.subtitle}
            </h1>
            
            <div className="mb-8 flex items-center justify-center gap-2 text-lg md:text-3xl font-light text-[#1B1B1B]/60 whitespace-nowrap flex-wrap md:flex-nowrap">
              <span>Consultations that make you</span>
              <div className="h-[1.2em] overflow-hidden inline-flex items-center relative text-left">
                <span className="invisible font-bold">{content.rotatingWords[0]}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={content.rotatingWords[index]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="font-bold text-[#4D00FF] absolute left-0"
                  >
                    {content.rotatingWords[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-lg h-14 px-8 bg-[#1B1B1B] hover:bg-[#4D00FF] text-white transition-all rounded-full shadow-xl group">
                <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                {content.ctaButton1Text}
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-[#1B1B1B]/20 hover:border-[#4D00FF] hover:text-[#4D00FF] transition-all rounded-full">
                <Calendar className="mr-2 h-5 w-5" />
                {content.ctaButton2Text}
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((card, i) => (
            <FlipCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ConsultationsCarousel = ({ consultations }: { consultations: ConsultationType[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="pt-12 pb-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter mb-4">Consultations</h2>
            <p className="text-[#1B1B1B]/60 text-lg">Tailored analysis, guidance, and strategy.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border border-[#1B1B1B]/10 flex items-center justify-center hover:bg-[#1B1B1B] hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border border-[#1B1B1B]/10 flex items-center justify-center hover:bg-[#1B1B1B] hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-6 py-4">
            {consultations.map((consultation, i) => {
              const IconComponent = getIconComponent(consultation.iconName);
              const isLightBg = consultation.color.includes('bg-[#F4F2FF]');
              
              return (
                <div key={i} className="flex-[0_0_85%] md:flex-[0_0_40%] lg:flex-[0_0_30%] pl-6 min-w-0">
                  <div className={`h-full rounded-[2rem] p-8 flex flex-col justify-between min-h-[320px] transition-transform hover:-translate-y-2 hover:shadow-2xl ${consultation.color} ${consultation.color.includes('border') ? 'border' : ''}`}>
                    <div>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isLightBg ? 'bg-white text-[#1B1B1B]' : 'bg-white/10 text-white'}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className={`text-2xl font-bold mb-4 leading-tight ${isLightBg ? 'text-[#1B1B1B]' : 'text-white'}`}>
                        {consultation.title}
                      </h3>
                      <p className={`text-lg leading-relaxed ${isLightBg ? 'text-[#1B1B1B]/70' : 'text-white/70'}`}>
                        {consultation.desc}
                      </p>
                    </div>
                    <div className="mt-8">
                      <Link href={`/services/consultations/${consultation.slug}`}>
                        <Button variant="ghost" className={`p-0 hover:bg-transparent ${isLightBg ? 'text-[#4D00FF] hover:text-[#1B1B1B]' : 'text-white hover:text-white/70'}`}>
                          Learn more <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const FreeValue = () => {
  const resources = [
    {
      title: "Strategy Briefing",
      desc: "A quick overview of how I approach strategic planning and analysis.",
      icon: <Mail className="w-6 h-6" />,
      cta: "Read Briefing",
      tag: "Overview"
    },
    {
      title: "Consulting Process Guide",
      desc: "Understand the steps we take to diagnose and solve your business challenges.",
      icon: <FileText className="w-6 h-6" />,
      cta: "Download Guide",
      tag: "Process"
    },
    {
      title: "Sample Audit Report",
      desc: "See a sanitized example of the depth and actionable insights provided in an audit.",
      icon: <Sparkles className="w-6 h-6" />,
      cta: "View Sample",
      tag: "Example"
    },
    {
      title: "Strategic Frameworks",
      desc: "Key mental models and frameworks I use to make decisions.",
      icon: <MessageSquare className="w-6 h-6" />,
      cta: "Explore Frameworks",
      tag: "Tools"
    }
  ];

  return (
    <section className="py-24 bg-[#FBFCFE]">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="text-[#4D00FF] font-bold uppercase tracking-widest text-sm">Free Resources</span>
          <h2 className="text-4xl font-bold tracking-tighter mt-2">Start with Clarity.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, i) => (
            <div key={i} className="group relative bg-white p-8 rounded-3xl border border-[#1B1B1B]/5 hover:border-[#4D00FF]/30 transition-all hover:shadow-lg">
              <span className="absolute top-4 right-4 bg-[#F4F2FF] text-[#4D00FF] text-xs font-bold px-3 py-1 rounded-full">{resource.tag}</span>
              <div className="w-12 h-12 rounded-2xl bg-[#F4F2FF] flex items-center justify-center text-[#4D00FF] mb-6">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1B1B1B]">{resource.title}</h3>
              <p className="text-[#1B1B1B]/60 leading-relaxed mb-6">{resource.desc}</p>
              <Button variant="link" className="p-0 text-[#4D00FF] font-semibold group-hover:underline">
                {resource.cta} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "How do your consultations differ from typical consulting?", a: "I focus on deep, actionable insights rather than surface-level advice. Every session is tailored to your specific challenges and designed to deliver immediate, implementable value." },
    { q: "What is the typical duration of a consultation?", a: "Sessions range from 90-minute deep dives to multi-day strategic workshops, depending on your needs. We'll determine the best format during our initial discovery call." },
    { q: "How do you structure ongoing advisory relationships?", a: "Ongoing relationships typically include monthly strategy sessions, async support via Slack/email, and quarterly deep-dive reviews. We tailor the cadence to your growth stage and needs." },
    { q: "What industries do you specialize in?", a: "I work primarily with B2B SaaS, e-commerce, and tech-enabled service businesses. My frameworks are adaptable, but these sectors benefit most from my specific expertise." },
  ];

  return (
    <section className="py-24 bg-[#F4F2FF]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tighter mb-4">Common Questions</h2>
            <p className="text-[#1B1B1B]/60 text-lg">Everything you need to know about working together.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#1B1B1B] pr-4">{faq.q}</h3>
                  <div className={`w-8 h-8 rounded-full border border-[#1B1B1B]/10 flex items-center justify-center transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>
                    <span className="text-xl leading-none">+</span>
                  </div>
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[#1B1B1B]/70 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-[#1B1B1B] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4D00FF]/20 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              Ready to unlock your next level?
            </h2>
            <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto">
              Book a discovery call to discuss your challenges and explore how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg h-14 px-8 bg-[#4D00FF] hover:bg-[#3A00CC] text-white rounded-full">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Discovery Call
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-white/30 text-white hover:bg-white/10 rounded-full">
                <Mail className="mr-2 h-5 w-5" />
                Send a Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface PageContentMap {
  hero?: HeroContent;
  painPoints?: PainPoint[];
  consultations?: ConsultationType[];
}

export default function DigInConsultations() {
  const { data: pageContent = {} } = useQuery<PageContentMap>({
    queryKey: ["/api/page-content", "consultations"],
    queryFn: async () => {
      const res = await fetch("/api/page-content/consultations");
      if (!res.ok) return {};
      return res.json();
    },
  });

  const heroContent = (pageContent.hero as HeroContent) || defaultHeroContent;
  const painPoints = (pageContent.painPoints as PainPoint[]) || defaultPainPoints;
  const consultations = (pageContent.consultations as ConsultationType[]) || defaultConsultations;

  return (
    <div className="min-h-screen bg-white text-[#1B1B1B]">
      <Navbar />
      <Hero content={heroContent} painPoints={painPoints} />
      <ConsultationsCarousel consultations={consultations} />
      <FreeValue />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}