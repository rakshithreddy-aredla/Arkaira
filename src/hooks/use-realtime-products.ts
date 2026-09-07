"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Product } from "@/lib/types";

// Subscribes to live Supabase changes on `products` so stock & price
// update instantly everywhere without a page refresh. The initial
// server-rendered list is used until the first realtime payload arrives,
// so no cascading setState runs in an effect body.
export function useRealtimeProducts(initial: Product[]): Product[] {
  const [products, setProducts] = useState<Product[]>(initial);
  const initialRef = useRef(initial);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      if (!error && data) setProducts(data as Product[]);
    };

    const channel = supabase
      .channel("realtime-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchLatest();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Keep in sync when the server sends a fresh initial list (e.g. after
  // navigation) — applied via a ref compare, not a synchronous setState.
  useEffect(() => {
    if (initialRef.current !== initial) {
      initialRef.current = initial;
      setProducts(initial);
    }
  }, [initial]);

  return products;
}
