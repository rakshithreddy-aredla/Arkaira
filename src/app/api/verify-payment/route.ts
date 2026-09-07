import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { adminDb } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      signature,
    }: {
      orderId?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      signature?: string;
    } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !signature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const valid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      signature
    );
    if (!valid) {
      console.error("Signature verification failed for order", orderId);
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const { error } = await adminDb().rpc("mark_order_paid", {
      p_order_id: orderId,
      p_razorpay_order_id: razorpayOrderId,
      p_razorpay_payment_id: razorpayPaymentId,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("verify-payment error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
