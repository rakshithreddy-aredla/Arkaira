"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/components/toast-provider";
import { placeOrder } from "@/lib/orders-client";
import { formatINR, DELIVERY_FEE, FREE_DELIVERY_ABOVE } from "@/lib/format";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });
  const scriptLoaded = useRef(false);

  const deliveryFee =
    lines.length === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (lines.length === 0 && !submitting) {
      router.replace("/cart");
    }
  }, [lines.length, submitting, router]);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Enter your name";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      return "Enter a valid 10-digit phone number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      return "Enter a valid email";
    if (!form.address.trim()) return "Enter your delivery address";
    if (!form.city.trim()) return "Enter your city";
    if (!/^\d{6}$/.test(form.pincode)) return "Enter a valid 6-digit pincode";
    return null;
  };

  const startPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      toast(problem, "error");
      return;
    }

    setSubmitting(true);
    try {
      const result = await placeOrder(
        form,
        lines.map((l) => ({ product_id: l.product_id, qty: l.qty }))
      );

      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: result.order_id,
          amount: result.total,
        }),
      });
      if (!res.ok) throw new Error("Payment setup failed");
      const { razorpayOrder, keyId } = await res.json();

      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        toast("Payment gateway is still loading — please try again", "error");
        setSubmitting(false);
        return;
      }
      const rzp = new Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Arkaira",
        description: `Order ${result.order_number}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: form.name,
          contact: form.phone,
          email: form.email || undefined,
        },
        theme: { color: "#c9315e" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: result.order_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Verification failed");
            clear();
            router.push(`/order-success?id=${result.order_id}`);
          } catch {
            toast(
              "Payment received but verification failed — we will contact you",
              "error"
            );
            router.push(`/order-success?id=${result.order_id}`);
          }
        },
        modal: {
          ondismiss: () => {
            toast(
              "Payment cancelled — your order is saved, retry from cart",
              "error"
            );
            setSubmitting(false);
          },
        },
      });
      rzp.open();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      if (message.includes("OUT_OF_STOCK"))
        toast("An item just went out of stock — please refresh", "error");
      else toast(message, "error");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Checkout</h1>
      <div className="petal-divider my-6 max-w-24" />

      <form onSubmit={startPayment} className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-rose-100 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl text-ink">Delivery Details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Full Name</label>
              <input id="name" className="field" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone (10 digits)</label>
              <input id="phone" className="field" type="tel" inputMode="numeric" value={form.phone} onChange={set("phone")} required />
            </div>
            <div>
              <label className="label" htmlFor="email">Email (optional)</label>
              <input id="email" className="field" type="email" value={form.email} onChange={set("email")} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="address">Delivery Address</label>
              <textarea id="address" className="field" rows={3} value={form.address} onChange={set("address")} required />
            </div>
            <div>
              <label className="label" htmlFor="city">City</label>
              <input id="city" className="field" value={form.city} onChange={set("city")} required />
            </div>
            <div>
              <label className="label" htmlFor="pincode">Pincode</label>
              <input id="pincode" className="field" inputMode="numeric" maxLength={6} value={form.pincode} onChange={set("pincode")} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="notes">Message on card / delivery notes (optional)</label>
              <textarea id="notes" className="field" rows={2} value={form.notes} onChange={set("notes")} />
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-rose-100 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl text-ink">Your Order</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-plum">
            {lines.map((l) => (
              <li key={l.product_id} className="flex justify-between gap-3">
                <span className="truncate">
                  {l.qty} × {l.name}
                </span>
                <span className="shrink-0">{formatINR(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="petal-divider my-4" />
          <div className="space-y-2.5 text-[15px]">
            <div className="flex justify-between text-plum">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-plum">
              <span>Delivery</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="font-semibold text-sage-600">FREE</span>
                ) : (
                  formatINR(deliveryFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-ink">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting || lines.length === 0}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Setting up…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Pay {formatINR(total)}
              </>
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-plum/70">
            <Lock className="h-3 w-3" /> Secure payment via Razorpay — UPI,
            Cards, Netbanking
          </p>
        </aside>
      </form>
    </div>
  );
}
