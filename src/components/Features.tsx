import { Brain, TrendingUp, Trophy, Users, MessageSquare, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Tutoria com IA",
    description: "BloomAssistant, seu tutor virtual 24/7 baseado em Google Gemini, responde dúvidas e explica conceitos de forma personalizada.",
    color: "from-primary to-primary/80"
  },
  {
    icon: TrendingUp,
    title: "Aprendizagem Adaptativa",
    description: "Sistema inteligente que ajusta a dificuldade das questões baseado no seu desempenho e ritmo de aprendizagem.",
    color: "from-secondary to-secondary/80"
  },
  {
    icon: Trophy,
    title: "Gamificação",
    description: "Ganhe pontos, conquiste badges e suba no ranking enquanto aprende. Motivação constante para seu progresso.",
    color: "from-primary to-secondary"
  },
  {
    icon: BarChart3,
    title: "Análise de Desempenho",
    description: "Acompanhe seu progresso com relatórios detalhados e visualizações que mostram suas conquistas e áreas de melhoria.",
    color: "from-secondary to-primary"
  },
  {
    icon: Users,
    title: "Dashboard para Professores",
    description: "Monitore o desempenho da turma, identifique dificuldades e acompanhe o progresso individual de cada aluno.",
    color: "from-primary/80 to-primary"
  },
  {
    icon: MessageSquare,
    title: "Histórico Persistente",
    description: "Todas as suas conversas com o tutor IA ficam salvas para consulta futura e revisão de conceitos.",
    color: "from-secondary/80 to-secondary"
  }
];

const Features = () => {
  return (
    <section id="funcionalidades" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-card opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Tudo que você precisa para{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              dominar matemática
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Uma plataforma completa com recursos desenvolvidos para maximizar seu aprendizado
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Pronto para transformar sua forma de aprender?
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-medium">
            <span>Comece gratuitamente hoje</span>
            <svg
              className="w-5 h-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
