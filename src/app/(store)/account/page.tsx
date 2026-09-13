import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Package,
  Phone,
  MapPin,
  CalendarDays,
  CircleDollarSign,
  Truck,
  PackageCheck,
  Loader2,
  XCircle,
  Flower2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { createServerSupabase } from "@/lib/admin-auth";
import { getOrdersByPhone } from "@/lib/orders-server";
import { formatINR } from "@/lib/format";
import { formatPhone } from "@/hooks/use-session";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

const statusConfig: Record<
  string,
  { label: string; icon: typeof Truck; classes: string }
> = {
  pending: {
    label: "Pending payment",
    icon: Loader2,
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  paid: {
    label: "Paid",
    icon: CircleDollarSign,
    classes: "bg-rose-50 text-rose-700 border-rose-200",
  },
  processing: {
    label: "Being arranged",
    icon: Flower2,
    classes: "bg-rose-50 text-rose-700 border-rose-200",
  },
  shipped: {
    label: "Out for delivery",
    icon: Truck,
    classes: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    classes: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default async function AccountPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const phone = user.phone ?? "";
  const name =
    (user.user_metadata?.full_name as string) ||
    user.email?.split("@")[0] ||
    "Customer";
  const orders = phone ? await getOrdersByPhone(phone) : [];

  const totalSpent = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((s, o) => s + o.total, 0);
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  );

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-18">
      <div className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />

      {/* header card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-ink p-8 shadow-2xl shadow-ink/25 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-drift rounded-full bg-rose-800/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 animate-drift-slow rounded-full bg-gold-600/15 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 font-display text-2xl font-bold text-white shadow-xl shadow-rose-600/40">
              {name.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-300">
                My Account
              </p>
              <h1 className="mt-1 font-display text-3xl text-white">
                Hello, {name.split(" ")[0]}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-white/60">
                <Phone className="h-3.5 w-3.5 text-rose-300" />
                {formatPhone(phone)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/10 px-5 py-3.5 backdrop-blur-sm">
              <p className="font-display text-2xl font-semibold text-white">
                {orders.length}
              </p>
              <p className="text-[11px] uppercase tracking-widest text-white/60">
                Orders
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-3.5 backdrop-blur-sm">
              <p className="font-display text-2xl font-semibold text-white">
                {formatINR(totalSpent)}
              </p>
              <p className="text-[11px] uppercase tracking-widest text-white/60">
                Spent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* active order callout */}
      {activeOrders.length > 0 && (
        <div className="relative mt-6 flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <Truck className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-ink">
              {activeOrders.length} order
              {activeOrders.length > 1 ? "s" : ""} on the way
            </p>
            <p className="text-[13px] text-plum">
              Latest: {activeOrders[0].order_number} ·{" "}
              {statusConfig[activeOrders[0].status]?.label ??
                activeOrders[0].status}
            </p>
          </div>
        </div>
      )}

      {/* orders */}
      <div className="relative mt-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-ink">Order History</h2>
            <div className="petal-divider mt-3 w-32" />
          </div>
          <Link
            href="/shop"
            className="btn-sheen inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-rose-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
          >
            <ShoppingBag className="h-4 w-4" /> Order Flowers
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center rounded-[2rem] border border-rose-100 bg-white px-6 py-16 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-400">
              <Package className="h-9 w-9" />
            </span>
            <h3 className="mt-6 font-display text-2xl text-ink">
              No orders yet
            </h3>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-plum">
              When you order flowers with this number, they&apos;ll appear
              here with live status.
            </p>
            <Link
              href="/shop"
              className="btn-sheen mt-7 inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
            >
              Browse Flowers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const status =
                statusConfig[order.status] ?? {
                  label: order.status,
                  icon: Package,
                  classes: "bg-rose-50 text-rose-700 border-rose-200",
                };
              return (
                <div
                  key={order.id}
                  className="card-hover overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm"
                >
                  {/* order header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 bg-gradient-to-r from-blush to-white px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border ${status.classes}`}
                      >
                        <status.icon
                          className={`h-4 w-4 ${order.status === "pending" ? "animate-spin" : ""}`}
                        />
                      </span>
                      <div>
                        <p className="font-display text-[16px] font-semibold text-ink">
                          {order.order_number}
                        </p>
                        <p className="flex items-center gap-1.5 text-[12px] text-plum/70">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${status.classes}`}
                      >
                        {status.label}
                      </span>
                      <span className="font-display text-lg font-semibold text-ink">
                        {formatINR(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* items */}
                  <div className="flex flex-wrap items-center gap-4 px-6 py-5">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 4).map((item, i) => (
                        <div
                          key={i}
                          className="relative h-14 w-12 overflow-hidden rounded-xl border-2 border-white bg-rose-100 shadow-md"
                          style={{ zIndex: 4 - i }}
                        >
                          {item.image_url && (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-ink">
                        {order.items
                          .map((i) => `${i.qty} × ${i.name}`)
                          .join(", ")}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-plum/70">
                        <MapPin className="h-3 w-3" />
                        {order.city} · {order.pincode}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        order.payment_status === "paid"
                          ? "bg-sage-100 text-sage-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
