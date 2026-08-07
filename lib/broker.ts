// ─────────────────────────────────────────────────────────────
// IDENTITÉ DU COURTIER — modifie uniquement ce fichier par client.
// ─────────────────────────────────────────────────────────────
export const broker = {
  // Nom affiché (courtier ou équipe).
  name: "Ton courtier hypothécaire",
  // Titre / rôle.
  title: "Courtier hypothécaire",
  // Franchise / bannière (Multi-Prêts, Planiprêt, M3, indépendant…).
  franchise: "Multi-Prêts",
  // Région desservie (texte libre — la carte a été retirée).
  region: "Grand Montréal",
  // Logos dans /public. Laisse null pour afficher un wordmark texte à la place.
  brokerLogo: null as string | null, // ex. "/logo-broker.png"
  franchiseLogo: null as string | null, // ex. "/logo-franchise.png"
};
