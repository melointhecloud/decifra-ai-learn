import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { diagnosticQuestions } from "@/data/diagnosticQuestions";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const Diagnostic = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const questions = diagnosticQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (!selectedAnswer) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione uma resposta",
        variant: "destructive",
      });
      return;
    }

    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate("/student/diagnostic/review", { state: { answers: newAnswers } });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = answers[questions[currentQuestionIndex - 1].id];
      setSelectedAnswer(previousAnswer || "");
    }
  };

  const handleSkip = () => {
    setSelectedAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate("/student/diagnostic/review", { state: { answers } });
    }
  };

  const isAnswered = (questionId: string) => !!answers[questionId];
  const getQuestionStatus = (index: number) => {
    if (index === currentQuestionIndex) return "current";
    if (isAnswered(questions[index].id)) return "answered";
    return "unanswered";
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-gradient-to-br from-background to-muted/20">
      {/* Question palette sidebar */}
      <div className="w-64 border-r bg-card p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Questões</h3>
        <div className="grid grid-cols-4 gap-2">
          {questions.map((q, index) => {
            const status = getQuestionStatus(index);
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer(answers[q.id] || "");
                }}
                className={`
                  aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all
                  ${status === "current" ? "border-primary bg-primary text-primary-foreground" : ""}
                  ${status === "answered" ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400" : ""}
                  ${status === "unanswered" ? "border-border hover:border-muted-foreground" : ""}
                `}
              >
                {status === "answered" && <CheckCircle className="h-4 w-4" />}
                {status !== "answered" && index + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-6 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary bg-primary"></div>
            <span>Atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500/10"></div>
            <span>Respondida</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-border"></div>
            <span>Não respondida</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
              <span>{Object.keys(answers).length} respondidas</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question_text}
                </CardTitle>
                <span className="text-xs bg-muted px-2 py-1 rounded-full whitespace-nowrap">
                  {currentQuestion.topic}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                <div className="space-y-3">
                  {currentQuestion.alternatives.map((alt) => (
                    <div
                      key={alt.id}
                      className={`
                        flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${selectedAnswer === alt.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-muted-foreground hover:bg-muted/50"
                        }
                      `}
                      onClick={() => setSelectedAnswer(alt.id)}
                    >
                      <RadioGroupItem value={alt.id} id={alt.id} className="mt-0.5" />
                      <Label htmlFor={alt.id} className="flex-1 cursor-pointer font-normal">
                        <span className="font-semibold mr-2">{alt.id}.</span>
                        {alt.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  disabled={currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1"
                >
                  Pular
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNext} className="gap-2 flex-1">
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gap-2 flex-1 bg-gradient-to-r from-primary to-secondary">
                    Revisar
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diagnostic;
