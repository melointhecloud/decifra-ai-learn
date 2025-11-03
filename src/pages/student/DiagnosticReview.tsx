import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock } from "lucide-react";
import { diagnosticQuestions } from "@/data/diagnosticQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DiagnosticReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { answers = {}, questionTimes = {}, totalTime = 0 } = location.state || {};

  const answeredQuestions = diagnosticQuestions.filter((q) => answers[q.id]);
  const skippedQuestions = diagnosticQuestions.filter((q) => !answers[q.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDetailedResults = () => {
    // Calculate score
    let correctCount = 0;
    const detailedAnswers = diagnosticQuestions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;
      if (isCorrect) correctCount++;

      return {
        question_id: question.id,
        selected_answer: userAnswer || null,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        time_seconds: questionTimes[question.id] || 0,
        topic: question.topic,
        difficulty: question.difficulty,
      };
    });

    const score = correctCount;
    const percentage = Math.round((correctCount / diagnosticQuestions.length) * 100);

    // Topic performance analysis
    const topicStats: Record<string, { total: number; correct: number; totalTime: number }> = {};
    detailedAnswers.forEach((answer) => {
      if (!topicStats[answer.topic]) {
        topicStats[answer.topic] = { total: 0, correct: 0, totalTime: 0 };
      }
      topicStats[answer.topic].total++;
      if (answer.is_correct) topicStats[answer.topic].correct++;
      topicStats[answer.topic].totalTime += answer.time_seconds;
    });

    const topicPerformance = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      total: stats.total,
      correct: stats.correct,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      avg_time: Math.round(stats.totalTime / stats.total),
    }));

    // Difficulty performance analysis
    const difficultyStats: Record<string, { total: number; correct: number }> = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 },
    };

    detailedAnswers.forEach((answer) => {
      const diff = answer.difficulty;
      if (difficultyStats[diff]) {
        difficultyStats[diff].total++;
        if (answer.is_correct) difficultyStats[diff].correct++;
      }
    });

    const difficultyPerformance = Object.entries(difficultyStats).map(([difficulty, stats]) => ({
      difficulty,
      total: stats.total,
      correct: stats.correct,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }));

    // Determine performance level
    let performanceLevel = "Básico";
    const hardQuestionsCorrect = difficultyStats.hard.correct;
    const mediumQuestionsCorrect = difficultyStats.medium.correct;

    if (percentage >= 85 && hardQuestionsCorrect >= 2) {
      performanceLevel = "Expert";
    } else if (percentage > 70 && (mediumQuestionsCorrect >= 3 || hardQuestionsCorrect >= 1)) {
      performanceLevel = "Avançado";
    } else if (percentage > 40) {
      performanceLevel = "Intermediário";
    }

    // Identify weak and strong topics
    const weakTopics = topicPerformance
      .filter((t) => t.accuracy < 50)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map((t) => t.topic);

    const strongTopics = topicPerformance
      .filter((t) => t.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy)
      .map((t) => t.topic);

    // Generate insights
    const insights: string[] = [];
    
    if (strongTopics.length > 0) {
      insights.push(`Você se destaca em ${strongTopics[0]}. Continue praticando!`);
    }
    
    if (weakTopics.length > 0) {
      insights.push(`Foque em ${weakTopics[0]} nas próximas 2 semanas para melhorar.`);
    }
    
    const avgTimePerQuestion = totalTime / diagnosticQuestions.length;
    if (avgTimePerQuestion < 90) {
      insights.push("Você responde rapidamente. Certifique-se de ler as questões com atenção.");
    } else if (avgTimePerQuestion > 180) {
      insights.push("Pratique mais para aumentar sua velocidade de resolução.");
    }

    if (skippedQuestions.length > 5) {
      insights.push("Tente responder todas as questões. Seu desempenho melhora quando você não pula.");
    }

    return {
      score,
      percentage,
      performanceLevel,
      totalTime,
      xpEarned: score * 10,
      answers: detailedAnswers,
      topicPerformance,
      difficultyPerformance,
      weakTopics,
      strongTopics,
      insights,
      recommendedFocus: weakTopics.slice(0, 3),
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const results = calculateDetailedResults();

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return;
      }

      // Save to database
      const { error } = await supabase.from("diagnostic_results").insert({
        user_id: user.id,
        score: results.score,
        performance_level: results.performanceLevel,
        answers: results.answers,
        weak_topics: results.weakTopics,
        strong_topics: results.strongTopics,
      });

      if (error) {
        console.error("Error saving results:", error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar os resultados",
          variant: "destructive",
        });
        return;
      }

      // Navigate to detailed results page
      navigate("/student/diagnostic/results", { 
        state: results,
        replace: true 
      });
    } catch (error) {
      console.error("Error processing results:", error);
      toast({
        title: "Erro",
        description: "Erro ao processar resultados",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revisão do Simulado</CardTitle>
          <CardDescription>
            Confira suas respostas antes de finalizar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {answeredQuestions.length}
              </div>
              <div className="text-sm text-muted-foreground">Respondidas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-orange-500">
                {skippedQuestions.length}
              </div>
              <div className="text-sm text-muted-foreground">Puladas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-blue-500 flex items-center justify-center gap-2">
                <Clock className="h-6 w-6" />
                {formatTime(totalTime)}
              </div>
              <div className="text-sm text-muted-foreground">Tempo Total</div>
            </div>
          </div>

          {/* Skipped Questions Warning */}
          {skippedQuestions.length > 0 && (
            <Card className="border-orange-500/50 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  Questões Puladas
                </CardTitle>
                <CardDescription>
                  Você pulou {skippedQuestions.length} questão(ões). Elas contarão como incorretas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skippedQuestions.map((q, index) => (
                    <Badge key={q.id} variant="outline" className="border-orange-500">
                      Questão {diagnosticQuestions.indexOf(q) + 1}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1"
            >
              Revisar Respostas
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              {isSubmitting ? "Processando..." : "Finalizar Simulado"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticReview;
