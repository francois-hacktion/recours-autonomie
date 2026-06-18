# ADR-0004 : Fournisseur LLM souverain, modèles et function-calling vers OpenFisca

> Maintenu en Français, guillemets droits. Statut : accepté. Date : 2026-06-18.

## Statut

Accepté. La direction souveraine est actée. Les points à valider en fin de document sont des
réserves d'implémentation (à lever au playground et avant production), pas des conditions à la
décision. Cet ADR consolide et remplace une note antérieure plus courte.

## Contexte

Recours Autonomie est un service public souverain qui aide les personnes âgées (et leurs aidants) à
accéder à leurs droits sociaux (APA, ASPA, CSS, aides au logement). Le principe directeur, non
négociable (ADR-0001 et ADR-0002), est que le LLM ne calcule jamais un droit : l'éligibilité et les
montants sont produits par OpenFisca, moteur de règles déterministe. Le LLM n'est qu'une interface
qui collecte les intrants en langage naturel, appelle le moteur, vulgarise en FALC et oriente vers le
bon guichet pour ce qu'aucun moteur national ne calcule (catégorie C du catalogue, principal gisement
de non-recours).

Trois propriétés contraignent l'architecture cible :

1. Données sensibles. Le GIR, le niveau de dépendance et l'état de santé relèvent de l'article 9 RGPD.
   Le traitement doit minimiser et éviter le stockage par défaut.
2. Système à haut risque. Un dispositif d'accès aux prestations sociales relève de l'annexe III de
   l'IA Act : traçabilité, explicabilité et supervision humaine. C'est OpenFisca plus le catalogue
   YAML versionné qui portent l'explicabilité, pas le modèle.
3. Souveraineté. Aucune donnée usager ne doit quitter le territoire ni être transmise au fournisseur
   d'un modèle. Cela exclut les API hébergées hors UE pour tout traitement de données usagers.

Cet ADR porte sur la cible, pas sur le démonstrateur `app/` (scripté, offline, sans vrai LLM).

## Décision

### 1. Deux fournisseurs, une seule abstraction compatible OpenAI

Adopter Albert API (DINUM) comme fournisseur LLM de production cible, et la Plateforme Mistral EU
comme fournisseur de développement, en attendant le portage administratif qui ouvre l'accès à Albert
(l'accès suppose une administration porteuse, condition non remplie en cadre scolaire). Les deux
exposent le formalisme OpenAI : le code passe par une couche d'abstraction fournisseur (client
paramétré par URL de base et clé, jamais d'endpoint codé en dur). Le basculement dev vers prod se fait
en changeant deux variables d'environnement. C'est une exigence d'architecture, pas un confort : elle
protège du verrouillage fournisseur.

### 2. Sélection des modèles (tous open weight, hébergés DINUM)

| Besoin | Modèle | Justification |
|---|---|---|
| Orchestration, FALC, function-calling | mistralai/Mistral-Small-3.2-24B-Instruct | Orchestrateur par défaut, tool-calling natif. Pas de modèle de raisonnement requis, le raisonnement métier est dans OpenFisca |
| Speech-to-text | openai/whisper-large-v3 | Public âgé, voix dominante. À tester sur voix âgées et environnements bruyants |
| RAG embeddings | BAAI/bge-m3 | Indexation du catalogue d'aides et des fiches démarches |
| RAG reranking | BAAI/bge-reranker-v2-m3 | Précision de la récupération |
| Montée en gamme (réserve) | openai/gpt-oss-120b | Si Mistral Small 3.2 s'avère insuffisant. Pas de Mistral propriétaire sur Albert |

Choix tranché : Mistral Small 3.2 comme orchestrateur unique par défaut, gpt-oss-120b en réserve
documentée. Pas de fine-tuning (ADR-0003) : un modèle entraîné ne fournit ni l'explicabilité ni la
traçabilité exigées par l'IA Act.

### 3. Le function-calling vers OpenFisca est le pivot, à valider en premier

L'architecture repose sur la capacité du LLM à appeler l'outil `calculer_droits` (contrat déjà
esquissé dans `app/src/lib/moteur.ts`) avec les intrants collectés, à recevoir le résultat
déterministe, puis à le vulgariser. Si le function-calling n'est pas fiable sur l'instance Albert,
toute l'architecture tombe. Premier test au playground, avant tout autre engagement :

- Déclaration d'un tool `calculer_droits` au schéma stable (résidence, GIR ou proxy d'autonomie,
  ressources, composition du foyer, département).
- Appel d'outil bien formé, arguments JSON valides, sur l'instance Albert et pas seulement Mistral EU.
- Robustesse anti-hallucination : le modèle s'abstient d'inventer un montant tant que l'outil n'a pas
  répondu.
- Multi-tours : enchaînement collecte, appel, restitution FALC sans dérive.

Tant que ce test n'est pas vert sur Albert, considérer l'accès Albert comme non acquis et rester sur
Mistral EU.

### 4. Souveraineté et conformité par construction

- Hébergement SecNumCloud (Outscale puis Nubo), données ne quittant pas le territoire, non transmises
  aux fournisseurs des modèles. Reverifier l'homologation au passage en production.
- Minimisation article 9 : ne transmettre au LLM que le nécessaire au calcul, GIR et santé à la volée,
  sans stockage par défaut, pas de log de contenu de santé.
- IA Act annexe III : traçabilité (versioning du catalogue et des appels OpenFisca), explicabilité
  (montant issu d'une formule auditable), supervision humaine (orientation vers un guichet humain).
- Recherche web bornée : Albert ne fournit pas de web search intégré. Toute recherche (aides locales)
  est limitée à une allowlist de domaines officiels. Pas de moteur tiers avec des données usager.

### 5. Capacité, quotas et goulot STT

Accès gratuit pour les porteurs publics, encadré par des quotas. Pour environ 9 requêtes LLM par
session :

| Modèle | Req/min | Req/jour | Lecture |
|---|---|---|---|
| Mistral Small 3.2 | 100 | 50 000 | ~5 500 sessions/jour (1,5 à 2 M/an). Pilote et déploiement régional sans effort |
| Whisper (STT) | 100 | 5 000 | Premier goulot. Tout vocal, ~600 sessions/jour (~200 000/an) |
| gpt-oss-120b | 50 | 5 000 | Réserve, quotas serrés |
| Embeddings, reranker | 2 000 | 200 000 | Non contraignant |

Décision de dimensionnement : avec une voix dominante, le STT borne l'échelle, pas le LLM. D'où un
repli clavier systématique (qui sert aussi l'accessibilité), et ne pas transcrire ce qui peut être
collecté par bouton. L'échelle nationale exige une négociation de quotas étendus avec la DINUM, elle
n'est pas acquise sur étagère.

### 6. Modèle économique

Plateforme mutualisée financée par l'État, gratuite pour les porteurs publics, sans refacturation à
l'usage. Pas de coût d'inférence au budget en cible, contrairement à Mistral EU. Mais gratuit ne veut
pas dire soutenable à l'échelle : le coût d'une généralisation n'est pas public (bilan attendu été
2026). Tant qu'il n'est pas publié, le garder comme hypothèse à confirmer auprès de la DINUM, et
conserver le chiffrage Mistral EU comme borne haute crédible du coût réel d'inférence pour le business
plan.

## Alternatives écartées

- API de LLM hébergées hors UE (OpenAI, Anthropic, Google en direct) : incompatibles avec la
  souveraineté, l'article 9 RGPD et l'absence de transfert hors territoire. Non négociable.
- Mistral EU comme fournisseur de production : reste dans le périmètre de confiance pour le dev, mais
  introduit un coût d'inférence et n'est pas la plateforme souveraine de l'État.
- Fine-tuning d'un modèle métier (ADR-0003) : ni explicabilité ni traçabilité annexe III, et déplace
  du raisonnement métier dans un poids opaque.
- Endpoint fournisseur codé en dur : empêcherait le basculement dev vers prod et créerait un
  verrouillage.
- Web search ouvert via moteur tiers : enverrait des requêtes hors périmètre souverain.

## Conséquences

Positives : souveraineté de bout en bout, coût d'inférence nul en cible avec une borne haute connue,
conformité portée par l'architecture (OpenFisca plus catalogue versionné), portage dev vers prod
indolore, pas de verrouillage fournisseur.

Négatives et limites : dépendance à une validation non faite (function-calling sur Albert), accès
Albert conditionné à une administration porteuse, goulot STT qui borne l'échelle, capacité nationale
non acquise, soutenabilité économique à l'échelle incertaine, recherche web à construire et à borner
soi-même.

## Points à valider avant engagement

1. Function-calling sur l'instance Albert (appel bien formé, abstention de tout montant inventé,
   robustesse multi-tours). Condition de toute l'architecture.
2. Accès réel à Albert (administration porteuse). En cadre scolaire, développer sur Mistral EU et
   documenter Albert comme cible.
3. Qualité STT Whisper sur voix âgées, accents, environnements bruyants, et ergonomie du repli clavier.
4. Quotas nécessaires au volume visé, à négocier avec la DINUM au-delà du pilote (plafond STT en
   premier).
5. État de l'homologation SecNumCloud au passage en production.
6. Coût de généralisation Albert (bilan attendu été 2026). En attendant, Mistral EU comme borne haute.
7. Périmètre et maintenance de l'allowlist de domaines officiels pour la recherche web.

## Références

- Fiche de référence projet : `docs/albert-et-souverainete.md`.
- Catalogue et tarifs Albert API : albert.sites.beta.gouv.fr.
- Code OpenGateLLM : github.com/etalab-ia/OpenGateLLM.
- Contrat `calculer_droits` de référence : `app/src/lib/moteur.ts`.
