"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { broker } from "@/lib/broker";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <HeroBackground />
      <div className="relative z-10 mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-soft px-4 py-1.5 text-xs font-medium text-brand-200"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
          Analyse propulsée par l&apos;IA
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl leading-[1.05] text-brand-100 sm:text-5xl"
        >
          Qu&apos;est-ce que tu peux{" "}
          <span className="gold-gradient-text">vraiment acheter</span> ?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-base text-brand-200 sm:text-lg"
        >
          Réponds à quelques questions et découvre ton vrai pouvoir
          d&apos;achat — la fourchette réaliste pour ta situation, et les
          prochaines étapes pour y arriver.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-9"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-8 py-4 font-display text-base text-ink shadow-lg shadow-brand-900/40 transition hover:brightness-110 active:scale-[0.98]"
          >
            Analyser mon projet
            <span className="transition group-hover:translate-x-0.5">→</span>
          </button>
          <p className="mt-4 text-xs text-brand-200">
            Gratuit · Environ 2 minutes · Estimation indicative
          </p>
        </motion.div>
      </div>

      <p className="absolute bottom-6 z-10 text-[11px] text-brand-200/70">
        {broker.title} · {broker.region}
      </p>
    </section>
  );
}
