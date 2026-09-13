import { adminDb } from "@/lib/supabase-admin";
import type { Order } from "@/lib/types";

// Fetches orders for a customer by phone using the service-role key on the
// server. The phone acts as the scope — this endpoint never returns other
// customers' orders and is only called from the server-rendered account
// page after verifying the user's session.
export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return [];

  const { data, error } = await adminDb()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getOrdersByPhone:", error.message);
    return [];
  }

  const orders = (data ?? []) as Order[];
  return orders.filter((o) => o.phone.replace(/\D/g, "").endsWith(digits));
}
