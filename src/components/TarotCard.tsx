import { motion } from "framer-motion";
import { Arcano } from "@/lib/tarotData";

interface TarotCardProps {
  arcano?: Arcano;
  isFlipped: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  position?: { x: number; y: number };
  showMeaning?: boolean;
}

const TarotCard = ({ 
  arcano, 
  isFlipped, 
  onClick, 
  isSelected,
  position,
  showMeaning = false 
}: TarotCardProps) => {
  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={onClick}
      initial={position ? { x: position.x, y: position.y } : false}
      animate={position ? { x: 0, y: 0 } : {}}
      whileHover={!isSelected ? { scale: 1.05, y: -10 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className="relative w-32 h-48 md:w-40 md:h-60"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src="/cards/card-back.png"
            alt="Carta de Tarot"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden shadow-xl border border-primary/30"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {arcano ? (
            <>
              <img
                src={arcano.imagem}
                alt={arcano.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/cards/card-back.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background to-transparent">
                <h3 className="text-foreground font-bold text-sm md:text-base text-center drop-shadow-lg">
                  {arcano.nome}
                </h3>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-card flex items-center justify-center">
              <span className="text-muted-foreground">Carta</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Glow effect when hovering */}
      {!isSelected && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            boxShadow: "0 0 30px hsl(var(--primary) / 0.3)",
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Card meaning - shown below the card */}
      {showMeaning && arcano && isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-4 text-center max-w-xs mx-auto"
        >
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {arcano.palavrasChave.map((palavra) => (
              <span
                key={palavra}
                className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary"
              >
                {palavra}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {arcano.significado}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TarotCard;
