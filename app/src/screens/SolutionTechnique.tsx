import {
  ArrowRight,
  Building2,
  Calculator,
  CalendarClock,
  Gauge,
  HandCoins,
  Handshake,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Decor } from '@/components/Decor'
import type { Vue } from '@/lib/vue'

// Page décideurs : notre solution, mais côté décision. On répond au défi avec des besoins
// concrets, un budget en euros et des résultats attendus (KPI). Tous les chiffres viennent
// de docs/conduite-du-changement.md (ordres de grandeur à valider, jamais des devis).

// Notre approche, en bref : la séparation moteur / assistant est le différenciateur.
const APPROCHE = [
  {
    icone: Calculator,
    titre: 'Le moteur calcule',
    texte: 'Les montants sortent d’OpenFisca, moteur public déterministe et auditable. Aucun chiffre inventé.',
  },
  {
    icone: Handshake,
    titre: 'L’assistant oriente',
    texte: 'Il dialogue en langage clair, vulgarise, et prépare le contact avec le bon guichet (annuaire DILA).',
  },
  {
    icone: ShieldCheck,
    titre: 'Souverain et conforme',
    texte: 'Modèles hébergés en France (Albert API), données qui ne sortent pas du territoire, RGPD et IA Act.',
  },
]

// Les besoins concrets pour passer du démonstrateur au pilote réel.
const BESOINS = [
  {
    icone: Building2,
    titre: 'Une administration porteuse et l’accès Albert',
    texte:
      'L’infrastructure souveraine Albert API (DINUM) exige un porteur public. C’est le verrou n°1. Repli Mistral EU pendant l’instruction. Premier test prioritaire : le function-calling vers le moteur.',
  },
  {
    icone: MapPin,
    titre: '1 à 3 départements pilotes',
    texte:
      'Un service autonomie moteur, une taille de 500 000 à 1,5 million d’habitants, une couverture CCAS dense, une appétence pour l’expérimentation numérique. Le non-recours élevé est un atout, pas un frein.',
  },
  {
    icone: Users,
    titre: 'Un sponsor à trois niveaux',
    texte:
      'CNSA pour la légitimité et les données d’offre, DINUM pour Albert et l’hébergement, conseil départemental comme porteur opérationnel. Le département suffit pour démarrer.',
  },
  {
    icone: Target,
    titre: 'Une équipe resserrée',
    texte:
      'Un chef de projet, un profil technico-produit, un référent terrain, un juriste RGPD / IA Act pour la mise en conformité. 2 à 4 ETP selon la couverture visée.',
  },
]

// Budget d'un pilote, première année. Ordres de grandeur à valider (source : conduite du changement).
const BUDGET = [
  { poste: 'Équipe produit et technique', detail: '2 à 4 ETP', montant: '200 000 à 400 000 € / an' },
  { poste: 'Formation des agents de guichet', detail: '1 département', montant: '15 000 à 40 000 €' },
  { poste: 'Communication terrain', detail: 'CCAS, affiches, relais locaux', montant: '5 000 à 20 000 €' },
  { poste: 'Conformité juridique', detail: 'audit RGPD / IA Act, DPO', montant: '10 000 à 30 000 €' },
  { poste: 'Inférence du modèle en développement', detail: 'Mistral EU avant Albert, gratuit en cible', montant: 'quelques milliers € / mois' },
]

// Résultats attendus. Cibles indicatives à valider en pilote, pas des promesses.
const KPIS = [
  {
    icone: Gauge,
    valeur: '> 70 %',
    titre: 'Taux de complétion',
    texte: 'des personnes qui commencent le parcours vont jusqu’au bout, voix ou clavier.',
  },
  {
    icone: TrendingUp,
    valeur: '1 sur 2',
    titre: 'Activation des droits',
    texte: 'des sessions débouchent sur une mise en relation engagée avec un guichet.',
  },
  {
    icone: PhoneCall,
    valeur: '> 80 %',
    titre: 'Réponse des guichets',
    texte: 'des contacts transmis sont effectivement traités par les CCAS et départements.',
  },
  {
    icone: HandCoins,
    valeur: '≈ 1 150 € / mois',
    titre: 'Droits activés par dossier',
    texte: 'rendus à la personne quand l’APA et l’ASPA s’ouvrent. C’est le ROI social mesuré.',
  },
]

// Roadmap indicative (ordres de grandeur de durée à valider).
const PHASES = [
  {
    rang: 'Phase 0',
    titre: 'Cadrage et sécurisation',
    duree: '1 à 2 mois',
    texte: 'Administration porteuse, accès Albert, test du function-calling, choix des pilotes, constitution de l’équipe.',
  },
  {
    rang: 'Phase 1',
    titre: 'Pilote terrain',
    duree: '3 à 6 mois',
    texte: 'Un département, quelques CCAS volontaires, formation des référents, mesure hebdomadaire, itérations courtes.',
  },
  {
    rang: 'Phase 2',
    titre: 'Extension et consolidation',
    duree: '6 à 18 mois',
    texte: '2 à 3 départements, formation à l’échelle, tableau de bord partagé avec les conseils départementaux.',
  },
  {
    rang: 'Phase 3',
    titre: 'Passage à l’échelle',
    duree: '18 mois et +',
    texte: 'Quotas étendus négociés avec la DINUM, couverture nationale par vagues, conventionnement CNSA.',
  },
]

export function SolutionTechnique({ onNavigate }: { onNavigate: (vue: Vue) => void }) {
  return (
    <div className="mx-auto w-full max-w-projection space-y-12">
      {/* EN-TÊTE */}
      <section className="relative overflow-hidden rounded-2xl border border-etat-border bg-white p-6 shadow-carte sm:p-10">
        <Decor className="pointer-events-none absolute -right-8 -top-8 h-56 w-64 opacity-90 sm:h-72 sm:w-80" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-hover">
            Notre solution
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">
            Concrète, chiffrée, mesurable
          </h1>
          <p className="mt-5 text-lg text-etat-grey">
            On ne réinvente rien : on assemble des briques publiques existantes, de façon souveraine.
            Voici ce que nous faisons, ce qu’il nous faut pour le déployer, et les résultats que nous
            visons. Les montants sont des ordres de grandeur à valider, pas des devis.
          </p>
        </div>
      </section>

      {/* NOTRE APPROCHE EN BREF */}
      <section>
        <SectionTitre eyebrow="Notre approche" titre="Le moteur calcule, l’assistant oriente" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {APPROCHE.map((a) => {
            const Icone = a.icone
            return (
              <div key={a.titre} className="rounded-xl border border-etat-border bg-white p-6 shadow-carte">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-bg text-teal-hover">
                  <Icone size={24} aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-etat-ink">{a.titre}</h3>
                <p className="mt-2 text-etat-grey">{a.texte}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CE QU'IL NOUS FAUT */}
      <section>
        <SectionTitre eyebrow="Les besoins concrets" titre="Ce qu’il nous faut pour passer au réel" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {BESOINS.map((b) => {
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

      {/* LE BUDGET */}
      <section>
        <SectionTitre eyebrow="Le budget" titre="Ce que coûte un pilote, la première année" />
        <div className="mt-6 rounded-2xl border border-etat-border bg-white p-6 shadow-carte sm:p-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-etat-border pb-5">
            <span className="text-3xl font-bold text-etat-blue sm:text-4xl">250 000 à 500 000 €</span>
            <span className="text-etat-grey">pour un pilote sur un département, première année.</span>
          </div>
          <ul className="mt-5 space-y-3">
            {BUDGET.map((b) => (
              <li
                key={b.poste}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-etat-border/60 pb-3 last:border-0 last:pb-0"
              >
                <span className="min-w-0">
                  <span className="font-semibold text-etat-ink">{b.poste}</span>
                  <span className="ml-2 text-sm text-etat-grey">{b.detail}</span>
                </span>
                <span className="font-bold text-etat-blue">{b.montant}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2 rounded-lg bg-or-bg p-3 text-sm text-or-ink">
            <Wallet size={16} className="mt-0.5 shrink-0" aria-hidden />
            Fourchettes larges par construction : la borne basse correspond à un portage interne
            (équipe beta.gouv, incubateur public), la borne haute à un pilote avec prestataires
            externes et communication active. En cible, l’inférence sur Albert est gratuite.
          </p>
        </div>
      </section>

      {/* LES RÉSULTATS ATTENDUS */}
      <section>
        <SectionTitre eyebrow="Les résultats attendus" titre="Ce que nous mesurons, dès le pilote" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => {
            const Icone = k.icone
            return (
              <div key={k.titre} className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-valide-bg text-valide">
                  <Icone size={20} aria-hidden />
                </span>
                <p className="mt-3 text-2xl font-bold text-etat-ink">{k.valeur}</p>
                <h3 className="mt-1 font-bold text-etat-ink">{k.titre}</h3>
                <p className="mt-1 text-sm text-etat-grey">{k.texte}</p>
              </div>
            )
          })}
        </div>
        <p className="mt-4 text-sm italic text-etat-grey">
          Cibles indicatives à valider en pilote. Au-delà des chiffres, le résultat de fond est une
          baisse mesurable du non-recours sur le territoire et un retour social sur investissement
          documenté pour les décideurs.
        </p>
      </section>

      {/* ROADMAP */}
      <section>
        <SectionTitre eyebrow="La trajectoire" titre="Du cadrage au passage à l’échelle" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((p) => (
            <div key={p.rang} className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
              <div className="flex items-center gap-2 text-teal-hover">
                <CalendarClock size={18} aria-hidden />
                <span className="text-sm font-semibold uppercase tracking-wide">{p.rang}</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-etat-ink">{p.titre}</h3>
              <p className="text-sm font-semibold text-etat-blue">{p.duree}</p>
              <p className="mt-2 text-sm text-etat-grey">{p.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-etat-blue p-6 text-white sm:p-10">
        <h2 className="max-w-3xl text-2xl font-bold sm:text-3xl">
          Une solution prête à être pilotée, pas une promesse.
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-white/90">
          Le démonstrateur montre déjà l’expérience de bout en bout. La suite, c’est un département,
          un sponsor, et l’accès Albert.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('vocal')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-etat-blue transition-colors hover:bg-etat-bg"
        >
          🎙️ Voir l’assistant en action
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
