import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Settings, 
  LogOut, 
  ChevronRight,
  Tags,
  Folder,
  FileEdit,
  Layers,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@shared/schema";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/media", label: "Media Library", icon: Image },
  { href: "/admin/content", label: "Site Content", icon: Layers },
  { href: "/admin/pages", label: "Pages", icon: FileEdit },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/services", label: "Services", icon: Briefcase },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth() as { user: User | null, isLoading: boolean, isAuthenticated: boolean };
  const { toast } = useToast();
  const [location] = useLocation();

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

  return (
    <div className="min-h-screen bg-[#1B1B1B] flex" data-testid="admin-layout">
      <aside className="w-64 bg-[#0D0D0D] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-['Syne'] text-xl font-bold text-white">Sarah Digs</span>
          </Link>
          <span className="text-sm text-gray-500 mt-1 block">Admin Dashboard</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <a
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
                </a>
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