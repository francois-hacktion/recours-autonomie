// Branche "demande de renseignement" de l'assistant vocal, et étape de cadrage.
//
// Deux parcours sont jouables, chacun va au bout :
//   - "labyrinthe" : faire le point sur tous ses droits (4 questions, moteur, APA + ASPA).
//   - "renseignement" : l'aîné pose UNE question sur une aide locale précise (ici
//     l'adaptation du logement, catégorie cas par cas du catalogue, calculée par aucun
//     moteur national). L'assistant fait une RECHERCHE LOCALE visible : il vérifie au
//     conditionnel l'existence d'aides possibles et résout le bon guichet pour préparer
//     la mise en relation.
//
// Dans la cible : recherche web bornée à une allowlist de domaines officiels + API
// Annuaire DILA pour les guichets. Le LLM ne fabrique jamais une coordonnée ni un montant.
// Ici tout est scripté, 100 % fictif. Voir docs/prompt-mise-en-relation.md.

import { COMMUNE, type Contact, type Guichet, type Identite } from '@/data/miseEnRelation'

// Étape d'accueil : Silneo se présente et collecte le prénom puis le moyen de rappel.
// Sans cette étape, la mise en relation ne serait pas crédible (le mail doit être signé
// et donner un vrai numéro de rappel). Données d'identité seulement, jamais de santé.
export const IDENTITE_TOURS = [
  {
    assistant:
      'Bonjour 👋 Je suis Silneo, votre assistant. Je suis là pour vous aider à y voir clair dans vos droits, tranquillement. Pour commencer, comment vous appelez-vous ?',
    dictee: 'Je m’appelle Jeanne Dubois.',
    comprisComme:
      'Enchanté, Jeanne. Je note votre nom, juste pour qu’on se parle plus simplement.',
    rassurance: 'Vos réponses restent entre nous et ne servent qu’à vous aider.',
  },
]

// Le prénom et le nom sont "collectés" au début de l'échange. Le téléphone et l'e-mail
// ne sont demandés qu'au moment où ils servent vraiment (numéro : seulement si la personne
// confie l'envoi du mail au guichet ; e-mail : seulement si elle veut recevoir le récap).
// Valeurs pré-remplies pour la démo, modifiables à l'écran.
export const IDENTITE: Identite = {
  prenom: 'Jeanne',
  nom: 'Dubois',
}

export const TELEPHONE_DEFAUT = '06 12 34 56 78'
export const EMAIL_DEFAUT = 'jeanne.dubois@exemple.fr'

// Étape de cadrage : Silneo demande ce que la personne vient chercher (le prénom est
// déjà connu, on ne redit pas bonjour).
export const CADRAGE = {
  assistant:
    'Très bien, Jeanne. Maintenant, dites-moi : qu’est-ce qui vous amène aujourd’hui ?',
  rassurance: 'Il n’y a pas de mauvais choix. On pourra tout reprendre quand vous voulez.',
  choix: {
    renseignement: {
      titre: 'J’ai une question sur une aide précise',
      sous: 'Vous avez entendu parler d’une aide et vous aimeriez en savoir plus.',
    },
    labyrinthe: {
      titre: 'Faire le point sur tous mes droits',
      sous: 'Vous préférez vérifier, étape par étape, tout ce à quoi vous avez droit.',
    },
  },
}

// La question unique de la branche renseignement (aide locale : adaptation du logement).
export const RENSEIGNEMENT_TOUR = {
  assistant: 'Bien sûr, je vous écoute. Quelle est votre question ?',
  dictee:
    'Voilà… depuis ma chute, j’ai un peu peur dans ma douche. Une dame du club m’a dit qu’il existe une aide pour aménager la salle de bain. Mais je ne sais pas si c’est vrai, ni à qui m’adresser.',
  comprisComme:
    'Je comprends, après une chute c’est bien normal. Vous aimeriez sécuriser votre salle de bain et savoir si une aide existe pour cela. Je regarde tout de suite ce qui est possible près de chez vous.',
  rassurance: 'Vous avez bien fait d’en parler. On va voir ça ensemble, sans se presser.',
}

// Étapes visibles de la recherche locale (l'assistant vérifie l'existence d'aides et
// résout le bon guichet). Affichées l'une après l'autre, comme l'étape moteur.
export const RECHERCHE_LOCALE_ETAPES = [
  'Je consulte les dispositifs d’adaptation du logement, nationaux et locaux…',
  `Je vérifie l’annuaire officiel des services autour de ${COMMUNE}…`,
  'Je prépare les coordonnées du bon guichet pour vous…',
]

// Résultat de la recherche. Pistes formulées AU CONDITIONNEL, jamais affirmées : c'est
// le garde-fou du projet (le moteur ne calcule pas ces aides, on oriente sans promettre).
export interface PisteLocale {
  nom: string
  detail: string
  source: string
}

export const PISTES_LOCALES: PisteLocale[] = [
  {
    nom: 'MaPrimeAdapt’ (Agence nationale de l’habitat)',
    detail:
      'Pourrait financer une partie de l’adaptation de votre salle de bain : douche de plain-pied, barres d’appui, sol antidérapant.',
    source: 'service-public.fr',
  },
  {
    nom: 'L’aide de votre caisse de retraite',
    detail:
      'Beaucoup de caisses participent aux travaux de prévention des chutes, sous conditions. À vérifier auprès de la vôtre.',
    source: 'caisses de retraite',
  },
  {
    nom: 'Un coup de pouce du CCAS ou du département',
    detail: 'Selon la commune, une aide locale peut compléter le financement. Elle n’est centralisée nulle part.',
    source: 'non centralisé',
  },
]

export const GARDE_FOU_LOCAL =
  'Je ne peux pas vous garantir un montant ni votre éligibilité : seul le guichet pourra le confirmer. Mais ce sont des pistes sérieuses, et je sais déjà qui peut vous accompagner.'

// Le bon contact pour ce besoin : France Services accompagne le dossier MaPrimeAdapt',
// le CCAS connaît les aides locales. Résolus via l'annuaire dans la cible.
const GUICHETS_ADAPTATION: Guichet[] = [
  {
    nom: `France Services de ${COMMUNE}`,
    type: 'france_services',
    role: 'Vous accompagne gratuitement pour monter le dossier MaPrimeAdapt’.',
    email: 'franceservices@roncourt-les-tilleuls.fr',
    telephone: '03 21 00 00 45',
    adresse: `1 rue des Écoles, ${COMMUNE}`,
    horaires: 'Du lundi au vendredi, 9h-12h30 et 13h30-16h30',
  },
  {
    nom: `CCAS de ${COMMUNE}`,
    type: 'ccas',
    role: 'Connaît les aides locales et peut compléter le financement.',
    email: 'ccas@roncourt-les-tilleuls.fr',
    telephone: '03 21 00 00 12',
    adresse: `2 place de la Mairie, ${COMMUNE}`,
    horaires: 'Du lundi au vendredi, 9h-12h et 14h-17h',
  },
]

export const CONTACT_ADAPTATION: Contact = {
  guichets: GUICHETS_ADAPTATION,
  phrase: `Bonjour, j’habite à ${COMMUNE}. Je voudrais savoir s’il existe une aide pour adapter ma salle de bain, et être accompagnée pour le dossier.`,
  destinataire: 'franceservices@roncourt-les-tilleuls.fr',
  objet: `Demande d’accompagnement pour adapter le logement d’une personne âgée, ${COMMUNE}`,
  besoin:
    'Je cherche à savoir quelles aides peuvent m’aider à adapter ma salle de bain pour rester en sécurité chez moi, et je souhaite être accompagnée dans les démarches.',
}
