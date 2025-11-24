import React from 'react';
import { Arcano } from '../types';

interface CardProps {
  card?: Arcano;
  isFlipped: boolean;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, isFlipped, onClick, disabled, selected, className = '' }) => {
  // Debug log
  React.useEffect(() => {
    if (isFlipped && card) {
      console.log('Card virada:', card.nome, 'Imagem:', card.imagem);
    }
  }, [isFlipped, card]);

  return (
    <div 
      className={`group relative w-24 h-40 md:w-32 md:h-52 cursor-pointer perspective-1000 transition-all duration-300 ${isFlipped ? 'card-flipped' : ''} ${selected ? '-translate-y-6 ring-2 ring-amber-400 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)]' : ''} ${disabled ? 'cursor-default' : 'hover:-translate-y-2'} ${className}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className={`card-flip-inner relative w-full h-full shadow-2xl rounded-xl transition-transform duration-700`}>
        {/* Card Back */}
        <div className="card-back absolute w-full h-full bg-indigo-950 rounded-xl border-2 border-amber-500/30 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
           <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-amber-500/50 flex items-center justify-center">
              <span className="text-xl md:text-2xl text-amber-500 font-serif">☪</span>
           </div>
        </div>

        {/* Card Front */}
        <div className="card-front absolute w-full h-full bg-slate-900 rounded-xl border-2 border-amber-400 overflow-hidden">
          {card && (
            <>
              <img 
                src={card.imagem} 
                alt={card.nome} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Erro ao carregar imagem: ${card.imagem}`);
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23fff" font-size="16"%3E' + encodeURIComponent(card.nome) + '%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-2 pt-8">
                <p className="text-amber-100 font-serif text-xs md:text-sm font-bold tracking-wider text-center">{card.nome}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;