import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { ToastProvider } from "@/components/toast-provider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arkaira — Fresh Flowers, Delivered with Love",
    template: "%s | Arkaira",
  },
  description:
    "Premium hand-tied bouquets and floral arrangements for every occasion. Order online, delivered fresh to your doorstep. Decoration enquiries welcome.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
