import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  ArrowRight,
  Flower2,
} from "lucide-react";
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
    sub: "For orders, delivery updates and decoration queries",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    title: "Email",
    main: "hello@arkaira.in",
    sub: "We reply within one business day",
    href: "mailto:hello@arkaira.in",
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
    main: "Arkaira Floral Studio",
    sub: "(Update with your full address)",
  },
];

const faqs = [
  {
    q: "How do I track my order?",
    a: "Sign in with your phone number and open My Orders for live status, or WhatsApp us with your order number.",
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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20">
        <Reveal className="mb-14 text-center">
          <span className="text-[11px] font-semibold tracking-[0.28em] text-rose-600 uppercase">
            We&apos;d love to hear from you
          </span>
          <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">
            Contact <span className="italic text-gradient">Us</span>
          </h1>
          <div className="petal-divider mx-auto mt-5 w-44" />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <div
                className={`card-hover h-full rounded-3xl border border-rose-100 bg-white p-8 ${
                  c.href ? "group cursor-pointer" : ""
                }`}
                {...(c.href ? { onClick: undefined } : {})}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 shadow-inner">
                  <c.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-xl text-ink">
                  {c.title}
                </h2>
                {c.href ? (
                  <a
                    href={c.href}
                    className="mt-1.5 block font-display text-[17px] font-semibold text-rose-700 transition-colors group-hover:text-rose-600"
                  >
                    {c.main}
                  </a>
                ) : (
                  <p className="mt-1.5 font-display text-[17px] font-semibold text-ink">
                    {c.main}
                  </p>
                )}
                <p className="mt-2 text-[13px] leading-relaxed text-plum/80">
                  {c.sub}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-10">
          <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-blush p-8 sm:p-10">
            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-rose-200/50 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white">
                <MessageCircle className="h-5 w-5" />
              </span>
              <h2 className="font-display text-2xl text-ink">FAQs</h2>
            </div>
            <div className="relative mt-7 space-y-7">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-2xl border border-rose-100 bg-white/80 p-5 backdrop-blur-sm"
                >
                  <h3 className="flex items-start gap-2 font-semibold text-ink">
                    <Flower2 className="mt-1 h-4 w-4 shrink-0 text-rose-500" />
                    {f.q}
                  </h3>
                  <p className="mt-2 pl-6 text-[14px] leading-relaxed text-plum">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-12 text-center">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="btn-sheen inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </div>
  );
}
