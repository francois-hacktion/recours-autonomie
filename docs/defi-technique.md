# Le défi technique : pourquoi personne ne l'a fait jusqu'ici

> Document cible. Maintenu en Français, guillemets droits. À jour le 2026-06-18.
> Audience : décideurs non techniciens. Objectif : faire comprendre que le problème
> n'est pas un manque de volonté politique, mais une réalité d'intégration que peu
> ont regardée en face.

---

## Le point de départ : une aide ne se calcule pas seule

Calculer un droit social pour une personne âgée, c'est combiner des informations qui viennent
de sources différentes, gérées par des acteurs différents, selon des règles différentes. La
complexité n'est pas dans une seule aide, elle est dans leur coexistence.

Selon le contexte d'une personne, les interlocuteurs sont : son conseil départemental (pour
l'APA), sa caisse de retraite (ASPA, ASI, actions sociales Carsat), la CAF ou la MSA (APL, ALS,
CSS), l'Anah (adaptation du logement), le fisc (crédit d'impôt emploi à domicile), et
potentiellement le CCAS de sa commune pour des aides locales. Soit de 3 à 6 acteurs distincts
pour une seule personne, chacun avec ses propres règles d'attribution, ses propres formulaires,
ses propres délais.

C'est avant même d'ouvrir une seule ligne de code.

---

## La multiplicité des données et des API

### Ce qui est centralisé et calculable (environ 18 dispositifs)

Un moteur de calcul de règles nommé **OpenFisca** (moteur de règles public, maintenu par l'État
français) modélise les aides dont le montant suit une formule nationale : ASPA, APA à domicile
et en établissement, APL, CSS, crédit d'impôt emploi à domicile. Cela couvre un noyau solide.

Mais même pour ces aides, les données nécessaires au calcul ne viennent pas toutes d'une seule
source. Le GIR (niveau de dépendance) est évalué par une équipe médico-sociale envoyée par le
conseil départemental : il n'existe dans aucune base nationale centralisée. Le plan d'aide APA
est instruit par le département. Sans ces intrants, le moteur national ne peut pas calculer.

### Ce qui est décrit mais non calculable (environ 6 dispositifs)

Pour l'aide sociale à l'hébergement (ASH), l'aide-ménagère, l'action sociale des caisses de
retraite, MaPrimeAdapt' ou l'allocation veuvage : des fiches existent sur service-public.fr,
elles décrivent les conditions générales, mais l'attribution se fait sur dossier local. Chaque
conseil départemental, chaque caisse, a son propre barème. Il n'y a pas d'API pour obtenir le
montant applicable à telle personne dans tel département.

### Ce qui n'existe dans aucune base nationale (environ 3 catégories majeures)

Les aides extralégales départementales (au-delà du socle légal), les aides communales et les
aides des CCAS (environ 35 000 communes, chacune avec ses propres dispositifs), et l'action
sociale des retraites complémentaires Agirc-Arrco : aucun de ces dispositifs n'est centralisé
dans une base nationale, accessible via une API publique, ni calculable par un moteur commun.

C'est précisément là que se concentre le principal gisement de non-recours. Et c'est précisément
pour cela que personne ne l'a résolu : il n'y a rien à "brancher", il faut construire une
logique d'orientation vers des acteurs humains locaux.

---

## Les quatre couches de certitude du catalogue

Le catalogue du projet recense environ 28 dispositifs, répartis en quatre niveaux :

| Niveau | Exemples | Ce que ça implique techniquement |
|---|---|---|
| Calculé automatiquement | ASPA, APA, APL, CSS | Appel à OpenFisca avec les bons intrants, résultat déterministe |
| Évaluation requise | GIR, plan d'aide APA | L'intrant n'existe pas en base nationale, il faut un proxy ou une évaluation terrain |
| Décrit, au cas par cas | ASH, aide-ménagère, MaPrimeAdapt' | Décrire les conditions, orienter vers le guichet local, ne jamais inventer un montant |
| Hors de tout moteur | Aides CCAS, aides extralégales, Agirc-Arrco | Orientation vers un guichet humain, via l'annuaire officiel (DILA) |

Intégrer un service d'accès aux droits, c'est construire une logique différente pour chacun
de ces quatre niveaux, et les enchaîner de façon cohérente dans un seul parcours.

---

## Pourquoi personne ne l'a fait jusqu'ici

Trois raisons s'accumulent.

**Première raison : la fragmentation des acteurs.** L'APA relève des conseils départementaux,
l'ASPA des caisses de retraite, l'APL de la CAF ou de la MSA, les aides locales des communes.
Aucun de ces acteurs n'a ni la légitimité ni le périmètre pour orchestrer l'ensemble. La CNSA
coordonne, elle ne calcule pas pour les autres.

**Deuxième raison : le gisement principal est hors de toute API.** Les aides communales et
extralégales, qui représentent souvent la différence entre rester à domicile et ne pas pouvoir
le financer, ne sont accessibles que via des contacts humains locaux. Tout outil qui se limite
aux aides calculables nationalement manque la partie la plus opaque du problème.

**Troisième raison : le risque d'hallucination chiffrée.** Utiliser un assistant conversationnel
seul, sans le séparer d'un moteur de règles, produit des montants inventés. Sur un public
vulnérable, une estimation fausse génère un préjudice réel, qu'il s'agisse d'espoir déçu ou
de renonciation à une aide réelle. C'est aussi une exposition directe à l'IA Act (système à
haut risque, annexe III). La plupart des acteurs qui ont essayé ont soit évité le problème en
restant sur de l'information générale (sans montant), soit produit des montants non garantis.

Assembler ces briques de façon robuste, souveraine, et conforme n'est pas hors de portée. Mais
cela demande une architecture pensée pour ça dès le départ, pas un chatbot ajouté sur des
fiches d'information existantes.
