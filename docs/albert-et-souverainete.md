# Albert API et contraintes de souveraineté

Fiche de référence pour l'implémentation. Regroupe tout ce qui a été établi sur Albert API comme fournisseur LLM cible, ses capacités, ses limites, et les contraintes de souveraineté propres à un service public traitant des données sensibles. À ranger dans `docs/`.

## Position d'Albert dans l'architecture

Albert API est le fournisseur LLM de production cible. La Plateforme Mistral EU est le fournisseur de développement, en attendant le portage administratif qui ouvre l'accès à Albert. Les deux parlent le formalisme OpenAI, donc le basculement se fait en changeant l'URL de base et la clé, sans toucher au code. Le code doit donc passer par une abstraction fournisseur, jamais coder en dur un endpoint.

## Distinction à ne pas confondre

- L'assistant Albert (chatbot pour agents publics) n'est pas notre sujet et n'est pas un service grand public.
- Albert API est l'infrastructure d'inférence souveraine de la DINUM, instance d'OpenGateLLM, sur laquelle on construit le produit. L'accès est réservé aux administrations comme porteuses de produit, pas aux agents comme utilisateurs. Un produit grand public porté par une administration est éligible. La restriction porte sur le porteur, pas sur l'utilisateur final.

## Catalogue de modèles utile

Vérifié sur le catalogue officiel (albert.sites.beta.gouv.fr). Modèles open weight, hébergés par la DINUM, aucune donnée envoyée aux fournisseurs des modèles.

| Besoin | Modèle Albert | Alias |
|---|---|---|
| Orchestration, FALC, function-calling | mistralai/Mistral-Small-3.2-24B-Instruct (multimodal vision) | openweight-medium |
| Tâches simples | mistralai/Ministral-3-8B-Instruct | openweight-small |
| Tâches complexes | openai/gpt-oss-120b | openweight-large |
| Code | Qwen3-Coder-30B | openweight-code |
| Speech-to-text | openai/whisper-large-v3 | openweight-audio |
| RAG embeddings | BAAI/bge-m3 | openweight-embeddings |
| RAG reranking | BAAI/bge-reranker-v2-m3 | openweight-rerank |

Le modèle d'orchestration par défaut du produit est Mistral Small 3.2. Pas de modèle de raisonnement requis, le raisonnement métier est dans OpenFisca. Pas de Mistral propriétaire Medium ou Large sur Albert : la montée en gamme se fait vers gpt-oss-120b.

## Couverture des besoins du projet

- LLM orchestrateur : couvert (Mistral Small 3.2).
- RAG complet : couvert (bge-m3 plus reranker), Albert fournit aussi une solution RAG intégrée.
- Speech-to-text : couvert (Whisper-large-v3). Pertinent pour le public âgé. À tester sur voix âgées, accents et environnements bruyants, prévoir un repli clavier.
- Function-calling vers OpenFisca : à valider en priorité au playground. La compatibilité OpenAI le rend probable, Mistral Small 3.2 supporte le tool-calling nativement, mais ce n'est pas confirmé noir sur blanc. C'est le pivot de l'architecture, donc à tester avant tout engagement.

## Capacité et quotas

Accès gratuit pour les porteurs publics, encadré par des quotas qui rationnent une ressource partagée. Quotas de production indicatifs :

| Modèle | Requêtes/minute | Requêtes/jour |
|---|---|---|
| Mistral Small 3.2 | 100 | 50 000 |
| gpt-oss-120b | 50 | 5 000 |
| Whisper (STT) | 100 | 5 000 |
| Embeddings, reranker | 2 000 | 200 000 |

Lecture pour le dimensionnement, avec environ 9 requêtes LLM par session :
- Le LLM plafonne vers 5 500 sessions par jour, soit de l'ordre de 1,5 à 2 millions par an. Pilote et déploiement régional passent sans effort.
- Le STT à 5 000 requêtes par jour est le premier goulot. Si chaque tour est vocal, le plafond tombe vers 600 sessions vocales par jour, environ 200 000 par an. Si la voix est centrale, c'est lui qui borne.
- L'échelle nationale grand public dépasse les quotas standard et exige une négociation de quotas étendus avec la DINUM. À titre de repère, Albert API traite de l'ordre de 100 000 requêtes par semaine sur l'ensemble de ses projets, donc un service national à lui seul dépasserait cette charge totale actuelle. La capacité nationale n'est pas acquise sur étagère.

## Modèle économique

Plateforme mutualisée financée centralement par l'État, gratuite pour les porteurs publics, sans refacturation à l'usage. Il n'y a donc pas de coût d'inférence à porter au budget, contrairement à la Plateforme Mistral EU. La logique est d'éviter que chaque administration reconstruise son backend IA. Le coût d'une généralisation n'est pas public, un bilan était attendu pour l'été 2026. Conséquence pratique : gratuit ne veut pas dire soutenable à l'échelle. Tant que le coût de généralisation n'est pas publié, le garder comme hypothèse à confirmer auprès de la DINUM, et conserver le chiffrage Mistral EU comme borne haute crédible du coût réel d'inférence.

## Contraintes de souveraineté et de conformité

- Hébergement souverain. Albert est hébergé sur infrastructure qualifiée SecNumCloud (Outscale, puis Nubo), avec des données qui ne quittent pas le territoire et ne sont pas transmises aux fournisseurs des modèles. L'homologation SecNumCloud était en finalisation, à reverifier au passage en production.
- Données de santé. Le niveau de dépendance, le GIR et l'état de santé relèvent de l'article 9 du RGPD. Minimisation stricte, et calcul à la volée sans stockage par défaut. Ne transmettre au LLM que le nécessaire.
- IA Act, système à haut risque. Un dispositif d'accès aux prestations sociales relève de l'annexe III. Traçabilité des données et des décisions, explicabilité, supervision humaine. Le calcul déterministe par OpenFisca et le catalogue YAML versionné répondent à ces exigences ; un modèle entraîné ne le permettrait pas, d'où le rejet du fine-tuning.
- Périmètre fournisseur. Écarter les API de LLM hébergées hors UE pour tout traitement de données usagers. En développement, Mistral EU reste dans le périmètre de confiance.
- Recherche web. Une recherche web ouverte, par exemple pour les aides locales, envoie des requêtes vers un moteur tiers. Albert API ne fournit pas de web search intégré, il faut l'orchestrer soi-même. À arbitrer côté souveraineté, et à borner à une allowlist de domaines officiels.

## Points à valider avant de s'engager sur Albert

1. Le function-calling sur l'instance Albert, condition de toute l'architecture.
2. L'accès réel, qui suppose un porteur administration. En cadre scolaire, développer sur Mistral EU et documenter Albert comme cible.
3. Les quotas nécessaires au volume visé, à négocier au-delà du pilote.
4. L'état de l'homologation SecNumCloud au moment du passage en production.

## Références

- Catalogue et tarifs Albert API : albert.sites.beta.gouv.fr (institution).
- Code OpenGateLLM : github.com/etalab-ia/OpenGateLLM (source primaire).
- Offre IA souveraine de l'État et trajectoire Albert : numerique.gouv.fr, beta.gouv.fr (institution).
- Contexte budget IA DINUM et trajectoire : Acteurs Publics, Weka, Next (presse spécialisée).
