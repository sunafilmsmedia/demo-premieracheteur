import { Answers, FitLevel, LeadSegment, ScoringResult } from "./types";
import { MARKET_RANGES, PROPERTY_LABELS } from "./market";

// ── Financement : barème INVERSÉ pour un courtier hypothécaire ──
// Le meilleur prospect est celui qui a encore besoin d'un courtier.
const FINANCING_SCORE: Record<string, number> = {
  in_process: 35, // fait ses démarches maintenant → chaud
  not_started: 28, // doit commencer → le courtier peut l'accompagner
  prequalified: 18, // a une préqualif (souvent bancaire) → convertible
  preapproved: 8, // déjà financé ailleurs → faible valeur pour un courtier hypo
};

const TIMELINE_SCORE: Record<string, number> = {
  asap: 25,
  "0_3_months": 23,
  "3_6_months": 16,
  "6_12_months": 8,
  exploring: 0,
};

const BROKER_SCORE: Record<string, number> = {
  none: 20,
  talking_unsigned: 10,
  under_contract: 0,
};

const FIT_SCORE: Record<FitLevel, number> = {
  strong: 10,
  possible: 6,
  tight: 2,
  unknown: 4, // ne jamais pénaliser l'absence de données
};

function housingScore(a: Answers): number {
  switch (a.currentHousing) {
    case "renter":
    case "with_family":
      return 10;
    case "owner":
      if (a.ownerStrategy === "no_sale_needed") return 8;
      if (a.ownerStrategy === "must_sell") {
        switch (a.salePreparation) {
          case "accepted_offer":
            return 10;
          case "already_listed":
            return 7;
          case "preparing":
          case "valuation_done":
            return 5;
          default:
            return 2;
        }
      }
      return 5;
    default:
      return 0;
  }
}

export function budgetOf(a: Answers): number | undefined {
  return a.approvedBudget ?? a.targetBudget;
}

// Cohérence budget / type de projet — déterministe, jamais « impossible ».
export function evaluateProjectFit(a: Answers): FitLevel {
  const budget = budgetOf(a);
  if (!budget || !a.propertyType) return "unknown";
  const [low] = MARKET_RANGES[a.propertyType];
  if (budget < low) return "tight";
  const down = a.downPayment ?? 0;
  const ratio = down / budget;
  return ratio >= 0.05 ? "strong" : "possible";
}

// « Ce qui EST possible » quand le budget est serré pour le type choisi.
export function affordableAlternatives(
  a: Answers
): { message: string; alternatives: string[] } | null {
  const budget = budgetOf(a);
  if (!budget || !a.propertyType) return null;
  if (budget >= MARKET_RANGES[a.propertyType][0]) return null;

  const alternatives = (Object.keys(MARKET_RANGES) as (keyof typeof MARKET_RANGES)[])
    .filter((t) => t !== "open" && t !== a.propertyType)
    .filter((t) => budget >= MARKET_RANGES[t][0])
    .map((t) => PROPERTY_LABELS[t]);

  if (alternatives.length === 0) {
    return {
      message:
        "Ce budget est encore serré pour ce type de propriété. Bâtir ta mise de fonds ou ajuster le projet avec un courtier ouvrira des options.",
      alternatives: [],
    };
  }

  return {
    message: `Avec ce budget, ${PROPERTY_LABELS[a.propertyType]} reste ambitieux. Tu pourrais plutôt viser : ${alternatives.join(", ")}.`,
    alternatives,
  };
}

// Projet pas encore prêt : mise de fonds faible en achetant seul.
export function isNotReady(a: Answers): boolean {
  return (
    a.downPayment != null && a.downPayment < 20000 && a.buyingWith === "alone"
  );
}

function segmentFor(score: number, a: Answers): LeadSegment {
  if (a.brokerStatus === "under_contract") return "represented";
  if (score >= 80) return "priority";
  if (score >= 60) return "qualified";
  if (score >= 35) return "nurture";
  return "early_stage";
}

export function scoreAnswers(a: Answers): ScoringResult {
  const projectFit = evaluateProjectFit(a);

  const score = Math.min(
    100,
    (FINANCING_SCORE[a.financingStatus ?? ""] ?? 0) +
      (TIMELINE_SCORE[a.purchaseTimeline ?? ""] ?? 0) +
      (BROKER_SCORE[a.brokerStatus ?? ""] ?? 0) +
      housingScore(a) +
      FIT_SCORE[projectFit]
  );

  const secondaryTags: string[] = [];
  if (a.currentHousing === "owner" && a.ownerStrategy === "must_sell") {
    secondaryTags.push("seller_buyer_opportunity");
  }
  if (a.firstTimeBuyer === "yes") {
    secondaryTags.push("first_time_buyer");
  }
  if (isNotReady(a)) {
    secondaryTags.push("down_payment_coaching");
  }

  return {
    score,
    segment: segmentFor(score, a),
    projectFit,
    secondaryTags,
  };
}
