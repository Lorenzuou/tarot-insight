
import React from 'react';

interface AdSlotProps {
  position: 'header' | 'sidebar' | 'footer';
  hidden?: boolean;
}

const AdSlot: React.FC<AdSlotProps> = ({ position, hidden = false }) => {
  if (hidden) return null;

  let dimensions = "h-24 w-full"; // Header/Footer default
  
  if (position === 'sidebar') {
    dimensions = "h-96 w-full md:w-64";
  }

  return (
    <div className={`bg-mystic-700/50 border border-mystic-gold/20 flex flex-col items-center justify-center text-mystic-gold/40 text-xs uppercase tracking-widest p-4 rounded-lg my-4 backdrop-blur-sm ${dimensions}`}>
      <span>Publicidade</span>
      <span className="text-[10px] mt-1 opacity-50">O Oráculo Agradece</span>
    </div>
  );
};

export default AdSlot;
