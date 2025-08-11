EconoDeal – Vercel Project

Contenu:
- index.html (landing bilingue + intégration deals via proxy)
- api/bestbuy.js (proxy côté serveur qui utilise la clé Best Buy)
- public/logo.svg (logo simple, remplaçable)
- vercel.json (config déploiement)

Déploiement (rapide):
1) Aller sur https://vercel.com → New Project → Import Project
2) Uploader ce dossier (ou pousser sur GitHub et importer)
3) Déployer. Ouvrir l’URL publique.
4) Cliquer sur “Charger” dans la section Liquidations Best Buy.

Option sécurité (recommandé):
Dans Vercel > Project > Settings > Environment Variables :
- BESTBUY_API_KEY = votre clé Best Buy
Puis redeployez (la clé ne sera plus dans le code).
