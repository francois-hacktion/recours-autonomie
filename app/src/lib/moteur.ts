// ───────────────────────────────────────────────────────────────────────────
// LE MOTEUR DE CALCUL DU DÉMONSTRATEUR
//
// Dans la solution CIBLE, ce module est remplacé par un appel à OpenFisca-France
// (moteur de règles déterministe, source de vérité des montants).
// Ici, c'est un calcul codé en dur, déterministe et réaliste, qui RESPECTE LE MÊME
// CONTRAT que l'outil `calculer_droits` décrit dans la spec (docs/contrats-interface).
//
// Garde-fou matérialisé : l'assistant conversationnel n'invente JAMAIS un montant.
// Tout chiffre affiché à l'écran sort de cette fonction, jamais de la conversation.
// Les montants sont fictifs, à fin de démonstration.
// ───────────────────────────────────────────────────────────────────────────

export type Residence = 'domicile' | 'etablissement'
export type Autonomie = 'forte' | 'partielle' | 'autonome' // proxy FALC du GIR
export type Ressources = 'faibles' | 'moyennes' | 'elevees'
export type Foyer = 'seul' | 'couple'

export interface Situation {
  residence: Residence
  autonomie: Autonomie
  ressources: Ressources
  foyer: Foyer
}

// `calcul_national` = fiable (ex. ASPA). `estimation_departementale` = à confirmer (ex. APA).
export type Fiabilite = 'calcul_national' | 'estimation_departementale'

export interface ResultatDroit {
  aide: 'APA' | 'ASPA'
  libelle: string
  eligible: boolean
  montantMensuel: number | null
  fiabilite: Fiabilite
  resume: string
  demarche: {
    texte: string
    guichet: string
    lien: string
  }
}

// Valeur de revenu représentative par tranche déclarée (en € / mois).
const REVENU_REPRESENTATIF: Record<Ressources, number> = {
  faibles: 850,
  moyennes: 1300,
  elevees: 1950,
}

// ── ASPA : cas NATIONAL, entièrement calculé, fiable. ────────────────────────
// Allocation de solidarité aux personnes âgées. Montant différentiel : il complète
// les ressources jusqu'à un plafond. Barème de démonstration (ordre de grandeur réel).
function calculerAspa(situation: Situation): ResultatDroit {
  const PLAFOND: Record<Foyer, number> = { seul: 1012, couple: 1571 }
  const plafond = PLAFOND[situation.foyer]
  const revenu = REVENU_REPRESENTATIF[situation.ressources]
  const eligible = revenu < plafond
  const montant = eligible ? Math.round(plafond - revenu) : null

  return {
    aide: 'ASPA',
    libelle: 'Allocation de solidarité aux personnes âgées (ASPA)',
    eligible,
    montantMensuel: montant,
    fiabilite: 'calcul_national',
    resume: eligible
      ? `Vos revenus sont sous le plafond de ${plafond} € par mois. L'ASPA complète vos revenus jusqu'à ce plafond.`
      : `Vos revenus dépassent le plafond de ${plafond} € par mois. L'ASPA n'est pas ouverte dans ce cas.`,
    demarche: {
      texte: "Faites votre demande auprès de votre caisse de retraite.",
      guichet: 'Caisse de retraite (Carsat, MSA...)',
      lien: 'https://www.service-public.fr/particuliers/vosdroits/F16871',
    },
  }
}

// ── APA à domicile : cas DÉPARTEMENTAL, montant estimé, à confirmer. ──────────
// Le plan d'aide et le GIR sont fixés par le département après évaluation à domicile.
// On affiche donc une ESTIMATION, jamais un montant définitif.
function calculerApaDomicile(situation: Situation): ResultatDroit {
  // Plafond de plan d'aide selon le niveau d'autonomie (proxy GIR), en € / mois.
  const PLAN: Record<Autonomie, number> = {
    forte: 1750, // GIR 1-2
    partielle: 1000, // GIR 3-4
    autonome: 0, // GIR 5-6 : pas d'APA
  }
  // Taux de participation laissé à charge selon les ressources.
  const PARTICIPATION: Record<Ressources, number> = {
    faibles: 0,
    moyennes: 0.1,
    elevees: 0.25,
  }

  const plan = PLAN[situation.autonomie]
  const eligible = situation.residence === 'domicile' && plan > 0
  const montant = eligible
    ? Math.round(plan * (1 - PARTICIPATION[situation.ressources]))
    : null

  return {
    aide: 'APA',
    libelle: "Allocation personnalisée d'autonomie (APA) à domicile",
    eligible,
    montantMensuel: montant,
    fiabilite: 'estimation_departementale',
    resume: eligible
      ? "Estimation calculée à partir de votre niveau d'autonomie et de vos revenus. Le montant définitif est fixé par votre département après une visite à domicile."
      : situation.residence !== 'domicile'
        ? "L'APA à domicile concerne les personnes qui vivent chez elles. En établissement, c'est l'APA en établissement qui s'applique : parlez-en à votre département."
        : "L'APA est destinée aux personnes ayant besoin d'aide au quotidien (GIR 1 à 4).",
    demarche: {
      texte: 'Déposez votre dossier auprès du Conseil départemental.',
      guichet: 'Conseil départemental de votre lieu de résidence',
      lien: 'https://www.service-public.fr/particuliers/vosdroits/F10009',
    },
  }
}

// Point d'entrée unique : c'est l'équivalent de l'outil `calculer_droits`.
export function calculerDroits(situation: Situation): ResultatDroit[] {
  return [calculerApaDomicile(situation), calculerAspa(situation)]
}

export function formaterEuros(montant: number): string {
  return montant.toLocaleString('fr-FR') + ' €'
}
