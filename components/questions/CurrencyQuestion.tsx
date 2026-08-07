"use client";

import { useState } from "react";
import { formatCurrency, parseCurrency } from "@/lib/format";

const MIN = 50000;
const MAX = 10000000;

export function CurrencyQuestion({
  initial,
  optional,
  onContinue,
  onSkip,
}: {
  initial?: number;
  optional?: boolean;
  onContinue: (value: number) => void;
  onSkip?: () => void;
}) {
  const [raw, setRaw] = useState<number | null>(initial ?? null);
  const display = raw != null ? formatCurrency(raw) : "";
  const valid = raw != null && raw >= MIN && raw <= MAX;

  return (
    <div className="flex flex-col gap-4">
      <input
        inputMode="numeric"
        autoFocus
        value={display}
        onChange={(e) => setRaw(parseCurrency(e.target.value))}
        placeholder="Ex. 350 000 $"
        className="w-full rounded-xl border border-ink-line bg-ink-soft px-5 py-4 text-center font-display text-2xl text-brand-100 outline-none transition focus:border-brand-500"
      />
      {raw != null && !valid && (
        <p className="text-center text-xs text-brand-500">
          Entre un montant entre {formatCurrency(MIN)} et {formatCurrency(MAX)}.
        </p>
      )}
      <button
        disabled={!valid}
        onClick={() => valid && onContinue(raw!)}
        className="w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-8 py-4 font-display text-base text-ink transition enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:opacity-40"
      >
        Continuer
      </button>
      {optional && onSkip && (
        <button
          onClick={onSkip}
          className="text-sm text-brand-200 underline underline-offset-4 hover:text-brand-100"
        >
          Je préfère ne pas répondre
        </button>
      )}
    </div>
  );
}
