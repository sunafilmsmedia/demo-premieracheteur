"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnalysisReport, Answers, FitLevel, ScoringResult } from "@/lib/types";
import { broker } from "@/lib/broker";
import { formatCurrency } from "@/lib/format";
import { PROPERTY_LABELS } from "@/lib/market";
import { ContactForm } from "./ContactForm";
import { PropertyIllustration } from "./PropertyIllustration";

const FIT_LABEL: Record<FitLevel, string> = {
  strong: "Forte",
  possible: "Possible",
  tight: "Serrée",
  unknown: "À valider",
};

const TIMELINE_LABEL: Record<string, string> = {
  asap: "Dès la bonne propriété",
  "0_3_months": "0 à 3 mois",
  "3_6_months": "3 à 6 mois",
  "6_12_months": "6 à 12 mois",
  exploring: "En exploration",
};

function readinessLabel(a: Answers): string {
  if (a.purchaseTimeline === "asap" || a.purchaseTimeline === "0_3_months")
    return "Prêt à passer à l'action";
  if (a.purchaseTimeline === "3_6_months") return "Projet bien avancé";
  if (a.purchaseTimeline === "6_12_months") return "Préparation en cours";
  return "Premières étapes";
}

// Met en évidence le mot-clé en doré dans le verdict.
function Headline({ text }: { text: string }) {
  const keywords = [
    "réaliste",
    "bien aligné",
    "ambitieux",
    "validation",
    "préparation",
  ];
  const found = keywords.find((k) => text.toLowerCase().includes(k));
  if (!found)
    return <span className="font-display text-3xl text-brand-100">{text}</span>;
  const [before, after] = text.split(new RegExp(found, "i"));
  return (
    <span className="font-display text-3xl leading-tight text-brand-100">
      {before}
      <span className="gold-gradient-text">{text.substr(before.length, found.length)}</span>
      {after}
    </span>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="card p-5">
      <h3 className="font-display text-lg text-brand-100">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-brand-200">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultsScreen({
  answers,
  report,
  scoring,
  revealMode,
  onRestart,
}: {
  answers: Answers;
  report: AnalysisReport;
  scoring: ScoringResult;
  revealMode: "full" | "summary";
  onRestart: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [unlockRequested, setUnlockRequested] = useState(false);

  const showFull = (revealMode === "full" || unlockRequested) && submitted;

  // — Écran verrouillé : coordonnées avant révélation complète —
  if ((revealMode === "full" || unlockRequested) && !submitted) {
    return (
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 py-24">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-brand-600/40 bg-ink-soft text-2xl">
            🔒
          </div>
          <h2 className="font-display text-2xl text-brand-100">
            Ton analyse est prête
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-brand-200">
            Où veux-tu recevoir ton analyse personnalisée ?
          </p>
          <div className="mt-7 text-left">
            <ContactForm answers={answers} onSubmitted={() => setSubmitted(true)} />
          </div>
        </div>
      </section>
    );
  }

  // — Résumé non chiffré —
  if (revealMode === "summary" && !showFull) {
    return (
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 py-24">
        <div className="mx-auto w-full max-w-md text-center">
          <h2 className="font-display text-2xl text-brand-100">
            Aperçu de ton projet
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="card p-4">
              <p className="text-xs text-brand-200">Niveau de préparation</p>
              <p className="mt-1 font-display text-base text-brand-100">
                {readinessLabel(answers)}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-brand-200">Compatibilité estimée</p>
              <p className="mt-1 font-display text-base text-brand-100">
                {FIT_LABEL[report.fitLevel]}
              </p>
            </div>
          </div>
          <button
            onClick={() => setUnlockRequested(true)}
            className="mt-8 w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-8 py-4 font-display text-base text-ink transition hover:brightness-110"
          >
            Débloquer l&apos;analyse complète
          </button>
          <button
            onClick={onRestart}
            className="mt-4 text-sm text-brand-200 underline underline-offset-4 hover:text-brand-100"
          >
            Refaire l&apos;analyse
          </button>
        </div>
      </section>
    );
  }

  // — Analyse complète —
  return (
    <section className="relative min-h-[100dvh] px-5 py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-lg space-y-5"
      >
        <div className="card p-6 text-center">
          <PropertyIllustration type={answers.propertyType} />
          <div className="mt-4">
            <Headline text={report.headline} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-200">
            {report.summary}
          </p>
        </div>

        <div className="card p-5">
          <h3 className="font-display text-lg text-brand-100">
            Ton projet d&apos;achat en un coup d&apos;œil
          </h3>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Item label="Secteur" value={answers.region ?? "—"} />
            <Item
              label="Type"
              value={answers.propertyType ? PROPERTY_LABELS[answers.propertyType] : "—"}
            />
            <Item label="Chambres" value={answers.bedrooms ? String(answers.bedrooms) : "—"} />
            <Item label="Échéancier" value={TIMELINE_LABEL[answers.purchaseTimeline ?? "exploring"]} />
            <Item label="Mise de fonds" value={formatCurrency(answers.downPayment)} />
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <p className="text-xs text-brand-200">Niveau de préparation</p>
            <p className="mt-1 font-display text-[15px] text-brand-100">
              {readinessLabel(answers)}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-brand-200">Compatibilité estimée</p>
            <p className="mt-1 font-display text-[15px] text-brand-100">
              {FIT_LABEL[report.fitLevel]}
            </p>
          </div>
        </div>

        <List title="Points forts de ton projet" items={report.strengths} />
        <List title="Éléments à valider" items={report.considerations} />
        <List title="Ajustements possibles" items={report.recommendedAdjustments} />

        <div className="card p-5">
          <h3 className="font-display text-lg text-brand-100">
            Ton plan d&apos;action
          </h3>
          <ol className="mt-3 space-y-3">
            {report.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-brand-200">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 font-display text-xs text-brand-500">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="block w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-8 py-4 text-center font-display text-base text-ink transition hover:brightness-110"
        >
          Valider mon projet avec {broker.name}
        </a>

        <p className="px-1 text-[11px] leading-relaxed text-brand-200/70">
          {report.disclaimer}
        </p>

        <button
          onClick={onRestart}
          className="mx-auto block text-sm text-brand-200 underline underline-offset-4 hover:text-brand-100"
        >
          Refaire l&apos;analyse
        </button>
      </motion.div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-brand-200">{label}</dt>
      <dd className="mt-0.5 font-medium text-brand-100">{value}</dd>
    </div>
  );
}
