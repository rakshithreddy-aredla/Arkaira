"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Flower2,
  ShoppingBag,
  Menu,
  X,
  UserCircle2,
  Package,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useSession, formatPhone } from "@/hooks/use-session";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/decorations", label: "Decorations" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => {
    setOpen(false);
    setAccountOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setAccountOpen(false);
    router.push("/");
    router.refresh();
  };

  // Admins sign in with email; customer accounts are phone-only
  // (synthetic @phone.arkaira.in emails) and must not see admin links.
  const isAdmin = !!user?.email && !user.email.endsWith("@phone.arkaira.in");

  return (
    <header className="sticky top-0 z-50">
      {/* announcement bar */}
      <div className="bg-ink text-white">
        <div className="marquee-hover-pause overflow-hidden py-1.5 text-[11px] font-medium tracking-[0.14em] uppercase">
          <div className="marquee gap-10 text-white/80">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-10 pr-10">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-gold-300" /> Freshly cut, hand-tied daily
                </span>
                <span>Same-day delivery on orders before 2 PM</span>
                <span className="text-gold-300">Free delivery above ₹999</span>
                <span>Weddings &amp; event decoration — enquire today</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* main bar */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-rose-100 bg-cream/85 shadow-[0_8px_30px_-18px_rgba(137,47,74,0.25)] backdrop-blur-xl"
            : "border-transparent bg-cream/70 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" onClick={closeMenus} className="group flex items-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-600/25 transition-transform duration-300 group-hover:rotate-[25deg]">
              <Flower2 className="h-5 w-5" />
            </span>
            <span className="font-display text-[22px] font-semibold tracking-wide text-ink">
              Arkaira
              <span className="text-rose-500">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                  <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMenus}
                  className={`relative rounded-full px-4 py-2 text-[14px] font-medium tracking-wide transition-colors ${
                    active
                      ? "text-rose-700"
                      : "text-plum hover:text-rose-600"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px bg-rose-500 transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* account */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex h-10 items-center gap-1.5 rounded-full border border-rose-200 bg-white pr-2.5 pl-2.5 text-plum transition hover:border-rose-400 hover:text-rose-600"
                aria-label="Account"
              >
                {user ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-[11px] font-bold text-white">
                    {(user.phone ?? user.email ?? "A").slice(-2, -1) || "A"}
                  </span>
                ) : (
                  <UserCircle2 className="h-5 w-5" />
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-plum/60 transition-transform duration-300 ${accountOpen ? "rotate-180" : ""}`}
                />
              </button>

              {accountOpen && (
                <div className="animate-pop-in absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xl shadow-rose-900/10">
                  {user ? (
                    <>
                      <div className="border-b border-rose-100 bg-rose-50/60 px-4 py-3.5">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-plum/60">
                          Signed in as
                        </p>
                        <p className="mt-1 truncate text-[15px] font-semibold text-ink">
                          {user.phone ? formatPhone(user.phone) : user.email}
                        </p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/account"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-plum transition hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Package className="h-4 w-4 text-rose-500" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-plum transition hover:bg-rose-50 hover:text-rose-700"
                          >
                            <LayoutDashboard className="h-4 w-4 text-rose-500" /> Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={signOut}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-plum transition hover:bg-rose-50 hover:text-rose-700"
                        >
                          <LogOut className="h-4 w-4 text-rose-500" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2">
                      <p className="px-3 pt-2 pb-1 text-[13px] leading-relaxed text-plum/80">
                        Sign in to track orders and check out faster.
                      </p>
                      <Link
                        href="/login"
                        onClick={() => setAccountOpen(false)}
                        className="btn-sheen mt-2 flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white transition hover:bg-rose-700"
                      >
                        <UserCircle2 className="h-4 w-4" /> Login / Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* cart */}
            <Link
              href="/cart"
              onClick={closeMenus}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-plum transition hover:border-rose-400 hover:text-rose-600"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-pop-in items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white shadow-md shadow-rose-600/40">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-plum md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="animate-fade-in flex flex-col gap-1 border-t border-rose-100 bg-cream px-4 py-3 md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-[15px] font-medium ${
                  pathname === l.href
                    ? "bg-rose-100 text-rose-700"
                    : "text-plum hover:bg-rose-50"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-[14px] font-semibold text-white"
              >
                <UserCircle2 className="h-4 w-4" /> Login / Sign Up
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
