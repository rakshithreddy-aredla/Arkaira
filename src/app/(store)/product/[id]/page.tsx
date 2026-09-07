import { notFound } from "next/navigation";
import Image from "next/image";
import { formatINR } from "@/lib/format";
import { getProduct } from "@/lib/data";
import { AddToCartBox } from "@/components/add-to-cart-box";
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-rose-100 bg-rose-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 550px"
              className="object-cover"
            />
          ) : null}
          {product.is_bestseller && (
            <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Bestseller
            </span>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-rose-700">
              {formatINR(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <>
                <span className="text-lg text-plum/50 line-through">
                  {formatINR(product.compare_price)}
                </span>
                <span className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-bold text-sage-600">
                  Save{" "}
                  {formatINR(product.compare_price - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-[16px] leading-relaxed text-plum">
            {product.description}
          </p>

          <div className="petal-divider my-6" />

          <AddToCartBox product={product} />

          <ul className="mt-8 space-y-2.5 text-sm text-plum">
            <li>• Freshly arranged on the day of delivery</li>
            <li>• Order by 2 PM for same-day delivery</li>
            <li>• Free delivery on orders above ₹999</li>
            <li>• Secure payment via Razorpay (UPI / Cards / Netbanking)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
