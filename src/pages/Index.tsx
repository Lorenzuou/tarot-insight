import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AdSlot from "@/components/AdSlot";
import { Sparkles, Eye, Clock, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Leitura Completa Gratuita",
      description: "9 cartas para uma análise profunda e detalhada"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Método Profissional",
      description: "Técnica expandida 3x3 usada por tarologistas experientes"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Análise Temporal Completa",
      description: "3 aspectos detalhados de cada período temporal"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Insights Múltiplos",
      description: "Compreenda eventos, emoções, influências e perspectivas"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Mystical animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-mystic-navy to-background" />
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Header with Ad */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50">
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-16 h-16 text-primary" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Descubra seu Futuro
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Leitura Expandida de 9 Cartas - Método Profissional
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 mb-12 max-w-2xl mx-auto"
            >
              <p className="text-lg text-foreground leading-relaxed mb-4">
                Conecte-se com a sabedoria ancestral do tarot através da 
                <span className="text-primary font-semibold"> Leitura Expandida de 9 Cartas</span>.
                Uma análise profunda e completa em três dimensões temporais:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="font-bold text-primary mb-1">Passado</div>
                  <div className="text-muted-foreground">3 cartas revelam eventos, emoções e influências</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="font-bold text-accent mb-1">Presente</div>
                  <div className="text-muted-foreground">3 cartas mostram situação, sentimentos e ambiente</div>
                </div>
                <div className="text-center p-3 bg-secondary/10 rounded-lg">
                  <div className="font-bold text-secondary mb-1">Futuro</div>
                  <div className="text-muted-foreground">3 cartas indicam resultados, desafios e perspectivas</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                onClick={() => navigate("/leitura")}
                size="lg"
                className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
              >
                Iniciar Minha Leitura ✨
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Por Que Escolher Nossa Leitura?
            </h2>
            <p className="text-muted-foreground text-lg">
              Uma experiência de tarot moderna e intuitiva
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Como Funciona
            </h2>
            <p className="text-muted-foreground text-lg">
              Simples passos para sua leitura expandida de tarot
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Concentre-se em sua questão",
                description: "Pense na área da sua vida sobre a qual deseja orientação profunda"
              },
              {
                step: "2",
                title: "Escolha suas nove cartas",
                description: "Confie em sua intuição para selecionar cada carta sequencialmente"
              },
              {
                step: "3",
                title: "Explore a análise completa",
                description: "Descubra 9 perspectivas diferentes: eventos, emoções, influências, situações, sentimentos, ambiente, resultados, desafios e conselhos"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => navigate("/leitura")}
              size="lg"
              className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Começar Agora ✨
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Bottom Ad Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <AdSlot width="728px" height="90px" position="bottom" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground text-sm space-y-2">
            <p>© 2024 Tarot Místico. Todos os direitos reservados.</p>
            <p className="text-xs">
              Este site é apenas para fins de entretenimento. O tarot não substitui aconselhamento profissional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
