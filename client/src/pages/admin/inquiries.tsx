import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import type { ContactInquiry, CustomPlanInquiry } from "@shared/schema";
import { Mail, Inbox, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type TabKey = "contact" | "custom-plan";

const TABS: { key: TabKey; label: string; description: string; endpoint: string }[] = [
  {
    key: "contact",
    label: "contact form",
    description: "from the homepage cta form.",
    endpoint: "/api/admin/inquiries/contact",
  },
  {
    key: "custom-plan",
    label: "custom plans",
    description: "from the dig on demand request flow.",
    endpoint: "/api/admin/inquiries/custom-plan",
  },
];

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminInquiries() {
  const [active, setActive] = useState<TabKey>("contact");
  const tab = TABS.find((t) => t.key === active)!;

  const contactQ = useQuery<ContactInquiry[]>({
    queryKey: ["/api/admin/inquiries/contact"],
  });
  const customQ = useQuery<CustomPlanInquiry[]>({
    queryKey: ["/api/admin/inquiries/custom-plan"],
  });

  const list = active === "contact" ? contactQ.data ?? [] : customQ.data ?? [];
  const loading = active === "contact" ? contactQ.isLoading : customQ.isLoading;

  return (
    <AdminLayout title="inquiries">
      <p className="text-[#6F6A5F] lowercase mb-8">
        every form submission from the website. newest first.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#181612]/15 mb-8">
        {TABS.map((t) => {
          const isActive = active === t.key;
          const count =
            t.key === "contact"
              ? contactQ.data?.length ?? 0
              : customQ.data?.length ?? 0;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "px-4 py-3 text-sm font-medium lowercase transition-colors relative -mb-px border-b-2",
                isActive
                  ? "text-[#181612] border-[#6B1421]"
                  : "text-[#6F6A5F] border-transparent hover:text-[#181612]"
              )}
              data-testid={`tab-${t.key}`}
            >
              <span className="flex items-center gap-2">
                {t.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded-md",
                      isActive
                        ? "bg-[#6B1421] text-[#F4F1EA]"
                        : "bg-[#181612]/10 text-[#6F6A5F]"
                    )}
                  >
                    {count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab caption */}
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B1421] mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B1421]" />
        {tab.label} · {tab.description}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#181612]/15 border-t-[#6B1421]" />
        </div>
      ) : list.length === 0 ? (
        <div className="bg-[#FBF9F3] border border-[#181612]/10 rounded-md py-16 text-center">
          <Inbox className="w-10 h-10 text-[#6F6A5F]/50 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold text-[#181612] mb-2 lowercase">
            no submissions yet
          </h3>
          <p className="text-[#6F6A5F] lowercase">
            when someone submits the {tab.label}, it'll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((row: any) => (
            <InquiryRow key={row.id} row={row} kind={active} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

function StatusToggle({ row, kind }: { row: any; kind: TabKey }) {
  const queryClient = useQueryClient();
  const isOpen = row.status === "open";
  const endpoint =
    kind === "contact"
      ? `/api/admin/inquiries/contact/${row.id}`
      : `/api/admin/inquiries/custom-plan/${row.id}`;
  const queryKey =
    kind === "contact"
      ? ["/api/admin/inquiries/contact"]
      : ["/api/admin/inquiries/custom-plan"];

  const mutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        mutation.mutate(isOpen ? "new" : "open");
      }}
      disabled={mutation.isPending}
      className={cn(
        "shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium lowercase px-3 py-1.5 rounded-md border transition-colors",
        isOpen
          ? "bg-[#1F4D3A]/10 border-[#1F4D3A]/30 text-[#1F4D3A]"
          : "bg-[#FBF9F3] border-[#181612]/15 text-[#6F6A5F] hover:border-[#6B1421]/40 hover:text-[#6B1421]"
      )}
      data-testid={`status-toggle-${row.id}`}
    >
      {isOpen ? (
        <>
          <Check className="w-3.5 h-3.5" /> open
        </>
      ) : (
        <>mark as open</>
      )}
    </button>
  );
}

function InquiryRow({ row, kind }: { row: any; kind: TabKey }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn(
      "bg-[#FBF9F3] border rounded-md overflow-hidden transition-colors",
      row.status === "open" ? "border-[#1F4D3A]/30" : "border-[#181612]/10 hover:border-[#6B1421]/40"
    )}>
      <div className="w-full p-5 flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="min-w-0 flex-1 text-left"
          data-testid={`inquiry-${row.id}`}
        >
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h3 className="text-base font-semibold text-[#181612] truncate">
              {row.name}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] bg-[#E7E2D6] text-[#6B1421] rounded-md px-2 py-0.5">
              {kind === "contact" ? "contact" : "custom plan"}
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap text-sm text-[#6F6A5F]">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
              {row.email}
            </span>
            {row.companyWebsite && (
              <span className="font-mono text-xs">{row.companyWebsite}</span>
            )}
            <span className="text-xs lowercase">{formatDate(row.createdAt)}</span>
          </div>
        </button>
        <div className="flex items-center gap-3 shrink-0">
          <StatusToggle row={row} kind={kind} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs text-[#6F6A5F] lowercase hover:text-[#181612] transition-colors"
          >
            {open ? "collapse" : "expand"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#181612]/10 p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-[#F4F1EA]/60">
          {kind === "contact" ? (
            <>
              <Field label="project type" value={row.projectType} />
              <Field label="job role" value={row.jobRole} />
              <Field label="company size" value={row.companySize} />
              <Field label="budget" value={row.budget} />
              <Field
                label="message"
                value={row.message}
                wide
              />
            </>
          ) : (
            <>
              <Field label="phase" value={row.phase} />
              <Field label="modules" value={Array.isArray(row.modules) ? row.modules.join(", ") : row.modules} />
              <Field label="timeline" value={row.timeline} />
              <Field label="budget" value={row.budget} />
              <Field label="goals" value={row.goals} wide />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={cn(wide && "md:col-span-2")}>
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6F6A5F] mb-1">
        {label}
      </div>
      <div className="text-sm text-[#181612] whitespace-pre-wrap break-words">
        {value}
      </div>
    </div>
  );
}
