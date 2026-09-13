"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatINR, DELIVERY_FEE, FREE_DELIVERY_ABOVE } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, updateQty, remove } = useCart();
  const deliveryFee =
    lines.length === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const remaining = FREE_DELIVERY_ABOVE - subtotal;

  if (lines.length === 0) {
    return (
      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center">
        <div className="pointer-events-none absolute -top-8 h-56 w-56 rounded-full bg-rose-100/60 blur-3xl" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-400 shadow-inner">
          <ShoppingBag className="h-10 w-10" />
        </span>
        <h1 className="mt-7 font-display text-4xl text-ink">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-plum">
          Fill it with something beautiful for someone special.
        </p>
        <Link
          href="/shop"
          className="btn-sheen mt-9 inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
        >
          Browse Flowers
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">
        Your <span className="italic text-gradient">Cart</span>
      </h1>
      <div className="petal-divider my-7 max-w-28" />

      {/* free delivery nudge */}
      {remaining > 0 && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-rose-100 bg-blush px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <Truck className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-ink">
                Add {formatINR(remaining)} more for FREE delivery
              </p>
              <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-rose-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (subtotal / FREE_DELIVERY_ABOVE) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_390px]">
        <div className="space-y-4">
          {lines.map((line) => (
            <div
              key={line.product_id}
              className="flex gap-4 rounded-3xl border border-rose-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md hover:shadow-rose-900/5"
            >
              <Link
                href={`/product/${line.product_id}`}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-rose-50"
              >
                {line.image_url && (
                  <Image
                    src={line.image_url}
                    alt={line.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/product/${line.product_id}`}
                    className="font-display text-[17px] leading-snug text-ink transition-colors hover:text-rose-600"
                  >
                    {line.name}
                  </Link>
                  <button
                    onClick={() => remove(line.product_id)}
                    className="rounded-full p-1.5 text-plum/50 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${line.name}`}
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-rose-200 p-0.5">
                    <button
                      onClick={() => updateQty(line.product_id, line.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-plum transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold text-ink">
                      {line.qty}
                    </span>
                    <button
                      onClick={() => updateQty(line.product_id, line.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-plum transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-display text-lg font-semibold text-rose-700">
                    {formatINR(line.price * line.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-lg shadow-rose-900/5 lg:sticky lg:top-28">
          <div className="bg-gradient-to-r from-blush to-white px-7 py-5">
            <h2 className="font-display text-xl text-ink">Order Summary</h2>
          </div>
          <div className="px-7 pb-7 pt-5">
            <div className="space-y-3 text-[15px]">
              <div className="flex justify-between text-plum">
                <span>Subtotal</span>
                <span className="font-medium text-ink">
                  {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-plum">
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-sage-600">FREE</span>
                  ) : (
                    formatINR(deliveryFee)
                  )}
                </span>
              </div>
              {remaining > 0 && (
                <p className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs leading-relaxed text-rose-700">
                  Add {formatINR(remaining)} more to unlock free delivery
                </p>
              )}
              <div className="petal-divider" />
              <div className="flex justify-between font-display text-xl font-semibold text-ink">
                <span>Total</span>
                <span>{formatINR(subtotal + deliveryFee)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="btn-sheen mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-center text-[11px] text-plum/60">
              Secure checkout · UPI, Cards, Netbanking
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
