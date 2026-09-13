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
      <nav className="mb-8 flex items-center gap-1.5 text-[13px] text-ink-3">
        <Link href="/" className="transition-colors hover:text-ink">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="transition-colors hover:text-ink">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="max-w-[40vw] truncate font-medium text-ink">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface-2">
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
              <div className="flex h-full items-center justify-center text-line-strong">
                <Flower2 className="h-16 w-16" />
              </div>
            )}
            {product.is_bestseller && (
              <span className="absolute left-4 top-4 rounded-md bg-carbon px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                Bestseller
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-ink">
                {formatINR(product.price)}
              </span>
              {product.compare_price &&
                product.compare_price > product.price && (
                  <>
                    <span className="text-lg text-ink-3 line-through">
                      {formatINR(product.compare_price)}
                    </span>
                    <span className="rounded-md bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
                      Save {formatINR(product.compare_price - product.price)}
                    </span>
                  </>
                )}
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-ink-2">
              {product.description}
            </p>

            <div className="hairline my-8" />

            <AddToCartBox product={product} />

            <div className="mt-10 grid gap-3 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2">
              {[
                {
                  icon: Flower2,
                  text: "Freshly arranged on the day of delivery",
                },
                { icon: Clock, text: "Order by 2 PM for same-day delivery" },
                {
                  icon: Truck,
                  text: `Free delivery above ${formatINR(FREE_DELIVERY_ABOVE)}`,
                },
                {
                  icon: ShieldCheck,
                  text: "Secure UPI, cards & netbanking via Razorpay",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <p className="text-[13px] leading-snug text-ink-2">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <Reveal className="mb-8">
            <span className="eyebrow">You may also like</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
              Similar arrangements
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
