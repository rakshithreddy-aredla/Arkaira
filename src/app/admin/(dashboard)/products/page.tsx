import { createServerSupabase } from "@/lib/admin-auth";
import type { Category, Product } from "@/lib/types";
import { ProductsManager } from "./products-manager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createServerSupabase();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: true }),
    supabase.from("categories").select("*").order("sort", { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Products & Stock</h1>
        <p className="text-sm text-plum">
          Changes save instantly and go live on the website in real time.
        </p>
      </div>
      <ProductsManager
        initialProducts={(products ?? []) as Product[]}
        categories={(categories ?? []) as Category[]}
      />
    </div>
  );
}
