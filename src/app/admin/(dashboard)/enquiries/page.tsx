import { createServerSupabase } from "@/lib/admin-auth";
import type { DecorationQuery } from "@/lib/types";
import { EnquiriesList } from "./enquiries-list";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("decoration_queries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">
          Decoration Enquiries
        </h1>
        <p className="text-sm text-plum">
          Call these customers back to discuss their event decoration.
        </p>
      </div>
      <EnquiriesList initialQueries={(data ?? []) as DecorationQuery[]} />
    </div>
  );
}
