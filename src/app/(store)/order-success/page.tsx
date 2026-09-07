import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package } from "lucide-react";
import { getOrder } from "@/lib/data";
import { formatINR } from "@/lib/format";

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
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Order not found</h1>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h1 className="mt-5 font-display text-3xl text-ink">
          Thank you, {order.customer_name.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-plum">
          Your order is confirmed and we&apos;ve begun arranging your flowers.
        </p>

        <div className="mt-8 rounded-2xl bg-blush p-5 text-left">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Package className="h-4 w-4 text-rose-600" />
            Order {order.order_number}
          </div>
          <div className="mt-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative h-14 w-12 overflow-hidden rounded-lg bg-rose-100">
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
                <span className="text-[15px] text-plum">
                  {formatINR(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-rose-200/60 pt-4 text-[15px]">
            <div className="flex justify-between text-plum">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-plum">
              <span>Delivery</span>
              <span>
                {order.delivery_fee === 0
                  ? "FREE"
                  : formatINR(order.delivery_fee)}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-base font-semibold text-ink">
              <span>Paid</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-plum/80">
          A confirmation has been sent to your phone. For any changes, call us
          at <span className="font-semibold">+91 98765 43210</span>.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-rose-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
