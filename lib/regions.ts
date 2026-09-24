import type { Region } from "./types";

// Secteurs proposés à la question « secteurs ». Utilisé en recherche/liste —
// aucune coordonnée requise. La personne peut aussi saisir un secteur libre.
// ⚠️ À ADAPTER selon la région réellement desservie par le courtier.
export const REGIONS: Region[] = [
  // Montréal
  { id: "montreal", name: "Montréal" },
  { id: "ahuntsic", name: "Ahuntsic–Cartierville" },
  { id: "villeray", name: "Villeray–Saint-Michel" },
  { id: "rosemont", name: "Rosemont–La Petite-Patrie" },
  { id: "mercier", name: "Mercier–Hochelaga" },
  { id: "sud-ouest", name: "Le Sud-Ouest" },
  { id: "verdun", name: "Verdun / Île-des-Sœurs" },
  { id: "lachine", name: "Lachine" },
  { id: "lasalle", name: "LaSalle" },
  { id: "saint-laurent", name: "Saint-Laurent" },
  { id: "anjou", name: "Anjou" },
  { id: "pointe-aux-trembles", name: "Pointe-aux-Trembles" },

  // Rive-Sud
  { id: "longueuil", name: "Longueuil" },
  { id: "saint-hubert", name: "Saint-Hubert" },
  { id: "brossard", name: "Brossard" },
  { id: "saint-lambert", name: "Saint-Lambert" },
  { id: "boucherville", name: "Boucherville" },
  { id: "saint-bruno", name: "Saint-Bruno-de-Montarville" },
  { id: "chambly", name: "Chambly" },
  { id: "la-prairie", name: "La Prairie" },
  { id: "candiac", name: "Candiac" },
  { id: "sainte-julie", name: "Sainte-Julie" },

  // Rive-Nord / Laval
  { id: "laval", name: "Laval" },
  { id: "terrebonne", name: "Terrebonne" },
  { id: "repentigny", name: "Repentigny" },
  { id: "mascouche", name: "Mascouche" },
  { id: "blainville", name: "Blainville" },
  { id: "boisbriand", name: "Boisbriand" },
  { id: "mirabel", name: "Mirabel" },
  { id: "saint-jerome", name: "Saint-Jérôme" },

  // Ouest-de-l'Île
  { id: "pointe-claire", name: "Pointe-Claire" },
  { id: "dollard", name: "Dollard-des-Ormeaux" },
  { id: "kirkland", name: "Kirkland" },
  { id: "vaudreuil", name: "Vaudreuil-Dorion" },
];
