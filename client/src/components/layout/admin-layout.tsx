import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Settings, 
  LogOut, 
  ChevronRight,
  ChevronDown,
  Tags,
  Folder,
  FileEdit,
  Layers,
  Briefcase,
  Presentation
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@shared/schema";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

// Standalone nav items at top
const standaloneItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
];

// Grouped nav items with collapsible menus
const navGroups: NavGroup[] = [
  {
    label: "Blog",
    icon: FileText,
    items: [
      { href: "/admin/posts", label: "All Posts", icon: FileText },
      { href: "/admin/categories", label: "Categories", icon: Folder },
      { href: "/admin/tags", label: "Tags", icon: Tags },
    ],
  },
  {
    label: "Services & Projects",
    icon: Briefcase,
    items: [
      { href: "/admin/services", label: "Services", icon: Briefcase },
      { href: "/admin/projects", label: "Projects", icon: Presentation },
    ],
  },
];

// Bottom standalone items
const bottomItems: NavItem[] = [
  { href: "/admin/media", label: "Media Library", icon: Image },
  { href: "/admin/content", label: "Site Content", icon: Layers },
  { href: "/admin/pages", label: "Pages", icon: FileEdit },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth() as { user: User | null, isLoading: boolean, isAuthenticated: boolean };
  const { toast } = useToast();
  const [location] = useLocation();
  
  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    // Auto-expand groups based on current location
    const initial: Record<string, boolean> = {};
    navGroups.forEach(group => {
      const isInGroup = group.items.some(item => 
        location === item.href || location.startsWith(item.href + "/")
      );
      initial[group.label] = isInGroup;
    });
    return initial;
  });

  // Update expanded state when location changes
  useEffect(() => {
    navGroups.forEach(group => {
      const isInGroup = group.items.some(item => 
        location === item.href || location.startsWith(item.href + "/")
      );
      if (isInGroup) {
        setExpandedGroups(prev => ({ ...prev, [group.label]: true }));
      }
    });
  }, [location]);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the admin area.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1B1B1B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D00FF]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isItemActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location === href || location.startsWith(href + "/");
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => isItemActive(item.href));
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] flex" data-testid="admin-layout">
      <aside className="w-64 bg-[#0D0D0D] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-['Syne'] text-xl font-bold text-white">Sarah Digs</span>
          </Link>
          <span className="text-sm text-gray-500 mt-1 block">Admin Dashboard</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Dashboard - standalone */}
          {standaloneItems.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-[#4D00FF] text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}

          {/* Grouped items with collapsible menus */}
          {navGroups.map((group) => {
            const isExpanded = expandedGroups[group.label];
            const groupActive = isGroupActive(group);
            
            return (
              <div key={group.label} className="pt-2">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
                    groupActive
                      ? "text-white bg-gray-800/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <group.icon className="w-5 h-5" />
                  <span className="font-medium flex-1">{group.label}</span>
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isExpanded ? "rotate-180" : ""
                    )} 
                  />
                </button>
                
                {/* Submenu */}
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-200 ease-in-out",
                    isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="ml-4 pl-4 border-l border-gray-700 mt-1 space-y-1">
                    {group.items.map((item) => {
                      const isActive = isItemActive(item.href);
                      return (
                        <Link 
                          key={item.href} 
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                            isActive
                              ? "bg-[#4D00FF] text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                          {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-gray-800" />

          {/* Bottom standalone items */}
          {bottomItems.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-[#4D00FF] text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            {user?.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.firstName || user?.email || "Admin"}
              </p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <a
            href="/api/logout"
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </a>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {title && (
          <header className="bg-[#0D0D0D] border-b border-gray-800 px-8 py-6">
            <h1 className="font-['Syne'] text-2xl font-bold text-white">{title}</h1>
          </header>
        )}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}