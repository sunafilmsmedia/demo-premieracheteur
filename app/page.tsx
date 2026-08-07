"use client";

import { useState } from "react";
import { Answers, AnalysisReport, ScoringResult } from "@/lib/types";
import { TopLogos } from "@/components/TopLogos";
import { Hero } from "@/components/Hero";
import { QualificationForm } from "@/components/QualificationForm";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PreRevealScreen } from "@/components/PreRevealScreen";
import { ResultsScreen } from "@/components/results/ResultsScreen";

type Stage = "hero" | "form" | "loading" | "preReveal" | "results";

const LOGO_STAGES: Stage[] = ["hero", "preReveal", "results"];

export default function Page() {
  const [stage, setStage] = useState<Stage>("hero");
  const [answers, setAnswers] = useState<Answers>({});
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [revealMode, setRevealMode] = useState<"full" | "summary">("full");

  async function handleComplete(finalAnswers: Answers) {
    setAnswers(finalAnswers);
    setStage("loading");
    const start = Date.now();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      setReport(data.report);
      setScoring(data.scoring);
    } catch {
      // Le serveur renvoie toujours un rapport ; en cas d'échec réseau,
      // on renvoie l'utilisateur au questionnaire.
      setStage("hero");
      return;
    }

    const elapsed = Date.now() - start;
    const wait = Math.max(0, 2000 - elapsed);
    setTimeout(() => setStage("preReveal"), wait);
  }

  function reset() {
    setAnswers({});
    setReport(null);
    setScoring(null);
    setStage("hero");
  }

  return (
    <main className="relative min-h-[100dvh]">
      {LOGO_STAGES.includes(stage) && <TopLogos />}

      {stage === "hero" && <Hero onStart={() => setStage("form")} />}

      {stage === "form" && (
        <QualificationForm
          onComplete={handleComplete}
          onExit={() => setStage("hero")}
        />
      )}

      {stage === "loading" && <LoadingScreen />}

      {stage === "preReveal" && (
        <PreRevealScreen
          onReveal={(mode) => {
            setRevealMode(mode);
            setStage("results");
          }}
        />
      )}

      {stage === "results" && report && scoring && (
        <ResultsScreen
          answers={answers}
          report={report}
          scoring={scoring}
          revealMode={revealMode}
          onRestart={reset}
        />
      )}
    </main>
  );
}
