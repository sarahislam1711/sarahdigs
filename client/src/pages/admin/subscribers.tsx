import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import type { Subscriber } from "@shared/schema";
import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const ASSET_LABELS: Record<string, string> = {
  article: "the article",
  "sample-plan": "sample plan",
  newsletter: "newsletter",
};

export default function AdminSubscribers() {
  const { data: subscribers = [], isLoading } = useQuery<Subscriber[]>({
    queryKey: ["/api/admin/subscribers"],
  });

  const exportCsv = () => {
    const header = "email,source,requested,subscribed_at\n";
    const rows = subscribers
      .map((s) =>
        [
          s.email,
          s.source ?? "",
          s.assetRequested ?? "",
          s.createdAt ? new Date(s.createdAt).toISOString() : "",
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="subscribers">
      <div className="flex items-center justify-between mb-8">
        <p className="text-[#6F6A5F] lowercase">
          everyone who subscribed or requested a resource. newest first.
        </p>
        {subscribers.length > 0 && (
          <Button
            onClick={exportCsv}
            className="bg-[#181612] text-[#F4F1EA] hover:bg-[#6B1421] gap-2"
          >
            <Download className="w-4 h-4" /> export csv
          </Button>
        )}
      </div>

      <div className="mb-6 text-sm text-[#6F6A5F]">
        <span className="font-semibold text-[#181612]">{subscribers.length}</span> total
      </div>

      {isLoading ? (
        <p className="text-[#6F6A5F] lowercase">loading…</p>
      ) : subscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mail className="w-8 h-8 text-[#181612]/25 mb-3" />
          <p className="text-[#6F6A5F] lowercase">no subscribers yet.</p>
        </div>
      ) : (
        <div className="rounded-md border border-[#181612]/10 overflow-hidden bg-white">
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6F6A5F] bg-[#FBF9F3] border-b border-[#181612]/10">
            <span>email</span>
            <span>source</span>
            <span>requested</span>
            <span>subscribed</span>
          </div>
          {subscribers.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[2fr_1fr_1fr_1.2fr] items-center px-5 py-3.5 text-sm border-b border-[#181612]/5 last:border-0 hover:bg-[#FBF9F3]/60"
            >
              <a href={`mailto:${s.email}`} className="text-[#181612] font-medium hover:text-[#6B1421] truncate">
                {s.email}
              </a>
              <span className="text-[#6F6A5F] lowercase">{s.source ?? "—"}</span>
              <span className="text-[#6F6A5F]">
                {s.assetRequested ? (
                  <span className="inline-block bg-[#6B1421]/8 text-[#6B1421] text-[11px] font-medium lowercase px-2.5 py-1 rounded">
                    {ASSET_LABELS[s.assetRequested] ?? s.assetRequested}
                  </span>
                ) : (
                  "—"
                )}
              </span>
              <span className="text-[#6F6A5F]">{formatDate(s.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
