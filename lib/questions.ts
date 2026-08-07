import { Answers } from "./types";

export type QuestionType = "choice" | "currency" | "bedrooms" | "multi";

export interface QuestionOption {
  value: string;
  label: string;
  exclusive?: boolean; // multi : désélectionne les autres
}

export interface QuestionDef {
  id: string;
  type: QuestionType;
  // Clé de stockage par défaut. Le budget la calcule dynamiquement.
  storeKey: keyof Answers;
  storeKeyFn?: (a: Answers) => keyof Answers;
  title: string | ((a: Answers) => string);
  note?: string;
  options?: QuestionOption[];
  autoAdvance?: boolean;
  optional?: boolean;
  maxSelect?: number;
  visible?: (a: Answers) => boolean;
}

export const QUESTIONS: QuestionDef[] = [
  {
    id: "downPayment",
    type: "currency",
    storeKey: "downPayment",
    title: "Quelle mise de fonds as-tu accumulée jusqu'à maintenant ?",
    note: "Aucun calcul de capacité d'emprunt — c'est pour comprendre où tu en es dans ta préparation.",
  },
  {
    id: "buyingWith",
    type: "choice",
    storeKey: "buyingWith",
    autoAdvance: true,
    visible: (a) => (a.downPayment ?? Infinity) < 20000,
    title: "Achètes-tu seul ou à plusieurs ?",
    options: [
      { value: "alone", label: "J'achète seul" },
      { value: "cobuyer", label: "À plusieurs (conjoint, famille, associé…)" },
    ],
  },
  {
    id: "region",
    type: "choice",
    storeKey: "region",
    autoAdvance: true,
    title: "Dans quel secteur cherches-tu à acheter ?",
    options: [
      { value: "Montréal", label: "Montréal" },
      { value: "Rive-Sud", label: "Rive-Sud" },
      { value: "Rive-Nord / Laval", label: "Rive-Nord / Laval" },
      { value: "Ailleurs au Québec", label: "Ailleurs au Québec" },
    ],
  },
  {
    id: "propertyType",
    type: "choice",
    storeKey: "propertyType",
    autoAdvance: true,
    title: "Quel type de propriété recherches-tu ?",
    options: [
      { value: "house", label: "Maison unifamiliale" },
      { value: "condo", label: "Condo" },
      { value: "townhouse", label: "Maison de ville" },
      { value: "plex", label: "Duplex ou plex" },
      { value: "open", label: "Je suis ouvert" },
    ],
  },
  {
    id: "bedrooms",
    type: "bedrooms",
    storeKey: "bedrooms",
    autoAdvance: true,
    title: "De combien de chambres as-tu besoin ?",
  },
  {
    id: "mustHaves",
    type: "multi",
    storeKey: "mustHaves",
    maxSelect: 3,
    title: "Quels sont tes 3 critères les plus importants ?",
    options: [
      { value: "garage", label: "Garage" },
      { value: "terrain", label: "Terrain" },
      { value: "stationnement", label: "Stationnement" },
      { value: "sous_sol", label: "Sous-sol" },
      { value: "recente", label: "Construction récente" },
      { value: "transport", label: "Transport en commun" },
      { value: "ecoles", label: "Proximité des écoles" },
      { value: "renover", label: "Possibilité de rénover" },
      { value: "faibles_frais", label: "Faibles frais de condo" },
      { value: "intergen", label: "Intergénération" },
      { value: "aucun", label: "Aucun critère indispensable", exclusive: true },
    ],
  },
  {
    id: "firstTimeBuyer",
    type: "choice",
    storeKey: "firstTimeBuyer",
    autoAdvance: true,
    title: "Est-ce que ce serait ta première propriété ?",
    note: "Ça oriente les programmes possibles (CELIAPP, RAP, remboursement de droits…).",
    options: [
      { value: "yes", label: "Oui, c'est ma première" },
      { value: "owned_before", label: "J'ai déjà été propriétaire" },
    ],
  },
  {
    id: "timeline",
    type: "choice",
    storeKey: "purchaseTimeline",
    autoAdvance: true,
    title: "À quel moment aimerais-tu acheter ?",
    options: [
      { value: "asap", label: "Dès que je trouve la bonne propriété" },
      { value: "0_3_months", label: "Dans les 3 prochains mois" },
      { value: "3_6_months", label: "Dans 3 à 6 mois" },
      { value: "6_12_months", label: "Dans 6 à 12 mois" },
      { value: "exploring", label: "Je veux simplement explorer" },
    ],
  },
  {
    id: "currentHousing",
    type: "choice",
    storeKey: "currentHousing",
    autoAdvance: true,
    title: "Quelle est ta situation actuellement ?",
    options: [
      { value: "renter", label: "Je suis locataire" },
      { value: "owner", label: "Je suis propriétaire" },
      { value: "with_family", label: "J'habite avec ma famille" },
      { value: "other", label: "Autre" },
    ],
  },
  {
    id: "ownerStrategy",
    type: "choice",
    storeKey: "ownerStrategy",
    autoAdvance: true,
    visible: (a) => a.currentHousing === "owner",
    title: "Pour acheter, où en es-tu avec ta propriété actuelle ?",
    options: [
      { value: "must_sell", label: "Je dois vendre avant d'acheter" },
      { value: "no_sale_needed", label: "Je peux acheter sans vendre" },
    ],
  },
  {
    id: "salePreparation",
    type: "choice",
    storeKey: "salePreparation",
    autoAdvance: true,
    visible: (a) =>
      a.currentHousing === "owner" && a.ownerStrategy === "must_sell",
    title: "Où en es-tu avec la vente de ta propriété actuelle ?",
    options: [
      { value: "not_started", label: "Je n'ai pas commencé" },
      { value: "valuation_done", label: "J'ai fait évaluer" },
      { value: "preparing", label: "Je la prépare" },
      { value: "already_listed", label: "Elle est déjà en vente" },
      { value: "accepted_offer", label: "J'ai une offre acceptée" },
    ],
  },
];

export function getVisibleQuestions(a: Answers): QuestionDef[] {
  return QUESTIONS.filter((q) => (q.visible ? q.visible(a) : true));
}

export function resolveStoreKey(q: QuestionDef, a: Answers): keyof Answers {
  return q.storeKeyFn ? q.storeKeyFn(a) : q.storeKey;
}

export function getTitle(q: QuestionDef, a: Answers): string {
  return typeof q.title === "function" ? q.title(a) : q.title;
}
