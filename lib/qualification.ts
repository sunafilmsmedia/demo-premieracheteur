import { Answers, ScoringResult } from "./types";
import { config } from "./config";

export interface QualificationResult {
  store: boolean;
  reason: string;
}

// Décide si le lead est transmis au CRM (webhook). On ne veut écarter
// personne : un courtier hypothécaire est là pour approuver les gens.
export function evaluateQualification(
  _a: Answers,
  scoring: ScoringResult
): QualificationResult {
  if (scoring.segment === "early_stage" && !config.STORE_LOW_FIT) {
    return { store: false, reason: "low_fit" };
  }
  return { store: true, reason: "qualified" };
}
