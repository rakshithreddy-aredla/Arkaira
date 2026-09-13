import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ChevronRight, Flower2, Truck, Clock, ShieldCheck } from "lucide-react";
import { formatINR, FREE_DELIVERY_ABOVE } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/data";
import { AddToCartBox } from "@/components/add-to-cart-box";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = PageProps<"/product/[id]">;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "Flower" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = (await getProducts())
    .filter(
      (p) => p.category_id === product.category_id && p.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      {/* breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-[13px] text-plum/70">
        <Link href="/" className="transition-colors hover:text-rose-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="transition-colors hover:text-rose-600">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="max-w-[40vw] truncate font-medium text-ink">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-rose-100 bg-rose-50 shadow-xl shadow-rose-900/10">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-rose-300">
                <Flower2 className="h-16 w-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent" />
            {product.is_bestseller && (
              <span className="absolute left-5 top-5 rounded-full bg-rose-600 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-rose-900/30">
                Bestseller
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-rose-700">
                {formatINR(product.price)}
              </span>
              {product.compare_price &&
                product.compare_price > product.price && (
                  <>
                    <span className="text-xl text-plum/50 line-through">
                      {formatINR(product.compare_price)}
                    </span>
                    <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-bold tracking-wide text-sage-600">
                      Save {formatINR(product.compare_price - product.price)}
                    </span>
                  </>
                )}
            </div>

            <p className="mt-6 text-[16px] leading-relaxed text-plum">
              {product.description}
            </p>

            <div className="petal-divider my-8" />

            <AddToCartBox product={product} />

            <div className="mt-10 grid gap-3 rounded-3xl border border-rose-100 bg-white p-6 sm:grid-cols-2">
              {[
                {
                  icon: Flower2,
                  text: "Freshly arranged on the day of delivery",
                },
                { icon: Clock, text: "Order by 2 PM for same-day delivery" },
                {
                  icon: Truck,
                  text: `Free delivery on orders above ${formatINR(FREE_DELIVERY_ABOVE)}`,
                },
                {
                  icon: ShieldCheck,
                  text: "Secure payment via Razorpay — UPI, cards, netbanking",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <p className="text-[13px] leading-snug text-plum">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-24">
          <Reveal className="mb-8">
            <span className="text-[11px] font-semibold tracking-[0.28em] text-rose-600 uppercase">
              You may also love
            </span>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              Similar <span className="italic text-gradient">arrangements</span>
            </h2>
            <div className="petal-divider mt-4 max-w-44" />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
