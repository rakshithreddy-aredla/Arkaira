import { createClient } from "@supabase/supabase-js";
import type { Category, Order, Product } from "@/lib/types";

function readClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await readClient()
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("getProducts:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await readClient()
    .from("categories")
    .select("*")
    .order("sort", { ascending: true });
  if (error) {
    console.error("getCategories:", error.message);
    return [];
  }
  return (data ?? []) as Category[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await readClient()
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as Product;
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await readClient()
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Order;
}
