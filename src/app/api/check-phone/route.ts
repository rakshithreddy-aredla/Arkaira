import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase-admin";

// Looks up whether a phone number belongs to an existing customer
// account. Uses the service role key on the server so the lookup is
// not exposed to the public and returns only exists: true/false.
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string };
    const digits = (body.phone ?? "").replace(/\D/g, "").slice(-10);

    if (!/^\d{10}$/.test(digits)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    const admin = adminDb();
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) throw error;

    const exists = data.users.some(
      (u) => (u.phone ?? "").replace(/\D/g, "").endsWith(digits)
    );

    return NextResponse.json({ exists });
  } catch {
    return NextResponse.json(
      { error: "Lookup failed — please try again" },
      { status: 500 }
    );
  }
}
