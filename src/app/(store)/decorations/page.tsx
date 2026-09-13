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

  const defaultName =
    user?.user_metadata?.full_name ?? (user ? "" : "");
  const defaultPhone = user?.phone
    ? user.phone.replace(/\D/g, "").slice(-10)
    : "";

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-drift rounded-full bg-rose-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 animate-drift-slow rounded-full bg-gold-100/80 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-14 text-center">
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-rose-700 uppercase shadow-sm backdrop-blur-sm">
            <PhoneCall className="h-3.5 w-3.5 text-gold-500" />
            Callback within hours
          </span>
          <h1 className="mt-5 font-display text-5xl text-ink sm:text-6xl">
            Decoration{" "}
            <span className="italic text-gradient">Enquiries</span>
          </h1>
          <div className="petal-divider mx-auto mt-5 w-44" />
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-plum">
            Tell us about your event and our floral stylists will call you
            back with ideas, availability and a custom quote — usually within
            a few hours.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <form
            onSubmit={handleSubmit}
            className="card-hover rounded-[2rem] border border-rose-100 bg-white p-7 shadow-lg shadow-rose-900/5 sm:p-9"
          >
            {submitted ? (
              <div className="flex flex-col items-center py-12 text-center">
                <span className="flex h-20 w-20 animate-pop-in items-center justify-center rounded-full bg-gradient-to-br from-sage-100 to-sage-200 text-sage-600 shadow-lg shadow-sage-600/20">
                  <CheckCircle2 className="h-10 w-10" />
                </span>
                <h2 className="mt-6 font-display text-3xl text-ink">
                  We got your request!
                </h2>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-plum">
                  Thank you, {form.name.split(" ")[0]}. Our team will call you
                  on{" "}
                  <span className="font-semibold text-ink">
                    {form.phone}
                  </span>{" "}
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
                  className="mt-8 rounded-full border border-rose-300 px-7 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl text-ink">
                  Tell us about your event
                </h2>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="dname">
                      Your Name
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
                    <span className="label">Event Type</span>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {eventTypes.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() =>
                            setForm((f) => ({ ...f, event_type: t.value }))
                          }
                          className={`flex items-center gap-2 rounded-2xl border px-3.5 py-3.5 text-left text-[13px] font-medium transition-all duration-200 ${
                            form.event_type === t.value
                              ? "border-rose-500 bg-rose-50 text-rose-700 shadow-md shadow-rose-600/10"
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
                    <label className="label" htmlFor="ddate">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-rose-500" />
                        Event Date
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
                        <CircleDollarSign className="h-3.5 w-3.5 text-rose-500" />
                        Approx. Budget
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
                  className="btn-sheen mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-rose-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-plum/30 disabled:shadow-none sm:w-auto sm:px-10"
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
            <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-blush p-7">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-rose-200/50 blur-2xl" />
              <h3 className="relative font-display text-xl text-ink">
                What we decorate
              </h3>
              <ul className="relative mt-5 space-y-3.5 text-[14px] leading-relaxed text-plum">
                {[
                  "Wedding stages, mandaps & varmala",
                  "Birthday & anniversary backdrops",
                  "Car boot bouquets for bride & groom",
                  "Home entrance & pooja arrangements",
                  "Corporate receptions & gala tables",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Flower2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-rose-100 bg-white p-7">
              <h3 className="font-display text-xl text-ink">How it works</h3>
              <ol className="mt-5 space-y-4">
                {[
                  "You share your event details here",
                  "We call you back, usually within a few hours",
                  "We finalise flowers, quote & delivery",
                  "Big day — beautifully decorated",
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 font-display text-sm font-bold text-white shadow-md shadow-rose-600/30">
                      {i + 1}
                    </span>
                    <span className="text-[14px] leading-snug text-plum">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="petal-divider my-6" />
              <p className="flex items-center gap-2 text-[12px] text-plum/70">
                <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                Free consultation · No obligation
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
