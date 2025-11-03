import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { diagnosticQuestions } from "@/data/diagnosticQuestions";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const DiagnosticReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const answers = (location.state?.answers as Record<string, string>) || {};
  const answeredCount = Object.keys(answers).length;
  const skippedCount = diagnosticQuestions.length - answeredCount;
  const skippedQuestions = diagnosticQuestions.filter(q => !answers[q.id]);

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Calculate score and topics
      let correctCount = 0;
      const topicScores: Record<string, { correct: number; total: number }> = {};

      diagnosticQuestions.forEach((question) => {
        const userAnswer = answers[question.id];
        if (userAnswer === question.correct_answer) {
          correctCount++;
        }

        if (!topicScores[question.topic]) {
          topicScores[question.topic] = { correct: 0, total: 0 };
        }
        topicScores[question.topic].total++;
        if (userAnswer === question.correct_answer) {
          topicScores[question.topic].correct++;
        }
      });

      const score = Math.round((correctCount / diagnosticQuestions.length) * 100);
      
      // Determine performance level
      let performanceLevel = "Básico";
      if (score > 70) performanceLevel = "Avançado";
      else if (score > 40) performanceLevel = "Intermediário";

      // Identify weak and strong topics
      const weakTopics = Object.entries(topicScores)
        .filter(([_, scores]) => (scores.correct / scores.total) * 100 < 50)
        .map(([topic]) => topic);

      const strongTopics = Object.entries(topicScores)
        .filter(([_, scores]) => (scores.correct / scores.total) * 100 > 70)
        .map(([topic]) => topic);

      // Save to database
      const { error } = await supabase.from("diagnostic_results").insert({
        user_id: user.id,
        score,
        performance_level: performanceLevel,
        weak_topics: weakTopics,
        strong_topics: strongTopics,
        answers: answers,
      });

      if (error) throw error;

      navigate("/student/diagnostic/results", {
        state: { score, performanceLevel, weakTopics, strongTopics },
      });
    } catch (error) {
      console.error("Error saving results:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os resultados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Revisão do Simulado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 border-2 border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Respondidas</span>
                </div>
                <p className="text-3xl font-bold">{answeredCount}/20</p>
              </div>

              <div className="bg-yellow-500/10 border-2 border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Puladas</span>
                </div>
                <p className="text-3xl font-bold">{skippedCount}</p>
              </div>

              <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Tempo</span>
                </div>
                <p className="text-3xl font-bold">~30min</p>
              </div>
            </div>

            {/* Skipped questions */}
            {skippedQuestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Questões Puladas</h3>
                <div className="space-y-2">
                  {skippedQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">Questão {diagnosticQuestions.indexOf(question) + 1}</span>
                        <p className="text-sm text-muted-foreground">{question.topic}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/student/diagnostic/test")}
                      >
                        Responder Agora
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/student/diagnostic/test")}
              >
                Revisar Respostas
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Finalizando..." : "Finalizar Simulado"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiagnosticReview;
