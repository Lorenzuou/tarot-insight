import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TarotCard from "./TarotCard";
import { Arcano, arcanosMaiores } from "@/lib/tarotData";

interface DeckProps {
  onCardSelected: (arcano: Arcano, positionId: number) => void;
  selectedCount: number;
}

const Deck = ({ onCardSelected, selectedCount }: DeckProps) => {
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
    if (selectedCards.includes(index) || selectedCount >= 9) return;

    setSelectedCards([...selectedCards, index]);
    
    // Position IDs from 1 to 9
    const positionId = selectedCount + 1;
    
    onCardSelected(arcano, positionId);
  };

  const getInstruction = () => {
    const instructions = [
      "Carta 1: Evento Central do Passado",
      "Carta 2: Emoções do Passado", 
      "Carta 3: Influências Externas do Passado",
      "Carta 4: Situação Atual",
      "Carta 5: Seus Sentimentos Atuais",
      "Carta 6: Ambiente Atual",
      "Carta 7: Resultado Provável",
      "Carta 8: Oportunidades e Desafios",
      "Carta 9: Perspectiva de Longo Prazo"
    ];
    
    if (selectedCount < 9) {
      const rowTitle = selectedCount < 3 ? "Passado" : selectedCount < 6 ? "Presente" : "Futuro";
      return `${instructions[selectedCount]} (${rowTitle})`;
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
          Confie em sua intuição e escolha a carta que mais te atrai
        </p>
      </motion.div>

      <div className="relative flex flex-wrap justify-center gap-4 md:gap-6 max-w-6xl mx-auto">
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
