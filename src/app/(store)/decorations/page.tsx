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
  Flower2,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { useSession } from "@/hooks/use-session";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { getAccountPhone } from "@/lib/phone";

const eventTypes = [
  { value: "wedding", label: "Wedding", icon: Church },
  { value: "birthday", label: "Birthday / Party", icon: PartyPopper },
  { value: "anniversary", label: "Anniversary", icon: Heart },
  { value: "corporate", label: "Corporate Event", icon: Building2 },
  { value: "pooja", label: "Pooja / Festival", icon: Sparkles },
  { value: "other", label: "Other", icon: Flower2 },
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
  const { user } = useSession();
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

  const defaultName = user
    ? ((user.user_metadata?.full_name as string) ?? "")
    : "";
  const defaultPhone = user ? getAccountPhone(user) : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
      <div className="mb-12">
        <span className="eyebrow">
          <PhoneCall className="h-3.5 w-3.5" /> Callback within hours
        </span>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl">
          Event decoration
        </h1>
        <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink-2">
          Tell us about your event and our floral stylists call you back
          with ideas, availability and a custom quote — usually within a few
          hours.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-line bg-surface p-7 sm:p-9">
          {submitted ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="animate-pop-in flex h-16 w-16 items-center justify-center rounded-full bg-ok text-white">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink">
                We got your request
              </h2>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-2">
                Thank you, {form.name.split(" ")[0]}. Our team will call you
                on{" "}
                <span className="font-semibold text-ink">{form.phone}</span>{" "}
                shortly to discuss your{" "}
                {eventTypes
                  .find((t) => t.value === form.event_type)
                  ?.label.toLowerCase()}
                .
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
                className="btn-secondary mt-8"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="font-display text-xl font-semibold text-ink">
                Tell us about your event
              </h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="dname">
                    Your name
                  </label>
                  <input
                    id="dname"
                    className="field"
                    value={form.name || defaultName}
                    onChange={set("name")}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="dphone">
                    Phone (we call this number)
                  </label>
                  <input
                    id="dphone"
                    className="field"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone || defaultPhone}
                    onChange={set("phone")}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="demail">
                    Email (optional)
                  </label>
                  <input
                    id="demail"
                    className="field"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>

                <div className="sm:col-span-2">
                  <span className="label">Event type</span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {eventTypes.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, event_type: t.value }))
                        }
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-[13px] font-semibold transition-colors ${
                          form.event_type === t.value
                            ? "border-accent bg-accent-soft text-accent"
                            : "border-line-strong bg-surface text-ink-2 hover:border-ink-3"
                        }`}
                      >
                        <t.icon className="h-4 w-4 shrink-0" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="ddate">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-accent" />
                      Event date
                    </span>
                  </label>
                  <input
                    id="ddate"
                    className="field"
                    type="date"
                    value={form.event_date}
                    onChange={set("event_date")}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="dbudget">
                    <span className="flex items-center gap-1.5">
                      <CircleDollarSign className="h-3.5 w-3.5 text-accent" />
                      Approx. budget
                    </span>
                  </label>
                  <select
                    id="dbudget"
                    className="field"
                    value={form.budget}
                    onChange={set("budget")}
                  >
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="ddetails">
                    Event details — venue, colours, flowers you love…
                  </label>
                  <textarea
                    id="ddetails"
                    className="field"
                    rows={4}
                    value={form.details}
                    onChange={set("details")}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-7 w-full sm:w-auto sm:px-10"
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
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-carbon p-7 text-white">
            <h3 className="font-display text-lg font-semibold text-white">
              What we decorate
            </h3>
            <ul className="mt-5 space-y-3 text-[13px] leading-relaxed text-white/60">
              {[
                "Wedding stages, mandaps & varmala",
                "Birthday & anniversary backdrops",
                "Car boot bouquets for bride & groom",
                "Home entrance & pooja arrangements",
                "Corporate receptions & gala tables",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Flower2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-7">
            <h3 className="font-display text-lg font-semibold text-ink">
              How it works
            </h3>
            <ol className="mt-5 space-y-4">
              {[
                "You share your event details here",
                "We call you back, usually within a few hours",
                "We finalise flowers, quote & delivery",
                "Big day — beautifully decorated",
              ].map((step, i) => (
                <li key={step} className="flex items-center gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-carbon font-display text-[13px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[13px] leading-snug text-ink-2">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-line pt-4 text-[12px] text-ink-3">
              Free consultation · No obligation
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
