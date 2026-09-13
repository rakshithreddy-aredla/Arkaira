import type { User } from "@supabase/supabase-js";

export const SYNTHETIC_SUFFIX = "@phone.arkiara.in";

export function syntheticEmail(digits: string): string {
  return `${digits}${SYNTHETIC_SUFFIX}`;
}

export function formatPhone(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return phone ?? "";
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

// Resolves the customer's 10-digit phone from whichever field Supabase
// stored it in: a real phone account, signup metadata, or the synthetic
// email used by the password-only login portal.
export function getAccountPhone(
  user: User | null | undefined
): string {
  if (!user) return "";
  if (user.phone) return user.phone.replace(/\D/g, "").slice(-10);
  const meta = user.user_metadata as { phone?: string } | undefined;
  if (meta?.phone) return meta.phone.replace(/\D/g, "").slice(-10);
  const match = (user.email ?? "").match(/^(\d{10})@phone\.arkiara\.in$/);
  if (match) return match[1];
  return "";
}
