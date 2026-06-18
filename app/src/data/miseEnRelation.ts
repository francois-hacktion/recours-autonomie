// Données du service de mise en relation, joué en fin de séquence vocale. 100 % fictives.
//
// Dans la cible, ces guichets sont résolus en temps réel via l'API Annuaire de
// l'administration (DILA), à partir du code INSEE de la commune. Le LLM ne fabrique
// jamais une coordonnée. Voir docs/prompt-mise-en-relation.md.
//
// Garde-fous reproduits ici : minimisation stricte. Le livrable ne contient ni état de
// santé, ni GIR, ni montant de ressources, ni numéro de sécurité sociale. Seulement de
// quoi recontacter la personne et l'orienter.

export type TypeGuichet =
  | 'ccas'
  | 'conseil_departemental'
  | 'point_info_autonomie'
  | 'france_services'

export interface Guichet {
  nom: string
  type: TypeGuichet
  role: string // une ligne : ce qu'il fait pour elle
  email: string
  telephone: string
  adresse: string
  horaires: string
}

// Livrable de contact pour un besoin donné : guichets résolus, phrase d'appel, mail
// minimisé. Selon la branche du parcours vocal, on passe le contact adapté au besoin.
export interface Contact {
  guichets: Guichet[]
  phrase: string
  mail: { destinataire: string; objet: string; corps: string }
}

export const COMMUNE = 'Roncourt-les-Tilleuls'

// Adresse de service générique depuis laquelle le service public envoie le message,
// avec le consentement de la personne (évolution service public du parcours).
export const ADRESSE_SERVICE = 'relais-autonomie@service-public.gouv.fr'

// Guichets résolus pour la commune. Le CCAS par défaut, le conseil départemental car
// l'APA est en jeu, le point d'information local en appui.
export const GUICHETS: Guichet[] = [
  {
    nom: 'CCAS de Roncourt-les-Tilleuls',
    type: 'ccas',
    role: 'Accompagne vos démarches d’aide sociale, tout près de chez vous.',
    email: 'ccas@roncourt-les-tilleuls.fr',
    telephone: '03 21 00 00 12',
    adresse: '2 place de la Mairie, Roncourt-les-Tilleuls',
    horaires: 'Du lundi au vendredi, 9h-12h et 14h-17h',
  },
  {
    nom: 'Service autonomie du Conseil départemental',
    type: 'conseil_departemental',
    role: 'Instruit votre demande d’APA et l’aide à domicile.',
    email: 'autonomie@departement.fr',
    telephone: '03 21 00 62 62',
    adresse: 'Maison départementale de l’autonomie',
    horaires: 'Du lundi au vendredi, 8h30-17h',
  },
  {
    nom: 'Point d’information autonomie (CLIC)',
    type: 'point_info_autonomie',
    role: 'Vous écoute et vous oriente gratuitement, en appui.',
    email: 'clic@autonomie-local.fr',
    telephone: '03 21 00 00 80',
    adresse: 'Espace seniors, Roncourt-les-Tilleuls',
    horaires: 'Mardi et jeudi, 9h-12h',
  },
]

// Phrase prête à dire au début de l'appel (sortie B du prompt), en FALC.
export const PHRASE_APPEL =
  'Bonjour, j’habite à Roncourt-les-Tilleuls. Je voudrais savoir quelles aides existent pour rester chez moi, et être aidée pour les démarches.'

// Gabarit du message (sortie A du prompt). Minimisé : aucune donnée de santé, GIR,
// ressource ou numéro de sécurité sociale. Destinataire principal : le CCAS.
export const MAIL = {
  destinataire: 'ccas@roncourt-les-tilleuls.fr',
  objet: 'Demande d’accompagnement pour les aides d’une personne âgée, Roncourt-les-Tilleuls',
  corps: `Bonjour,

Je vous contacte pour moi-même. J’habite à Roncourt-les-Tilleuls.
Je cherche à savoir quelles aides peuvent m’aider à rester à domicile, et je souhaite être accompagnée dans les démarches.

Pourriez-vous me recontacter ? Vous pouvez me joindre au 03 21 55 00 00, de préférence le matin.

Avec mes remerciements,
Jeanne D.`,
}

// Contact par défaut, pour la branche "faire le point sur ses droits" (maintien à
// domicile). La branche "renseignement" passe un contact propre à son besoin.
export const CONTACT_DOMICILE: Contact = {
  guichets: GUICHETS,
  phrase: PHRASE_APPEL,
  mail: MAIL,
}
