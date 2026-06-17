# Recours Autonomie

> Nom de code de travail. Démonstrateur d'aide à la détection de droits pour personnes âgées, conçu pour réduire le non-recours aux aides à l'autonomie (APA, ASPA...).
>
> Projet de groupe MSIT (Mines PSL), posture startup d'État. Réutilisation maximale de l'existant public, souveraineté des données, conformité IA Act.

## Principe directeur (non négociable)

**Le LLM ne calcule jamais un droit.** L'éligibilité et les montants sont produits par un moteur déterministe. Le LLM sert d'interface : il collecte les intrants en langage naturel, appelle le moteur, et vulgarise le résultat. Tout chiffre affiché provient du moteur, jamais d'une génération.

## Architecture en une phrase

YAML/md pour décrire et orchestrer les aides + un moteur déterministe (OpenFisca) pour calculer + un LLM souverain en function-calling pour dialoguer et vulgariser.

## État

Démonstrateur fonctionnel (5 écrans). Voir [CLAUDE.md](./CLAUDE.md) pour la documentation
projet et les décisions techniques.

## Documentation

- [docs/catalogue-aides.md](./docs/catalogue-aides.md) — recensement complet des aides (≈ 28 dispositifs, variables OpenFisca, sources).
- [docs/analyse-parcours-zenior.md](./docs/analyse-parcours-zenior.md) — analyse du concurrent Zenior et couverture de ses 15 questions.
- [docs/demonstrateur.md](./docs/demonstrateur.md) — écrans, charte graphique, garde-fou moteur.

## Lancer le démonstrateur

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # app/dist/index.html (single-file, ouvrable en double-clic)
```

## Structure

```
recours-autonomie/
├── docs/         doc-as-code (catalogue des aides, analyse Zenior, démonstrateur, ADR)
├── catalogue/    fiches YAML des aides (à construire)
└── app/          démonstrateur : hub + parcours guidé + espace aidant + assistant vocal + labyrinthe
```

## Déploiement

Hébergement visé : Cloudflare Pages, déploiement automatique à chaque push sur `main`.
Réglages de build : root `app`, build `npm install && npm run build`, sortie `dist`, Node 22
(`app/.nvmrc`). La connexion du dépôt à Cloudflare Pages se fait une fois depuis le tableau de
bord Cloudflare ; ensuite chaque push redéploie automatiquement.
