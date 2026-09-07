import { createServerSupabase } from "@/lib/admin-auth";
import type { Order } from "@/lib/types";
import { OrdersTable } from "./orders-table";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Orders</h1>
        <p className="text-sm text-plum">
          Update status as you prepare and deliver each order.
        </p>
      </div>
      <OrdersTable initialOrders={(data ?? []) as Order[]} />
    </div>
  );
}
