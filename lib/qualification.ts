import { Answers, ScoringResult } from "./types";
import { config } from "./config";
import { budgetOf } from "./scoring";

export interface QualificationResult {
  store: boolean;
  reason: string;
}

// Décide si le lead est transmis au CRM (webhook).
export function evaluateQualification(
  a: Answers,
  scoring: ScoringResult
): QualificationResult {
  if (a.brokerStatus === "under_contract" && !config.STORE_ALREADY_REPRESENTED) {
    return { store: false, reason: "already_represented" };
  }

  if (a.financingStatus === "not_started" && !config.STORE_NOT_PREAPPROVED) {
    return { store: false, reason: "not_started" };
  }

  if (scoring.segment === "early_stage" && !config.STORE_LOW_FIT) {
    return { store: false, reason: "low_fit" };
  }

  const budget = budgetOf(a);
  if (config.MIN_BUDGET != null && (budget ?? 0) < config.MIN_BUDGET) {
    return { store: false, reason: "below_min_budget" };
  }

  return { store: true, reason: "qualified" };
}
