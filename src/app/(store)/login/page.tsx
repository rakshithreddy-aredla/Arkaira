import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginClient } from "./login-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login / Sign Up",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" />
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
