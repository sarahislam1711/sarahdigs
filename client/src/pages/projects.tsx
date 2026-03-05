import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Users, BarChart3, Search, Layout } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { openCalendly } from "@/lib/calendly";

const iconMap: Record<string, React.ReactElement> = {
  TrendingUp: <TrendingUp size={64} />,
  BarChart3: <BarChart3 size={64} />,
  Users: <Users size={64} />,
  Search: <Search size={64} />,
  Layout: <Layout size={64} />,
};

const ProjectsHero = () => {
  return (
      <section className="bg-[#F4F2FF] mt-[70px] mb-[30px] pt-[50px] pb-[30px]">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[0.95]">
                Selected <span className="text-[#4D00FF]">Work</span>
              </h1>
            </motion.div>
          </div>
      </section>
  );
};

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  return (
    <Link href={`/projects/${project.slug}`}>
        <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-500 border border-[#1B1B1B]/5 group cursor-pointer"
        >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 space-y-8">
                {/* Tags */}
                <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-[#1B1B1B] text-white text-xs font-bold uppercase tracking-wider">
                        {project.industry}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-white border border-[#1B1B1B]/20 text-[#1B1B1B] text-xs font-bold uppercase tracking-wider">
                        {project.type}
                    </span>
                </div>

                <div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-2">{project.name}</h3>
                    <div className="text-[#1B1B1B]/50 group-hover:text-[#4D00FF] transition-colors flex items-center gap-2 text-sm font-medium mb-6">
                        {project.website} <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <p className="text-xl text-[#1B1B1B]/70 leading-relaxed mb-8">
                        {project.focus}
                    </p>
                </div>

                <div className="bg-[#F4F2FF] rounded-2xl p-6 border border-[#4D00FF]/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#4D00FF] mb-3 block">Key Results</span>
                    <div className="text-2xl md:text-3xl font-bold text-[#1B1B1B]">
                        {project.results}
                    </div>
                </div>
            </div>

            {/* Visual/Logo Column */}
            <div className="w-full lg:w-1/3 aspect-square lg:aspect-[4/5] bg-[#F4F2FF] rounded-[2rem] flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 border border-[#1B1B1B]/5">
                <div className="absolute inset-0 bg-[#4D00FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Placeholder for logo/image */}
                <div className="text-[#4D00FF] opacity-80 p-8 bg-white rounded-3xl shadow-sm">
                    {project.icon}
                </div>
            </div>
        </div>
        </motion.div>
    </Link>
  )
}

const ProjectsList = () => {
    const { data: projectsData = [] } = useQuery<Project[]>({
        queryKey: ["/api/projects"],
    });

    const defaultProjects = [
        { name: "TechFlow", website: "techflow.io", industry: "B2B SaaS", projectType: "SEO Strategy", focus: "Recovering organic traffic after a failed site migration and scaling lead generation.", results: "+450% Organic Traffic in 12 Months", iconName: "TrendingUp", slug: "techflow" },
        { name: "FinSmart", website: "finsmart.io", industry: "Fintech", projectType: "Content Engine", focus: "Building a content machine to capture high-intent bottom-of-funnel keywords.", results: "150+ Qualified Leads Per Month", iconName: "Users", slug: "finsmart" },
    ];

    const filteredData = projectsData.filter(p => p.slug !== "lumina");

    const projects = filteredData.length > 0
        ? filteredData.map(p => ({ ...p, icon: iconMap[p.iconName || "TrendingUp"] || <TrendingUp size={64} />, type: p.projectType }))
        : defaultProjects.map(p => ({ ...p, icon: iconMap[p.iconName] || <TrendingUp size={64} />, type: p.projectType }));

    return (
        <section className="py-12 bg-[#F4F2FF] pt-[0px] pb-[0px]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-12">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

const CTA = () => {
  return (
    <section className="py-32 bg-white">
       <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">Have a project in mind?</h2>
          <p className="text-xl text-[#1B1B1B]/70 max-w-2xl mx-auto mb-12">
            I only take on 3 clients at a time to ensure deep focus. Check if I have a slot open.
          </p>
          <Button size="lg" className="text-lg h-16 px-10 bg-[#1B1B1B] hover:bg-[#4D00FF] transition-all rounded-full text-white cursor-pointer" onClick={() => openCalendly()}>
            Inquire about Availability
          </Button>
       </div>
    </section>
  );
};

export default function Projects() {
  return (
    <div className="min-h-screen bg-[#F4F2FF] text-[#1B1B1B] font-sans selection:bg-[#4D00FF] selection:text-white">
      <Navbar />
      <ProjectsHero />
      <ProjectsList />
      <CTA />
      <Footer />
    </div>
  );
}
