
import React, { useEffect } from 'react';

interface AdSlotProps {
  position: 'header' | 'sidebar' | 'footer';
  hidden?: boolean;
}

const AdSlot: React.FC<AdSlotProps> = ({ position, hidden = false }) => {
  useEffect(() => {
    // Load AdSense ads after component mounts
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  if (hidden) return null;

  let dimensions = "h-24 w-full"; // Header/Footer default
  let adSlot = "";
  let adFormat = "auto";
  
  if (position === 'header') {
    dimensions = "h-24 w-full";
    adSlot = "XXXXXXXXXX"; // Substitua pelo slot ID do AdSense
    adFormat = "horizontal";
  } else if (position === 'sidebar') {
    dimensions = "h-96 w-full md:w-64";
    adSlot = "YYYYYYYYYY"; // Substitua pelo slot ID do AdSense
    adFormat = "vertical";
  } else if (position === 'footer') {
    dimensions = "h-24 w-full";
    adSlot = "ZZZZZZZZZZ"; // Substitua pelo slot ID do AdSense
    adFormat = "horizontal";
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
