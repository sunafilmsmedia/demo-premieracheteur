import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Answers, AnalysisReport } from "@/lib/types";
import {
  affordableAlternatives,
  budgetOf,
  isNotReady,
  scoreAnswers,
} from "@/lib/scoring";
import { buildFallbackReport, STANDARD_DISCLAIMER } from "@/lib/fallbackReport";
import { broker } from "@/lib/broker";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Tu es un assistant d'analyse de projet d'achat immobilier au Québec, pour les clients d'un courtier hypothécaire. Tu aides un premier acheteur à comprendre la cohérence entre son financement (confirmé ou en cours), son budget, son type de propriété, ses critères et son échéancier. Tu ne remplaces ni un courtier hypothécaire ni un courtier immobilier. Tu ne recalcules JAMAIS la capacité d'emprunt. Tu n'inventes aucune statistique, aucun prix, aucune propriété, aucune donnée de marché, aucune disponibilité. Tu utilises seulement les données reçues et les indications fournies. Si des données manquent, tu le dis. Tu ne promets jamais qu'un achat sera possible. Si le type/secteur choisi est peu réaliste avec le budget, explique-le franchement et propose ce qui EST possible. Si le projet n'est pas prêt (mise de fonds < 20 000 $ en achetant seul), dis-le et recommande de bâtir la mise de fonds ou d'acheter à plusieurs. Ton simple, rassurant, direct, français canadien (tutoiement). Retourne uniquement le JSON demandé, sans markdown.`;

function buildUserPrompt(a: Answers, deterministic: object): string {
  return `Voici les réponses de l'acheteur (JSON) :
${JSON.stringify(a, null, 2)}

Éléments déterministes déjà calculés (à respecter, ne pas recalculer) :
${JSON.stringify(deterministic, null, 2)}

Le courtier est ${broker.name} (${broker.title}, ${broker.franchise}, ${broker.region}).

Rédige un rapport d'analyse en respectant EXACTEMENT ce schéma JSON :
{
  "headline": "verdict court, ex. 'Ton projet est réaliste' | 'bien aligné' | 'ambitieux' | 'mérite une validation' | 'en préparation'",
  "summary": "2-3 phrases",
  "projectProfile": "une phrase résumant le profil",
  "fitLevel": "strong | possible | tight | unknown",
  "strengths": ["3 éléments"],
  "considerations": ["3 éléments"],
  "recommendedAdjustments": ["3 éléments"],
  "nextSteps": ["4 étapes"],
  "disclaimer": "reprends l'avertissement standard fourni"
}`;
}

function isValidReport(r: unknown): r is AnalysisReport {
  if (!r || typeof r !== "object") return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.headline === "string" &&
    typeof o.summary === "string" &&
    Array.isArray(o.strengths) &&
    Array.isArray(o.considerations) &&
    Array.isArray(o.recommendedAdjustments) &&
    Array.isArray(o.nextSteps)
  );
}

export async function POST(req: Request) {
  let answers: Answers;
  try {
    const body = await req.json();
    answers = body.answers ?? {};
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const scoring = scoreAnswers(answers);
  const deterministic = {
    projectFit: scoring.projectFit,
    segment: scoring.segment,
    budget: budgetOf(answers),
    notReady: isNotReady(answers),
    affordableAlternatives: affordableAlternatives(answers),
    disclaimer: STANDARD_DISCLAIMER,
  };

  let report: AnalysisReport | null = null;
  let generatedBy: "claude" | "fallback" = "fallback";

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: buildUserPrompt(answers, deterministic) },
        ],
      });
      const text = msg.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      if (isValidReport(parsed)) {
        report = parsed;
        generatedBy = "claude";
      }
    } catch {
      report = null;
    }
  }

  if (!report) {
    report = buildFallbackReport(answers, scoring);
  }

  // Toujours forcer fitLevel sur la valeur déterministe.
  report.fitLevel = scoring.projectFit;
  if (!report.disclaimer) report.disclaimer = STANDARD_DISCLAIMER;

  return NextResponse.json({ scoring, report, generatedBy });
}
