// Catalogue complet des aides aux personnes âgées, avec leur niveau de certitude et
// leur source. Données de cadrage du projet (liste définitive fournie par l'équipe),
// vérifiées contre l'instance OpenFisca-France et l'open data service-public.fr.
//
// Cet écran ne calcule rien : il sert à FAIRE RESSENTIR la complexité (le labyrinthe)
// à laquelle font face une personne âgée et son aidant. Le moteur de droits, lui, ne
// traite que le noyau calculable ; le reste relève de l'orientation vers le bon guichet.

// Niveau de certitude de calcul, du plus solide au plus insaisissable.
export type Certitude =
  | 'auto' // calculée par formule nationale (OpenFisca)
  | 'evaluation' // entrée nécessaire (évaluation départementale : GIR, plan d'aide…)
  | 'cas_par_cas' // décrite via open data mais attribuée sur dossier / barème local
  | 'non_centralise' // hors de toute API publique, non centralisée (gisement du non-recours)

export type Domaine =
  | 'Ressources'
  | 'Dépendance'
  | 'Logement'
  | 'Santé'
  | 'Fiscal'
  | 'Hébergement'
  | 'Local'

export interface AideCatalogue {
  nom: string
  domaine: Domaine
  gestionnaire: string
  source: string // variable OpenFisca, ou origine open data, ou "non centralisé"
  certitude: Certitude
}

export const CATALOGUE: AideCatalogue[] = [
  // ── A. Calculables via OpenFisca (noyau du produit) ──────────────────────────
  // Ressources / minimum vieillesse
  { nom: 'ASPA (minimum vieillesse)', domaine: 'Ressources', gestionnaire: 'Caisse de retraite', source: 'aspa', certitude: 'auto' },
  { nom: 'ASI (allocation supplémentaire d’invalidité)', domaine: 'Ressources', gestionnaire: 'Caisse de retraite', source: 'asi', certitude: 'auto' },
  { nom: 'Minimum vieillesse (agrégat ASI + ASPA)', domaine: 'Ressources', gestionnaire: 'Caisse de retraite', source: 'minimum_vieillesse', certitude: 'auto' },
  // Dépendance / autonomie
  { nom: 'APA à domicile', domaine: 'Dépendance', gestionnaire: 'Conseil départemental', source: 'apa_domicile', certitude: 'auto' },
  { nom: 'APA en établissement', domaine: 'Dépendance', gestionnaire: 'Conseil départemental', source: 'apa_etablissement', certitude: 'auto' },
  { nom: 'APA d’urgence', domaine: 'Dépendance', gestionnaire: 'Conseil départemental', source: 'apa_urgence_*', certitude: 'auto' },
  { nom: 'GIR (niveau de dépendance)', domaine: 'Dépendance', gestionnaire: 'Conseil départemental', source: 'gir', certitude: 'evaluation' },
  { nom: 'Plan d’aide à domicile', domaine: 'Dépendance', gestionnaire: 'Conseil départemental', source: 'dependance_plan_aide_domicile', certitude: 'evaluation' },
  { nom: 'Tarifs dépendance établissement', domaine: 'Dépendance', gestionnaire: 'Conseil départemental', source: 'dependance_tarif_etablissement_*', certitude: 'evaluation' },
  { nom: 'PCH (après 60 ans, si déjà bénéficiaire)', domaine: 'Dépendance', gestionnaire: 'Département / MDPH', source: 'pch', certitude: 'evaluation' },
  // Logement
  { nom: 'Aide personnalisée au logement (APL)', domaine: 'Logement', gestionnaire: 'CAF / MSA', source: 'apl', certitude: 'auto' },
  { nom: 'Allocation de logement sociale (ALS)', domaine: 'Logement', gestionnaire: 'CAF / MSA', source: 'als', certitude: 'auto' },
  { nom: 'Allocation de logement familiale (ALF)', domaine: 'Logement', gestionnaire: 'CAF / MSA', source: 'alf', certitude: 'auto' },
  { nom: 'Aide au logement en résidence autonomie', domaine: 'Logement', gestionnaire: 'CAF / MSA', source: 'aides_logement_foyer_*', certitude: 'auto' },
  { nom: 'Loca-Pass (avance / caution)', domaine: 'Logement', gestionnaire: 'Action Logement', source: 'locapass_eligibilite', certitude: 'auto' },
  // Santé
  { nom: 'Complémentaire santé solidaire (CSS)', domaine: 'Santé', gestionnaire: 'Assurance maladie', source: 'css_*, cmu_c', certitude: 'auto' },
  { nom: 'ACS (intégrée à la CSS)', domaine: 'Santé', gestionnaire: 'Assurance maladie', source: 'acs', certitude: 'auto' },
  // Fiscal
  { nom: 'Crédit d’impôt emploi à domicile', domaine: 'Fiscal', gestionnaire: 'Administration fiscale', source: 'ci_saldom', certitude: 'auto' },
  { nom: 'Réduction d’impôt emploi à domicile', domaine: 'Fiscal', gestionnaire: 'Administration fiscale', source: 'ri_saldom', certitude: 'auto' },

  // ── B. Descriptibles (open data) mais NON calculables par formule nationale ───
  { nom: 'ASH (aide sociale à l’hébergement)', domaine: 'Hébergement', gestionnaire: 'Conseil départemental', source: 'service-public.fr (open data)', certitude: 'cas_par_cas' },
  { nom: 'Aide-ménagère (aide sociale)', domaine: 'Dépendance', gestionnaire: 'Conseil départemental', source: 'service-public.fr (open data)', certitude: 'cas_par_cas' },
  { nom: 'Action sociale des caisses de retraite (ARDH, kits prévention)', domaine: 'Dépendance', gestionnaire: 'Carsat / caisses', source: 'barèmes propres à chaque caisse', certitude: 'cas_par_cas' },
  { nom: 'Allocation veuvage', domaine: 'Ressources', gestionnaire: 'Caisse de retraite', source: 'absente d’OpenFisca', certitude: 'cas_par_cas' },
  { nom: 'MaPrimeAdapt’ (adaptation du logement)', domaine: 'Logement', gestionnaire: 'Anah', source: 'service-public.fr (open data)', certitude: 'cas_par_cas' },
  { nom: 'Réduction d’impôt frais d’hébergement EHPAD', domaine: 'Fiscal', gestionnaire: 'Administration fiscale', source: 'à confirmer', certitude: 'cas_par_cas' },

  // ── C. Hors de toute API publique calculable (le principal gisement de non-recours) ──
  { nom: 'Aides extralégales départementales', domaine: 'Local', gestionnaire: 'Conseil départemental', source: 'non centralisé', certitude: 'non_centralise' },
  { nom: 'Aides communales / CCAS (~35 000 communes)', domaine: 'Local', gestionnaire: 'Commune / CCAS', source: 'non centralisé', certitude: 'non_centralise' },
  { nom: 'Action sociale des retraites complémentaires', domaine: 'Local', gestionnaire: 'Agirc-Arrco', source: 'non centralisé', certitude: 'non_centralise' },
]

// Libellés et sémantique d'affichage des niveaux de certitude.
export const CERTITUDE_LABEL: Record<Certitude, string> = {
  auto: 'Calculé automatiquement',
  evaluation: 'Évaluation requise (GIR, plan d’aide…)',
  cas_par_cas: 'Décrit, attribué au cas par cas',
  non_centralise: 'Hors de tout moteur, non centralisé',
}

// Donnée d'offre (annuaires) : pas des aides, mais sert à trouver le bon guichet.
export const COUCHE_OFFRE =
  'Annuaires EHPAD, résidences autonomie, SAAD / SSIAD, points d’information (data.gouv.fr / CNSA) : ils ne calculent aucun droit, ils servent à trouver le bon guichet.'
