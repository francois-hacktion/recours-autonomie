import { useState } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { DemoBanner } from '@/components/DemoBanner'
import { Accueil } from '@/screens/Accueil'
import { ParcoursAssure } from '@/screens/ParcoursAssure'
import { EspaceAidant } from '@/screens/EspaceAidant'
import { AssistantVocal } from '@/screens/AssistantVocal'
import { Labyrinthe } from '@/screens/Labyrinthe'
import type { Vue } from '@/lib/vue'

// Coquille de l'application : navigation par état en mémoire, pas de routing serveur.
// Un seul index.html, ouvrable en double-clic.

const TITRES: Record<Vue, string> = {
  accueil: 'Vos aides à l’autonomie, simplement',
  assure: 'Parcours guidé',
  aidant: 'Espace aidant',
  vocal: 'Assistant vocal',
  labyrinthe: 'Le labyrinthe des aides',
}

export default function App() {
  const [vue, setVue] = useState<Vue>('accueil')

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <Header vue={vue} onAccueil={() => setVue('accueil')} />
      <main className="flex-1 px-4 py-8 sm:py-12">
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

function Header({ vue, onAccueil }: { vue: Vue; onAccueil: () => void }) {
  return (
    <header className="border-b border-etat-border bg-white">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={onAccueil}
          className="flex items-center gap-3 text-left"
          aria-label="Revenir à l’accueil"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded bg-etat-blue text-white">
            <ShieldCheck size={22} aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-etat-ink">Recours Autonomie</span>
            <span className="block text-sm text-etat-grey">{TITRES[vue]}</span>
          </span>
        </button>

        {vue !== 'accueil' && (
          <button
            type="button"
            onClick={onAccueil}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-etat-border px-3 py-2 text-sm font-semibold text-etat-blue transition-colors hover:bg-etat-blue-light"
          >
            <ArrowLeft size={16} aria-hidden />
            Accueil
          </button>
        )}
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
