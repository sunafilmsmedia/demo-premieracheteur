"use client";

import { motion } from "framer-motion";
import { broker } from "@/lib/broker";

export function DisqualifiedScreen({ onBack }: { onBack: () => void }) {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-ink-line bg-ink-soft text-2xl">
          🤝
        </div>
        <h2 className="font-display text-3xl text-brand-100">
          Tu es déjà bien accompagné
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-brand-200">
          Comme tu as déjà un dossier en cours avec un courtier hypothécaire, le
          plus simple est de poursuivre avec lui — il connaît déjà ton dossier.
          {broker.name} respecte cet engagement.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-200">
          Si jamais ta situation change, tu seras toujours le bienvenu pour
          refaire une analyse.
        </p>
        <button
          onClick={onBack}
          className="mt-8 rounded-full border border-ink-line bg-ink-soft px-6 py-3 text-sm text-brand-100 transition hover:border-brand-600"
        >
          Retour à l&apos;accueil
        </button>
      </motion.div>
    </section>
  );
}
