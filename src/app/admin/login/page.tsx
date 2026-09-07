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
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white">
            <Flower2 className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-3xl text-ink">
            Arkaira Admin
          </h1>
          <p className="mt-2 text-[15px] text-plum">
            Sign in with your admin account to manage the store
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
