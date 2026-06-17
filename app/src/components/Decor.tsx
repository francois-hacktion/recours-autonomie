// Décor géométrique inspiré de la charte URSSAF : arcs et cercles fins en or, rose
// et turquoise, posés en coin pour réchauffer la page. Purement décoratif, SVG inline
// (aucun appel réseau), masqué aux lecteurs d'écran.
export function Decor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grand cercle or */}
      <circle cx="170" cy="60" r="48" stroke="#C2912A" strokeWidth="3" />
      {/* Arc turquoise */}
      <path d="M60 150 A70 70 0 0 1 130 80" stroke="#1AA3B5" strokeWidth="3" />
      {/* Quart de cercle rose */}
      <path d="M210 150 A40 40 0 0 0 170 110" stroke="#E07BA6" strokeWidth="3" />
      {/* Petit cercle plein turquoise */}
      <circle cx="120" cy="150" r="6" fill="#1AA3B5" />
      {/* Cercle bleu */}
      <circle cx="205" cy="120" r="22" stroke="#1E3D8E" strokeWidth="3" />
      {/* Point or */}
      <circle cx="95" cy="95" r="5" fill="#C2912A" />
    </svg>
  )
}
