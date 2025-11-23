import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TarotCard from "./TarotCard";
import { Arcano } from "@/lib/tarotData";
import { tarotPositions, getPositionById, TarotPosition } from "@/lib/tarotPositions";
import { Button } from "./ui/button";
import { StageResponses, getStageByRow, tarotStages } from "@/lib/tarotStages";
import { generateMysticInsight, GeminiServiceError } from "@/lib/insightService";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ResultadoProps {
  selectedCards: Map<number, Arcano>;
  stageResponses: StageResponses;
}

const colorVariants = {
  primary: "text-primary",
  accent: "text-accent",
  secondary: "text-secondary",
} as const;

const Resultado = ({ selectedCards, stageResponses }: ResultadoProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isComplete = selectedCards.size === tarotPositions.length;

  const reflectionsComplete = useMemo(
    () =>
      tarotStages.every((stage) => {
        const responses = stageResponses[stage.id];
        if (!responses) return false;
        return stage.questions.every((question) => (responses[question.id] ?? "").trim().length > 0);
      }),
    [stageResponses],
  );

  const canSummonInsight = isComplete && reflectionsComplete;

  const getCardByPosition = (positionId: number): Arcano | undefined => selectedCards.get(positionId);

  const renderReflections = (row: "passado" | "presente" | "futuro") => {
    const stage = getStageByRow(row);
    const responses = stageResponses[stage.id];
    if (!responses) {
      return (
        <p className="text-sm text-muted-foreground/70">
          Compartilhe suas palavras para que este portal revele todo o seu significado.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {stage.questions.map((question) => {
          const answer = responses[question.id];
          if (!answer) return null;
          return (
            <div
              key={question.id}
              className="rounded-lg border border-border/40 bg-background/40 p-3 text-left"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">{question.title}</p>
              <p className="pt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{answer}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRow = (row: "passado" | "presente" | "futuro", positionIds: number[], delay: number) => {
    const stage = getStageByRow(row);
    const accentClass = colorVariants[stage.color];

    return (
      <div className="space-y-8" key={row}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay }}
          className="text-center"
        >
          <h3 className={cn("text-2xl md:text-3xl font-bold mb-2", accentClass)}>{stage.label}</h3>
          <p className="text-sm text-muted-foreground/80">{stage.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {positionIds.map((positionId, index) => {
            const position = getPositionById(positionId);
            const arcano = getCardByPosition(positionId);

            return (
              <motion.div
                key={positionId}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + index * 0.12 }}
                className="flex flex-col items-center"
              >
                <div className="mb-4 text-center max-w-xs">
                  <h4 className={cn("text-lg font-semibold mb-1", accentClass)}>{position?.name}</h4>
                  <p className="text-xs text-muted-foreground">{position?.description}</p>
                </div>

                {arcano ? (
                  <TarotCard arcano={arcano} isFlipped={true} showMeaning={true} />
                ) : (
                  <div className="w-32 h-48 md:w-40 md:h-60 border-2 border-dashed border-border/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-muted-foreground/50 text-3xl block mb-2">?</span>
                      <span className="text-xs text-muted-foreground/50">{positionId}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="rounded-2xl border border-border/40 bg-card/40 p-5"
        >
          <h4 className={cn("text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/80 mb-3", accentClass)}>
            Palavras guardadas
          </h4>
          {renderReflections(row)}
        </motion.div>
      </div>
    );
  };

  const handleGenerateInsight = async () => {
    if (!canSummonInsight) {
      toast({
        title: "Ritual incompleto",
        description: "Finalize as escolhas e reflexões para invocar a interpretação.",
      });
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);

      const payload = tarotPositions
        .map((position) => {
          const card = selectedCards.get(position.id);
          if (!card) return null;
          return { position, card } as { position: TarotPosition; card: Arcano };
        })
        .filter(Boolean) as Array<{ position: TarotPosition; card: Arcano }>;

      const insightText = await generateMysticInsight({
        draws: payload,
        reflections: stageResponses,
      });

      setInsight(insightText);
      toast({
        title: "Mensagem recebida",
        description: "O oráculo compartilhou a visão para sua jornada.",
      });
    } catch (error) {
      const message =
        error instanceof GeminiServiceError
          ? error.message
          : "Não foi possível acessar a interpretação agora. Tente novamente em instantes.";
      setErrorMessage(message);
      toast({
        title: "Sussurros interrompidos",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12 space-y-3">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Leitura Expandida
        </h2>
        <p className="text-muted-foreground text-lg">
          Passado, presente e futuro se entrelaçam para revelar o próximo movimento da sua história.
        </p>
      </motion.div>

      <div className="space-y-16">
        {renderRow("passado", [1, 2, 3], 0.2)}

        {selectedCards.size >= 3 && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
        )}

        {selectedCards.size >= 3 && renderRow("presente", [4, 5, 6], 0.6)}

        {selectedCards.size >= 6 && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9 }}
            className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
        )}

        {selectedCards.size >= 6 && renderRow("futuro", [7, 8, 9], 1.0)}
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 space-y-8"
        >
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 md:p-8">
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-semibold text-foreground">Invocar Insight Personalizado</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Quando desejar, o oráculo combina suas reflexões com as cartas escolhidas e consulta a inteligência do
                modelo Gemini para te entregar uma visão única.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent px-10"
                  onClick={handleGenerateInsight}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Invocando..." : insight ? "Receber nova visão" : "Receber insight"}
                </Button>
                {(!canSummonInsight || errorMessage) && (
                  <div className="text-sm text-muted-foreground/80 max-w-sm mx-auto">
                    {!canSummonInsight
                      ? "Complete as reflexões e garanta que todas as cartas estejam reveladas."
                      : errorMessage}
                  </div>
                )}
              </div>

              {insight && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-primary/40 bg-background/50 p-6 text-left shadow-[0_0_35px_hsl(var(--primary)/0.12)]"
                >
                  <h4 className="text-sm uppercase tracking-[0.3em] text-primary mb-3">Mensagem canalizada</h4>
                  <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
                    {insight}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8"
            >
              Iniciar nova jornada
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="lg" className="text-lg px-8">
              Voltar ao santuário
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Resultado;
