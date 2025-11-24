
import { GoogleGenAI } from "@google/genai";
import { UserReadings, QuickReading, AIAnalysisResult } from '../types';

// Initialize the client
// CRITICAL: API Key comes from environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const interpretQuickReading = async (reading: QuickReading): Promise<AIAnalysisResult> => {
  try {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key missing. Returning mock interpretation.");
      return {
        summary: "Os astros estão nebulosos (Chave de API ausente).",
        detailedAnalysis: "Não foi possível conectar com o oráculo digital.",
        advice: "Tente novamente mais tarde.",
      };
    }

    const modelId = 'gemini-2.5-flash';
    const cardsNames = reading.cards.map(c => `${c.nome} (${c.significadoCurto})`).join(", ");

    const prompt = `
      Você é um leitor de Tarot místico, sábio e ASSERTIVO. O usuário fez uma pergunta e tirou 3 cartas.
      
      PERGUNTA DO USUÁRIO: "${reading.question}"
      
      CARTAS REVELADAS (em ordem): ${cardsNames}

      INTERPRETAÇÃO DAS CARTAS:
      - Carta 1 (${reading.cards[0].nome}): Representa a SITUAÇÃO ATUAL, o contexto presente da pergunta
      - Carta 2 (${reading.cards[1].nome}): Representa o DESAFIO, obstáculo ou energia que influencia
      - Carta 3 (${reading.cards[2].nome}): Representa o RESULTADO PROVÁVEL ou AÇÃO RECOMENDADA

      TAREFA:
      Seja DIRETO e ASSERTIVO na resposta. Não seja vago. Dê uma resposta clara sobre a pergunta.
      Use linguagem mística mas seja específico sobre o que as cartas indicam como resposta.
      
      FORMATO DE RESPOSTA (JSON APENAS):
      {
        "summary": "Uma resposta DIRETA e mística à pergunta do usuário baseada nas 3 cartas (seja assertivo, não genérico).",
        "detailedAnalysis": "Análise das 3 cartas: 1) Situação Atual (primeira carta e o que ela revela), 2) O Desafio (segunda carta e o que está em jogo), 3) Caminho/Resultado (terceira carta e o que fazer ou esperar). Use parágrafos separados para cada carta.",
        "advice": "Um conselho PRÁTICO e específico baseado nas cartas. Seja claro sobre o que a pessoa deve fazer ou evitar.",
        "loveAnalysis": "Se a pergunta envolve amor/relacionamento: análise específica focada no aspecto romântico com base nas cartas.",
        "careerAnalysis": "Se a pergunta envolve trabalho/dinheiro: análise específica focada no aspecto profissional/financeiro com base nas cartas.",
        "hiddenFactors": "Revele algo ESPECÍFICO que está oculto ou que a pessoa não percebeu, mas as cartas mostram claramente. Seja assertivo."
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle");

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error fetching oracle wisdom:", error);
    return {
      summary: "As energias estão instáveis.",
      detailedAnalysis: "Houve uma interferência na conexão espiritual.",
      advice: "Medite sobre as cartas que você tirou.",
    };
  }
};

export const interpretTarotReading = async (reading: UserReadings): Promise<AIAnalysisResult> => {
  try {
    // If no API key is present, return a fallback mock to prevent app crash in demo env without key
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key missing. Returning mock interpretation.");
      return {
        summary: "Os astros estão nebulosos (Chave de API ausente).",
        detailedAnalysis: "Não foi possível conectar com o oráculo digital. Por favor, verifique a configuração.",
        advice: "Tente novamente mais tarde.",
        loveAnalysis: "O amor requer paciência.",
        careerAnalysis: "Foque em seus objetivos.",
        hiddenFactors: "Há muito que não se vê."
      };
    }

    const modelId = 'gemini-2.5-flash';

    const pastCardsNames = reading.pastCards.map(c => c.nome).join(", ");
    const presentCardsNames = reading.presentCards.map(c => c.nome).join(", ");
    const futureCardsNames = reading.futureCards.map(c => c.nome).join(", ");

    const prompt = `
      Você é um leitor de Tarot místico, sábio e empático. O usuário realizou uma tiragem complexa de 9 cartas (3 para o Passado, 3 para o Presente, 3 para o Futuro).
      
      CONTEXTO DO USUÁRIO:
      1. PASSADO
         - Sentimento do usuário: "${reading.pastInput}"
         - Cartas Reveladas: ${pastCardsNames}
      
      2. PRESENTE
         - Sentimento do usuário: "${reading.presentInput}"
         - Cartas Reveladas: ${presentCardsNames}
      
      3. FUTURO
         - Desejo do usuário: "${reading.futureInput}"
         - Cartas Reveladas: ${futureCardsNames}

      TAREFA:
      Faça uma análise profunda. Interprete como as 3 cartas de cada seção interagem entre si e com a resposta do usuário.
      
      FORMATO DE RESPOSTA (JSON APENAS):
      {
        "summary": "Uma frase de impacto mística resumindo a energia geral da leitura.",
        "detailedAnalysis": "Um texto rico analisando cronologicamente a jornada do usuário (Passado -> Presente -> Futuro).",
        "advice": "Um conselho prático mas espiritual.",
        "loveAnalysis": "Uma análise específica focada em relacionamentos, sentimentos e conexões emocionais baseada nas cartas.",
        "careerAnalysis": "Uma análise específica focada em vida profissional, dinheiro, projetos e sucesso material baseada nas cartas.",
        "hiddenFactors": "Revele algo que está oculto ('A Sombra') ou um obstáculo inconsciente que o usuário não percebeu, mas as cartas mostram."
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle");

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error fetching oracle wisdom:", error);
    return {
      summary: "As energias estão instáveis.",
      detailedAnalysis: "Houve uma interferência na conexão espiritual. As cartas revelam mistérios que ainda não podem ser ditos.",
      advice: "Medite sobre as cartas que você tirou.",
      loveAnalysis: "Concentre-se no amor próprio.",
      careerAnalysis: "Aguarde um momento melhor.",
      hiddenFactors: "O invisível permanece invisível."
    };
  }
};
