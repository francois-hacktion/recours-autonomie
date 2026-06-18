// Script de l'assistant vocal. Dans la cible, un LLM souverain mène ce dialogue en
// langage naturel et appelle le moteur. Ici tout est scripté : l'assistant pose une
// question, puis la "dictée" de la personne âgée s'affiche en transcription progressive.
//
// Parti pris d'écriture (à l'opposé du tunnel froid d'un simulateur commercial) :
//   1. accuser réception de l'émotion (la chute, le veuvage) avant de continuer ;
//   2. expliquer POURQUOI on demande, pour installer la confiance ;
//   3. rassurer en continu (pas de jugement, pas de document, rien n'est enregistré) ;
//   4. confirmer avec des mots humains, jamais une étiquette de formulaire.

import type { ChampSituation } from '@/data/questions'
import type { Autonomie, Foyer, Residence, Ressources } from '@/lib/moteur'

export interface TourVocal {
  champ: ChampSituation
  // Ce que dit l'assistant : question parlée, chaleureuse, avec le pourquoi.
  assistant: string
  // Ce que la personne âgée "dicte", transcrit mot à mot. Volontairement parlé.
  dictee: string
  // Valeur métier déduite de la parole et transmise au moteur.
  valeur: Residence | Autonomie | Ressources | Foyer
  // Reformulation humaine que l'assistant confirme (reçoit l'émotion, ne juge pas).
  comprisComme: string
  // Bulle de réassurance affichée pendant que la personne réfléchit.
  rassurance: string
}

export const DIALOGUE_VOCAL: TourVocal[] = [
  {
    champ: 'residence',
    assistant:
      'On commence tranquillement, Jeanne. Il n’y a pas de mauvaise réponse, on avance à votre rythme. Dites-moi simplement : où vivez-vous aujourd’hui ?',
    dictee:
      'Oh, je suis chez moi, dans mon petit appartement. J’y vis depuis quarante ans, vous savez, j’y tiens beaucoup.',
    valeur: 'domicile',
    comprisComme:
      'Vous êtes chez vous, et vous y tenez, je l’entends. On va justement chercher ce qui peut vous aider à y rester.',
    rassurance:
      'Prenez votre temps. Répondez avec vos mots, c’est moi qui m’occupe du reste.',
  },
  {
    champ: 'autonomie',
    assistant:
      'Merci. Pour bien vous accompagner, j’aimerais comprendre votre quotidien. Au jour le jour, y a-t-il des gestes pour lesquels un coup de main vous soulagerait ?',
    dictee:
      'Disons que… je me débrouille pour l’essentiel. Mais depuis ma chute, la toilette et préparer les repas, c’est devenu compliqué toute seule.',
    valeur: 'partielle',
    comprisComme:
      'Je comprends, ce n’est pas évident depuis votre chute. Être aidée pour la toilette et les repas, c’est exactement ce à quoi servent ces aides.',
    rassurance:
      'Rien de gênant à le dire. Demander de l’aide, c’est un droit, pas une faiblesse.',
  },
  {
    champ: 'ressources',
    assistant:
      'Vous faites cela très bien. Parlons un instant d’argent, juste pour estimer. Pas besoin du chiffre exact ni d’un document : à peu près, combien recevez-vous par mois ?',
    dictee:
      'Ma retraite, c’est dans les neuf cents euros par mois. Avec la pension de réversion de mon mari, ça fait pas beaucoup plus.',
    valeur: 'faibles',
    comprisComme:
      'Merci de votre confiance. Avec ce niveau de revenus, plusieurs aides sont justement faites pour vous soutenir.',
    rassurance:
      'Une estimation suffit. Vos réponses ne sont pas enregistrées et ne seront transmises à personne.',
  },
  {
    champ: 'foyer',
    assistant:
      'Une dernière question, la plus simple. Aujourd’hui, vivez-vous seule, ou en couple ?',
    dictee: 'Toute seule, oui. Mon mari nous a quittés il y a trois ans maintenant.',
    valeur: 'seul',
    comprisComme:
      'Je suis désolé pour votre mari, Jeanne. Le fait de vivre seule est pris en compte, et cela peut même ouvrir davantage de droits.',
    rassurance:
      'C’est la dernière. Vous avez été parfaite, je regarde vos droits tout de suite.',
  },
]
