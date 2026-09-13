import { Phone, Mail, Clock, MapPin, MessageCircle, ArrowRight, Truck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};

const cards = [
  {
    icon: Phone,
    title: "Call / WhatsApp",
    main: "+91 98765 43210",
    sub: "Orders, delivery updates, decoration queries",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    title: "Email",
    main: "hello@arkiara.in",
    sub: "We reply within one business day",
    href: "mailto:hello@arkiara.in",
  },
  {
    icon: Clock,
    title: "Hours",
    main: "Monday – Sunday",
    sub: "8:00 AM – 8:00 PM",
  },
  {
    icon: MapPin,
    title: "Studio",
    main: "Arkiara Floral Studio",
    sub: "(Update with your full address)",
  },
];

const faqs = [
  {
    q: "How do I track my order?",
    a: "Sign in with your phone number and open My Orders for live status — from being arranged to out for delivery.",
  },
  {
    q: "Can I get same-day delivery?",
    a: "Yes — order by 2 PM and we deliver the same day within the city. Stock shown on the site is live and accurate.",
  },
  {
    q: "What payments do you accept?",
    a: "All major methods via Razorpay: UPI (GPay, PhonePe, Paytm), credit/debit cards and netbanking.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-18">
      <Reveal className="mb-12">
        <span className="eyebrow">We&apos;d love to hear from you</span>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink">
          Contact us
        </h1>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 70}>
            <div className="card-hover h-full rounded-2xl border border-line bg-surface p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <c.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-lg font-semibold text-ink">
                {c.title}
              </h2>
              {c.href ? (
                <a
                  href={c.href}
                  className="mt-1 block font-display text-[16px] font-semibold text-accent transition-colors hover:text-accent-strong"
                >
                  {c.main}
                </a>
              ) : (
                <p className="mt-1 font-display text-[16px] font-semibold text-ink">
                  {c.main}
                </p>
              )}
              <p className="mt-1.5 text-[13px] text-ink-3">{c.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-10">
        <div className="rounded-2xl border border-line bg-surface p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-carbon text-white">
              <MessageCircle className="h-4.5 w-4.5" />
            </span>
            <h2 className="font-display text-xl font-semibold text-ink">
              FAQs
            </h2>
          </div>
          <div className="mt-7 divide-y divide-line">
            {faqs.map((f) => (
              <div key={f.q} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-ink">{f.q}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={160} className="mt-10 text-center">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
          <ArrowRight className="h-4 w-4" />
        </a>
      </Reveal>

      <Reveal delay={200} className="mt-10">
        <div className="flex items-center justify-center gap-2 text-[12px] text-ink-3">
          <Truck className="h-3.5 w-3.5 text-accent" />
          Same-day delivery on orders placed before 2 PM
        </div>
      </Reveal>
    </div>
  );
}
