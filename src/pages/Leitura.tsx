import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Deck from "@/components/Deck";
import Resultado from "@/components/Resultado";
import AdSlot from "@/components/AdSlot";
import StageReflectionDialog from "@/components/StageReflectionDialog";
import { Arcano } from "@/lib/tarotData";
import { tarotStages, StageDefinition, StageResponses } from "@/lib/tarotStages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const stages = tarotStages;

const Leitura = () => {
  const { toast } = useToast();

  const [selectedCards, setSelectedCards] = useState<Map<number, Arcano>>(new Map());
  const [selectedCount, setSelectedCount] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [stageResponses, setStageResponses] = useState<StageResponses>({});
  const [dialogStage, setDialogStage] = useState<StageDefinition | null>(stages[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const currentStage = stages[activeStageIndex];
  const currentStageResponses = currentStage ? stageResponses[currentStage.id] : undefined;

  const currentStageCardCount = useMemo(() => {
    if (!currentStage) return 0;
    const [start, end] = currentStage.positionRange;
    let count = 0;
    for (let position = start; position <= end; position += 1) {
      if (selectedCards.has(position)) {
        count += 1;
      }
    }
    return count;
  }, [currentStage, selectedCards]);

  const deckLocked = !currentStageResponses || currentStageCardCount >= 3;

  const handleCardSelected = (arcano: Arcano, positionId: number) => {
    if (!currentStage || deckLocked) {
      toast({
        title: "Ritual em preparação",
        description: "Abra o círculo da etapa atual antes de escolher novas cartas.",
      });
      return;
    }

    const [start, end] = currentStage.positionRange;
    if (positionId < start || positionId > end) {
      return;
    }

    setSelectedCount((prev) => prev + 1);

    setTimeout(() => {
      setSelectedCards((prev) => {
        const next = new Map(prev);
        next.set(positionId, arcano);
        return next;
      });
    }, 600);

    if (positionId === end) {
      const completedStage = currentStage;
      const nextStage = stages[activeStageIndex + 1];

      toast({
        title: `${completedStage.label} integrado`,
        description: "As cartas revelaram os ecos desta fase. Vamos avançar ao próximo portal.",
      });

      if (nextStage) {
        setTimeout(() => {
          setActiveStageIndex((prev) => prev + 1);
          setDialogStage(nextStage);
          setTimeout(() => setIsDialogOpen(true), 400);
        }, 900);
      }
    }
  };

  const handleStageFormSubmit = (stage: StageDefinition, values: Record<string, string>) => {
    setStageResponses((prev) => ({
      ...prev,
      [stage.id]: values,
    }));

    toast({
      title: `${stage.label} registrado`,
      description: "Suas palavras foram guardadas no oráculo.",
    });

    setIsDialogOpen(false);

    if (stage.id !== currentStage?.id) {
      return;
    }

    setTimeout(() => {
      toast({
        title: "Cartas liberadas",
        description: "Agora escolha as três cartas que ressoam com este momento.",
      });
    }, 200);
  };

  const openStageDialog = (stage: StageDefinition, index: number) => {
    if (index > activeStageIndex) {
      toast({
        title: "Aguarde o fluxo",
        description: "Siga a ordem do rito: passado, presente e depois futuro.",
      });
      return;
    }

    setDialogStage(stage);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-mystic-navy" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ✨ Círculo Tarot Insight
              </h1>
            </motion.div>

            <div className="hidden md:block">
              <AdSlot width="728px" height="90px" position="top" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <AdSlot width="250px" height="600px" position="sidebar" />
            </div>
          </aside>

          <main className="flex-1 space-y-12">
            <section className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 md:p-8 shadow-[0_0_40px_hsl(var(--primary)/0.12)]">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="text-3xl font-semibold text-center md:text-left">
                  Três Portais, Uma Jornada
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Cada etapa guarda um convite à introspecção. Antes de escolher as cartas, escreva o que vibra em seu
                  passado, presente e futuro. Suas palavras guiarão a interpretação final feita pelo oráculo e pela IA.
                </p>
              </motion.div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {stages.map((stage, index) => {
                  const responses = stageResponses[stage.id];
                  const [start, end] = stage.positionRange;
                  const cardsChosen = Array.from({ length: end - start + 1 }, (_, offset) => selectedCards.has(start + offset)).filter(Boolean).length;
                  const isCurrent = index === activeStageIndex;
                  const isComplete = cardsChosen === end - start + 1 && Boolean(responses);
                  const accentClass = stage.color === "primary" ? "text-primary" : stage.color === "accent" ? "text-accent" : "text-secondary";
                  const statusLabel = isComplete
                    ? "Portal selado"
                    : isCurrent
                      ? responses
                        ? "Escolha as cartas"
                        : "Escreva suas reflexões"
                      : index < activeStageIndex
                        ? "Memória guardada"
                        : "Ainda fechado";

                  const excerpt = responses
                    ? Object.values(responses)
                        .find((value) => value.trim().length > 0)
                        ?.slice(0, 90)
                    : undefined;

                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "relative flex flex-col rounded-xl border border-border/40 bg-background/40 p-4 shadow-[0_0_20px_hsl(var(--primary)/0.08)]",
                        isCurrent && "border-primary/60 shadow-[0_0_35px_hsl(var(--primary)/0.18)]",
                      )}
                    >
                      <div className="space-y-2">
                        <p className={cn("text-xs uppercase tracking-[0.3em] text-muted-foreground/70", accentClass)}>
                          {stage.label}
                        </p>
                        <h3 className="text-xl font-semibold text-foreground">{stage.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{stage.subtitle}</p>
                        <div className="pt-2 text-xs text-muted-foreground/80">
                          <p>Cartas escolhidas: {cardsChosen}/{end - start + 1}</p>
                          <p>Status: {statusLabel}</p>
                        </div>
                        {excerpt && (
                          <p className="text-sm italic text-muted-foreground/80">“{excerpt}{excerpt.length >= 90 ? "…" : ""}”</p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        className={cn(
                          "mt-4 w-full border border-border/40 bg-card/60 hover:bg-card/80",
                          index > activeStageIndex && "pointer-events-none opacity-50",
                        )}
                        onClick={() => openStageDialog(stage, index)}
                      >
                        {responses ? "Revisar ritual" : "Iniciar ritual"}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <Resultado selectedCards={selectedCards} stageResponses={stageResponses} />

            {selectedCount < 9 && (
              <section className="pt-8 border-t border-border/30">
                <Deck onCardSelected={handleCardSelected} selectedCount={selectedCount} isLocked={deckLocked} />
              </section>
            )}

            {selectedCount >= 9 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center pt-8"
              >
                <AdSlot width="728px" height="90px" position="bottom" />
              </motion.div>
            )}
          </main>

          <aside className="lg:hidden">
            <AdSlot width="300px" height="250px" position="sidebar" />
          </aside>
        </div>
      </div>

      <footer className="border-t border-border/50 backdrop-blur-sm bg-background/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>© 2024 Tarot Insight. Esta jornada é um convite à reflexão, não substitui aconselhamento profissional.</p>
        </div>
      </footer>

      <StageReflectionDialog
        open={isDialogOpen}
        stage={dialogStage}
        defaultValues={dialogStage ? stageResponses[dialogStage.id] : undefined}
        onSubmit={(values) => {
          if (!dialogStage) return;
          handleStageFormSubmit(dialogStage, values);
        }}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default Leitura;
