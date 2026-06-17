import { Info } from 'lucide-react'

// Bannière honnêteté : on ne masque jamais qu'il s'agit d'un démonstrateur.
export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-etat-ink px-4 py-2 text-center text-sm text-white">
      <Info size={16} aria-hidden className="shrink-0" />
      <span>
        Démonstrateur à fin de présentation. Données et montants fictifs, aucune information n’est
        collectée ni transmise.
      </span>
    </div>
  )
}
