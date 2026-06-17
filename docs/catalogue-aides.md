# Catalogue des aides aux personnes âgées

> Document de connaissance. Maintenu en Français, guillemets droits. À jour le 2026-06-17.
> Recensement de référence : ce qui est calculable, descriptible ou hors de portée d'une
> API publique. Source de calcul vérifiée : OpenFisca-France (inspection d'instance).

---

## 1. Synthèse

- **≈ 28 dispositifs recensés**, répartis en 4 niveaux de certitude.
- **Deux régimes structurants** : aides à barème **national calculable** (ASPA, APL…) et
  aides **départementales ou sur dossier** nécessitant des intrants locaux (APA, ASH…).
- Le démonstrateur cible **APA à domicile** et **ASPA**, car elles illustrent ces deux régimes.
- Le principal **gisement de non-recours** est la catégorie C (aides locales non centralisées),
  qu'aucun acteur, public ou privé, ne calcule réellement.

Niveaux de certitude (repris dans l'écran « Labyrinthe » du démonstrateur,
`app/src/data/labyrinthe.ts`) :

| Niveau | Sens |
|---|---|
| ✅ Calculé automatiquement | barème national, calculé par formule (OpenFisca) |
| 🟡 Évaluation requise | entrée à fournir (évaluation départementale : GIR, plan d'aide…) |
| 🟠 Décrit, au cas par cas | descriptible via open data mais attribué sur dossier / barème local |
| ⬛ Hors de tout moteur | non centralisé, hors de toute API publique calculable |

---

## 2. Catégorie A — Aides CALCULABLES via API publique (OpenFisca) — le noyau du produit

### Ressources / minimum vieillesse
| Aide | Variable OpenFisca | Statut |
|---|---|---|
| ASPA (minimum vieillesse) | `aspa` | ✅ calculée |
| ASI (allocation supplémentaire d'invalidité) | `asi` | ✅ calculée |
| Minimum vieillesse (agrégat ASI + ASPA) | `minimum_vieillesse` | ✅ calculée |

### Dépendance / autonomie
| Aide | Variable OpenFisca | Statut |
|---|---|---|
| APA à domicile | `apa_domicile` | ✅ calculée |
| APA en établissement | `apa_etablissement` | ✅ calculée |
| APA d'urgence (domicile / institution) | `apa_urgence_*` | ✅ calculée |
| GIR (niveau de dépendance) | `gir` | 🟡 entrée (évaluation départementale) |
| Plan d'aide à domicile | `dependance_plan_aide_domicile` | 🟡 entrée |
| Tarifs dépendance établissement par GIR | `dependance_tarif_etablissement_*` | 🟡 entrée |
| PCH (au-delà de 60 ans si déjà bénéficiaire) | `pch` | 🟡 entrée (non calculée) |

### Logement
| Aide | Variable OpenFisca | Statut |
|---|---|---|
| Aide personnalisée au logement (APL) | `apl` | ✅ calculée |
| Allocation de logement sociale (ALS) | `als` | ✅ calculée |
| Allocation de logement familiale (ALF) | `alf` | ✅ calculée |
| Aide au logement en logement-foyer / résidence autonomie | `aides_logement_foyer_*` | ✅ calculée |
| Loca-Pass (avance / caution, marginal seniors) | `locapass_eligibilite` | ✅ calculée |

### Santé
| Aide | Variable OpenFisca | Statut |
|---|---|---|
| Complémentaire santé solidaire (CSS) | `css_*`, `cmu_c` | ✅ calculée |
| ACS (historique, intégrée à la CSS) | `acs` | ✅ calculée |

### Fiscal
| Aide | Variable OpenFisca | Statut |
|---|---|---|
| Crédit d'impôt emploi salarié à domicile | `ci_saldom` | ✅ calculée |
| Réduction d'impôt emploi salarié à domicile | `ri_saldom` | ✅ calculée |

---

## 3. Catégorie B — Aides DESCRIPTIBLES (open data service-public.fr) mais NON calculables par formule nationale

| Aide | Gestionnaire | Pourquoi non calculable |
|---|---|---|
| ASH (aide sociale à l'hébergement) | Conseil départemental | Barème local, récupération succession, obligation alimentaire |
| Aide-ménagère (aide sociale) | Conseil départemental | Attribution sur dossier |
| Action sociale des caisses de retraite (ex-ARDH, kits prévention) | Carsat / caisses | Barèmes propres à chaque caisse |
| Allocation veuvage | Caisse de retraite | Absente d'OpenFisca |
| MaPrimeAdapt' (adaptation du logement) | Anah | Sur dossier, barème national hors OpenFisca |
| Réduction d'impôt frais d'hébergement EHPAD | Fiscal | Non vue dans l'inspection, à confirmer |

---

## 4. Catégorie C — Hors de toute API publique calculable

- Aides extralégales départementales (au-delà du socle légal).
- Aides communales / CCAS (variables selon les ~35 000 communes).
- Aides des retraites complémentaires (Agirc-Arrco, action sociale).

> Des dizaines de dispositifs locaux, non centralisés, non calculables par un moteur
> national. C'est précisément le principal gisement de non-recours, et aucun acteur (public
> ou privé, Zenior compris) ne le calcule réellement. Notre rôle : calculer le noyau et
> **orienter vers le bon guichet** pour le reste.

---

## 5. Catégorie D — Données d'offre (data.gouv.fr / CNSA) — pas des aides

Annuaires EHPAD, résidences autonomie, SAAD, SSIAD, points d'information, départements.
Servent à résoudre le **bon guichet**, pas à calculer un droit.

---

## 6. Sources de référence (existant public à réutiliser)

| Brique | Source |
|---|---|
| Calcul | **OpenFisca-France** (moteur de règles déterministe, API web publique) — source de vérité des montants |
| Catalogue | pattern `betagouv/aides-jeunes` (une aide = un YAML, mappé à OpenFisca + fiche service-public) |
| Connaissance | open data **service-public.fr** (DILA), portail **pour-les-personnes-agees.gouv.fr** |
| Offre (où déposer) | open data **CNSA** sur **data.gouv.fr** |
| LLM (cible) | **Albert API** (DINUM, souverain) ou **Mistral EU** (dev, compatible OpenAI) |

### Réserves techniques vérifiées (à porter dans les ADR)

- Formule APA gelée à la réforme ASV (2016) : barèmes 2026 à auditer avant d'afficher un montant en cible.
- `gir` et `dependance_plan_aide_domicile` sont des **entrées** (évaluation départementale), pas calculées : limite départementale réelle, traitée en intrant.
- ASPA : calcul national, sans intrant départemental. Cas simple et fiable.
- Montants, plafonds et conditions chiffrées : sujet évolutif, à vérifier sur les barèmes de l'année.
