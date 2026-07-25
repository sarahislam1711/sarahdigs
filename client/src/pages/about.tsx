import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SEO from "@/components/SEO";
import { pageSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import sarahPhoto from "@/assets/Sarah - about.png";

const beliefs = [
  {
    num: "i.",
    title: "a website is not a brochure.",
    body: "it's an experience. every scroll, every interaction, every page should feel intentional. like your brand walked into the room.",
  },
  {
    num: "ii.",
    title: "design without strategy is decoration.",
    body: "we don't design to impress other designers. we design to make your audience understand your business and want to be part of it.",
  },
  {
    num: "iii.",
    title: "the details are the design.",
    body: "the way a page loads. the way text breathes. the way a hover feels. these things are invisible when done right, and obvious when they're not.",
  },
];

const metrics = [
  { value: "20+", label: "brands launched" },
  { value: "100%", label: "hands-on, no agency layers" },
  { value: "6 wks", label: "strategy to live website" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-bone text-ink font-sans selection:bg-oxblood selection:text-white">
      <SEO
        title="about"
        description="sarahdigs is a creative website studio that designs websites people remember. small studio, fewer clients, deeper work."
        canonical="/about"
        jsonLd={pageSchema("AboutPage", {
          name: "about sarahdigs",
          description: "sarahdigs is a creative website studio that designs websites people remember. small studio, fewer clients, deeper work.",
          url: "/about",
        })}
      />
      <Navbar theme="light" />

      {/* 01 — OPENING */}
      <section className="bg-bone pt-24 pb-20 md:pt-28 md:pb-28 relative">
        {/* Top meta rail */}
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-12 text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid">
            <span>sarahdigs · creative website studio</span>
            <span className="hidden md:inline">about the studio</span>
            <span>2026</span>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Anchor pill — page identity */}
            <div className="inline-flex items-center gap-2.5 mb-10 bg-oxblood text-bone rounded-full pl-3 pr-4 py-2">
              <span className="inline-block w-2 h-2 rounded-full bg-bone" />
              <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em]">
                about · the studio
              </span>
            </div>

            <h1 className="font-display font-semibold tracking-tighter text-5xl md:text-7xl lg:text-[5.5rem] leading-none lowercase mb-8">
              meet the<br />
              <span className="text-oxblood font-bold">studio.</span>
            </h1>
            <p className="font-display text-2xl md:text-[1.75rem] lg:text-3xl text-ink font-medium italic lowercase leading-snug mb-12 md:mb-14">
              <span className="md:whitespace-nowrap">websites designed to make your audience <span className="text-oxblood">feel</span> something.</span>{" "}
              <span className="md:whitespace-nowrap">built to make them <span className="text-oxblood">do</span> something.</span>
            </p>

            {/* Stat row — proof beneath the claim */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-8 sm:gap-x-8 border-t border-ink/10 pt-8">
              {metrics.map((s) => (
                <div key={s.label} className="flex flex-col gap-2">
                  <span className="font-display font-extrabold text-oxblood text-3xl md:text-4xl tabular-nums tracking-tighter leading-none">
                    {s.value}
                  </span>
                  <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.22em] text-ink-mid leading-snug">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          02 — SARAH'S STORY (full-bleed photo background, overlaid block)
      ============================================================ */}
      <section className="relative bg-ink text-bone overflow-hidden">
        {/* Full-bleed portrait — visible on right half, untinted */}
        <div className="absolute inset-y-0 right-0 w-full md:w-3/5 lg:w-1/2 overflow-hidden flex items-center justify-center">
          <img
            src={sarahPhoto}
            alt=""
            aria-hidden="true"
            className="w-full h-full max-h-[90%] object-contain object-center"
          />
        </div>
        {/* Left-side ink slab — solid on left, clean cut off where photo begins */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-2/5 lg:w-1/2 bg-ink pointer-events-none"
          aria-hidden="true"
        />
        {/* Soft edge fade so the cut isn't a hard vertical line */}
        <div
          className="hidden md:block absolute inset-y-0 pointer-events-none"
          style={{
            left: "calc(40% - 60px)",
            width: "120px",
            background:
              "linear-gradient(to right, rgba(24,22,18,1) 0%, rgba(24,22,18,0) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="hidden lg:block absolute inset-y-0 pointer-events-none"
          style={{
            left: "calc(50% - 60px)",
            width: "120px",
            background:
              "linear-gradient(to right, rgba(24,22,18,1) 0%, rgba(24,22,18,0) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative container mx-auto px-6 lg:px-12 max-w-7xl py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="col-span-12 lg:col-span-8 max-w-2xl"
            >
              {/* Section marker */}
              <div className="flex items-baseline gap-4 mb-10">
                <span className="font-display font-extrabold text-oxblood-tint text-[2.5rem] md:text-5xl tabular-nums tracking-tighter leading-none">
                  02
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-bone/70 pb-1">
                  behind the dig
                </span>
              </div>

              <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl leading-[1.05] lowercase mb-10 text-bone">
                a website should feel like<br />
                <span className="italic text-oxblood-tint">walking into the business.</span>
              </h2>

              {/* Body copy with editorial sub-leads */}
              <div className="space-y-6 text-base md:text-lg leading-relaxed text-bone lowercase max-w-xl">
                <p>
                  i spent years watching businesses pour money into websites that looked like everyone else's. clean enough. functional enough. forgettable.
                </p>
                <p>
                  the problem was never the technology. it was that nobody stopped to ask what the website should actually make people feel.
                </p>
                <p>
                  i started sarahdigs because i believe a website should communicate who you are, what you stand for, and why someone should choose you. without saying a word.
                </p>
                <p>
                  my team and i dig into your brand, your audience, and your vision. then we design something that makes people stay, explore, and trust you before they ever get on a call.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-12 flex items-center gap-4">
                <span className="font-display font-medium italic text-oxblood-tint text-2xl md:text-3xl tracking-tight">
                  sarah
                </span>
                <span className="h-px w-12 bg-oxblood-tint/40" />
                <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-bone/60">
                  founder, sarahdigs
                </span>
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* ============================================================
          03 — NON-NEGOTIABLES (manifesto spread)
          Compact — fits in one viewport. Sidebar headline + dense list.
      ============================================================ */}
      <section className="bg-bone pt-12 pb-8 md:pt-16 md:pb-10">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-8 lg:gap-y-0">
            {/* Sidebar headline — wider column, 2-line headline */}
            <div className="col-span-12 lg:col-span-5">
              <div>
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-display font-extrabold text-oxblood text-3xl md:text-4xl tabular-nums tracking-tighter leading-none">
                    03
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid pb-1">
                    the manifesto
                  </span>
                </div>
                <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl leading-[0.95] lowercase mb-4">
                  <span className="block">our</span>
                  <span className="text-oxblood italic whitespace-nowrap">non-negotiables</span>
                </h2>
                <p className="text-ink-mid text-sm leading-relaxed max-w-xs lowercase">
                  three things we will never compromise on.
                </p>
              </div>
            </div>

            {/* Belief column — compact rows */}
            <div className="col-span-12 lg:col-span-6 space-y-5 md:space-y-6">
              {beliefs.map((b, i) => (
                <motion.article
                  key={b.num}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
                  className="group grid grid-cols-12 gap-3 md:gap-5"
                >
                  {/* Roman numeral */}
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-display font-medium italic text-oxblood text-xl md:text-2xl tracking-tight leading-none transition-colors duration-300 group-hover:text-ink">
                      {b.num}
                    </span>
                  </div>

                  {/* Title + body */}
                  <div className="col-span-10 md:col-span-11 space-y-1.5">
                    <h3 className="font-display font-medium text-base md:text-xl tracking-tight lowercase leading-tight">
                      {b.title}
                    </h3>
                    <p className="text-ink-mid text-sm md:text-[15px] leading-snug lowercase max-w-lg">
                      {b.body}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          04 — HOW WE WORK (bone, light on text — big statement + labels)
      ============================================================ */}
      <section className="bg-bone pt-8 pb-14 md:pt-10 md:pb-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="border-t border-ink/10 pt-10 md:pt-14"
          >
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-display font-extrabold text-oxblood text-[2.5rem] md:text-5xl tabular-nums tracking-tighter leading-none">
                04
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid pb-1">
                how we work
              </span>
            </div>

            {/* Big statement — carries the section */}
            <blockquote className="font-display font-semibold tracking-tighter text-4xl md:text-6xl leading-none lowercase max-w-5xl">
              most studios scale by adding people.{" "}
              <span className="text-oxblood italic">we scale by going deeper.</span>
            </blockquote>
            <p className="mt-6 text-ink-mid text-base md:text-lg leading-relaxed max-w-2xl lowercase">
              fewer clients, more attention, better output. every project gets the room it deserves.
            </p>

            {/* Three short labels — visual summary */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-x-10 max-w-4xl">
              {[
                "direct access to sarah, always.",
                "one project at a time.",
                "built to be remembered.",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <span className="mt-2 h-px w-5 bg-oxblood shrink-0" />
                  <span className="text-ink-mid text-sm md:text-base leading-snug lowercase">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 05 — PULL QUOTE (simple, pre-revamp style, on bone) */}
      <section className="bg-bone py-12 md:py-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="border-l-2 border-oxblood pl-6 md:pl-10 max-w-4xl"
          >
            <blockquote className="font-display font-medium text-2xl md:text-4xl leading-snug tracking-tight text-ink lowercase">
              &ldquo;sarah didn't design us a website. she figured out what we actually sell, then built something that says it better than we ever could.&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em] text-ink-mid">
              <span className="h-px w-6 bg-oxblood" />
              <span>casey smith · vp of marketing, bloom health</span>
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* 06 — CTA (bone, tied into the page rhythm) */}
      <section className="bg-bone pt-4 pb-20 md:pb-28">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="border-t border-ink/10 pt-10 md:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            <div className="lg:col-span-8">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-display font-extrabold text-oxblood text-[2.5rem] md:text-5xl tabular-nums tracking-tighter leading-none">
                  05
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink-mid pb-1">
                  the invitation
                </span>
              </div>
              <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl lg:text-6xl leading-[1.02] lowercase">
                if this sounds like the way you want to build,{" "}
                <span className="text-oxblood italic">let's talk.</span>
              </h2>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Link href="/contact#contact-form" className="w-full lg:w-auto">
                <Button
                  size="lg"
                  className="group w-full lg:w-auto text-base h-14 px-8 bg-oxblood hover:bg-oxblood-soft text-white rounded-md cursor-pointer lowercase font-semibold gap-2 transition-colors"
                >
                  share your project
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
