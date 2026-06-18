# ADR-0003 — LLM souverain pour le traitement des données usagers

Statut : accepté

## Contexte

Le parcours collecte des données de santé (niveau de dépendance, état d'autonomie). Le choix du fournisseur de LLM engage la conformité.

## Décision

Le LLM orchestrateur est souverain : Albert API (socle DINUM) ou Assistant IA fondé sur Mistral, hébergé en SecNumCloud. Les API de LLM hébergées hors UE sont écartées pour le traitement des données usagers.

## Justification

- Données de santé (RGPD art. 9) plus posture de service public imposent que les données ne quittent pas un périmètre de confiance national.
- L'État propose un socle souverain (Albert API) et une offre fondée sur Mistral en SecNumCloud, conformes RGPD et IA Act.
- Réduit l'exposition aux législations extraterritoriales.

## Nuances

- Le chatbot Albert grand public n'a pas été généralisé dans sa forme initiale ; c'est l'API et le socle interministériel qui sont pérennes. À surveiller, sujet mouvant en 2026.
- Pour un prototype scolaire hors données réelles, un autre modèle peut servir au développement, mais la cible de production reste souveraine. À documenter clairement dans la démo.

## Conséquences

- Le contrat de l'outil `calculer_droits` est indépendant du modèle : changer de LLM ne change pas l'architecture.
- Prévoir une abstraction fournisseur pour ne pas se lier à un modèle précis.
