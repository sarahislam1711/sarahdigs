import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { openCalendly } from "@/lib/calendly";

interface ServiceLayoutProps {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaBook: string;
    ctaService: string;
  };
  diagnostic: {
    title: string;
    items: string[];
  };
  promise: string;
  whatYouGet: {
    title: string;
    description: string;
    items: { title: string; desc?: string }[];
    images?: string[];
  };
  whatToExpect: {
    items: string[];
  };
  proof: {
    stat: string;
    text: string;
    projectLink: string;
    projectTitle: string;
    beforeImage?: string;
    afterImage?: string;
  };
  nextSteps: {
    steps: { title: string; desc: string; bullets?: string[] }[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    buttonText: string;
    microProof: string;
  };
}

export const ServiceLayout = ({ content }: { content: ServiceLayoutProps }) => {
  const hasImages = content.whatYouGet.images && content.whatYouGet.images.length > 0;
  const hasProofImages = content.proof.beforeImage || content.proof.afterImage;

  return (
    <div className="min-h-screen bg-[#FBFCFE] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="pt-32 pb-12 bg-[#F4F2FF]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.95]">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#4D00FF] mb-6">
              {content.hero.subtitle}
            </p>
            <p className="text-lg text-[#1B1B1B]/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              {content.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg h-14 px-8 bg-[#1B1B1B] hover:bg-[#4D00FF] text-white transition-all rounded-full cursor-pointer" onClick={() => openCalendly()}>
                {content.hero.ctaBook}
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-[#1B1B1B]/20 hover:border-[#4D00FF] hover:text-[#4D00FF] transition-all rounded-full">
                {content.hero.ctaService}
              </Button>
            </div>
            {/* Optional Proof Snippet */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#1B1B1B]/60 font-medium">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                  ))}
               </div>
               <span>Trusted by 50+ founders</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Diagnostic */}
      <section className="py-12 bg-white border-y border-[#1B1B1B]/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
             <div>
               <h2 className="text-4xl font-bold tracking-tighter mb-6">
                 {content.diagnostic.title}
               </h2>
               <div className="w-20 h-1 bg-[#4D00FF] rounded-full"></div>
             </div>
             <div className="space-y-4">
               {content.diagnostic.items.map((item, i) => (
                 <div key={i} className="flex gap-4 items-start group">
                    <div className="mt-1 w-6 h-6 rounded-full bg-[#F4F2FF] flex items-center justify-center shrink-0 group-hover:bg-[#4D00FF] transition-colors">
                       <X className="w-3 h-3 text-[#4D00FF] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-lg text-[#1B1B1B]/80">{item}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* 3. The Promise */}
      <section className="py-20 bg-[#0A0A0A] text-white relative overflow-hidden">
         {/* Soft gradient background */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4D00FF]/10 via-[#0A0A0A] to-[#0A0A0A]"></div>
         
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="inline-block mb-8"
               >
                 <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4D00FF] flex items-center justify-center shadow-[0_0_30px_-5px_rgba(77,0,255,0.5)] rotate-3">
                    <Check className="w-8 h-8 text-white" />
                 </div>
               </motion.div>
               
               <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                 {content.promise}
               </h2>
               
               <div className="h-1 w-24 bg-[#4D00FF] mx-auto rounded-full opacity-50"></div>
            </div>
         </div>
      </section>

      {/* 4. What You'll Get */}
      <section className="py-24 bg-[#FBFCFE]">
         <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
               <h2 className="text-4xl font-bold tracking-tighter mb-4">{content.whatYouGet.title}</h2>
               <p className="text-xl text-[#1B1B1B]/60 max-w-2xl mx-auto">{content.whatYouGet.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-4">
                  {content.whatYouGet.items.map((item, i) => (
                    <div key={i} className="flex gap-6 p-6 rounded-3xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-[#1B1B1B]/5 group">
                       <div className="text-4xl font-bold text-[#1B1B1B]/10 group-hover:text-[#4D00FF] transition-colors">
                         0{i+1}
                       </div>
                       <div>
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          {item.desc && <p className="text-[#1B1B1B]/70">{item.desc}</p>}
                       </div>
                    </div>
                  ))}
               </div>
               
               {/* Visual Representation - Show uploaded images or fallback */}
               <div className="aspect-square bg-white rounded-[2.5rem] shadow-xl border border-[#1B1B1B]/5 p-4 flex items-center justify-center relative overflow-hidden">
                  {hasImages ? (
                    <div className="relative z-10 grid grid-cols-2 gap-3 w-full h-full">
                      {content.whatYouGet.images!.slice(0, 4).map((imgUrl, i) => (
                        <motion.div 
                          key={i} 
                          className={`rounded-2xl overflow-hidden shadow-sm ${i === 2 && content.whatYouGet.images!.length === 3 ? 'col-span-2' : ''}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Service visual ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[#F4F2FF] opacity-50"></div>
                      {/* Default abstract visual */}
                      <div className="relative z-10 grid grid-cols-2 gap-4 w-full h-full">
                         <div className="bg-white rounded-2xl shadow-sm"></div>
                         <div className="bg-[#4D00FF]/10 rounded-2xl shadow-sm"></div>
                         <div className="bg-[#1B1B1B] rounded-2xl shadow-sm col-span-2"></div>
                      </div>
                    </>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* 5. What To Expect */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
           <h2 className="text-4xl font-bold tracking-tighter mb-12 text-center">What to expect</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.whatToExpect.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-[#F4F2FF] rounded-2xl border border-[#1B1B1B]/5">
                   <div className="w-8 h-8 rounded-full bg-[#4D00FF] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white" />
                   </div>
                   <p className="font-medium">{item}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. Proof */}
      <section className="py-12 bg-[#FBFCFE] border-y border-[#1B1B1B]/5">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <span className="text-[#4D00FF] font-bold uppercase tracking-widest mb-4 block">Real Results</span>
                  <h2 className="text-4xl font-bold tracking-tighter mb-6">
                     {content.proof.stat}
                  </h2>
                  <p className="text-xl text-[#1B1B1B]/70 mb-8">
                     {content.proof.text}
                  </p>
                  <Link href={content.proof.projectLink}>
                     <div className="inline-flex items-center gap-2 font-bold text-[#1B1B1B] hover:text-[#4D00FF] transition-colors cursor-pointer border-b-2 border-[#1B1B1B] hover:border-[#4D00FF] pb-1">
                        View Case Study: {content.proof.projectTitle} <ArrowRight className="w-4 h-4" />
                     </div>
                  </Link>
               </div>
               <div className="lg:w-1/2 w-full">
                  <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-[#1B1B1B]/5 relative">
                     <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1B1B1B] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Before vs After
                     </div>
                     <div className="grid grid-cols-2 gap-4 mt-4 h-64">
                        {hasProofImages ? (
                          <>
                            <div className="rounded-xl overflow-hidden border border-red-100 relative">
                              {content.proof.beforeImage ? (
                                <img 
                                  src={content.proof.beforeImage} 
                                  alt="Before" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-red-50 flex items-center justify-center">
                                  <span className="text-red-400 font-bold">Before</span>
                                </div>
                              )}
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                Before
                              </div>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-green-100 relative">
                              {content.proof.afterImage ? (
                                <img 
                                  src={content.proof.afterImage} 
                                  alt="After" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-green-50 flex items-center justify-center">
                                  <span className="text-green-600 font-bold">After</span>
                                </div>
                              )}
                              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                                After
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-red-50 rounded-xl flex items-center justify-center flex-col gap-2 border border-red-100">
                               <div className="text-red-400 font-bold">Before</div>
                               <div className="h-2 w-20 bg-red-200 rounded-full"></div>
                               <div className="h-2 w-12 bg-red-200 rounded-full"></div>
                            </div>
                            <div className="bg-green-50 rounded-xl flex items-center justify-center flex-col gap-2 border border-green-100">
                               <div className="text-green-600 font-bold">After</div>
                               <div className="h-2 w-24 bg-green-200 rounded-full"></div>
                               <div className="h-2 w-20 bg-green-200 rounded-full"></div>
                               <div className="h-2 w-16 bg-green-200 rounded-full"></div>
                            </div>
                          </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. What Happens Next (Onboarding) */}
      <section className="py-12 bg-white">
         <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold tracking-tighter mb-16 text-center">What happens next</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
               {/* Connector Line */}
               <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-[#F4F2FF] -z-10"></div>

               {content.nextSteps.steps.map((step, i) => (
                  <motion.div 
                    key={i} 
                    className="relative pt-8 md:pt-0 text-center md:text-left group cursor-default"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    viewport={{ once: true }}
                  >
                     <motion.div 
                        className="bg-white p-6 rounded-3xl border border-transparent hover:border-[#4D00FF]/20 hover:shadow-xl transition-all duration-300 relative z-10 h-full"
                        layout
                     >
                        <div className="w-24 h-24 mx-auto md:mx-0 bg-white border-2 border-[#F4F2FF] rounded-full flex items-center justify-center text-3xl font-bold text-[#4D00FF] mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            {i + 1}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[#4D00FF] transition-colors">{step.title}</h3>
                        <p className="text-[#1B1B1B]/70 mb-4">{step.desc}</p>
                        
                        {step.bullets && (
                            <motion.ul 
                                initial={{ opacity: 0, height: 0 }}
                                whileHover={{ opacity: 1, height: "auto" }}
                                className="space-y-2 text-left overflow-hidden"
                            >
                                {step.bullets.map((bullet, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-[#1B1B1B]/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4D00FF] mt-1.5 shrink-0"></div>
                                        {bullet}
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                         {/* Mobile: always show bullets if user can't hover easily, or rely on click/tap interaction which is handled by hover on mobile often */}
                         {step.bullets && (
                            <div className="md:hidden space-y-2 text-left mt-4 border-t border-[#1B1B1B]/5 pt-4">
                                 {step.bullets.map((bullet, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-[#1B1B1B]/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4D00FF] mt-1.5 shrink-0"></div>
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                         )}
                     </motion.div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. CTA Section */}
      <section className="py-20 bg-[#F4F2FF] text-center">
         <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
               <h2 className="text-5xl font-black tracking-tighter mb-6">{content.finalCta.title}</h2>
               <p className="text-xl text-[#1B1B1B]/70 mb-10">{content.finalCta.subtitle}</p>
               <Button size="lg" className="text-lg h-16 px-12 bg-[#4D00FF] hover:bg-[#1B1B1B] text-white transition-all rounded-full shadow-xl shadow-[#4D00FF]/20 mb-6 cursor-pointer" onClick={() => openCalendly()}>
                    {content.finalCta.buttonText}
               </Button>
               <p className="text-sm font-medium text-[#1B1B1B]/50 uppercase tracking-wide">
                  {content.finalCta.microProof}
               </p>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};