"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Flower2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const mobileNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products & Stock" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/enquiries", label: "Decoration Enquiries" },
];

export function AdminTopbar({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-ink/10 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white">
          <Flower2 className="h-4 w-4" />
        </span>
        <span className="font-display text-lg">Admin</span>
      </div>
      <p className="hidden text-sm text-plum md:block">{email}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-plum transition hover:border-rose-400 hover:text-rose-600"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-plum md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="absolute left-0 right-0 top-full flex flex-col gap-1 border-b border-ink/10 bg-white px-4 py-3 md:hidden">
          {mobileNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-[15px] font-medium ${
                (item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href))
                  ? "bg-rose-100 text-rose-700"
                  : "text-plum hover:bg-rose-50"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
