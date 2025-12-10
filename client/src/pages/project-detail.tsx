import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target
} from "lucide-react";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data for projects
const projectsData = {
  "techflow": {
    name: "TechFlow",
    website: "techflow.io",
    industry: "B2B SaaS",
    type: "SEO Strategy",
    icon: TrendingUp,
    hero: {
      description: "Enterprise Project Management Software",
      oneLiner: "Recovering organic traffic after a failed site migration and scaling lead generation.",
      highlight: "From 5k to 50k monthly visitors."
    },
    situation: {
      title: "The Migration Disaster",
      description: "TechFlow migrated their site from WordPress to Webflow without a proper redirect strategy. Organic traffic tanked by 60% overnight. Leads dried up, and the sales team was panicking. They needed a fix, fast."
    },
    approach: {
      title: "Technical Triage & Content Velocity",
      steps: [
        "Comprehensive Technical Audit to fix broken redirects and 404s.",
        "Restructuring site architecture to match user intent.",
        "Launching a high-velocity content engine targeting bottom-of-funnel keywords.",
        "Building high-quality backlinks from industry relevant domains."
      ]
    },
    timeline: [
      { phase: "Month 1", title: "Triage", desc: "Fixed 400+ broken links, implemented 301 redirects, fixed canonical tags." },
      { phase: "Month 2", title: "Foundation", desc: "Keyword research, content strategy, competitor analysis." },
      { phase: "Month 3-6", title: "Velocity", desc: "Published 40+ articles, started link building campaign." },
      { phase: "Month 6-12", title: "Scale", desc: "Optimization, updating old content, expanding into new topic clusters." },
      { phase: "Month 12-18", title: "Expansion", desc: "Launched international subdomains and localized content." },
      { phase: "Year 2", title: "Dominance", desc: "Achieved #1 ranking for primary category keywords globally." }
    ],
    results: [
      { label: "Organic Traffic", value: "+450%" },
      { label: "Qualified Leads", value: "3x" },
      { label: "CAC Reduction", value: "-40%" }
    ],
    images: [
      "bg-[#F4F2FF]", // Placeholder colors for now
      "bg-[#FBFCFE]",
      "bg-[#1B1B1B]"
    ]
  },
  "lumina": {
    name: "Lumina",
    website: "lumina-fashion.com",
    industry: "E-commerce",
    type: "Technical Audit",
    icon: BarChart3,
    hero: {
      description: "Modern Sustainable Fashion Brand",
      oneLiner: "Fixing critical crawl budget issues and implementing programmatic SEO for product pages.",
      highlight: "$2.4M Additional Revenue Attributed to SEO."
    },
    situation: {
      title: "Invisible Products",
      description: "Lumina had over 10,000 SKUs, but Google was only indexing 15% of them. Their faceted navigation was creating millions of duplicate pages, wasting crawl budget and diluting authority."
    },
    approach: {
      title: "Crawl Budget Optimization",
      steps: [
        "Implemented proper canonical tags for all product variants.",
        "Fixed faceted navigation with robots.txt rules and parameter handling.",
        "Created a programmatic SEO strategy for 'Category + Attribute' pages.",
        "Optimized internal linking structure to boost deep pages."
      ]
    },
    timeline: [
      { phase: "Month 1", title: "Audit", desc: "Deep crawl analysis, log file analysis, identifying waste." },
      { phase: "Month 2", title: "Fix", desc: "Implemented technical fixes, pruned low-value pages." },
      { phase: "Month 3-4", title: "Programmatic", desc: "Launched 500+ targeted landing pages for long-tail keywords." },
      { phase: "Month 5+", title: "Growth", desc: "Monitoring indexation rates and optimizing conversion paths." },
      { phase: "Month 9", title: "Conversion", desc: "Implemented advanced CRO tests on high-traffic product pages." },
      { phase: "Year 1", title: "Scale", desc: "Expanded strategy to new product lines and international markets." }
    ],
    results: [
      { label: "Pages Indexed", value: "98%" },
      { label: "Organic Revenue", value: "+$2.4M" },
      { label: "Crawl Efficiency", value: "+300%" }
    ],
    images: [
      "bg-[#F4F2FF]",
      "bg-[#FBFCFE]",
      "bg-[#1B1B1B]"
    ]
  },
  "finsmart": {
    name: "FinSmart",
    website: "finsmart.io",
    industry: "Fintech",
    type: "Content Engine",
    icon: Users,
    hero: {
      description: "Personal Finance Dashboard for Gen Z",
      oneLiner: "Building a content machine to capture high-intent bottom-of-funnel keywords.",
      highlight: "150+ Qualified Leads Per Month from Zero."
    },
    situation: {
      title: "Zero Authority in a Crowded Market",
      description: "FinSmart was a new player in a market dominated by giants like NerdWallet. They had zero domain authority and no organic traffic. Paid ads were too expensive (CPC > $20)."
    },
    approach: {
      title: "The 'Alternative To' Strategy",
      steps: [
        "Focused entirely on 'Best X for Y' and 'Competitor vs FinSmart' keywords.",
        "Created in-depth, unbiased comparison guides.",
        "Leveraged user-generated content and case studies.",
        "Built a digital PR campaign to earn high-authority trust signals."
      ]
    },
    timeline: [
      { phase: "Month 1", title: "Research", desc: "Identified low-difficulty, high-intent keywords competitors ignored." },
      { phase: "Month 2-3", title: "Build", desc: "Created 20 'Power Pages' targeting comparison terms." },
      { phase: "Month 4", title: "Distribute", desc: "Digital PR push, community engagement on Reddit/Twitter." },
      { phase: "Month 6", title: "Dominate", desc: "Ranking #1-3 for main competitor comparison terms." },
      { phase: "Month 9", title: "Authority", desc: "Secured placements in major financial publications." },
      { phase: "Year 1", title: "Retention", desc: "Launched email nurture sequences for organic leads." }
    ],
    results: [
      { label: "Monthly Leads", value: "150+" },
      { label: "Cost Per Lead", value: "-85%" },
      { label: "Domain Authority", value: "0 -> 45" }
    ],
    images: [
      "bg-[#F4F2FF]",
      "bg-[#FBFCFE]",
      "bg-[#1B1B1B]"
    ]
  }
};

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug;
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!slug || !projectsData[slug as keyof typeof projectsData]) {
    return <NotFound />;
  }

  const project = projectsData[slug as keyof typeof projectsData];
  const Icon = project.icon;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % project.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-[#FBFCFE]">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-12 items-start md:items-center mb-24"
          >
            <div className="w-24 h-24 bg-white rounded-2xl border border-[#1B1B1B]/10 flex items-center justify-center shadow-lg shrink-0">
              <Icon className="w-10 h-10 text-[#4D00FF]" />
            </div>
            <div>
               <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-4">
                {project.name}
               </h1>
               <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-[#1B1B1B]/60 text-lg">
                 <span>{project.hero.description}</span>
                 <span className="hidden md:block w-1 h-1 bg-[#1B1B1B]/20 rounded-full"></span>
                 <a href={`https://${project.website}`} target="_blank" rel="noreferrer" className="hover:text-[#4D00FF] transition-colors flex items-center gap-1">
                   {project.website} <ArrowUpRight className="w-4 h-4" />
                 </a>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl"
          >
            <p className="text-2xl md:text-4xl font-medium leading-tight">
              {project.hero.oneLiner} <br /> <span className="bg-[#4D00FF]/10 text-[#4D00FF] px-2 rounded-lg decoration-clone">{project.hero.highlight}</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Situation & Approach */}
      <section className="py-24 bg-white border-t border-[#1B1B1B]/5">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Situation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-[#F4F2FF] flex items-center justify-center text-[#4D00FF]">
                      <Target className="w-5 h-5" />
                   </div>
                   <h2 className="text-2xl font-bold uppercase tracking-wide">The Situation</h2>
                 </div>
                 <h3 className="text-3xl font-bold mb-6">{project.situation.title}</h3>
                 <p className="text-xl text-[#1B1B1B]/70 leading-relaxed">
                   {project.situation.description}
                 </p>
              </motion.div>

              {/* Approach */}
              <motion.div
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
              >
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-[#1B1B1B] flex items-center justify-center text-white">
                      <CheckCircle2 className="w-5 h-5" />
                   </div>
                   <h2 className="text-2xl font-bold uppercase tracking-wide">Our Approach</h2>
                 </div>
                 <h3 className="text-3xl font-bold mb-6">{project.approach.title}</h3>
                 <ul className="space-y-4">
                   {project.approach.steps.map((step, i) => (
                     <li key={i} className="flex items-start gap-4 text-lg text-[#1B1B1B]/80">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#4D00FF] mt-2.5 shrink-0"></span>
                       {step}
                     </li>
                   ))}
                 </ul>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#F4F2FF]">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
               <Clock className="w-6 h-6 text-[#4D00FF]" /> Project Timeline
             </h2>
           </div>

           <div className="relative py-12">
              {/* Main Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1B1B1B]/10 -translate-y-1/2 hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
                {project.timeline.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-col-reverse md:mb-12' : 'md:flex-col md:mt-12'}`}
                  >
                     {/* Main Axis Dot */}
                     <div className={`w-4 h-4 rounded-full bg-[#FBFCFE] border-[3px] border-[#4D00FF] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:block z-10`}></div>

                     {/* Mobile Layout */}
                     <div className="md:hidden pl-8 border-l-2 border-[#1B1B1B]/10 pb-12 relative">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#4D00FF] border-2 border-white"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#4D00FF] mb-2 block">{item.phase}</span>
                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                        <p className="text-[#1B1B1B]/70 text-sm leading-relaxed">{item.desc}</p>
                     </div>

                     {/* Desktop Content */}
                     <div className={`hidden md:flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-sm border border-[#1B1B1B]/5 hover:shadow-md transition-all relative z-20 max-w-[200px] mx-auto ${i % 2 === 0 ? 'mb-8' : 'mt-8'}`}>
                        {/* Connection Dot on Card */}
                        <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#4D00FF] ${i % 2 === 0 ? 'top-[-6px]' : 'bottom-[-6px]'}`}></div>
                        
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4D00FF] mb-1 block">{item.phase}</span>
                        <h4 className="text-lg font-bold mb-1 leading-tight">{item.title}</h4>
                        <p className="text-[#1B1B1B]/70 text-xs leading-snug">{item.desc}</p>
                     </div>
                  </motion.div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Key Results & Slideshow */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
             {/* Results */}
             <div className="lg:w-1/3 space-y-8">
               <h2 className="text-4xl font-bold tracking-tighter mb-8">Key Results</h2>
               <div className="space-y-6">
                 {project.results.map((result, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-[#FBFCFE] p-8 rounded-3xl border border-[#1B1B1B]/5"
                   >
                      <div className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B]/50 mb-2">{result.label}</div>
                      <div className="text-4xl md:text-5xl font-bold text-[#4D00FF]">{result.value}</div>
                   </motion.div>
                 ))}
               </div>
             </div>

             {/* Slideshow */}
             <div className="lg:w-2/3">
               <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] bg-[#F4F2FF] group">
                 {/* Images (Placeholder colors for now) */}
                 <motion.div 
                   key={currentSlide}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.5 }}
                   className={`w-full h-full ${project.images[currentSlide]} flex items-center justify-center`}
                 >
                    <span className="text-[#1B1B1B]/20 text-2xl font-bold">Project Image {currentSlide + 1}</span>
                 </motion.div>

                 {/* Controls */}
                 <div className="absolute bottom-8 right-8 flex gap-4">
                    <button 
                      onClick={prevSlide}
                      className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:text-[#4D00FF] transition-all shadow-lg"
                    >
                       <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="w-14 h-14 rounded-full bg-[#1B1B1B]/90 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#4D00FF] transition-all shadow-lg"
                    >
                       <ArrowRight className="w-6 h-6" />
                    </button>
                 </div>

                 {/* Indicators */}
                 <div className="absolute bottom-8 left-8 flex gap-2">
                   {project.images.map((_, i) => (
                     <div 
                       key={i} 
                       className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-[#1B1B1B]' : 'bg-[#1B1B1B]/20'}`}
                     ></div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
