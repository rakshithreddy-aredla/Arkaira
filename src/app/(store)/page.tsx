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
  Star,
  Quote,
  Gem,
  Award,
  Users,
} from "lucide-react";
import { LiveProductGrid } from "@/components/live-product-grid";
import { Reveal } from "@/components/reveal";
import { getProducts, getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

const marqueeWords = [
  "Roses",
  "Lilies",
  "Sunflowers",
  "Tulips",
  "Carnations",
  "Orchids",
  "Peonies",
  "Marigolds",
];

const valueProps = [
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
];

const stats = [
  { icon: Users, value: "5,000+", label: "Happy customers" },
  { icon: Flower2, value: "40+", label: "Fresh varieties" },
  { icon: Award, value: "4.9★", label: "Average rating" },
  { icon: Gem, value: "100%", label: "Fresh guarantee" },
];

const testimonials = [
  {
    quote:
      "Ordered the Grand 50 Rose Bouquet for my wife's birthday — she cried. Delivered in two hours, still cold from the farm.",
    name: "Rahul M.",
    detail: "Anniversary order",
  },
  {
    quote:
      "They decorated our entire engagement venue. Guests kept asking who did the flowers. Worth every rupee.",
    name: "Priya & Arjun",
    detail: "Decoration client",
  },
  {
    quote:
      "The Pastel Dream Mix is now my monthly ritual for my mother. Always fresh, always on time.",
    name: "Sneha K.",
    detail: "Repeat customer",
  },
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const featured = products.filter((p) => p.is_featured).slice(0, 8);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-blush">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-drift rounded-full bg-rose-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 animate-drift-slow rounded-full bg-gold-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-rose-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-rose-700 uppercase shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              Fresh blooms every day
            </span>
            <h1 className="mt-6 font-display text-[42px] leading-[1.08] text-ink sm:text-6xl md:text-[68px]">
              Say it
              <br />
              <span className="italic text-gradient">beautifully,</span>
              <br />
              with flowers.
            </h1>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-plum">
              Hand-tied bouquets and bespoke floral decor from Arkaira —
              farm-fresh stems, arranged with love, delivered to the people
              who matter most.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="btn-sheen inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-2xl hover:shadow-rose-700/40"
              >
                Shop Flowers
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/decorations"
                className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white/80 px-8 py-4 text-sm font-semibold tracking-wide text-rose-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500 hover:bg-white"
              >
                <PhoneCall className="h-4 w-4" />
                Decoration Enquiry
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] font-medium text-plum">
              <span className="flex items-center gap-2">
                <Truck className="h-4.5 w-4.5 text-sage-600" /> Same-day
                delivery
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-sage-600" />{" "}
                Secure payments
              </span>
              <span className="flex items-center gap-2">
                <HeartHandshake className="h-4.5 w-4.5 text-sage-600" />{" "}
                100% fresh guarantee
              </span>
            </div>
          </div>

          {/* hero visual */}
          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              {/* rotating ring */}
              <div className="absolute -inset-6 -z-10 rounded-t-[12rem] rounded-b-[3rem] border border-rose-200/70 [border-radius:50%_50%_46%_46%/60%_60%_42%_42%]" />
              <div className="relative h-full overflow-hidden rounded-t-[10rem] rounded-b-[2.5rem] shadow-2xl shadow-rose-900/25 ring-8 ring-white">
                <Image
                  src="https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=1000"
                  alt="Premium flower bouquet from Arkaira"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
              </div>

              {/* floating rating card */}
              <div className="animate-float absolute -left-3 top-14 rounded-2xl border border-rose-100 bg-white/90 px-4 py-3 shadow-xl shadow-rose-900/10 backdrop-blur-md sm:-left-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-gold-500 text-gold-500"
                    />
                  ))}
                </div>
                <p className="mt-1 text-[11px] font-semibold tracking-wide text-ink">
                  4.9 · 2,300+ reviews
                </p>
              </div>

              {/* floating guarantee card */}
              <div className="animate-float-delayed absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-rose-100 bg-white/95 px-5 py-4 shadow-xl shadow-rose-900/15 backdrop-blur-md sm:left-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600">
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-ink">
                    100% Fresh Guarantee
                  </p>
                  <p className="text-[11px] text-plum">
                    Hand-delivered within hours of cutting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FLOWER MARQUEE ================= */}
      <section className="border-y border-rose-100 bg-cream py-5">
        <div className="marquee-hover-pause overflow-hidden">
          <div className="marquee items-center gap-16 pr-16">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-16 pr-16"
              >
                {marqueeWords.map((w) => (
                  <span
                    key={`${copy}-${w}`}
                    className="flex items-center gap-16 font-display text-2xl text-ink/25 italic"
                  >
                    {w}
                    <Flower2 className="h-4 w-4 text-rose-300" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BESTSELLERS ================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="mb-12 text-center">
          <span className="text-[11px] font-semibold tracking-[0.28em] text-rose-600 uppercase">
            Fresh from the garden
          </span>
          <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Featured <span className="italic text-gradient">Blooms</span>
          </h2>
          <div className="petal-divider mx-auto mt-5 w-44" />
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-plum">
            Our most-loved arrangements, updated live as stock moves through
            the studio today.
          </p>
        </Reveal>
        <LiveProductGrid
          initialProducts={featured.length > 0 ? featured : products}
          categories={[]}
        />
      </section>

      {/* ================= SHOP BY CATEGORY ================= */}
      {categories.length > 0 && (
        <section className="bg-blush py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="mb-10 text-center">
              <span className="text-[11px] font-semibold tracking-[0.28em] text-rose-600 uppercase">
                Find your mood
              </span>
              <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
                Shop by <span className="italic text-gradient">Category</span>
              </h2>
              <div className="petal-divider mx-auto mt-5 w-44" />
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-3">
              {categories.map((cat, i) => {
                const cover =
                  products.find((p) => p.category_id === cat.id)
                    ?.image_url ?? "";
                const count = products.filter(
                  (p) => p.category_id === cat.id
                ).length;
                return (
                  <Reveal key={cat.id} delay={i * 120}>
                    <Link
                      href={`/shop?cat=${cat.slug}`}
                      className="card-hover group relative block overflow-hidden rounded-3xl border border-rose-100 bg-white"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={cat.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-rose-100 text-rose-400">
                            <Flower2 className="h-10 w-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                          <div>
                            <h3 className="font-display text-2xl text-white">
                              {cat.name}
                            </h3>
                            <p className="text-[12px] font-medium tracking-wide text-white/75">
                              {count} arrangement{count === 1 ? "" : "s"}
                            </p>
                          </div>
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-rose-600 group-hover:shadow-lg group-hover:shadow-rose-900/40">
                            <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-rotate-45" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= STATS BAND ================= */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="card-hover rounded-3xl border border-rose-100 bg-white p-6 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-display text-3xl font-semibold text-ink">
                  {s.value}
                </p>
                <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.14em] text-plum/70">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= VALUE PROPS ================= */}
      <section className="relative overflow-hidden bg-blush py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-gold-200/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {valueProps.map((item, i) => (
            <Reveal key={item.title} delay={i * 130}>
              <div className="card-hover group h-full rounded-3xl border border-rose-100 bg-white p-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <item.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-xl text-ink">
                  {item.title}
                </h3>
                <div className="petal-divider mx-auto mt-4 w-20" />
                <p className="mt-4 text-[14px] leading-relaxed text-plum/90">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="mb-12 text-center">
          <span className="text-[11px] font-semibold tracking-[0.28em] text-rose-600 uppercase">
            Loved across the city
          </span>
          <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Words from <span className="italic text-gradient">our customers</span>
          </h2>
          <div className="petal-divider mx-auto mt-5 w-44" />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 130}>
              <figure className="card-hover relative h-full rounded-3xl border border-rose-100 bg-white p-7">
                <Quote className="absolute -top-3 left-6 h-8 w-8 rounded-full bg-rose-600 p-1.5 text-white shadow-lg shadow-rose-600/40" />
                <div className="flex items-center gap-1 pt-2">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 fill-gold-500 text-gold-500"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-plum">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-rose-100 pt-4">
                  <p className="font-display text-[16px] font-semibold text-ink">
                    {t.name}
                  </p>
                  <p className="text-[12px] font-medium tracking-wide text-rose-600 uppercase">
                    {t.detail}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= DECORATION CTA ================= */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center shadow-2xl shadow-ink/30 sm:px-12">
            {/* glow orbs */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 animate-drift rounded-full bg-rose-900/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 animate-drift-slow rounded-full bg-rose-800/40 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-gold-600/15 blur-3xl" />

            <span className="relative text-[11px] font-semibold tracking-[0.3em] text-rose-300 uppercase">
              Weddings · Parties · Poojas · Corporate
            </span>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl">
              Need a whole venue{" "}
              <span className="italic text-gradient">decorated?</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
              Share your event details and our floral stylists will call you
              back with ideas and a custom quote — usually within a few
              hours.
            </p>
            <Link
              href="/decorations"
              className="btn-sheen relative mt-10 inline-flex items-center gap-2 rounded-full bg-rose-500 px-9 py-4 text-sm font-semibold tracking-wide text-white shadow-2xl shadow-rose-600/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-400"
            >
              Request a Callback
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
