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
        <div className="mb-10 inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1">
          <button
            onClick={() => setActiveCat("all")}
            className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
              activeCat === "all"
                ? "bg-carbon text-white"
                : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
                activeCat === c.id
                  ? "bg-carbon text-white"
                  : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 70}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="text-[15px] font-medium text-ink-2">
            Nothing in this category right now.
          </p>
          <p className="mt-1 text-[13px] text-ink-3">
            Live inventory refreshes automatically — check back soon.
          </p>
        </div>
      )}

      {limit && products.length > limit && (
        <div className="mt-12 text-center">
          <Link href="/shop" className="btn-secondary">
            View all flowers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
