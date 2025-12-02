
import React, { useState, useEffect } from 'react';
import { Arcano, ReadingStage, ReadingMode, UserReadings, QuickReading, AIAnalysisResult } from './types';
import { arcanosMaiores } from './data/tarotCards';
import { interpretTarotReading, interpretQuickReading } from './services/geminiService';
import Card from './components/Card';
import Deck from './components/Deck';
import QuickDeck from './components/QuickDeck';
import QuestionForm from './components/QuestionForm';
import PremiumModal from './components/PremiumModal';
import LoginModal from './components/LoginModal';
import PricingModal from './components/PricingModal';
import VerifyEmail from './components/VerifyEmail';

// Helper to shuffle array
const shuffleDeck = (array: Arcano[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const { user, login, register, refreshCredits, logout: logoutUser } = useAuth();
  const resetReadingState = () => {
    setReading({
      pastInput: '',
      pastCards: [],
      presentInput: '',
      presentCards: [],
      futureInput: '',
      futureCards: [],
    });
    setQuickReading({ question: '', cards: [] });
    setAiResult(null);
    setMasterDeck(shuffleDeck(arcanosMaiores));
  };

  const handleLogout = () => {
    logoutUser();
    authService.logout();
    resetReadingState();
    setReadingMode(null);
    setStage(ReadingStage.MODE_SELECTION);
    setShowPricingModal(false);
    setShowPremiumModal(false);
    setShowLoginModal(false);
  };

  const handleGoToMainMenu = () => {
    resetReadingState();
    setReadingMode(null);
    setStage(ReadingStage.MODE_SELECTION);
    setShowPricingModal(false);
    setShowPremiumModal(false);
    setShowLoginModal(false);
  };

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [stage, setStage] = useState<ReadingStage>(ReadingStage.MODE_SELECTION);
  const [readingMode, setReadingMode] = useState<ReadingMode | null>(null);
  const [masterDeck, setMasterDeck] = useState<Arcano[]>([]); 
  
  // Complete reading
  const [reading, setReading] = useState<UserReadings>({
    pastInput: '', pastCards: [],
    presentInput: '', presentCards: [],
    futureInput: '', futureCards: [],
  });
  
  // Quick reading
  const [quickReading, setQuickReading] = useState<QuickReading>({
    question: '',
    cards: [],
  });
  
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);

  // Initialize Deck
  useEffect(() => {
    setMasterDeck(shuffleDeck(arcanosMaiores));
  }, []);

  // Verificar email após login
  useEffect(() => {
    if (user && !user.emailVerified) {
      setShowEmailVerificationModal(true);
    } else {
      setShowEmailVerificationModal(false);
    }
  }, [user]);

  // Handlers
  const selectMode = async (mode: ReadingMode) => {
    // Check if user is authenticated
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Check reading availability
    const type = mode === ReadingMode.QUICK ? 'QUICK' : 'COMPLETE';
    try {
      const { available, message } = await authService.checkReadingAvailability(type);

      if (!available) {
        alert(message || 'Você não tem créditos suficientes');
        setShowPricingModal(true);
        return;
      }
    } catch (error: any) {
      console.error('Erro ao verificar créditos:', error);
      alert(error?.message || 'Erro ao verificar seus créditos. Tente novamente.');
      return;
    }

    setReadingMode(mode);
    if (mode === ReadingMode.QUICK) {
      setStage(ReadingStage.QUICK_INPUT);
    } else {
      setStage(ReadingStage.INPUT_PAST);
    }
  };

  const handleInput = (value: string, nextStage: ReadingStage, field: keyof UserReadings) => {
    setReading(prev => ({ ...prev, [field]: value }));
    setStage(nextStage);
  };

  const handleQuickInput = (value: string) => {
    setQuickReading(prev => ({ ...prev, question: value }));
    setStage(ReadingStage.QUICK_DRAW);
  };

  const handleQuickCardsSelected = (selectedCards: Arcano[]) => {
    setQuickReading(prev => ({ ...prev, cards: selectedCards }));
    setStage(ReadingStage.ANALYZING);
  };

  const handleCardsSelected = (selectedCards: Arcano[], nextStage: ReadingStage, field: 'pastCards' | 'presentCards' | 'futureCards') => {
    setReading(prev => ({ ...prev, [field]: selectedCards }));
    const selectedIds = selectedCards.map(c => c.id);
    setMasterDeck(prev => prev.filter(c => !selectedIds.includes(c.id)));
    setStage(nextStage);
  };

  // Final Analysis Trigger
  useEffect(() => {
    if (stage !== ReadingStage.ANALYZING || !readingMode) {
      return;
    }

    const processReading = async () => {
      try {
        const isQuickMode = readingMode === ReadingMode.QUICK;
        const type = isQuickMode ? 'QUICK' : 'COMPLETE';

        const result = isQuickMode
          ? await interpretQuickReading(quickReading)
          : await interpretTarotReading(reading);

        const questionPayload = isQuickMode
          ? quickReading.question
          : `Passado: ${reading.pastInput}\nPresente: ${reading.presentInput}\nFuturo: ${reading.futureInput}`;

        const cardsPayload = isQuickMode
          ? quickReading.cards
          : {
              past: reading.pastCards,
              present: reading.presentCards,
              future: reading.futureCards,
            };

        await authService.consumeReading({
          type,
          question: questionPayload,
          cards: cardsPayload,
          aiResult: result,
        });

        setAiResult(result);
        await refreshCredits();
        setStage(ReadingStage.RESULT);
      } catch (error) {
        console.error('Erro ao processar leitura:', error);
        alert('Erro ao processar leitura. Tente novamente.');
        setStage(ReadingStage.MODE_SELECTION);
      }
    };

    processReading();
  }, [stage, readingMode, quickReading, reading, refreshCredits]);

  // Render Helpers
  const renderHeader = () => (
    <header className="w-full p-6 flex justify-between items-center border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔮</span>
        <h1
          className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-amber-100 cursor-pointer hover:text-amber-300 transition-colors"
          onClick={handleGoToMainMenu}
        >
          MYSTIC ORACLE
        </h1>
        <span className="text-3xl">🔮</span>
      </div>
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="hidden md:flex flex-col items-end text-xs">
              <span className="text-amber-200 font-medium">{user.name}</span>
              <span className="text-amber-100/60">
                {user.freeReadings} grátis | {user.quickCredits} rápidas | {user.fullCredits} completas
              </span>
            </div>
            <button
              onClick={() => setShowPricingModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Comprar Créditos
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 border border-amber-500/40 text-amber-200 text-xs font-semibold rounded-lg hover:bg-amber-500/10 transition-colors"
            >
              Sair
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg transition-all"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );

  // Render Views based on Stage
  const renderContent = () => {
    switch (stage) {
      case ReadingStage.MODE_SELECTION:
        return (
          <div className="flex flex-col items-center text-center max-w-4xl animate-fade-in mt-10 gap-8">
            <h2 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 mb-6 drop-shadow-lg">
              Escolha Seu Caminho
            </h2>
            <p className="text-lg text-blue-100/80 mb-8 font-sans leading-relaxed px-4">
              Duas formas de consultar o oráculo. Escolha a que ressoa com seu coração.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
              {/* Quick Reading */}
              <button
                onClick={() => selectMode(ReadingMode.QUICK)}
                className="group relative p-8 bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border-2 border-amber-500/30 hover:border-amber-500 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
              >
                <span className="text-5xl mb-4 block">🎴</span>
                <h3 className="text-2xl font-serif text-amber-400 mb-3">Consulta Rápida</h3>
                <p className="text-blue-100/70 text-sm mb-4">3 cartas para uma pergunta específica</p>
                <ul className="text-left text-xs text-blue-100/60 space-y-2">
                  <li>✦ Respostas diretas e objetivas</li>
                  <li>✦ Ideal para decisões rápidas</li>
                  <li>✦ ~5 minutos</li>
                </ul>
              </button>

              {/* Complete Reading */}
              <button
                onClick={() => selectMode(ReadingMode.COMPLETE)}
                className="group relative p-8 bg-gradient-to-br from-purple-950/80 to-indigo-950/80 border-2 border-amber-500/50 hover:border-amber-400 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
              >
                <span className="text-5xl mb-4 block">🔮</span>
                <h3 className="text-2xl font-serif text-amber-300 mb-3">Jornada Completa</h3>
                <p className="text-blue-100/70 text-sm mb-4">9 cartas revelando passado, presente e futuro</p>
                <ul className="text-left text-xs text-blue-100/60 space-y-2">
                  <li>✦ Análise profunda e detalhada</li>
                  <li>✦ Compreensão total da jornada</li>
                  <li>✦ ~15 minutos</li>
                </ul>
              </button>
            </div>
          </div>
        );

      // QUICK READING
      case ReadingStage.QUICK_INPUT:
        return <QuestionForm 
          title="Sua Pergunta ao Oráculo" 
          placeholder="Ex: Meu amor vai me procurar? Devo aceitar aquele emprego? O que preciso saber agora?" 
          onSubmit={handleQuickInput} 
        />;
      
      case ReadingStage.QUICK_DRAW:
        return <QuickDeck 
          availableCards={masterDeck} 
          onSelectionComplete={handleQuickCardsSelected} 
        />;

      // COMPLETE READING - PAST
      case ReadingStage.INPUT_PAST:
        return <QuestionForm 
          title="O Passado" 
          placeholder="O que tem pesado em sua mente sobre eventos passados? O que você sente que deixou para trás?" 
          onSubmit={(val) => handleInput(val, ReadingStage.DRAW_PAST, 'pastInput')} 
        />;
      case ReadingStage.DRAW_PAST:
        return <Deck 
          instruction="Escolha 3 cartas para o seu Passado" 
          availableCards={masterDeck} 
          onSelectionComplete={(cards) => handleCardsSelected(cards, ReadingStage.INPUT_PRESENT, 'pastCards')} 
        />;

      // PRESENT
      case ReadingStage.INPUT_PRESENT:
        return <div className="animate-fade-in w-full flex flex-col items-center">
           <div className="flex gap-2 mb-8 opacity-50 grayscale hover:grayscale-0 transition-all">
             {reading.pastCards.map(c => <Card key={c.id} card={c} isFlipped={true} disabled className="w-16 h-24" />)}
           </div>
           <QuestionForm 
            title="O Presente" 
            placeholder="Como você se sente neste exato momento? Quais são seus desafios atuais?" 
            onSubmit={(val) => handleInput(val, ReadingStage.DRAW_PRESENT, 'presentInput')} 
          />
        </div>;
      case ReadingStage.DRAW_PRESENT:
        return <Deck 
          instruction="Escolha 3 cartas para o seu Presente" 
          availableCards={masterDeck} 
          onSelectionComplete={(cards) => handleCardsSelected(cards, ReadingStage.INPUT_FUTURE, 'presentCards')} 
        />;

      // FUTURE
      case ReadingStage.INPUT_FUTURE:
        return <div className="animate-fade-in w-full flex flex-col items-center">
          <div className="flex gap-8 mb-8 opacity-50">
            <div className="flex gap-1">
                {reading.pastCards.map(c => <Card key={c.id} card={c} isFlipped={true} disabled className="w-12 h-20" />)}
            </div>
            <div className="flex gap-1">
                {reading.presentCards.map(c => <Card key={c.id} card={c} isFlipped={true} disabled className="w-12 h-20" />)}
            </div>
          </div>
          <QuestionForm 
            title="O Futuro" 
            placeholder="O que você deseja alcançar? Qual é a sua maior esperança?" 
            onSubmit={(val) => handleInput(val, ReadingStage.DRAW_FUTURE, 'futureInput')} 
          />
        </div>;
      case ReadingStage.DRAW_FUTURE:
        return <Deck 
          instruction="Escolha as 3 cartas finais para o seu Futuro" 
          availableCards={masterDeck} 
          onSelectionComplete={(cards) => handleCardsSelected(cards, ReadingStage.ANALYZING, 'futureCards')} 
        />;

      // LOADING
      case ReadingStage.ANALYZING:
        return (
          <div className="flex flex-col items-center justify-center h-64 animate-pulse-slow">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 blur-xl absolute opacity-50 animate-spin-slow"></div>
            <span className="text-6xl mb-4 z-10">🔮</span>
            <p className="text-xl font-serif text-amber-200">Interpretando as 9 cartas...</p>
          </div>
        );

      // RESULT
      case ReadingStage.RESULT:
        const isQuickMode = readingMode === ReadingMode.QUICK;
        
        return (
          <div className="w-full max-w-6xl animate-fade-in pb-20 px-4">
            <h2 className="text-3xl md:text-5xl font-serif text-center text-amber-100 mb-12 border-b border-amber-500/30 pb-6">
              {isQuickMode ? 'Resposta do Oráculo' : 'Revelação Final'}
            </h2>

            {/* Quick Reading - 3 Cards Display */}
            {isQuickMode && (
              <div className="mb-12">
                <div className="text-center mb-8">
                  <p className="text-lg text-amber-200/80 italic mb-6">"{quickReading.question}"</p>
                </div>
                
                <div className="flex gap-8 justify-center items-start flex-wrap">
                  {quickReading.cards.map((card, idx) => {
                    const labels = ['Situação Atual', 'Desafio', 'Resultado'];
                    return (
                      <div key={card.id} className="flex flex-col items-center gap-3">
                        <p className="text-amber-400 text-sm font-serif tracking-wider uppercase">{labels[idx]}</p>
                        <Card card={card} isFlipped={true} disabled className="w-28 h-44 md:w-32 md:h-52" />
                        <span className="text-xs text-center text-amber-100/70 mt-1">{card.nome}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Complete Reading - 9 Card Grid Layout */}
            {!isQuickMode && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
                {/* Column 1: Past */}
                <div className="flex flex-col gap-6 bg-indigo-950/30 p-6 rounded-xl border border-amber-500/10">
                  <div className="text-center mb-4">
                      <h3 className="font-serif text-amber-500 uppercase tracking-widest text-lg border-b border-amber-500/30 inline-block px-4 pb-1">O Passado</h3>
                      <p className="text-blue-200/60 text-sm mt-2 italic">"{reading.pastInput}"</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 justify-items-center">
                      {reading.pastCards.map(c => (
                          <div key={c.id} className="flex flex-col items-center">
                               <Card card={c} isFlipped={true} disabled className="w-full" />
                               <span className="text-[10px] text-center text-amber-100/70 mt-1">{c.nome}</span>
                          </div>
                      ))}
                  </div>
                </div>

                {/* Column 2: Present */}
                <div className={`flex flex-col gap-6 bg-indigo-900/40 p-6 rounded-xl border shadow-lg transform scale-105 z-10 ${isPremium ? 'border-amber-400/60 shadow-amber-500/20' : 'border-amber-500/30 shadow-amber-500/10'}`}>
                  <div className="text-center mb-4">
                      <h3 className="font-serif text-amber-400 uppercase tracking-widest text-xl font-bold border-b border-amber-400/50 inline-block px-4 pb-1">O Presente</h3>
                      <p className="text-blue-200/60 text-sm mt-2 italic">"{reading.presentInput}"</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 justify-items-center">
                      {reading.presentCards.map(c => (
                          <div key={c.id} className="flex flex-col items-center">
                               <Card card={c} isFlipped={true} disabled className="w-full" />
                               <span className="text-[10px] text-center text-amber-100/70 mt-1">{c.nome}</span>
                          </div>
                      ))}
                  </div>
                </div>

                {/* Column 3: Future */}
                <div className="flex flex-col gap-6 bg-indigo-950/30 p-6 rounded-xl border border-amber-500/10">
                  <div className="text-center mb-4">
                      <h3 className="font-serif text-amber-500 uppercase tracking-widest text-lg border-b border-amber-500/30 inline-block px-4 pb-1">O Futuro</h3>
                      <p className="text-blue-200/60 text-sm mt-2 italic">"{reading.futureInput}"</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 justify-items-center">
                      {reading.futureCards.map(c => (
                          <div key={c.id} className="flex flex-col items-center">
                               <Card card={c} isFlipped={true} disabled className="w-full" />
                               <span className="text-[10px] text-center text-amber-100/70 mt-1">{c.nome}</span>
                          </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Main AI Interpretation */}
            <div className={`bg-indigo-950/80 backdrop-blur-md border rounded-lg p-8 md:p-12 relative overflow-hidden mt-8 shadow-2xl ${isPremium ? 'border-amber-400/40' : 'border-amber-500/30'}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80 animate-pulse"></div>
              
              <h3 className="text-2xl md:text-3xl font-serif text-amber-200 mb-8 italic text-center">
                "{aiResult?.summary}"
              </h3>

              <div className="prose prose-invert prose-lg max-w-none font-sans text-blue-100/90 leading-relaxed whitespace-pre-wrap columns-1 md:columns-2 gap-12">
                {aiResult?.detailedAnalysis}
              </div>

              <div className="mt-12 pt-8 border-t border-amber-500/20">
                 <div className={`p-6 rounded-lg text-center ${isPremium ? 'bg-amber-900/20 border border-amber-500/40' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                    <h4 className="font-serif text-amber-400 mb-2 flex items-center justify-center gap-2 text-xl">
                    <span>✨</span> Conselho do Oráculo <span>✨</span>
                    </h4>
                    <p className="text-lg italic text-amber-100/90">
                    {aiResult?.advice}
                    </p>
                 </div>
              </div>
            </div>

            {/* Premium Content Section */}
            {isPremium ? (
              <div className="animate-fade-in mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Love */}
                <div className="bg-gradient-to-br from-pink-950/50 to-indigo-950/80 border border-pink-500/30 rounded-xl p-6 shadow-lg shadow-pink-900/20">
                   <h4 className="font-serif text-pink-300 text-xl mb-4 flex items-center gap-2">
                     <span>❤</span> Amor & Conexões
                   </h4>
                   <p className="text-sm text-pink-100/80 leading-relaxed">{aiResult?.loveAnalysis}</p>
                </div>
                
                {/* Career */}
                <div className="bg-gradient-to-br from-emerald-950/50 to-indigo-950/80 border border-emerald-500/30 rounded-xl p-6 shadow-lg shadow-emerald-900/20">
                   <h4 className="font-serif text-emerald-300 text-xl mb-4 flex items-center gap-2">
                     <span>💰</span> Carreira & Sucesso
                   </h4>
                   <p className="text-sm text-emerald-100/80 leading-relaxed">{aiResult?.careerAnalysis}</p>
                </div>

                {/* Hidden Factors */}
                <div className="bg-gradient-to-br from-purple-950/50 to-indigo-950/80 border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-900/20">
                   <h4 className="font-serif text-purple-300 text-xl mb-4 flex items-center gap-2">
                     <span>👁</span> Fatores Ocultos
                   </h4>
                   <p className="text-sm text-purple-100/80 leading-relaxed">{aiResult?.hiddenFactors}</p>
                </div>
              </div>
            ) : (
              /* Upsell Section (Freemium) */
              <div className="mt-8 relative overflow-hidden rounded-xl border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] group cursor-pointer" onClick={() => setShowPremiumModal(true)}>
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center flex-col text-center p-6 hover:bg-black/50 transition-all">
                    <h3 className="text-2xl font-serif text-amber-200 mb-2">Revelar o Relatório Cósmico Completo</h3>
                    <p className="text-amber-100/70 mb-6 max-w-md">Desbloqueie análises exclusivas de Amor, Carreira, Fatores Ocultos e remova todos os anúncios.</p>
                    <button className="bg-amber-500 text-black font-bold py-3 px-8 rounded-full hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30 animate-pulse-slow">
                       DESBLOQUEAR AGORA 🔓
                    </button>
                 </div>
                 
                 {/* Blurred preview content background */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 opacity-30 grayscale filter blur-sm">
                    <div className="h-40 bg-pink-900/20 border border-pink-500/30 rounded-xl"></div>
                    <div className="h-40 bg-emerald-900/20 border border-emerald-500/30 rounded-xl"></div>
                    <div className="h-40 bg-purple-900/20 border border-purple-500/30 rounded-xl"></div>
                 </div>
              </div>
            )}

            <div className="flex justify-center mt-12">
               <button 
                  onClick={() => window.location.reload()}
                  className="text-sm text-amber-500/50 hover:text-amber-500 underline decoration-dotted underline-offset-4 transition-colors"
               >
                 Realizar nova leitura
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-fixed">
      {/* Verificar se é página de verificação de email */}
      {window.location.search.includes('token=') ? (
        <VerifyEmail />
      ) : (
        <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={async (email: string, password: string) => {
          await login(email, password);
          setShowLoginModal(false);
          await refreshCredits();
        }}
        onRegister={async (email: string, password: string, name: string) => {
          await register(email, password, name);
          setShowLoginModal(false);
          await refreshCredits();
        }}
      />

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)}
      />

      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)}
        onPurchase={() => setShowPricingModal(true)}
      />

      {/* Email Verification Modal */}
      {showEmailVerificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-indigo-950/90 border border-amber-500/30 rounded-xl p-6 max-w-md w-full text-center">
            <h3 className="text-xl font-serif text-amber-300 mb-4">Verifique seu Email</h3>
            <p className="text-blue-100/80 mb-6">
              Enviamos um link de verificação para <strong>{user?.email}</strong>. 
              Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowEmailVerificationModal(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
              >
                Ok, entendi
              </button>
              <button
                onClick={async () => {
                  try {
                    await authService.resendVerification(user!.email);
                    alert('Email de verificação reenviado!');
                  } catch (error) {
                    alert('Erro ao reenviar email. Tente novamente.');
                  }
                }}
                className="px-4 py-2 border border-amber-500/40 text-amber-200 hover:bg-amber-500/10 rounded-lg transition-colors"
              >
                Reenviar
              </button>
            </div>
          </div>
        </div>
      )}

      {renderHeader()}
      
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        {renderContent()}
      </main>

      <footer className="text-center py-8 text-xs text-gray-600 mt-auto">
        <p>&copy; {new Date().getFullYear()} Mystic Oracle Tarot. Para fins de entretenimento.</p>
      </footer>
      )}
    </div>
  );
};

export default App;
