# Roadmap et indicateurs

À ranger dans `docs/`. Cette fiche cadre la trajectoire du projet selon les standards beta.gouv (quatre phases, comités d'investissement), situe l'état d'avancement, et fixe les indicateurs de pilotage. Elle sert d'appui à la présentation de fin d'investigation.

## Cadre beta.gouv

Le programme structure un service public numérique en quatre phases, dont les passages se décident en comité d'investissement sur faits et chiffres d'usage :

- Investigation (environ 3 mois) : valider le problème et l'opportunité d'investir.
- Construction (souvent moins de 18 mois) : produire une première solution minimale, l'expérimenter et vérifier son utilité réelle sur le terrain avec de premiers usagers.
- Accélération : étendre les fonctionnalités, élargir le périmètre, déployer.
- Pérennisation : transférer le service vers une structure d'accueil durable.

Incubateur naturel pour ce sujet : la Fabrique Numérique des ministères sociaux (périmètre Solidarités et Autonomie).

## Point d'attention sur le positionnement

Le test sur deux départements relève de la Construction, pas de l'Accélération. La demande portée au comité n'est donc pas « passer à l'échelle » mais « construire et prouver l'utilité réelle sur deux terrains restreints ». Ce cadrage est plus solide et plus fidèle au standard : on ne promet pas le national, on promet une preuve terrain mesurable.

## Roadmap

### Phase 1 — Investigation (faite)
Problème du non-recours validé (plus de 30 % selon la DREES), opportunité démontrée, démonstrateur fonctionnel couvrant les deux régimes d'aide (calcul national fiable et estimation départementale). C'est l'objet de la présentation.

Livrables produits : cadrage et spec technique, architecture en trois couches, démonstrateur sur APA à domicile et ASPA, fiches de conformité et de souveraineté.

### Phase 2 — Construction (objet de la validation demandée)
Ce que le comité doit débloquer :
- accès à Albert API (avec validation du function-calling),
- deux départements pilotes engagés comme sponsors terrain,
- test grandeur réelle avec de vrais usagers.

Objectif : prouver que le service transforme une simulation en recours effectif, de façon fiable et accessible. Sortie : comité d'investissement décidant le passage en accélération sur la base des chiffres du pilote.

### Phase 3 — Accélération
Extension à d'autres départements puis cible nationale, négociation de quotas Albert étendus, candidature au FAST. Critères d'entrée beta.gouv : produit open source conforme aux standards, impact mesuré chiffré et public prouvant de premiers utilisateurs satisfaits, et volonté de l'administration porteuse de passer à l'échelle avec une stratégie de déploiement et des moyens dédiés. Le FAST cofinance à 50 %, dans la limite de 300 000 euros.

### Phase 4 — Pérennisation
Transfert vers une structure d'accueil durable, typiquement la CNSA ou un opérateur de l'autonomie, avec un budget d'exploitation pérennisé.

## Facteurs clés de succès de la phase de Construction

1. Engagement réel des deux conseils départementaux comme sponsors terrain. C'est le facteur structurant : sans eux, pas d'accès aux usagers, pas de canal de mise en relation, et surtout pas de boucle de retour pour savoir si une démarche a abouti à un droit ouvert. Cette boucle conditionne la mesure de l'impact. À sécuriser par écrit avant la présentation.
2. Accès Albert effectif avec function-calling validé, pivot technique de l'architecture.
3. Fiabilité du calcul sur le terrain, parce qu'une estimation fausse détruit la confiance et aggrave le non-recours. C'est la traduction concrète du garde-fou « le LLM ne calcule jamais ».
4. Adoption par le public âgé, via l'accessibilité et la FALC.

## Indicateurs : un impact, deux leviers

beta.gouv valorise une métrique d'impact unique et claire. En présenter une bien définie est différenciant, puisque seul un tiers environ des startups en accélération en disposent.

### Indicateur d'impact (le Nord)
Taux de passage à l'acte : part des simulations qui aboutissent à une démarche effectivement engagée auprès d'un guichet via le service (mail envoyé ou appel passé).

Honnêteté à assumer devant le comité : le droit réellement ouvert est l'impact ultime, mais son instruction prend plusieurs mois côté département. Sur une construction courte, le passage à l'acte est le proxy actionnable, à jumeler avec les droits confirmés que les deux départements remonteront.

### Levier 1 — Fiabilité
Taux de concordance entre l'estimation du service et la décision réelle du guichet sur les dossiers suivis, avec zéro montant erroné détecté. Mesure directe du garde-fou de calcul.

### Levier 2 — Adoption
Taux de complétion du parcours par les usagers âgés, proxy de l'accessibilité réelle et de la qualité FALC.

## OKR de la phase Construction

Objectif : prouver sur deux départements que le service convertit une simulation en recours effectif, de façon fiable et accessible.

- KR1, passage à l'acte : un pourcentage cible d'usagers engagent une démarche après simulation.
- KR2, impact réel : un nombre de droits effectivement ouverts, confirmés par les deux départements sur la période, même modeste.
- KR3, fiabilité : zéro montant erroné ou halluciné sur les dossiers audités.

Les cibles chiffrées sont à fixer avec les deux départements pilotes au lancement de la phase, en fonction du volume d'usagers accessible.

## Distinction de pilotage

Les leviers et le passage à l'acte sont des KPI suivis en continu pendant le pilote. L'OKR cadre l'objectif de la phase et se rend au comité d'investissement de fin de construction. La règle beta.gouv reste la sobriété : un indicateur d'impact, pas un tableau de bord qui dilue l'attention.

## Références

- Phases, durées et critères : beta.gouv.fr (bilan 2025, pages méthode et FAST), institution.
- Cofinancement FAST et indicateurs de performance : PLF programme 352, budget.gouv.fr, source primaire.
- Cadre général : numerique.gouv.fr, institution.
