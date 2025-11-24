
import React, { useEffect } from 'react';

interface AdSlotProps {
  position: 'header' | 'sidebar' | 'footer';
  hidden?: boolean;
}

const AdSlot: React.FC<AdSlotProps> = ({ position, hidden = false }) => {
  useEffect(() => {
    // Only load ads if we have valid slot IDs
    if (hidden) return;
    
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Silently fail if AdSense not ready
    }
  }, [hidden]);

  if (hidden) return null;

  let dimensions = "h-24 w-full";
  let adSlot = "";
  let adFormat = "auto";
  
  if (position === 'header') {
    dimensions = "h-24 w-full";
    adSlot = ""; // TODO: Adicionar slot ID real do AdSense
    adFormat = "horizontal";
  } else if (position === 'sidebar') {
    dimensions = "h-96 w-full md:w-64";
    adSlot = ""; // TODO: Adicionar slot ID real do AdSense
    adFormat = "vertical";
  } else if (position === 'footer') {
    dimensions = "h-24 w-full";
    adSlot = ""; // TODO: Adicionar slot ID real do AdSense
    adFormat = "horizontal";
  }

  // Se não tiver slot ID, mostre placeholder
  if (!adSlot) {
    return (
      <div className={`bg-mystic-700/50 border border-mystic-gold/20 flex flex-col items-center justify-center text-mystic-gold/40 text-xs uppercase tracking-widest p-4 rounded-lg my-4 backdrop-blur-sm ${dimensions}`}>
        <span>Publicidade</span>
        <span className="text-[10px] mt-1 opacity-50">Configure o AdSense</span>
      </div>
    );
  }

  return (
    <div className={`my-4 ${dimensions}`}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-3547352131909494"
           data-ad-slot={adSlot}
           data-ad-format={adFormat}
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdSlot;
