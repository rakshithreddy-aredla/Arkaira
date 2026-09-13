"use client";

import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/components/toast-provider";
import { ShoppingBag, Flower2 } from "lucide-react";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const out = product.stock <= 0;
  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round((1 - product.price / product.compare_price) * 100)
      : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    const ok = add(product);
    if (ok) toast(`${product.name} added to cart`);
    else
      toast(
        out ? "This item is out of stock" : "No more stock available",
        "error"
      );
    setTimeout(() => setAdding(false), 300);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="card-hover group block overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-line-strong">
            <Flower2 className="h-10 w-10" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.is_bestseller && (
            <span className="rounded-md bg-carbon px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
              Bestseller
            </span>
          )}
          {discount && (
            <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
              {discount}% off
            </span>
          )}
        </div>

        {/* stock status */}
        <div className="absolute bottom-3 left-3">
          {out ? (
            <span className="rounded-md bg-carbon px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Sold out
            </span>
          ) : product.stock <= 5 ? (
            <span className="rounded-md bg-surface px-2.5 py-1 text-[11px] font-bold text-accent shadow-sm">
              {product.stock} left
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-md bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-ink-2 shadow-sm backdrop-blur-sm">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" />
              In stock
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-line p-4">
        <h3 className="font-display text-[16px] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-3">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold text-ink">
              {formatINR(product.price)}
            </span>
            {product.compare_price &&
              product.compare_price > product.price && (
                <span className="text-[12px] text-ink-3 line-through">
                  {formatINR(product.compare_price)}
                </span>
              )}
          </div>
          <button
            onClick={handleAdd}
            disabled={out || adding}
            aria-label={`Add ${product.name} to cart`}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
              out
                ? "cursor-not-allowed bg-surface-2 text-ink-3"
                : "bg-accent text-white hover:bg-accent-strong active:scale-90"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
