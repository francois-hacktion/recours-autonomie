import { ArrowRight, Database, Network, ShieldAlert, TriangleAlert } from 'lucide-react'
import { Decor } from '@/components/Decor'
import { CATALOGUE, type Certitude } from '@/data/labyrinthe'
import type { Vue } from '@/lib/vue'

// Page décideurs : le problème vu du point de vue technique. Message : intégrer l'accès
// aux droits, c'est traverser une jungle d'acteurs, d'API et de règles locales que rien
// ne centralise. On s'appuie sur les vrais chiffres du catalogue (labyrinthe.ts).

const NB_GUICHETS = new Set(CATALOGUE.map((a) => a.gestionnaire)).size

const PAR_CERTITUDE = CATALOGUE.reduce(
  (acc, a) => {
    acc[a.certitude] = (acc[a.certitude] ?? 0) + 1
    return acc
  },
  {} as Record<Certitude, number>,
)

const COUCHES: { valeur: number; titre: string; texte: string }[] = [
  {
    valeur: PAR_CERTITUDE.auto ?? 0,
    titre: 'Calculées par formule',
    texte: 'OpenFisca les calcule de façon déterministe. C’est le noyau solide.',
  },
  {
    valeur: PAR_CERTITUDE.evaluation ?? 0,
    titre: 'Évaluation requise',
    texte: 'GIR, plan d’aide : il faut une évaluation départementale pour trancher.',
  },
  {
    valeur: PAR_CERTITUDE.cas_par_cas ?? 0,
    titre: 'Au cas par cas',
    texte: 'Décrites en open data, mais attribuées sur dossier, à barème local.',
  },
  {
    valeur: PAR_CERTITUDE.non_centralise ?? 0,
    titre: 'Hors de toute base',
    texte: 'Aides communales, extralégales, retraites complémentaires : nulle part.',
  },
]

const BLOCS = [
  {
    icone: Network,
    titre: 'Une dizaine d’acteurs, aucun chef d’orchestre',
    texte:
      'Selon sa situation, une personne âgée dépend de son conseil départemental, de sa caisse de retraite, de la CAF, de la MSA, de l’Anah, du fisc et parfois de son CCAS. Chacun a ses règles. Personne n’orchestre l’ensemble.',
  },
  {
    icone: Database,
    titre: 'Autant d’API que de logiques de calcul',
    texte:
      'Un noyau d’aides suit des formules nationales (OpenFisca). D’autres ne sont que décrites en open data (service-public.fr). Les guichets se résolvent via l’annuaire DILA. Et tout un pan n’existe dans aucune base.',
  },
  {
    icone: TriangleAlert,
    titre: 'Le non-recours se cache là où il n’y a rien à brancher',
    texte:
      'Les aides des CCAS (environ 35 000 communes), les aides extralégales des départements et l’action sociale Agirc-Arrco : c’est là que le non-recours est le plus fort, et précisément là qu’aucune API ne répond. Il faut construire l’orientation vers des acteurs humains.',
  },
  {
    icone: ShieldAlert,
    titre: 'Le risque d’inventer un montant',
    texte:
      'Un assistant conversationnel seul produit des chiffres faux. Sur des personnes âgées vulnérables, une estimation erronée crée un préjudice réel, et expose directement à l’IA Act (système à haut risque). Traiter ce risque impose une architecture pensée pour cela dès le départ.',
  },
]

export function DefiTechnique({ onNavigate }: { onNavigate: (vue: Vue) => void }) {
  return (
    <div className="mx-auto w-full max-w-projection space-y-12">
      {/* EN-TÊTE */}
      <section className="relative overflow-hidden rounded-2xl border border-etat-border bg-white p-6 shadow-carte sm:p-10">
        <Decor className="pointer-events-none absolute -right-8 -top-8 h-56 w-64 opacity-90 sm:h-72 sm:w-80" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-hover">
            Le défi
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">
            Pourquoi personne ne l’a fait jusqu’ici
          </h1>
          <p className="mt-5 text-lg text-etat-grey">
            Accéder aux droits d’une personne âgée, c’est traverser une jungle d’acteurs, de bases
            de données et de règles locales que rien ne centralise. Voici le travail réel qu’il faut
            affronter pour relier le tout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Compteur valeur={`${CATALOGUE.length}`} libelle="dispositifs recensés" />
            <Compteur valeur={`${NB_GUICHETS}`} libelle="familles de guichets" />
            <Compteur valeur={`${PAR_CERTITUDE.non_centralise ?? 0}`} libelle="catégories hors de toute API" />
          </div>
        </div>
      </section>

      {/* LES QUATRE COUCHES DE CERTITUDE */}
      <section>
        <SectionTitre
          eyebrow="Le terrain"
          titre="Toutes les aides ne se valent pas devant le calcul"
        />
        <p className="mt-3 max-w-3xl text-lg text-etat-grey">
          Derrière le mot « aide », quatre réalités très différentes. Plus on descend, moins une
          machine peut trancher seule, et plus le non-recours grandit.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COUCHES.map((c) => (
            <div key={c.titre} className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
              <p className="text-3xl font-bold text-etat-blue sm:text-4xl">{c.valeur}</p>
              <h3 className="mt-1 font-bold text-etat-ink">{c.titre}</h3>
              <p className="mt-1 text-sm text-etat-grey">{c.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LES OBSTACLES */}
      <section>
        <SectionTitre eyebrow="Les obstacles" titre="Quatre murs sur le chemin des droits" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {BLOCS.map((b) => {
            const Icone = b.icone
            return (
              <div key={b.titre} className="rounded-xl border border-etat-border bg-white p-6 shadow-carte">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-etat-blue-light text-etat-blue">
                  <Icone size={24} aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-etat-ink">{b.titre}</h3>
                <p className="mt-2 text-etat-grey">{b.texte}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* TRANSITION VERS LA SOLUTION */}
      <section className="rounded-2xl bg-etat-blue p-6 text-white sm:p-10">
        <h2 className="max-w-3xl text-2xl font-bold sm:text-3xl">
          Cette complexité n’est pas une fatalité. Elle se traite par l’architecture.
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-white/90">
          On ne réinvente rien. On assemble proprement les briques publiques existantes, de façon
          souveraine et auditable, avec un budget et des résultats mesurables.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('solution')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-etat-blue transition-colors hover:bg-etat-bg"
        >
          Voir notre solution
          <ArrowRight size={20} aria-hidden />
        </button>
      </section>
    </div>
  )
}

function SectionTitre({ eyebrow, titre }: { eyebrow: string; titre: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-hover">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{titre}</h2>
    </div>
  )
}

function Compteur({ valeur, libelle }: { valeur: string; libelle: string }) {
  return (
    <div className="rounded-xl border border-etat-border bg-etat-bg px-5 py-3">
      <span className="text-2xl font-bold text-etat-blue">{valeur}</span>
      <span className="ml-2 text-sm text-etat-grey">{libelle}</span>
    </div>
  )
}
