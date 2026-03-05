import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { openCalendly } from "@/lib/calendly";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [location] = useLocation();
  const isHome = location === "/";

  const getLink = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#1B1B1B]/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity text-[#1B1B1B]">
          sarah<span className="text-[#4D00FF]">digs</span>.
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-sm font-medium uppercase tracking-widest hover:bg-transparent hover:text-[#4D00FF] focus:bg-transparent focus:text-[#4D00FF] text-[#1B1B1B]")}>
                    ABOUT
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-sm font-medium uppercase tracking-widest hover:bg-transparent hover:text-[#4D00FF] focus:bg-transparent focus:text-[#4D00FF] data-[state=open]:bg-[#4D00FF] data-[state=open]:text-white text-[#1B1B1B]">
                  SERVICES
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-5 p-6 bg-white border border-[#1B1B1B]/10 shadow-xl rounded-xl">
                    <div className="space-y-4">
                      <h4 className="font-medium leading-none text-[#4D00FF] mb-2 uppercase tracking-wider text-xs">Main</h4>
                      <ul className="space-y-3">
                        {[
                          { label: "SEO & Organic Growth", href: "/services/seo" },
                          { label: "Product-Led Marketing", href: "/services/product" },
                          { label: "Brand & Strategy", href: "/services/brand" },
                          { label: "Founder-Led Growth", href: "/services/founder" }
                        ].map((item) => (
                          <li key={item.label}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-[#4D00FF]/5 hover:text-[#4D00FF] focus:bg-[#4D00FF]/5 focus:text-[#4D00FF]"
                              >
                                <div className="text-sm font-medium leading-none text-[#1B1B1B]">{item.label}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4 border-l border-[#1B1B1B]/10 pl-5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium leading-none text-[#4D00FF] mb-2 uppercase tracking-wider text-xs">Custom</h4>
                        <ul className="space-y-3">
                          {[
                            { label: "Dig on Demand", href: "/services/dig-on-demand" },
                            { label: "Dig-In Consultations", href: "/services/consultations" }
                          ].map((item) => (
                            <li key={item.label}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-[#4D00FF]/5 hover:text-[#4D00FF] focus:bg-[#4D00FF]/5 focus:text-[#4D00FF]"
                                >
                                  <div className="text-sm font-medium leading-none text-[#1B1B1B]">{item.label}</div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button className="w-full mt-4 bg-[#1B1B1B] hover:bg-[#4D00FF] text-white cursor-pointer" onClick={() => openCalendly()}>Book a free call</Button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/projects" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-sm font-medium uppercase tracking-widest hover:bg-transparent hover:text-[#4D00FF] focus:bg-transparent focus:text-[#4D00FF] text-[#1B1B1B]")}>
                    PROJECTS
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/journal" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-sm font-medium uppercase tracking-widest hover:bg-transparent hover:text-[#4D00FF] focus:bg-transparent focus:text-[#4D00FF] text-[#1B1B1B]")}>
                    JOURNAL
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link href="/contact">
            <Button className="font-medium px-6 bg-[#1B1B1B] hover:bg-[#4D00FF] text-white">CONTACT</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};