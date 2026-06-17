// Données du tableau de bord "Espace aidant". 100 % fictives, à fin de démonstration.
//
// Persona : un proche aidant qui pilote les démarches d'aide à l'autonomie pour un
// parent âgé. L'écran montre comment l'outil aide à NAVIGUER dans la complexité :
// quelles aides existent, où en est chaque démarche, qui est le bon guichet.
//
// Le périmètre reprend la cartographie projet (revenu, autonomie, hébergement,
// logement, santé, fiscal). Le champ `regime` rejoue la distinction structurante du
// projet : aides à barème national calculables vs aides départementales ou sur dossier.

export type Regime =
  | 'national_calcule' // barème national, calculé par le moteur (fiable)
  | 'departemental' // évaluation locale, montant estimé à confirmer
  | 'sur_dossier' // attribution sur dossier / barème local, hors calcul
  | 'fiscal' // avantage fiscal national

export type StatutDemarche =
  | 'obtenu' // droit ouvert, aide perçue
  | 'en_cours' // dossier déposé, instruction en cours
  | 'a_demander' // éligible probable, démarche à lancer
  | 'a_verifier' // à examiner selon la situation

export type UniteMontant = 'mois' | 'an' | 'ponctuel'

export interface Aide {
  id: string
  nom: string
  objet: string
  guichet: string
  regime: Regime
  statut: StatutDemarche
  montant: { valeur: number | null; unite: UniteMontant; estimation: boolean; note?: string }
  prochaineAction: string
  lien: string
}

export interface ProfilAine {
  prenom: string
  lien: string // lien de parenté avec l'aidant
  age: number
  situation: string // résumé en langage clair
}

export const PROFIL_AINE: ProfilAine = {
  prenom: 'Jeanne',
  lien: 'votre mère',
  age: 84,
  situation: 'Vit seule à domicile · besoin d’aide depuis une chute · retraite modeste',
}

export const AIDES: Aide[] = [
  {
    id: 'apa',
    nom: 'APA à domicile',
    objet: 'Financer le plan d’aide pour rester chez soi (aide à la toilette, aux repas).',
    guichet: 'Conseil départemental',
    regime: 'departemental',
    statut: 'en_cours',
    montant: { valeur: 1000, unite: 'mois', estimation: true, note: 'estimation avant évaluation GIR' },
    prochaineAction: 'Visite d’évaluation à domicile prévue : préparer les justificatifs de ressources.',
    lien: 'https://www.service-public.fr/particuliers/vosdroits/F10009',
  },
  {
    id: 'aspa',
    nom: 'ASPA (minimum vieillesse)',
    objet: 'Garantir un revenu minimum aux retraités les plus modestes.',
    guichet: 'Caisse de retraite (Carsat, MSA…)',
    regime: 'national_calcule',
    statut: 'a_demander',
    montant: { valeur: 162, unite: 'mois', estimation: false },
    prochaineAction: 'Déposer la demande auprès de la caisse de retraite (formulaire en ligne).',
    lien: 'https://www.service-public.fr/particuliers/vosdroits/F16871',
  },
  {
    id: 'css',
    nom: 'Complémentaire santé solidaire',
    objet: 'Couverture santé complémentaire gratuite ou à faible coût.',
    guichet: 'Assurance maladie (Ameli)',
    regime: 'national_calcule',
    statut: 'a_demander',
    montant: { valeur: null, unite: 'mois', estimation: false, note: 'gratuite sous plafond de ressources' },
    prochaineAction: 'Faire la simulation Ameli : ressources probablement sous le plafond.',
    lien: 'https://www.service-public.fr/particuliers/vosdroits/F10027',
  },
  {
    id: 'credit-impot',
    nom: 'Crédit d’impôt emploi à domicile',
    objet: 'Récupérer 50 % des dépenses d’aide à domicile, même sans impôt à payer.',
    guichet: 'Administration fiscale',
    regime: 'fiscal',
    statut: 'a_verifier',
    montant: { valeur: null, unite: 'an', estimation: true, note: '50 % des sommes engagées' },
    prochaineAction: 'Conserver les attestations de l’organisme d’aide à domicile pour la déclaration.',
    lien: 'https://www.service-public.fr/particuliers/vosdroits/F12',
  },
  {
    id: 'ardh',
    nom: 'Aide au retour à domicile (Carsat)',
    objet: 'Soutien temporaire après une hospitalisation ou une chute.',
    guichet: 'Caisse de retraite (action sociale)',
    regime: 'sur_dossier',
    statut: 'a_demander',
    montant: { valeur: null, unite: 'ponctuel', estimation: false, note: 'aide ponctuelle après la chute' },
    prochaineAction: 'Demander le dossier d’action sociale à la Carsat (délai court après hospitalisation).',
    lien: 'https://www.pour-les-personnes-agees.gouv.fr',
  },
  {
    id: 'maprimeadapt',
    nom: 'MaPrimeAdapt’',
    objet: 'Adapter le logement à la perte d’autonomie (douche de plain-pied, barres d’appui).',
    guichet: 'Anah',
    regime: 'sur_dossier',
    statut: 'a_demander',
    montant: { valeur: null, unite: 'ponctuel', estimation: true, note: 'jusqu’à 70 % du montant des travaux' },
    prochaineAction: 'Demander un diagnostic logement pour sécuriser la salle de bain après la chute.',
    lien: 'https://www.service-public.fr/particuliers/vosdroits/F37907',
  },
  {
    id: 'aide-menagere',
    nom: 'Aide-ménagère (aide sociale)',
    objet: 'Aide aux tâches du quotidien, à défaut d’APA.',
    guichet: 'Conseil départemental',
    regime: 'sur_dossier',
    statut: 'a_verifier',
    montant: { valeur: null, unite: 'mois', estimation: false, note: 'non cumulable avec l’APA' },
    prochaineAction: 'À examiner seulement si l’APA n’est finalement pas accordée.',
    lien: 'https://www.service-public.fr/particuliers/vosdroits/F2604',
  },
  {
    id: 'apl',
    nom: 'Aide au logement (APL / ALS)',
    objet: 'Réduire le loyer ou la mensualité de logement.',
    guichet: 'CAF / MSA',
    regime: 'national_calcule',
    statut: 'a_verifier',
    montant: { valeur: null, unite: 'mois', estimation: true, note: 'selon le statut d’occupation' },
    prochaineAction: 'Vérifier si propriétaire ou locataire avant de lancer une simulation CAF.',
    lien: 'https://www.service-public.fr/particuliers/vosdroits/F12006',
  },
]

// Libellés et sémantique d'affichage, centralisés pour rester cohérents dans l'UI.
export const REGIME_LABEL: Record<Regime, string> = {
  national_calcule: 'Barème national · calculé',
  departemental: 'Départemental · estimé',
  sur_dossier: 'Attribution sur dossier',
  fiscal: 'Avantage fiscal',
}

export const STATUT_LABEL: Record<StatutDemarche, string> = {
  obtenu: 'Obtenue',
  en_cours: 'En cours',
  a_demander: 'À demander',
  a_verifier: 'À vérifier',
}
