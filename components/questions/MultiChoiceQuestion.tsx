"use client";

import { QuestionOption } from "@/lib/questions";

export function MultiChoiceQuestion({
  options,
  selected,
  maxSelect = 3,
  onToggle,
  onContinue,
}: {
  options: QuestionOption[];
  selected: string[];
  maxSelect?: number;
  onToggle: (next: string[]) => void;
  onContinue: () => void;
}) {
  function toggle(opt: QuestionOption) {
    if (opt.exclusive) {
      onToggle(selected.includes(opt.value) ? [] : [opt.value]);
      return;
    }
    // retirer un éventuel choix exclusif déjà posé
    const base = selected.filter(
      (v) => !options.find((o) => o.value === v)?.exclusive
    );
    if (base.includes(opt.value)) {
      onToggle(base.filter((v) => v !== opt.value));
    } else if (base.length < maxSelect) {
      onToggle([...base, opt.value]);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          const full =
            !active && !opt.exclusive && selected.length >= maxSelect;
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt)}
              disabled={full}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition active:scale-[0.98] ${
                active
                  ? "border-brand-500 bg-brand-500/10 text-brand-100"
                  : "border-ink-line bg-ink-soft text-brand-100 hover:border-brand-600"
              } ${full ? "opacity-40" : ""} ${
                opt.exclusive ? "col-span-2" : ""
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-brand-200">
        {selected.length}/{maxSelect} sélectionné(s)
      </p>
      <button
        disabled={selected.length === 0}
        onClick={onContinue}
        className="w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-8 py-4 font-display text-base text-ink transition enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:opacity-40"
      >
        Continuer
      </button>
    </div>
  );
}
