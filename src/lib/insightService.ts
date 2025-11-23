import { TarotPosition } from "./tarotPositions";
import { Arcano } from "./tarotData";
import { StageResponses, tarotStages } from "./tarotStages";

interface MysticInsightPayload {
  draws: Array<{ position: TarotPosition; card: Arcano }>;
  reflections: StageResponses;
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export class GeminiServiceError extends Error {}

const buildPrompt = ({ draws, reflections }: MysticInsightPayload) => {
  const cardsSummary = draws
    .map(({ position, card }) => {
      const rowTitle = position.row === "passado" ? "Passado" : position.row === "presente" ? "Presente" : "Futuro";
      return `• ${rowTitle} / ${position.name}: ${card.nome} — ${card.significado}. Palavras-chave: ${card.palavrasChave.join(", ")}`;
    })
    .join("\n");

  const reflectionsSummary = tarotStages
    .map((stage) => {
      const responses = reflections[stage.id];
      if (!responses) {
        return `${stage.label} (sem respostas registradas).`;
      }

      const answers = stage.questions
        .map((question) => {
          const answer = responses[question.id]?.trim();
          if (!answer) return `${question.title}: (sem resposta)`;
          return `${question.title}: ${answer}`;
        })
        .join("\n");

      return `${stage.label}:\n${answers}`;
    })
    .join("\n\n");

  return `Você é uma taróloga experiente chamada "Oráculo Insight". Recebeu uma leitura de tarot de nove cartas (três para cada tempo) e reflexões íntimas do consulente. Analise tudo com empatia, poesia leve e clareza prática. Evite clichês vazios e nunca invente fatos fora dos dados.

Instruções para a resposta:
1. Estruture em quatro seções com títulos curtos: "Passado", "Presente", "Futuro" e "Sopro Final".
2. Em cada seção do tempo, conecte no máximo três parágrafos curtos unindo os significados das cartas às respostas pessoais.
3. Em "Sopro Final", traga um conselho objetivo e uma pergunta instigante para reflexão contínua.
4. Use linguagem acolhedora, mística e acessível, mantendo o texto em português do Brasil.

Cartas extraídas:
${cardsSummary}

Confissões do consulente:
${reflectionsSummary}`;
};

export const generateMysticInsight = async (payload: MysticInsightPayload): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new GeminiServiceError(
      "Configure a variável de ambiente VITE_GEMINI_API_KEY para permitir que a interpretação com IA seja canalizada.",
    );
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: buildPrompt(payload),
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => undefined);
      const serviceMessage =
        errorPayload?.error?.message || "A API do Gemini retornou um estado inesperado. Tente novamente em instantes.";
      throw new GeminiServiceError(serviceMessage);
    }

    const json = await response.json();
    const candidates = json?.candidates ?? [];

    const text = candidates
      .flatMap((candidate: { content?: { parts?: Array<{ text?: string }> } }) => candidate?.content?.parts ?? [])
      .map((part) => part?.text ?? "")
      .join("\n")
      .trim();

    if (!text) {
      throw new GeminiServiceError("O oráculo não retornou uma mensagem. Aguarde um pouco e invoque novamente.");
    }

    return text;
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      throw error;
    }

    throw new GeminiServiceError("Não foi possível contatar o oráculo neste momento. Verifique sua conexão e tente novamente.");
  }
};
