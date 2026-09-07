"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";

export type CartLine = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image_url: string;
};

type CartContextType = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => boolean;
  updateQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const STORAGE_KEY = "arkaira_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore saved cart once on mount. The read is deferred to a timer
  // callback so state updates happen in response to the external store,
  // not synchronously during the effect.
  useEffect(() => {
    const restore = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setLines(JSON.parse(raw));
      } catch {
        /* ignore corrupted cart */
      }
      setHydrated(true);
    };
    const t = window.setTimeout(restore, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    }
  }, [lines, hydrated]);

  const add = useCallback((product: Product, qty = 1): boolean => {
    if (product.stock <= 0) return false;
    let ok = false;
    setLines((prev) => {
      const existing = prev.find((l) => l.product_id === product.id);
      const alreadyIn = existing?.qty ?? 0;
      if (alreadyIn + qty > product.stock) return prev;
      ok = true;
      if (existing) {
        return prev.map((l) =>
          l.product_id === product.id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          qty,
          image_url: product.image_url,
        },
      ];
    });
    return ok;
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.product_id !== productId)
        : prev.map((l) => (l.product_id === productId ? { ...l, qty } : l))
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product_id !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <CartContext.Provider
      value={{ lines, count, subtotal, add, updateQty, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}
