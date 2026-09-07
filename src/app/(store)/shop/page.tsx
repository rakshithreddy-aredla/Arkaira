import { LiveProductGrid } from "@/components/live-product-grid";
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] text-rose-600 uppercase">
          The Arkaira Collection
        </span>
        <h1 className="mt-3 font-display text-4xl text-ink">Shop Flowers</h1>
        <div className="petal-divider mx-auto mt-4 w-40" />
        <p className="mx-auto mt-4 max-w-md text-[15px] text-plum">
          Prices and availability update in real time — what you see is
          exactly what we have in the studio today.
        </p>
      </div>
      <LiveProductGrid
        initialProducts={products}
        categories={categories}
      />
    </div>
  );
}
