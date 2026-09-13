import { LiveProductGrid } from "@/components/live-product-grid";
import { Reveal } from "@/components/reveal";
import { getProducts, getCategories } from "@/lib/data";
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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <Reveal className="mb-12 text-center">
          <span className="text-[11px] font-semibold tracking-[0.28em] text-rose-600 uppercase">
            The Arkaira Collection
          </span>
          <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">
            Shop <span className="italic text-gradient">Flowers</span>
          </h1>
          <div className="petal-divider mx-auto mt-5 w-44" />
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-plum">
            Prices and availability update in real time — what you see is
            exactly what we have in the studio today.
          </p>
        </Reveal>
        <LiveProductGrid initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
