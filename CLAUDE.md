# CLAUDE.md : Projet Recours Autonomie

> Document central du projet. Lu en priorité à chaque session.
> Maintenu en Français, guillemets droits. À jour le 2026-06-17.

---

## 1. Ce qu'est ce projet (et ce qu'il n'est pas)

**Recours Autonomie** (nom de code de travail) est un projet de groupe MSIT (Mines PSL), posture startup d'État, qui lutte contre le **non-recours aux aides à l'autonomie des personnes âgées** (APA, ASPA...).

Le non-recours dépasse 30 % sur plusieurs aides (DREES). La cause n'est pas le calcul du droit, qui est solvable, mais trois frictions humaines : complexité de l'information, difficulté à fournir les bonnes données d'entrée pour un public peu à l'aise avec le numérique, et le passage à l'acte.

### Distinction fondatrice : CIBLE vs DÉMONSTRATEUR

C'est la décision structurante du projet (ADR-0001). Ne jamais confondre les deux.

| | **Cible** | **Démonstrateur** |
|---|---|---|
| Quoi | La vraie solution future | L'interface qui fait se projeter le jury |
| Où | `docs/` + `catalogue/` | `app/` |
| Nature | Doc-as-code rigoureuse | Interface scriptée, comportement codé en dur |
| LLM | Réel, souverain, function-calling | Simulé (réponses et étapes scriptées) |
| Calcul | OpenFisca déterministe | Montants codés en dur, réalistes |
| Objectif | Crédibilité technique, conformité | Faire ressentir, faire se projeter |
| Échéance | Livrable de fin de semestre | Prêt en juin 2026 |

**Le rôle de François dans le groupe** : cadrage technique (choix LLM, repo Git, coût de build et de run). Le démonstrateur est SON livrable, l'interface qui projette le jury dans la cible.

**Conséquence opérationnelle** : pour le démonstrateur, on code le comportement en dur, c'est le bon choix (simple, robuste, offline). On ne construit PAS la vraie app. Ne jamais re-proposer de brancher un vrai LLM ou un vrai OpenFisca dans `app/`.

---

## 2. Principe directeur de la CIBLE (non négociable)

**Le LLM ne calcule jamais un droit.** L'éligibilité et les montants sont produits par un moteur déterministe (OpenFisca). Le LLM est une interface : il collecte les intrants en langage naturel, appelle le moteur, et vulgarise le résultat en FALC. Tout chiffre vient du moteur, jamais d'une génération.

Raison : sur un public vulnérable, une hallucination chiffrée ("vous avez droit à 740 €") produit un dommage réel. C'est aussi une exigence IA Act (système d'accès aux prestations sociales = haut risque, annexe III).

Architecture cible en une phrase : YAML/md pour décrire et orchestrer les aides + OpenFisca pour calculer + un LLM souverain (Albert API cible, Mistral EU en dev) en function-calling pour dialoguer et vulgariser + un RAG léger pour les démarches.

---

## 3. Le DÉMONSTRATEUR (`app/`)

Interface conversationnelle sobre qui montre le ressenti du futur produit. Comportement 100 % scripté.

### Parcours

Quatre questions FALC posées une à une (au clic, pas de saisie libre) :
1. Résidence (domicile / établissement)
2. Autonomie (proxy FALC du GIR : autonome / partielle / forte)
3. Ressources mensuelles (3 tranches)
4. Foyer (seul / couple)

Puis une **étape "moteur" visible** ("Le moteur de calcul vérifie vos droits…") qui rend lisible à l'écran que le montant vient d'un moteur déterministe, pas de l'assistant. C'est le dispositif qui fait projeter le jury dans l'architecture cible.

Puis **restitution** : deux aides illustrant les deux régimes :
- **APA à domicile** : badge ambre "Estimation, à confirmer par votre département" (cas départemental).
- **ASPA** : badge vert "Montant national fiable" (cas national). Avec note honnête sur la récupération sur succession.

Chaque carte se termine par une démarche concrète (guichet + lien fiche service-public.fr).

### Garde-fou matérialisé dans le code

Le calcul est isolé dans `app/src/lib/moteur.ts`, séparé de la conversation. Ce module joue le rôle d'OpenFisca dans le démonstrateur : montants codés en dur, déterministes, mais respectant le **même contrat** que l'outil `calculer_droits` de la cible. Lisible à la lecture du repo : l'assistant n'invente aucun chiffre.

### Stack du démonstrateur

| Domaine | Choix |
|---|---|
| Bundler | Vite 8 |
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v3, tokens `etat-*` (bleu France #000091, sobre service public) |
| Polices | Système (zéro appel réseau, offline) |
| Icônes | `lucide-react` |
| Build single-file | `vite-plugin-singlefile` |
| Navigation | `useReducer` (machine à états), pas de routing |

### Règles anti-effet démo (héritées et toujours valides pour `app/`)

1. 100 % client-side, aucun backend, aucune base, aucune auth.
2. Zéro appel réseau au runtime (polices système, pas de CDN, pas d'analytics).
3. Comportement scripté déterministe. Pas de vrai LLM, pas de vrai OpenFisca dans le démonstrateur.
4. Buildable en un seul `index.html` (`vite-plugin-singlefile`), ouvrable en double-clic.
5. Bannière "Démonstrateur, données fictives" persistante.
6. Accessibilité : gros texte, fort contraste, focus visible (cap RGAA, public âgé).

### Bundle actuel

`app/dist/index.html` ≈ **333 kB** (gzip ≈ 99 kB). Compatible double-clic `file://`.

---

## 4. La CIBLE / documentation (`docs/` + `catalogue/`), à construire

Livrable doc-as-code, évalué. Base déjà fournie par François. Arborescence visée :

```
recours-autonomie/
├── docs/
│   ├── architecture.md              (les 3 couches, flux, garde-fous)
│   ├── contrats-interface.md        (contrat LLM <-> OpenFisca, schémas calculer_droits)
│   ├── conformite-rgpd-ia-act.md    (données santé, IA Act haut risque, RGAA)
│   ├── parcours-utilisateur.md      (questionnaire, FALC, passage à l'acte)
│   └── adr/
│       ├── 0001-cible-vs-demonstrateur.md   (à écrire, décision fondatrice)
│       ├── 0002-moteur-deterministe-openfisca.md
│       ├── 0003-rejet-du-fine-tuning.md
│       └── 0004-llm-souverain.md
└── catalogue/
    ├── _schema.md                   (schéma d'une fiche aide)
    ├── apa.yml                      (cas départemental)
    └── aspa.yml                     (cas national)
```

### Existant public à réutiliser (ne pas réinventer)

- **Calcul** : OpenFisca-France (moteur AGPL, API web publique). APA et ASPA modélisées et vérifiées.
- **Catalogue** : pattern `betagouv/aides-jeunes` (chaque aide en YAML, mappée à OpenFisca + fiche service-public).
- **Connaissance** : open data service-public.fr (DILA, fiche APA = F10009), portail pour-les-personnes-agees.gouv.fr.
- **Offre** (où déposer) : open data CNSA sur data.gouv.fr.
- **LLM** : Albert API (DINUM, cible) ou Mistral EU (dev, compatible OpenAI). Bascule indolore (URL + clé).

### Réserves techniques vérifiées (à porter dans les ADR)

- Formule APA gelée à la réforme ASV (2016) : barèmes 2026 à auditer avant d'afficher un montant en cible.
- `gir` et `dependance_plan_aide_domicile` sont des **entrées** (évaluation départementale), pas calculées. C'est la limite départementale réelle, traitée en intrant.
- ASPA : calcul national, sans intrant départemental. Cas simple et fiable.

---

## 5. Structure du projet

```
recours-autonomie/
├── CLAUDE.md            (ce fichier)
├── README.md
├── .gitignore
├── docs/                (doc-as-code)
│   ├── catalogue-aides.md            (recensement complet : ≈ 28 aides, variables OpenFisca, sources)
│   ├── analyse-parcours-zenior.md    (concurrent Zenior, couverture des 15 questions, ton empathique)
│   ├── demonstrateur.md              (écrans, navigation par onglets, charte URSSAF, garde-fou)
│   ├── prompt-mise-en-relation.md    (prompt LLM : guichets DILA, envoi du mail par le service)
│   ├── albert-et-souverainete.md     (fiche de référence LLM souverain)
│   ├── conduite-du-changement.md     (du démonstrateur au pilote : Albert, départements, sponsor, budget €)
│   ├── defi-technique.md             (le problème côté technique, source de l'onglet "Le défi")
│   ├── solution-technique.md         (la solution côté technique, source de l'onglet "Notre solution")
│   └── adr/
│       └── 0004-llm-souverain.md     (ADR : Albert API, modèles, function-calling)
├── catalogue/           (cible : fiches YAML, à construire)
└── app/                 (démonstrateur, fonctionnel)
    ├── package.json     (vite-plugin-singlefile, react, tailwind, lucide)
    ├── vite.config.ts   (base './', singlefile, assets inlinés)
    ├── tailwind.config.js (tokens etat-* + accents teal/or/rose, charte URSSAF)
    └── src/
        ├── main.tsx
        ├── App.tsx       (coquille + navigation par onglets, pas de routing)
        ├── index.css
        ├── lib/
        │   ├── cn.ts
        │   ├── vue.ts    (type Vue : accueil | assure | aidant | vocal | labyrinthe | defi | solution)
        │   └── moteur.ts  (LE moteur : calcul déterministe, stub OpenFisca)
        ├── data/
        │   ├── questions.ts          (script du parcours au clic)
        │   ├── dialogueVocal.ts      (script vocal empathique, branche labyrinthe)
        │   ├── renseignementLocal.ts (cadrage + branche renseignement : adaptation logement, recherche locale, contact)
        │   ├── aidant.ts             (8 aides du tableau de bord aidant)
        │   ├── labyrinthe.ts         (catalogue des ≈ 28 dispositifs)
        │   └── miseEnRelation.ts     (guichets DILA fictifs, type Contact, mail, fiche d'appel)
        ├── components/
        │   ├── DemoBanner.tsx
        │   └── Decor.tsx        (décor géométrique URSSAF)
        └── screens/
            ├── Accueil.tsx          (vitrine publique : hero, drame, solution, transparence)
            ├── ParcoursAssure.tsx
            ├── EspaceAidant.tsx
            ├── AssistantVocal.tsx   (cadrage + 2 branches : renseignement/labyrinthe, recherche locale, mise en relation)
            ├── DefiTechnique.tsx    (onglet "Le défi" : le problème côté technique)
            ├── SolutionTechnique.tsx (onglet "Notre solution" : besoins concrets, budget €, KPI)
            └── Labyrinthe.tsx       (le problème : labyrinthe des aides)
```

---

## 6. État d'avancement

| Étape | Statut |
|---|---|
| Pivot depuis Silneo, cadrage cible vs démonstrateur | Fait (16/06/2026) |
| Nouveau dossier + git init | Fait |
| Scaffold démonstrateur (réutilisation Silneo, marque retirée) | Fait |
| Démonstrateur conversationnel APA + ASPA + étape moteur | Fait |
| Hub d'accueil + navigation par état (5 vues) | Fait (17/06/2026) |
| Espace aidant (tableau de bord, 8 aides) | Fait (17/06/2026) |
| Assistant vocal (transcription + réassurance empathique) | Fait (17/06/2026) |
| Labyrinthe des aides (catalogue ≈ 28 dispositifs) | Fait (17/06/2026) |
| Charte graphique URSSAF adaptée senior | Fait (17/06/2026) |
| Doc-as-code (catalogue, analyse Zenior, démonstrateur) | Fait (17/06/2026) |
| Vitrine publique (hero, drame, solution, transparence) | Fait (18/06/2026) |
| Navigation par onglets + layout projection paysage | Fait (18/06/2026) |
| Service de mise en relation joué en fin de vocal (DILA, mail/téléphone, consentement) | Fait (18/06/2026) |
| ADR-0004 LLM souverain + évolution prompt mise en relation | Fait (18/06/2026) |
| Assistant vocal : étape de cadrage + branche renseignement (adaptation logement, recherche locale visible) | Fait (18/06/2026) |
| Onglets décideurs "Le défi" et "Notre solution" (besoins concrets, budget €, KPI) | Fait (18/06/2026) |
| Docs conduite du changement + défi/solution technique (sources des onglets décideurs) | Fait (18/06/2026) |
| Repo GitHub + premier commit + push | Fait (17/06/2026) |
| Déploiement Cloudflare Pages (auto sur push `main`) | Fait, en ligne (17/06/2026). Redéploiement automatique à chaque push |
| ADR (0001 cible/démonstrateur en priorité) | À faire |
| Parcours utilisateur senior complet (couverture des 15 questions) | En cours de cadrage |

---

## 7. Décisions actées

1. Distinction **cible vs démonstrateur** : la cible est la vraie solution (doc), le démonstrateur est une interface scriptée pour le jury. Comportement codé en dur côté `app/`, assumé.
2. **Le LLM ne calcule jamais un droit** (principe cible). Dans le démonstrateur, matérialisé par `moteur.ts` séparé de la conversation.
3. Démonstrateur **offline single-file**, codes graphiques service public sobres (bleu France), pas la marque Silneo.
4. Silneo conservé tel quel, archivé séparément. Repo public neuf pour Recours Autonomie.

---

## 8. Comment reprendre la session

1. Lire ce CLAUDE.md en entier.
2. Démonstrateur : `cd app && npm install && npm run dev` → http://localhost:5173
3. Build single-file : `cd app && npm run build` → `app/dist/index.html` (double-clic).
4. Prochaines étapes possibles : créer le repo GitHub, construire la doc-as-code (`docs/`, `catalogue/`), écrire les ADR.

### Cadre de travail (rappel du brief)

- Tester les hypothèses implicites d'une demande, signaler une prémisse fausse.
- Sur tout sujet évolutif (modèles, prix, quotas, réglementation), recherche datée avant de répondre.
- Privilégier l'existant public avant toute solution propriétaire.
- Doc en doc-as-code (Markdown + YAML), versionnable.
