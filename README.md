# Premier Acheteur — Analyseur IA (courtier hypothécaire)

App web one-page qui qualifie les **premiers acheteurs** et transmet les meilleurs prospects à un **courtier hypothécaire** via un webhook CRM.

> Promesse : « Prêt pour ta première propriété ? Découvre où tu en es et tes prochaines étapes vers ta préapprobation. »

L'app ne calcule **jamais** la capacité d'emprunt, n'invente aucun prix/propriété, et ne présente jamais une préqualif comme une approbation. Le meilleur prospect pour un courtier hypothécaire est celui qui n'est **pas encore préapprouvé** — le scoring financier est inversé en conséquence.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Framer Motion · Anthropic SDK (Claude Haiku 4.5). Thème sombre noir / doré / blanc.

## Démarrer
```bash
npm install
cp .env.example .env.local   # remplis les clés
npm run dev
```
Sans `ANTHROPIC_API_KEY`, l'app génère un rapport déterministe de repli (aucune dépendance externe requise pour tester).

## Personnaliser par client
- **Identité** : `lib/broker.ts` (nom, titre, franchise, région, logos).
- **Logos** : dépose `public/logo-broker.png` et `public/logo-franchise.png`, puis renseigne les chemins dans `lib/broker.ts` (sinon un wordmark texte s'affiche).
- **Couleurs** : tokens `--color-brand-*` dans `app/globals.css`.
- **Fourchettes de prix indicatives** (fit / alternatives) : `lib/market.ts`.
- **Règles CRM** : `lib/config.ts` (`MIN_BUDGET`, `STORE_NOT_PREAPPROVED`, `STORE_ALREADY_REPRESENTED`, `STORE_LOW_FIT`).
- **Questionnaire** : `lib/questions.ts`.

## Intégrations (env)
| Variable | Rôle |
|---|---|
| `ANTHROPIC_API_KEY` | Génération IA du rapport (sinon repli déterministe) |
| `LEAD_WEBHOOK_URL` | Webhook CRM (Zapier/Make…) |
| `LEAD_WEBHOOK_SECRET` | En-tête `X-Webhook-Secret` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity |
