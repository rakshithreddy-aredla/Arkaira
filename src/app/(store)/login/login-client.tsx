"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  Flower2,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useToast } from "@/components/toast-provider";

type Mode = "start" | "otp" | "password" | "signup" | "forgot";

const otpLength = 6;

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
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const validPhone = /^\d{10}$/.test(cleanPhone);
  const phoneE164 = `+91${cleanPhone}`;

  // cooldown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = window.setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendCooldown]);

  // focus first OTP box when entering otp mode
  useEffect(() => {
    if (mode === "otp" && otpSent) {
      otpRefs.current[0]?.focus();
    }
  }, [mode, otpSent]);

  const redirectAfterLogin = () => {
    const next = searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      window.location.assign(next);
    } else {
      window.location.assign("/account");
    }
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
      if (exists) {
        setMode("password");
      } else {
        setMode("signup");
      }
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
      // Phone+password sign-in: try OTP-style verify first via phone param
      const { error } = await supabase.auth.signInWithPassword({
        email: `${cleanPhone}@phone.arkaira.in`,
        password,
      });
      if (error) {
        // fallback: phone-based password login (Supabase supports phone sign-in
        // with password when the account has one set)
        const { error: phoneError } = await supabase.auth.signInWithPassword({
          phone: phoneE164,
          password,
        } as { phone: string; password: string });
        if (phoneError) throw error;
      }
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
      // Create the account with phone + password; Supabase sends an SMS OTP
      // to verify the phone number. Email is synthesised from the phone for
      // accounts that require an email field.
      const { error } = await supabase.auth.signUp({
        phone: phoneE164,
        password: newPassword,
        options: {
          data: { full_name: newName.trim() },
        },
      } as never);
      if (error) throw error;

      // verify phone via OTP if a session wasn't created immediately
      setMode("otp");
      setOtpSent(false);
      toast("Account created — verify the OTP we just sent you");
    } catch (err) {
      toast(
        err instanceof Error && err.message.includes("already")
          ? "This number is already registered — try signing in"
          : "Could not create your account — please try again",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------- send OTP ---------- */
  const sendOtp = async () => {
    if (!validPhone) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneE164,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setMode("otp");
      setOtpSent(true);
      setOtp(Array(otpLength).fill(""));
      setResendCooldown(30);
      toast("OTP sent to your phone");
      setTimeout(() => otpRefs.current[0]?.focus(), 60);
    } catch {
      toast("Could not send OTP — check the number and try again", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- verify OTP ---------- */
  const verifyOtp = async (code?: string) => {
    const theOtp = (code ?? otp.join("")).replace(/\D/g, "");
    if (theOtp.length !== otpLength)
      return toast(`Enter all ${otpLength} digits of the OTP`, "error");

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneE164,
        token: theOtp,
        type: "sms",
      });
      if (error) throw error;
      toast("Verified — you're signed in!");
      redirectAfterLogin();
    } catch {
      toast("That OTP didn't match — check and try again", "error");
      setLoading(false);
    }
  };

  /* ---------- reset (forgot) password ---------- */
  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6)
      return toast("New password must be at least 6 characters", "error");
    setLoading(true);
    try {
      // Supabase has no SMS reset link; we verify identity by OTP then
      // update the password on the now-authenticated session.
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneE164,
        token: otp.join(""),
        type: "sms",
      });
      if (verifyError) throw new Error("NO_OTP");

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      toast("Password updated — you're signed in!");
      redirectAfterLogin();
    } catch (err) {
      if (err instanceof Error && err.message === "NO_OTP") {
        toast("Verify the OTP first", "error");
      } else {
        toast("Could not update password — please try again", "error");
      }
      setLoading(false);
    }
  };

  /* ---------- OTP input handling ---------- */
  const handleOtpChange = (idx: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < otpLength - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
    // auto-submit when all filled
    const joined = [...otp];
    joined[idx] = digit;
    if (digit && joined.every((d) => d !== "")) {
      verifyOtp(joined.join(""));
    }
  };

  const handleOtpKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
      setOtp((prev) => {
        const next = [...prev];
        next[idx - 1] = "";
        return next;
      });
    }
    if (e.key === "Enter") verifyOtp();
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === otpLength) {
      e.preventDefault();
      setOtp(pasted.split(""));
      verifyOtp(pasted);
    }
  };

  /* ======================= RENDER ======================= */

  const formCard = (
    <div className="relative w-full max-w-md">
      {/* back */}
      {mode !== "start" && (
        <button
          onClick={() => {
            setMode("start");
            setPassword("");
            setOtp(Array(otpLength).fill(""));
            setOtpSent(false);
            setNewPassword("");
            setConfirmPassword("");
          }}
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-plum/70 transition hover:text-rose-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Use a different number
        </button>
      )}

      <div className="card-hover rounded-[2rem] border border-rose-100 bg-white p-8 shadow-2xl shadow-rose-900/10 sm:p-10">
        {/* heading varies by mode */}
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-lg shadow-rose-600/30">
            {mode === "otp" ? (
              <Smartphone className="h-5 w-5" />
            ) : mode === "signup" ? (
              <Sparkles className="h-5 w-5" />
            ) : mode === "forgot" ? (
              <KeyRound className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </span>
          <div>
            <h1 className="font-display text-[26px] leading-tight text-ink">
              {mode === "start" && "Welcome back"}
              {mode === "password" && "Sign in"}
              {mode === "otp" && "Verify your phone"}
              {mode === "signup" && "Create your account"}
              {mode === "forgot" && "Reset password"}
            </h1>
            <p className="mt-0.5 text-[13px] text-plum/80">
              {mode === "start" && "Login or sign up with your phone number"}
              {mode === "password" && `Signing in as +91 ${cleanPhone}`}
              {mode === "otp" &&
                `We sent a 6-digit code to +91 ${cleanPhone}`}
              {mode === "signup" &&
                `Join Arkaira with +91 ${cleanPhone}`}
              {mode === "forgot" && `Verify OTP & set a new password`}
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

            <div className="mt-7 flex items-center gap-4">
              <div className="petal-divider flex-1" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-plum/50">
                or
              </span>
              <div className="petal-divider flex-1" />
            </div>

            <button
              onClick={() => {
                if (!validPhone) {
                  toast("Enter your phone number first", "error");
                  return;
                }
                sendOtp();
              }}
              disabled={!validPhone || loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-rose-300 bg-white py-4 text-sm font-semibold tracking-wide text-rose-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Smartphone className="h-4 w-4" />
              Login with OTP instead
            </button>
          </div>
        )}

        {/* ---------- MODE: PASSWORD ---------- */}
        {mode === "password" && (
          <form
            onSubmit={loginWithPassword}
            className="animate-fade-in"
          >
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

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setOtpSent(false);
                  setOtp(Array(otpLength).fill(""));
                }}
                className="text-[13px] font-medium text-rose-600 transition hover:text-rose-700"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={sendOtp}
                className="text-[13px] font-medium text-plum/70 transition hover:text-rose-600"
              >
                Use OTP instead
              </button>
            </div>

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

        {/* ---------- MODE: OTP ---------- */}
        {mode === "otp" && (
          <div className="animate-fade-in">
            <div className="flex justify-between gap-2.5">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  className={`otp-box ${d ? "filled" : ""}`}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={i === 0 ? otpLength : 1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => verifyOtp()}
              disabled={loading}
              className="btn-sheen mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Verify &amp; Sign In
                </>
              )}
            </button>

            <div className="mt-5 text-center">
              {resendCooldown > 0 ? (
                <p className="text-[13px] text-plum/60">
                  Resend code in{" "}
                  <span className="font-semibold text-rose-600">
                    0:{String(resendCooldown).padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <button
                  onClick={sendOtp}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-rose-600 transition hover:text-rose-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Resend OTP
                </button>
              )}
            </div>
          </div>
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
              We&apos;ll text you a 6-digit code to verify this number.
            </p>
          </form>
        )}

        {/* ---------- MODE: FORGOT ---------- */}
        {mode === "forgot" && (
          <div className="animate-fade-in">
            {!otpSent ? (
              <div>
                <p className="text-[14px] leading-relaxed text-plum">
                  We&apos;ll send a 6-digit code to{" "}
                  <span className="font-semibold text-ink">
                    +91 {cleanPhone}
                  </span>{" "}
                  to verify it&apos;s really you.
                </p>
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="btn-sheen mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-4 w-4" /> Send verification code
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={requestReset}>
                <div className="flex justify-between gap-2.5">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      className={`otp-box ${d ? "filled" : ""}`}
                      inputMode="numeric"
                      maxLength={i === 0 ? otpLength : 1}
                      value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="mt-6">
                  <label className="label" htmlFor="reset-password">
                    New Password
                  </label>
                  <input
                    id="reset-password"
                    className="field"
                    type="password"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-sheen mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" /> Set new password
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        <p className="mt-7 text-center text-[12px] leading-relaxed text-plum/60">
          By continuing you agree to our terms &amp; privacy policy.
        </p>
      </div>

      <p className="mt-6 text-center text-[13px] text-plum/70">
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
                  title: "Secure OTP login",
                  text: "No passwords to remember — or use one, your choice",
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
