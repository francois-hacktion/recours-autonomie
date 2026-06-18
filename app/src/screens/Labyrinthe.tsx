import { BadgeCheck, Building2, Compass, Signpost, TriangleAlert, Waypoints } from 'lucide-react'
import {
  CATALOGUE,
  CERTITUDE_LABEL,
  COUCHE_OFFRE,
  type AideCatalogue,
  type Certitude,
  type Domaine,
} from '@/data/labyrinthe'
import { cn } from '@/lib/cn'

// "Le labyrinthe des aides" : un écran qui fait RESSENTIR la complexité du paysage
// des aides. On affiche tout le catalogue, groupé par domaine, coloré par niveau de
// certitude, par-dessus un fond en forme de dédale. Rien n'est calculé ici.

const ORDRE_DOMAINES: Domaine[] = [
  'Ressources',
  'Dépendance',
  'Logement',
  'Santé',
  'Fiscal',
  'Hébergement',
  'Local',
]

const NB_GUICHETS = new Set(CATALOGUE.map((a) => a.gestionnaire)).size

const DOMAINE_EMOJI: Record<Domaine, string> = {
  Ressources: '💶',
  Dépendance: '🤲',
  Logement: '🏠',
  Santé: '🩺',
  Fiscal: '🧾',
  Hébergement: '🏥',
  Local: '🏛️',
}

const CERTITUDE_STYLE: Record<Certitude, { chip: string; dot: string }> = {
  auto: { chip: 'border-valide/30 bg-valide-bg text-valide', dot: 'bg-valide' },
  evaluation: { chip: 'border-etat-blue/25 bg-etat-blue-light text-etat-blue', dot: 'bg-etat-blue' },
  cas_par_cas: { chip: 'border-estim/30 bg-estim-bg text-estim', dot: 'bg-estim' },
  non_centralise: { chip: 'border-etat-ink bg-etat-ink text-white', dot: 'bg-white' },
}

export function Labyrinthe() {
  const parDomaine = ORDRE_DOMAINES.map((d) => ({
    domaine: d,
    aides: CATALOGUE.filter((a) => a.domaine === d),
  })).filter((g) => g.aides.length > 0)

  return (
    <div className="mx-auto w-full max-w-projection space-y-6">
      {/* Intro : poser le problème. */}
      <header className="max-w-lecture">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-etat-grey">
          <Compass size={16} aria-hidden />
          Le problème, vu de l’usager
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Le labyrinthe des aides</h1>
        <p className="mt-3 text-etat-grey">
          Le droit, lui, est souvent calculable. Ce qui ne l’est pas, c’est de s’y retrouver. Pour
          une personne âgée et son aidant, voici la réalité : des dizaines de dispositifs, éclatés
          entre une dizaine de guichets, avec des règles et des niveaux de certitude différents, et
          personne pour relier le tout.
        </p>
      </header>

      {/* L'ampleur, en chiffres. */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat valeur={`${CATALOGUE.length}`} libelle="dispositifs cartographiés" />
        <Stat valeur={`${NB_GUICHETS}`} libelle="guichets différents" />
        <Stat valeur="∞" libelle="aides locales non centralisées (CCAS, départements…)" />
      </div>

      {/* Légende des niveaux de certitude. */}
      <Legende />

      {/* La carte du labyrinthe : toutes les aides, sur fond de dédale. */}
      <div className="relative overflow-hidden rounded-xl border border-etat-border bg-white p-4 shadow-carte sm:p-6">
        <FondDedale />
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parDomaine.map((g) => (
            <ZoneDomaine key={g.domaine} domaine={g.domaine} aides={g.aides} />
          ))}
        </div>
      </div>

      {/* Le cœur du message. */}
      <div className="rounded-xl border-l-4 border-etat-blue bg-etat-blue-light p-5">
        <p className="flex items-center gap-2 font-bold text-etat-blue">
          <Waypoints size={20} aria-hidden />
          Là où se cache le non-recours
        </p>
        <p className="mt-2 text-etat-ink">
          Le noyau <strong>calculable</strong> (en vert) est solvable par un moteur déterministe. Le
          vrai gisement de non-recours est ailleurs : les dispositifs <strong>non centralisés</strong>
          {' '}(en foncé), que personne, public ou privé, ne calcule réellement. Notre rôle : traiter
          le calculable et <strong>orienter vers le bon guichet</strong> pour le reste.
        </p>
      </div>

      {/* Couche offre : pas des aides. */}
      <p className="flex items-start gap-2 text-sm text-etat-grey">
        <Signpost size={16} className="mt-0.5 shrink-0 text-etat-grey" aria-hidden />
        {COUCHE_OFFRE}
      </p>
    </div>
  )
}

function Stat({ valeur, libelle }: { valeur: string; libelle: string }) {
  return (
    <div className="rounded-xl border border-etat-border bg-white p-4 shadow-carte">
      <p className="text-3xl font-bold text-etat-blue">{valeur}</p>
      <p className="mt-1 text-sm text-etat-grey">{libelle}</p>
    </div>
  )
}

function Legende() {
  const ordre: Certitude[] = ['auto', 'evaluation', 'cas_par_cas', 'non_centralise']
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-xl border border-etat-border bg-white px-4 py-3 text-sm shadow-carte">
      {ordre.map((c) => (
        <span key={c} className="flex items-center gap-2">
          <span className={cn('h-3 w-3 rounded-full ring-1 ring-black/10', CERTITUDE_STYLE[c].dot)} />
          {CERTITUDE_LABEL[c]}
        </span>
      ))}
    </div>
  )
}

function ZoneDomaine({ domaine, aides }: { domaine: Domaine; aides: AideCatalogue[] }) {
  return (
    <section className="rounded-lg border border-etat-border bg-white/85 p-3 backdrop-blur-sm">
      <h2 className="mb-2 flex items-center gap-2 text-base font-bold">
        <span aria-hidden>{DOMAINE_EMOJI[domaine]}</span>
        {domaine}
        <span className="rounded-full bg-etat-bg px-2 py-0.5 text-xs font-semibold text-etat-grey">
          {aides.length}
        </span>
      </h2>
      <ul className="space-y-2">
        {aides.map((a) => (
          <ChipAide key={a.nom} aide={a} />
        ))}
      </ul>
    </section>
  )
}

function ChipAide({ aide }: { aide: AideCatalogue }) {
  const style = CERTITUDE_STYLE[aide.certitude]
  const fonce = aide.certitude === 'non_centralise'
  return (
    <li className={cn('rounded-lg border px-3 py-2', style.chip)}>
      <div className="flex items-start gap-2">
        {fonce ? (
          <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
        ) : aide.certitude === 'auto' ? (
          <BadgeCheck size={15} className="mt-0.5 shrink-0" aria-hidden />
        ) : (
          <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', style.dot)} aria-hidden />
        )}
        <span className="text-sm font-semibold leading-snug">{aide.nom}</span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-[1.4rem] text-xs">
        <span className={cn('inline-flex items-center gap-1', fonce ? 'text-white/80' : 'text-etat-grey')}>
          <Building2 size={12} aria-hidden />
          {aide.gestionnaire}
        </span>
        <span
          className={cn(
            'rounded px-1.5 py-0.5 font-mono text-[0.7rem]',
            fonce ? 'bg-white/15 text-white/90' : 'bg-black/5 text-etat-grey',
          )}
        >
          {aide.source}
        </span>
      </div>
    </li>
  )
}

// Fond en forme de dédale, purement décoratif (aucun appel réseau, SVG inline).
function FondDedale() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-etat-blue opacity-[0.05]"
      aria-hidden
    >
      <defs>
        <pattern id="dedale" width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M0 22 H22 V0 M22 44 V22 H44 M22 22 H44"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dedale)" />
    </svg>
  )
}
