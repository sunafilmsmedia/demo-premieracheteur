"use client";

const OPTIONS = [1, 2, 3, 4, 5];

export function BedroomsQuestion({
  selected,
  onSelect,
}: {
  selected?: number;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2.5">
      {OPTIONS.map((n) => {
        const active = selected === n;
        return (
          <button
            key={n}
            onClick={() => onSelect(n)}
            className={`flex h-16 items-center justify-center rounded-xl border font-display text-xl transition active:scale-95 ${
              active
                ? "border-brand-500 bg-brand-500/10 text-brand-100"
                : "border-ink-line bg-ink-soft text-brand-100 hover:border-brand-600"
            }`}
          >
            {n === 5 ? "5+" : n}
          </button>
        );
      })}
    </div>
  );
}
