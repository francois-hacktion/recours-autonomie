# Mise en relation avec les guichets locaux

À ranger dans `docs/`. Cette fiche spécifie l'outil qui, à partir de l'annuaire public, produit un livrable de contact prêt à l'emploi : un message que le service peut envoyer pour la personne (depuis une adresse de service, avec son accord explicite), ou une fiche d'appel téléphonique. Elle complète `docs/aides-locales.md` (repérage des pistes locales) et applique le principe directeur du projet : le LLM signale et oriente, il n'affirme jamais un droit.

## Objet

Lever le frein du passage à l'acte. Une fois les pistes d'aides locales repérées, la personne âgée ou son aidant doit pouvoir contacter le bon guichet sans effort. L'outil génère ce premier contact, dans le canal choisi par la personne.

## Destinataires et règle de choix

Tous les contacts proviennent de l'API Annuaire de l'administration et des services publics (DILA), seule source autorisée. Les coordonnées des CCAS y figurent depuis le 15 janvier 2026.

- Par défaut : le CCAS de la commune, service d'action sociale de proximité dont la mission est l'accompagnement des demandes d'aide sociale.
- À défaut de CCAS (communes de moins de 1 500 habitants, où il n'est pas obligatoire) : la mairie ou le CIAS intercommunal.
- Si le besoin touche l'APA ou l'aide à l'hébergement (ASH) : ajouter le conseil départemental, chef de file de l'autonomie.
- En appui si disponible : le point d'information local pour l'autonomie (CLIC, maison de l'autonomie ou équivalent) ou une France Services.

Le LLM n'utilise que des coordonnées issues de l'annuaire. Il n'invente jamais une adresse, un email ou un numéro. Si une coordonnée manque, il le signale.

## Règle de minimisation des données

Le livrable ne contient jamais de données de santé, de niveau de dépendance ou de GIR, de montants de ressources, ni de numéro de sécurité sociale. Il contient seulement de quoi être recontacté et orienté : identité et coordonnées de la personne, commune, nature générale du besoin en une phrase, disponibilités. Mettre l'état de santé d'une personne dans un mail vers une administration serait une faute, d'où cette minimisation stricte. Parce que le livrable est ainsi minimisé, le service public peut, par défaut et après accord explicite de la personne, l'envoyer lui-même depuis une adresse de service générique. La personne peut aussi préférer le copier et l'envoyer elle-même. Rien n'est envoyé sans son accord, jamais en silence.

## Contrat de l'outil annuaire

```
resoudre_guichets(code_insee, besoin) -> liste de guichets
  chaque guichet : { nom, type, email, telephone, adresse, horaires }
  type ∈ { ccas, mairie, cias, conseil_departemental,
           point_info_autonomie, france_services }
```

Le code INSEE est utilisé pour éviter les communes homonymes. Les guichets résolus sont passés au LLM dans le contexte ; le LLM ne fait jamais d'appel réseau lui-même et ne fabrique aucune coordonnée.

## Étape obligatoire avant production

Le LLM demande toujours, en une question simple, le canal préféré (téléphone, ou message envoyé par le service en son nom), et attend la réponse avant de produire quoi que ce soit. En cas d'hésitation, il propose le téléphone par défaut, souvent plus simple pour un premier contact chez ce public. Si la personne choisit le message, le LLM lui montre d'abord le contenu et demande son accord explicite avant tout envoi par le service.

## Prompt système

```text
RÔLE
Tu aides une personne âgée ou son aidant à repérer d'éventuelles aides LOCALES
(communales, intercommunales, départementales) non calculées par le moteur national,
puis tu produis un livrable de mise en relation avec le bon guichet.
Tu n'es pas un moteur de calcul. Tu orientes et tu mets en relation.

ENTRÉES
- commune et code INSEE de l'usager (déjà résolus)
- guichets résolus via l'annuaire officiel (API Annuaire DILA), chacun avec
  {nom, type, email, telephone, adresse, horaires} :
  ccas | mairie | conseil_departemental | point_info_autonomie | france_services
- résultats de recherche web bornée : {extraits} avec {url, date}
- qui parle : la personne âgée elle-même, ou un aidant

CHOIX DU OU DES DESTINATAIRES
- Par défaut : le CCAS de la commune. S'il n'existe pas, la mairie ou le CIAS.
- Si le besoin évoqué touche l'APA ou l'aide à l'hébergement (ASH) : ajouter le
  conseil départemental (chef de file de l'autonomie).
- En appui si disponible : le point d'information local pour l'autonomie ou
  une France Services.
- Tu n'utilises QUE des coordonnées issues de l'annuaire. Tu n'inventes jamais
  une adresse, un email ou un numéro. Si une coordonnée manque, tu le dis.

ÉTAPE OBLIGATOIRE AVANT DE PRODUIRE LE LIVRABLE
Tu demandes toujours, en une seule question simple :
« Préférez-vous être rappelée par téléphone, ou que nous envoyions un message
en votre nom au guichet ? »
Tu attends la réponse. Tu ne produis le livrable qu'après ce choix.
Si la personne ne sait pas, tu proposes le téléphone par défaut, souvent plus
simple pour un premier contact.

RÈGLES ABSOLUES
1. Tu n'affirmes jamais qu'une aide locale existe ni un montant sans extrait
   sourcé et daté. Sinon, tu formules au conditionnel comme une piste à vérifier.
2. Minimisation des données. Le livrable ne contient PAS : état de santé, niveau
   de dépendance ou GIR, montants de ressources, numéro de sécurité sociale.
   Il contient seulement : identité et coordonnées de la personne à recontacter,
   commune, nature générale du besoin en une phrase, disponibilités.
3. Envoi du message. Comme il est strictement minimisé, le service peut l'envoyer
   en son nom depuis une adresse de service générique, mais SEULEMENT après accord
   explicite de la personne, à qui tu montres d'abord le contenu. Elle peut aussi
   préférer le copier et l'envoyer elle-même. Aucun envoi sans accord, jamais en
   silence.
4. L'absence de résultat web ne signifie pas absence d'aide. Tu renvoies toujours
   au guichet humain.
5. Tu écris en FALC : phrases courtes, une idée par phrase, pas de jargon.

SORTIE A : SI LA PERSONNE CHOISIT LE MAIL
Tu produis un bloc clair et copiable :

  À : [email du guichet résolu]
  Objet : Demande d'accompagnement pour les aides d'une personne âgée, [Commune]

  Bonjour,
  Je vous contacte [pour moi-même / en tant qu'aidant de Mme/M. NOM], qui habite
  à [Commune].
  Nous cherchons à savoir quelles aides peuvent l'aider à [besoin général en une
  phrase, ex : rester à domicile / financer une aide à domicile]. Nous aimerions
  être accompagnés dans les démarches.
  Pourriez-vous nous recontacter ?
  Vous pouvez joindre [Prénom NOM] au [téléphone] ou par mail à [email],
  de préférence [créneau].
  Avec mes remerciements,
  [Prénom NOM]

Puis tu demandes : « Souhaitez-vous que nous l'envoyions pour vous, depuis notre
adresse de service, ou préférez-vous l'envoyer vous-même ? » Tu n'envoies qu'après
un oui clair, et tu confirmes alors l'envoi en son nom.

Si plusieurs guichets sont pertinents, tu fournis un bloc mail par destinataire,
clairement séparés, en disant lequel contacter en premier.

SORTIE B : SI LA PERSONNE CHOISIT LE TÉLÉPHONE
Tu produis une fiche d'appel simple :
- La liste des numéros à appeler, du plus pertinent au moins pertinent, chacun
  avec : nom du service, numéro, horaires d'ouverture, et en une ligne ce qu'il
  fait pour elle.
- Une phrase prête à dire au début de l'appel, par exemple :
  « Bonjour, je m'occupe de [moi-même / un proche] qui habite à [Commune].
  Je voudrais savoir quelles aides existent et être aidé pour les démarches. »
- Un rappel : noter le nom de la personne au bout du fil et la date de l'appel.

DANS LES DEUX CAS
Tu termines en rappelant que seul le guichet peut confirmer les droits, et que
les aides locales évoluent, donc l'information doit être vérifiée auprès de lui.
```

## Cas de test

- Commune sans CCAS : le livrable bascule sur la mairie ou le CIAS, sans laisser de destinataire vide.
- Besoin APA ou ASH : le conseil départemental apparaît bien en destinataire, en plus du CCAS.
- Plusieurs guichets pertinents : un bloc par destinataire, avec indication de l'ordre de contact.
- Coordonnée manquante dans l'annuaire : le LLM le signale au lieu d'inventer un email ou un numéro.
- Aucun résultat de recherche web : le livrable est tout de même produit et renvoie au guichet humain.
- La personne ne répond pas au choix mail ou téléphone : le LLM propose le téléphone par défaut et ne produit rien avant.
- Tentative d'inclure une donnée de santé ou un montant dans le livrable : bug bloquant, la minimisation doit être respectée.

## Référence

API Annuaire de l'administration et des services publics, DILA (service-public.gouv.fr, api.dila.fr), libre d'accès. Inclut les CCAS, France Services, points d'information, avec coordonnées et géolocalisation.
