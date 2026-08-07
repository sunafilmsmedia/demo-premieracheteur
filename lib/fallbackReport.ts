import { AnalysisReport, Answers, ScoringResult } from "./types";
import { broker } from "./broker";
import { affordableAlternatives, budgetOf, isNotReady } from "./scoring";

export const STANDARD_DISCLAIMER =
  "Cette analyse est indicative et repose uniquement sur les informations fournies. Elle ne constitue pas une préapprobation hypothécaire, une évaluation immobilière, un avis financier ni une garantie qu'une propriété correspondant aux critères est disponible. Les possibilités doivent être validées avec les professionnels concernés.";

const TIMELINE_LABEL: Record<string, string> = {
  asap: "dès que tu trouves la bonne propriété",
  "0_3_months": "dans les 3 prochains mois",
  "3_6_months": "dans 3 à 6 mois",
  "6_12_months": "dans 6 à 12 mois",
  exploring: "en mode exploration",
};

function headlineFor(a: Answers, scoring: ScoringResult): string {
  if (isNotReady(a)) return "Ton projet est en préparation";
  switch (scoring.projectFit) {
    case "strong":
      return "Ton projet est réaliste";
    case "possible":
      return "Ton projet est bien aligné";
    case "tight":
      return "Ton projet est ambitieux";
    default:
      return "Ton projet mérite une validation";
  }
}

export function buildFallbackReport(
  a: Answers,
  scoring: ScoringResult
): AnalysisReport {
  const budget = budgetOf(a);
  const notReady = isNotReady(a);
  const alt = affordableAlternatives(a);

  const strengths: string[] = [];
  if (a.financingStatus === "in_process")
    strengths.push("Tu es déjà en démarches de financement — le meilleur moment pour être bien accompagné.");
  if (a.financingStatus === "not_started")
    strengths.push("Tu prends les choses dans le bon ordre en clarifiant ton projet avant de te lancer.");
  if (a.financingStatus === "prequalified" || a.financingStatus === "preapproved")
    strengths.push("Tu as déjà entamé ton financement, ce qui accélère les prochaines étapes.");
  if ((a.downPayment ?? 0) >= 20000)
    strengths.push("Tu as déjà une mise de fonds concrète de côté.");
  if (a.purchaseTimeline === "asap" || a.purchaseTimeline === "0_3_months")
    strengths.push("Ton échéancier est rapproché, ton projet est concret.");
  if (a.firstTimeBuyer === "yes")
    strengths.push("Comme premier acheteur, tu es admissible à des programmes avantageux (CELIAPP, RAP, remboursements).");
  while (strengths.length < 3)
    strengths.push("Tu as une vision claire du type de propriété que tu recherches.");

  const considerations: string[] = [];
  if (notReady)
    considerations.push("Avec une mise de fonds sous 20 000 $ en achetant seul, la priorité est de bâtir ta mise de fonds.");
  if (scoring.projectFit === "tight")
    considerations.push("Ton budget est serré pour le type de propriété visé dans ce secteur.");
  if (!budget)
    considerations.push("Ton budget reste à préciser pour évaluer la cohérence du projet.");
  if (a.currentHousing === "owner" && a.ownerStrategy === "must_sell")
    considerations.push("La vente de ta propriété actuelle est une étape à coordonner avec ton achat.");
  while (considerations.length < 3)
    considerations.push("Une préapprobation à jour confirmera ton budget réel avant les visites.");

  const recommendedAdjustments: string[] = [];
  if (alt) recommendedAdjustments.push(alt.message);
  if (notReady)
    recommendedAdjustments.push("Acheter à plusieurs (conjoint, famille) rendrait le projet possible plus rapidement.");
  recommendedAdjustments.push("Faire valider ton financement précisera ce qui est réellement à ta portée.");
  while (recommendedAdjustments.length < 3)
    recommendedAdjustments.push("Prioriser tes 3 critères essentiels élargit les options qui te conviennent.");

  const nextSteps = [
    notReady
      ? "Établir un plan de mise de fonds (épargne, CELIAPP, don familial)."
      : "Faire valider ta capacité réelle avec une préapprobation à jour.",
    "Confirmer le budget et la mise de fonds avec les bons chiffres.",
    "Cibler les secteurs et types de propriété cohérents avec ton budget.",
    `Valider le tout avec ${broker.name} pour passer à l'action.`,
  ];

  return {
    headline: headlineFor(a, scoring),
    summary: notReady
      ? "Ton projet est prometteur, mais pas encore prêt à passer à l'action. En bâtissant ta mise de fonds — ou en achetant à plusieurs — tu te rapproches d'un achat réaliste."
      : `Ton projet d'achat ${TIMELINE_LABEL[a.purchaseTimeline ?? "exploring"]} tient la route. La prochaine étape est de faire valider ton financement pour confirmer ce qui est à ta portée.`,
    projectProfile: `${a.firstTimeBuyer === "yes" ? "Premier achat" : "Nouvel achat"} · secteur ${a.region ?? "à préciser"} · ${a.bedrooms ?? "?"} chambre(s).`,
    fitLevel: scoring.projectFit,
    strengths: strengths.slice(0, 3),
    considerations: considerations.slice(0, 3),
    recommendedAdjustments: recommendedAdjustments.slice(0, 3),
    nextSteps,
    disclaimer: STANDARD_DISCLAIMER,
  };
}
