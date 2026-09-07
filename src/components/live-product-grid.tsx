"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRealtimeProducts } from "@/hooks/use-realtime-products";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/lib/types";

export function LiveProductGrid({
  initialProducts,
  categories,
  limit,
}: {
  initialProducts: Product[];
  categories: Category[];
  limit?: number;
}) {
  const products = useRealtimeProducts(initialProducts);
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = products;
    if (activeCat !== "all") {
      list = list.filter((p) => p.category_id === activeCat);
    }
    if (limit) list = list.slice(0, limit);
    return list;
  }, [products, activeCat, limit]);

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCat("all")}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activeCat === "all"
                ? "border-rose-600 bg-rose-600 text-white"
                : "border-rose-200 bg-white text-plum hover:border-rose-400"
            }`}
          >
            All Flowers
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                activeCat === c.id
                  ? "border-rose-600 bg-rose-600 text-white"
                  : "border-rose-200 bg-white text-plum hover:border-rose-400"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-plum/70">
          No flowers in this category yet — check back soon!
        </p>
      )}

      {limit && products.length > limit && (
        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-7 py-3 text-sm font-semibold tracking-wide text-rose-700 transition hover:bg-rose-50"
          >
            View All Flowers
          </Link>
        </div>
      )}
    </div>
  );
}
