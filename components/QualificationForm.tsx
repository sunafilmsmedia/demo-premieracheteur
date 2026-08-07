"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Answers } from "@/lib/types";
import {
  getTitle,
  getVisibleQuestions,
  QuestionDef,
  resolveStoreKey,
} from "@/lib/questions";
import { ProgressBar } from "./ProgressBar";
import { ChoiceQuestion } from "./questions/ChoiceQuestion";
import { CurrencyQuestion } from "./questions/CurrencyQuestion";
import { BedroomsQuestion } from "./questions/BedroomsQuestion";
import { MultiChoiceQuestion } from "./questions/MultiChoiceQuestion";

export function QualificationForm({
  onComplete,
  onExit,
}: {
  onComplete: (answers: Answers) => void;
  onExit: () => void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentId, setCurrentId] = useState(
    () => getVisibleQuestions({})[0].id
  );
  const [overlay, setOverlay] = useState<string | null>(null);

  const visible = useMemo(() => getVisibleQuestions(answers), [answers]);
  const index = visible.findIndex((q) => q.id === currentId);
  const question = visible[index] ?? visible[0];

  function advanceFrom(next: Answers, fromId: string) {
    const list = getVisibleQuestions(next);
    const idx = list.findIndex((q) => q.id === fromId);
    const upcoming = list[idx + 1];
    if (!upcoming) {
      finish(next);
    } else {
      setCurrentId(upcoming.id);
    }
  }

  function finish(next: Answers) {
    setOverlay("Bien reçu ! On prépare ton analyse…");
    setTimeout(() => onComplete(next), 1000);
  }

  function store(q: QuestionDef, value: Answers[keyof Answers], a: Answers) {
    const key = resolveStoreKey(q, a);
    return { ...a, [key]: value } as Answers;
  }

  function handleChoice(value: string) {
    const next = store(question, value, answers);
    setAnswers(next);
    setTimeout(() => advanceFrom(next, question.id), 220);
  }

  function goBack() {
    if (index <= 0) {
      onExit();
      return;
    }
    setCurrentId(visible[index - 1].id);
  }

  const selectedValue = (() => {
    const key = resolveStoreKey(question, answers);
    return answers[key];
  })();

  return (
    <section className="relative flex min-h-[100dvh] flex-col px-5 pb-10 pt-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-lg items-center gap-3">
        <button
          onClick={goBack}
          className="shrink-0 text-brand-200 transition hover:text-brand-100"
          aria-label="Retour"
        >
          ←
        </button>
        <ProgressBar total={visible.length} current={index} />
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-display text-2xl leading-snug text-brand-100 sm:text-[26px]">
              {getTitle(question, answers)}
            </h2>
            {question.note && (
              <p className="mt-2.5 text-sm leading-relaxed text-brand-200">
                {question.note}
              </p>
            )}

            <div className="mt-7">
              {question.type === "choice" && question.options && (
                <ChoiceQuestion
                  options={question.options}
                  selected={selectedValue as string | undefined}
                  onSelect={handleChoice}
                />
              )}

              {question.type === "currency" && (
                <CurrencyQuestion
                  initial={selectedValue as number | undefined}
                  optional={question.optional}
                  onContinue={(v) => {
                    const next = store(question, v, answers);
                    setAnswers(next);
                    advanceFrom(next, question.id);
                  }}
                  onSkip={() => advanceFrom(answers, question.id)}
                />
              )}

              {question.type === "bedrooms" && (
                <BedroomsQuestion
                  selected={selectedValue as number | undefined}
                  onSelect={(v) => {
                    const next = store(question, v, answers);
                    setAnswers(next);
                    setTimeout(() => advanceFrom(next, question.id), 220);
                  }}
                />
              )}

              {question.type === "multi" && question.options && (
                <MultiChoiceQuestion
                  options={question.options}
                  selected={(selectedValue as string[] | undefined) ?? []}
                  maxSelect={question.maxSelect}
                  onToggle={(v) =>
                    setAnswers(store(question, v, answers))
                  }
                  onContinue={() => advanceFrom(answers, question.id)}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {overlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-ink/90 px-6 text-center"
          >
            <p className="font-display text-xl text-brand-100">{overlay}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
