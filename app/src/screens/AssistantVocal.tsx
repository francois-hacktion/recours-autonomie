import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  Info,
  Loader2,
  Mic,
  RotateCcw,
  TriangleAlert,
  Volume2,
} from 'lucide-react'
import { DIALOGUE_VOCAL } from '@/data/dialogueVocal'
import { calculerDroits, formaterEuros, type Situation } from '@/lib/moteur'

// Démonstrateur de l'assistant vocal. La personne âgée parle ; l'assistant pose des
// questions et la "dictée" s'affiche en transcription progressive (effet parole en
// direct). Tout est scripté : on montre que l'outil comprend une parole spontanée.
//
// L'aidant ou le présentateur fait avancer chaque tour : appuyer pour faire "parler"
// la personne, puis confirmer. Le calcul des montants reste dans le moteur déterministe.

type Phase = 'dialogue' | 'calcul' | 'resultats'
type SousEtape = 'prete' | 'ecoute' | 'comprise'

export function AssistantVocal() {
  const [phase, setPhase] = useState<Phase>('dialogue')
  const [tour, setTour] = useState(0)
  const [sousEtape, setSousEtape] = useState<SousEtape>('prete')
  const [chars, setChars] = useState(0)

  const courant = DIALOGUE_VOCAL[tour]

  // Révélation progressive de la dictée, pour l'effet "transcription en direct".
  useEffect(() => {
    if (sousEtape !== 'ecoute') return
    const texte = courant.dictee
    if (chars >= texte.length) {
      const fin = setTimeout(() => setSousEtape('comprise'), 350)
      return () => clearTimeout(fin)
    }
    const t = setTimeout(() => setChars((c) => Math.min(texte.length, c + 2)), 28)
    return () => clearTimeout(t)
  }, [sousEtape, chars, courant])

  // Étape moteur visible avant la restitution.
  useEffect(() => {
    if (phase !== 'calcul') return
    const t = setTimeout(() => setPhase('resultats'), 1900)
    return () => clearTimeout(t)
  }, [phase])

  function parler() {
    setChars(0)
    setSousEtape('ecoute')
  }

  function continuer() {
    if (tour < DIALOGUE_VOCAL.length - 1) {
      setTour((t) => t + 1)
      setSousEtape('prete')
      setChars(0)
    } else {
      setPhase('calcul')
    }
  }

  function recommencer() {
    setPhase('dialogue')
    setTour(0)
    setSousEtape('prete')
    setChars(0)
  }

  if (phase === 'resultats') {
    return <RestitutionVocale onRestart={recommencer} />
  }

  return (
    <div className="mx-auto w-full max-w-lecture space-y-4">
      {/* Historique des échanges déjà compris. */}
      {DIALOGUE_VOCAL.slice(0, tour).map((t) => (
        <div key={t.champ} className="space-y-2">
          <BulleAssistant texte={t.assistant} />
          <BulleParole texte={t.dictee} terminee />
          <Comprehension texte={t.comprisComme} />
        </div>
      ))}

      {phase === 'dialogue' && (
        <div className="space-y-2">
          <BulleAssistant texte={courant.assistant} />

          {sousEtape === 'prete' && <BulleInfo texte={courant.rassurance} />}

          {sousEtape !== 'prete' && (
            <BulleParole
              texte={courant.dictee.slice(0, sousEtape === 'comprise' ? undefined : chars)}
              terminee={sousEtape === 'comprise'}
              enCours={sousEtape === 'ecoute'}
            />
          )}

          {sousEtape === 'comprise' && <Comprehension texte={courant.comprisComme} />}

          {/* Commande de pilotage : micro puis confirmation. */}
          <div className="flex flex-col items-center gap-3 pt-4">
            {sousEtape === 'prete' && <BoutonMicro onClick={parler} />}
            {sousEtape === 'ecoute' && <MicroEnEcoute />}
            {sousEtape === 'comprise' && (
              <button
                type="button"
                onClick={continuer}
                className="inline-flex items-center gap-2 rounded-lg bg-etat-blue px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-etat-blue-hover"
              >
                {tour < DIALOGUE_VOCAL.length - 1 ? 'Question suivante' : 'Vérifier mes droits'}
                <ArrowRight size={20} aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'calcul' && <EtapeMoteur />}
    </div>
  )
}

function BulleAssistant({ texte }: { texte: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal text-white">
        <Volume2 size={16} aria-hidden />
      </span>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-etat-border">
        <p className="text-etat-ink">{texte}</p>
      </div>
    </div>
  )
}

function BulleParole({
  texte,
  terminee,
  enCours,
}: {
  texte: string
  terminee?: boolean
  enCours?: boolean
}) {
  return (
    <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-etat-blue px-4 py-3 text-white">
      <p aria-live="polite">
        <span className="italic">«&nbsp;{texte}</span>
        {enCours && <span className="ml-0.5 animate-pulse">▍</span>}
        {terminee && <span className="not-italic"> »</span>}
      </p>
    </div>
  )
}

// Confirmation chaleureuse : l'assistant reçoit ce qui a été dit, sans étiquette froide.
function Comprehension({ texte }: { texte: string }) {
  return (
    <p className="flex max-w-[88%] items-start gap-1.5 pl-10 text-sm italic text-teal-hover">
      <BadgeCheck size={15} className="mt-0.5 shrink-0 text-teal" aria-hidden />
      {texte}
    </p>
  )
}

// Bulle de réassurance, pour apaiser pendant que la personne réfléchit.
function BulleInfo({ texte }: { texte: string }) {
  return (
    <div className="ml-10 flex max-w-[85%] items-start gap-2 rounded-xl border border-teal/30 bg-teal-bg px-3 py-2 text-sm text-teal-hover">
      <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
      <span>{texte}</span>
    </div>
  )
}

function BoutonMicro({ onClick }: { onClick: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label="Appuyer pour faire parler la personne"
        className="flex h-20 w-20 items-center justify-center rounded-full bg-etat-blue text-white shadow-md transition-colors hover:bg-etat-blue-hover"
      >
        <Mic size={32} aria-hidden />
      </button>
      <p className="text-sm font-medium text-etat-grey">Appuyer pour parler</p>
    </>
  )
}

function MicroEnEcoute() {
  return (
    <>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-etat-blue-light">
        <Onde />
      </div>
      <p className="text-sm font-medium text-teal-hover">Écoute en cours…</p>
    </>
  )
}

// Ondes vocales animées (CSS pur).
function Onde() {
  const delais = [0, 0.15, 0.3, 0.45, 0.6]
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {delais.map((d, i) => (
        <span
          key={i}
          className="barre-onde h-8 w-1.5 rounded-full bg-teal"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </div>
  )
}

function EtapeMoteur() {
  return (
    <div
      aria-live="polite"
      className="flex items-start gap-3 rounded-lg border border-etat-blue-light bg-etat-blue-light px-4 py-4"
    >
      <Loader2 size={22} className="mt-0.5 shrink-0 animate-spin text-etat-blue" aria-hidden />
      <div>
        <p className="font-semibold text-etat-blue">Je vérifie vos droits, un instant…</p>
        <p className="mt-1 text-sm text-etat-ink">
          Je transmets vos réponses à notre moteur de calcul. Pour ne jamais vous induire en erreur,
          c’est lui qui calcule les montants, pas moi : aucun chiffre n’est inventé.
        </p>
      </div>
    </div>
  )
}

function RestitutionVocale({ onRestart }: { onRestart: () => void }) {
  // La situation est reconstruite à partir des paroles comprises, puis calculée.
  const situation = useMemo(
    () =>
      Object.fromEntries(DIALOGUE_VOCAL.map((t) => [t.champ, t.valeur])) as unknown as Situation,
    [],
  )
  const resultats = calculerDroits(situation)
  const ouverts = resultats.filter((r) => r.eligible)

  // Petit accusé "à voix haute" en tête de restitution.
  const annonceRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    annonceRef.current?.focus()
  }, [])

  return (
    <div className="mx-auto w-full max-w-lecture space-y-5">
      <div className="rounded-xl border border-etat-blue bg-etat-blue p-5 text-white">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80">
          <Volume2 size={16} aria-hidden />
          L’assistant vous répond
        </p>
        <p ref={annonceRef} tabIndex={-1} className="mt-2 text-lg outline-none">
          Merci Jeanne, et bravo d’être allée au bout 🤍 D’après ce que vous m’avez confié, vous
          pouvez demander {ouverts.length} aide{ouverts.length > 1 ? 's' : ''}. Je vous les explique
          une par une, calmement, avec la démarche pour chacune.
        </p>
      </div>

      {resultats.map((r) => (
        <CarteResultatVocal key={r.aide} r={r} />
      ))}

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-etat-blue px-5 py-3 font-semibold text-etat-blue transition-colors hover:bg-etat-blue-light"
      >
        <RotateCcw size={18} aria-hidden />
        Refaire l’échange vocal
      </button>
    </div>
  )
}

function CarteResultatVocal({ r }: { r: ReturnType<typeof calculerDroits>[number] }) {
  const fiable = r.fiabilite === 'calcul_national'
  return (
    <article className="rounded-xl border border-etat-border bg-white shadow-carte p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-bold">{r.libelle}</h3>
        {r.eligible &&
          (fiable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-valide-bg px-3 py-1 text-sm font-semibold text-valide">
              <BadgeCheck size={16} aria-hidden />
              Montant national fiable
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-estim-bg px-3 py-1 text-sm font-semibold text-estim">
              <TriangleAlert size={16} aria-hidden />
              Estimation, à confirmer
            </span>
          ))}
      </div>

      {r.eligible && r.montantMensuel !== null ? (
        <p className="mt-3 text-3xl font-bold text-etat-ink">
          {fiable ? 'Jusqu’à ' : '≈ '}
          {formaterEuros(r.montantMensuel)}
          <span className="text-base font-medium text-etat-grey"> / mois</span>
        </p>
      ) : (
        <p className="mt-3 font-semibold text-etat-grey">Non concerné dans votre situation.</p>
      )}

      <p className="mt-3 text-etat-ink">{r.resume}</p>

      <div className="mt-4 border-t border-etat-border pt-4">
        <p className="font-semibold text-etat-ink">{r.demarche.texte}</p>
        <p className="text-sm text-etat-grey">Guichet : {r.demarche.guichet}</p>
        <a
          href={r.demarche.lien}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 font-medium text-etat-blue underline underline-offset-2 hover:text-etat-blue-hover"
        >
          Voir la fiche officielle service-public.fr
          <ExternalLink size={16} aria-hidden />
        </a>
      </div>
    </article>
  )
}
