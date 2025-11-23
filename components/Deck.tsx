import React, { useState } from 'react';
import Card from './Card';
import { Arcano } from '../types';

interface DeckProps {
  onSelectionComplete: (selectedCards: Arcano[]) => void;
  availableCards: Arcano[];
  instruction: string;
}

const Deck: React.FC<DeckProps> = ({ onSelectionComplete, availableCards, instruction }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    if (selectedIndices.includes(index)) return;

    const newSelection = [...selectedIndices, index];
    setSelectedIndices(newSelection);

    // Automatically trigger completion when 3 cards are selected
    if (newSelection.length === 3) {
      // Add a small delay for visual effect
      setTimeout(() => {
        const selectedCards = newSelection.map(idx => availableCards[idx]);
        onSelectionComplete(selectedCards);
      }, 500);
    }
  };

  // Display a limited number of cards visually to avoid clutter, but illogical for the "deck" feel
  // We will slice the available cards to show a max of 22 on screen
  const displayCards = availableCards.slice(0, 22);

  return (
    <div className="flex flex-col items-center justify-center py-8 min-h-[500px] animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-serif text-amber-200 mb-2 text-center px-4">
        {instruction}
      </h2>
      <p className="text-amber-500/70 mb-8 font-serif text-sm tracking-widest">
        ESCOLHIDAS: {selectedIndices.length} / 3
      </p>
      
      <div className="relative w-full max-w-4xl h-60 md:h-80 flex justify-center items-center overflow-hidden md:overflow-visible">
        {displayCards.map((card, index) => {
          // Calculate fan position
          const total = displayCards.length;
          const offset = index - total / 2;
          const rotation = offset * 3; // Degrees
          const xTranslation = offset * 25; // Pixels
          const isSelected = selectedIndices.includes(index);

          return (
            <div
              key={card.id}
              className={`absolute transition-all duration-500 ease-out ${isSelected ? 'z-50' : ''}`}
              style={{
                transform: isSelected 
                  ? `translate(${xTranslation}px, -40px) rotate(0deg) scale(1.1)` // Selected position
                  : `translateX(${xTranslation}px) rotate(${rotation}deg)`, // Default fan position
                zIndex: isSelected ? 50 : index,
              }}
            >
              <Card 
                isFlipped={false} 
                selected={isSelected}
                onClick={() => handleCardClick(index)}
                className="shadow-xl border-amber-900/50"
              />
            </div>
          );
        })}
      </div>
      
      <p className="text-mystic-gold/60 mt-20 text-sm italic max-w-md text-center px-6">
        Concentre-se na pergunta e selecione três cartas que chamarem sua atenção.
      </p>
    </div>
  );
};

export default Deck;