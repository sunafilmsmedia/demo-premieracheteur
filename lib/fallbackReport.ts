import { AnalysisReport, Answers, ScoringResult } from "./types";
import { broker } from "./broker";
import { isNotReady, projectReadiness } from "./scoring";

export const STANDARD_DISCLAIMER =
  "Cette analyse est indicative et repose uniquement sur les informations fournies. Elle ne constitue pas une préapprobation hypothécaire, une évaluation immobilière, un avis financier ni une garantie qu'une propriété correspondant aux critères est disponible. Les possibilités doivent être validées avec les professionnels concernés.";

const TIMELINE_LABEL: Record<string, string> = {
  asap: "dès que tu trouves la bonne propriété",
  "0_3_months": "dans les 3 prochains mois",
  "3_6_months": "dans 3 à 6 mois",
  "6_12_months": "dans 6 à 12 mois",
  exploring: "en mode exploration",
};

function headlineFor(a: Answers): string {
  switch (projectReadiness(a)) {
    case "ready":
      return "Ton projet est réaliste";
    case "advancing":
      return "Ton projet est bien aligné";
    default:
      return "Ton projet est en préparation";
  }
}

export function buildFallbackReport(
  a: Answers,
  scoring: ScoringResult
): AnalysisReport {
  const notReady = isNotReady(a);
  const down = a.downPayment ?? 0;

  const strengths: string[] = [];
  if (down >= 30000)
    strengths.push("Tu as déjà une mise de fonds solide de côté.");
  else if (down >= 20000)
    strengths.push("Tu as déjà une mise de fonds concrète pour démarrer.");
  if (a.purchaseTimeline === "asap" || a.purchaseTimeline === "0_3_months")
    strengths.push("Ton échéancier est rapproché, ton projet est concret.");
  if (a.firstTimeBuyer === "yes")
    strengths.push("Comme premier acheteur, tu es admissible à des programmes avantageux (CELIAPP, RAP, remboursements).");
  if (a.currentHousing === "renter" || a.currentHousing === "with_family")
    strengths.push("Ta situation actuelle te laisse une bonne flexibilité pour acheter.");
  while (strengths.length < 3)
    strengths.push("Tu as une vision claire du type de propriété que tu recherches.");

  const considerations: string[] = [];
  if (notReady)
    considerations.push("Avec une mise de fonds sous 20 000 $ en achetant seul, la priorité est de la bâtir davantage.");
  if (a.currentHousing === "owner" && a.ownerStrategy === "must_sell")
    considerations.push("La vente de ta propriété actuelle est une étape à coordonner avec ton achat.");
  considerations.push("Une préapprobation confirmera le budget réel avant de visiter.");
  while (considerations.length < 3)
    considerations.push("Cibler tes 3 critères essentiels aidera à rester réaliste.");

  const recommendedAdjustments: string[] = [];
  if (notReady)
    recommendedAdjustments.push("Acheter à plusieurs (conjoint, famille) rendrait le projet possible plus rapidement.");
  recommendedAdjustments.push("Faire valider ton financement précisera ce qui est réellement à ta portée.");
  if (a.firstTimeBuyer === "yes")
    recommendedAdjustments.push("Explorer le CELIAPP et le RAP pour maximiser ta mise de fonds.");
  while (recommendedAdjustments.length < 3)
    recommendedAdjustments.push("Prioriser tes critères essentiels élargit les options qui te conviennent.");

  const nextSteps = [
    notReady
      ? "Établir un plan de mise de fonds (épargne, CELIAPP, don familial)."
      : "Faire une préapprobation à jour pour confirmer ton budget réel.",
    "Clarifier ta mise de fonds et les programmes auxquels tu es admissible.",
    "Cibler les secteurs et types de propriété qui te conviennent.",
    `Valider le tout avec ${broker.name} pour passer à l'action.`,
  ];

  return {
    headline: headlineFor(a),
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
