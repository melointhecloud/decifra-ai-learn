import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, TrendingDown, Target } from "lucide-react";

const DiagnosticResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, performanceLevel, weakTopics, strongTopics } = location.state || {
    score: 0,
    performanceLevel: "Básico",
    weakTopics: [],
    strongTopics: [],
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getLevelColor = (level: string) => {
    if (level === "Avançado") return "from-green-500 to-emerald-500";
    if (level === "Intermediário") return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Score Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Trophy className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-card border-2 border-border rounded-full px-4 py-1">
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl">Simulado Concluído!</CardTitle>
          <CardDescription className="text-lg">
            Seu nível de conhecimento foi classificado como{" "}
            <span
              className={`font-bold bg-gradient-to-r ${getLevelColor(
                performanceLevel
              )} bg-clip-text text-transparent`}
            >
              {performanceLevel}
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Pontos Fortes
            </CardTitle>
            <CardDescription>Tópicos onde você se destacou</CardDescription>
          </CardHeader>
          <CardContent>
            {strongTopics.length > 0 ? (
              <ul className="space-y-2">
                {strongTopics.map((topic: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">{topic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Continue estudando para desenvolver seus pontos fortes!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weak Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <TrendingDown className="h-5 w-5" />
              Áreas para Melhorar
            </CardTitle>
            <CardDescription>Tópicos que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            {weakTopics.length > 0 ? (
              <ul className="space-y-2">
                {weakTopics.map((topic: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm">{topic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Parabéns! Você tem um bom domínio de todos os tópicos.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Próximos Passos
          </CardTitle>
          <CardDescription>
            Recomendações personalizadas baseadas no seu desempenho
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => navigate("/student/questions")}
              variant="outline"
              className="justify-start h-auto py-4"
            >
              <div className="text-left">
                <p className="font-semibold">Banco de Questões</p>
                <p className="text-xs text-muted-foreground">
                  Pratique tópicos específicos
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/student/flashcards")}
              variant="outline"
              className="justify-start h-auto py-4"
            >
              <div className="text-left">
                <p className="font-semibold">Flashcards</p>
                <p className="text-xs text-muted-foreground">
                  Revise conceitos importantes
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/student/duels")}
              variant="outline"
              className="justify-start h-auto py-4"
            >
              <div className="text-left">
                <p className="font-semibold">Duelos</p>
                <p className="text-xs text-muted-foreground">
                  Desafie outros estudantes
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/student/performance")}
              variant="outline"
              className="justify-start h-auto py-4"
            >
              <div className="text-left">
                <p className="font-semibold">Meu Desempenho</p>
                <p className="text-xs text-muted-foreground">
                  Acompanhe seu progresso
                </p>
              </div>
            </Button>
          </div>

          <Button
            onClick={() => navigate("/student/dashboard")}
            className="w-full bg-gradient-to-r from-primary to-secondary"
            size="lg"
          >
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticResults;
