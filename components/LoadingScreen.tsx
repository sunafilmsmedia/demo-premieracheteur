"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8 h-16 w-16">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-ink-line border-t-brand-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-display text-2xl text-brand-100"
      >
        L&apos;IA analyse ton projet d&apos;achat
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="mt-3 text-sm text-brand-200"
      >
        On croise ton financement, ton budget et ton échéancier…
      </motion.p>
    </section>
  );
}
