import { ArrowRight } from 'lucide-react'
import { Decor } from '@/components/Decor'
import { cn } from '@/lib/cn'
import type { Vue } from '@/lib/vue'

// Page d'accueil : choisit l'un des trois points de vue du démonstrateur.
// Un même moteur de droits, plusieurs portes d'entrée selon la personne.

type Accent = 'teal' | 'rose' | 'blue'

interface Demo {
  vue: Exclude<Vue, 'accueil' | 'labyrinthe'>
  emoji: string
  titre: string
  pour: string
  texte: string
  accent: Accent
}

const DEMOS: Demo[] = [
  {
    vue: 'aidant',
    emoji: '🤝',
    titre: 'Espace aidant',
    pour: 'Pour un proche qui aide',
    texte:
      'Le tableau de bord d’un aidant qui pilote toutes les aides d’un parent : où en est chaque démarche, quel guichet, quelle prochaine action.',
    accent: 'teal',
  },
  {
    vue: 'vocal',
    emoji: '🎙️',
    titre: 'Assistant vocal',
    pour: 'Pour qui n’aime pas les écrans',
    texte:
      'La personne âgée parle, l’assistant comprend. On répond à la complexité par une conversation, pas par un formulaire.',
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

export function Accueil({ onNavigate }: { onNavigate: (vue: Vue) => void }) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Hero avec décor géométrique URSSAF. */}
      <div className="relative overflow-hidden rounded-2xl border border-etat-border bg-white p-6 shadow-carte sm:p-8">
        <Decor className="pointer-events-none absolute -right-6 -top-6 h-44 w-52 opacity-90 sm:h-52 sm:w-64" />
        <div className="relative max-w-lecture">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Aller chercher les aides que personne ne réclame. 👋
          </h1>
          <p className="mt-4 text-etat-grey">
            Plus de 30 % des personnes âgées ne demandent pas les aides auxquelles elles ont droit.
            Le droit, lui, est calculable. Ce qui manque, c’est de comprendre, de fournir les bonnes
            informations et de passer à l’acte. Voici trois manières de lever ces freins, autour
            d’un même moteur de droits.
          </p>
        </div>
      </div>

      {/* Encadré "bon à savoir", dans l'esprit doré URSSAF. */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-or bg-or-bg px-4 py-3">
        <span className="text-xl" aria-hidden>
          💡
        </span>
        <p className="text-or-ink">
          <strong>Bon à savoir :</strong> ce démonstrateur illustre l’expérience. Les montants sont
          fictifs et calculés par un moteur de droits, jamais inventés par l’assistant.
        </p>
      </div>

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
            <h2 className="mt-1 text-lg font-bold text-etat-ink">{d.titre}</h2>
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

      {/* Le problème, avant les démos : le labyrinthe des aides. */}
      <button
        type="button"
        onClick={() => onNavigate('labyrinthe')}
        className="group mt-4 flex w-full items-center gap-4 rounded-xl border border-etat-border bg-white p-5 text-left shadow-carte transition-colors hover:border-etat-blue hover:bg-etat-blue-light"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-etat-blue-light text-2xl" aria-hidden>
          🧩
        </span>
        <span className="flex-1">
          <span className="block font-bold text-etat-ink">
            D’abord, le problème : le labyrinthe des aides
          </span>
          <span className="block text-sm text-etat-grey">
            Des dizaines de dispositifs, une dizaine de guichets, des certitudes inégales. Voir
            pourquoi le non-recours dépasse 30 %.
          </span>
        </span>
        <ArrowRight
          size={20}
          aria-hidden
          className="shrink-0 text-etat-blue transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </div>
  )
}
