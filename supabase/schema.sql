-- ============================================================
-- ARKAIRA – Flower E-commerce Database Schema (Supabase)
-- Run this ENTIRE file in: Supabase Dashboard → SQL Editor
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- TABLES ----------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort int not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text not null default '',
  price int not null check (price >= 0),
  compare_price int,
  stock int not null default 0 check (stock >= 0),
  image_url text not null default '',
  is_active boolean not null default true,
  is_bestseller boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  pincode text not null,
  notes text,
  items jsonb not null,
  subtotal int not null,
  delivery_fee int not null default 0,
  total int not null,
  status text not null default 'pending' check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','failed','refunded')),
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.decoration_queries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  event_type text not null,
  event_date date,
  budget text,
  details text,
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);

-- ---------- INDICES ----------
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active) where is_active = true;
create index if not exists idx_orders_created on public.orders(created_at desc);

-- ---------- REALTIME ----------
-- Instant stock & price updates pushed to the storefront
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.decoration_queries;

-- ---------- ROW LEVEL SECURITY ----------

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.decoration_queries enable row level security;

-- Public catalog: anyone can read
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read products" on public.products for select using (true);

-- Customers can create their own orders; nobody can read/update them without the anon key checks below
create policy "Public insert orders" on public.orders for insert with check (true);

-- Anyone can submit a decoration query
create policy "Public insert queries" on public.decoration_queries for insert with check (true);

-- Authenticated admins (added as users in Supabase → Authentication) get full access
create policy "Admin write categories" on public.categories for all to authenticated using (true) with check (true);
create policy "Admin write products"   on public.products   for all to authenticated using (true) with check (true);
create policy "Admin read orders"      on public.orders     for select to authenticated using (true);
create policy "Admin update orders"    on public.orders     for update to authenticated using (true) with check (true);
create policy "Admin read queries"     on public.decoration_queries for select to authenticated using (true);
create policy "Admin update queries"   on public.decoration_queries for update to authenticated using (true) with check (true);

-- ---------- HELPER: atomic order + stock deduction ----------
-- Called with the SUPABASE SERVICE ROLE key from the Next.js server.
-- Atomically re-validates prices/stock and decrements stock so two buyers
-- can never oversell the last bouquet.

create or replace function public.place_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_city text,
  p_pincode text,
  p_notes text,
  p_items jsonb  -- [{product_id, qty}]
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal int := 0;
  v_delivery int;
  v_total int;
  v_line jsonb;
  v_pid uuid;
  v_qty int;
  v_price int;
  v_stock int;
  v_name text;
  v_img text;
  v_lines jsonb := '[]'::jsonb;
begin
  -- basic validation
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'CART_EMPTY';
  end if;

  -- build order lines, validating price + stock at THIS moment
  for v_line in select * from jsonb_array_elements(p_items) loop
    v_pid := (v_line->>'product_id')::uuid;
    v_qty := coalesce((v_line->>'qty')::int, 0);
    if v_qty <= 0 then
      raise exception 'INVALID_QTY';
    end if;

    select price, stock, name, image_url into v_price, v_stock, v_name, v_img
      from public.products
     where id = v_pid and is_active = true
       for update;

    if v_pid is null or v_name is null then
      raise exception 'PRODUCT_NOT_FOUND: %', v_pid;
    end if;
    if v_stock < v_qty then
      raise exception 'OUT_OF_STOCK: %', v_name;
    end if;

    update public.products
       set stock = stock - v_qty, updated_at = now()
     where id = v_pid;

    v_lines := v_lines || jsonb_build_object(
      'product_id', v_pid,
      'name', v_name,
      'price', v_price,
      'qty', v_qty,
      'image_url', v_img
    );
    v_subtotal := v_subtotal + (v_price * v_qty);
  end loop;

  -- delivery fee: flat ₹49, free above ₹999
  v_delivery := case when v_subtotal >= 99900 then 0 else 4900 end;
  v_total := v_subtotal + v_delivery;

  v_order_number := 'ARK' || to_char(now(),'YYMMDD') || upper(substr(md5(random()::text), 1, 4));
  insert into public.orders (
    order_number, customer_name, phone, email, address, city, pincode, notes,
    items, subtotal, delivery_fee, total
  ) values (
    v_order_number, p_customer_name, p_phone, p_email, p_address, p_city, p_pincode, p_notes,
    v_lines, v_subtotal, v_delivery, v_total
  ) returning id into v_order_id;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery,
    'total', v_total
  );
end;
$$;

-- ---------- MARK ORDER PAID (called ONLY by the Next.js server with the
-- service-role key after verifying the Razorpay signature) ----------
create or replace function public.mark_order_paid(
  p_order_id uuid,
  p_razorpay_order_id text,
  p_razorpay_payment_id text
)
returns void
language sql
security definer
as $$
  update public.orders
     set payment_status = 'paid',
         status = 'processing',
         razorpay_order_id = p_razorpay_order_id,
         razorpay_payment_id = p_razorpay_payment_id,
         updated_at = now()
   where id = p_order_id;
$$;

-- Only the server (service role) may mark orders paid — never the browser
revoke execute on function public.mark_order_paid(uuid, text, text) from anon, authenticated, public;
grant execute on function public.mark_order_paid(uuid, text, text) to service_role;

-- ---------- SEED DATA (replace image_url values with your real photos) ----------

insert into public.categories (name, slug, sort) values
  ('Bouquets', 'bouquets', 1),
  ('Roses', 'roses', 2),
  ('Occasions', 'occasions', 3)
on conflict (slug) do nothing;

insert into public.products (name, category_id, description, price, compare_price, stock, image_url, is_bestseller, is_featured) values
  ('Blushing Pink Roses Bouquet', (select id from public.categories where slug='bouquets'), 'A lush arrangement of 20 fresh pink roses wrapped in premium Korean paper with a satin ribbon.', 79900, 99900, 12, 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=800', true, true),
  ('Red Rose Elegance', (select id from public.categories where slug='roses'), 'Two dozen hand-picked red roses – the classic way to say I love you.', 109900, 129900, 8, 'https://images.pexels.com/photos/7196011/pexels-photo-7196011.jpeg?auto=compress&cs=tinysrgb&w=800', true, true),
  ('Pastel Dream Mix', (select id from public.categories where slug='bouquets'), 'Carnations, baby’s breath and seasonal blooms in soft pastel tones.', 64900, 79900, 15, 'https://images.pexels.com/photos/1254165/pexels-photo-1254165.jpeg?auto=compress&cs=tinysrgb&w=800', false, true),
  ('White Serenity Lilies', (select id from public.categories where slug='occasions'), 'Oriental lilies with eucalyptus greens – graceful and fragrant.', 89900, null, 6, 'https://images.pexels.com/photos/1126963/pexels-photo-1126963.jpeg?auto=compress&cs=tinysrgb&w=800', false, false),
  ('Birthday Blooms Box', (select id from public.categories where slug='occasions'), 'A designer flower box with mixed blooms – perfect for birthdays and anniversaries.', 99900, 119900, 10, 'https://images.pexels.com/photos/1429128/pexels-photo-1429128.jpeg?auto=compress&cs=tinysrgb&w=800', false, true),
  ('Sunflower Sunshine', (select id from public.categories where slug='bouquets'), 'Five bright sunflowers with foliage – guaranteed to make someone’s day.', 74900, null, 9, 'https://images.pexels.com/photos/1425717/pexels-photo-1425717.jpeg?auto=compress&cs=tinysrgb&w=800', false, false),
  ('Lavender Love Bouquet', (select id from public.categories where slug='bouquets'), 'Purple statice, roses and limonium in a dreamy lavender palette.', 69900, 89900, 14, 'https://images.pexels.com/photos/132682/pexels-photo-132682.jpeg?auto=compress&cs=tinysrgb&w=800', false, false),
  ('Grand 50 Rose Bouquet', (select id from public.categories where slug='roses'), 'Fifty premium red roses – our most extravagant statement piece.', 249900, 299900, 4, 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=800', true, false)
on conflict do nothing;
