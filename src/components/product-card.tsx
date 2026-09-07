"use client";

import Image from "next/image";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/components/toast-provider";
import { ShoppingBag, Heart } from "lucide-react";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const out = product.stock <= 0;

  const handleAdd = () => {
    setAdding(true);
    const ok = add(product);
    if (ok) toast(`${product.name} added to cart`);
    else toast(out ? "This item is out of stock" : "No more stock available", "error");
    setTimeout(() => setAdding(false), 300);
  };

  return (
    <div className="card-hover group overflow-hidden rounded-2xl border border-rose-100 bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-rose-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-rose-300">
            <Heart className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_bestseller && (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Bestseller
            </span>
          )}
          {product.compare_price && product.compare_price > product.price && (
            <span className="rounded-full bg-sage-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {Math.round(
                (1 - product.price / product.compare_price) * 100
              )}
              % off
            </span>
          )}
        </div>
        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}
        {!out && product.stock <= 5 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-rose-700 shadow-sm">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-[17px] leading-snug text-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-plum/80">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold text-rose-700">
              {formatINR(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-plum/50 line-through">
                {formatINR(product.compare_price)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={out || adding}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
              out
                ? "cursor-not-allowed bg-rose-100 text-rose-300"
                : "bg-rose-600 text-white hover:bg-rose-700 active:scale-95"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
