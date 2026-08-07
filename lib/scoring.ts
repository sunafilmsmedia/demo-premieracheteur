import { Answers, FitLevel, LeadSegment, ScoringResult } from "./types";

// Scoring reconstruit sans financement ni budget (questions retirées).
// Signaux disponibles : échéancier, mise de fonds, situation, 1er achat.

// ── Échéancier (max 40) — le plus fort signal d'intention ──
const TIMELINE_SCORE: Record<string, number> = {
  asap: 40,
  "0_3_months": 35,
  "3_6_months": 25,
  "6_12_months": 12,
  exploring: 0,
};

// ── Mise de fonds (max 35) — état de préparation concret ──
function downPaymentScore(a: Answers): number {
  const d = a.downPayment ?? 0;
  if (d >= 50000) return 35;
  if (d >= 30000) return 28;
  if (d >= 20000) return 20;
  if (d >= 10000) return 12;
  return 6;
}

// ── Situation résidentielle (max 15) ──
function housingScore(a: Answers): number {
  switch (a.currentHousing) {
    case "renter":
    case "with_family":
      return 15;
    case "owner":
      if (a.ownerStrategy === "no_sale_needed") return 12;
      if (a.ownerStrategy === "must_sell") {
        switch (a.salePreparation) {
          case "accepted_offer":
            return 15;
          case "already_listed":
            return 11;
          case "preparing":
          case "valuation_done":
            return 8;
          default:
            return 4;
        }
      }
      return 8;
    default:
      return 0;
  }
}

// ── Premier achat (max 10) — prospect prioritaire pour un courtier hypo ──
function firstBuyerScore(a: Answers): number {
  if (a.firstTimeBuyer === "yes") return 10;
  if (a.firstTimeBuyer === "owned_before") return 6;
  return 0;
}

// Projet pas encore prêt : mise de fonds faible en achetant seul.
export function isNotReady(a: Answers): boolean {
  return (
    a.downPayment != null && a.downPayment < 20000 && a.buyingWith === "alone"
  );
}

// Niveau de préparation global (pour le verdict / rapport).
export function projectReadiness(a: Answers): "ready" | "advancing" | "early" {
  if (isNotReady(a)) return "early";
  const soon =
    a.purchaseTimeline === "asap" || a.purchaseTimeline === "0_3_months";
  const down = a.downPayment ?? 0;
  if (soon && down >= 20000) return "ready";
  if (a.purchaseTimeline === "exploring") return "early";
  return "advancing";
}

function segmentFor(score: number): LeadSegment {
  if (score >= 80) return "priority";
  if (score >= 60) return "qualified";
  if (score >= 35) return "nurture";
  return "early_stage";
}

export function scoreAnswers(a: Answers): ScoringResult {
  const score = Math.min(
    100,
    (TIMELINE_SCORE[a.purchaseTimeline ?? ""] ?? 0) +
      downPaymentScore(a) +
      housingScore(a) +
      firstBuyerScore(a)
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

  // Sans budget confirmé, la compatibilité reste toujours à valider.
  const projectFit: FitLevel = "unknown";

  return {
    score,
    segment: segmentFor(score),
    projectFit,
    secondaryTags,
  };
}
