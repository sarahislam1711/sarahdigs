import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Zap, Target, BarChart, Rocket, TrendingDown, Banknote, Puzzle, ChevronDown, ChevronRight } from "lucide-react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import contactHero from "@/assets/IMG_6270.jpg";
import { openCalendly } from "@/lib/calendly";

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
       <div className="text-4xl md:text-5xl font-medium text-ink mb-2 tabular-nums tracking-tighter">
         {match ? (
           <>
             {prefix}{displayValue}{suffix}
           </>
         ) : (
           value
         )}
       </div>
       <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-oxblood">{label}</div>
    </div>
  );
};

export default function Contact() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

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
      setShowSuccess(true);
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
      setShowError(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title="Contact Sarah"
        description="Book a free strategy call or share your project. SarahDigs offers SEO audits, content strategy, and growth consulting for founders and brands."
        canonical="/contact"
      />
      <Navbar theme="light" />

      {/* Hero Section */}
      <section className="min-h-screen pt-40 pb-20 bg-bone relative overflow-hidden flex items-center">
        {/* Faded background image */}
        <div className="absolute top-0 right-0 w-[62%] h-[126%] hidden lg:block pointer-events-none" style={{
          backgroundImage: `url(${contactHero})`,
          backgroundSize: '155%',
          backgroundPosition: 'center 50%',
          opacity: 0.35,
          maskImage: 'radial-gradient(ellipse at 65% 50%, black 33%, transparent 77%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 65% 50%, black 33%, transparent 77%)',
        }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-oxblood font-semibold uppercase tracking-[0.2em] text-xs mb-5 block">let's connect</span>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-[0.95] lowercase">
                ready to start <br/>
                <span className="text-oxblood">digging?</span>
              </h1>
              <p className="text-lg md:text-xl text-ink-mid mb-10 max-w-lg leading-relaxed lowercase">
                two ways to start. pick what fits where you are.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-base h-14 px-8 bg-ink hover:bg-oxblood text-white transition-colors cursor-pointer rounded-md lowercase font-medium"
                  onClick={() => openCalendly()}
                >
                  book a free call
                </Button>
                <Button variant="outline" size="lg" className="text-base h-14 px-8 bg-transparent border-ink/20 text-ink hover:border-oxblood hover:text-oxblood hover:bg-transparent cursor-pointer rounded-md lowercase font-medium"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  share my project
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-10 bg-bone">
        <div className="container mx-auto px-6">
           <div className="flex flex-wrap justify-center md:justify-around gap-10 md:gap-0 max-w-4xl mx-auto">
              {[
                { val: "20+", label: "websites shipped" },
                { val: "3x", label: "avg. inbound after launch" },
                { val: "6", label: "weeks strategy to live" }
              ].map((stat, i) => (
                <CountUp key={i} value={stat.val} label={stat.label} />
              ))}
           </div>
        </div>
      </section>

      {/* The approach */}
      <section className="py-16 bg-bone">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
             <div className="flex items-center justify-center gap-3 mb-4">
               <span className="h-px w-8 bg-oxblood/40" />
               <span className="text-oxblood font-semibold uppercase tracking-[0.2em] text-xs">the approach</span>
               <span className="h-px w-8 bg-oxblood/40" />
             </div>
             <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4 lowercase">what working together looks like</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14 max-w-5xl mx-auto">
              {[
                { num: "01", title: "we dig before we build", body: "every engagement starts with deep research. your business, your audience, your positioning. nothing gets designed until we understand what needs to exist and why." },
                { num: "02", title: "every decision has a reason", body: "design, copy, structure, SEO. nothing is decorative. every element earns its place." },
                { num: "03", title: "strategy leads, always", body: "we don't start with execution. we start with clarity. the build follows the thinking." },
                { num: "04", title: "the website is the beginning", body: "we build it to grow with you. optimised for search, AI discovery, and conversion from day one." },
              ].map(({ num, title, body }) => (
                <div key={num} className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-oxblood font-semibold tracking-tight text-base tabular-nums">{num}</span>
                    <span className="h-px flex-1 bg-ink/10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium tracking-tight lowercase">{title}</h3>
                  <p className="text-ink-mid leading-relaxed">{body}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-bone">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
             <div className="flex items-center justify-center gap-3 mb-4">
               <span className="h-px w-8 bg-oxblood/40" />
               <span className="text-oxblood font-semibold uppercase tracking-[0.2em] text-xs">how it works</span>
               <span className="h-px w-8 bg-oxblood/40" />
             </div>
             <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4 lowercase">what happens next.</h2>
           </div>

           <div className="max-w-6xl mx-auto relative">
              {/* Connecting hairline behind the numbered nodes (desktop only) */}
              <div className="hidden lg:block absolute left-0 right-0 top-[18px] h-px bg-ink/10" aria-hidden="true" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 relative">
                {[
                  { num: "01", title: "you reach out", body: "fill the brief or book a call. either works." },
                  { num: "02", title: "we review", body: "we look at your business, site, and goals before we respond." },
                  { num: "03", title: "we come back with a plan", body: "a clear view of what needs doing and whether we're the right fit." },
                  { num: "04", title: "we dig in", body: "if it's a match, we start with strategy & direction. always." },
                ].map(({ num, title, body }, i, arr) => (
                  <div key={num} className="space-y-4 relative group transition-transform duration-300 ease-out hover:-translate-y-1 cursor-default">
                    <div className="relative h-9 flex items-center">
                      <span className="relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-bone border border-ink/15 text-oxblood font-semibold text-xs tabular-nums transition-colors duration-300 group-hover:border-oxblood group-hover:bg-oxblood group-hover:text-white">
                        {num}
                      </span>
                      {i < arr.length - 1 && (
                        <ChevronRight
                          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 text-ink/30 bg-bone px-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-medium tracking-tight lowercase transition-colors duration-300 group-hover:text-oxblood">{title}</h3>
                    <p className="text-ink-mid leading-relaxed text-[15px]">{body}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>


      {/* CTA Form */}
      <section id="contact-form" className="py-16 bg-bone scroll-mt-24">
        <div className="container mx-auto px-6">
           <div className="max-w-3xl mx-auto">
             <div className="text-center mb-14">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="h-px w-8 bg-oxblood/40" />
                  <span className="text-oxblood font-semibold uppercase tracking-[0.2em] text-xs">start the dig</span>
                  <span className="h-px w-8 bg-oxblood/40" />
                </div>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-5 lowercase">tell us about your project.</h2>
                <p className="text-lg text-ink-mid leading-relaxed">we dig into every project. back to you within 48 hours.</p>
             </div>

             <div className="bg-white p-8 md:p-12 shadow-xl shadow-ink/5 border border-ink/10 rounded-md">
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1">Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-bone border border-ink/10 focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none py-4 px-5 transition-all rounded-md placeholder:text-ink/30 text-ink" 
                        placeholder="jane doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-bone border border-ink/10 focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none py-4 px-5 transition-all rounded-md placeholder:text-ink/30 text-ink" 
                        placeholder="jane@company.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1">Company Website</label>
                    <input 
                      type="text" 
                      value={formData.companyWebsite}
                      onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                      className="w-full bg-bone border border-ink/10 focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none py-4 px-5 transition-all rounded-md placeholder:text-ink/30 text-ink" 
                      placeholder="https://example.com" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1">Job</label>
                      <div className="relative">
                        <select
                          value={formData.jobRole}
                          onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                          className="w-full bg-bone border border-ink/10 focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none py-4 pl-5 pr-12 transition-all rounded-md text-ink appearance-none cursor-pointer"
                        >
                          <option>marketing</option>
                          <option>ceo / founder</option>
                          <option>product</option>
                          <option>other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-ink-mid absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1">Company Size</label>
                      <div className="relative">
                        <select
                          value={formData.companySize}
                          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                          className="w-full bg-bone border border-ink/10 focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none py-4 pl-5 pr-12 transition-all rounded-md text-ink appearance-none cursor-pointer"
                        >
                          <option>1-10</option>
                          <option>10-50</option>
                          <option>more than 50</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-ink-mid absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1">Project Type</label>
                    <div className="relative">
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full bg-bone border border-ink/10 focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none py-4 pl-5 pr-12 transition-all rounded-md text-ink appearance-none cursor-pointer"
                      >
                        <option>seo & organic growth</option>
                        <option>product-led marketing</option>
                        <option>brand & strategy</option>
                        <option>founder-led growth</option>
                        <option>other</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-ink-mid absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1">Budget Range</label>
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
                          <div className="bg-bone py-3 px-4 rounded-md text-center border border-ink/15 hover:border-ink/30 peer-checked:border-oxblood peer-checked:bg-oxblood/5 peer-checked:text-oxblood transition-all font-medium text-ink-mid">
                            {range}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mid ml-1">Message</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-bone border border-ink/10 focus:ring-2 focus:ring-oxblood focus:border-transparent outline-none py-4 px-5 min-h-[150px] resize-none transition-all rounded-md placeholder:text-ink/30 text-ink" 
                      placeholder="tell me about your goals..."
                    ></textarea>
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={contactMutation.isPending}
                    size="lg" 
                    className="w-full py-7 text-base bg-ink hover:bg-oxblood text-white hover:text-white transition-colors rounded-md shadow-lg shadow-oxblood/20 lowercase font-medium"
                  >
                    {contactMutation.isPending ? "sending..." : "send us your project"}
                  </Button>
                </form>
             </div>
           </div>
        </div>
      </section>

      <Footer />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-md p-10 md:p-14 max-w-md mx-6 text-center shadow-2xl border border-ink/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-oxblood rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-ink mb-3 lowercase">
                message sent!
              </h3>
              <p className="text-ink-mid text-lg mb-8 leading-relaxed lowercase">
                your message has been delivered successfully. i'll get back to you within 24 hours.
              </p>
              <Button
                onClick={() => setShowSuccess(false)}
                size="lg"
                className="bg-oxblood hover:bg-ink text-white rounded-md px-10 h-12 text-base transition-colors cursor-pointer lowercase font-medium"
              >
                got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowError(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-md p-10 md:p-14 max-w-md mx-6 text-center shadow-2xl border border-ink/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-oxblood rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-ink mb-3 lowercase">
                something went wrong
              </h3>
              <p className="text-ink-mid text-lg mb-8 leading-relaxed lowercase">
                your message couldn't be sent. please try again or email me directly at sarah@sarahdigs.com.
              </p>
              <Button
                onClick={() => setShowError(false)}
                size="lg"
                className="bg-ink hover:bg-oxblood text-white rounded-md px-10 h-12 text-base transition-colors cursor-pointer lowercase font-medium"
              >
                try again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}