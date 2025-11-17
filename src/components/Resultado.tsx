import { motion } from "framer-motion";
import TarotCard from "./TarotCard";
import { Arcano } from "@/lib/tarotData";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface ResultadoProps {
  passado?: Arcano;
  presente?: Arcano;
  futuro?: Arcano;
}

const Resultado = ({ passado, presente, futuro }: ResultadoProps) => {
  const navigate = useNavigate();
  const isComplete = passado && presente && futuro;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Sua Leitura de Tarot
        </h2>
        <p className="text-muted-foreground text-lg">
          Passado • Presente • Futuro
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
        {/* Passado */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold text-primary mb-1">Passado</h3>
            <p className="text-sm text-muted-foreground">De onde você veio</p>
          </div>
          {passado ? (
            <TarotCard arcano={passado} isFlipped={true} showMeaning={true} />
          ) : (
            <div className="w-32 h-48 md:w-40 md:h-60 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
              <span className="text-primary/50 text-4xl">?</span>
            </div>
          )}
        </motion.div>

        {/* Presente */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold text-accent mb-1">Presente</h3>
            <p className="text-sm text-muted-foreground">Onde você está agora</p>
          </div>
          {presente ? (
            <TarotCard arcano={presente} isFlipped={true} showMeaning={true} />
          ) : (
            <div className="w-32 h-48 md:w-40 md:h-60 border-2 border-dashed border-accent/30 rounded-lg flex items-center justify-center">
              <span className="text-accent/50 text-4xl">?</span>
            </div>
          )}
        </motion.div>

        {/* Futuro */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold text-secondary mb-1">Futuro</h3>
            <p className="text-sm text-muted-foreground">Para onde você vai</p>
          </div>
          {futuro ? (
            <TarotCard arcano={futuro} isFlipped={true} showMeaning={true} />
          ) : (
            <div className="w-32 h-48 md:w-40 md:h-60 border-2 border-dashed border-secondary/30 rounded-lg flex items-center justify-center">
              <span className="text-secondary/50 text-4xl">?</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Action buttons after complete reading */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center space-y-4"
        >
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-3 text-foreground">
              Reflexão Final
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              As cartas revelaram sua jornada. O passado moldou quem você é, o presente é sua oportunidade de agir, 
              e o futuro aguarda suas escolhas. Lembre-se: o tarot é um guia, mas você é quem escreve sua história.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Fazer Nova Leitura
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
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
