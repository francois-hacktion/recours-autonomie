/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Charte recalée sur le simulateur URSSAF / mon-entreprise (beta.gouv),
        // d'après la capture du site : bleu roi profond pour le primaire et le texte,
        // accent turquoise, neutres frais. Adaptée à un public âgé (contraste renforcé).
        etat: {
          blue: '#1E3D8E', // bleu roi URSSAF (primaire, titres, boutons)
          'blue-hover': '#16306F',
          'blue-light': '#DEE6F7', // fond doux bleu (pastilles, encarts)
          ink: '#1D2B5C', // texte principal, bleu marine très foncé (contraste fort)
          grey: '#4A5578', // texte secondaire, bleu-gris
          border: '#D6DCEA', // bordures fraîches
          bg: '#F6F8FC', // fond de page quasi-blanc bleuté
          white: '#FFFFFF',
        },
        // Accents de la charte URSSAF : turquoise, or et rose, pour réchauffer
        // l'interface (icônes, encadrés, décors géométriques).
        teal: '#1AA3B5',
        'teal-hover': '#14808D',
        'teal-bg': '#E3F4F6',
        or: '#C2912A',
        'or-bg': '#FBF4D0',
        'or-ink': '#5C4A12',
        rose: '#E07BA6',
        'rose-bg': '#FBE7F0',
        // Sémantique des résultats (conservée, déjà calée RGAA). L'ambre fait écho
        // à l'or des encadrés d'avertissement URSSAF.
        valide: '#18753C', // droit ouvert, calcul fiable
        'valide-bg': '#E3FBE3',
        estim: '#B34000', // estimation à confirmer
        'estim-bg': '#FEECC2',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      maxWidth: {
        lecture: '46rem', // colonne de lecture étroite (conversation)
        projection: '80rem', // pleine largeur paysage pour la projection
      },
      // Ombre douce des cartes, dans l'esprit aéré du simulateur URSSAF.
      boxShadow: {
        carte: '0 1px 3px rgba(27, 27, 53, 0.06), 0 6px 20px rgba(27, 27, 53, 0.05)',
      },
    },
  },
  plugins: [],
}
