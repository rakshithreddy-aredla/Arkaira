import Link from "next/link";
import { Flower2, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-28 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-carbon text-white">
        <Flower2 className="h-7 w-7" />
      </span>
      <p className="mt-8 font-display text-8xl font-bold leading-none tracking-tight text-line-strong">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-2">
        The page you&apos;re looking for doesn&apos;t exist or has been
        moved. Let&apos;s get you back to the fresh blooms.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Go Home
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/shop" className="btn-secondary">
          Shop Flowers
        </Link>
      </div>
    </div>
  );
}
