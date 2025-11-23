
import React, { useState } from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onPurchase }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleBuyClick = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      onPurchase();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-gradient-to-b from-indigo-900 to-black border border-amber-500 rounded-xl max-w-md w-full p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-fade-in overflow-hidden">
        
        {/* Decorative sparkle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500 blur-[60px] opacity-20"></div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-500">
          ✕
        </button>

        <div className="text-center">
          <div className="text-4xl mb-4">💎</div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-2">
            Relatório Cósmico
          </h2>
          <p className="text-amber-100/70 text-sm mb-6 uppercase tracking-widest">Acesso Premium</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <span className="text-amber-400 mt-0.5">❤</span>
            <div>
              <h4 className="font-bold text-amber-100 text-sm">Análise Amorosa</h4>
              <p className="text-xs text-amber-100/60">Descubra o que as cartas dizem sobre seu coração.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <span className="text-amber-400 mt-0.5">💰</span>
            <div>
              <h4 className="font-bold text-amber-100 text-sm">Carreira & Prosperidade</h4>
              <p className="text-xs text-amber-100/60">Caminhos para o sucesso material e profissional.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <span className="text-amber-400 mt-0.5">👁</span>
            <div>
              <h4 className="font-bold text-amber-100 text-sm">Fatores Ocultos</h4>
              <p className="text-xs text-amber-100/60">O que você não está vendo e precisa saber.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <span className="text-amber-400 mt-0.5">🚫</span>
            <div>
              <h4 className="font-bold text-amber-100 text-sm">Sem Anúncios</h4>
              <p className="text-xs text-amber-100/60">Experiência 100% limpa e imersiva.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleBuyClick}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold font-serif uppercase tracking-wider rounded shadow-lg transform transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              Processando...
            </>
          ) : (
            <>
              Desbloquear Tudo por R$ 9,90
            </>
          )}
        </button>
        
        <p className="text-[10px] text-center text-amber-500/40 mt-4">
          Pagamento seguro. Acesso vitalício a esta leitura.
        </p>
      </div>
    </div>
  );
};

export default PremiumModal;
