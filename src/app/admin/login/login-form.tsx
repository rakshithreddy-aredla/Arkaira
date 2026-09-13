"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useToast } from "@/components/toast-provider";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast(
        err instanceof Error && err.message.includes("Invalid login")
          ? "Wrong email or password"
          : "Could not sign in — please try again",
        "error"
      );
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-hover rounded-[2rem] border border-rose-100 bg-white p-8 shadow-2xl shadow-rose-900/10"
    >
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="mt-5">
        <label className="label" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="field pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-plum/50 transition hover:text-rose-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" />
            ) : (
              <Eye className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="btn-sheen mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 disabled:shadow-none"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Sign In
          </>
        )}
      </button>
      <p className="mt-5 text-center text-[11px] leading-relaxed text-plum/60">
        Admin accounts are created in Supabase → Authentication → Users
      </p>
    </form>
  );
}
