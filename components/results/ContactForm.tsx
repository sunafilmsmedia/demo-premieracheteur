"use client";

import { useState } from "react";
import { Answers } from "@/lib/types";
import { broker } from "@/lib/broker";
import { LEAD_TYPE } from "@/lib/config";

export function ContactForm({
  answers,
  onSubmitted,
}: {
  answers: Answers;
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const valid =
    name.trim().length > 1 &&
    /.+@.+\..+/.test(email) &&
    phone.replace(/\D/g, "").length >= 10 &&
    consent;

  async function submit() {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          consent,
          answers,
          leadType: LEAD_TYPE,
        }),
      });
      if (!res.ok) throw new Error("Envoi impossible");
      onSubmitted();
    } catch {
      // On débloque quand même l'analyse : ne pas pénaliser l'utilisateur.
      onSubmitted();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ton nom complet"
        className="rounded-xl border border-ink-line bg-ink-soft px-4 py-3.5 text-brand-100 outline-none transition focus:border-brand-500"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Ton courriel"
        className="rounded-xl border border-ink-line bg-ink-soft px-4 py-3.5 text-brand-100 outline-none transition focus:border-brand-500"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Ton téléphone"
        className="rounded-xl border border-ink-line bg-ink-soft px-4 py-3.5 text-brand-100 outline-none transition focus:border-brand-500"
      />
      <label className="flex items-start gap-3 py-1 text-xs leading-relaxed text-brand-200">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-500)]"
        />
        <span>
          J&apos;accepte de recevoir mon analyse et d&apos;être contacté par{" "}
          {broker.name} au sujet de mon projet d&apos;achat et de financement.
        </span>
      </label>
      {error && <p className="text-xs text-brand-500">{error}</p>}
      <button
        disabled={!valid || loading}
        onClick={submit}
        className="mt-1 w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-8 py-4 font-display text-base text-ink transition enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:opacity-40"
      >
        {loading ? "Un instant…" : "Recevoir mon analyse"}
      </button>
    </div>
  );
}
