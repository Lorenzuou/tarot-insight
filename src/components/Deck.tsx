import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TarotCard from "./TarotCard";
import { Arcano, arcanosMaiores } from "@/lib/tarotData";
import { cn } from "@/lib/utils";

interface DeckProps {
  onCardSelected: (arcano: Arcano, positionId: number) => void;
  selectedCount: number;
  isLocked?: boolean;
}

const Deck = ({ onCardSelected, selectedCount, isLocked = false }: DeckProps) => {
  const [shuffledCards, setShuffledCards] = useState<Arcano[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(true);

  useEffect(() => {
    // Shuffle cards on mount
    const shuffled = [...arcanosMaiores].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    
    // Animation delay
    setTimeout(() => setIsShuffling(false), 1000);
  }, []);

  const handleCardClick = (arcano: Arcano, index: number) => {
    if (selectedCards.includes(index) || selectedCount >= 9 || isLocked) return;

    setSelectedCards([...selectedCards, index]);
    
    // Position IDs from 1 to 9
    const positionId = selectedCount + 1;
    
    onCardSelected(arcano, positionId);
  };

  const getInstruction = () => {
    const instructions = [
      "Carta 1: O portal que abre o passado",
      "Carta 2: Emoção que ainda ecoa",
      "Carta 3: Voz externa que marcou",
      "Carta 4: O espelho do agora",
      "Carta 5: Correnteza emocional presente",
      "Carta 6: Ventos e influências do momento",
      "Carta 7: Rastro provável do futuro",
      "Carta 8: Pontes e desafios pela frente",
      "Carta 9: Farol de longo alcance"
    ];
    
    if (selectedCount < 9) {
      const rowTitle = selectedCount < 3 ? "Passado" : selectedCount < 6 ? "Presente" : "Futuro";
      return `${instructions[selectedCount]} · ${rowTitle}`;
    }
    return "Sua leitura está completa!";
  };

  if (selectedCount >= 9) return null;

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
          {getInstruction()}
        </h2>
        <p className="text-muted-foreground">
          Permita que a carta que chamar seu coração revele a próxima mensagem.
        </p>
        {isLocked && (
          <p className="mt-3 text-sm text-primary">
            Complete o ritual de reflexão antes de continuar a escolha das cartas.
          </p>
        )}
      </motion.div>

      <div
        className={cn(
          "relative flex flex-wrap justify-center gap-4 md:gap-6 max-w-6xl mx-auto transition-opacity",
          isLocked && "pointer-events-none opacity-60",
        )}
      >
        <AnimatePresence>
          {shuffledCards.map((arcano, index) => {
            const isSelected = selectedCards.includes(index);
            
            if (isSelected) return null;

            return (
              <motion.div
                key={arcano.id}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 100 - 50,
                  rotate: Math.random() * 20 - 10
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotate: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.5,
                  transition: { duration: 0.3 }
                }}
                transition={{ 
                  delay: isShuffling ? index * 0.05 : 0,
                  duration: 0.6,
                  ease: "easeOut"
                }}
              >
                <TarotCard
                  arcano={arcano}
                  isFlipped={false}
                  onClick={() => handleCardClick(arcano, index)}
                  isSelected={isSelected}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mystical background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>
    </div>
  );
};

export default Deck;
