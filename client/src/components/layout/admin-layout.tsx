import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileText, Inbox, LogOut, FolderOpen, Folder, Tag, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { confirmLeave } from "@/lib/nav-guard";
import type { User, ContactInquiry, CustomPlanInquiry } from "@shared/schema";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { href: "/admin/posts", label: "journal", icon: FileText },
  { href: "/admin/categories", label: "categories", icon: Folder },
  { href: "/admin/tags", label: "tags", icon: Tag },
  { href: "/admin/projects", label: "projects", icon: FolderOpen },
  { href: "/admin/inquiries", label: "inquiries", icon: Inbox },
  { href: "/admin/subscribers", label: "subscribers", icon: Mail },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth() as {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  };
  const { toast } = useToast();
  const [location] = useLocation();

  // Inquiry counts for sidebar badge — only fetch when authenticated
  const contactInquiriesQ = useQuery<ContactInquiry[]>({
    queryKey: ["/api/admin/inquiries/contact"],
    enabled: isAuthenticated,
    refetchInterval: 60_000, // refresh every minute so new submissions surface
  });
  const customInquiriesQ = useQuery<CustomPlanInquiry[]>({
    queryKey: ["/api/admin/inquiries/custom-plan"],
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  });
  // Only count inquiries that haven't been marked "open" yet, so the bubble
  // reflects unhandled requests.
  const countNew = (rows?: { status?: string | null }[]) =>
    (rows ?? []).filter((r) => r.status !== "open").length;
  const totalInquiries =
    countNew(contactInquiriesQ.data) + countNew(customInquiriesQ.data);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Sign in required",
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
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#181612]/15 border-t-[#6B1421]" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const isItemActive = (href: string) =>
    location === href || location.startsWith(href + "/");

  return (
    <div
      className="min-h-screen bg-[#F4F1EA] text-[#181612] flex font-sans"
      data-testid="admin-layout"
    >
      {/* Sidebar */}
      <aside className="w-60 bg-[#E7E2D6] border-r border-[#181612]/10 flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-[#181612]/10">
          <Link
            href="/"
            onClick={(e) => { if (!confirmLeave()) e.preventDefault(); }}
            className="font-display font-bold text-xl lowercase block"
          >
            sarah<span className="text-[#6B1421]">digs</span>.
          </Link>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6F6A5F] mt-2 block">
            admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            const badge =
              item.href === "/admin/inquiries" && totalInquiries > 0
                ? totalInquiries
                : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => { if (!confirmLeave()) e.preventDefault(); }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors lowercase",
                  active
                    ? "bg-[#181612] text-[#F4F1EA]"
                    : "text-[#181612] hover:bg-[#181612]/5"
                )}
                data-testid={`nav-${item.label}`}
              >
                <item.icon className="w-4 h-4" strokeWidth={1.75} />
                <span className="font-medium flex-1">{item.label}</span>
                {badge !== null && (
                  <span
                    className={cn(
                      "text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-md min-w-[20px] text-center",
                      active
                        ? "bg-[#F4F1EA] text-[#181612]"
                        : "bg-[#6B1421] text-[#F4F1EA]"
                    )}
                    data-testid="inquiries-badge"
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / sign out */}
        <div className="p-4 border-t border-[#181612]/10">
          <div className="mb-3">
            <p className="text-sm font-medium text-[#181612] truncate lowercase">
              {user?.firstName || user?.email || "admin"}
            </p>
            {user?.email && (
              <p className="text-xs text-[#6F6A5F] truncate">{user.email}</p>
            )}
          </div>
          <a
            href="/api/logout"
            className="inline-flex items-center gap-2 text-xs text-[#6F6A5F] hover:text-[#6B1421] transition-colors lowercase"
            data-testid="button-logout"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
            sign out
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-[#F4F1EA]">
        {title && (
          <header className="px-10 py-8 border-b border-[#181612]/10">
            <h1 className="font-display font-bold text-3xl tracking-tight text-[#181612] lowercase">
              {title}
            </h1>
          </header>
        )}
        <div className="px-10 py-8">{children}</div>
      </main>
    </div>
  );
}
