import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Target, Clock, Award, Brain, Zap } from "lucide-react";
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const DiagnosticResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    score = 0,
    percentage = 0,
    performanceLevel = "Básico",
    totalTime = 0,
    xpEarned = 0,
    topicPerformance = [],
    difficultyPerformance = [],
    weakTopics = [],
    strongTopics = [],
    insights = [],
    recommendedFocus = [],
    answers = [],
  } = location.state || {};

  // Redirect if no data
  useEffect(() => {
    if (!location.state) {
      navigate("/student/dashboard", { replace: true });
    }
  }, [location.state, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

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

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Expert":
        return "🏆";
      case "Avançado":
        return "⭐";
      case "Intermediário":
        return "📚";
      default:
        return "🎯";
    }
  };

  // Chart colors
  const COLORS = {
    high: "#10b981",
    medium: "#f59e0b",
    low: "#ef4444",
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 70) return COLORS.high;
    if (accuracy >= 40) return COLORS.medium;
    return COLORS.low;
  };

  // Cumulative accuracy data for line chart
  const cumulativeAccuracy = answers.map((answer: any, index: number) => {
    const correctSoFar = answers.slice(0, index + 1).filter((a: any) => a.is_correct).length;
    const accuracy = Math.round((correctSoFar / (index + 1)) * 100);
    return {
      question: index + 1,
      accuracy,
    };
  });

  // Time vs correctness scatter data
  const timeVsCorrectness = answers.map((answer: any, index: number) => ({
    time: answer.time_seconds,
    correct: answer.is_correct ? 1 : 0,
    difficulty: answer.difficulty,
    question: index + 1,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Hero Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getLevelColor(performanceLevel)} flex items-center justify-center animate-scale-in shadow-lg`}>
                <Trophy className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-card border-2 border-border rounded-full px-4 py-1 shadow-md">
                <span className="text-2xl font-bold text-primary">
                  {percentage}%
                </span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-4xl font-bold">Simulado Concluído! {getLevelIcon(performanceLevel)}</h1>
              <p className="text-xl text-muted-foreground">
                Seu nível de conhecimento foi classificado como{" "}
                <span className={`font-bold bg-gradient-to-r ${getLevelColor(performanceLevel)} bg-clip-text text-transparent`}>
                  {performanceLevel}
                </span>
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  <Award className="h-4 w-4 mr-1" />
                  {xpEarned} XP
                </Badge>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  <Target className="h-4 w-4 mr-1" />
                  {score}/20 acertos
                </Badge>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(totalTime)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Topic Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Desempenho por Tópico
            </CardTitle>
            <CardDescription>Taxa de acerto em cada área do conhecimento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis label={{ value: 'Acertos (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                          <p className="font-semibold">{data.topic}</p>
                          <p className="text-sm">Acertos: {data.correct}/{data.total}</p>
                          <p className="text-sm">Precisão: {data.accuracy}%</p>
                          <p className="text-sm">Tempo médio: {Math.floor(data.avg_time / 60)}:{(data.avg_time % 60).toString().padStart(2, '0')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                  {topicPerformance.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={getAccuracyColor(entry.accuracy)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cumulative Accuracy Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução da Precisão
            </CardTitle>
            <CardDescription>Como seu desempenho evoluiu durante o teste</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeAccuracy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" label={{ value: 'Questão', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Acertos (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                          <p className="font-semibold">Questão {payload[0].payload.question}</p>
                          <p className="text-sm">Precisão acumulada: {payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Time vs Accuracy Scatter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Tempo vs Acertos
          </CardTitle>
          <CardDescription>Relação entre tempo gasto e precisão das respostas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" name="Tempo (s)" label={{ value: 'Tempo (segundos)', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="correct" name="Resultado" ticks={[0, 1]} tickFormatter={(value) => value === 1 ? 'Correto' : 'Incorreto'} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                        <p className="font-semibold">Questão {data.question}</p>
                        <p className="text-sm">Tempo: {Math.floor(data.time / 60)}:{(data.time % 60).toString().padStart(2, '0')}</p>
                        <p className="text-sm">Resultado: {data.correct ? 'Correto ✓' : 'Incorreto ✗'}</p>
                        <p className="text-sm">Dificuldade: {data.difficulty}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Questões" data={timeVsCorrectness} fill="#8b5cf6">
                {timeVsCorrectness.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.difficulty === 'hard' ? '#ef4444' : entry.difficulty === 'medium' ? '#f59e0b' : '#10b981'} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Fácil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Médio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Difícil</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Pontos Fortes
            </CardTitle>
            <CardDescription>Tópicos onde você se destacou</CardDescription>
          </CardHeader>
          <CardContent>
            {strongTopics.length > 0 ? (
              <ul className="space-y-3">
                {strongTopics.map((topic: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">{topic}</span>
                    <Badge variant="secondary" className="ml-auto bg-green-500/20">
                      ✓ Dominado
                    </Badge>
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

        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <TrendingDown className="h-5 w-5" />
              Áreas para Melhorar
            </CardTitle>
            <CardDescription>Tópicos que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            {weakTopics.length > 0 ? (
              <ul className="space-y-3">
                {weakTopics.map((topic: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="font-medium">{topic}</span>
                    <Badge variant="secondary" className="ml-auto bg-orange-500/20">
                      Prioridade {index + 1}
                    </Badge>
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

      {/* Insights Section */}
      {insights.length > 0 && (
        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Insights Personalizados
            </CardTitle>
            <CardDescription>Análise detalhada do seu desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <div className="mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{insight}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommended Study Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Plano de Estudos Recomendado
          </CardTitle>
          <CardDescription>
            Sugestões personalizadas baseadas no seu desempenho
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedFocus.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Foco Prioritário:</h4>
              {recommendedFocus.map((topic: string, index: number) => (
                <div key={index} className="p-4 rounded-lg border border-border bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{topic}</span>
                    <Badge>Semana {index * 2 + 1}-{index * 2 + 2}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dedique 60 minutos diários para melhorar neste tópico
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
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
            Ir para Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticResults;
