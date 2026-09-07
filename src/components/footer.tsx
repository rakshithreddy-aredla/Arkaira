import Link from "next/link";
import { Flower2, Camera, AtSign, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-rose-100 bg-blush">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white">
              <Flower2 className="h-5 w-5" />
            </span>
            <span className="font-display text-xl text-ink">Arkaira</span>
          </div>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-plum">
            Fresh, hand-tied flowers for every occasion — delivered with care
            across the city. Decoration enquiries welcome.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-white text-plum transition hover:border-rose-400 hover:text-rose-600"
              aria-label="Instagram"
            >
              <Camera className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-white text-plum transition hover:border-rose-400 hover:text-rose-600"
              aria-label="Facebook"
            >
              <AtSign className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-ink">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-[15px] text-plum">
            <li>
              <Link href="/shop" className="hover:text-rose-600">
                Shop All Flowers
              </Link>
            </li>
            <li>
              <Link href="/decorations" className="hover:text-rose-600">
                Decoration Services
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-rose-600">
                Your Cart
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-rose-600">
                Contact & FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-ink">Get in Touch</h3>
          <ul className="mt-4 space-y-2.5 text-[15px] text-plum">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-rose-600" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-rose-600" /> hello@arkaira.in
            </li>
            <li>Mon – Sun, 8 AM to 8 PM</li>
          </ul>
          <p className="mt-5 text-xs text-plum/70">
            Payments secured by Razorpay · UPI, Cards & Netbanking
          </p>
        </div>
      </div>
      <div className="border-t border-rose-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-plum/70 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Arkaira. All rights reserved.</span>
          <span>arkaira.in</span>
        </div>
      </div>
    </footer>
  );
}
