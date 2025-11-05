import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Target, CheckCircle, XCircle, Lightbulb, Trophy } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  alternatives: { letter: string; text: string }[];
  correct_answer: string;
  explanation: string;
  topic: string;
  difficulty_level: string;
}

interface WrongAnswer {
  question: Question;
  userAnswer: string;
  timeSpent: number;
}

export default function PracticeReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());
  const [xpEarned, setXpEarned] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const selectedTopic = location.state?.topic || null;

  useEffect(() => {
    if (!user) return;
    fetchWrongQuestions();
  }, [user, selectedTopic]);

  const fetchWrongQuestions = async () => {
    try {
      setLoading(true);

      // Get the latest diagnostic result
      const { data: diagnosticData, error: diagnosticError } = await supabase
        .from("diagnostic_results")
        .select("answers")
        .eq("user_id", user?.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (diagnosticError) throw diagnosticError;
      if (!diagnosticData) {
        toast.error("Nenhum diagnóstico encontrado");
        navigate("/student/dashboard");
        return;
      }

      const answers = diagnosticData.answers as any[];
      const wrongQuestionIds = answers
        .filter((a) => !a.isCorrect)
        .map((a) => a.questionId);

      if (wrongQuestionIds.length === 0) {
        toast.info("Parabéns! Você não errou nenhuma questão!");
        navigate("/student/dashboard");
        return;
      }

      // Fetch the wrong questions details
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .in("id", wrongQuestionIds);

      if (questionsError) throw questionsError;

      // Map questions with user answers
      const wrongAnswersData = questionsData
        .map((q) => {
          const answer = answers.find((a) => a.questionId === q.id);
          return {
            question: {
              ...q,
              alternatives: q.alternatives as any as { letter: string; text: string }[],
            },
            userAnswer: answer?.selectedAnswer || "",
            timeSpent: answer?.timeSpent || 0,
          };
        })
        .filter((item) => {
          if (selectedTopic) {
            return item.question.topic === selectedTopic;
          }
          return true;
        });

      setWrongAnswers(wrongAnswersData);
    } catch (error: any) {
      console.error("Error fetching wrong questions:", error);
      toast.error("Erro ao carregar questões");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyBadge = (level: string) => {
    const levels = {
      basico: { label: "Básico", variant: "default" as const, color: "bg-green-500" },
      intermediario: { label: "Intermediário", variant: "secondary" as const, color: "bg-yellow-500" },
      avancado: { label: "Avançado", variant: "destructive" as const, color: "bg-red-500" },
    };
    return levels[level as keyof typeof levels] || levels.basico;
  };

  const handleMarkAsUnderstood = async () => {
    try {
      const currentQuestion = wrongAnswers[currentIndex];
      
      // Award XP
      const earnedXP = 5;
      setXpEarned((prev) => prev + earnedXP);

      // Update student progress
      const { data: progressData } = await supabase
        .from("student_progress")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (progressData) {
        await supabase
          .from("student_progress")
          .update({
            total_xp: progressData.total_xp + earnedXP,
            last_activity: new Date().toISOString(),
          })
          .eq("user_id", user?.id);
      } else {
        await supabase.from("student_progress").insert({
          user_id: user?.id,
          total_xp: earnedXP,
        });
      }

      // Mark as reviewed
      const newReviewed = new Set(reviewed);
      newReviewed.add(currentIndex);
      setReviewed(newReviewed);

      toast.success(`+${earnedXP} XP! Questão marcada como revisada`);

      // Move to next question or finish
      if (currentIndex < wrongAnswers.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowExplanation(true);
      } else {
        showCompletionScreen();
      }
    } catch (error) {
      console.error("Error marking as understood:", error);
      toast.error("Erro ao salvar progresso");
    }
  };

  const handleStillHaveDoubt = () => {
    toast.info("Esta questão foi marcada para revisão futura");
    const newReviewed = new Set(reviewed);
    newReviewed.add(currentIndex);
    setReviewed(newReviewed);

    if (currentIndex < wrongAnswers.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(true);
    } else {
      showCompletionScreen();
    }
  };

  const showCompletionScreen = () => {
    toast.success(
      <div className="flex flex-col gap-2">
        <p className="font-bold">🎉 Parabéns! Você revisou todas as questões!</p>
        <p>XP total ganho: {xpEarned} pontos</p>
      </div>,
      { duration: 5000 }
    );
    navigate("/student/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando questões...</p>
        </div>
      </div>
    );
  }

  if (wrongAnswers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Parabéns!</h2>
          <p className="text-muted-foreground mb-6">
            Você não tem questões para revisar neste tópico.
          </p>
          <Button onClick={() => navigate("/student/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = wrongAnswers[currentIndex];
  const difficultyBadge = getDifficultyBadge(currentQuestion.question.difficulty_level);
  const progressPercentage = ((reviewed.size) / wrongAnswers.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/student/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Revisão de Questões Erradas</h1>
            <p className="text-muted-foreground mt-2">
              Aprenda com seus erros e fortaleça seu conhecimento
            </p>
          </div>

          {selectedTopic && (
            <Badge variant="secondary" className="text-sm">
              Tópico: {selectedTopic}
            </Badge>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Questão {currentIndex + 1} de {wrongAnswers.length}
              </span>
              <span className="font-medium">
                {reviewed.size}/{wrongAnswers.length} revisadas
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {xpEarned > 0 && (
            <Badge variant="outline" className="text-primary">
              <Trophy className="w-3 h-3 mr-1" />
              {xpEarned} XP ganhos
            </Badge>
          )}
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6 space-y-6">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge className={difficultyBadge.color}>
              {difficultyBadge.label}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Tópico: {currentQuestion.question.topic}
            </p>
          </div>
          <Badge variant="destructive" className="shrink-0">
            <XCircle className="w-3 h-3 mr-1" />
            Questão Errada - Diagnóstico
          </Badge>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {currentQuestion.question.question_text}
          </h3>

          {/* Alternatives */}
          <div className="space-y-3">
            {currentQuestion.question.alternatives.map((alt: any) => {
              const isCorrect = alt.letter === currentQuestion.question.correct_answer;
              const isUserAnswer = alt.letter === currentQuestion.userAnswer;

              return (
                <div
                  key={alt.letter}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : isUserAnswer
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold">{alt.letter})</span>
                    <span className="flex-1">{alt.text}</span>
                    {isCorrect && (
                      <Badge variant="default" className="bg-green-600 shrink-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Correta
                      </Badge>
                    )}
                    {isUserAnswer && !isCorrect && (
                      <Badge variant="destructive" className="shrink-0">
                        <XCircle className="w-3 h-3 mr-1" />
                        Sua Resposta
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation Section */}
        {showExplanation && (
          <div className="pt-6 border-t space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="w-5 h-5" />
              <h4 className="text-lg font-bold">EXPLICAÇÃO DETALHADA</h4>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-foreground whitespace-pre-wrap">
                {currentQuestion.question.explanation}
              </p>
            </div>

            <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Conceito: {currentQuestion.question.topic}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Dica: Sempre revise os conceitos fundamentais antes de resolver questões complexas!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1 min-w-[200px]">
            <BookOpen className="w-4 h-4 mr-2" />
            Revisar Conceito
          </Button>
          <Button variant="outline" className="flex-1 min-w-[200px]">
            <Target className="w-4 h-4 mr-2" />
            Praticar Similar
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleMarkAsUnderstood}
            className="flex-1 min-w-[200px]"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Entendi (+5 XP)
          </Button>
          <Button
            onClick={handleStillHaveDoubt}
            variant="secondary"
            className="flex-1 min-w-[200px]"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Ainda tenho dúvidas
          </Button>
        </div>
      </Card>
    </div>
  );
}
