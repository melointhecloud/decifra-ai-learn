import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { FileText, Clock, Award } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  alternatives: string[];
  correct_answer: string;
  topic: string;
  difficulty_level: string;
  explanation: string;
}

const Diagnostic = () => {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<{ question_id: string; selected_answer: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (started) {
      fetchQuestions();
    }
  }, [started]);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .limit(20);

    if (error) {
      toast({
        title: "Erro ao carregar questões",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Parse the JSON alternatives field to string array
    const parsedQuestions = (data || []).map((q) => ({
      ...q,
      alternatives: Array.isArray(q.alternatives) ? q.alternatives : JSON.parse(q.alternatives as string),
    })) as Question[];

    setQuestions(parsedQuestions);
    setLoading(false);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      toast({
        title: "Selecione uma resposta",
        description: "Por favor, escolha uma alternativa antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setAnswers([
      ...answers,
      { question_id: questions[currentQuestionIndex].id, selected_answer: selectedAnswer },
    ]);
    setSelectedAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      toast({
        title: "Selecione uma resposta",
        description: "Por favor, escolha uma alternativa antes de finalizar.",
        variant: "destructive",
      });
      return;
    }

    const finalAnswers = [
      ...answers,
      { question_id: questions[currentQuestionIndex].id, selected_answer: selectedAnswer },
    ];

    // Calculate score
    let correctCount = 0;
    const topicScores: { [key: string]: { correct: number; total: number } } = {};

    finalAnswers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.question_id);
      if (question) {
        const isCorrect = answer.selected_answer === question.correct_answer;
        if (isCorrect) correctCount++;

        if (!topicScores[question.topic]) {
          topicScores[question.topic] = { correct: 0, total: 0 };
        }
        topicScores[question.topic].total++;
        if (isCorrect) topicScores[question.topic].correct++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    let performanceLevel = "Básico";
    if (score >= 70) performanceLevel = "Avançado";
    else if (score >= 40) performanceLevel = "Intermediário";

    const weakTopics = Object.entries(topicScores)
      .filter(([_, scores]) => scores.correct / scores.total < 0.5)
      .map(([topic]) => topic);

    const strongTopics = Object.entries(topicScores)
      .filter(([_, scores]) => scores.correct / scores.total >= 0.7)
      .map(([topic]) => topic);

    // Save results
    const { error } = await supabase.from("diagnostic_results").insert({
      user_id: user?.id,
      score,
      performance_level: performanceLevel,
      weak_topics: weakTopics,
      strong_topics: strongTopics,
      answers: finalAnswers,
    });

    if (error) {
      toast({
        title: "Erro ao salvar resultados",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    navigate("/student/diagnostic/results", {
      state: { score, performanceLevel, weakTopics, strongTopics },
    });
  };

  if (!started) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Simulado Diagnóstico</CardTitle>
            </div>
            <CardDescription>
              Teste seu conhecimento e descubra seu nível atual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">20 Questões</p>
                  <p className="text-sm text-muted-foreground">
                    Sem limite de tempo, responda com calma
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Plano Personalizado</p>
                  <p className="text-sm text-muted-foreground">
                    Receba recomendações baseadas no seu desempenho
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStarted(true)}
              className="w-full bg-gradient-to-r from-primary to-secondary"
              size="lg"
            >
              Começar Simulado
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Questão {currentQuestionIndex + 1} de {questions.length}
          </span>
          <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
              {currentQuestion.topic}
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary/10 text-secondary">
              {currentQuestion.difficulty_level}
            </span>
          </div>
          <CardTitle className="text-xl">{currentQuestion.question_text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            <div className="space-y-3">
              {currentQuestion.alternatives.map((alt, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <RadioGroupItem value={alt} id={`alt-${index}`} />
                  <Label htmlFor={`alt-${index}`} className="flex-1 cursor-pointer">
                    {alt}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex gap-3">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                Finalizar Simulado
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                Próxima Questão
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Diagnostic;
