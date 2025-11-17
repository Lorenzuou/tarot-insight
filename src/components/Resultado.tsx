import { motion } from "framer-motion";
import TarotCard from "./TarotCard";
import { Arcano } from "@/lib/tarotData";
import { tarotPositions, getPositionById } from "@/lib/tarotPositions";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface ResultadoProps {
  selectedCards: Map<number, Arcano>;
}

const Resultado = ({ selectedCards }: ResultadoProps) => {
  const navigate = useNavigate();
  const isComplete = selectedCards.size === 9;

  const getCardByPosition = (positionId: number): Arcano | undefined => {
    return selectedCards.get(positionId);
  };

  const renderRow = (rowName: string, positionIds: number[], colorClass: string, delay: number) => {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay }}
          className="text-center"
        >
          <h3 className={`text-2xl md:text-3xl font-bold mb-2 text-${colorClass}`}>
            {rowName}
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {positionIds.map((positionId, index) => {
            const position = getPositionById(positionId);
            const arcano = getCardByPosition(positionId);
            
            return (
              <motion.div
                key={positionId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + (index * 0.1) }}
                className="flex flex-col items-center"
              >
                <div className="mb-4 text-center max-w-xs">
                  <h4 className={`text-lg font-bold text-${colorClass} mb-1`}>
                    {position?.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {position?.description}
                  </p>
                </div>
                
                {arcano ? (
                  <TarotCard arcano={arcano} isFlipped={true} showMeaning={true} />
                ) : (
                  <div className="w-32 h-48 md:w-40 md:h-60 border-2 border-dashed border-border/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-muted-foreground/50 text-3xl block mb-2">?</span>
                      <span className="text-xs text-muted-foreground/50">{positionId}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Leitura Expandida de 9 Cartas
        </h2>
        <p className="text-muted-foreground text-lg">
          Uma jornada completa através do tempo: Passado • Presente • Futuro
        </p>
      </motion.div>

      <div className="space-y-16">
        {/* Fileira de Baixo - Passado */}
        {renderRow("Passado", [1, 2, 3], "primary", 0.2)}

        {/* Divisor */}
        {selectedCards.size >= 3 && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
        )}

        {/* Fileira do Meio - Presente */}
        {selectedCards.size >= 3 && renderRow("Presente", [4, 5, 6], "accent", 0.6)}

        {/* Divisor */}
        {selectedCards.size >= 6 && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9 }}
            className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
        )}

        {/* Fileira de Cima - Futuro */}
        {selectedCards.size >= 6 && renderRow("Futuro", [7, 8, 9], "secondary", 1.0)}
      </div>

      {/* Action buttons after complete reading */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="text-center space-y-6 mt-16"
        >
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Reflexão Final
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              As nove cartas revelaram uma jornada completa através do seu passado, presente e futuro. 
              Cada carta oferece uma perspectiva única sobre diferentes aspectos de sua vida. 
              Reflita sobre como essas mensagens se conectam e o que elas significam para você. 
              Lembre-se: o tarot é um guia, mas você é quem escreve sua história.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8"
            >
              Fazer Nova Leitura
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              Voltar ao Início
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Resultado;
