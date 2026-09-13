"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/components/toast-provider";
import { useRealtimeProducts } from "@/hooks/use-realtime-products";
import type { Product } from "@/lib/types";

export function AddToCartBox({ product }: { product: Product }) {
  const products = useRealtimeProducts([product]);
  const live = products.find((p) => p.id === product.id) ?? product;
  const { add } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const out = live.stock <= 0;

  const handleAdd = () => {
    const ok = add(live, qty);
    if (ok) toast(`${qty} × ${live.name} added to cart`);
    else
      toast(
        out ? "This item is out of stock" : "Not enough stock available",
        "error"
      );
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-line-strong bg-surface">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-10 w-10 items-center justify-center text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-semibold text-ink">
            {qty}
          </span>
          <button
            onClick={() => setQty(Math.min(live.stock, qty + 1))}
            className="flex h-10 w-10 items-center justify-center text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
            disabled={qty >= live.stock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={out}
          className={`btn-primary flex-1 ${
            out ? "cursor-not-allowed bg-line-strong text-ink-3" : ""
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {out ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
      <p className="mt-3.5 flex items-center gap-2 text-[13px] text-ink-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${out ? "bg-rose-500" : live.stock <= 5 ? "bg-accent pulse-dot" : "bg-ok"}`}
        />
        {out ? (
          <span className="font-semibold text-rose-600">
            Currently out of stock — check back soon.
          </span>
        ) : live.stock <= 5 ? (
          <span className="font-semibold text-accent">
            Only {live.stock} left in stock
          </span>
        ) : (
          <>In stock · {live.stock} available live</>
        )}
      </p>
    </div>
  );
}
