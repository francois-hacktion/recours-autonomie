# Conduite du changement : du démonstrateur au pilote réel

> Document cible. Maintenu en Français, guillemets droits. À jour le 2026-06-18.
> Décrit ce qu'il faut débloquer pour passer de l'interface scriptée à un service
> réellement déployé. Rien ici ne porte sur le démonstrateur `app/`.

---

## 1. Accès à Albert API : la condition institutionnelle

### Ce qu'est Albert API

Albert API est l'infrastructure d'inférence souveraine de la DINUM (Délégation interministérielle
au numérique). Elle expose des modèles open weight hébergés sur territoire français (SecNumCloud),
via une interface compatible OpenAI. L'inférence est gratuite pour les porteurs publics, les
données ne quittent pas le territoire et ne sont pas transmises aux fournisseurs des modèles.

### Le verrou à lever

L'accès à Albert API est conditionné à une **administration porteuse**. C'est une restriction
sur le porteur du produit, pas sur l'utilisateur final : un service grand public porté par une
administration publique (conseil départemental, CNSA, opérateur de l'État) est éligible. Un
projet scolaire ou une startup sans partenaire public n'y a pas accès directement.

Pour lever ce verrou, il faut donc :

1. Identifier une administration volontaire pour porter le service en co-construction.
2. Prendre contact avec la DINUM (beta.gouv.fr, bureau Albert API).
3. Faire une demande d'accès au nom de l'administration porteuse.
4. Valider en priorité le function-calling sur l'instance Albert : c'est le pivot de
   l'architecture. Si le LLM ne peut pas appeler `calculer_droits` de façon fiable et
   s'abstenir d'inventer un montant en l'absence de réponse du moteur, toute l'architecture
   tombe. Ce test passe avant tout autre engagement.

### Le repli pendant l'instruction

En attendant l'accès Albert, la Plateforme Mistral EU joue le même rôle. Elle expose le même
formalisme OpenAI, les mêmes modèles (Mistral Small 3.2), et reste dans le périmètre de
confiance pour le développement. Le basculement dev vers prod se fait en changeant deux
variables d'environnement (URL de base, clé) : c'est une contrainte d'architecture inscrite
dès le départ pour éviter tout verrouillage fournisseur.

Le repli Mistral EU introduit un coût d'inférence que Albert n'a pas. Pour calibrer le business
plan, conserver le chiffrage Mistral EU comme borne haute du coût réel d'inférence, jusqu'à
publication du bilan Albert par la DINUM (attendu été 2026).

---

## 2. Départements pilotes

### Combien

Démarrer avec **1 à 3 départements** (ordre de grandeur à confirmer avec le sponsor). Un seul
département suffit pour les premières semaines de terrain. L'élargissement à 2 ou 3 simultanés
n'apporte de valeur que si les équipes terrain sont dimensionnées pour l'accompagnement.

### Critères de choix

Un département pilote crédible réunit idéalement :

- Un service autonomie (direction PA ou équivalent) moteur, avec un directeur ou chef de service
  identifié comme sponsor interne.
- Une taille moyenne (entre 500 000 et 1,5 million d'habitants), ni trop petite pour manquer
  de volume, ni trop grande pour rendre le pilotage ingérable.
- Une couverture CCAS assez dense, pour que le canal "mise en relation via annuaire DILA" soit
  immédiatement opérationnel sur le territoire.
- Une appétence pour l'expérimentation numérique (présence de services numériques, expériences
  beta.gouv ou équivalentes bienvenues).

La fracture numérique et le taux de non-recours élevé sont des facteurs qui renforcent l'intérêt,
pas des obstacles. C'est précisément là où le service a le plus d'impact.

### Ce qu'on demande au département

Trois types de contributions :

1. **Données** : accès aux données d'offre locales (liste CCAS, CLIC, maisons de l'autonomie,
   SSIAD, résidences autonomie) pour enrichir l'annuaire DILA et fiabiliser la mise en relation.
   Aucune donnée individuelle sur les bénéficiaires n'est nécessaire au démarrage.
2. **Accès guichets** : identification de référents dans les CCAS et au conseil départemental
   (équipe APA), pour valider les parcours utilisateurs et mesurer la qualité des orientations.
3. **Référents terrain** : un ou deux agents désignés pour faire remonter les cas limites,
   signaler les erreurs d'orientation, et ancrer le service dans la réalité des usages.

---

## 3. Appui sponsor institutionnel

Le projet s'appuie sur des acteurs publics à trois niveaux :

| Niveau | Acteur | Pour quoi faire |
|---|---|---|
| National, expertise | **CNSA** (Caisse nationale de solidarité pour l'autonomie) | Légitimité sur les données d'offre (data.gouv.fr), validation des montants APA, connexion aux conseils départementaux |
| National, technique | **DINUM** | Accès Albert API, portage du projet dans l'écosystème beta.gouv.fr, hébergement souverain |
| Local, opérationnel | **Conseil(s) départemental(aux) pilote(s)** | Administration porteuse de fait, accès terrain, déploiement auprès des CCAS |

Le niveau de sponsor minimal pour démarrer un pilote est le conseil départemental (porte
l'APA, chef de file de l'autonomie). La CNSA et la DINUM amplifient et pérennisent, mais ne
sont pas bloquants pour les premières semaines.

---

## 4. Plan de conduite du changement

### Principes généraux

Trois publics distincts, trois démarches distinctes :

- **Les agents de guichet** (CCAS, équipes APA des départements) : le service leur envoie des
  contacts pré-qualifiés, pas des cas non triés. La valeur est claire pour eux. La résistance
  principale est la crainte que l'outil "fasse leur travail à leur place" ou signale des droits
  qu'ils n'auraient pas déjà repérés. La réponse : l'outil oriente vers eux, il ne se substitue
  pas à eux. La décision d'attribution reste humaine.
- **Les personnes âgées et leurs aidants** : public peu à l'aise avec le numérique, souvent
  découragé par les démarches. La confiance se gagne sur la forme autant que sur le fond :
  ton FALC, réassurance, canal vocal disponible, pas de jargon.
- **Les décideurs** (directeurs de département, élus) : besoin de données de pilotage (taux
  d'activation, volume de dossiers instruits, ROI social estimé) et d'une assurance de conformité
  (RGPD, IA Act, données souveraines).

### Phases indicatives

Ces phases et leurs durées sont des **ordres de grandeur à valider** avec le sponsor et l'équipe.

**Phase 0 : Cadrage et sécurisation (1 à 2 mois)**
- Trouver l'administration porteuse, ouvrir l'accès Albert API.
- Valider le function-calling sur l'instance Albert (test prioritaire, voir section 1).
- Identifier les 1 à 3 départements pilotes et leurs référents.
- Constitution de l'équipe : chef de projet, profil technico-produit, référent terrain, juriste
  RGPD/IA Act pour la phase de conformité.

**Phase 1 : Pilote terrain (3 à 6 mois)**
- Déploiement sur 1 département, en partenariat avec quelques CCAS volontaires.
- Formation des référents agents : demi-journée par structure, centrée sur le parcours de mise en
  relation (ce que l'outil envoie, comment répondre, comment signaler une anomalie).
- Mesure hebdomadaire : nombre de sessions, taux de complétion, qualité des orientations mesurée
  par retour des guichets, tickets d'anomalie.
- Itérations courtes (2 semaines) sur les points de friction identifiés.

**Phase 2 : Extension et consolidation (6 à 18 mois)**
- Extension à 2 ou 3 départements supplémentaires selon les apprentissages de la phase 1.
- Formation à l'échelle : modules réutilisables (vidéo courte + fiche de référence), déployables
  sans intervention de l'équipe centrale.
- Communication vers les aînés et aidants : appui sur les canaux existants (mairies, CCAS,
  médecins traitants, Carsat), pas de campagne nationale autonome dans cette phase.
- Pilotage qualité formalisé, tableau de bord partagé avec les conseils départementaux.

**Phase 3 : Passage à l'échelle (à partir de 18 mois)**
- Négociation de quotas étendus avec la DINUM (le goulot STT borne l'échelle vocale bien avant
  le LLM).
- Couverture nationale progressive : par vague territoriale, pas de bascule nationale d'un coup.
- Conventionnement avec la CNSA pour la pérennité et la gouvernance des données d'offre.

### Ordres de grandeur budgétaires

Ces chiffres sont des **ordres de grandeur à valider**, pas des devis. Ils permettent de
calibrer un premier tour de financement ou une demande de crédit d'expérimentation.

| Poste | Ordre de grandeur indicatif |
|---|---|
| Équipe produit et technique (phase 1) | 200 000 à 400 000 EUR/an (2 à 4 ETP selon la couverture) |
| Inférence LLM en dev (Mistral EU, avant Albert) | quelques milliers d'EUR/mois pour un pilote de faible volume |
| Formation agents guichet (phase 1, 1 département) | 15 000 à 40 000 EUR (présentiel + création de supports) |
| Communication terrain (affiches, dépliants, relais CCAS) | 5 000 à 20 000 EUR pour un département |
| Conformité juridique (audit RGPD/IA Act, DPO) | 10 000 à 30 000 EUR pour la phase de mise en conformité initiale |

Ces fourchettes sont larges par construction. La borne basse correspond à un portage en grande
partie interne (équipe beta.gouv, financement incubateur public) ; la borne haute correspond à
un pilote avec prestaires externes et communication active.

---

## 5. Points de vigilance

- **Engagement des guichets** : le service n'a de valeur que si les CCAS et conseils
  départementaux traitent réellement les contacts entrants. Mesurer le taux de réponse côté
  guichet dès la phase 1.
- **Mise à jour des données d'offre** : l'annuaire DILA intègre les CCAS depuis janvier 2026,
  mais sa complétude et sa fraîcheur varient. Un processus de signalement et de correction est
  nécessaire dès le pilote.
- **Goulot STT** : si le canal vocal est dominant, le quota Whisper sur Albert (5 000 req/jour)
  borne à environ 600 sessions vocales par jour. Anticiper la négociation avec la DINUM, et
  prévoir un repli clavier opérationnel et accessible (RGAA).
- **Récupération sur succession (ASPA)** : l'information sur la récupération sur succession doit
  être communiquée de façon claire et honnête à chaque présentation de ce droit, sans décourager
  mais sans dissimuler. C'est un critère de confiance pour la personne âgée et sa famille.
