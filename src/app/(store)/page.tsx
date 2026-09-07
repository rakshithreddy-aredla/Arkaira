import Link from "next/link";
import Image from "next/image";
import {
  Flower2,
  Truck,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import { LiveProductGrid } from "@/components/live-product-grid";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.is_featured).slice(0, 8);

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-blush">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-widest text-rose-700 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Fresh blooms every day
            </span>
            <h1 className="mt-6 font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              Say it beautifully,
              <br />
              <span className="text-rose-600 italic">with flowers.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-plum">
              Hand-tied bouquets and bespoke floral decor from Arkaira —
              farm-fresh stems, arranged with love, delivered to the people
              who matter most.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-rose-700"
              >
                Shop Flowers
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/decorations"
                className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-rose-700 transition hover:bg-rose-50"
              >
                <PhoneCall className="h-4 w-4" />
                Decoration Enquiry
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-plum">
              <span className="flex items-center gap-2">
                <Truck className="h-4.5 w-4.5 text-sage-600" /> Same-day
                delivery
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-sage-600" /> Secure
                payments
              </span>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-[10rem] rounded-b-3xl border-8 border-white shadow-2xl">
              <Image
                src="https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Premium flower bouquet from Arkaira"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-rose-100 bg-white/95 px-5 py-4 shadow-lg backdrop-blur sm:left-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <HeartHandshake className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-base font-semibold text-ink">
                  100% Fresh Guarantee
                </p>
                <p className="text-xs text-plum">
                  Hand-delivered within hours of cutting
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- BESTSELLERS ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold tracking-[0.25em] text-rose-600 uppercase">
            Fresh from the garden
          </span>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Featured Blooms
          </h2>
          <div className="petal-divider mx-auto mt-4 w-40" />
        </div>
        <LiveProductGrid
          initialProducts={featured.length > 0 ? featured : products}
          categories={[]}
        />
      </section>

      {/* ---------- VALUE PROPS ---------- */}
      <section className="bg-blush py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6">
          {[
            {
              icon: Flower2,
              title: "Farm-Fresh Stems",
              text: "Sourced daily from local growers so every petal arrives at its peak.",
            },
            {
              icon: Truck,
              title: "Same-Day Delivery",
              text: "Order by 2 PM and your flowers reach your loved ones today.",
            },
            {
              icon: PhoneCall,
              title: "Event Decorations",
              text: "Weddings, parties and poojas — tell us your date, we call you back.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-rose-100 bg-white p-7 text-center"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-plum/90">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- DECORATION CTA ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-rose-900/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-rose-900/40 blur-3xl" />
          <span className="relative text-xs font-semibold tracking-[0.25em] text-rose-300 uppercase">
            Weddings · Parties · Poojas · Corporate
          </span>
          <h2 className="relative mt-4 font-display text-3xl text-white sm:text-4xl">
            Need a whole venue decorated?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            Share your event details and our floral stylists will call you back
            with ideas and a custom quote — usually within a few hours.
          </p>
          <Link
            href="/decorations"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-rose-500 px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-rose-400"
          >
            Request a Callback
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
