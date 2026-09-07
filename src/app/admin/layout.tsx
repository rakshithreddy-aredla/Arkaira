import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false },
};

export default function AdminRootLayout({
  children,
}: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-ink/5">{children}</div>;
}
