import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { DemoBanner } from '@/components/DemoBanner'
import { Accueil } from '@/screens/Accueil'
import { ParcoursAssure } from '@/screens/ParcoursAssure'
import { EspaceAidant } from '@/screens/EspaceAidant'
import { AssistantVocal } from '@/screens/AssistantVocal'
import { Labyrinthe } from '@/screens/Labyrinthe'
import { cn } from '@/lib/cn'
import type { Vue } from '@/lib/vue'

// Coquille de l'application : navigation par onglets, état en mémoire, pas de routing.
// Un seul index.html. Onglets ordonnés pour la présentation, la démo vocale en tête.

const ONGLETS: { vue: Vue; label: string }[] = [
  { vue: 'accueil', label: 'Accueil' },
  { vue: 'labyrinthe', label: 'Le problème' },
  { vue: 'vocal', label: 'Assistant vocal' },
  { vue: 'aidant', label: 'Espace aidant' },
  { vue: 'assure', label: 'Parcours guidé' },
]

export default function App() {
  const [vue, setVue] = useState<Vue>('accueil')

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <Header vue={vue} onNavigate={setVue} />
      <main className="flex-1 px-4 py-6 sm:py-8">
        {vue === 'accueil' && <Accueil onNavigate={setVue} />}
        {vue === 'assure' && <ParcoursAssure />}
        {vue === 'aidant' && <EspaceAidant />}
        {vue === 'vocal' && <AssistantVocal />}
        {vue === 'labyrinthe' && <Labyrinthe />}
      </main>
      <Footer />
    </div>
  )
}

function Header({ vue, onNavigate }: { vue: Vue; onNavigate: (vue: Vue) => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-etat-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-projection flex-wrap items-center gap-x-4 px-4">
        <button
          type="button"
          onClick={() => onNavigate('accueil')}
          className="flex items-center gap-2.5 py-3 text-left"
          aria-label="Revenir à l’accueil"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded bg-etat-blue text-white">
            <ShieldCheck size={20} aria-hidden />
          </span>
          <span className="text-base font-bold text-etat-ink">Recours Autonomie</span>
        </button>

        <nav
          className="flex flex-1 items-center gap-1 overflow-x-auto"
          aria-label="Navigation principale"
        >
          {ONGLETS.map((o) => {
            const actif = vue === o.vue
            return (
              <button
                key={o.vue}
                type="button"
                onClick={() => onNavigate(o.vue)}
                aria-current={actif ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:text-base',
                  actif
                    ? 'border-etat-blue text-etat-blue'
                    : 'border-transparent text-etat-grey hover:border-etat-border hover:text-etat-blue',
                )}
              >
                {o.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-etat-border bg-white px-4 py-5 text-center text-sm text-etat-grey">
      Recours Autonomie · démonstrateur pédagogique MSIT · sans lien avec un service public réel.
    </footer>
  )
}
