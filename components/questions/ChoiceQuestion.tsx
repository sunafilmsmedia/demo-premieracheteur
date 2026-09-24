"use client";

import { motion } from "framer-motion";
import type { Choice } from "@/lib/questions";

interface Props {
  choices: Choice[];
  value?: string;
  onChange: (v: string) => void;
}

export default function ChoiceQuestion({ choices, value, onChange }: Props) {
  return (
    <div className="grid gap-3">
      {choices.map((c, i) => {
        const selected = value === c.value;
        return (
          <motion.button
            key={c.value}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onChange(c.value)}
            className={`
              group relative text-left
              rounded-2xl px-5 py-4 sm:py-5
              transition-all duration-200
              ${
                selected
                  ? "bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] border border-[var(--color-brand-400)] shadow-[0_12px_30px_-10px_rgba(0, 0, 0, 0.65)]"
                  : "glass-card hover:border-[var(--color-slate-accent)]/20 hover:bg-white/[0.09]"
              }
            `}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className={`font-medium ${selected ? "text-white" : "text-[var(--color-brand-100)]"}`}>
                  {c.label}
                </p>
                {c.hint && (
                  <p className="text-xs text-slate-400 mt-0.5">{c.hint}</p>
                )}
              </div>
              <span
                className={`
                  shrink-0 w-5 h-5 rounded-full border transition-all
                  ${
                    selected
                      ? "bg-white border-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                      : "border-[var(--color-slate-accent)]/25 group-hover:border-[var(--color-slate-accent)]/45"
                  }
                `}
                aria-hidden
              />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
