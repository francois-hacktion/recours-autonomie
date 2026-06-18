# Schéma des fiches aides — Catalogue Recours Autonomie

Une fiche YAML par aide. Logique « skill » : chaque fiche est autoportante et
porte un en-tête `skill` (name + description) qui sert au moteur à déclencher la
bonne aide, comme le frontmatter d'une skill déclenche une compétence.

## Structure canonique

```yaml
# Fiche aide — <NOM>
# Catalogue Recours Autonomie · une fiche par aide (logique skill)

skill:
  name: <id_technique>                 # identifiant court, snake_case
  description: >                       # quand déclencher cette fiche (profil, besoin, mots-clés)
    Déclencher pour <profil/besoin>. Mots-clés : <...>.
  domaine: <Ressources|Dépendance|Logement|Santé|Fiscal|Hébergement|Local>
  certitude: <auto|evaluation|cas_par_cas|non_centralise>

id: <id_technique>
libelle: "<libellé complet officiel>"
gestionnaire: <departemental|national|caisse_retraite|caf_msa|assurance_maladie|fiscal|anah|action_logement|ccas|...>
fiabilite: <barème_national_calcule|estimation_departementale|soumis_evaluation|cas_par_cas|non_centralise>

resume_falc: >                         # 2-3 phrases FALC (facile à lire et comprendre)
  ...

conditions:                            # conditions d'éligibilité, en FALC
  - "..."

requires:                              # données à collecter auprès de l'usager
  - champ: <nom_champ>
    question_falc: "..."
    type: <date|enum|montant_mensuel|booleen|texte>
    valeurs: [...]                     # si enum
    si_inconnu: <estimer|bloquer|ignorer>   # optionnel
    note: >                            # optionnel
      ...

openfisca:                             # mapping moteur de droits, ou `null` si absente d'OpenFisca
  sortie: <variable_openfisca>
  eligibilite: <variable_ou_null>
  base_ressources: <variable_ou_null>
  participation: <variable_ou_null>
  entrees: [<...>]

demarche:
  ou: "<guichet>"
  comment: "<comment déposer>"
  resolution_guichet: "<comment trouver le bon guichet local si besoin>"
  lien_fiche: "<URL service-public.fr VÉRIFIÉE, ou 'à vérifier : <piste>'>"

avertissements:                        # paramètres à revérifier, limites, pièges
  - "..."

sources:                               # hiérarchisées : méta-étude > institution > presse spé > ...
  - niveau: <institution|presse_specialisee|...>
    ref: "<source + date de consultation>"
```

## Règles qualité (non négociables)

1. Aucun paramètre chiffré (plafond, taux, âge) sans source institutionnelle et année.
   Si la valeur n'est pas certifiée à jour : la marquer `# à vérifier <année>`.
2. `lien_fiche` : seulement une URL service-public.fr ou officielle effectivement
   vérifiée. Sinon `"à vérifier : <requête>"`.
3. Si l'aide n'est pas dans OpenFisca : `openfisca: null` + avertissement explicite.
4. Distinguer fait national stable vs paramètre local variable (département, CCAS, caisse).
5. Vocabulaire `certitude` aligné sur la cartographie du démonstrateur.

## Vocabulaire `fiabilite` ↔ `certitude`

| certitude (cartographie) | fiabilite (fiche) | sens |
|---|---|---|
| auto | barème_national_calcule | calculable nationalement |
| evaluation | soumis_evaluation | dépend d'une évaluation (GIR, MDPH) |
| cas_par_cas | cas_par_cas | barèmes propres au guichet |
| non_centralise | non_centralise | aides locales non centralisées |
