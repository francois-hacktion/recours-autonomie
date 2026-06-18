# Notre solution technique : des briques publiques, assemblées proprement

> Document cible. Maintenu en Français, guillemets droits. À jour le 2026-06-18.
> Audience : décideurs non techniciens. Objectif : expliquer comment on répond au défi
> décrit dans `docs/defi-technique.md`, sans jargon, avec les noms des outils publics
> sur lesquels on s'appuie.

---

## Le principe directeur

Le moteur calcule. L'assistant oriente. Les deux ne font jamais le travail de l'autre.

Tout montant affiché à la personne sort d'un moteur de règles déterministe : OpenFisca-France,
un outil public maintenu par l'État, dont la formule de calcul est consultable et auditable par
n'importe qui. L'assistant conversationnel ne produit aucun chiffre. Son rôle est de poser les
bonnes questions pour alimenter le moteur, de vulgariser le résultat en langage simple, et
d'orienter vers le bon guichet pour ce que le moteur national ne peut pas calculer.

Cette séparation n'est pas un détail technique. C'est la garantie que le service ne peut pas
inventer un droit, même en cas de panne partielle, même si le modèle de langage dérive.

---

## Les quatre briques de l'architecture

### 1. OpenFisca : le moteur qui calcule

OpenFisca-France est un moteur de calcul de règles ouvert, maintenu par des administrations
publiques (DINUM, DNLF, chercheurs). Il modélise le droit social français sous forme de formules
vérifiables : ASPA (minimum vieillesse), APA à domicile et en établissement, APL, CSS, crédit
d'impôt emploi à domicile. Pour chacune de ces aides, il suffit de lui fournir les bonnes données
d'entrée (composition du foyer, ressources, niveau d'autonomie, département) pour obtenir un
montant calculé selon la règle en vigueur.

Ce que le moteur garantit : un résultat identique pour un profil identique, à tout moment, sans
jamais inventer. Ce que le moteur ne fait pas : collecter lui-même les données. C'est le rôle
de l'assistant.

### 2. L'assistant conversationnel : il collecte, vulgarise, oriente

L'assistant (le modèle de langage) conduit un dialogue en langage naturel pour collecter les
informations nécessaires au calcul : la situation de résidence, le niveau d'autonomie, les
ressources mensuelles, la composition du foyer. Il pose ces questions en FALC (Facile à Lire
et à Comprendre), avec réassurance et sans jargon.

Une fois les données collectées, il appelle le moteur. Le moteur répond. L'assistant vulgarise
le résultat : "Voici ce à quoi vous avez probablement droit, voici les prochaines étapes."
Il ne reformule pas le chiffre, il le restitue tel que calculé, avec le niveau de certitude
qui correspond (montant national fiable, ou estimation à confirmer par le département).

Pour les aides que le moteur national ne calcule pas (aides communales, extralégales, action
sociale des caisses), l'assistant ne tente pas d'inventer un résultat. Il signale la piste et
passe à l'étape suivante : la mise en relation avec le bon guichet.

### 3. L'annuaire officiel (API DILA) : il résout le bon guichet

La mise en relation repose sur l'API Annuaire de l'administration et des services publics,
fournie par la DILA (Direction de l'information légale et administrative). Elle référence les
CCAS (centres communaux d'action sociale), les mairies, les conseils départementaux, les
points d'information sur l'autonomie (CLIC, maisons de l'autonomie), et les France Services,
avec coordonnées et horaires.

L'assistant prépare un livrable de contact : soit une fiche d'appel (numéros, horaires, phrase
d'ouverture prête à dire), soit un message que le service peut envoyer au guichet au nom de la
personne, avec son accord explicite. Ce message est strictement minimisé : pas de données de
santé, pas de montants, pas de GIR. Juste l'identité, la commune, la nature générale du besoin,
et les coordonnées pour être rappelé.

L'assistant n'invente jamais une adresse ou un numéro. Si une coordonnée manque dans l'annuaire,
il le dit.

### 4. Les modèles souverains (Albert API, DINUM) : les données restent en France

Le modèle de langage utilisé est hébergé sur l'infrastructure Albert API de la DINUM, sur des
serveurs qualifiés SecNumCloud en France. Les données de la personne (niveau de dépendance,
ressources) ne quittent pas le territoire et ne sont pas transmises aux fournisseurs des modèles.

Ce point est non négociable : un service qui traite des données de santé (le niveau de dépendance
relève de l'article 9 du RGPD) ne peut pas envoyer ces données à un fournisseur de cloud
américain ou à un modèle dont le prestataire est hors UE.

---

## Pourquoi c'est robuste et conforme

**Conformité RGPD article 9.** Les données de santé (GIR, état de dépendance) sont traitées à
la volée, uniquement pour le calcul, sans stockage par défaut. L'assistant ne reçoit que ce
dont il a besoin. Le livrable de mise en relation ne contient aucune donnée sensible.

**Conformité IA Act annexe III.** Un système d'accès aux prestations sociales est classé à haut
risque. Les trois exigences de l'annexe III sont couvertes par construction : la traçabilité
(le catalogue d'aides est versionné, chaque appel au moteur est traçable), l'explicabilité
(le montant sort d'une formule auditable dans OpenFisca, pas d'une génération), la supervision
humaine (l'orientation vers un guichet humain est systématique pour tout ce que le moteur ne
calcule pas, et la décision d'attribution reste humaine dans tous les cas).

**Pas de fine-tuning.** Le modèle de langage n'est pas entraîné sur des données métier. Un modèle
entraîné déplacerait du raisonnement dans un poids opaque : on ne pourrait plus auditer d'où
vient une réponse. Le raisonnement métier reste dans OpenFisca et dans le catalogue YAML
versionné, pas dans les poids du modèle.

**Pas de verrouillage fournisseur.** Le code ne connaît pas l'URL du fournisseur LLM. Il passe
par une abstraction paramétrable : en développement, Mistral EU ; en production, Albert API.
Basculer d'un fournisseur à l'autre ne demande que deux variables d'environnement. Si Albert API
disparaissait ou devenait indisponible, le service pourrait basculer sur un autre fournisseur
compatible sans toucher au code.

---

## Ce qu'on n'a pas réinventé

OpenFisca-France existe et modélise les aides prioritaires. Le pattern d'un catalogue d'aides
en YAML (une aide, une fiche, une source) est celui de "Aides Jeunes" (beta.gouv.fr). Les
fiches service-public.fr (DILA) couvrent les aides descriptibles. L'annuaire DILA couvre les
guichets. Albert API couvre l'infrastructure souveraine.

Notre apport : assembler ces briques pour un public âgé, avec la séparation stricte entre le
moteur et l'assistant, et construire la logique d'orientation pour les deux tiers d'aides que
personne ne calcule.
