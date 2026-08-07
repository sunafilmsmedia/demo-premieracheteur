"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function PreRevealScreen({
  onReveal,
}: {
  onReveal: (mode: "full" | "summary") => void;
}) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEnabled(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-brand-600/40 bg-ink-soft text-2xl">
          ✨
        </div>
        <h2 className="font-display text-3xl text-brand-100">
          Ton analyse est prête
        </h2>
        <p className="mt-3 text-sm text-brand-200">
          On a évalué la cohérence de ton projet et tes prochaines étapes.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            disabled={!enabled}
            onClick={() => onReveal("full")}
            className="w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-8 py-4 font-display text-base text-ink transition enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:opacity-50"
          >
            Oui, je veux voir mon analyse
          </button>
          <button
            disabled={!enabled}
            onClick={() => onReveal("summary")}
            className="text-sm text-brand-200 underline underline-offset-4 transition enabled:hover:text-brand-100 disabled:opacity-50"
          >
            Je veux seulement voir un résumé
          </button>
        </div>
      </motion.div>
    </section>
  );
}
