import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { FileText, Swords, CreditCard, TrendingUp, Award, Target, Trophy, Brain, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDiagnosticResults();
    }
  }, [user]);

  const fetchDiagnosticResults = async () => {
    try {
      const { data, error } = await supabase
        .from("diagnostic_results")
        .select("*")
        .eq("user_id", user?.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setDiagnosticResults(data);
      }
    } catch (error) {
      console.error("Error fetching diagnostic results:", error);
    } finally {
      setLoading(false);
    }
  };

  const diagnosticCompleted = !!diagnosticResults;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "from-yellow-400 to-orange-500";
      case "Avançado":
        return "from-purple-500 to-pink-500";
      case "Intermediário":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-orange-500 to-red-500";
    }
  };

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

  const stats = diagnosticCompleted
    ? [
        { label: "Questões Respondidas", value: "20", icon: Target },
        { label: "Taxa de Acerto", value: `${Math.round((diagnosticResults.score / 20) * 100)}%`, icon: TrendingUp },
        { label: "XP Conquistado", value: diagnosticResults.score * 10, icon: Award },
      ]
    : [
        { label: "Questões Respondidas", value: "0", icon: Target },
        { label: "Taxa de Acerto", value: "0%", icon: TrendingUp },
        { label: "Conquistas", value: "0", icon: Award },
      ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground">
          {diagnosticCompleted
            ? "Continue sua jornada de aprendizado"
            : "Pronto para começar sua jornada de aprendizado?"}
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

      {/* Diagnostic Results or Call to Action */}
      {diagnosticCompleted ? (
        <Card className={`border-2 bg-gradient-to-br ${getLevelColor(diagnosticResults.performance_level)}/10 shadow-lg`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-2xl mb-2">
                  <Trophy className="h-6 w-6" />
                  Seu Progresso
                </CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`bg-gradient-to-r ${getLevelColor(diagnosticResults.performance_level)} text-white border-0 px-3 py-1`}>
                      {diagnosticResults.performance_level}
                    </Badge>
                    <span className="text-lg font-semibold">
                      {diagnosticResults.score}/20 ({Math.round((diagnosticResults.score / 20) * 100)}%)
                    </span>
                  </div>

                  {/* Topic Progress */}
                  {diagnosticResults.weak_topics && diagnosticResults.weak_topics.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-sm font-medium">Áreas em Foco:</p>
                      <div className="flex flex-wrap gap-2">
                        {diagnosticResults.weak_topics.slice(0, 3).map((topic: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {diagnosticResults.strong_topics && diagnosticResults.strong_topics.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-green-600">Pontos Fortes:</p>
                      <div className="flex flex-wrap gap-2">
                        {diagnosticResults.strong_topics.slice(0, 3).map((topic: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-green-500/20 border-green-500/30">
                            ✓ {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/student/diagnostic/results", {
                state: {
                  score: diagnosticResults.score,
                  percentage: Math.round((diagnosticResults.score / 20) * 100),
                  performanceLevel: diagnosticResults.performance_level,
                  weakTopics: diagnosticResults.weak_topics || [],
                  strongTopics: diagnosticResults.strong_topics || [],
                  topicPerformance: [],
                  difficultyPerformance: [],
                  insights: [],
                  recommendedFocus: diagnosticResults.weak_topics?.slice(0, 3) || [],
                  answers: diagnosticResults.answers || [],
                }
              })}
              variant="outline"
              className="w-full"
            >
              Ver Análise Completa
            </Button>
          </CardContent>
        </Card>
      ) : (
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

      {/* Recommended Practice Section (Only if diagnostic completed) */}
      {diagnosticCompleted && diagnosticResults.weak_topics && diagnosticResults.weak_topics.length > 0 && (
        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Prática Recomendada
            </CardTitle>
            <CardDescription>
              Foque nestas áreas para melhorar seu desempenho
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {diagnosticResults.weak_topics.slice(0, 2).map((topic: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <div>
                    <p className="font-medium">{topic}</p>
                    <p className="text-xs text-muted-foreground">Foco prioritário para esta semana</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate("/student/practice/review", { state: { topic } })}
                  >
                    Praticar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Recursos Disponíveis
          {diagnosticCompleted && (
            <Badge variant="secondary" className="bg-green-500/20 border-green-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Desbloqueados
            </Badge>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              {diagnosticCompleted && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500 text-white text-xs">Novo!</Badge>
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
