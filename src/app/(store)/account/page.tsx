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
import { formatPhone, getAccountPhone } from "@/lib/phone";
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
    classes: "bg-accent-soft text-accent border-accent-line",
  },
  processing: {
    label: "Being arranged",
    icon: Flower2,
    classes: "bg-accent-soft text-accent border-accent-line",
  },
  shipped: {
    label: "Out for delivery",
    icon: Truck,
    classes: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    classes: "bg-ok-soft text-ok border-green-200",
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

  const phone = getAccountPhone(user);
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
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      {/* header card */}
      <div className="relative overflow-hidden rounded-2xl bg-carbon p-8 sm:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent font-display text-2xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                My account
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">
                {name.split(" ")[0]}
              </h1>
              {phone && (
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/50">
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  {formatPhone(phone)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5">
              <p className="font-display text-2xl font-bold text-white">
                {orders.length}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
                Orders
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5">
              <p className="font-display text-2xl font-bold text-white">
                {formatINR(totalSpent)}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
                Spent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* active order callout */}
      {activeOrders.length > 0 && (
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Truck className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-ink">
              {activeOrders.length} order
              {activeOrders.length > 1 ? "s" : ""} on the way
            </p>
            <p className="text-[13px] text-ink-2">
              Latest: {activeOrders[0].order_number} ·{" "}
              {statusConfig[activeOrders[0].status]?.label ??
                activeOrders[0].status}
            </p>
          </div>
        </div>
      )}

      {/* orders */}
      <div className="mt-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Order history
            </h2>
            <div className="hairline mt-3 w-32" />
          </div>
          <Link href="/shop" className="btn-secondary">
            <ShoppingBag className="h-4 w-4" /> Order Flowers
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 text-ink-3">
              <Package className="h-7 w-7" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold text-ink">
              No orders yet
            </h3>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-ink-2">
              When you order flowers with this number, they&apos;ll appear
              here with live status.
            </p>
            <Link href="/shop" className="btn-primary mt-7">
              Browse Flowers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status =
                statusConfig[order.status] ?? {
                  label: order.status,
                  icon: Package,
                  classes: "bg-accent-soft text-accent border-accent-line",
                };
              return (
                <div
                  key={order.id}
                  className="card-hover overflow-hidden rounded-2xl border border-line bg-surface"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${status.classes}`}
                      >
                        <status.icon
                          className={`h-4 w-4 ${order.status === "pending" ? "animate-spin" : ""}`}
                        />
                      </span>
                      <div>
                        <p className="font-display text-[15px] font-semibold text-ink">
                          {order.order_number}
                        </p>
                        <p className="flex items-center gap-1.5 text-[12px] text-ink-3">
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
                        className={`rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${status.classes}`}
                      >
                        {status.label}
                      </span>
                      <span className="font-display text-lg font-bold text-ink">
                        {formatINR(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 px-6 py-5">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 4).map((item, i) => (
                        <div
                          key={i}
                          className="relative h-14 w-12 overflow-hidden rounded-lg border-2 border-surface bg-surface-2 shadow-sm"
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
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-3">
                        <MapPin className="h-3 w-3" />
                        {order.city} · {order.pincode}
                      </p>
                    </div>
                    <span
                      className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        order.payment_status === "paid"
                          ? "bg-ok-soft text-ok"
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
