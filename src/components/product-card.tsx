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
    setTimeout(() => setAdding(false), 350);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="card-hover group block overflow-hidden rounded-3xl border border-rose-100 bg-white"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-rose-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-rose-300">
            <Flower2 className="h-10 w-10" />
          </div>
        )}

        {/* hover gradient veil */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.is_bestseller && (
            <span className="rounded-full bg-rose-600/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-md shadow-rose-900/20 backdrop-blur-sm">
              Bestseller
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-sage-600/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-md shadow-sage-900/20 backdrop-blur-sm">
              {discount}% off
            </span>
          )}
        </div>

        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream/70 backdrop-blur-[3px]">
            <span className="rounded-full bg-ink px-4 py-1.5 text-[13px] font-semibold text-white shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
        {!out && product.stock <= 5 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-rose-700 shadow-md backdrop-blur-sm">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-[17px] leading-snug text-ink transition-colors group-hover:text-rose-700">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-plum/80">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-semibold text-rose-700">
              {formatINR(product.price)}
            </span>
            {product.compare_price &&
              product.compare_price > product.price && (
                <span className="text-[13px] text-plum/50 line-through">
                  {formatINR(product.compare_price)}
                </span>
              )}
          </div>
          <button
            onClick={handleAdd}
            disabled={out || adding}
            aria-label={`Add ${product.name} to cart`}
            className={`btn-sheen flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
              out
                ? "cursor-not-allowed bg-rose-100 text-rose-300"
                : "bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 hover:shadow-rose-700/40 active:scale-90"
            }`}
          >
            <ShoppingBag
              className={`h-4.5 w-4.5 transition-transform ${adding ? "scale-75" : ""}`}
            />
          </button>
        </div>
      </div>
    </Link>
  );
}
