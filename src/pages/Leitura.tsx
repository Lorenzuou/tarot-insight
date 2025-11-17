import { useState } from "react";
import { motion } from "framer-motion";
import Deck from "@/components/Deck";
import Resultado from "@/components/Resultado";
import AdSlot from "@/components/AdSlot";
import { Arcano } from "@/lib/tarotData";

const Leitura = () => {
  const [selectedCards, setSelectedCards] = useState<Map<number, Arcano>>(new Map());
  const [selectedCount, setSelectedCount] = useState(0);

  const handleCardSelected = (arcano: Arcano, positionId: number) => {
    setSelectedCount(prev => prev + 1);
    
    setTimeout(() => {
      setSelectedCards(prev => new Map(prev).set(positionId, arcano));
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Mystical background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-mystic-navy" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header with Ad */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ✨ Tarot Místico
              </h1>
            </motion.div>
            
            <div className="hidden md:block">
              <AdSlot width="728px" height="90px" position="top" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Ad */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <AdSlot width="250px" height="600px" position="sidebar" />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="space-y-12">
              {/* Results Section */}
              <Resultado selectedCards={selectedCards} />

              {/* Deck Section */}
              {selectedCount < 9 && (
                <div className="pt-8 border-t border-border/30">
                  <Deck 
                    onCardSelected={handleCardSelected}
                    selectedCount={selectedCount}
                  />
                </div>
              )}

              {/* Bottom Ad (shown after reading is complete) */}
              {selectedCount >= 9 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="flex justify-center pt-8"
                >
                  <AdSlot width="728px" height="90px" position="bottom" />
                </motion.div>
              )}
            </div>
          </main>

          {/* Right sidebar with Ad (mobile) */}
          <aside className="lg:hidden">
            <AdSlot width="300px" height="250px" position="sidebar" />
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 backdrop-blur-sm bg-background/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>© 2024 Tarot Místico. Apenas para fins de entretenimento.</p>
        </div>
      </footer>
    </div>
  );
};

export default Leitura;
