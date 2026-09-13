import Link from "next/link";
import { Flower2, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center">
      <div className="pointer-events-none absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-100/60 blur-3xl" />
      <span className="relative flex h-24 w-24 animate-float items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-500 shadow-inner">
        <Flower2 className="h-10 w-10" />
      </span>
      <p className="relative mt-8 font-display text-8xl leading-none text-gradient">
        404
      </p>
      <h1 className="relative mt-3 font-display text-3xl text-ink">
        This petal drifted away
      </h1>
      <p className="relative mt-3 max-w-md text-[15px] leading-relaxed text-plum">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to the fresh blooms.
      </p>
      <div className="relative mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="btn-sheen inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
        >
          Go Home
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-rose-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500"
        >
          Shop Flowers
        </Link>
      </div>
    </div>
  );
}
