"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRealtimeProducts } from "@/hooks/use-realtime-products";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
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
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCat("all")}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
              activeCat === "all"
                ? "border-rose-600 bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                : "border-rose-200 bg-white text-plum hover:border-rose-400 hover:text-rose-700"
            }`}
          >
            All Flowers
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeCat === c.id
                  ? "border-rose-600 bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "border-rose-200 bg-white text-plum hover:border-rose-400 hover:text-rose-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-plum/70">
          No flowers in this category yet — check back soon!
        </p>
      )}

      {limit && products.length > limit && (
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="btn-sheen inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-7 py-3 text-sm font-semibold tracking-wide text-rose-700 transition hover:border-rose-500 hover:bg-rose-50"
          >
            View All Flowers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
