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
  Zap,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useSession } from "@/hooks/use-session";
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
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  const isAdmin = !!user?.email && !user.email.endsWith("@phone.arkaira.in");

  return (
    <header className="sticky top-0 z-50">
      {/* status strip */}
      <div className="bg-carbon text-white/70">
        <div className="marquee-hover-pause overflow-hidden py-1.5">
          <div className="marquee items-center gap-8 pr-8 text-[11px] font-medium tracking-[0.08em] uppercase">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-8 pr-8"
              >
                <span className="flex items-center gap-1.5">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" />
                  Live inventory synced
                </span>
                <span>Same-day delivery on orders before 2 PM</span>
                <span className="text-white">Free delivery above ₹999</span>
                <span>Event decoration — get a quote today</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* main bar */}
      <div
        className={`border-b transition-colors duration-200 ${
          scrolled
            ? "border-line bg-paper/90 shadow-[0_1px_12px_-6px_rgba(19,19,19,0.15)] backdrop-blur-xl"
            : "border-line bg-paper/80 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            onClick={closeMenus}
            className="flex items-center gap-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-carbon text-white">
              <Flower2 className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Arkaira
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
                  className={`rounded-lg px-3.5 py-2 text-[14px] font-medium transition-colors ${
                    active
                      ? "bg-surface-2 text-ink"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            {/* account */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-2.5 text-ink-2 transition-colors hover:border-ink hover:text-ink"
                aria-label="Account"
              >
                {user ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-white">
                    {(user.email ?? user.phone ?? "A").charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserCircle2 className="h-4.5 w-4.5" />
                )}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                />
              </button>

              {accountOpen && (
                <div className="animate-pop-in absolute right-0 top-11 w-60 rounded-xl border border-line bg-surface shadow-xl shadow-ink/10">
                  {user ? (
                    <>
                      <div className="border-b border-line px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                          Signed in
                        </p>
                        <p className="mt-0.5 truncate text-[14px] font-semibold text-ink">
                          {user.email?.replace("@phone.arkaira.in", "") ??
                            user.phone ??
                            "Customer"}
                        </p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/account"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                        >
                          <Package className="h-4 w-4" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                          >
                            <LayoutDashboard className="h-4 w-4" /> Admin
                          </Link>
                        )}
                        <button
                          onClick={signOut}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3">
                      <p className="text-[13px] leading-relaxed text-ink-3">
                        Sign in to track orders and check out faster.
                      </p>
                      <Link
                        href="/login"
                        onClick={() => setAccountOpen(false)}
                        className="btn-primary mt-3 w-full"
                      >
                        Login / Sign Up
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
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-surface text-ink-2 transition-colors hover:border-ink hover:text-ink"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {count > 0 && (
                <span className="animate-pop-in absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-surface text-ink-2 md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="animate-fade-in flex flex-col gap-1 border-t border-line bg-paper px-4 py-3 md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-[15px] font-medium ${
                  pathname === l.href
                    ? "bg-surface-2 text-ink"
                    : "text-ink-2 hover:bg-surface-2"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2"
              >
                <Zap className="h-4 w-4" /> Login / Sign Up
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
