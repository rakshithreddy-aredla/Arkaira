"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Flower2,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  Activity,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { syntheticEmail } from "@/lib/phone";
import { useToast } from "@/components/toast-provider";

type Mode = "start" | "password" | "signup";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = getSupabaseBrowserClient();

  const [mode, setMode] = useState<Mode>("start");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const validPhone = /^\d{10}$/.test(cleanPhone);
  const email = syntheticEmail(cleanPhone);

  const redirectAfterLogin = () => {
    const next = searchParams.get("next");
    const dest =
      next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/account";
    router.push(dest as "/account");
    router.refresh();
  };

  const backToStart = () => {
    setMode("start");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /* ---------- step 1: check the number ---------- */
  const checkPhoneAndRoute = async () => {
    if (!validPhone) {
      toast("Enter a valid 10-digit phone number", "error");
      return;
    }
    setChecking(true);
    try {
      const res = await fetch("/api/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      if (!res.ok) throw new Error();
      const { exists } = (await res.json()) as { exists: boolean };
      setMode(exists ? "password" : "signup");
    } catch {
      toast("Could not verify your number — please try again", "error");
    } finally {
      setChecking(false);
    }
  };

  /* ---------- password login ---------- */
  const loginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return toast("Enter your password", "error");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast("Welcome back!");
      redirectAfterLogin();
    } catch {
      toast("Wrong phone number or password", "error");
      setLoading(false);
    }
  };

  /* ---------- sign up: phone + password (synthetic email) ---------- */
  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return toast("Enter your name", "error");
    if (newPassword.length < 6)
      return toast("Password must be at least 6 characters", "error");
    if (newPassword !== confirmPassword)
      return toast("Passwords do not match", "error");

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: newPassword,
        options: {
          data: { full_name: newName.trim(), phone: cleanPhone },
        },
      });
      if (error) throw error;

      if (data.session) {
        toast("Welcome to Arkiara!");
        redirectAfterLogin();
      } else {
        toast("Account created — sign in with your password");
        setMode("password");
        setPassword("");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("already")) {
        toast("This number is already registered — sign in instead", "error");
        setMode("password");
      } else {
        toast("Could not create your account — please try again", "error");
      }
      setLoading(false);
    }
  };

  /* ======================= RENDER ======================= */

  const heading = {
    start: { title: "Welcome", sub: "Sign in or create your account" },
    password: { title: "Sign in", sub: `+91 ${cleanPhone}` },
    signup: { title: "Create account", sub: `Joining with +91 ${cleanPhone}` },
  }[mode];

  return (
    <div className="grid min-h-[calc(100vh-6rem)] lg:grid-cols-2">
      {/* ---- left: product panel ---- */}
      <div className="relative hidden overflow-hidden bg-carbon lg:block">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-carbon">
              <Flower2 className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Arkiara
            </span>
          </Link>

          <div className="animate-fade-up">
            <h2 className="max-w-md font-display text-5xl font-bold leading-[1.08] tracking-tight text-white">
              Your flowers,
              <br />
              <span className="text-accent">on demand.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">
              One phone number for everything — live order tracking, saved
              delivery details and faster checkout.
            </p>
            <div className="mt-10 space-y-5">
              {[
                {
                  icon: Activity,
                  title: "Live order tracking",
                  text: "Arranged → dispatched → delivered, in real time",
                },
                {
                  icon: Truck,
                  title: "Faster checkout",
                  text: "Details saved securely after your first order",
                },
                {
                  icon: ShieldCheck,
                  title: "Password-protected",
                  text: "One number, one password — that's it",
                },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent">
                    <f.icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-white">
                      {f.title}
                    </p>
                    <p className="text-[13px] text-white/50">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-[0.18em] text-white/30">
            Fresh flowers · Same-day delivery · arkiara.in
          </p>
        </div>
      </div>

      {/* ---- right: auth form ---- */}
      <div className="relative flex items-center justify-center bg-paper px-4 py-16 sm:px-8">
        <div className="relative w-full max-w-md">
          {mode !== "start" && (
            <button
              onClick={backToStart}
              className="btn-ghost mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Different number
            </button>
          )}

          <div className="card-hover rounded-2xl border border-line bg-surface p-8 sm:p-10">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
                {heading.title}
              </h1>
              <p className="mt-1 text-[14px] text-ink-2">{heading.sub}</p>
            </div>

            <div className="hairline my-7" />

            {/* ---------- MODE: START ---------- */}
            {mode === "start" && (
              <div className="animate-fade-in">
                <label className="label" htmlFor="login-phone">
                  Phone number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 rounded-md bg-surface-2 px-2 py-1 text-[13px] font-semibold text-ink-2">
                    +91
                  </span>
                  <input
                    id="login-phone"
                    className="field pl-[4.5rem] text-[16px] tracking-wide"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && validPhone)
                        checkPhoneAndRoute();
                    }}
                  />
                </div>

                <button
                  onClick={checkPhoneAndRoute}
                  disabled={!validPhone || checking}
                  className="btn-primary mt-6 w-full"
                >
                  {checking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Checking…
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-ink-3">
                  <ShieldCheck className="h-3.5 w-3.5 text-ok" />
                  Your number is never shared with anyone
                </p>
              </div>
            )}

            {/* ---------- MODE: PASSWORD ---------- */}
            {mode === "password" && (
              <form onSubmit={loginWithPassword} className="animate-fade-in">
                <label className="label" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    className="field pr-12"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toast(
                      "To reset your password, WhatsApp us at +91 98765 43210",
                      "info"
                    )
                  }
                  className="mt-4 text-[13px] font-semibold text-accent transition-colors hover:text-accent-strong"
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary mt-6 w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" /> Sign In
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ---------- MODE: SIGNUP ---------- */}
            {mode === "signup" && (
              <form onSubmit={signUp} className="animate-fade-in">
                <label className="label" htmlFor="signup-name">
                  Your name
                </label>
                <input
                  id="signup-name"
                  className="field"
                  placeholder="What should we call you?"
                  autoComplete="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />

                <div className="mt-5">
                  <label className="label" htmlFor="signup-password">
                    Create password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      className="field pr-12"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink"
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

                <div className="mt-5">
                  <label className="label" htmlFor="signup-confirm">
                    Confirm password
                  </label>
                  <input
                    id="signup-confirm"
                    className="field"
                    type="password"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary mt-7 w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Create Account
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="mt-7 text-center text-[11px] text-ink-3">
              By continuing you agree to our terms &amp; privacy policy.
            </p>
          </div>

          <p className="mt-6 text-center text-[13px] text-ink-2">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("start")}
                  className="font-semibold text-accent transition-colors hover:text-accent-strong"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="font-semibold text-accent transition-colors hover:text-accent-strong"
                >
                  Create an account
                </button>{" "}
                · Store owner?{" "}
                <Link
                  href="/admin/login"
                  className="font-semibold text-accent transition-colors hover:text-accent-strong"
                >
                  Admin
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
