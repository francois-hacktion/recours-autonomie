import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  ExternalLink,
  Handshake,
  Info,
  Lightbulb,
  ListChecks,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  MapPin,
  Mic,
  Phone,
  RotateCcw,
  Search,
  Send,
  TriangleAlert,
  Volume2,
} from 'lucide-react'
import { DIALOGUE_VOCAL } from '@/data/dialogueVocal'
import {
  ADRESSE_SERVICE,
  COMMUNE,
  CONTACT_DOMICILE,
  construireMail,
  type Contact,
  type Guichet,
} from '@/data/miseEnRelation'
import {
  CADRAGE,
  CONTACT_ADAPTATION,
  EMAIL_DEFAUT,
  GARDE_FOU_LOCAL,
  IDENTITE,
  IDENTITE_TOURS,
  PISTES_LOCALES,
  RECHERCHE_LOCALE_ETAPES,
  RENSEIGNEMENT_TOUR,
  TELEPHONE_DEFAUT,
} from '@/data/renseignementLocal'
import { cn } from '@/lib/cn'
import { calculerDroits, formaterEuros, type Situation } from '@/lib/moteur'

// Démonstrateur de l'assistant vocal. La personne âgée parle ; l'assistant pose des
// questions et la "dictée" s'affiche en transcription progressive (effet parole en
// direct). Tout est scripté : on montre que l'outil comprend une parole spontanée.
//
// Deux parcours jouables, chacun va au bout, après une étape de cadrage :
//   - "labyrinthe" : faire le point sur tous ses droits (4 questions, moteur, APA + ASPA).
//   - "renseignement" : une question sur une aide locale, recherche locale visible, puis
//     mise en relation. Le calcul des montants reste dans le moteur déterministe.

type Parcours = 'labyrinthe' | 'renseignement'
type Phase =
  | 'identite'
  | 'cadrage'
  | 'dialogue'
  | 'calcul'
  | 'resultats'
  | 'renseignement'
  | 'recherche_locale'
  | 'resultats_locaux'
  | 'mise_en_relation'
type SousEtape = 'prete' | 'ecoute' | 'comprise'

export function AssistantVocal() {
  const [parcours, setParcours] = useState<Parcours>('labyrinthe')
  const [phase, setPhase] = useState<Phase>('identite')
  const [tour, setTour] = useState(0)
  const [sousEtape, setSousEtape] = useState<SousEtape>('prete')
  const [chars, setChars] = useState(0)

  const courant =
    phase === 'identite'
      ? IDENTITE_TOURS[tour]
      : parcours === 'renseignement'
        ? RENSEIGNEMENT_TOUR
        : DIALOGUE_VOCAL[tour]
  const contact = parcours === 'renseignement' ? CONTACT_ADAPTATION : CONTACT_DOMICILE

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

  // Étape moteur visible avant la restitution (branche labyrinthe).
  useEffect(() => {
    if (phase !== 'calcul') return
    const t = setTimeout(() => setPhase('resultats'), 1900)
    return () => clearTimeout(t)
  }, [phase])

  function parler() {
    setChars(0)
    setSousEtape('ecoute')
  }

  function choisirParcours(p: Parcours) {
    setParcours(p)
    setTour(0)
    setSousEtape('prete')
    setChars(0)
    setPhase(p === 'renseignement' ? 'renseignement' : 'dialogue')
  }

  function continuer() {
    if (phase === 'identite') {
      if (tour < IDENTITE_TOURS.length - 1) {
        setTour((t) => t + 1)
        setSousEtape('prete')
        setChars(0)
      } else {
        setTour(0)
        setSousEtape('prete')
        setChars(0)
        setPhase('cadrage')
      }
      return
    }
    if (parcours === 'renseignement') {
      setPhase('recherche_locale')
      return
    }
    if (tour < DIALOGUE_VOCAL.length - 1) {
      setTour((t) => t + 1)
      setSousEtape('prete')
      setChars(0)
    } else {
      setPhase('calcul')
    }
  }

  function recommencer() {
    setParcours('labyrinthe')
    setPhase('identite')
    setTour(0)
    setSousEtape('prete')
    setChars(0)
  }

  if (phase === 'cadrage') {
    return <Cadrage onChoisir={choisirParcours} />
  }

  if (phase === 'resultats') {
    return (
      <RestitutionVocale
        onRestart={recommencer}
        onMiseEnRelation={() => setPhase('mise_en_relation')}
      />
    )
  }

  if (phase === 'recherche_locale') {
    return <RechercheLocale onDone={() => setPhase('resultats_locaux')} />
  }

  if (phase === 'resultats_locaux') {
    return (
      <ResultatsLocaux
        onRestart={recommencer}
        onMiseEnRelation={() => setPhase('mise_en_relation')}
      />
    )
  }

  if (phase === 'mise_en_relation') {
    return <MiseEnRelationVocale contact={contact} onRestart={recommencer} />
  }

  const dernierLabyrinthe = parcours === 'labyrinthe' && tour === DIALOGUE_VOCAL.length - 1
  const labelSuite =
    phase === 'identite'
      ? tour < IDENTITE_TOURS.length - 1
        ? 'Continuer'
        : 'C’est parti'
      : parcours === 'renseignement'
        ? 'Chercher près de chez moi'
        : dernierLabyrinthe
          ? 'Vérifier mes droits'
          : 'Question suivante'

  // Historique des échanges déjà compris : l'identité, ou les questions du parcours guidé.
  const historique =
    phase === 'identite'
      ? IDENTITE_TOURS.slice(0, tour)
      : phase === 'dialogue'
        ? DIALOGUE_VOCAL.slice(0, tour)
        : []

  return (
    <div className="mx-auto w-full max-w-lecture space-y-4">
      {historique.map((t, i) => (
        <div key={i} className="space-y-2">
          <BulleAssistant texte={t.assistant} />
          <BulleParole texte={t.dictee} terminee />
          <Comprehension texte={t.comprisComme} />
        </div>
      ))}

      {(phase === 'identite' || phase === 'dialogue' || phase === 'renseignement') && (
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
                {labelSuite}
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

// Étape de cadrage : l'assistant demande ce que la personne vient chercher, puis on
// branche vers le bon parcours. Piloté par le présentateur, comme le reste de la démo.
function Cadrage({ onChoisir }: { onChoisir: (p: Parcours) => void }) {
  return (
    <div className="mx-auto w-full max-w-lecture space-y-4">
      <BulleAssistant texte={CADRAGE.assistant} />
      <BulleInfo texte={CADRAGE.rassurance} />
      <div className="grid gap-3 pl-10 sm:grid-cols-2">
        <BoutonCanal
          icone={Search}
          titre={CADRAGE.choix.renseignement.titre}
          sous={CADRAGE.choix.renseignement.sous}
          onClick={() => onChoisir('renseignement')}
        />
        <BoutonCanal
          icone={ListChecks}
          titre={CADRAGE.choix.labyrinthe.titre}
          sous={CADRAGE.choix.labyrinthe.sous}
          onClick={() => onChoisir('labyrinthe')}
        />
      </div>
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

// ── Branche renseignement : recherche locale visible. ────────────────────────
// L'assistant vérifie l'existence d'aides locales et résout le bon guichet. Dans la
// cible : recherche web bornée à une allowlist + annuaire DILA. Ici, scripté.
function RechercheLocale({ onDone }: { onDone: () => void }) {
  const [etape, setEtape] = useState(0)

  useEffect(() => {
    if (etape >= RECHERCHE_LOCALE_ETAPES.length) {
      const fin = setTimeout(onDone, 800)
      return () => clearTimeout(fin)
    }
    const t = setTimeout(() => setEtape((e) => e + 1), 1100)
    return () => clearTimeout(t)
  }, [etape, onDone])

  return (
    <div className="mx-auto w-full max-w-lecture space-y-4">
      <div
        aria-live="polite"
        className="rounded-lg border border-etat-blue-light bg-etat-blue-light px-4 py-4"
      >
        <p className="flex items-center gap-2 font-semibold text-etat-blue">
          <Search size={20} className="animate-pulse" aria-hidden />
          Je cherche près de chez vous, un instant…
        </p>
        <ul className="mt-3 space-y-2">
          {RECHERCHE_LOCALE_ETAPES.map((e, i) => (
            <li
              key={i}
              className={cn(
                'flex items-start gap-2 text-sm',
                i < etape ? 'text-etat-ink' : 'text-etat-grey/60',
              )}
            >
              {i < etape ? (
                <BadgeCheck size={16} className="mt-0.5 shrink-0 text-teal" aria-hidden />
              ) : (
                <Loader2
                  size={16}
                  className={cn(
                    'mt-0.5 shrink-0',
                    i === etape ? 'animate-spin text-etat-blue' : 'text-etat-border',
                  )}
                  aria-hidden
                />
              )}
              {e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ResultatsLocaux({
  onRestart,
  onMiseEnRelation,
}: {
  onRestart: () => void
  onMiseEnRelation: () => void
}) {
  const annonceRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    annonceRef.current?.focus()
  }, [])

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div className="rounded-xl border border-etat-blue bg-etat-blue p-5 text-white">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80">
          <Volume2 size={16} aria-hidden />
          Silneo vous répond
        </p>
        <p ref={annonceRef} tabIndex={-1} className="mt-2 text-lg outline-none">
          Bonne nouvelle Jeanne : oui, des aides existent pour adapter votre salle de bain. Voici ce
          que j’ai trouvé. Je reste prudent, et je vous explique pourquoi.
        </p>
      </div>

      <div className="space-y-3">
        {PISTES_LOCALES.map((p) => (
          <article key={p.nom} className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
            <h3 className="flex items-start gap-2 text-lg font-bold text-etat-ink">
              <Lightbulb size={20} className="mt-0.5 shrink-0 text-or" aria-hidden />
              {p.nom}
            </h3>
            <p className="mt-2 text-etat-ink">{p.detail}</p>
            <p className="mt-2 text-sm text-etat-grey">Piste à vérifier · source : {p.source}</p>
          </article>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border-l-4 border-estim bg-estim-bg p-4">
        <TriangleAlert size={20} className="mt-0.5 shrink-0 text-estim" aria-hidden />
        <p className="text-etat-ink">{GARDE_FOU_LOCAL}</p>
      </div>

      <div className="rounded-xl border-l-4 border-teal bg-teal-bg p-5">
        <p className="flex items-center gap-2 font-bold text-teal-hover">
          <MapPin size={20} aria-hidden />
          J’ai trouvé qui peut vous accompagner
        </p>
        <p className="mt-1 text-etat-ink">
          Près de chez vous, France Services monte le dossier MaPrimeAdapt’ gratuitement, et le CCAS
          connaît les aides locales. Je peux préparer votre prise de contact.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="button"
          onClick={onMiseEnRelation}
          className="inline-flex items-center gap-2 rounded-lg bg-etat-blue px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-etat-blue-hover"
        >
          <Handshake size={20} aria-hidden />
          Contacter le bon guichet
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-etat-blue px-5 py-3 font-semibold text-etat-blue transition-colors hover:bg-etat-blue-light"
        >
          <RotateCcw size={18} aria-hidden />
          Refaire l’échange vocal
        </button>
      </div>
    </div>
  )
}

function RestitutionVocale({
  onRestart,
  onMiseEnRelation,
}: {
  onRestart: () => void
  onMiseEnRelation: () => void
}) {
  // La situation est reconstruite à partir des paroles comprises, puis calculée.
  const situation = useMemo(
    () =>
      Object.fromEntries(DIALOGUE_VOCAL.map((t) => [t.champ, t.valeur])) as unknown as Situation,
    [],
  )
  const resultats = calculerDroits(situation)
  const ouverts = resultats.filter((r) => r.eligible)

  // Récapitulatif que la personne peut se faire envoyer par mail. Il lui est destiné à
  // elle (pas à un guichet), donc il peut contenir les montants estimés.
  const lignesRecap = ouverts
    .map((r) => {
      const montant =
        r.montantMensuel !== null
          ? `${r.fiabilite === 'calcul_national' ? 'jusqu’à ' : '≈ '}${formaterEuros(r.montantMensuel)} / mois`
          : 'montant à évaluer'
      const fiab =
        r.fiabilite === 'calcul_national' ? 'montant national fiable' : 'estimation à confirmer'
      return `• ${r.libelle} : ${montant} (${fiab})\n  Démarche : ${r.demarche.texte}`
    })
    .join('\n\n')
  const corpsRecap = `Bonjour ${IDENTITE.prenom},

Voici le récapitulatif de vos droits possibles, d’après notre échange :

${lignesRecap}

Ce récapitulatif est indicatif : seuls les guichets indiqués peuvent confirmer vos droits et les montants exacts.

Prenez soin de vous,
Silneo, votre assistant`

  // Petit accusé "à voix haute" en tête de restitution.
  const annonceRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    annonceRef.current?.focus()
  }, [])

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div className="rounded-xl border border-etat-blue bg-etat-blue p-5 text-white">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/80">
          <Volume2 size={16} aria-hidden />
          Silneo vous répond
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

      <RecapParMail corps={corpsRecap} />

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="button"
          onClick={onMiseEnRelation}
          className="inline-flex items-center gap-2 rounded-lg bg-etat-blue px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-etat-blue-hover"
        >
          <Handshake size={20} aria-hidden />
          Et maintenant, contacter le bon guichet
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-etat-blue px-5 py-3 font-semibold text-etat-blue transition-colors hover:bg-etat-blue-light"
        >
          <RotateCcw size={18} aria-hidden />
          Refaire l’échange vocal
        </button>
      </div>
    </div>
  )
}

// Récapitulatif envoyé à la personne elle-même (pas à un guichet) : il peut donc
// contenir les montants estimés. L'e-mail n'est demandé que si elle veut le recevoir.
function RecapParMail({ corps }: { corps: string }) {
  const [ouvert, setOuvert] = useState(false)
  const [email, setEmail] = useState(EMAIL_DEFAUT)
  const [envoye, setEnvoye] = useState(false)

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-etat-blue px-5 py-3 font-semibold text-etat-blue transition-colors hover:bg-etat-blue-light"
      >
        <Mail size={18} aria-hidden />
        Recevoir mon récapitulatif par mail
      </button>
    )
  }

  return (
    <div className="space-y-4 rounded-xl border border-etat-border bg-white p-5 shadow-carte">
      <Comprehension texte="Bien sûr. Je vous envoie ce récapitulatif et les montants estimés, pour que vous gardiez tout par écrit, à votre rythme." />
      <pre className="whitespace-pre-wrap rounded-lg bg-etat-bg p-4 font-sans text-sm text-etat-ink">
        {corps}
      </pre>

      {envoye ? (
        <div className="flex items-start gap-3 rounded-xl border border-valide/40 bg-valide-bg p-4">
          <MailCheck size={22} className="mt-0.5 shrink-0 text-valide" aria-hidden />
          <div>
            <p className="font-bold text-valide">Récapitulatif envoyé</p>
            <p className="text-sm text-etat-ink">
              Vous le recevrez à {email}. Il est à vous : relisez-le tranquillement, ou montrez-le à
              un proche.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="email-recap" className="block font-semibold text-etat-ink">
            Votre adresse e-mail
          </label>
          <input
            id="email-recap"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-etat-border px-4 py-3 text-lg text-etat-ink focus:border-etat-blue focus:outline-none focus:ring-2 focus:ring-etat-blue/30"
          />
          <button
            type="button"
            onClick={() => setEnvoye(true)}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-etat-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-etat-blue-hover"
          >
            <Send size={18} aria-hidden />
            M’envoyer le récapitulatif
          </button>
        </div>
      )}
    </div>
  )
}

// ── Service de mise en relation, joué jusqu'au bout. ─────────────────────────
// Lève le frein du passage à l'acte : on résout le bon guichet (annuaire DILA en
// cible) et on produit un livrable de contact, fiche d'appel ou message minimisé.
// Le contact passé dépend du parcours (maintien à domicile ou adaptation du logement).
type EtapeMR = 'canal' | 'fiche_appel' | 'mail_numero' | 'mail_consentement' | 'mail_envoye'

function MiseEnRelationVocale({ contact, onRestart }: { contact: Contact; onRestart: () => void }) {
  const [etape, setEtape] = useState<EtapeMR>('canal')
  // Le numéro de rappel n'est demandé qu'ici, et seulement si la personne choisit l'envoi
  // du message par le service. Pré-rempli pour la démo, modifiable.
  const [telephone, setTelephone] = useState(TELEPHONE_DEFAUT)

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div className="rounded-xl border-l-4 border-teal bg-teal-bg p-5">
        <p className="flex items-center gap-2 font-bold text-teal-hover">
          <Handshake size={20} aria-hidden />
          Passer à l’acte : contacter le bon guichet
        </p>
        <p className="mt-1 text-etat-ink">
          Connaître ses droits ne suffit pas, le plus dur c’est de franchir le pas. Le service
          prépare le premier contact avec le bon guichet, près de chez vous.
        </p>
      </div>

      <BulleAssistant texte="Souhaitez-vous que je prépare votre prise de contact ? Je peux vous donner les numéros à appeler, ou bien envoyer un message en votre nom au guichet. Qu’est-ce qui vous arrange le plus ?" />

      {etape === 'canal' && (
        <div className="grid gap-3 pl-10 sm:grid-cols-2">
          <BoutonCanal
            icone={Phone}
            titre="Par téléphone"
            sous="Conseillé pour un premier contact"
            onClick={() => setEtape('fiche_appel')}
          />
          <BoutonCanal
            icone={Mail}
            titre="Par message"
            sous="Nous l’envoyons pour vous"
            onClick={() => setEtape('mail_numero')}
          />
        </div>
      )}

      {etape === 'fiche_appel' && (
        <FicheAppel
          guichets={contact.guichets}
          phrase={contact.phrase}
          onMail={() => setEtape('mail_numero')}
        />
      )}

      {etape === 'mail_numero' && (
        <CollecteNumero
          valeur={telephone}
          onChange={setTelephone}
          onValider={() => setEtape('mail_consentement')}
        />
      )}

      {(etape === 'mail_consentement' || etape === 'mail_envoye') && (
        <BlocMail
          contact={contact}
          telephone={telephone}
          envoye={etape === 'mail_envoye'}
          onEnvoyer={() => setEtape('mail_envoye')}
        />
      )}

      {etape !== 'canal' && <NoteMinimisation />}

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

function BoutonCanal({
  icone: Icone,
  titre,
  sous,
  onClick,
}: {
  icone: typeof Phone
  titre: string
  sous: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3 rounded-xl border-2 border-etat-blue bg-white p-4 text-left transition-colors hover:bg-etat-blue-light"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-etat-blue-light text-etat-blue">
        <Icone size={20} aria-hidden />
      </span>
      <span>
        <span className="block font-bold text-etat-ink">{titre}</span>
        <span className="block text-sm text-etat-grey">{sous}</span>
      </span>
    </button>
  )
}

function FicheAppel({
  guichets,
  phrase,
  onMail,
}: {
  guichets: Guichet[]
  phrase: string
  onMail: () => void
}) {
  return (
    <div className="space-y-4">
      <Comprehension texte="Très bien, le téléphone est souvent le plus simple. Voici votre fiche d’appel, prête à utiliser." />
      <div className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <ClipboardList size={20} className="text-etat-blue" aria-hidden />
          Votre fiche d’appel
        </h3>
        <ol className="mt-4 space-y-3">
          {guichets.map((g, i) => (
            <li key={g.nom} className="rounded-lg border border-etat-border p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-etat-blue text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-etat-ink">{g.nom}</p>
                  <p className="text-sm text-etat-grey">{g.role}</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-bold text-etat-blue">
                    <Phone size={18} aria-hidden />
                    {g.telephone}
                  </p>
                  <p className="text-sm text-etat-grey">{g.horaires}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 rounded-lg bg-etat-blue-light p-4">
          <p className="font-semibold text-etat-blue">Une phrase pour commencer :</p>
          <p className="mt-1 italic text-etat-ink">«&nbsp;{phrase}&nbsp;»</p>
        </div>
        <p className="mt-3 text-sm text-etat-grey">
          Pensez à noter le nom de la personne au bout du fil et la date de votre appel.
        </p>
      </div>

      <button
        type="button"
        onClick={onMail}
        className="inline-flex items-center gap-2 font-semibold text-etat-blue underline underline-offset-2 hover:text-etat-blue-hover"
      >
        <Mail size={16} aria-hidden />
        Plutôt un message envoyé pour moi
      </button>
    </div>
  )
}

// Étape "numéro de rappel", jouée seulement quand la personne confie l'envoi du message
// au service. Le numéro ne sert qu'à ce message, on le redit clairement.
function CollecteNumero({
  valeur,
  onChange,
  onValider,
}: {
  valeur: string
  onChange: (v: string) => void
  onValider: () => void
}) {
  return (
    <div className="space-y-4">
      <Comprehension texte="Avec plaisir. Pour que le guichet puisse vous rappeler, à quel numéro peut-on vous joindre ? Il n’apparaîtra que dans ce message." />
      <div className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
        <label htmlFor="tel-rappel" className="block font-semibold text-etat-ink">
          Votre numéro de téléphone
        </label>
        <input
          id="tel-rappel"
          type="tel"
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-lg border border-etat-border px-4 py-3 text-lg text-etat-ink focus:border-etat-blue focus:outline-none focus:ring-2 focus:ring-etat-blue/30"
        />
        <button
          type="button"
          onClick={onValider}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-etat-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-etat-blue-hover"
        >
          Continuer
          <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  )
}

function BlocMail({
  contact,
  telephone,
  envoye,
  onEnvoyer,
}: {
  contact: Contact
  telephone: string
  envoye: boolean
  onEnvoyer: () => void
}) {
  // Le corps est composé à la volée : identité collectée au début + numéro donné à l'instant.
  const corps = construireMail(IDENTITE, contact, COMMUNE, telephone)
  return (
    <div className="space-y-4">
      <Comprehension texte="Avec plaisir. Voici le message que nous enverrions en votre nom. Il reprend vos coordonnées, mais ne dit rien de votre santé ni de vos revenus." />
      <div className="rounded-xl border border-etat-border bg-white p-5 shadow-carte">
        <p className="text-sm font-semibold uppercase tracking-wide text-etat-grey">
          À : {contact.destinataire}
        </p>
        <p className="mt-1 font-bold text-etat-ink">{contact.objet}</p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-etat-ink">{corps}</pre>
      </div>

      {envoye ? (
        <div className="flex items-start gap-3 rounded-xl border border-valide/40 bg-valide-bg p-4">
          <MailCheck size={22} className="mt-0.5 shrink-0 text-valide" aria-hidden />
          <div>
            <p className="font-bold text-valide">Message envoyé en votre nom</p>
            <p className="text-sm text-etat-ink">
              Envoyé depuis notre adresse de service ({ADRESSE_SERVICE}). Le guichet vous
              recontactera. Vous n’avez rien d’autre à faire.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-etat-border bg-etat-bg p-4">
          <p className="font-semibold text-etat-ink">
            Êtes-vous d’accord pour que nous l’envoyions en votre nom, depuis notre adresse de
            service ?
          </p>
          <p className="mt-1 text-sm text-etat-grey">
            Vous pouvez aussi le copier et l’envoyer vous-même si vous préférez.
          </p>
          <button
            type="button"
            onClick={onEnvoyer}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-etat-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-etat-blue-hover"
          >
            <Send size={18} aria-hidden />
            Oui, envoyez pour moi
          </button>
        </div>
      )}
    </div>
  )
}

function NoteMinimisation() {
  return (
    <p className="flex items-start gap-2 text-sm text-etat-grey">
      <Lock size={15} className="mt-0.5 shrink-0 text-etat-grey" aria-hidden />
      Protection des données : ce contact ne contient ni votre état de santé, ni votre niveau
      d’autonomie, ni vos revenus. Seulement de quoi vous recontacter.
    </p>
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
