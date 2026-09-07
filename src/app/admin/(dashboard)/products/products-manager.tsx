"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Trash2, PackagePlus, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useToast } from "@/components/toast-provider";
import { formatINR } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

type Draft = {
  name: string;
  category_id: string;
  description: string;
  price: string;
  compare_price: string;
  stock: string;
  image_url: string;
  is_active: boolean;
  is_bestseller: boolean;
  is_featured: boolean;
};

const emptyDraft = (catId: string): Draft => ({
  name: "",
  category_id: catId,
  description: "",
  price: "",
  compare_price: "",
  stock: "",
  image_url: "",
  is_active: true,
  is_bestseller: false,
  is_featured: false,
});

export function ProductsManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // live sync
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("admin-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        async () => {
          const { data } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: true });
          if (data) setProducts(data as Product[]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateProduct = async (
    id: string,
    patch: Partial<Product>,
    label: string
  ) => {
    setBusyId(id);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("products")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      );
      toast(label);
    } catch {
      toast("Update failed — check your connection & permissions", "error");
    } finally {
      setBusyId(null);
    }
  };

  const deleteProduct = async (p: Product) => {
    if (!confirm(`Delete "${p.name}" permanently?`)) return;
    setBusyId(p.id);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("products").delete().eq("id", p.id);
      if (error) throw error;
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      toast(`Deleted "${p.name}"`);
    } catch {
      toast("Delete failed", "error");
    } finally {
      setBusyId(null);
    }
  };

  const createProduct = async () => {
    if (!draft) return;
    if (!draft.name.trim()) return toast("Product name is required", "error");
    const price = Math.round(parseFloat(draft.price || "0") * 100);
    if (!price || price <= 0) return toast("Enter a valid price", "error");
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const compare = draft.compare_price
        ? Math.round(parseFloat(draft.compare_price) * 100)
        : null;
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: draft.name.trim(),
          category_id: draft.category_id || null,
          description: draft.description.trim(),
          price,
          compare_price: compare && compare > price ? compare : null,
          stock: parseInt(draft.stock || "0", 10) || 0,
          image_url: draft.image_url.trim(),
          is_active: draft.is_active,
          is_bestseller: draft.is_bestseller,
          is_featured: draft.is_featured,
        })
        .select()
        .single();
      if (error) throw error;
      setProducts((prev) => [...prev, data as Product]);
      setCreating(false);
      setDraft(null);
      toast(`Added "${draft.name}" — live on the site now`);
    } catch {
      toast("Could not add product", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-plum">
          {products.length} products · edits are live instantly
        </p>
        <button
          onClick={() => {
            setCreating(true);
            setDraft(emptyDraft(categories[0]?.id ?? ""));
          }}
          className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {creating && draft && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">New Product</h2>
            <button
              onClick={() => {
                setCreating(false);
                setDraft(null);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-plum hover:bg-rose-50"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Name</label>
              <input
                className="field"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="e.g. Blushing Pink Roses Bouquet"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                className="field"
                value={draft.category_id}
                onChange={(e) => setDraft({ ...draft, category_id: e.target.value })}
              >
                <option value="">— none —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Image URL</label>
              <input
                className="field"
                value={draft.image_url}
                onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                placeholder="https://… (photo of the bouquet)"
              />
            </div>
            <div>
              <label className="label">Price (₹)</label>
              <input
                className="field"
                inputMode="decimal"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                placeholder="799"
              />
            </div>
            <div>
              <label className="label">MRP / compare price (₹, optional)</label>
              <input
                className="field"
                inputMode="decimal"
                value={draft.compare_price}
                onChange={(e) => setDraft({ ...draft, compare_price: e.target.value })}
                placeholder="999"
              />
            </div>
            <div>
              <label className="label">Stock quantity</label>
              <input
                className="field"
                inputMode="numeric"
                value={draft.stock}
                onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
                placeholder="10"
              />
            </div>
            <div className="flex flex-wrap items-end gap-4">
              {(
                [
                  ["is_active", "Visible on site"],
                  ["is_bestseller", "Bestseller badge"],
                  ["is_featured", "Show on homepage"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-plum">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-rose-600"
                    checked={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="field"
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={createProduct}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:bg-plum/30"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <PackagePlus className="h-4 w-4" /> Add to Store
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCreating(false);
                setDraft(null);
              }}
              className="rounded-full border border-ink/15 px-6 py-2.5 text-sm font-semibold text-plum hover:bg-ink/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-[15px]">
          <thead>
            <tr className="border-b border-ink/10 bg-ink/[0.03] text-left text-[13px] uppercase tracking-wide text-plum/70">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price (₹)</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Visible</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {products.map((p) => (
              <tr key={p.id} className={busyId === p.id ? "opacity-50" : ""}>
                <td className="max-w-60 px-4 py-3">
                  <p className="truncate font-medium text-ink">{p.name}</p>
                  <p className="truncate text-xs text-plum/60">
                    {p.description}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      defaultValue={(p.price / 100).toString()}
                      onBlur={(e) => {
                        const v = Math.round(parseFloat(e.target.value || "0") * 100);
                        if (v !== p.price && v >= 0)
                          updateProduct(p.id, { price: v }, "Price updated — live now");
                      }}
                      className="w-20 rounded-lg border border-ink/15 px-2 py-1.5 text-sm"
                    />
                  </div>
                  {p.compare_price && (
                    <p className="mt-0.5 text-xs text-plum/50 line-through">
                      {formatINR(p.compare_price)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        updateProduct(
                          p.id,
                          { stock: Math.max(0, p.stock - 1) },
                          `Stock: ${p.name} → ${Math.max(0, p.stock - 1)}`
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-plum hover:border-rose-400 hover:text-rose-600"
                      aria-label="Decrease stock"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      defaultValue={p.stock}
                      key={`stock-${p.stock}`}
                      onBlur={(e) => {
                        const v = parseInt(e.target.value || "0", 10);
                        if (v !== p.stock && v >= 0)
                          updateProduct(p.id, { stock: v }, `Stock: ${p.name} → ${v}`);
                      }}
                      className="w-16 rounded-lg border border-ink/15 px-2 py-1.5 text-sm"
                    />
                    <button
                      onClick={() =>
                        updateProduct(
                          p.id,
                          { stock: p.stock + 1 },
                          `Stock: ${p.name} → ${p.stock + 1}`
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-plum hover:border-rose-400 hover:text-rose-600"
                      aria-label="Increase stock"
                    >
                      +
                    </button>
                  </div>
                  {p.stock === 0 && (
                    <span className="mt-1 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                      Out of stock
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      updateProduct(
                        p.id,
                        { is_active: !p.is_active },
                        p.is_active
                          ? "Hidden from storefront"
                          : "Now visible on storefront"
                      )
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      p.is_active ? "bg-sage-500" : "bg-ink/20"
                    }`}
                    aria-label="Toggle visibility"
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        p.is_active ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deleteProduct(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-plum transition hover:border-rose-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="py-12 text-center text-sm text-plum/60">
            No products yet — add your first bouquet!
          </p>
        )}
      </div>
    </div>
  );
}
