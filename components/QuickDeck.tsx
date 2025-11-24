import React, { useState } from 'react';
import Card from './Card';
import { Arcano } from '../types';

interface QuickDeckProps {
  onSelectionComplete: (selectedCards: Arcano[]) => void;
  availableCards: Arcano[];
}

const QuickDeck: React.FC<QuickDeckProps> = ({ onSelectionComplete, availableCards }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    if (selectedIndices.includes(index)) return;

    setFlippedIndices(prev => [...prev, index]);
    
    setTimeout(() => {
      const newSelection = [...selectedIndices, index];
      setSelectedIndices(newSelection);

      if (newSelection.length === 3) {
        setTimeout(() => {
          const selectedCards = newSelection.map(idx => availableCards[idx]);
          onSelectionComplete(selectedCards);
        }, 800);
      }
    }, 300);
  };

  const displayCards = availableCards.slice(0, 22);

  return (
    <div className="flex flex-col items-center justify-center py-8 min-h-[500px] animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-serif text-amber-200 mb-2 text-center px-4">
        Escolha 3 Cartas para sua Resposta
      </h2>
      <p className="text-amber-500/70 mb-8 font-serif text-sm tracking-widest">
        {selectedIndices.length} / 3 SELECIONADAS
      </p>
      
      <div className="relative w-full max-w-4xl h-60 md:h-80 flex justify-center items-center overflow-hidden md:overflow-visible">
        {displayCards.map((card, index) => {
          const total = displayCards.length;
          const offset = index - total / 2;
          const rotation = offset * 3;
          const xTranslation = offset * 25;
          const isSelected = selectedIndices.includes(index);
          const isFlipped = flippedIndices.includes(index);

          return (
            <div
              key={card.id}
              className={`absolute transition-all duration-700 ease-out`}
              style={{
                transform: isSelected 
                  ? `translate(${xTranslation}px, 120px) rotate(0deg) scale(0.9)`
                  : `translateX(${xTranslation}px) rotate(${rotation}deg)`,
                zIndex: isSelected ? 1 : (total - Math.abs(offset)),
                opacity: isSelected ? 0.6 : 1,
              }}
            >
              <Card 
                card={card}
                isFlipped={isFlipped} 
                selected={isSelected}
                onClick={() => handleCardClick(index)}
                className="shadow-xl border-amber-900/50"
              />
            </div>
          );
        })}
      </div>
      
      {/* Cards selecionadas com labels */}
      <div className="mt-32 flex gap-8 justify-center items-start">
        {selectedIndices.map((idx, position) => {
          const labels = ['Situação Atual', 'Desafio', 'Resultado'];
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <p className="text-amber-400 text-xs font-serif tracking-wider">{labels[position]}</p>
              <Card 
                card={availableCards[idx]}
                isFlipped={true}
                disabled
                className="w-20 h-32 md:w-24 md:h-40"
              />
            </div>
          );
        })}
      </div>
      
      <p className="text-mystic-gold/60 mt-8 text-sm italic max-w-md text-center px-6">
        Concentre-se em sua pergunta enquanto escolhe as cartas.
      </p>
    </div>
  );
};

export default QuickDeck;
