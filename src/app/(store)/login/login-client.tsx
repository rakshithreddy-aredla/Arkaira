"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
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
  const phoneE164 = `+91${cleanPhone}`;

  const redirectAfterLogin = () => {
    const next = searchParams.get("next");
    const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
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
        phone: phoneE164,
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

  /* ---------- sign up with phone + password ---------- */
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
        phone: phoneE164,
        password: newPassword,
        options: { data: { full_name: newName.trim() } },
      });
      if (error) throw error;

      if (data.session) {
        toast("Welcome to Arkaira!");
        redirectAfterLogin();
      } else {
        // phone confirmation enabled in Supabase — account created but
        // needs verification before first sign-in
        toast("Account created — sign in with your password");
        setPassword("");
        setMode("password");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("already")) {
        toast("This number is already registered — sign in instead", "error");
        setMode("password");
      } else if (/sms|twilio|provider/i.test(msg)) {
        toast(
          "Phone signup isn't configured yet — please contact support",
          "error"
        );
      } else {
        toast("Could not create your account — please try again", "error");
      }
      setLoading(false);
    }
  };

  /* ======================= RENDER ======================= */

  const formCard = (
    <div className="relative w-full max-w-md">
      {/* back */}
      {mode !== "start" && (
        <button
          onClick={backToStart}
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-plum/70 transition hover:text-rose-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Use a different number
        </button>
      )}

      <div className="card-hover rounded-[2rem] border border-rose-100 bg-white p-8 shadow-2xl shadow-rose-900/10 sm:p-10">
        {/* heading varies by mode */}
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-600/30">
            {mode === "signup" ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </span>
          <div>
            <h1 className="font-display text-[26px] leading-tight text-ink">
              {mode === "start" && "Welcome"}
              {mode === "password" && "Sign in"}
              {mode === "signup" && "Create your account"}
            </h1>
            <p className="mt-0.5 text-[13px] text-plum/80">
              {mode === "start" && "Login or sign up with your phone number"}
              {mode === "password" && `Signing in as +91 ${cleanPhone}`}
              {mode === "signup" && `Join Arkaira with +91 ${cleanPhone}`}
            </p>
          </div>
        </div>

        <div className="petal-divider my-7" />

        {/* ---------- MODE: START ---------- */}
        {mode === "start" && (
          <div className="animate-fade-in">
            <label className="label" htmlFor="login-phone">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-rose-50 px-2.5 py-1 text-[13px] font-semibold text-rose-700">
                +91
              </span>
              <input
                id="login-phone"
                className="field pl-20 text-[16px] tracking-wide"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && validPhone) checkPhoneAndRoute();
                }}
              />
            </div>

            <button
              onClick={checkPhoneAndRoute}
              disabled={!validPhone || checking}
              className="btn-sheen mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 disabled:shadow-none"
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

            <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-plum/60">
              <ShieldCheck className="h-3.5 w-3.5 text-sage-600" />
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

            <button
              type="button"
              onClick={() =>
                toast(
                  "To reset your password, WhatsApp us at +91 98765 43210",
                  "info"
                )
              }
              className="mt-4 text-[13px] font-medium text-rose-600 transition hover:text-rose-700"
            >
              Forgot password?
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-sheen mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 disabled:shadow-none"
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
              Your Name
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
                Create Password
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

            <div className="mt-5">
              <label className="label" htmlFor="signup-confirm">
                Confirm Password
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
              className="btn-sheen mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 disabled:shadow-none"
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
            <p className="mt-4 text-center text-[11px] leading-relaxed text-plum/60">
              You&apos;ll use this phone number and password to sign in and
              track orders.
            </p>
          </form>
        )}

        <p className="mt-7 text-center text-[12px] leading-relaxed text-plum/60">
          By continuing you agree to our terms &amp; privacy policy.
        </p>
      </div>

      <p className="mt-6 text-center text-[13px] text-plum/70">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("start")}
              className="font-semibold text-rose-600 transition hover:text-rose-700"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            New here?{" "}
            <button
              onClick={() => setMode("signup")}
              className="font-semibold text-rose-600 transition hover:text-rose-700"
            >
              Create an account
            </button>{" "}
            · Store owner?{" "}
            <Link
              href="/admin/login"
              className="font-semibold text-rose-600 transition hover:text-rose-700"
            >
              Admin login
            </Link>
          </>
        )}
      </p>
    </div>
  );

  return (
    <div className="grid min-h-[calc(100vh-6rem)] lg:grid-cols-2">
      {/* ---- left: showcase panel ---- */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <Image
          src="https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Fresh flowers arranged by Arkaira"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 animate-drift rounded-full bg-rose-800/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 animate-drift-slow rounded-full bg-rose-900/50 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-600/40">
              <Flower2 className="h-5 w-5" />
            </span>
            <span className="font-display text-[22px] font-semibold tracking-wide text-white">
              Arkaira<span className="text-rose-400">.</span>
            </span>
          </Link>

          <div className="animate-fade-up">
            <h2 className="max-w-md font-display text-5xl leading-[1.1] text-white">
              Flowers that say{" "}
              <span className="italic text-gradient">everything.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">
              Track your orders, save your delivery details and check out
              faster — all with just your phone number.
            </p>
            <div className="mt-9 space-y-4">
              {[
                {
                  icon: Truck,
                  title: "Live order tracking",
                  text: "See exactly where your bouquet is",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure phone login",
                  text: "One number, one password — no OTPs to juggle",
                },
                {
                  icon: Flower2,
                  title: "Members-only picks",
                  text: "First access to seasonal collections",
                },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-rose-300 backdrop-blur-sm">
                    <f.icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="font-display text-[16px] font-semibold text-white">
                      {f.title}
                    </p>
                    <p className="text-[13px] text-white/60">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Fresh flowers · Same-day delivery · arkaira.in
          </p>
        </div>
      </div>

      {/* ---- right: auth form ---- */}
      <div className="relative flex items-center justify-center overflow-hidden bg-blush px-4 py-16 sm:px-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-100/80 blur-3xl" />
        <div className="relative flex w-full justify-center">{formCard}</div>
      </div>
    </div>
  );
}
