import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavTheme = "light" | "dark";

interface NavbarProps {
  theme?: NavTheme;
}

const SERVICES_FLAGSHIP = {
  name: "the full dig",
  href: "/the-full-dig",
  description: "a website built to be found, trusted, and win business.",
  badge: "flagship",
};

const SERVICES_OTHER = [
  {
    name: "dig-in consultations",
    href: "/dig-in-consultations",
    description:
      "a focused call + written action plan. clarity before you commit.",
  },
  {
    name: "custom dig",
    href: "/dig-on-demand",
    description:
      "a custom plan built around your business, goals, and gaps.",
  },
];

// Renders text that reserves its bold width so hover-weight changes don't reflow neighbors.
const StableLink = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => (
  <span className={cn("relative inline-block", className)}>
    {/* Invisible bold copy reserves max width */}
    <span aria-hidden className="invisible font-semibold">
      {label}
    </span>
    {/* Visible label sits on top, weight toggles via parent's :hover */}
    <span className="absolute inset-0 flex items-center justify-center font-normal group-hover:font-semibold transition-[font-weight] duration-150">
      {label}
    </span>
  </span>
);

const ColumnLabel = ({
  children,
  flagship,
}: {
  children: React.ReactNode;
  flagship?: boolean;
}) => (
  <div className="flex items-center gap-2 mb-5">
    <span className="block w-[3px] h-3 bg-[#6B1421] rounded-[2px]" />
    {flagship ? (
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white bg-[#6B1421] rounded-[4px] px-1.5 py-0.5">
        {children}
      </span>
    ) : (
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#181612]/50">
        {children}
      </span>
    )}
  </div>
);

const ServiceItem = ({
  name,
  href,
  description,
  badge,
  flagship,
  index,
  onSelect,
}: {
  name: string;
  href: string;
  description: string;
  badge?: string;
  flagship?: boolean;
  index: number;
  onSelect: () => void;
}) => (
  <Link
    href={href}
    onClick={onSelect}
    className="group relative block rounded-md -mx-2 px-3 py-2.5 transition-all duration-200 hover:bg-white/70 hover:translate-x-0.5"
  >
    {badge && flagship && (
      <span className="absolute -top-2 left-3 text-[9px] font-bold uppercase tracking-wider text-white bg-[#6B1421] rounded-[4px] px-1.5 py-0.5 shadow-sm">
        {badge}
      </span>
    )}
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-medium text-[#181612] group-hover:text-[#6B1421] transition-colors duration-200",
              flagship ? "text-[17px]" : "text-[15px]"
            )}
          >
            {name}
          </span>
        </div>
        <p className="text-[12px] font-normal text-[#181612]/60 mt-1 leading-snug group-hover:text-[#181612]/80 transition-colors duration-200">
          {description}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[#6B1421] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 mt-1 shrink-0" />
    </div>
  </Link>
);

export const Navbar = ({ theme = "light" }: NavbarProps) => {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const [panelShift, setPanelShift] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 80);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [servicesOpen]);

  // Center under trigger, shift only if it would overflow viewport
  useEffect(() => {
    if (!servicesOpen) return;
    const compute = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const panelWidth = Math.min(560, window.innerWidth - 48);
      const triggerCenter = rect.left + rect.width / 2;
      // Panel is centered under trigger via left-1/2 + -translate-x-1/2.
      // Compute the unshifted edges and clamp to viewport with 24px gutter.
      const idealLeft = triggerCenter - panelWidth / 2;
      const idealRight = idealLeft + panelWidth;
      const minLeft = 24;
      const maxRight = window.innerWidth - 24;
      let shift = 0;
      if (idealRight > maxRight) shift = maxRight - idealRight;
      if (idealLeft + shift < minLeft) shift = minLeft - idealLeft;
      setPanelShift(shift);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [servicesOpen]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const openServices = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setServicesOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 120);
  };

  const textOnTop = theme === "dark" ? "text-white" : "text-[#181612]";
  const textColor = scrolled ? "text-[#181612]" : textOnTop;

  const surfaceClasses = scrolled
    ? "bg-white/80 backdrop-blur-md border-b border-[#181612]/10"
    : "bg-transparent backdrop-blur-0 border-b border-transparent";

  const linkClasses = cn(
    "group text-base lowercase hover:text-[#6B1421] transition-colors duration-300",
    textColor
  );

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-[background-color,backdrop-filter,border-color,color] duration-300 ease-out",
        surfaceClasses,
        textColor
      )}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="sarahdigs home"
          className="flex items-center hover:opacity-80 transition-opacity duration-300"
        >
          <img src="/favicon.png" alt="sarahdigs" className="h-[72px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className={linkClasses}>
            <StableLink label="about" />
          </Link>

          {/* Services */}
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={scheduleClose}
          >
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              className={cn(linkClasses, "flex items-center gap-1")}
            >
              <StableLink label="services" />
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  servicesOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
            {servicesOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ x: `calc(-50% + ${panelShift}px)`, transformOrigin: "top center" }}
                className="absolute left-1/2 top-full pt-3 w-[min(560px,calc(100vw-3rem))]"
              >
                {/* Hover bridge — invisible row that keeps the dropdown active as the cursor moves down from the trigger */}
                <div aria-hidden className="absolute -top-1 left-0 right-0 h-3" />
                <div
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-[2fr_3fr] rounded-md overflow-hidden ring-1 ring-[#181612]/[0.08] transition-colors duration-300",
                    scrolled
                      ? "bg-[#F4F1EA]"
                      : "bg-white/70 backdrop-blur-2xl"
                  )}
                >
                {/* Left column — flagship, tinted */}
                <div className="px-7 py-6 bg-gradient-to-br from-[#E7E2D6]/70 to-[#E7E2D6]/20 md:border-r border-[#181612]/[0.06]">
                  <ColumnLabel flagship>flagship</ColumnLabel>
                  <ServiceItem
                    name={SERVICES_FLAGSHIP.name}
                    href={SERVICES_FLAGSHIP.href}
                    description={SERVICES_FLAGSHIP.description}
                    flagship
                    index={0}
                    onSelect={() => setServicesOpen(false)}
                  />
                </div>

                {/* Right column — alternatives, neutral */}
                <div className="px-7 py-6">
                  <ColumnLabel>other ways to work together</ColumnLabel>
                  <div className="divide-y divide-[#181612]/[0.06]">
                    {SERVICES_OTHER.map((item, i) => (
                      <div key={item.href} className="py-2 first:pt-0 last:pb-0">
                        <ServiceItem
                          {...item}
                          index={i + 1}
                          onSelect={() => setServicesOpen(false)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <Link href="/projects" className={linkClasses}>
            <StableLink label="work" />
          </Link>
          <Link href="/journal" className={linkClasses}>
            <StableLink label="journal" />
          </Link>

          <Link href="/contact">
            <Button className="font-medium px-6 bg-[#1B1B1B] hover:bg-[#6B1421] text-white">
              contact
            </Button>
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className={cn("md:hidden", textColor)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-[#1B1B1B] text-white flex flex-col">
            <div className="flex items-center justify-between px-6 h-20">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                menu
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="block py-4 text-2xl lowercase hover:text-[#6B1421] transition-colors"
              >
                about
              </Link>

              <div className="py-2">
                <div className="text-2xl lowercase mb-3">services</div>
                <div className="pl-4 space-y-3 border-l border-white/10">
                  <Link
                    href={SERVICES_FLAGSHIP.href}
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    <span className="text-base">{SERVICES_FLAGSHIP.name}</span>
                    <p className="text-[12px] text-white/60 mt-1">
                      {SERVICES_FLAGSHIP.description}
                    </p>
                  </Link>
                  {SERVICES_OTHER.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <span className="text-base">{item.name}</span>
                      <p className="text-[12px] text-white/60 mt-1">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/projects"
                onClick={() => setMobileOpen(false)}
                className="block py-4 text-2xl lowercase hover:text-[#6B1421] transition-colors"
              >
                work
              </Link>
              <Link
                href="/journal"
                onClick={() => setMobileOpen(false)}
                className="block py-4 text-2xl lowercase hover:text-[#6B1421] transition-colors"
              >
                journal
              </Link>
            </div>

            <div className="p-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/contact");
                }}
                className="w-full h-12 bg-[#6B1421] text-white font-medium rounded-md"
              >
                contact
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
