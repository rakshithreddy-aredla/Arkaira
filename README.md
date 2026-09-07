# Arkaira — Flower E-commerce Store 🌸

An aesthetic, real-time online flower shop for **arkaira.in** with:

- **Live stock & prices** — inventory updates instantly on the storefront via Supabase Realtime (no page refresh)
- **Online payments** — Razorpay checkout (UPI / Cards / Netbanking) settled directly to your bank account
- **Decoration enquiries** — a dedicated page where customers request a callback for event decoration
- **Admin dashboard** at `/admin` — manage products, stock, prices, orders and callback requests
- Atomic stock deduction — two buyers can never oversell the last bouquet

---

## Tech Stack

| Layer     | Tech                                        |
| --------- | ------------------------------------------- |
| Frontend  | Next.js 16, Tailwind CSS v4, lucide-react   |
| Database  | Supabase (Postgres + Realtime + Auth)       |
| Payments  | Razorpay Orders API + signature verification |
| Hosting   | Vercel (free tier works fine)               |

---

## Setup Guide (step by step)

### 1 · Create a Supabase project

1. Go to <https://supabase.com> → **New project**
2. Choose a name (e.g. `arkaira`), a strong DB password, region **Mumbai**
3. When ready, open **SQL Editor → New query**, paste the entire contents of `supabase/schema.sql` and click **Run**
   - This creates tables, security rules, the atomic `place_order` function and 8 sample products

### 2 · Create your admin account

1. In Supabase, go to **Authentication → Users → Add user**
2. Enter your email + a strong password, turn on **Auto Confirm User**
3. This is the login you will use at `arkaira.in/admin`

### 3 · Get Razorpay keys

1. Sign up at <https://dashboard.razorpay.com> and complete KYC (PAN card + bank account)
   - This is required for **settlements to your bank account**
2. **Settings → API Keys → Generate Test Key** → copy Key ID + Secret for testing
3. When KYC is approved, switch to **Live keys** in production

### 4 · Run locally

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                   # open http://localhost:3000
```

Test the payment flow with Razorpay test cards (e.g. `4111 1111 1111 1111`).

### 5 · Deploy to Vercel

```bash
npm i -g vercel
vercel                       # first deploy
vercel --prod
```

In the Vercel dashboard → your project → **Settings → Environment Variables**, add all five variables from `.env.local` (Production + Preview).

### 6 · Connect your GoDaddy domain arkaira.in

1. In Vercel: **Project → Settings → Domains → Add** → enter `arkaira.in`
2. Vercel shows you DNS records like this:

   | Type  | Name    | Value                       |
   | ----- | ------- | --------------------------- |
   | A     | `@`     | `76.76.21.21`               |
   | CNAME | `www`   | `cname.vercel-dns.com`      |

3. In GoDaddy: **My Products → DNS → Manage Zones → arkaira.in**
   - Edit the **A** record (pointing to `@`) → change value to `76.76.21.21`
   - Edit the **CNAME** for `www` → change value to `cname.vercel-dns.com`
   - Delete any parked-domain A records GoDaddy added
4. Wait 5–30 minutes (up to 24h worst case) for DNS to propagate — Vercel then issues a free SSL certificate automatically. Your site is live at **https://arkaira.in**

---

## Daily Use

| Task                                | Where                              |
| ----------------------------------- | ---------------------------------- |
| Change stock or price               | `/admin/products` — edits go live instantly |
| Add a product                       | `/admin/products` → **Add Product** |
| See orders & mark status            | `/admin/orders`                    |
| Call back decoration customers      | `/admin/enquiries`                 |
| Sign out                            | Topbar → **Sign Out**              |

### Replacing sample content

- **Product photos:** edit the `image_url` of each product in `/admin/products`, or update rows in Supabase → Table Editor → `products`. Any `https://…` image URL works.
- **Phone number / email / address:** search for `+91 98765 43210`, `hello@arkaira.in` and the studio address in `src/components/footer.tsx`, `src/app/(store)/contact/page.tsx` and `src/app/(store)/order-success/page.tsx`, then replace with your own details.
- **Delivery fee / free-delivery threshold:** `src/lib/format.ts` (`DELIVERY_FEE`, `FREE_DELIVERY_ABOVE`) — and the matching logic inside the `place_order` function in `supabase/schema.sql`.

---

## Security Notes

- The **service role key** and **Razorpay secret** are used only in server code — never in the browser
- Payment success is **verified by HMAC signature** on the server before an order is marked paid
- All order writes from the public internet go through the `place_order` function which re-checks price and stock at purchase time — customers cannot tamper with prices
- Row Level Security: customers can only insert orders/enquiries; reads are restricted to your authenticated admin account
- `ADMIN_EMAILS` in `.env.local` restricts `/admin` to specific Supabase auth users

---

## Testing Payments (before going live)

1. Use Razorpay **Test** keys in `.env.local`
2. Pay with test card `4111 1111 1111 1111`, any future expiry, any CVV
3. Complete the UPI flow using the test VPA `success@razorpay`
4. Verify the order appears in `/admin/orders` with payment status **paid**
5. Switch Vercel env vars to **Live** keys once KYC completes — money now settles to your bank (T+2 days by default)
