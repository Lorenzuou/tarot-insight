
export interface Arcano {
  id: number;
  nome: string;
  imagem: string;
  significadoCurto: string;
}

export enum ReadingMode {
  INTRO = 'INTRO',
  QUICK = 'QUICK',
  COMPLETE = 'COMPLETE',
}

export enum ReadingStage {
  MODE_SELECTION = 'MODE_SELECTION',
  // Quick Reading
  QUICK_INPUT = 'QUICK_INPUT',
  QUICK_DRAW = 'QUICK_DRAW',
  // Complete Reading
  INPUT_PAST = 'INPUT_PAST',
  DRAW_PAST = 'DRAW_PAST',
  INPUT_PRESENT = 'INPUT_PRESENT',
  DRAW_PRESENT = 'DRAW_PRESENT',
  INPUT_FUTURE = 'INPUT_FUTURE',
  DRAW_FUTURE = 'DRAW_FUTURE',
  // Common
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
}

export interface QuickReading {
  question: string;
  cards: Arcano[];
}

export interface UserReadings {
  pastInput: string;
  pastCards: Arcano[];
  presentInput: string;
  presentCards: Arcano[];
  futureInput: string;
  futureCards: Arcano[];
}

export interface AIAnalysisResult {
  summary: string;
  detailedAnalysis: string;
  advice: string;
  // Premium Content Fields
  loveAnalysis?: string;
  careerAnalysis?: string;
  hiddenFactors?: string;
}
