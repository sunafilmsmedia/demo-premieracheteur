import { PropertyType } from "./types";

// Fourchettes indicatives (Québec, premier acheteur). PURE RÉFÉRENCE INTERNE :
// jamais affichées comme des prix réels. Ajuste selon la région du courtier.
export const MARKET_RANGES: Record<PropertyType, [number, number]> = {
  condo: [230000, 430000],
  townhouse: [300000, 520000],
  house: [350000, 650000],
  plex: [500000, 850000],
  open: [230000, 650000],
};

export const PROPERTY_LABELS: Record<PropertyType, string> = {
  house: "maison unifamiliale",
  condo: "condo",
  townhouse: "maison de ville",
  plex: "duplex ou plex",
  open: "propriété",
};
