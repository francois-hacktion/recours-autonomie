import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Decor } from '@/components/Decor'
import { CATALOGUE } from '@/data/labyrinthe'
import { cn } from '@/lib/cn'
import type { Vue } from '@/lib/vue'

// Page d'accueil : vitrine publique de la startup d'État. Structure narrative inspirée
// de mon-entreprise.urssaf.fr : le drame, la solution, la transparence. Pensée pour la
// projection (pleine largeur paysage), très visuelle, avec les vraies données du projet.

const NB_DISPOSITIFS = CATALOGUE.length
const NB_GUICHETS = new Set(CATALOGUE.map((a) => a.gestionnaire)).size

type Accent = 'teal' | 'rose' | 'blue'

interface Demo {
  vue: Exclude<Vue, 'accueil' | 'labyrinthe'>
  emoji: string
  titre: string
  pour: string
  texte: string
  accent: Accent
}

// La démo vocale en premier : c'est le cœur de l'offre.
const DEMOS: Demo[] = [
  {
    vue: 'vocal',
    emoji: '🎙️',
    titre: 'Assistant vocal',
    pour: 'Pour qui n’aime pas les écrans',
    texte:
      'La personne âgée parle, Silneo comprend, fait calculer ses droits et prépare le contact avec le bon guichet.',
    accent: 'teal',
  },
  {
    vue: 'aidant',
    emoji: '🤝',
    titre: 'Espace aidant',
    pour: 'Pour un proche qui aide',
    texte:
      'Le tableau de bord d’un aidant qui pilote toutes les aides d’un parent : statut de chaque démarche, guichet, prochaine action.',
    accent: 'rose',
  },
  {
    vue: 'assure',
    emoji: '🧭',
    titre: 'Parcours guidé',
    pour: 'Pour l’assuré, seul',
    texte:
      'Quatre questions simples au clic, puis les aides possibles et la démarche concrète. Le parcours autonome de référence.',
    accent: 'blue',
  },
]

const ACCENT_PASTILLE: Record<Accent, string> = {
  teal: 'bg-teal-bg',
  rose: 'bg-rose-bg',
  blue: 'bg-etat-blue-light',
}

const PILIERS = [
  {
    emoji: '🧮',
    titre: 'Le calcul, jamais l’à-peu-près',
    texte:
      'Les montants viennent d’un moteur de droits déterministe (OpenFisca), jamais d’une intuition. Le système ne devine aucun chiffre.',
  },
  {
    emoji: '💬',
    titre: 'Une conversation, pas un formulaire',
    texte:
      'Silneo écoute, reçoit l’émotion et explique en langage clair, à la voix ou au clic. Aucun mur de capture, aucune donnée revendue.',
  },
  {
    emoji: '🤝',
    titre: 'Jusqu’au passage à l’acte',
    texte:
      'On prépare le premier contact avec le bon guichet, près de chez soi. On peut même envoyer le message à la place de la personne, avec son accord.',
  },
]

const TRANSPARENCE = [
  { emoji: '🔓', titre: 'Code source ouvert', texte: 'Le démonstrateur est public sur GitHub.' },
  {
    emoji: '🏛️',
    titre: 'Sources publiques',
    texte: 'OpenFisca, annuaire DILA, service-public.fr. Rien d’inventé, rien de privé.',
  },
  {
    emoji: '⚖️',
    titre: 'Conforme par construction',
    texte: 'IA Act (haut risque), RGPD, minimisation des données de santé.',
  },
]

export function Accueil({ onNavigate }: { onNavigate: (vue: Vue) => void }) {
  return (
    <div className="mx-auto w-full max-w-projection space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-etat-border bg-white p-6 shadow-carte sm:p-10">
        <Decor className="pointer-events-none absolute -right-8 -top-8 h-56 w-64 opacity-90 sm:h-72 sm:w-80" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-hover">
            Startup d’État · contre le non-recours
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">
            La technologie au service de nos aînés.
          </h1>
          <p className="mt-5 text-lg text-etat-grey">
            Chaque année, des milliards d’euros d’aides ne sont pas réclamés. Pas par manque de
            droits, mais parce que le système est devenu un labyrinthe. Nous le rendons simple,
            humain et fiable, pour que chaque personne âgée touche ce qui lui revient.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('vocal')}
              className="inline-flex items-center gap-2 rounded-lg bg-etat-blue px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-etat-blue-hover"
            >
              🎙️ Parler à Silneo
              <ArrowRight size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('labyrinthe')}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-etat-blue px-5 py-3 text-lg font-semibold text-etat-blue transition-colors hover:bg-etat-blue-light"
            >
              Voir le problème
            </button>
          </div>
        </div>
      </section>

      {/* LE DRAME */}
      <section>
        <SectionTitre eyebrow="Le drame" titre="Un labyrinthe que personne ne traverse seul" />
        <p className="mt-3 max-w-3xl text-lg text-etat-grey">
          Les aides existent, mais elles sont éclatées entre des dizaines de dispositifs et une
          dizaine de guichets, avec des règles différentes et des conditions changeantes. Pour une
          personne âgée et son aidant, s’y retrouver relève du parcours du combattant. Résultat : le
          non-recours dépasse 30 %, et les plus fragiles passent à côté de leurs droits.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatDrame valeur={`${NB_DISPOSITIFS}`} libelle="dispositifs recensés" />
          <StatDrame valeur={`${NB_GUICHETS}`} libelle="guichets différents" />
          <StatDrame valeur="+30 %" libelle="de non-recours sur certaines aides" />
          <StatDrame valeur="0" libelle="acteur pour relier le tout" />
        </div>
        <button
          type="button"
          onClick={() => onNavigate('labyrinthe')}
          className="group mt-5 inline-flex items-center gap-2 font-semibold text-etat-blue underline underline-offset-2 hover:text-etat-blue-hover"
        >
          Explorer le labyrinthe des aides
          <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </section>

      {/* LA SOLUTION */}
      <section>
        <SectionTitre eyebrow="La solution" titre="Comprendre, dialoguer, agir" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PILIERS.map((p) => (
            <div key={p.titre} className="rounded-xl border border-etat-border bg-white p-6 shadow-carte">
              <span className="text-3xl" aria-hidden>
                {p.emoji}
              </span>
              <h3 className="mt-3 text-lg font-bold text-etat-ink">{p.titre}</h3>
              <p className="mt-2 text-etat-grey">{p.texte}</p>
            </div>
          ))}
        </div>

        {/* Bandeau souveraineté */}
        <div className="mt-4 rounded-xl bg-etat-blue p-6 text-white sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80">
            <ShieldCheck size={18} aria-hidden />
            Une technologie publique et souveraine
          </p>
          <p className="mt-3 max-w-3xl text-lg">
            L’intelligence artificielle est souveraine (Albert API, opérée par l’État), hébergée en
            France sur infrastructure qualifiée, et les données ne quittent pas le territoire.
            Surtout, <strong>Silneo ne calcule jamais un droit</strong> : il dialogue et
            oriente, le calcul reste à un moteur public auditable.
          </p>
        </div>
      </section>

      {/* DÉMOS */}
      <section>
        <SectionTitre eyebrow="Le démonstrateur" titre="Voyez l’expérience, écran par écran" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {DEMOS.map((d) => (
            <button
              key={d.vue}
              type="button"
              onClick={() => onNavigate(d.vue)}
              className="group flex h-full flex-col rounded-xl border border-etat-border bg-white p-5 text-left shadow-carte transition-all hover:-translate-y-0.5 hover:border-etat-blue"
            >
              <span
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full text-2xl',
                  ACCENT_PASTILLE[d.accent],
                )}
                aria-hidden
              >
                {d.emoji}
              </span>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-etat-grey">
                {d.pour}
              </p>
              <h3 className="mt-1 text-lg font-bold text-etat-ink">{d.titre}</h3>
              <p className="mt-2 flex-1 text-sm text-etat-grey">{d.texte}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-etat-blue">
                Ouvrir la démo
                <ArrowRight
                  size={18}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* TRANSPARENCE */}
      <section>
        <SectionTitre eyebrow="Startup d’État" titre="La confiance par la transparence" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {TRANSPARENCE.map((t) => (
            <div key={t.titre} className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
              <span className="text-2xl" aria-hidden>
                {t.emoji}
              </span>
              <h3 className="mt-2 font-bold text-etat-ink">{t.titre}</h3>
              <p className="mt-1 text-sm text-etat-grey">{t.texte}</p>
            </div>
          ))}
        </div>
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

function StatDrame({ valeur, libelle }: { valeur: string; libelle: string }) {
  return (
    <div className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
      <p className="text-3xl font-bold text-etat-blue sm:text-4xl">{valeur}</p>
      <p className="mt-1 text-sm text-etat-grey">{libelle}</p>
    </div>
  )
}
