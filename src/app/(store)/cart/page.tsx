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
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-28 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 text-ink-3">
          <ShoppingBag className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink">
          Your cart is empty
        </h1>
        <p className="mt-2 text-[14px] text-ink-2">
          Pick something beautiful for someone special.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Browse Flowers
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
        Cart
      </h1>

      {/* free delivery nudge */}
      {remaining > 0 && (
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-line bg-surface px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Truck className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-ink">
              Add {formatINR(remaining)} more for free delivery
            </p>
            <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_DELIVERY_ABOVE) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {lines.map((line) => (
            <div
              key={line.product_id}
              className="flex gap-4 rounded-2xl border border-line bg-surface p-4"
            >
              <Link
                href={`/product/${line.product_id}`}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2"
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
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/product/${line.product_id}`}
                    className="font-display text-[16px] font-semibold leading-snug text-ink transition-colors hover:text-accent"
                  >
                    {line.name}
                  </Link>
                  <button
                    onClick={() => remove(line.product_id)}
                    className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-accent"
                    aria-label={`Remove ${line.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-line-strong">
                    <button
                      onClick={() => updateQty(line.product_id, line.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink-2 transition-colors hover:text-ink"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold text-ink">
                      {line.qty}
                    </span>
                    <button
                      onClick={() => updateQty(line.product_id, line.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink-2 transition-colors hover:text-ink"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-display text-lg font-bold text-ink">
                    {formatINR(line.price * line.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit overflow-hidden rounded-2xl border border-line bg-surface lg:sticky lg:top-28">
          <div className="border-b border-line px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              Summary
            </h2>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-2.5 text-[14px]">
              <div className="flex justify-between text-ink-2">
                <span>Subtotal</span>
                <span className="font-medium text-ink">
                  {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-ink-2">
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-ok">FREE</span>
                  ) : (
                    formatINR(deliveryFee)
                  )}
                </span>
              </div>
              {remaining > 0 && (
                <p className="rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent">
                  {formatINR(remaining)} more unlocks free delivery
                </p>
              )}
              <div className="hairline" />
              <div className="flex justify-between font-display text-xl font-bold text-ink">
                <span>Total</span>
                <span>{formatINR(subtotal + deliveryFee)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3.5 text-center text-[11px] text-ink-3">
              Secure checkout · UPI, cards, netbanking
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
