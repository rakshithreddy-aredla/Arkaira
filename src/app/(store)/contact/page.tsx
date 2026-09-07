import { Phone, Mail, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <div className="mb-12 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] text-rose-600 uppercase">
          We&apos;d love to hear from you
        </span>
        <h1 className="mt-3 font-display text-4xl text-ink">Contact Us</h1>
        <div className="petal-divider mx-auto mt-4 w-40" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-white p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Phone className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-display text-xl text-ink">Call / WhatsApp</h2>
          <p className="mt-2 text-[15px] text-plum">+91 98765 43210</p>
          <p className="mt-1 text-sm text-plum/70">
            For orders, delivery updates and decoration queries
          </p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-display text-xl text-ink">Email</h2>
          <p className="mt-2 text-[15px] text-plum">hello@arkaira.in</p>
          <p className="mt-1 text-sm text-plum/70">
            We reply within one business day
          </p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Clock className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-display text-xl text-ink">Hours</h2>
          <p className="mt-2 text-[15px] text-plum">Monday – Sunday</p>
          <p className="mt-1 text-sm text-plum/70">8:00 AM – 8:00 PM</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <MapPin className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-display text-xl text-ink">Studio</h2>
          <p className="mt-2 text-[15px] text-plum">
            Arkaira Floral Studio
          </p>
          <p className="mt-1 text-sm text-plum/70">
            (Update with your full address)
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-rose-100 bg-blush p-7">
        <h2 className="font-display text-xl text-ink">FAQs</h2>
        <div className="mt-5 space-y-6">
          <div>
            <h3 className="font-semibold text-ink">
              How do I track my order?
            </h3>
            <p className="mt-1 text-[15px] text-plum">
              Call or WhatsApp us on +91 98765 43210 with your order number
              and we&apos;ll give you a live update.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">
              Can I get same-day delivery?
            </h3>
            <p className="mt-1 text-[15px] text-plum">
              Yes — order by 2 PM and we deliver the same day within the
              city. Stock shown on the site is live and accurate.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">
              What payments do you accept?
            </h3>
            <p className="mt-1 text-[15px] text-plum">
              All major methods via Razorpay: UPI (GPay, PhonePe, Paytm),
              credit/debit cards and netbanking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
