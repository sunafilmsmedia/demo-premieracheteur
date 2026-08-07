"use client";

import { QuestionOption } from "@/lib/questions";

export function ChoiceQuestion({
  options,
  selected,
  onSelect,
}: {
  options: QuestionOption[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left text-[15px] transition active:scale-[0.99] ${
              active
                ? "border-brand-500 bg-brand-500/10 text-brand-100"
                : "border-ink-line bg-ink-soft text-brand-100 hover:border-brand-600"
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                active
                  ? "border-brand-500 bg-brand-500 text-ink"
                  : "border-ink-line text-transparent"
              }`}
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}
