// Règles de rétention CRM et intégrations. Ajuste par déploiement.
export const config = {
  // Budget minimal pour transmettre un lead (null = aucun plancher).
  MIN_BUDGET: null as number | null,
  // Envoyer au CRM même si la personne n'est pas encore préapprouvée.
  // Pour un courtier hypothécaire, c'est SON meilleur prospect → true.
  STORE_NOT_PREAPPROVED: true,
  // Envoyer au CRM même si déjà engagé avec un autre courtier hypothécaire.
  STORE_ALREADY_REPRESENTED: false,
  // Envoyer au CRM les profils très tôt dans leur parcours (nurturing).
  STORE_LOW_FIT: true,

  // Intégrations (lues côté serveur / client).
  WEBHOOK_URL: process.env.LEAD_WEBHOOK_URL ?? "",
  WEBHOOK_SECRET: process.env.LEAD_WEBHOOK_SECRET ?? "",
  META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
};

export const LEAD_TYPE = "first_buyer_analysis";
