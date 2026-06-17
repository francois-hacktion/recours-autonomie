# Analyse du parcours concurrent Zenior

> Document de cadrage. Maintenu en Français, guillemets droits. Créé le 2026-06-17.
> Sert à positionner notre parcours utilisateur par contraste avec un concurrent qui
> propose un service proche du nôtre, gratuit en façade.

---

## 1. Ce qu'est Zenior

Zenior propose un **simulateur d'éligibilité aux aides financières** pour le financement
d'un hébergement senior (EHPAD en priorité), inséré dans une plateforme plus large
(« Votre recherche Zenior en 5 étapes » : comparer les établissements, planifier des
visites, compléter le dossier d'admission, estimer les aides, négocier le prix).

Le simulateur est un **tunnel de 15 étapes** en 4 phases :

1. **Profil** — pour qui, âge, autonomie (GIR), handicap avant 60 ans.
2. **Solution envisagée** — type d'hébergement, département, avancement, coûts EHPAD.
3. **Ressources** — revenus, patrimoine, situation familiale, enfants (obligation alimentaire).
4. **Contact** — capture des coordonnées (prénom, nom, email, téléphone) **avant** les résultats.

Source : board Whimsical `zenior-TiqLL5R2X8D2pUr6pHmuhC`, relevé écran par écran.

---

## 2. Le modèle économique réel : « gratuit » en façade, lead magnet en réalité

Zenior n'est pas un service public. Le simulateur est un **aimant à prospects** :

- Les résultats sont **bloqués derrière un mur de capture** (étape 15). Pour voir ses
  droits, l'utilisateur doit livrer nom + email + téléphone et accepter d'être rappelé.
- Le rappel téléphonique est annoncé (« Nous tenterons de vous appeler »).
- La finalité commerciale est la mise en relation avec des établissements et la
  négociation de prix, pas l'activation des droits sociaux pour eux-mêmes.

**Conséquence stratégique pour nous** : notre différenciateur n'est pas la qualité du
calcul (le leur est correct), c'est **la posture**. Service d'intérêt général, sans mur de
capture, sans revente de lead, avec une parole rassurante. Là où Zenior monétise
l'angoisse d'une famille qui cherche un EHPAD, nous luttons contre le non-recours.

---

## 3. Analyse critique du parcours Zenior

Points de friction, dont certains déjà pressentis par l'auteur du board via ses notes :

| Étape | Problème | Notre réponse |
|---|---|---|
| Q5 type de prise en charge | Choix **unique** alors que la personne hésite souvent entre plusieurs solutions (note d'auteur : « on peut en saisir un seul, c'est con ») | Multi-sélection, ou question différée tant qu'elle n'est pas nécessaire au calcul |
| Q6 « + de 3 mois dans le département » | Règle **non expliquée** (note d'auteur : « Pkoi depuis plus de 3 mois ? »). C'est la condition de résidence de l'ASH | On explique le pourquoi dans une bulle de réassurance, en langage clair |
| Q4 handicap avant 60 ans | Impact **non documenté** (note d'auteur : « chercher ce que ça change ») → perçu comme intrusif sans valeur | On ne pose la question que si elle change un droit, et on dit pourquoi |
| Q15 mur de capture | **Friction majeure** : exiger nom + email + téléphone *avant* tout résultat maximise la collecte mais casse la complétion et la confiance | **Aucun mur.** Résultat affiché immédiatement, coordonnées seulement si la personne veut être recontactée |
| Ton général | Tunnel de formulaire froid, orienté conversion | Conversation empathique, à voix ou au clic, qui reçoit l'émotion |

---

## 4. Couverture de leurs 15 questions chez nous

Objectif : **récupérer la même information utile, sans le tunnel ni le mur**, en
fusionnant, en différant ou en inférant. Le démonstrateur actuel pose 4 questions
(résidence, autonomie, ressources, foyer) ; la cible couvre le reste progressivement et
seulement quand c'est nécessaire au calcul d'un droit réel.

| # Zenior | Question Zenior | Comment on la couvre |
|---|---|---|
| 1 | Pour qui (moi / proche / patient) | **Capté** en amont : choix de la porte d'entrée (assuré / aidant). Adapte le wording (« vous » / « votre proche ») |
| 2 | Mois de naissance | **Différé** : on demande l'âge seulement si un seuil d'âge conditionne un droit (ex. 60 / 65 ans). Sinon inutile |
| 3 | GIR (1→6) | **Reformulé en FALC** : « avez-vous besoin d'aide pour certains gestes ? » → proxy du GIR. Le GIR officiel reste une évaluation départementale (entrée, pas calcul) |
| 4 | Handicap reconnu avant 60 ans | **Conditionnel** : posé uniquement si pertinent pour la PCH, avec explication du pourquoi |
| 5 | Type de prise en charge | **Multi-sélection** et différé ; à domicile vs établissement suffit pour orienter APA domicile / établissement |
| 6 | Département (+ résidence > 3 mois) | **Capté avec explication** : la condition de 3 mois sert l'ASH ; on le dit en clair plutôt que de le cacher |
| 7 | Avancement de la recherche | **Optionnel** : utile pour l'orientation, pas pour le calcul. Posé en fin, sans bloquer |
| 8 | Coût mensuel EHPAD | **Conditionnel établissement** : demandé seulement sur le parcours hébergement, avec valeur par défaut |
| 9 | Tarif dépendance EHPAD | **Conditionnel + valeur par défaut** (22 €/jour GIR 1-2), comme Zenior, mais explicité sans jargon |
| 10 | Revenus nets annuels | **Capté en tranches** dans le démonstrateur (estimation, pas de document), précisable en cible (RFR) |
| 11 | Bien immobilier | **Conditionnel** : impacte ASPA (récupération) et ASH ; posé avec la note de transparence sur la succession |
| 12 | Actifs / épargne (multi-cases) | **Différé** : seulement si une aide sous condition de patrimoine est en jeu |
| 13 | Situation familiale | **Capté** : notre question « seul / en couple », élargie veuf/marié/divorcé en cible (plafonds ASPA) |
| 14 | Nombre d'enfants + sous-formulaire (obligation alimentaire) | **Conditionnel ASH** : le plus lourd du tunnel Zenior ; chez nous, déclenché uniquement si l'ASH est explorée, et expliqué (obligation alimentaire) |
| 15 | Coordonnées (mur de capture) | **Supprimé comme mur.** Résultats d'abord ; coordonnées seulement si la personne demande à être accompagnée ou rappelée |

**Synthèse** : sur 15 questions Zenior, le cœur du calcul tient en **4 à 6 questions
réellement nécessaires** ; les autres sont différées, conditionnelles ou inférées. On ne
demande jamais une donnée qui ne change pas un droit affiché.

---

## 5. Bulles de réassurance prévues

Pour une personne âgée, chaque question peut être anxiogène. On accompagne donc les
questions sensibles d'une bulle de réassurance courte (implémentée dans l'assistant
vocal, champ `rassurance` de `app/src/data/dialogueVocal.ts`) :

- Résidence : « Prenez votre temps. Répondez avec vos mots, c'est moi qui m'occupe du reste. »
- Autonomie : « Rien de gênant à le dire. Demander de l'aide, c'est un droit, pas une faiblesse. »
- Revenus : « Une estimation suffit. Vos réponses ne sont pas enregistrées et ne seront transmises à personne. »
- Foyer : « C'est la dernière. Vous avez été parfaite, je regarde vos droits tout de suite. »

Bulles à prévoir pour les questions conditionnelles de la cible :
- Patrimoine / immobilier : transparence sur la récupération sur succession (ASPA, ASH).
- Enfants : expliquer l'obligation alimentaire (ASH) sans culpabiliser.
- Condition de résidence (3 mois) : dire pourquoi (ASH), comme contre-exemple de Zenior.

---

## 6. Comparaison de la simulation vocale (avant / après)

Le premier jet de notre script vocal était froid : confirmations en étiquettes de
formulaire (« Compris : Vous vivez à votre domicile. »), aucune prise en compte de
l'émotion (la chute, le veuvage), aucune réassurance.

Réécriture appliquée (`app/src/data/dialogueVocal.ts`), selon quatre principes :

1. **Accuser réception de l'émotion** avant de continuer (« Je suis désolé pour votre mari »).
2. **Expliquer le pourquoi** de chaque question (installe la confiance).
3. **Rassurer en continu** : pas de jugement, pas de document, rien n'est enregistré.
4. **Confirmer avec des mots humains**, jamais une étiquette administrative.

C'est l'inverse exact du tunnel de conversion Zenior : on n'extrait pas des données pour
les revendre, on accompagne une personne pour qu'elle accède à ses droits.
