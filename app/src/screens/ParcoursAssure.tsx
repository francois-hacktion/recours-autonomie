import { useEffect, useReducer } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  Loader2,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react'
import { QUESTIONS } from '@/data/questions'
import {
  calculerDroits,
  formaterEuros,
  type ResultatDroit,
  type Situation,
} from '@/lib/moteur'
import { cn } from '@/lib/cn'

// Parcours conversationnel de l'assuré, par clic. Machine à états en mémoire,
// pas de routing ni de backend.
type Phase = 'intro' | 'dialogue' | 'calcul' | 'resultats'

interface State {
  phase: Phase
  etape: number
  reponses: Partial<Situation>
}

type Action =
  | { type: 'demarrer' }
  | { type: 'repondre'; champ: keyof Situation; valeur: string; label: string }
  | { type: 'calcul_termine' }
  | { type: 'recommencer' }

const initialState: State = { phase: 'intro', etape: 0, reponses: {} }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'demarrer':
      return { ...state, phase: 'dialogue', etape: 0, reponses: {} }
    case 'repondre': {
      const reponses = { ...state.reponses, [action.champ]: action.valeur }
      const derniere = state.etape >= QUESTIONS.length - 1
      return {
        ...state,
        reponses,
        etape: derniere ? state.etape : state.etape + 1,
        phase: derniere ? 'calcul' : 'dialogue',
      }
    }
    case 'calcul_termine':
      return { ...state, phase: 'resultats' }
    case 'recommencer':
      return initialState
    default:
      return state
  }
}

export function ParcoursAssure() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Étape "moteur" visible : laisse le temps de lire que le calcul vient du moteur.
  useEffect(() => {
    if (state.phase !== 'calcul') return
    const t = setTimeout(() => dispatch({ type: 'calcul_termine' }), 1900)
    return () => clearTimeout(t)
  }, [state.phase])

  return (
    <div className="mx-auto w-full max-w-lecture">
      {state.phase === 'intro' && <Intro onStart={() => dispatch({ type: 'demarrer' })} />}
      {(state.phase === 'dialogue' || state.phase === 'calcul') && (
        <Dialogue state={state} dispatch={dispatch} />
      )}
      {state.phase === 'resultats' && (
        <Resultats
          situation={state.reponses as Situation}
          onRestart={() => dispatch({ type: 'recommencer' })}
        />
      )}
    </div>
  )
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-xl border border-etat-border bg-white shadow-carte p-6 sm:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">
        Vous avez peut-être droit à des aides sans le savoir.
      </h1>
      <p className="mt-4 text-etat-grey">
        Beaucoup de personnes âgées ne demandent pas les aides auxquelles elles ont droit, faute
        d’information. En quelques questions simples, voyons ensemble ce que vous pouvez demander.
      </p>
      <ul className="mt-6 space-y-2 text-etat-ink">
        <li className="flex items-start gap-2">
          <BadgeCheck size={20} className="mt-0.5 shrink-0 text-etat-blue" aria-hidden />
          Quatre questions, environ deux minutes.
        </li>
        <li className="flex items-start gap-2">
          <BadgeCheck size={20} className="mt-0.5 shrink-0 text-etat-blue" aria-hidden />
          Aucune donnée enregistrée, aucun justificatif à fournir.
        </li>
        <li className="flex items-start gap-2">
          <BadgeCheck size={20} className="mt-0.5 shrink-0 text-etat-blue" aria-hidden />
          À la fin, la démarche concrète pour faire votre demande.
        </li>
      </ul>
      <button
        type="button"
        onClick={onStart}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-etat-blue px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-etat-blue-hover"
      >
        Commencer
        <ArrowRight size={20} aria-hidden />
      </button>
    </div>
  )
}

function Dialogue({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const questionsRepondues = QUESTIONS.slice(0, state.etape)
  const questionCourante = state.phase === 'dialogue' ? QUESTIONS[state.etape] : null

  return (
    <div className="space-y-4">
      {/* Historique de la conversation. */}
      {questionsRepondues.map((q) => {
        const valeur = state.reponses[q.champ]
        const choisi = q.options.find((o) => String(o.valeur) === valeur)
        return (
          <div key={q.champ} className="space-y-3">
            <BulleAssistant texte={q.assistant} />
            {choisi && <BulleUtilisateur texte={choisi.label} />}
          </div>
        )
      })}

      {/* Question en cours. */}
      {questionCourante && (
        <div className="space-y-3">
          <BulleAssistant texte={questionCourante.assistant} aide={questionCourante.aide} />
          <div className="grid gap-2 pl-1">
            {questionCourante.options.map((o) => (
              <button
                key={String(o.valeur)}
                type="button"
                onClick={() =>
                  dispatch({
                    type: 'repondre',
                    champ: questionCourante.champ,
                    valeur: String(o.valeur),
                    label: o.label,
                  })
                }
                className="rounded-lg border-2 border-etat-blue bg-white px-5 py-3 text-left font-medium text-etat-blue transition-colors hover:bg-etat-blue-light"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Étape moteur visible. */}
      {state.phase === 'calcul' && <EtapeMoteur />}
    </div>
  )
}

function BulleAssistant({ texte, aide }: { texte: string; aide?: string }) {
  return (
    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-etat-border">
      <p className="text-etat-ink">{texte}</p>
      {aide && <p className="mt-1 text-sm text-etat-grey">{aide}</p>}
    </div>
  )
}

function BulleUtilisateur({ texte }: { texte: string }) {
  return (
    <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-etat-blue px-4 py-3 text-white">
      <p>{texte}</p>
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
        <p className="font-semibold text-etat-blue">Le moteur de calcul vérifie vos droits…</p>
        <p className="mt-1 text-sm text-etat-ink">
          Vos réponses sont transmises au moteur de droits. L’assistant n’invente aucun montant :
          tous les chiffres viennent du moteur.
        </p>
      </div>
    </div>
  )
}

function Resultats({ situation, onRestart }: { situation: Situation; onRestart: () => void }) {
  const resultats = calculerDroits(situation)
  const ouverts = resultats.filter((r) => r.eligible)

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-etat-border bg-white shadow-carte p-5">
        <h2 className="text-xl font-bold sm:text-2xl">
          {ouverts.length > 0
            ? `Bonne nouvelle : ${ouverts.length} aide${ouverts.length > 1 ? 's' : ''} possible${
                ouverts.length > 1 ? 's' : ''
              } pour vous.`
            : 'Voici ce que nous avons vérifié pour vous.'}
        </h2>
        <p className="mt-2 text-etat-grey">
          Ces résultats sont calculés par le moteur de droits à partir de vos réponses. Voici les
          montants et, pour chaque aide, la démarche à faire.
        </p>
      </div>

      {resultats.map((r) => (
        <CarteResultat key={r.aide} r={r} />
      ))}

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-etat-blue px-5 py-3 font-semibold text-etat-blue transition-colors hover:bg-etat-blue-light"
      >
        <RotateCcw size={18} aria-hidden />
        Recommencer la simulation
      </button>
    </div>
  )
}

function CarteResultat({ r }: { r: ResultatDroit }) {
  const fiable = r.fiabilite === 'calcul_national'

  return (
    <article
      className={cn(
        'rounded-xl border bg-white p-5 shadow-carte',
        r.eligible ? 'border-etat-border' : 'border-etat-border opacity-90',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-bold">{r.libelle}</h3>
        {r.eligible && <BadgeFiabilite fiable={fiable} />}
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

      {r.aide === 'ASPA' && r.eligible && (
        <p className="mt-3 rounded bg-etat-bg px-3 py-2 text-sm text-etat-grey">
          À savoir, en toute transparence : l’ASPA peut être récupérée sur la succession au-delà
          d’un certain montant. C’est une aide, pas un dû définitif.
        </p>
      )}

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

function BadgeFiabilite({ fiable }: { fiable: boolean }) {
  if (fiable) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-valide-bg px-3 py-1 text-sm font-semibold text-valide">
        <BadgeCheck size={16} aria-hidden />
        Montant national fiable
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-estim-bg px-3 py-1 text-sm font-semibold text-estim">
      <TriangleAlert size={16} aria-hidden />
      Estimation, à confirmer par votre département
    </span>
  )
}
