import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Swords, CreditCard, TrendingUp, Award, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const diagnosticCompleted = false; // TODO: Check from database

  const features = [
    {
      title: "Banco de Questões",
      description: "Pratique com questões personalizadas",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      locked: !diagnosticCompleted,
      action: () => navigate("/student/questions"),
    },
    {
      title: "Duelos",
      description: "Desafie outros estudantes",
      icon: Swords,
      color: "from-purple-500 to-pink-500",
      locked: !diagnosticCompleted,
      action: () => navigate("/student/duels"),
    },
    {
      title: "Flashcards",
      description: "Revise conceitos importantes",
      icon: CreditCard,
      color: "from-green-500 to-emerald-500",
      locked: !diagnosticCompleted,
      action: () => navigate("/student/flashcards"),
    },
  ];

  const stats = [
    { label: "Questões Respondidas", value: "0", icon: Target },
    { label: "Taxa de Acerto", value: "0%", icon: TrendingUp },
    { label: "Conquistas", value: "0", icon: Award },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground">
          Pronto para continuar sua jornada de aprendizado?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Diagnostic Test Card - Priority Banner */}
      {!diagnosticCompleted && (
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="h-6 w-6" />
                  Complete seu Simulado Diagnóstico
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Avalie seu nível atual e receba um plano de estudos personalizado com base nos seus resultados
                </CardDescription>
              </div>
              <div className="bg-primary/20 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                Não iniciado
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/student/diagnostic/intro")}
              className="bg-gradient-to-r from-primary to-secondary text-lg h-12"
              size="lg"
            >
              Iniciar Agora
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recursos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={`relative transition-all ${
                feature.locked
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-lg hover:scale-[1.02]"
              }`}
              onClick={feature.locked ? undefined : feature.action}
            >
              {feature.locked && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Complete o diagnóstico para desbloquear</p>
                  </div>
                </div>
              )}
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-2`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
