import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Hero = () => {
  return (
    <section className="pt-32 pb-12 bg-[#F4F2FF] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-[#4D00FF]/10 text-[#4D00FF] text-sm font-bold uppercase tracking-widest mb-6">
                Custom Solutions Built Around You
              </span>
              <h1 className="text-5xl md:text-7xl tracking-tighter mb-6 leading-[0.95] text-[#1B1B1B] font-bold text-left">
                Your business is unique. <br />
                <span className="text-[#4D00FF]">Your marketing should be too.</span>
              </h1>
              <p className="text-xl text-[#1B1B1B]/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Custom-built brand, strategy, and SEO packages tailored to your exact stage, challenge, and goals.
              </p>
              <Button
                size="lg"
                className="text-lg h-16 px-12 bg-[#1B1B1B] hover:bg-[#4D00FF] text-white transition-all rounded-full shadow-xl"
                onClick={() => document.getElementById("custom-plan-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Start Your Custom Plan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-square md:aspect-video lg:aspect-square bg-white rounded-[2.5rem] shadow-2xl border border-[#1B1B1B]/5 p-8 flex items-center justify-center overflow-hidden">
              {/* Animated Modular Blocks Visual */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md relative z-10">
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="h-32 bg-[#4D00FF] rounded-2xl"
                />
                <motion.div 
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="h-32 bg-[#1B1B1B] rounded-2xl"
                />
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-32 bg-[#F4F2FF] rounded-2xl border-2 border-[#4D00FF] border-dashed"
                />
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="h-32 bg-[#1B1B1B]/10 rounded-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4D00FF]/5 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhatYouGet = () => {
  const cards = [
    {
      title: "Deep Discovery",
      description: "Mini-audit + insights to understand brand, audience, gaps, and growth levers."
    },
    {
      title: "Tailored Strategy",
      description: "A modular plan covering exactly what you need: brand, positioning, SEO, CRO, content, funnels, etc."
    },
    {
      title: "Fast Implementation Support",
      description: "Action steps, frameworks, and direction you can activate immediately."
    },
    {
      title: "Founder-Friendly Collaboration",
      description: "Clear communication, async support, and a no-fluff, structured workflow."
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            What to Expect When We Build <br /><span className="text-[#4D00FF]">Your Custom Strategy</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 rounded-[1.5rem] bg-[#F4F2FF] border border-[#1B1B1B]/5 hover:border-[#4D00FF]/30 hover:shadow-lg transition-all group cursor-default"
            >
              <div className="w-10 h-10 rounded-full bg-[#4D00FF]/10 flex items-center justify-center mb-4 group-hover:bg-[#4D00FF] transition-colors">
                <span className="font-bold text-[#4D00FF] group-hover:text-white text-sm">{i + 1}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#4D00FF] transition-colors">{card.title}</h3>
              <p className="text-[#1B1B1B]/70 leading-relaxed text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InteractiveModules = ({ selectedModules, toggleModule }: { selectedModules: string[], toggleModule: (m: string) => void }) => {
  const modules = [
    "Brand & Positioning", "Messaging", "Brand Identity Direction",
    "Website Review", "SEO Strategy", "Content Strategy",
    "Social Growth Plan", "Funnel Strategy", "Audience Research",
    "Competitor Analysis", "Keyword Discovery", "Email Strategy",
    "Product & Feature GTM", "Analytics Review"
  ];

  return (
    <section id="focus-areas" className="py-12 bg-[#1B1B1B] text-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Choose the Areas You Want to Focus On
          </h2>
          <p className="text-white/60 text-lg">Select the pieces you need, and I'll build the plan.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-12">
          {modules.map((mod) => {
            const isSelected = selectedModules.includes(mod);
            return (
              <motion.button
                key={mod}
                onClick={() => toggleModule(mod)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full text-sm md:text-base font-medium transition-all border ${
                  isSelected 
                    ? "bg-[#4D00FF] border-[#4D00FF] text-white shadow-[0_0_20px_-5px_#4D00FF]" 
                    : "bg-transparent border-white/20 text-white/70 hover:border-white hover:text-white"
                }`}
              >
                {mod}
              </motion.button>
            );
          })}
        </div>

        <div className="text-center">
             <Button
                size="lg"
                className="text-lg h-14 px-8 bg-white text-[#1B1B1B] hover:bg-[#4D00FF] hover:text-white transition-all rounded-full"
                onClick={() => document.getElementById("custom-plan-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Create My Plan Based on Selection <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
        </div>
      </div>
    </section>
  );
};

const Timeline = () => {
  const steps = [
    {
      id: "01",
      title: "Tell me what you need",
      desc: "Quick form or intake quiz."
    },
    {
      id: "02",
      title: "I design a custom plan",
      desc: "A tailored package that aligns with your goals, budget, and urgency."
    },
    {
      id: "03",
      title: "We execute together",
      desc: "Hands-on support, frameworks, and direction."
    }
  ];

  return (
    <section className="py-12 bg-[#F4F2FF]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tighter mb-16 text-center">How Custom Projects Work</h2>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
           {/* Line */}
           <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-[#1B1B1B]/10 -z-10"></div>
           
           {steps.map((step) => (
             <div key={step.id} className="text-center md:text-left group">
                <div className="w-24 h-24 mx-auto md:mx-0 bg-[#F4F2FF] border border-[#1B1B1B]/20 rounded-full flex items-center justify-center text-3xl font-bold text-[#1B1B1B]/30 mb-6 group-hover:border-[#4D00FF] group-hover:text-[#4D00FF] transition-all z-10 relative">
                   {step.id}
                </div>
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-[#1B1B1B]/70">{step.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

const ConversionForm = ({ selectedModules }: { selectedModules: string[] }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessDescription: "",
    mainChallenge: "",
    budgetRange: "",
  });

  const customPlanMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; businessDescription: string; mainChallenge: string; selectedModules: string[]; budgetRange: string }) => {
      const response = await fetch("/api/custom-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit custom plan inquiry");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Custom plan request sent!",
        description: "I'll review your needs and get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        businessDescription: "",
        mainChallenge: "",
        budgetRange: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send custom plan request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    customPlanMutation.mutate({
      ...formData,
      selectedModules,
    });
  };

  return (
    <section id="custom-plan-form" className="pt-8 pb-32 bg-[#F4F2FF]">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
           <h2 className="text-5xl font-black tracking-tighter mb-6">Let's Build Your Custom Marketing Plan</h2>
           <p className="text-xl text-[#1B1B1B]/70">Tell me your goals, challenges, and what you want to improve — I'll create a custom strategy just for you.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-[#1B1B1B]/10">
           <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B]/70">Your Name</label>
                   <input 
                     type="text"
                     required
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     className="w-full p-4 bg-[#F4F2FF] rounded-xl border-none focus:ring-2 focus:ring-[#4D00FF]" 
                     placeholder="John Doe"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B]/70">Your Email</label>
                   <input 
                     type="email"
                     required
                     value={formData.email}
                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     className="w-full p-4 bg-[#F4F2FF] rounded-xl border-none focus:ring-2 focus:ring-[#4D00FF]" 
                     placeholder="john@company.com"
                   />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B]/70">What's your business about?</label>
                 <textarea 
                   required
                   value={formData.businessDescription}
                   onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                   className="w-full p-4 bg-[#F4F2FF] rounded-xl border-none focus:ring-2 focus:ring-[#4D00FF] min-h-[100px]" 
                   placeholder="Briefly describe your product/service..."
                 ></textarea>
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B]/70">What's your main challenge right now?</label>
                 <textarea 
                   required
                   value={formData.mainChallenge}
                   onChange={(e) => setFormData({ ...formData, mainChallenge: e.target.value })}
                   className="w-full p-4 bg-[#F4F2FF] rounded-xl border-none focus:ring-2 focus:ring-[#4D00FF] min-h-[100px]" 
                   placeholder="e.g. Traffic but no conversions, no clear strategy..."
                 ></textarea>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B]/70">Selected Focus Areas</label>
                 <div className="p-4 bg-[#F4F2FF] rounded-xl min-h-[60px] flex flex-wrap gap-2">
                    {selectedModules.length > 0 ? (
                      selectedModules.map(m => (
                        <span key={m} className="bg-[#4D00FF] text-white text-xs px-2 py-1 rounded-md">{m}</span>
                      ))
                    ) : (
                      <span className="text-[#1B1B1B]/40 text-sm italic">No specific areas selected yet (optional)</span>
                    )}
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold uppercase tracking-widest text-[#1B1B1B]/70">Budget Range</label>
                 <div className="relative">
                    <select 
                      required
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full p-4 bg-[#F4F2FF] rounded-xl border-none focus:ring-2 focus:ring-[#4D00FF] appearance-none text-[#1B1B1B]"
                    >
                        <option value="" disabled>Select your budget</option>
                        <option value="2k-5k">$2,000 - $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-15k">$10,000 - $15,000</option>
                        <option value="20k+">$20,000+</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <svg className="w-4 h-4 text-[#1B1B1B]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                 </div>
              </div>
              
              <div className="pt-6">
                 <Button
                   type="submit"
                   disabled={customPlanMutation.isPending}
                   size="lg"
                   className="w-full h-16 text-lg bg-[#4D00FF] hover:bg-[#1B1B1B] text-white rounded-full"
                 >
                   {customPlanMutation.isPending ? (
                     <>
                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                       Sending...
                     </>
                   ) : (
                     "Let's Plan Your Next Move"
                   )}
                 </Button>
              </div>
           </form>

           <div className="text-center mt-8">
             <button
               onClick={() => document.getElementById("focus-areas")?.scrollIntoView({ behavior: "smooth" })}
               className="text-[#4D00FF] hover:text-[#1B1B1B] font-medium transition-colors inline-flex items-center gap-2 group"
             >
               <ArrowRight className="w-4 h-4 -rotate-90 group-hover:-translate-y-1 transition-transform" />
               Update your focus areas
             </button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default function DigOnDemand() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const toggleModule = (module: string) => {
    setSelectedModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module) 
        : [...prev, module]
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F2FF] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />
      <Hero />
      <WhatYouGet />
      <InteractiveModules selectedModules={selectedModules} toggleModule={toggleModule} />
      <Timeline />
      <ConversionForm selectedModules={selectedModules} />
      <Footer />
    </div>
  );
}