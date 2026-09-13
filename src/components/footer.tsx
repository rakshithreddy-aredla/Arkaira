import Link from "next/link";
import {
  Flower2,
  Camera,
  AtSign,
  Mail,
  Phone,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const quickLinks = [
  { href: "/shop", label: "Shop All Flowers" },
  { href: "/decorations", label: "Decoration Services" },
  { href: "/account", label: "My Account" },
  { href: "/cart", label: "Your Cart" },
  { href: "/contact", label: "Contact & FAQ" },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-rose-100 bg-blush">
      {/* decorative petals */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-gold-200/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr_1.4fr]">
        {/* brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-600/25">
              <Flower2 className="h-5 w-5" />
            </span>
            <span className="font-display text-[22px] font-semibold text-ink">
              Arkaira<span className="text-rose-500">.</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-plum">
            Fresh, hand-tied flowers for every occasion — delivered with care
            across the city. Decoration enquiries welcome.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-plum transition hover:-translate-y-0.5 hover:border-rose-400 hover:text-rose-600 hover:shadow-md hover:shadow-rose-600/10"
              aria-label="Instagram"
            >
              <Camera className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-plum transition hover:-translate-y-0.5 hover:border-rose-400 hover:text-rose-600 hover:shadow-md hover:shadow-rose-600/10"
              aria-label="Facebook"
            >
              <AtSign className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* quick links */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-[15px] text-plum">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-1.5 transition-colors hover:text-rose-600"
                >
                  <span className="h-px w-0 bg-rose-500 transition-all duration-300 group-hover:w-3" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
            Get in Touch
          </h3>
          <ul className="mt-5 space-y-3.5 text-[15px] text-plum">
            <li>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 transition-colors hover:text-rose-600"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                +91 98765 43210
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@arkaira.in"
                className="flex items-center gap-2.5 transition-colors hover:text-rose-600"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                hello@arkaira.in
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <Clock className="h-3.5 w-3.5" />
              </span>
              Mon – Sun, 8 AM – 8 PM
            </li>
            <li className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              Arkaira Floral Studio
            </li>
          </ul>
        </div>

        {/* assurance */}
        <div className="rounded-3xl border border-rose-100 bg-white/70 p-6 backdrop-blur-sm">
          <h3 className="font-display text-lg text-ink">
            The Arkaira Promise
          </h3>
          <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-plum">
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
              Secure payments via Razorpay — UPI, cards &amp; netbanking
            </li>
            <li className="flex items-start gap-2.5">
              <Flower2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              Farm-fresh stems, arranged the same day they&apos;re delivered
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              Same-day delivery on orders placed before 2 PM
            </li>
          </ul>
          <Link
            href="/shop"
            className="btn-sheen mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-[13px] font-semibold tracking-wide text-white transition hover:bg-rose-700"
          >
            Shop Fresh Blooms
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="relative border-t border-rose-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-plum/70 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Arkaira. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Payments secured by Razorpay · arkaira.in
          </span>
        </div>
      </div>
    </footer>
  );
}
