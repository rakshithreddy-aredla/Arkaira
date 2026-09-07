"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Phone, MapPin, Mail, Package } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useToast } from "@/components/toast-provider";
import { formatINR } from "@/lib/format";
import type { Order } from "@/lib/types";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusTone: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async () => {
          const { data } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });
          if (data) setOrders(data as Order[]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setStatus = async (order: Order, status: string) => {
    setBusyId(order.id);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", order.id);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status } : o))
      );
      toast(`${order.order_number} → ${status}`);
    } catch {
      toast("Could not update status", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div
          key={o.id}
          className={`rounded-2xl border border-ink/10 bg-white ${
            busyId === o.id ? "opacity-60" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="font-semibold text-ink">
                {o.order_number}
                <span className="ml-2 text-sm font-normal text-plum">
                  {o.customer_name}
                </span>
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-plum/70">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {o.phone}
                </span>
                <span>
                  {new Date(o.created_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                    o.payment_status === "paid"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {o.payment_status}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-ink">{formatINR(o.total)}</p>
              <select
                value={o.status}
                onChange={(e) => setStatus(o, e.target.value)}
                className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  statusTone[o.status] ?? "bg-ink/10 text-plum"
                }`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-plum hover:border-rose-400 hover:text-rose-600"
                aria-label="Toggle details"
              >
                {expanded === o.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {expanded === o.id && (
            <div className="grid gap-6 border-t border-ink/10 px-5 py-5 md:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Package className="h-4 w-4 text-rose-600" /> Items
                </h3>
                <ul className="mt-3 space-y-2 text-[15px] text-plum">
                  {o.items.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {item.qty} × {item.name}
                      </span>
                      <span>{formatINR(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-ink/10 pt-3 text-[15px]">
                  <p className="flex justify-between text-plum">
                    <span>Delivery</span>
                    <span>
                      {o.delivery_fee === 0 ? "FREE" : formatINR(o.delivery_fee)}
                    </span>
                  </p>
                  <p className="mt-1 flex justify-between font-semibold text-ink">
                    <span>Total</span>
                    <span>{formatINR(o.total)}</span>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <MapPin className="h-4 w-4 text-rose-600" /> Delivery
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-plum">
                  {o.customer_name}<br />
                  {o.address}<br />
                  {o.city} — {o.pincode}
                </p>
                <p className="mt-3 flex items-center gap-2 text-[15px] text-plum">
                  <Phone className="h-4 w-4 text-rose-600" /> {o.phone}
                </p>
                {o.email && (
                  <p className="mt-1 flex items-center gap-2 text-[15px] text-plum">
                    <Mail className="h-4 w-4 text-rose-600" /> {o.email}
                  </p>
                )}
                {o.notes && (
                  <p className="mt-3 rounded-xl bg-blush px-4 py-3 text-sm text-plum">
                    “{o.notes}”
                  </p>
                )}
                {o.razorpay_payment_id && (
                  <p className="mt-3 text-xs text-plum/60">
                    Razorpay payment: {o.razorpay_payment_id}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      {orders.length === 0 && (
        <p className="rounded-2xl border border-ink/10 bg-white py-12 text-center text-sm text-plum/60">
          No orders yet.
        </p>
      )}
    </div>
  );
}
