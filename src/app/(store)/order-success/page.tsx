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
      <div className="mx-auto max-w-2xl px-4 py-28 text-center">
        <h1 className="font-display text-4xl text-ink">Order not found</h1>
        <p className="mt-3 text-plum">
          We couldn&apos;t find that order — check the link or contact us.
        </p>
        <Link
          href="/shop"
          className="btn-sheen mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition hover:bg-rose-700"
        >
          Back to Shop
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-16 sm:py-20">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-rose-100/60 blur-3xl" />
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-rose-100 bg-white p-9 text-center shadow-2xl shadow-rose-900/10 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-rose-50 blur-2xl" />
          <span className="relative mx-auto flex h-20 w-20 animate-pop-in items-center justify-center rounded-full bg-gradient-to-br from-sage-100 to-sage-200 text-sage-600 shadow-lg shadow-sage-600/20">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h1 className="relative mt-6 font-display text-4xl text-ink">
            Thank you,{" "}
            <span className="italic text-gradient">
              {order.customer_name.split(" ")[0]}!
            </span>
          </h1>
          <p className="relative mt-3 text-[15px] leading-relaxed text-plum">
            Your order is confirmed and we&apos;ve begun arranging your
            flowers.
          </p>

          <div className="relative mt-9 rounded-3xl border border-rose-100 bg-blush p-6 text-left">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Package className="h-4 w-4 text-rose-600" />
              Order {order.order_number}
            </div>
            <div className="mt-5 space-y-3.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative h-14 w-12 overflow-hidden rounded-xl bg-rose-100">
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
                  <span className="flex-1 text-[15px] text-ink">
                    {item.qty} × {item.name}
                  </span>
                  <span className="text-[15px] font-medium text-plum">
                    {formatINR(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-rose-200/60 pt-5 text-[15px]">
              <div className="flex justify-between text-plum">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              <div className="mt-1.5 flex justify-between text-plum">
                <span>Delivery</span>
                <span>
                  {order.delivery_fee === 0
                    ? "FREE"
                    : formatINR(order.delivery_fee)}
                </span>
              </div>
              <div className="mt-3 flex justify-between font-display text-lg font-semibold text-ink">
                <span>Paid</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </div>
          </div>

          <p className="relative mt-7 flex items-center justify-center gap-1.5 text-[13px] text-plum/80">
            <Phone className="h-3.5 w-3.5 text-rose-600" />
            Need changes? Call us at{" "}
            <span className="font-semibold text-ink">+91 98765 43210</span>
          </p>
          <Link
            href="/shop"
            className="btn-sheen relative mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
