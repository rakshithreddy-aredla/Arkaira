import Link from "next/link";
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  PhoneCall,
  IndianRupee,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { createServerSupabase } from "@/lib/admin-auth";
import { formatINR } from "@/lib/format";
import type { Order, DecorationQuery, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const supabase = await createServerSupabase();

  const [{ data: orders }, { data: products }, { data: queries }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase.from("products").select("*").eq("is_active", true),
      supabase
        .from("decoration_queries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const orderList = (orders ?? []) as Order[];
  const productList = (products ?? []) as Product[];
  const queryList = (queries ?? []) as DecorationQuery[];

  const paidTotal = orderList
    .filter((o) => o.payment_status === "paid")
    .reduce((s, o) => s + o.total, 0);
  const newOrders = orderList.filter((o) => o.payment_status === "unpaid").length;
  const lowStock = productList.filter((p) => p.stock <= 3);
  const newQueries = queryList.filter((q) => q.status === "new").length;

  const stats = [
    {
      label: "Paid Revenue (recent)",
      value: formatINR(paidTotal),
      icon: IndianRupee,
      tone: "bg-rose-100 text-rose-700",
    },
    {
      label: "Pending Payments",
      value: String(newOrders),
      icon: Clock,
      tone: "bg-amber-100 text-amber-700",
    },
    {
      label: "Low Stock Items",
      value: String(lowStock.length),
      icon: AlertTriangle,
      tone: "bg-orange-100 text-orange-700",
    },
    {
      label: "New Callback Requests",
      value: String(newQueries),
      icon: PhoneCall,
      tone: "bg-sage-100 text-sage-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Overview</h1>
        <p className="text-sm text-plum">
          Live snapshot of your store — stock & prices update in real time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-ink/10 bg-white p-5"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${s.tone}`}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-2xl font-semibold text-ink">{s.value}</p>
            <p className="mt-1 text-sm text-plum">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-rose-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-ink/5">
            {orderList.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-ink">
                    {o.customer_name} · {o.order_number}
                  </p>
                  <p className="text-xs text-plum/70">
                    {new Date(o.created_at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold text-ink">{formatINR(o.total)}</p>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wide ${
                      o.payment_status === "paid"
                        ? "text-sage-600"
                        : "text-amber-600"
                    }`}
                  >
                    {o.payment_status === "paid" ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Paid
                      </span>
                    ) : (
                      "Unpaid"
                    )}
                  </span>
                </div>
              </div>
            ))}
            {orderList.length === 0 && (
              <p className="py-8 text-center text-sm text-plum/60">
                No orders yet — they&apos;ll appear here the moment customers
                buy.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Latest Callback Requests</h2>
            <Link href="/admin/enquiries" className="text-sm font-medium text-rose-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-ink/5">
            {queryList.map((q) => (
              <div key={q.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-ink">
                    {q.name} · {q.event_type}
                  </p>
                  <p className="text-xs text-plum/70">
                    {q.phone}
                    {q.event_date ? ` · ${q.event_date}` : ""}
                  </p>
                </div>
                {q.status === "new" && (
                  <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold uppercase text-rose-700">
                    Call back
                  </span>
                )}
              </div>
            ))}
            {queryList.length === 0 && (
              <p className="py-8 text-center text-sm text-plum/60">
                No decoration enquiries yet.
              </p>
            )}
          </div>
        </section>
      </div>

      {lowStock.length > 0 && (
        <section className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg text-ink">
            <AlertTriangle className="h-5 w-5 text-orange-600" /> Low Stock —
            restock soon
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {lowStock.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[15px]"
              >
                <span className="flex items-center gap-2 text-ink">
                  <Package className="h-4 w-4 text-plum/50" /> {p.name}
                </span>
                <span
                  className={`font-bold ${
                    p.stock === 0 ? "text-rose-700" : "text-orange-600"
                  }`}
                >
                  {p.stock} left
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:underline"
          >
            Update stock <ShoppingBag className="h-4 w-4" />
          </Link>
        </section>
      )}
    </div>
  );
}
