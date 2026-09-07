"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatINR, DELIVERY_FEE, FREE_DELIVERY_ABOVE } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, updateQty, remove } = useCart();
  const deliveryFee =
    lines.length === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-400">
          <ShoppingBag className="h-9 w-9" />
        </span>
        <h1 className="mt-6 font-display text-3xl text-ink">
          Your cart is empty
        </h1>
        <p className="mt-3 text-plum">
          Fill it with something beautiful for someone special.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-rose-700"
        >
          Browse Flowers
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Your Cart</h1>
      <div className="petal-divider my-6 max-w-24" />

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {lines.map((line) => (
            <div
              key={line.product_id}
              className="flex gap-4 rounded-2xl border border-rose-100 bg-white p-4"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-rose-50">
                {line.image_url && (
                  <Image
                    src={line.image_url}
                    alt={line.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/product/${line.product_id}`}
                    className="font-display text-[17px] leading-snug text-ink hover:text-rose-600"
                  >
                    {line.name}
                  </Link>
                  <button
                    onClick={() => remove(line.product_id)}
                    className="text-plum/50 transition hover:text-rose-600"
                    aria-label={`Remove ${line.name}`}
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-rose-200">
                    <button
                      onClick={() =>
                        updateQty(line.product_id, line.qty - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-plum hover:text-rose-600"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {line.qty}
                    </span>
                    <button
                      onClick={() =>
                        updateQty(line.product_id, line.qty + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-plum hover:text-rose-600"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-rose-700">
                    {formatINR(line.price * line.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-rose-100 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-ink">Order Summary</h2>
          <div className="mt-5 space-y-3 text-[15px]">
            <div className="flex justify-between text-plum">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
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
            {subtotal < FREE_DELIVERY_ABOVE && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                Add {formatINR(FREE_DELIVERY_ABOVE - subtotal)} more for free
                delivery
              </p>
            )}
            <div className="petal-divider" />
            <div className="flex justify-between text-lg font-semibold text-ink">
              <span>Total</span>
              <span>{formatINR(subtotal + deliveryFee)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-rose-700"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
