import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Zap, Target, BarChart, Rocket, TrendingDown, Banknote, Puzzle } from "lucide-react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import contactHero from "@/assets/IMG_6270.jpg";

const CountUp = ({ value, label }: { value: string, label: string }) => {
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
             {prefix}{displayValue}{suffix}
           </>
         ) : (
           value
         )}
       </div>
       <div className="text-sm font-bold uppercase tracking-widest text-[#4D00FF]">{label}</div>
    </div>
  );
};

export default function Contact() {
  const { toast } = useToast();

  useEffect(() => {
    if (window.location.hash === '#contact-form') {
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyWebsite: "",
    jobRole: "Marketing",
    companySize: "1-10",
    projectType: "SEO & Organic Growth",
    budget: "<$5k",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit inquiry");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry sent!",
        description: "I'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        companyWebsite: "",
        jobRole: "Marketing",
        companySize: "1-10",
        projectType: "SEO & Organic Growth",
        budget: "<$5k",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-gradient-to-b from-[#F4F2FF] to-[#FBFCFE] relative overflow-hidden">
        {/* Faded background image */}
        <div className="absolute top-0 right-[5%] w-[55%] h-[120%] hidden lg:block pointer-events-none" style={{
          backgroundImage: `url(${contactHero})`,
          backgroundSize: '115%',
          backgroundPosition: 'center 10%',
          opacity: 0.25,
          maskImage: 'radial-gradient(ellipse at 65% 50%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 65% 50%, black 30%, transparent 75%)',
        }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#4D00FF] font-bold uppercase tracking-widest text-sm mb-4 block">Let's Connect</span>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
                Ready to start <br/>
                <span className="text-[#4D00FF]">digging?</span>
              </h1>
              <p className="text-xl text-[#1B1B1B]/70 mb-8 max-w-lg">
                Whether you need a quick audit or a full-scale growth excavation, I'm here to help you find the gold in your business.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="text-lg h-14 px-8 bg-[#1B1B1B] hover:bg-[#4D00FF] text-white transition-all cursor-pointer"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Book a Free Call
                </Button>
                <Link href="/projects">
                  <Button variant="outline" size="lg" className="text-lg h-14 px-8 border-[#1B1B1B]/20 hover:border-[#4D00FF] hover:text-[#4D00FF] cursor-pointer">
                    Explore Client Stories
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">What to expect when you work with us?</h2>
             <p className="text-[#1B1B1B]/60 text-lg max-w-2xl mx-auto">A partnership built on transparency, data, and mutual growth.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
              <div className="space-y-6">
                 <div className="w-14 h-14 bg-[#F4F2FF] rounded-2xl flex items-center justify-center mb-6">
                   <Target className="w-7 h-7 text-[#4D00FF]" />
                 </div>
                 <h3 className="text-2xl font-bold">Strategic Clarity</h3>
                 <p className="text-[#1B1B1B]/70 leading-relaxed">
                   Deep strategic audits and actionable roadmaps. We identify hidden leaks and uncover high-impact opportunities tailored to your business goals.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="w-14 h-14 bg-[#F4F2FF] rounded-2xl flex items-center justify-center mb-6">
                   <Rocket className="w-7 h-7 text-[#4D00FF]" />
                 </div>
                 <h3 className="text-2xl font-bold">Ambitious Growth</h3>
                 <p className="text-[#1B1B1B]/70 leading-relaxed">
                   Designed for brands with $1M+ ARR ready to scale. Whether you're a SaaS, DTC, or B2B leader, we pour fuel on the fire of product-market fit.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="w-14 h-14 bg-[#F4F2FF] rounded-2xl flex items-center justify-center mb-6">
                   <Check className="w-7 h-7 text-[#4D00FF]" />
                 </div>
                 <h3 className="text-2xl font-bold">Honest Partnership</h3>
                 <p className="text-[#1B1B1B]/70 leading-relaxed">
                   We value long-term strategy over quick hacks. Expect data-first decisions, iterative experiments, and a dedicated focus on sustainable results.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="w-14 h-14 bg-[#F4F2FF] rounded-2xl flex items-center justify-center mb-6">
                   <BarChart className="w-7 h-7 text-[#4D00FF]" />
                 </div>
                 <h3 className="text-2xl font-bold">Deep Insights</h3>
                 <p className="text-[#1B1B1B]/70 leading-relaxed">
                   We dig deeper than surface metrics. Get comprehensive analytics and reporting that shows exactly how our strategies impact your bottom line.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-16 border-y border-[#1B1B1B]/10">
        <div className="container mx-auto px-6">
           <div className="flex flex-wrap justify-center md:justify-between gap-8 md:gap-0">
              {[
                { val: "10+", label: "Years Experience" },
                { val: "$50M+", label: "Revenue Generated" },
                { val: "400%", label: "Avg. Traffic Growth" },
                { val: "50+", label: "Happy Clients" }
              ].map((stat, i) => (
                <CountUp key={i} value={stat.val} label={stat.label} />
              ))}
           </div>
        </div>
      </section>


      {/* CTA Form */}
      <section id="contact-form" className="py-32 bg-[#FBFCFE] scroll-mt-20">
        <div className="container mx-auto px-6">
           <div className="max-w-3xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Let's get to work.</h2>
                <p className="text-xl text-[#1B1B1B]/70">Tell me a bit about your project and I'll be in touch within 24 hours.</p>
             </div>
             
             <div className="bg-[#F4F2FF] p-8 md:p-12 shadow-2xl border border-[#1B1B1B]/5 rounded-[2.5rem]">
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-[#1B1B1B]/80 ml-1">Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#4D00FF] outline-none py-4 px-6 transition-all rounded-xl placeholder:text-[#1B1B1B]/30 text-[#1B1B1B]" 
                        placeholder="Jane Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-[#1B1B1B]/80 ml-1">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#4D00FF] outline-none py-4 px-6 transition-all rounded-xl placeholder:text-[#1B1B1B]/30 text-[#1B1B1B]" 
                        placeholder="jane@company.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-[#1B1B1B]/80 ml-1">Company Website</label>
                    <input 
                      type="text" 
                      value={formData.companyWebsite}
                      onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                      className="w-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#4D00FF] outline-none py-4 px-6 transition-all rounded-xl placeholder:text-[#1B1B1B]/30 text-[#1B1B1B]" 
                      placeholder="https://example.com" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-[#1B1B1B]/80 ml-1">Job</label>
                      <select 
                        value={formData.jobRole}
                        onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                        className="w-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#4D00FF] outline-none py-4 px-6 transition-all rounded-xl text-[#1B1B1B]"
                      >
                        <option>Marketing</option>
                        <option>CEO / Founder</option>
                        <option>Product</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-[#1B1B1B]/80 ml-1">Company Size</label>
                      <select 
                        value={formData.companySize}
                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                        className="w-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#4D00FF] outline-none py-4 px-6 transition-all rounded-xl text-[#1B1B1B]"
                      >
                        <option>1-10</option>
                        <option>10-50</option>
                        <option>More than 50</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-[#1B1B1B]/80 ml-1">Project Type</label>
                    <select 
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#4D00FF] outline-none py-4 px-6 transition-all rounded-xl text-[#1B1B1B]"
                    >
                      <option>SEO & Organic Growth</option>
                      <option>Product-Led Marketing</option>
                      <option>Brand & Strategy</option>
                      <option>Founder-Led Growth</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-[#1B1B1B]/80 ml-1">Budget Range</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["<$5k", "$5k-10k", "$10k-25k", "$25k+"].map((range) => (
                        <label key={range} className="cursor-pointer">
                          <input 
                            type="radio" 
                            name="budget" 
                            value={range}
                            checked={formData.budget === range}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="peer sr-only" 
                          />
                          <div className="bg-white py-3 px-4 rounded-xl text-center border border-transparent peer-checked:border-[#4D00FF] peer-checked:bg-[#4D00FF]/5 peer-checked:text-[#4D00FF] transition-all font-medium text-[#1B1B1B]/70">
                            {range}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-[#1B1B1B]/80 ml-1">Message</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border-none shadow-sm focus:ring-2 focus:ring-[#4D00FF] outline-none py-4 px-6 min-h-[150px] resize-none transition-all rounded-xl placeholder:text-[#1B1B1B]/30 text-[#1B1B1B]" 
                      placeholder="Tell me about your goals..."
                    ></textarea>
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={contactMutation.isPending}
                    size="lg" 
                    className="w-full py-8 text-lg bg-[#1B1B1B] hover:bg-[#4D00FF] text-white hover:text-white transition-colors rounded-xl shadow-lg shadow-[#4D00FF]/20"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Inquiry"}
                  </Button>
                </form>
             </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}