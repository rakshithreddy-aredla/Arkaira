import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export async function placeOrder(
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
    notes: string;
  },
  items: { product_id: string; qty: number }[]
): Promise<{ order_id: string; order_number: string; total: number }> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: customer.name,
    p_phone: customer.phone,
    p_email: customer.email || null,
    p_address: customer.address,
    p_city: customer.city,
    p_pincode: customer.pincode,
    p_notes: customer.notes || null,
    p_items: items,
  });
  if (error) throw new Error(error.message);
  return data;
}
