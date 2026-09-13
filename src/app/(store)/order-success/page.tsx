import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, Phone, ArrowRight } from "lucide-react";
import { getOrder } from "@/lib/data";
import { formatINR } from "@/lib/format";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const order = params.id ? await getOrder(params.id) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-28 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
          Order not found
        </h1>
        <p className="mt-2 text-[14px] text-ink-2">
          We couldn&apos;t find that order — check the link or contact us.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Back to Shop
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:py-20">
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="border-b border-line bg-carbon px-8 py-10 text-center">
            <span className="animate-pop-in mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok text-white">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white">
              Order confirmed
            </h1>
            <p className="mt-1.5 text-[14px] text-white/60">
              Thanks, {order.customer_name.split(" ")[0]} — we&apos;ve started
              arranging your flowers.
            </p>
          </div>

          <div className="px-8 py-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Package className="h-4 w-4 text-accent" />
                {order.order_number}
              </div>
              <span className="rounded-md bg-ok-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ok">
                {order.payment_status === "paid" ? "Paid" : "Pending"}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-2">
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
                  <span className="flex-1 text-[14px] text-ink">
                    {item.qty} × {item.name}
                  </span>
                  <span className="text-[14px] font-medium text-ink-2">
                    {formatINR(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="hairline my-6" />

            <div className="space-y-2 text-[14px]">
              <div className="flex justify-between text-ink-2">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-2">
                <span>Delivery</span>
                <span>
                  {order.delivery_fee === 0
                    ? "FREE"
                    : formatINR(order.delivery_fee)}
                </span>
              </div>
              <div className="flex justify-between font-display text-lg font-bold text-ink">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-ink-3">
              <Phone className="h-3.5 w-3.5 text-accent" />
              Need changes? Call +91 98765 43210 ·{" "}
              <Link
                href="/account"
                className="font-semibold text-accent hover:text-accent-strong"
              >
                Track in My Orders
              </Link>
            </p>

            <Link href="/shop" className="btn-primary mt-6 w-full">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
