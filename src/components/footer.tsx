import Link from "next/link";
import {
  Flower2,
  Mail,
  Phone,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  Camera,
  AtSign,
} from "lucide-react";

const productLinks = [
  { href: "/shop", label: "Shop all flowers" },
  { href: "/decorations", label: "Event decoration" },
  { href: "/cart", label: "Cart" },
  { href: "/account", label: "My orders" },
] as const;

const companyLinks = [
  { href: "/contact", label: "Contact & FAQ" },
  { href: "/login", label: "Sign in" },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 bg-carbon text-white/70">
      {/* big brand line */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-carbon">
              <Flower2 className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Arkiara
            </span>
          </div>
          <Link href="/shop" className="btn-onDark">
            Shop fresh blooms
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        {/* brand */}
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold leading-tight text-white">
            Fresh flowers,
            <br />
            delivered like software.
          </h3>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed">
            Real-time inventory, atomic checkout, live order tracking. The
            most reliable way to send flowers in the city — powered by
            Arkiara.
          </p>
          <div className="mt-6 flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              aria-label="Instagram"
            >
              <Camera className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              aria-label="Facebook"
            >
              <AtSign className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* product */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Product
          </h4>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* company + contact */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-2 pt-2 text-white/60">
              <Phone className="h-3.5 w-3.5" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2 text-white/60">
              <Mail className="h-3.5 w-3.5" /> hello@arkiara.in
            </li>
            <li className="flex items-center gap-2 text-white/60">
              <Clock className="h-3.5 w-3.5" /> Mon–Sun, 8 AM–8 PM
            </li>
            <li className="flex items-center gap-2 text-white/60">
              <MapPin className="h-3.5 w-3.5" /> Arkiara Floral Studio
            </li>
          </ul>
        </div>
      </div>

      {/* assurance strip */}
      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-6 text-[12px] text-white/50 sm:grid-cols-3 sm:px-6">
          <span className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-accent" /> Same-day delivery, order
            by 2 PM
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" /> Secure payments —
            UPI, cards, netbanking
          </span>
          <span className="flex items-center gap-2">
            <Flower2 className="h-4 w-4 text-accent" /> 100% fresh
            guarantee
          </span>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Arkiara. All rights reserved.</span>
          <span>Payments secured by Razorpay · arkiara.in</span>
        </div>
      </div>
    </footer>
  );
}
