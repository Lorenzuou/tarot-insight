import { tarotPositions } from "./tarotPositions";

export type StageId = "past" | "present" | "future";

export interface StageQuestion {
  id: string;
  title: string;
  prompt: string;
  placeholder?: string;
  hint?: string;
  minLength?: number;
}

export interface StageDefinition {
  id: StageId;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  color: "primary" | "accent" | "secondary";
  positionRange: [number, number];
  questions: StageQuestion[];
}

export type StageResponses = Partial<Record<StageId, Record<string, string>>>;

export const tarotStages: StageDefinition[] = [
  {
    id: "past",
    label: "Passado",
    title: "Eco do Passado",
    subtitle: "Revelar o que ainda reverbera",
    description:
      "Respire fundo. Traga à superfície o acontecimento que insiste em sussurrar dentro de você. Deixe que as palavras saiam com honestidade e doçura.",
    color: "primary",
    positionRange: [1, 3],
    questions: [
      {
        id: "past_memory",
        title: "Semente que permaneceu",
        prompt: "Qual lembrança ou situação do passado você sente que ainda pulsa hoje?",
        placeholder: "Descreva o evento, a relação ou a escolha que segue pedindo atenção...",
        minLength: 12,
      },
      {
        id: "past_feelings",
        title: "Emoção que ecoa",
        prompt: "Quais sentimentos retornam quando você revive esse capítulo?",
        placeholder: "Fale sobre as emoções, sensações físicas ou memórias que despontam...",
        minLength: 12,
      },
      {
        id: "past_learning",
        title: "Sabedoria guardada",
        prompt: "Que lição ou entendimento deseja integrar desse momento?",
        placeholder: "Qual insight parece querer nascer a partir dessa lembrança?",
        minLength: 12,
      },
    ],
  },
  {
    id: "present",
    label: "Presente",
    title: "Pulso do Agora",
    subtitle: "Escutar o que vibra neste instante",
    description:
      "Traga consciência ao cenário atual. Observe sem pressa o que te envolve, as forças que te movem e o que o coração pede neste momento.",
    color: "accent",
    positionRange: [4, 6],
    questions: [
      {
        id: "present_landscape",
        title: "Cenário vivo",
        prompt: "Como você descreve o momento atual da sua jornada?",
        placeholder: "Compartilhe imagens, acontecimentos ou temas que definem o agora...",
        minLength: 12,
      },
      {
        id: "present_energy",
        title: "Energia que te habita",
        prompt: "Que energia ou emoção prevalece em você hoje?",
        placeholder: "Fale sobre sentimentos, motivações ou inquietações que dominam o presente...",
        minLength: 12,
      },
      {
        id: "present_influences",
        title: "Forças que te cercam",
        prompt: "Quais pessoas, eventos ou pressões externas influenciam seu agora?",
        placeholder: "Mencione apoios, desafios ou ambientes que moldam este momento...",
        minLength: 12,
      },
    ],
  },
  {
    id: "future",
    label: "Futuro",
    title: "Horizonte que Chama",
    subtitle: "Plantar o próximo passo com intenção",
    description:
      "Projete seu olhar para o amanhã. Sinta o que deseja acolher, transformar e ouvir do tarot como guia para os próximos passos.",
    color: "secondary",
    positionRange: [7, 9],
    questions: [
      {
        id: "future_desire",
        title: "Intenção desejada",
        prompt: "Qual resultado, sensação ou conquista você anseia manifestar?",
        placeholder: "Fale sobre o desejo, meta ou visão que gostaria de nutrir...",
        minLength: 12,
      },
      {
        id: "future_block",
        title: "O medo a transmutar",
        prompt: "Que medo, dúvida ou padrão você gostaria de liberar?",
        placeholder: "Compartilhe receios ou crenças que sente prontos para a transformação...",
        minLength: 12,
      },
      {
        id: "future_guidance",
        title: "Conselho que busca",
        prompt: "Qual mensagem ou conselho das cartas você gostaria de receber?",
        placeholder: "Expresse o tipo de orientação que seu coração espera ouvir...",
        minLength: 12,
      },
    ],
  },
];

export const getStageById = (id: StageId): StageDefinition => {
  const stage = tarotStages.find((item) => item.id === id);
  if (!stage) {
    throw new Error(`Stage with id ${id} not found.`);
  }
  return stage;
};

export const getStageByRow = (row: "passado" | "presente" | "futuro"): StageDefinition => {
  const mapping: Record<"passado" | "presente" | "futuro", StageId> = {
    passado: "past",
    presente: "present",
    futuro: "future",
  };

  return getStageById(mapping[row]);
};

export const getStagePositions = (stage: StageDefinition) => {
  const [start, end] = stage.positionRange;
  return tarotPositions.filter((position) => position.id >= start && position.id <= end);
};
