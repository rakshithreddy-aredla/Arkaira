"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    let alive = true;
    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        if (alive) {
          setUser(data.session?.user ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export function formatPhone(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return phone ?? "";
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}
