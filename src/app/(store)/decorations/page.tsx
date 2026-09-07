"use client";

import { useState } from "react";
import {
  Sparkles,
  PhoneCall,
  PartyPopper,
  Heart,
  Building2,
  Church,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const eventTypes = [
  { value: "wedding", label: "Wedding", icon: Church },
  { value: "birthday", label: "Birthday / Party", icon: PartyPopper },
  { value: "anniversary", label: "Anniversary", icon: Heart },
  { value: "corporate", label: "Corporate Event", icon: Building2 },
  { value: "pooja", label: "Pooja / Festival", icon: Sparkles },
  { value: "other", label: "Other", icon: Sparkles },
];

const budgets = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "Above ₹1,00,000",
];

export default function DecorationsPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    event_type: "wedding",
    event_date: "",
    budget: budgets[1],
    details: "",
  });

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast("Enter your name", "error");
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      return toast("Enter a valid 10-digit phone number", "error");

    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("decoration_queries").insert({
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, ""),
        email: form.email.trim() || null,
        event_type: form.event_type,
        event_date: form.event_date || null,
        budget: form.budget,
        details: form.details.trim() || null,
      });
      if (error) throw error;
      setSubmitted(true);
      toast("Enquiry received — we will call you back shortly!");
    } catch {
      toast("Could not submit enquiry — please try again", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="mb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-widest text-rose-700 uppercase">
          <PhoneCall className="h-3.5 w-3.5" />
          Callback within hours
        </span>
        <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">
          Decoration Enquiries
        </h1>
        <div className="petal-divider mx-auto mt-4 w-40" />
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-plum">
          Tell us about your event and our floral stylists will call you back
          with ideas, availability and a custom quote — usually within a few
          hours.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-rose-100 bg-white p-6 sm:p-8"
        >
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                <CheckCircle2 className="h-9 w-9" />
              </span>
              <h2 className="mt-5 font-display text-2xl text-ink">
                We got your request!
              </h2>
              <p className="mt-3 max-w-sm text-[15px] text-plum">
                Thank you, {form.name.split(" ")[0]}. Our team will call you
                on <span className="font-semibold">{form.phone}</span> shortly
                to discuss your {eventTypes.find((t) => t.value === form.event_type)?.label.toLowerCase()} decoration.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    phone: "",
                    email: "",
                    event_type: "wedding",
                    event_date: "",
                    budget: budgets[1],
                    details: "",
                  });
                }}
                className="mt-8 rounded-full border border-rose-300 px-6 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl text-ink">
                Tell us about your event
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="dname">Your Name</label>
                  <input id="dname" className="field" value={form.name} onChange={set("name")} required />
                </div>
                <div>
                  <label className="label" htmlFor="dphone">Phone (we call this number)</label>
                  <input id="dphone" className="field" type="tel" inputMode="numeric" value={form.phone} onChange={set("phone")} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="demail">Email (optional)</label>
                  <input id="demail" className="field" type="email" value={form.email} onChange={set("email")} />
                </div>

                <div className="sm:col-span-2">
                  <span className="label">Event Type</span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {eventTypes.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, event_type: t.value }))
                        }
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition ${
                          form.event_type === t.value
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-rose-100 bg-white text-plum hover:border-rose-300"
                        }`}
                      >
                        <t.icon className="h-4 w-4 shrink-0" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="ddate">Event Date</label>
                  <input id="ddate" className="field" type="date" value={form.event_date} onChange={set("event_date")} />
                </div>
                <div>
                  <label className="label" htmlFor="dbudget">Approx. Budget</label>
                  <select id="dbudget" className="field" value={form.budget} onChange={set("budget")}>
                    {budgets.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="ddetails">Event details — venue, colours, flowers you love…</label>
                  <textarea id="ddetails" className="field" rows={4} value={form.details} onChange={set("details")} />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 sm:w-auto sm:px-10"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <PhoneCall className="h-4 w-4" /> Request Callback
                  </>
                )}
              </button>
            </>
          )}
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-rose-100 bg-blush p-6">
            <h3 className="font-display text-lg text-ink">What we decorate</h3>
            <ul className="mt-4 space-y-3 text-[15px] text-plum">
              <li>• Wedding stages, mandaps &amp; varmala</li>
              <li>• Birthday &amp; anniversary backdrops</li>
              <li>• Car boot bouquets for bride &amp; groom</li>
              <li>• Home entrance &amp; pooja arrangements</li>
              <li>• Corporate receptions &amp; gala tables</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-6">
            <h3 className="font-display text-lg text-ink">How it works</h3>
            <ol className="mt-4 space-y-3 text-[15px] text-plum">
              <li>
                <span className="font-semibold text-rose-700">1.</span> You
                share your event details here
              </li>
              <li>
                <span className="font-semibold text-rose-700">2.</span> We
                call you back, usually within a few hours
              </li>
              <li>
                <span className="font-semibold text-rose-700">3.</span> We
                finalise flowers, quote &amp; delivery
              </li>
              <li>
                <span className="font-semibold text-rose-700">4.</span> Big
                day — beautifully decorated
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
