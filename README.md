# Recours Autonomie

> Réduire le non-recours aux aides à l'autonomie des personnes âgées (APA, ASPA, aides au
> logement, complémentaire santé...), en allant chercher les droits là où ils dorment.

![Statut](https://img.shields.io/badge/statut-exercice%20scolaire-orange)
![Stack](https://img.shields.io/badge/stack-Vite%20%C2%B7%20React%20%C2%B7%20TypeScript-informational)
![Licence](https://img.shields.io/badge/licence-AGPL--3.0-blue)

> [!WARNING]
> **Exercice scolaire, pas un projet public.** Recours Autonomie est un projet pédagogique
> (MSIT, Mines PSL). Ce dépôt et le démonstrateur en ligne **ne constituent pas un service public
> officiel** : les données sont fictives, aucun droit réel n'est calculé, rien n'est transmis à un
> guichet. La licence libre ci-dessous exprime une intention d'ouverture dans un cadre scolaire,
> elle ne confère au projet aucun caractère officiel.

Chaque année, des milliards d'euros d'aides ne sont pas réclamés. Pas par manque de droits, mais
parce que le système est devenu un labyrinthe : des dizaines de dispositifs, une dizaine de
guichets, des règles qui changent d'un département à l'autre. **Recours Autonomie** rend ce
parcours simple, humain et fiable, dans une posture de startup d'État : réutilisation maximale de
l'existant public, souveraineté des données, conformité par construction.

Projet de groupe **MSIT (Mines PSL)**. Le code et la documentation sont ouverts (voir
[Licence](#-licence) et [Contexte](#%EF%B8%8F-contexte-et-avertissement)).

## Ce dépôt contient

Le projet distingue strictement deux livrables de natures différentes :

- 🎯 **La cible** (`docs/`, `catalogue/`) : la documentation d'ingénierie du vrai service à
  construire (architecture, contrats d'interface, conformité, décisions). Doc as code, rigoureuse.
- 🖥️ **Le démonstrateur** (`app/`) : une interface conversationnelle **100 % scriptée**, hors
  ligne, qui fait ressentir l'expérience du futur produit. Aucun vrai LLM, aucun vrai calcul de
  droit : tout est codé en dur pour la démonstration.

Cette frontière est fondatrice : ce qu'on montre au jury n'est jamais la vraie application, et
réciproquement.

## Le principe directeur (non négociable)

**L'assistant ne calcule jamais un droit.** L'éligibilité et les montants sont produits par un
moteur de règles déterministe ([OpenFisca](https://openfisca.fr/), comme le
[simulateur d'aides jeunes](https://github.com/betagouv/aides-jeunes) et
[mon-entreprise](https://mon-entreprise.urssaf.fr)). L'assistant sert d'interface : il collecte les
intrants en langage naturel, appelle le moteur, vulgarise le résultat en langage clair, et oriente
vers le bon guichet pour ce qu'aucun moteur national ne calcule. Tout chiffre affiché vient du
moteur, jamais d'une génération.

Dans le démonstrateur, ce garde-fou est matérialisé dans le code : le calcul est isolé dans
`app/src/lib/moteur.ts`, séparé de la conversation, avec une **étape "moteur" visible** à l'écran.

## 🎙️ Le démonstrateur

Sept écrans, accessibles par onglets, pensés pour la projection en plein écran :

| Onglet | Rôle |
|---|---|
| Accueil | Vitrine publique : le drame du non-recours, la solution, la transparence |
| Le problème | Le labyrinthe des aides (≈ 28 dispositifs, niveaux de certitude, sources) |
| Le défi | Le problème côté technique : jungle d'acteurs, d'API et de jeux de données |
| Notre solution | Besoins concrets, budget en euros, résultats attendus (KPI), open source |
| Assistant vocal | La personne parle. Deux parcours joués jusqu'au bout : une question sur une aide locale (avec recherche locale et mise en relation), ou un point complet sur ses droits |
| Espace aidant | Le tableau de bord d'un proche qui pilote les aides d'un parent |
| Parcours guidé | Quatre questions simples au clic, puis les aides possibles et la démarche |

**En ligne** : https://silneo.pages.dev/ (déployé automatiquement sur Cloudflare Pages à chaque
push sur `main`).

## 🚀 Lancer le démonstrateur

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # app/dist/index.html (fichier unique, ouvrable en double-clic)
```

Le démonstrateur est volontairement contraint : 100 % côté client, **zéro appel réseau** au
runtime, polices système, et un build en un seul `index.html` autonome (ouvrable hors ligne en
`file://`). Pratique pour une démo sur un poste sans accès, sans rien à installer.

## 🧩 L'architecture cible

Trois couches, chacune dans son rôle :

```
  La personne (voix ou clic)
          │
          ▼
  Assistant conversationnel  ──►  collecte en langage clair, vulgarise, oriente
  (LLM souverain, Albert API)         │
          │  function-calling          │  pour ce qui n'est pas calculable :
          ▼                            ▼  mise en relation avec le bon guichet
  Moteur déterministe            Annuaire officiel (API DILA)
  (OpenFisca)  ──►  calcule les montants, de façon auditable
          ▲
          │
  Catalogue des aides (YAML)  ──►  une aide, une fiche, une source
```

Le raisonnement métier reste dans OpenFisca et dans le catalogue versionné, jamais dans les poids
du modèle. Détail des décisions dans [`docs/adr/0004-llm-souverain.md`](./docs/adr/0004-llm-souverain.md).

## 🔓 Tout est ouvert

Le code du service est public. Et surtout, **la documentation des aides** (la règle de chaque
dispositif, sa source officielle, son mode de calcul) vivra dans un **dépôt GitHub dédié**, fiche
par fiche, au format ouvert. N'importe qui peut la lire, la vérifier, signaler une erreur,
contribuer. Sur des droits sociaux, l'ouverture n'est pas un bonus, c'est la condition de la
confiance. Le développement se fait de façon ouverte et transparente, dans l'esprit de l'écosystème
[beta.gouv.fr](https://beta.gouv.fr).

## 🛡️ Souveraineté et conformité

- **Données en France.** Le modèle de langage cible tourne sur [Albert API](https://albert.sites.beta.gouv.fr)
  (DINUM), sur infrastructure qualifiée SecNumCloud. Les données ne quittent pas le territoire et ne
  sont pas transmises aux fournisseurs des modèles.
- **RGPD article 9.** Le niveau de dépendance relève des données de santé : traitement à la volée,
  pas de stockage par défaut, mise en relation strictement minimisée (ni santé, ni montants, ni GIR).
- **IA Act annexe III.** Un accès aux prestations sociales est un système à haut risque :
  traçabilité (catalogue versionné), explicabilité (montant issu d'une formule auditable),
  supervision humaine (orientation systématique vers un guichet).
- **Accessibilité.** Cap RGAA, public âgé : gros texte, fort contraste, focus visible, canal vocal,
  repli clavier.

## 📚 Documentation

- [`CLAUDE.md`](./CLAUDE.md) : document central du projet (cible vs démonstrateur, décisions, état).
- [`docs/catalogue-aides.md`](./docs/catalogue-aides.md) : recensement des ≈ 28 aides, variables OpenFisca, sources.
- [`docs/demonstrateur.md`](./docs/demonstrateur.md) : écrans, navigation, charte graphique, garde-fou.
- [`docs/defi-technique.md`](./docs/defi-technique.md) et [`docs/solution-technique.md`](./docs/solution-technique.md) : le problème et la solution, pour décideurs.
- [`docs/conduite-du-changement.md`](./docs/conduite-du-changement.md) : du démonstrateur au pilote (accès Albert, départements, sponsor, budget).
- [`docs/prompt-mise-en-relation.md`](./docs/prompt-mise-en-relation.md) : le prompt de mise en relation (annuaire DILA, minimisation, consentement).
- [`docs/analyse-parcours-zenior.md`](./docs/analyse-parcours-zenior.md) : analyse du concurrent Zenior.
- [`docs/adr/`](./docs/adr/) : les décisions d'architecture (ADR).

## 🗂️ Structure du projet

```
recours-autonomie/
├── CLAUDE.md         document central du projet
├── docs/             la cible : doc as code (catalogue, démonstrateur, conduite du changement, ADR)
├── catalogue/        la cible : fiches YAML des aides (à construire)
└── app/              le démonstrateur (Vite + React + TypeScript, build fichier unique)
    └── src/
        ├── lib/      moteur.ts (calcul déterministe, garde-fou), vue.ts, cn.ts
        ├── data/     scripts et données 100 % fictives (dialogue, catalogue, mise en relation)
        ├── components/
        └── screens/  les sept écrans
```

## ☁️ Déploiement

Hébergement : **Cloudflare Pages**, redéploiement automatique à chaque push sur `main`. Réglages de
build : racine `app`, commande `npm install && npm run build`, sortie `dist`, Node 22 (`app/.nvmrc`).
La connexion du dépôt à Cloudflare se fait une fois depuis le tableau de bord ; ensuite tout est
automatique.

## 🤝 Contribuer

Les remarques, corrections et idées sont bienvenues via les *issues* et *pull requests*. Toute
contribution est relue avant intégration. Les messages de commit suivent la convention
[Conventional Commits](https://www.conventionalcommits.org/), en français.

## 📄 Licence

Code publié sous licence libre **AGPL-3.0** (voir [`LICENSE`](./LICENSE)), par cohérence avec
OpenFisca et l'écosystème beta.gouv. Rappel : il s'agit d'un **exercice scolaire**, pas d'un projet
public officiel. La licence ouvre le code, elle ne confère au projet aucun caractère officiel.

## ℹ️ Contexte et avertissement

Recours Autonomie est un **projet pédagogique** (MSIT, Mines PSL). Le démonstrateur en ligne
présente des **données entièrement fictives** et **n'est relié à aucun service public réel** : il
ne calcule aucun droit réel et ne transmet aucune information à un guichet. Il sert à illustrer une
proposition de service et l'architecture cible.
