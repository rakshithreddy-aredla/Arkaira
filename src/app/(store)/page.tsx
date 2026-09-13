import Link from "next/link";
import Image from "next/image";
import {
  Flower2,
  Truck,
  ShieldCheck,
  ArrowRight,
  Zap,
  Activity,
  Package,
  Heart,
  Star,
  Users,
  Clock,
} from "lucide-react";
import { LiveProductGrid } from "@/components/live-product-grid";
import { Reveal } from "@/components/reveal";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: Activity,
    title: "Real-time inventory",
    text: "Stock and prices sync live from the studio. What you see is exactly what exists — no stale listings, ever.",
  },
  {
    icon: Truck,
    title: "Same-day delivery",
    text: "Order by 2 PM and it arrives today. Every order is tracked from arrangement to doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Atomic checkout",
    text: "Our checkout locks stock at purchase time. Two buyers can never compete for the last bouquet.",
  },
  {
    icon: Heart,
    title: "Arranged by hand",
    text: "Farm-fresh stems, hand-tied the same day they're delivered. Tech handles the logistics, humans handle the craft.",
  },
];

const steps = [
  {
    n: "01",
    title: "Pick your bouquet",
    text: "Browse live availability across every category.",
  },
  {
    n: "02",
    title: "Checkout in seconds",
    text: "Phone login, saved details, secure UPI or card payment.",
  },
  {
    n: "03",
    title: "Track to the door",
    text: "Live status updates from arrangement to delivery.",
  },
];

const stats = [
  { icon: Users, value: "5,000+", label: "Orders delivered" },
  { icon: Flower2, value: "40+", label: "Live varieties" },
  { icon: Star, value: "4.9", label: "Average rating" },
  { icon: Clock, value: "< 3 hrs", label: "Avg. delivery time" },
];

const testimonials = [
  {
    quote:
      "Ordered at 11 AM, delivered by 1:30. The live stock counter is genius — I knew exactly what was available.",
    name: "Rahul M.",
    detail: "Anniversary order",
  },
  {
    quote:
      "They decorated our engagement venue. Guests kept asking who did the flowers. Flawless logistics.",
    name: "Priya & Arjun",
    detail: "Decoration client",
  },
  {
    quote:
      "Order tracking actually works. I could see when it was being arranged and when it left the studio.",
    name: "Sneha K.",
    detail: "Repeat customer",
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const liveCount = products.filter((p) => p.stock > 0).length;

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-carbon text-white">
        {/* grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <span className="eyebrow eyebrow-dark">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
              Live inventory · {liveCount} bouquets in stock
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[72px]">
              Flowers,
              <br />
              delivered like
              <br />
              <span className="text-accent">software.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">
              Hand-tied bouquets with real-time stock, atomic checkout and
              live order tracking. Order by 2 PM — it arrives today.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Shop Flowers
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/decorations" className="btn-onDark">
                Event Decoration
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] font-medium text-white/50">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-accent text-accent" /> 4.9 ·
                2,300+ reviews
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Secure UPI
                &amp; cards
              </span>
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent" /> Same-day delivery
              </span>
            </div>
          </div>

          {/* live inventory panel */}
          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-carbon-2/80 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
                  <span className="pulse-dot h-2 w-2 rounded-full bg-ok" />
                  Studio · Live
                </span>
                <span className="font-display text-[12px] font-semibold text-white/40">
                  updated just now
                </span>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {(featured.slice(0, 4).length > 0
                  ? featured.slice(0, 4)
                  : products.slice(0, 4)
                ).map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-carbon-3">
                      {p.image_url && (
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-white">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-[12px] text-white/40">
                        {p.stock > 0 ? (
                          p.stock <= 5 ? (
                            <span className="text-accent">
                              Only {p.stock} left
                            </span>
                          ) : (
                            `${p.stock} in stock`
                          )
                        ) : (
                          "Sold out"
                        )}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
                  </Link>
                ))}
              </div>
              <div className="border-t border-white/10 px-5 py-3.5">
                <Link
                  href="/shop"
                  className="flex items-center justify-between text-[13px] font-semibold text-white/70 transition-colors hover:text-white"
                >
                  View full inventory
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="max-w-xl">
          <span className="eyebrow">
            <Zap className="h-3.5 w-3.5" /> Why Arkaira
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Built like a product,
            <br />
            run by florists.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="card-hover h-full rounded-2xl border border-line bg-surface p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="border-y border-line bg-surface-2/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Fresh from the studio</span>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                Featured bouquets
              </h2>
            </div>
            <Link href="/shop" className="btn-secondary">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <LiveProductGrid
            initialProducts={featured.length > 0 ? featured : products}
            categories={[]}
          />
        </div>
      </section>

      {/* ================= STEPS ================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Three steps to done.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="relative h-full rounded-2xl border border-line bg-surface p-7">
                <span className="font-display text-5xl font-bold tracking-tight text-line-strong">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-y border-line bg-carbon py-14 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-3xl font-bold tracking-tight text-white">
                  {s.value}
                </p>
                <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-white/40">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="max-w-xl">
          <span className="eyebrow">Loved across the city</span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Customers, not reviews.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="card-hover flex h-full flex-col rounded-2xl border border-line bg-surface p-7">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-2">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon font-display text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">
                      {t.name}
                    </p>
                    <p className="text-[12px] text-ink-3">{t.detail}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= DECORATION CTA ================= */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-carbon px-6 py-16 text-center sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

            <span className="eyebrow eyebrow-dark relative">
              <Package className="h-3.5 w-3.5" />
              Weddings · Parties · Poojas · Corporate
            </span>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Whole-venue decoration,
              <br />
              <span className="text-accent">quoted in hours.</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/60">
              Share your event details and our stylists call you back with a
              custom quote — usually within a few hours.
            </p>
            <Link href="/decorations" className="btn-primary relative mt-9">
              Request a Callback
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
