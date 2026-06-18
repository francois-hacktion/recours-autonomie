# Le démonstrateur (`app/`)

> Document de connaissance. Maintenu en Français, guillemets droits. À jour le 2026-06-18.
> Décrit l'état réel de l'interface scriptée présentée au jury. Rien ici n'est la vraie app
> (voir la distinction cible / démonstrateur dans le CLAUDE.md, section 1).

---

## 1. Navigation et présentation

Navigation par **onglets** en haut de page (barre sticky dans `app/src/App.tsx`), un onglet par
écran, dans l'ordre de présentation, la démo vocale étant le cœur de l'offre :
`Accueil · Le problème · Assistant vocal · Espace aidant · Parcours guidé · Le défi technique ·
Notre solution`. Navigation par état en mémoire (`useState<Vue>`), sans routing serveur ni librairie.
Un **lien direct** vers un onglet reste possible via le hash (`#vocal`) ou le paramètre (`?vue=vocal`),
lu au chargement et synchronisé à chaque changement d'onglet (boutons précédent / suivant suivis).
Type des vues dans `app/src/lib/vue.ts` : `accueil | assure | aidant | vocal | labyrinthe | defi | solution`.

Les écrans qui montrent la future app sont pensés **plein écran paysage** pour la projection
(largeur `max-w-projection`, token Tailwind).

| Écran (onglet) | Fichier | Rôle |
|---|---|---|
| Accueil | `screens/Accueil.tsx` | Vitrine publique : hero « La technologie au service de nos aînés », le drame (vraies stats), la solution, la souveraineté, la transparence |
| Le problème | `screens/Labyrinthe.tsx` | ≈ 28 dispositifs, niveaux de certitude, fond de dédale |
| Assistant vocal | `screens/AssistantVocal.tsx` | **Étape de cadrage** (que cherche la personne ?), puis **deux branches jouées jusqu'au bout** : « renseignement » (une question sur une aide locale, l'adaptation du logement, avec **recherche locale visible** puis mise en relation) ou « labyrinthe » (4 questions, moteur, APA + ASPA, mise en relation). La mise en relation propose le canal (fiche d'appel ou mail envoyé par le service après consentement) |
| Espace aidant | `screens/EspaceAidant.tsx` | Tableau de bord d'un proche qui pilote les aides d'un aîné (Jeanne, 84 ans) |
| Parcours guidé | `screens/ParcoursAssure.tsx` | 4 questions au clic → étape moteur → restitution APA + ASPA |
| Le défi technique | `screens/DefiTechnique.tsx` | Page décideurs : le problème vu côté technique (jungle d'acteurs, multiplicité des API et jeux de données, couches de certitude, risque d'inventer un montant). Vrais chiffres du catalogue |
| Notre solution | `screens/SolutionTechnique.tsx` | Page décideurs : briques publiques assemblées (OpenFisca calcule, l'assistant oriente, souveraineté Albert, conformité IA Act) |

## 2. Le garde-fou matérialisé

Le calcul est isolé dans `app/src/lib/moteur.ts`, séparé de la conversation. Ce module joue
le rôle d'OpenFisca dans le démonstrateur : montants codés en dur, déterministes, respectant
le **même contrat** que l'outil `calculer_droits` de la cible. Une **étape moteur visible**
à l'écran rend lisible que le montant vient du moteur, pas de l'assistant.

Cohérence : le profil de Jeanne (domicile, autonomie partielle, revenus faibles, seule) donne
**APA ≈ 1 000 €/mois + ASPA 162 €/mois** de façon identique dans le parcours, le vocal et le
tableau de bord aidant. Tous les chiffres sortent du même moteur.

## 3. Données mock

| Fichier | Contenu |
|---|---|
| `data/questions.ts` | Script du parcours au clic (4 questions FALC) |
| `data/dialogueVocal.ts` | Script vocal empathique branche labyrinthe (question + dictée + réassurance + confirmation) |
| `data/renseignementLocal.ts` | Branche renseignement : cadrage, question sur l'adaptation du logement, étapes de recherche locale, pistes au conditionnel, contact France Services / CCAS |
| `data/aidant.ts` | 8 aides du tableau de bord aidant (statut, régime, montant, prochaine action) |
| `data/labyrinthe.ts` | Catalogue complet des ≈ 28 dispositifs (domaine, gestionnaire, source, certitude) |
| `data/miseEnRelation.ts` | Guichets fictifs façon DILA, type `Contact`, fiche d'appel, gabarit de mail minimisé, adresse de service |

## 4. Charte graphique

Inspirée du simulateur **URSSAF / mon-entreprise** (beta.gouv), recalée sur capture du site,
puis **adaptée à un public âgé** (contraste et taille renforcés). Tokens dans
`app/tailwind.config.js`, namespace `etat-*` plus accents.

| Rôle | Hex |
|---|---|
| Primaire (bleu roi URSSAF) | `#1E3D8E` |
| Survol | `#16306F` |
| Bleu doux (fonds) | `#DEE6F7` |
| Texte principal (bleu marine) | `#1D2B5C` |
| Texte secondaire | `#4A5578` |
| Bordures | `#D6DCEA` |
| Fond de page | `#F6F8FC` |
| Accent turquoise | `#1AA3B5` |
| Accent or (encadrés) | `#C2912A` / fond `#FBF4D0` |
| Accent rose (décor) | `#E07BA6` |
| Vert « fiable » / Ambre « estimation » | `#18753C` / `#B34000` (conservés, calés RGAA) |

Adaptation senior : corps de texte **18 px**, interligne **1,65**, titres en bleu roi, focus
très visible, cartes à coins arrondis et ombre douce. Décor géométrique (arcs et cercles or,
rose, turquoise) via `components/Decor.tsx`. Quelques emojis comme marqueurs sobres.

## 5. Ton d'écriture (non négociable pour la cible âgée)

Tout texte usager suit quatre principes (voir `docs/analyse-parcours-zenior.md`, section 6) :
recevoir l'émotion, expliquer le pourquoi, rassurer en continu, confirmer avec des mots
humains. Des bulles de réassurance accompagnent les questions sensibles.

## 6. Règles anti-effet démo (toujours valides)

1. 100 % client-side, aucun backend, aucune base, aucune auth.
2. Zéro appel réseau au runtime (polices système, pas de CDN, pas d'analytics).
3. Comportement scripté déterministe. Pas de vrai LLM ni de vrai OpenFisca dans `app/`.
4. Buildable en un seul `index.html` (`vite-plugin-singlefile`), ouvrable en double-clic.
5. Bannière « Démonstrateur, données fictives » persistante.
6. Accessibilité : gros texte, fort contraste, focus visible (cap RGAA, public âgé).

## 7. Lancer et construire

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # app/dist/index.html (single-file, ≈ 280 kB)
```
