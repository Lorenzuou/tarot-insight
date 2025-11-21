export interface TarotPosition {
  id: number;
  name: string;
  description: string;
  row: "passado" | "presente" | "futuro";
  color: string;
}

export const tarotPositions: TarotPosition[] = [
  // Fileira de Baixo (Passado)
  {
    id: 1,
    name: "Evento Central do Passado",
    description: "O evento ou situação principal do passado que influencia o agora",
    row: "passado",
    color: "primary"
  },
  {
    id: 2,
    name: "Emoções do Passado",
    description: "Emoções ou atitudes relacionadas à situação passada",
    row: "passado",
    color: "primary"
  },
  {
    id: 3,
    name: "Influências Externas do Passado",
    description: "Fatores externos ou pessoas envolvidas no passado",
    row: "passado",
    color: "primary"
  },
  // Fileira do Meio (Presente)
  {
    id: 4,
    name: "Situação Atual",
    description: "A situação atual e imediata",
    row: "presente",
    color: "accent"
  },
  {
    id: 5,
    name: "Seus Sentimentos Atuais",
    description: "Seus sentimentos e controle sobre a situação atual",
    row: "presente",
    color: "accent"
  },
  {
    id: 6,
    name: "Ambiente Atual",
    description: "Influências externas e o ambiente ao seu redor no presente",
    row: "presente",
    color: "accent"
  },
  // Fileira de Cima (Futuro)
  {
    id: 7,
    name: "Resultado Provável",
    description: "O resultado provável ou a tendência futura se as coisas continuarem como estão",
    row: "futuro",
    color: "secondary"
  },
  {
    id: 8,
    name: "Oportunidades e Desafios",
    description: "Oportunidades ou desafios no futuro próximo",
    row: "futuro",
    color: "secondary"
  },
  {
    id: 9,
    name: "Perspectiva de Longo Prazo",
    description: "A perspectiva de longo prazo ou o conselho final",
    row: "futuro",
    color: "secondary"
  }
];

export const getPositionById = (id: number): TarotPosition | undefined => {
  return tarotPositions.find(pos => pos.id === id);
};

export const getRowName = (row: "passado" | "presente" | "futuro"): string => {
  const names = {
    passado: "Passado",
    presente: "Presente",
    futuro: "Futuro"
  };
  return names[row];
};
