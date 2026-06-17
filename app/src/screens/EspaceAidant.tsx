import { ArrowRight, BadgeCheck, Clock, ExternalLink, Hourglass, ListChecks, PiggyBank } from 'lucide-react'
import {
  AIDES,
  PROFIL_AINE,
  REGIME_LABEL,
  STATUT_LABEL,
  type Aide,
  type StatutDemarche,
} from '@/data/aidant'
import { formaterEuros } from '@/lib/moteur'
import { cn } from '@/lib/cn'

// Tableau de bord de l'aidant. Vue d'ensemble de toutes les aides d'un parent, le
// statut de chaque démarche et la prochaine action concrète. 100 % de données fictives.

// Revenu mensuel récurrent cumulé : seules les aides au montant mensuel chiffré comptent.
const REVENU_MENSUEL = AIDES.filter(
  (a) => a.montant.unite === 'mois' && a.montant.valeur !== null,
).reduce((total, a) => total + (a.montant.valeur ?? 0), 0)

const NB_EN_COURS = AIDES.filter((a) => a.statut === 'en_cours').length
const NB_A_LANCER = AIDES.filter((a) => a.statut === 'a_demander').length

// Les démarches que l'aidant doit traiter en priorité, en haut de l'écran.
const PRIORITES = AIDES.filter((a) => a.statut === 'a_demander' || a.statut === 'en_cours')

export function EspaceAidant() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* En-tête : qui on accompagne. */}
      <header className="rounded-xl border border-etat-border bg-white shadow-carte p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-bg text-2xl" aria-hidden>
            👵
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-etat-grey">
              Espace aidant
            </p>
            <h1 className="text-2xl font-bold sm:text-[1.7rem]">
              Vous accompagnez {PROFIL_AINE.prenom}, {PROFIL_AINE.lien}
            </h1>
            <p className="mt-1 text-etat-grey">
              {PROFIL_AINE.age} ans · {PROFIL_AINE.situation}
            </p>
          </div>
        </div>
      </header>

      {/* Bandeau KPI. */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi
          icone={PiggyBank}
          valeur={`${formaterEuros(REVENU_MENSUEL)} / mois`}
          libelle="Revenu mensuel potentiel"
          accent
        />
        <Kpi
          icone={ListChecks}
          teinte="text-teal"
          valeur={`${AIDES.length} aides`}
          libelle="Détectées pour Jeanne"
        />
        <Kpi
          icone={Clock}
          teinte="text-or"
          valeur={`${NB_EN_COURS} en cours · ${NB_A_LANCER} à lancer`}
          libelle="Démarches à suivre"
        />
      </div>

      {/* Prochaines actions, priorisées. */}
      <section className="rounded-xl border border-etat-border bg-white shadow-carte p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden>📋</span>
          Vos prochaines actions
        </h2>
        <ol className="mt-3 space-y-2">
          {PRIORITES.map((a) => (
            <li key={a.id} className="flex items-start gap-3 rounded-lg bg-etat-bg px-3 py-2.5">
              <ArrowRight size={18} className="mt-1 shrink-0 text-etat-blue" aria-hidden />
              <span>
                <span className="font-semibold text-etat-ink">{a.nom} · </span>
                <span className="text-etat-ink">{a.prochaineAction}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Toutes les aides. */}
      <section>
        <h2 className="mb-3 text-lg font-bold">🗂️ Toutes les aides de Jeanne</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {AIDES.map((a) => (
            <CarteAide key={a.id} aide={a} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Kpi({
  icone: Icone,
  valeur,
  libelle,
  accent,
  teinte,
}: {
  icone: typeof PiggyBank
  valeur: string
  libelle: string
  accent?: boolean
  teinte?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 shadow-carte',
        accent ? 'border-etat-blue bg-etat-blue text-white' : 'border-etat-border bg-white',
      )}
    >
      <Icone size={22} aria-hidden className={accent ? 'text-white' : (teinte ?? 'text-etat-blue')} />
      <p className={cn('mt-2 text-xl font-bold', accent ? 'text-white' : 'text-etat-ink')}>
        {valeur}
      </p>
      <p className={cn('text-sm', accent ? 'text-white/85' : 'text-etat-grey')}>{libelle}</p>
    </div>
  )
}

function CarteAide({ aide }: { aide: Aide }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-etat-border bg-white shadow-carte p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-snug">{aide.nom}</h3>
        <StatutBadge statut={aide.statut} />
      </div>

      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-etat-grey">
        {REGIME_LABEL[aide.regime]} · {aide.guichet}
      </p>

      <p className="mt-3 font-semibold text-etat-ink">{montantTexte(aide)}</p>

      <p className="mt-2 flex-1 text-sm text-etat-grey">{aide.objet}</p>

      <p className="mt-3 rounded-lg bg-etat-bg px-3 py-2 text-sm text-etat-ink">
        <span className="font-semibold">Prochaine action : </span>
        {aide.prochaineAction}
      </p>

      <a
        href={aide.lien}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-etat-blue underline underline-offset-2 hover:text-etat-blue-hover"
      >
        Fiche officielle
        <ExternalLink size={15} aria-hidden />
      </a>
    </article>
  )
}

// Texte de montant lisible selon l'unité et le caractère estimé.
function montantTexte(aide: Aide): string {
  const { valeur, unite, estimation, note } = aide.montant
  if (valeur === null) return note ? capitaliser(note) : 'Selon votre situation'
  const euros = formaterEuros(valeur)
  const suffixe = unite === 'mois' ? ' / mois' : unite === 'an' ? ' / an' : ''
  return `${estimation ? '≈ ' : ''}${euros}${suffixe}`
}

function capitaliser(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1)
}

const STATUT_STYLE: Record<StatutDemarche, { classe: string; icone: typeof BadgeCheck }> = {
  obtenu: { classe: 'bg-valide-bg text-valide', icone: BadgeCheck },
  en_cours: { classe: 'bg-etat-blue-light text-etat-blue', icone: Clock },
  a_demander: { classe: 'bg-estim-bg text-estim', icone: ArrowRight },
  a_verifier: { classe: 'bg-etat-bg text-etat-grey', icone: Hourglass },
}

function StatutBadge({ statut }: { statut: StatutDemarche }) {
  const { classe, icone: Icone } = STATUT_STYLE[statut]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        classe,
      )}
    >
      <Icone size={13} aria-hidden />
      {STATUT_LABEL[statut]}
    </span>
  )
}
