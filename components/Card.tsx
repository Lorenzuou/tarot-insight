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
  return (
    <div 
      className={`group relative w-24 h-40 md:w-32 md:h-52 cursor-pointer perspective-1000 transition-all duration-300 ${selected ? '-translate-y-6 ring-2 ring-amber-400 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)]' : ''} ${disabled ? 'cursor-default' : 'hover:-translate-y-2'} ${className}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className={`card-flip-inner relative w-full h-full shadow-2xl rounded-xl ${isFlipped ? 'card-flipped' : ''}`}>
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
              <img src={card.imagem} alt={card.nome} className="w-full h-full object-cover opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-1 pt-6 text-center">
                <p className="text-amber-100 font-serif text-xs md:text-sm font-bold tracking-wider">{card.nome}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;