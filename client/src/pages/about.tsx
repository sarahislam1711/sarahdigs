import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Briefcase, Calendar, Layers, Search, LineChart, Globe, FileText, Terminal, BarChart4, Tags, MessageSquare, MessageCircle, Mic, CheckSquare } from "lucide-react";

import stockImage from '@assets/sarah-portrait.jpeg';

const AboutHero = () => {
  return (
    <section className="pt-40 pb-20 bg-[#FBFCFE]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] flex items-center gap-6"
            >
              Meet <br/>Sarah!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl font-light text-[#1B1B1B]/80 leading-relaxed max-w-lg relative"
            >
              I'm Sarah, a marketing consultant who digs deep into search, data, and user behavior to help brands grow organically. I keep things simple, strategic, and rooted in what actually works.

              {/* Mobile Layout - Horizontal Stack below text */}
              <div className="flex flex-wrap gap-2 mt-6 md:hidden">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-[#4D00FF] text-white px-3 py-2 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-wider"
                >
                   Depth over Speed
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="bg-[#1B1B1B] text-white px-3 py-2 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-wider"
                >
                   Data over Guesswork
                </motion.div>
                <motion.div 
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className="bg-white border border-[#1B1B1B]/10 text-[#4D00FF] px-3 py-2 rounded-xl shadow-lg text-[10px] font-bold uppercase tracking-wider"
                >
                   Clarity over Jargon
                </motion.div>
              </div>
            </motion.p>
          </div>
          <div className="lg:w-1/2 relative hidden lg:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-10"
            >
               <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden">
                 <img src={stockImage} alt="Sarah Portrait" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B]/50 to-transparent opacity-50"></div>
               </div>

               {/* Bubbles Visual - Vertically Stacked overlapping image */}
               <div className="absolute bottom-16 -left-10 flex flex-col gap-3 z-20">
                <motion.div 
                  animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-[#4D00FF] text-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap self-start"
                >
                   Depth over Speed
                </motion.div>

                <motion.div 
                  animate={{ x: [0, -5, 0], y: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="bg-[#1B1B1B] text-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-6"
                >
                   Data over Guesswork
                </motion.div>

                <motion.div 
                  animate={{ x: [0, 5, 0], y: [0, 5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="bg-white border border-[#1B1B1B]/10 text-[#4D00FF] px-4 py-2 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap self-start ml-2"
                >
                   Clarity over Jargon
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyTrustMe = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[#4D00FF] font-bold uppercase tracking-widest text-lg mb-4 block">Why Trust Me?</span>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-8">
            I bridge the gap between technical complexity and human connection.
          </h2>
          <p className="text-xl text-[#1B1B1B]/70 leading-relaxed">
            I help ambitious brands who are tired of surface-level tactics. My method works because I don't just look at the "what" (metrics), I uncover the "why" (behavior). By combining technical SEO precision with deep user empathy, I build growth engines that are sustainable, scalable, and surprisingly simple.
          </p>
        </div>
      </div>
    </section>
  );
};

const MyStory = () => {
  return (
    <section className="py-24 bg-[#F4F2FF]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
           <div className="lg:w-1/3 sticky top-32">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">My Story</h2>
              <div className="w-20 h-1 bg-[#4D00FF]"></div>
           </div>
           <div className="lg:w-2/3 space-y-8 text-lg leading-relaxed text-[#1B1B1B]/80">
              <p>
                I didn't start as a consultant. I started in the trenches of digital marketing, managing campaigns for fast-paced startups where every dollar spent needed to show a return.
              </p>
              <p>
                Over the last 6 years, I've worked with everything from scrappy SaaS startups to established e-commerce giants. I noticed a pattern: most companies were sitting on a goldmine of data but were too busy chasing the latest "hack" to notice it.
              </p>
              <p>
                They were creating content blindly, hoping something would stick. They were ignoring technical debt that was silently killing their growth.
              </p>
              <p>
                That's why I started SarahDigs. I wanted to offer a different kind of partnership—one that values depth, honesty, and excavation. I don't just hand you a report and walk away. I dig in with you to build a foundation that lasts.
              </p>
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
       name: "Urban Wear",
       desc: "Fixed technical debt and recovered 40% lost revenue from site migration.",
       tags: ["E-commerce", "Technical"],
       slug: "lumina"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
   return (
     <section className="py-24 bg-white">
       <div className="container mx-auto px-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           <div>
             <span className="text-[#4D00FF] font-bold uppercase tracking-widest text-lg mb-4 block">Expertise</span>
             <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">
               Specific expertise, <br/>concrete results.
             </h2>
             <p className="text-lg text-[#1B1B1B]/70 max-w-md">
               I don't do "general marketing". I specialize in the channels and strategies that drive sustainable, long-term growth.
             </p>
           </div>
           <div className="grid grid-cols-1 gap-8">
              <div className="flex gap-6 items-start">
                 <div className="w-16 h-16 bg-[#F4F2FF] rounded-2xl flex items-center justify-center shrink-0">
                    <LineChart className="w-8 h-8 text-[#4D00FF]" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">Conversion Rate Optimization</h3>
                   <p className="text-[#1B1B1B]/70 leading-relaxed">
                     Helped 15+ SaaS companies increase conversion rates by an average of 40% through data-driven A/B testing and user journey mapping.
                   </p>
                 </div>
              </div>
              <div className="flex gap-6 items-start">
                 <div className="w-16 h-16 bg-[#F4F2FF] rounded-2xl flex items-center justify-center shrink-0">
                    <Search className="w-8 h-8 text-[#4D00FF]" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">Technical SEO Recovery</h3>
                   <p className="text-[#1B1B1B]/70 leading-relaxed">
                     Recovered 3 major brands from algorithmic penalties, restoring and surpassing previous traffic levels within 6 months.
                   </p>
                 </div>
              </div>
              <div className="flex gap-6 items-start">
                 <div className="w-16 h-16 bg-[#F4F2FF] rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-8 h-8 text-[#4D00FF]" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">Content Strategy</h3>
                   <p className="text-[#1B1B1B]/70 leading-relaxed">
                     Designed content engines for B2B startups that reduced CAC by 30% while doubling organic lead volume.
                   </p>
                 </div>
              </div>
           </div>
         </div>
       </div>
     </section>
   );
};

const Timeline = () => {
  const events = [
    { year: "2019", title: "Started in digital marketing", desc: "Cut my teeth in paid ads and social." },
    { year: "2020", title: "Specialized in SEO & Content", desc: "Discovered the power of organic growth." },
    { year: "2021", title: "Agency Life", desc: "Worked with SaaS, e-commerce, and diverse clients." },
    { year: "2023", title: "Head of Growth", desc: "Led organic growth for multiple 7-figure brands." },
    { year: "2025", title: "Launched SarahDigs", desc: "Bringing my excavation method to the world." }
  ];

  return (
    <section className="py-24 bg-[#F4F2FF] overflow-x-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tighter mb-24 text-center">My Journey</h2>
        
        <div className="relative">
          {/* Horizontal Line (Desktop) */}
          <div className="hidden md:block absolute top-[7px] left-0 right-0 h-[2px] bg-[#1B1B1B]/10"></div>
          
          {/* Vertical Line (Mobile) */}
          <div className="md:hidden absolute left-[15px] top-0 bottom-0 w-[2px] bg-[#1B1B1B]/10"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-4">
            {events.map((event, i) => (
              <div key={i} className="flex md:flex-col gap-6 md:gap-8 relative">
                 {/* Dot */}
                 <div className="shrink-0 w-8 h-8 rounded-full bg-white border-4 border-[#F4F2FF] shadow-lg flex items-center justify-center z-10 relative md:mx-auto">
                    <div className="w-3 h-3 bg-[#4D00FF] rounded-full"></div>
                 </div>
                 
                 <div className="md:text-center pt-1">
                   <span className="text-sm font-bold uppercase tracking-widest text-[#4D00FF] mb-2 block">{event.year}</span>
                   <h3 className="text-lg font-bold mb-2 leading-tight">{event.title}</h3>
                   <p className="text-sm text-[#1B1B1B]/70 leading-relaxed">{event.desc}</p>
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
    { name: "Search Console", icon: Search },
    { name: "GA4", icon: LineChart },
    { name: "Ahrefs", icon: Layers },
    { name: "SEMRush", icon: BarChart4 },
    { name: "Tag Manager", icon: Tags },
    { name: "Webflow", icon: Globe },
    { name: "WordPress", icon: Briefcase },
    { name: "Screaming Frog", icon: Terminal },
    { name: "ChatGPT", icon: MessageSquare },
    { name: "Claude", icon: MessageCircle },
    { name: "Elevenlabs", icon: Mic },
    { name: "Notion", icon: FileText },
    { name: "ClickUp", icon: CheckSquare }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter">Tools of the trade</h2>
      </div>
      
      <div className="relative w-full">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div className="flex overflow-hidden">
          <motion.div 
            className="flex gap-12 md:gap-20 items-center px-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            {[...tools, ...tools].map((tool, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group shrink-0 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default">
                 <div className="w-20 h-20 bg-[#FBFCFE] rounded-2xl border border-[#1B1B1B]/10 flex items-center justify-center group-hover:border-[#4D00FF] group-hover:shadow-lg transition-all duration-300">
                    <tool.icon className="w-8 h-8 text-[#1B1B1B] group-hover:text-[#4D00FF] transition-colors" />
                 </div>
                 <span className="font-medium text-sm whitespace-nowrap">{tool.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-32 bg-[#1B1B1B] text-white text-center">
       <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">Ready to Dig Deep?</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
            Let's uncover the opportunities hidden in your data. No fluff, just growth.
          </p>
          <Button size="lg" className="text-lg h-16 px-10 bg-[#4D00FF] hover:bg-white hover:text-[#4D00FF] transition-all rounded-full">
            Book a Free Consultation
          </Button>
       </div>
    </section>
  );
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />
      <AboutHero />
      <WhyTrustMe />
      <MyStory />
      <ClientStories />
      <Expertise />
      <Timeline />
      <Tools />
      <FinalCTA />
      <Footer />
    </div>
  );
}
