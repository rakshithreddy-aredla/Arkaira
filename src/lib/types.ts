export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  compare_price: number | null;
  stock: number;
  image_url: string;
  is_active: boolean;
  is_bestseller: boolean;
  is_featured: boolean;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image_url: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  pincode: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  payment_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
};

export type DecorationQuery = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  event_type: string;
  event_date: string | null;
  budget: string | null;
  details: string | null;
  status: string;
  created_at: string;
};
