"use client";

import { useEffect, useState } from "react";
import { PhoneCall, CheckCircle2, XCircle, Mail, CalendarDays, Wallet } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useToast } from "@/components/toast-provider";
import type { DecorationQuery } from "@/lib/types";

export function EnquiriesList({
  initialQueries,
}: {
  initialQueries: DecorationQuery[];
}) {
  const { toast } = useToast();
  const [queries, setQueries] = useState(initialQueries);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("admin-queries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "decoration_queries" },
        async () => {
          const { data } = await supabase
            .from("decoration_queries")
            .select("*")
            .order("created_at", { ascending: false });
          if (data) setQueries(data as DecorationQuery[]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setStatus = async (q: DecorationQuery, status: string) => {
    setBusyId(q.id);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("decoration_queries")
        .update({ status })
        .eq("id", q.id);
      if (error) throw error;
      setQueries((prev) =>
        prev.map((x) => (x.id === q.id ? { ...x, status } : x))
      );
      toast(`Marked as ${status}`);
    } catch {
      toast("Could not update enquiry", "error");
    } finally {
      setBusyId(null);
    }
  };

  const statusTone: Record<string, string> = {
    new: "bg-rose-100 text-rose-700",
    contacted: "bg-blue-100 text-blue-700",
    closed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="space-y-3">
      {queries.map((q) => (
        <div
          key={q.id}
          className={`rounded-2xl border border-ink/10 bg-white p-5 ${
            busyId === q.id ? "opacity-60" : ""
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                {q.name}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                    statusTone[q.status] ?? "bg-ink/10 text-plum"
                  }`}
                >
                  {q.status}
                </span>
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-plum">
                <a
                  href={`tel:${q.phone}`}
                  className="flex items-center gap-1.5 font-medium text-rose-700 hover:underline"
                >
                  <PhoneCall className="h-3.5 w-3.5" /> {q.phone}
                </a>
                {q.email && (
                  <a
                    href={`mailto:${q.email}`}
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" /> {q.email}
                  </a>
                )}
                <span className="capitalize">{q.event_type}</span>
                {q.event_date && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {q.event_date}
                  </span>
                )}
                {q.budget && (
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5" /> {q.budget}
                  </span>
                )}
              </div>
              {q.details && (
                <p className="mt-3 rounded-xl bg-blush px-4 py-3 text-[15px] leading-relaxed text-plum">
                  {q.details}
                </p>
              )}
              <p className="mt-2 text-xs text-plum/60">
                Submitted{" "}
                {new Date(q.created_at).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              {q.status === "new" && (
                <button
                  onClick={() => setStatus(q, "contacted")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-plum transition hover:border-blue-400 hover:text-blue-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Called
                </button>
              )}
              {q.status !== "closed" && (
                <button
                  onClick={() => setStatus(q, "closed")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-plum transition hover:border-emerald-400 hover:text-emerald-700"
                >
                  <XCircle className="h-3.5 w-3.5" /> Close
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {queries.length === 0 && (
        <p className="rounded-2xl border border-ink/10 bg-white py-12 text-center text-sm text-plum/60">
          No decoration enquiries yet.
        </p>
      )}
    </div>
  );
}
