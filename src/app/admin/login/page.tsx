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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-carbon px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-carbon">
            <Flower2 className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
            Arkiara Admin
          </h1>
          <p className="mt-2 text-[13px] text-white/50">
            Sign in to manage the store
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
