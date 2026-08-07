// Modèle de données partagé client + serveur.

export type FinancingStatus =
  | "preapproved"
  | "prequalified"
  | "in_process"
  | "not_started";

export type BuyingWith = "alone" | "cobuyer";

export type PropertyType = "house" | "condo" | "townhouse" | "plex" | "open";

export type PurchaseTimeline =
  | "asap"
  | "0_3_months"
  | "3_6_months"
  | "6_12_months"
  | "exploring";

export type CurrentHousing = "renter" | "owner" | "with_family" | "other";

export type OwnerStrategy = "must_sell" | "no_sale_needed";

export type SalePreparation =
  | "not_started"
  | "valuation_done"
  | "preparing"
  | "already_listed"
  | "accepted_offer";

export type BrokerStatus = "none" | "talking_unsigned" | "under_contract";

export type FirstTimeBuyer = "yes" | "owned_before";

export interface Answers {
  financingStatus?: FinancingStatus;
  approvedBudget?: number;
  targetBudget?: number;
  downPayment?: number;
  buyingWith?: BuyingWith;
  region?: string;
  propertyType?: PropertyType;
  bedrooms?: number;
  mustHaves?: string[];
  firstTimeBuyer?: FirstTimeBuyer;
  purchaseTimeline?: PurchaseTimeline;
  currentHousing?: CurrentHousing;
  ownerStrategy?: OwnerStrategy;
  salePreparation?: SalePreparation;
  brokerStatus?: BrokerStatus;
}

export type FitLevel = "strong" | "possible" | "tight" | "unknown";

export type LeadSegment =
  | "priority"
  | "qualified"
  | "nurture"
  | "early_stage"
  | "represented";

export interface ScoringResult {
  score: number;
  segment: LeadSegment;
  projectFit: FitLevel;
  secondaryTags: string[];
}

export interface AnalysisReport {
  headline: string;
  summary: string;
  projectProfile: string;
  fitLevel: FitLevel;
  strengths: string[];
  considerations: string[];
  recommendedAdjustments: string[];
  nextSteps: string[];
  disclaimer: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  answers: Answers;
  leadType: string;
}
