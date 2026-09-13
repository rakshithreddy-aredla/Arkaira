import { redirect } from "next/navigation";
import { Flower2 } from "lucide-react";
import { LoginForm } from "./login-form";
import { createServerSupabase, isAdminEmail } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && isAdminEmail(user.email)) {
    redirect("/admin");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-drift rounded-full bg-rose-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 animate-drift-slow rounded-full bg-gold-100/80 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-9 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-xl shadow-rose-600/30">
            <Flower2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl text-ink">
            Arkaira Admin
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-plum">
            Sign in with your admin account to manage the store
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
