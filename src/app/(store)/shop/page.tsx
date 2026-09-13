import { LiveProductGrid } from "@/components/live-product-grid";
import { Reveal } from "@/components/reveal";
import { getProducts, getCategories } from "@/lib/data";
import { Activity } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Flowers",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
      <Reveal className="mb-12">
        <span className="eyebrow">
          <Activity className="h-3.5 w-3.5" /> Live inventory
        </span>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink">
          Shop flowers
        </h1>
        <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink-2">
          Stock and prices update in real time — what you see is exactly
          what we have in the studio today.
        </p>
      </Reveal>
      <LiveProductGrid initialProducts={products} categories={categories} />
    </div>
  );
}
