import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Swords, CreditCard, TrendingUp, Award, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Simulado Diagnóstico",
      description: "Avalie seu nível de conhecimento",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      action: () => navigate("/student/diagnostic"),
    },
    {
      title: "Duelos",
      description: "Desafie outros estudantes",
      icon: Swords,
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/student/duels"),
    },
    {
      title: "Flashcards",
      description: "Revise conceitos importantes",
      icon: CreditCard,
      color: "from-green-500 to-emerald-500",
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

      {/* Diagnostic Test Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Faça o Simulado Diagnóstico
          </CardTitle>
          <CardDescription>
            Descubra seu nível atual e receba um plano de estudos personalizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => navigate("/student/diagnostic")}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            Começar Agora
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={action.action}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-2`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
