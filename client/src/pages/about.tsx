import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Briefcase, Calendar, Layers, Search, LineChart, Globe, FileText, Terminal, BarChart4, Tags, MessageSquare, MessageCircle, Mic, CheckSquare, Building2, Landmark } from "lucide-react";

import stockImage from '@/assets/IMG_6700.jpg';

interface HeroContent {
  title: string;
  name: string;
  intro: string;
  tagline1: string;
  tagline2: string;
  tagline3: string;
  imageUrl?: string;
  backgroundImage?: string;
}

interface StoryContent {
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
}

interface CtaContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

const defaultHero: HeroContent = {
  title: "Meet",
  name: "Sarah!",
  intro: "I'm Sarah, a marketing consultant who digs deep into search, data, and user behavior to help brands grow organically. I keep things simple, strategic, and rooted in what actually works.",
  tagline1: "Depth over Speed",
  tagline2: "Data over Guesswork",
  tagline3: "Clarity over Jargon",
};

const defaultStory: StoryContent = {
  paragraph1: "I didn't start as a consultant. I started in the trenches of digital marketing, managing campaigns for fast-paced startups where every dollar spent needed to show a return.",
  paragraph2: "Over the last 8 years, I've worked with everything from scrappy SaaS startups to established e-commerce giants. I noticed a pattern: most companies were sitting on a goldmine of data but were too busy chasing the shiny \"hack\" to notice it.",
  paragraph3: "That's why I started SarahDigs. I wanted to offer a different kind of partnership—one that values depth, honesty, and excavation. I don't just hand you a report and walk away. I dig in with you to build a foundation that lasts.",
};

const defaultCta: CtaContent = {
  title: "Ready to Dig Deep?",
  subtitle: "Let's uncover the opportunities hidden in your data. No fluff, just growth.",
  buttonText: "Let's dig",
};

const AboutHero = ({ content }: { content: HeroContent }) => {
  const heroImage = stockImage;
  
  return (
    <section className="pt-40 pb-20 bg-[#FBFCFE] relative overflow-hidden">
      {/* Background image on the right half */}
      <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block pointer-events-none" style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: '115%',
        backgroundPosition: 'center 35%',
        opacity: 0.85,
      }} />
      <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block pointer-events-none bg-gradient-to-r from-[#FBFCFE] to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] flex items-center gap-6"
            >
              {content.title} <br/>{content.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl font-light text-[#1B1B1B]/80 leading-relaxed max-w-lg relative"
            >
              {content.intro}

              {/* Mobile Layout - Horizontal Stack below text */}
              <div className="flex flex-wrap gap-2 mt-6 md:hidden">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-[#4D00FF] text-white px-3 py-2 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-wider"
                >
                   {content.tagline1}
                </motion.div>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="bg-[#1B1B1B] text-white px-3 py-2 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-wider"
                >
                   {content.tagline2}
                </motion.div>
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className="bg-white border border-[#1B1B1B]/10 text-[#4D00FF] px-3 py-2 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-wider"
                >
                   {content.tagline3}
                </motion.div>
              </div>
            </motion.p>
          </div>
          <div className="lg:w-1/2 relative hidden lg:block">
            {/* Bubbles Visual - floating over background image area */}
            <div className="relative h-[400px] flex items-end">
               <div className="absolute bottom-16 left-6 flex flex-col gap-3 z-20">
                <motion.div
                  animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-[#4D00FF] text-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap self-start"
                >
                   {content.tagline1}
                </motion.div>

                <motion.div
                  animate={{ x: [0, -5, 0], y: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="bg-[#1B1B1B] text-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-6"
                >
                   {content.tagline2}
                </motion.div>

                <motion.div
                  animate={{ x: [0, 5, 0], y: [0, 5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="bg-white border border-[#1B1B1B]/10 text-[#4D00FF] px-4 py-2 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap self-start ml-2"
                >
                   {content.tagline3}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyTrustMe = () => {
  return (
    <section className="py-24 bg-white border-b border-[#1B1B1B]/10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4D00FF]">Why Trust Me?</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mt-4 mb-8">
            I bridge the gap between technical complexity and human connection.
          </h2>
          <p className="text-lg text-[#1B1B1B]/70 leading-relaxed">
            I help ambitious brands who are tired of surface-level tactics. My method works because I don't just look at the "what" (metrics), I uncover the "why" (behavior). By combining technical SEO precision with deep user empathy, I build growth engines that are sustainable, scalable, and surprisingly simple.
          </p>
        </div>
      </div>
    </section>
  );
};

const MyStory = ({ content }: { content: StoryContent }) => {
  return (
    <section className="py-24 bg-[#FBFCFE]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <motion.h2 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.85]"
            >
              My<br/>Story
            </motion.h2>
          </div>
           <div className="lg:w-2/3 text-lg text-[#1B1B1B]/80 leading-relaxed space-y-6">
              <p>{content.paragraph1}</p>
              <p>{content.paragraph2}</p>
              <p>{content.paragraph3}</p>
           </div>
        </div>
      </div>
    </section>
  );
};

const ClientStories = () => {
  const clients = [
     {
       name: "TechFlow SaaS",
       desc: "Scaled organic traffic from 5k to 50k monthly visitors in 12 months.",
       tags: ["SaaS", "SEO"],
       slug: "techflow"
     },
     {
       name: "FinSmart",
       desc: "Built a content engine that generates 100+ qualified leads per month.",
       tags: ["Fintech", "Content"],
       slug: "finsmart"
     }
  ];

  return (
    <section className="py-24 bg-white border-b border-[#1B1B1B]/10">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tighter mb-12">Digging for results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {clients.map((client, i) => (
             <Link key={i} href={`/projects/${client.slug}`}>
               <div className="group bg-[#FBFCFE] border border-[#1B1B1B]/10 p-8 rounded-3xl hover:border-[#4D00FF] transition-all hover:shadow-lg cursor-pointer relative overflow-hidden h-full">
                 <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowUpRight className="w-6 h-6 text-[#4D00FF]" />
                 </div>
                 <div className="mb-6 flex gap-2">
                   {client.tags.map(tag => (
                     <span key={tag} className="text-xs font-bold uppercase tracking-wider bg-[#F4F2FF] text-[#4D00FF] px-3 py-1 rounded-full">{tag}</span>
                   ))}
                 </div>
                 <h3 className="text-2xl font-bold mb-4">{client.name}</h3>
                 <p className="text-[#1B1B1B]/70 leading-relaxed mb-8">
                   {client.desc}
                 </p>
                 <div className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B] group-hover:text-[#4D00FF] transition-colors flex items-center gap-2 mt-auto">
                   View Story <ArrowRight className="w-4 h-4" />
                 </div>
               </div>
             </Link>
           ))}
        </div>
      </div>
    </section>
  );
};

const Expertise = () => {
  const areas = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Conversion Rate Optimization",
      desc: "Helped 30+ SaaS companies increase conversion rates by an average of 40% through data-driven A/B testing and user journey mapping."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Technical SEO Recovery",
      desc: "Recovered a major brand from years' worth of penalties, restoring and surpassing previous traffic levels within 6 months."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Content Strategy",
      desc: "Designed content engines for 50+ startups that reduced CAC by 30% while doubling organic lead volume."
    }
  ];

  return (
    <section className="py-24 bg-[#FBFCFE] border-b border-[#1B1B1B]/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4D00FF]">Expertise</span>
            <h2 className="text-4xl font-bold tracking-tighter mt-4 mb-6">Specific expertise, concrete results.</h2>
            <p className="text-[#1B1B1B]/70 leading-relaxed">
              I don't do "general marketing". I specialize in the channels and strategies that drive sustainable, long-term growth.
            </p>
          </div>
          <div className="lg:w-2/3 space-y-8">
            {areas.map((area, i) => (
              <div key={i} className="flex gap-6 items-start p-6 bg-white rounded-2xl border border-[#1B1B1B]/5">
                <div className="bg-[#F4F2FF] text-[#4D00FF] p-3 rounded-xl">{area.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{area.title}</h3>
                  <p className="text-[#1B1B1B]/70 leading-relaxed">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Timeline = () => {
  const milestones = [
    { year: "2019", title: "Started in digital marketing", desc: "Cut my teeth in paid ads and social." },
    { year: "2020", title: "Specialized in SEO & Content", desc: "Discovered the power of organic growth." },
    { year: "2021", title: "Agency Life", desc: "Worked with SaaS, e-commerce, and diverse clients." },
    { year: "2023", title: "Head of Growth", desc: "Led organic growth for multiple 7-figure brands." },
    { year: "2025", title: "Launched SarahDigs", desc: "Bringing my excavation method to the world." }
  ];

  return (
    <section className="py-24 bg-[#F4F2FF]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4D00FF]">The Path</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#1B1B1B] mt-4">My Journey</h2>
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden md:block relative">
          <div className="absolute top-[52px] left-0 right-0 h-[2px] bg-[#4D00FF]/15"></div>
          <div className="grid grid-cols-5 gap-6 relative">
            {milestones.map((m, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <span className="text-[#4D00FF] font-bold text-2xl mb-4">{m.year}</span>
                <div className="w-5 h-5 rounded-full bg-[#4D00FF] border-4 border-[#F4F2FF] relative z-10 mb-6 group-hover:scale-125 transition-transform"></div>
                <div className="bg-white border border-[#1B1B1B]/10 rounded-2xl p-5 h-full hover:border-[#4D00FF]/40 hover:shadow-lg transition-all">
                  <h3 className="font-bold text-[#1B1B1B] mb-2 text-sm">{m.title}</h3>
                  <p className="text-[#1B1B1B]/60 text-xs leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden relative pl-8">
          <div className="absolute top-0 bottom-0 left-[11px] w-[2px] bg-[#4D00FF]/15"></div>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="relative flex items-start gap-6">
                <div className="absolute left-[-21px] top-1 w-4 h-4 rounded-full bg-[#4D00FF] border-[3px] border-[#F4F2FF] z-10"></div>
                <div className="bg-white border border-[#1B1B1B]/10 rounded-2xl p-5 flex-1">
                  <span className="text-[#4D00FF] font-bold text-sm">{m.year}</span>
                  <h3 className="font-bold text-[#1B1B1B] mt-1 mb-1">{m.title}</h3>
                  <p className="text-[#1B1B1B]/60 text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Tools = () => {
  const tools = [
    { name: "Ahrefs", icon: <Search className="w-8 h-8" />, url: "https://ahrefs.com" },
    { name: "SEMRush", icon: <BarChart4 className="w-8 h-8" />, url: "https://semrush.com" },
    { name: "Tag Manager", icon: <Tags className="w-8 h-8" />, url: "https://tagmanager.google.com" },
    { name: "Webflow", icon: <Globe className="w-8 h-8" />, url: "https://webflow.com" },
    { name: "WordPress", icon: <Landmark className="w-8 h-8" />, url: "https://wordpress.org" },
    { name: "Screaming Frog", icon: <Terminal className="w-8 h-8" />, url: "https://screamingfrog.co.uk" },
    { name: "ChatGPT", icon: <MessageSquare className="w-8 h-8" />, url: "https://chat.openai.com" },
    { name: "Claude", icon: <MessageCircle className="w-8 h-8" />, url: "https://claude.ai" },
    { name: "Elevenlabs", icon: <Mic className="w-8 h-8" />, url: "https://elevenlabs.io" },
    { name: "Notion", icon: <FileText className="w-8 h-8" />, url: "https://notion.so" },
  ];

  // Duplicate for seamless loop
  const allTools = [...tools, ...tools];

  return (
    <section className="py-24 bg-[#FBFCFE] border-t border-[#1B1B1B]/10 overflow-hidden">
       <div className="container mx-auto px-6">
         <h2 className="text-4xl font-bold tracking-tighter text-center mb-16">Tools of the trade</h2>
       </div>
       
       {/* Marquee container */}
       <div className="relative w-full overflow-hidden">
         <motion.div
           className="flex gap-8"
           animate={{
             x: [0, -50 * tools.length * 2],
           }}
           transition={{
             x: {
               repeat: Infinity,
               repeatType: "loop",
               duration: 30,
               ease: "linear",
             },
           }}
           style={{ width: "fit-content" }}
         >
           {allTools.map((tool, i) => (
             <a 
               key={i}
               href={tool.url}
               target="_blank"
               rel="noopener noreferrer"
               className="flex flex-col items-center gap-4 min-w-[120px] group"
             >
               <div className="w-20 h-20 bg-[#F5F5F5] rounded-2xl flex items-center justify-center text-[#1B1B1B]/50 group-hover:text-[#4D00FF] group-hover:bg-[#F4F2FF] transition-all shadow-sm">
                 {tool.icon}
               </div>
               <span className="text-sm text-[#1B1B1B]/60 group-hover:text-[#4D00FF] font-medium whitespace-nowrap transition-colors">{tool.name}</span>
             </a>
           ))}
         </motion.div>
       </div>
    </section>
  );
};

const FinalCTA = ({ content }: { content: CtaContent }) => {
  return (
    <section className="py-32 bg-[#1B1B1B] text-white text-center">
       <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">{content.title}</h2>
          <p className="text-xl text-white/70 max-w-xl mx-auto mb-10">{content.subtitle}</p>
          <Link href="/contact">
            <Button size="lg" className="text-lg h-16 px-10 bg-[#4D00FF] hover:bg-white hover:text-[#4D00FF] transition-all rounded-full">
              {content.buttonText}
            </Button>
          </Link>
       </div>
    </section>
  );
};

export default function About() {
  const { data: pageContent } = useQuery<Record<string, any>>({
    queryKey: ["/api/page-content", "about"],
    queryFn: async () => {
      const res = await fetch("/api/page-content/about");
      if (!res.ok) return {};
      return res.json();
    },
  });

  const heroContent = (pageContent?.hero as HeroContent) || defaultHero;
  const storyContent = (pageContent?.story as StoryContent) || defaultStory;
  const ctaContent = (pageContent?.cta as CtaContent) || defaultCta;

  return (
    <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />
      <AboutHero content={heroContent} />
      <WhyTrustMe />
      <MyStory content={storyContent} />
      <ClientStories />
      <Expertise />
      <Timeline />
      <Tools />
      <FinalCTA content={ctaContent} />
      <Footer />
    </div>
  );
}