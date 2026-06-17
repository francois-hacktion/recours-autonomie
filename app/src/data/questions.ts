// Script de la conversation. Dans la cible, c'est le LLM qui mène ce dialogue en
// langage naturel ; ici les questions sont fixes et les réponses se font au clic,
// pour un démonstrateur robuste, accessible et sans appel réseau.

import type { Autonomie, Foyer, Residence, Ressources } from '@/lib/moteur'

export type ChampSituation = 'residence' | 'autonomie' | 'ressources' | 'foyer'

export interface Option {
  label: string
  valeur: Residence | Autonomie | Ressources | Foyer
}

export interface Question {
  champ: ChampSituation
  assistant: string
  aide?: string
  options: Option[]
}

export const QUESTIONS: Question[] = [
  {
    champ: 'residence',
    assistant:
      'Bonjour 👋 Je vais vous aider à voir quelles aides vous pouvez demander. Pour commencer, où vivez-vous ?',
    aide: 'Choisissez la réponse qui vous correspond.',
    options: [
      { label: 'À mon domicile', valeur: 'domicile' },
      { label: 'Dans un établissement (maison de retraite)', valeur: 'etablissement' },
    ],
  },
  {
    champ: 'autonomie',
    assistant: 'Dans la vie de tous les jours, avez-vous besoin d’aide ?',
    options: [
      { label: 'Je me débrouille seul(e)', valeur: 'autonome' },
      { label: 'J’ai besoin d’aide pour certains gestes (toilette, repas...)', valeur: 'partielle' },
      { label: 'J’ai besoin d’aide pour la plupart des gestes du quotidien', valeur: 'forte' },
    ],
  },
  {
    champ: 'ressources',
    assistant: 'Quels sont vos revenus chaque mois, à peu près ?',
    aide: 'Une estimation suffit, personne ne vous demande de justificatif ici.',
    options: [
      { label: 'Moins de 1 000 € par mois', valeur: 'faibles' },
      { label: 'Entre 1 000 € et 1 600 € par mois', valeur: 'moyennes' },
      { label: 'Plus de 1 600 € par mois', valeur: 'elevees' },
    ],
  },
  {
    champ: 'foyer',
    assistant: 'Dernière question : vivez-vous seul(e) ou en couple ?',
    options: [
      { label: 'Seul(e)', valeur: 'seul' },
      { label: 'En couple', valeur: 'couple' },
    ],
  },
]
