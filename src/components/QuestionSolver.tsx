import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/data/diagnosticQuestions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, ChevronRight, BookOpen, Target, Flame } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface QuestionSolverProps {
  question: Question;
  onClose: () => void;
  onComplete: () => void;
}

export function QuestionSolver({ question, onClose, onComplete }: QuestionSolverProps) {
  const { user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    loadStreak();

    return () => clearInterval(timer);
  }, [startTime]);

  const loadStreak = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("student_progress")
        .select("current_streak")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setStreak(data?.current_streak || 0);
    } catch (error) {
      console.error("Error loading streak:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getXpForQuestion = (difficulty: string, isFirstAttempt: boolean, hasStreak: boolean) => {
    let baseXp = 0;
    switch (difficulty) {
      case "easy": baseXp = 10; break;
      case "medium": baseXp = 15; break;
      case "hard": baseXp = 20; break;
      default: baseXp = 10;
    }

    if (isFirstAttempt) baseXp += 10;
    if (hasStreak) baseXp += 5;
    
    return baseXp;
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !user) return;

    setSubmitting(true);
    const correct = selectedAnswer === question.correct_answer;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      // Check if this is first attempt
      const { data: existingAttempts } = await supabase
        .from("question_attempts")
        .select("id")
        .eq("user_id", user.id)
        .eq("question_id", question.id);

      const isFirstAttempt = !existingAttempts || existingAttempts.length === 0;
      const xpEarned = correct ? getXpForQuestion(question.difficulty, isFirstAttempt, streak > 0) : 0;

      // Save attempt
      const { error: attemptError } = await supabase
        .from("question_attempts")
        .insert({
          user_id: user.id,
          question_id: question.id,
          selected_answer: selectedAnswer,
          is_correct: correct,
          time_spent_seconds: timeTaken,
          source: "question_bank",
          xp_earned: xpEarned
        });

      if (attemptError) throw attemptError;

      // Update student progress
      const { data: progress, error: progressFetchError } = await supabase
        .from("student_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (progressFetchError) throw progressFetchError;

      const newTotalQuestions = (progress?.questions_answered || 0) + 1;
      const totalCorrect = correct 
        ? ((progress?.overall_accuracy || 0) * (progress?.questions_answered || 0) / 100) + 1
        : ((progress?.overall_accuracy || 0) * (progress?.questions_answered || 0) / 100);
      const newAccuracy = (totalCorrect / newTotalQuestions) * 100;
      const newStreak = correct ? (progress?.current_streak || 0) + 1 : 0;
      const newLongestStreak = Math.max(newStreak, progress?.longest_streak || 0);

      if (progress) {
        const { error: updateError } = await supabase
          .from("student_progress")
          .update({
            total_xp: (progress.total_xp || 0) + xpEarned,
            questions_answered: newTotalQuestions,
            overall_accuracy: newAccuracy,
            current_streak: newStreak,
            longest_streak: newLongestStreak,
            last_activity: new Date().toISOString()
          })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("student_progress")
          .insert({
            user_id: user.id,
            total_xp: xpEarned,
            questions_answered: 1,
            overall_accuracy: correct ? 100 : 0,
            current_streak: correct ? 1 : 0,
            longest_streak: correct ? 1 : 0
          });

        if (insertError) throw insertError;
      }

      // Update topic progress
      const { data: topicProgress, error: topicFetchError } = await supabase
        .from("topic_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("topic_name", question.topic)
        .maybeSingle();

      if (topicFetchError) throw topicFetchError;

      if (topicProgress) {
        const newAttempted = (topicProgress.questions_attempted || 0) + 1;
        const newCorrect = (topicProgress.questions_correct || 0) + (correct ? 1 : 0);
        const newAccuracy = (newCorrect / newAttempted) * 100;
        const totalTime = ((topicProgress.average_time || 0) * (topicProgress.questions_attempted || 0)) + timeTaken;
        const newAvgTime = totalTime / newAttempted;

        const { error: updateTopicError } = await supabase
          .from("topic_progress")
          .update({
            questions_attempted: newAttempted,
            questions_correct: newCorrect,
            current_accuracy: newAccuracy,
            average_time: newAvgTime,
            last_practiced: new Date().toISOString()
          })
          .eq("user_id", user.id)
          .eq("topic_name", question.topic);

        if (updateTopicError) throw updateTopicError;
      } else {
        const { error: insertTopicError } = await supabase
          .from("topic_progress")
          .insert({
            user_id: user.id,
            topic_name: question.topic,
            questions_attempted: 1,
            questions_correct: correct ? 1 : 0,
            current_accuracy: correct ? 100 : 0,
            average_time: timeTaken
          });

        if (insertTopicError) throw insertTopicError;
      }

      // Update daily activity
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyActivity, error: dailyFetchError } = await supabase
        .from("daily_activity")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (dailyFetchError) throw dailyFetchError;

      if (dailyActivity) {
        const { error: updateDailyError } = await supabase
          .from("daily_activity")
          .update({
            questions_answered: (dailyActivity.questions_answered || 0) + 1,
            time_spent_minutes: (dailyActivity.time_spent_minutes || 0) + Math.floor(timeTaken / 60),
            xp_earned: (dailyActivity.xp_earned || 0) + xpEarned
          })
          .eq("user_id", user.id)
          .eq("date", today);

        if (updateDailyError) throw updateDailyError;
      } else {
        const { error: insertDailyError } = await supabase
          .from("daily_activity")
          .insert({
            user_id: user.id,
            date: today,
            questions_answered: 1,
            time_spent_minutes: Math.floor(timeTaken / 60),
            xp_earned: xpEarned
          });

        if (insertDailyError) throw insertDailyError;
      }

      setIsCorrect(correct);
      setShowFeedback(true);

      if (correct) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success(`Correto! +${xpEarned} XP`);
      } else {
        toast.error("Resposta incorreta");
      }

    } catch (error: any) {
      console.error("Error submitting answer:", error);
      toast.error("Erro ao salvar resposta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    onComplete();
    onClose();
  };

  const difficultyLabels: Record<string, string> = {
    easy: "Básico",
    medium: "Intermediário",
    hard: "Avançado"
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onClose}>
              ← Voltar
            </Button>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeSpent)}
              </span>
              {streak > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {streak} sequência
                </Badge>
              )}
              <Badge variant="secondary">
                <Trophy className="h-3 w-3 mr-1" />
                +{getXpForQuestion(question.difficulty, true, streak > 0)} XP
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-2xl mt-4">
            {question.topic} - {difficultyLabels[question.difficulty]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {!showFeedback ? (
            <>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg mb-6">{question.question_text}</p>
                  
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {question.alternatives.map((alt) => (
                        <div
                          key={alt.id}
                          className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <RadioGroupItem value={alt.id} id={alt.id} />
                          <Label htmlFor={alt.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">{alt.id})</span> {alt.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedAnswer || submitting}
                >
                  {submitting ? "Enviando..." : "Confirmar Resposta"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Card className={isCorrect ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"}>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className={`text-6xl mb-4`}>
                      {isCorrect ? "✅" : "❌"}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {isCorrect ? "RESPOSTA CORRETA!" : "RESPOSTA INCORRETA"}
                    </h3>
                    {isCorrect && (
                      <div className="space-y-2 text-sm">
                        <p>+{getXpForQuestion(question.difficulty, true, streak > 0)} XP ganhos</p>
                        {streak > 0 && (
                          <p className="flex items-center justify-center gap-2">
                            <Flame className="h-4 w-4 text-orange-500" />
                            Sequência de acertos: {streak + 1}
                          </p>
                        )}
                        <p>Você acertou em {formatTime(timeSpent)}</p>
                      </div>
                    )}
                    {!isCorrect && (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Sua resposta: <span className="font-semibold">{selectedAnswer}</span></p>
                        <p>Resposta correta: <span className="font-semibold text-green-600 dark:text-green-400">{question.correct_answer}</span></p>
                      </div>
                    )}
                  </div>

                  <div className="bg-card border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      EXPLICAÇÃO:
                    </h4>
                    <p className="text-muted-foreground">{question.explanation}</p>
                  </div>

                  {!isCorrect && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Esta questão foi adicionada aos seus flashcards para revisão
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Voltar ao Banco
                </Button>
                <Button onClick={handleNext}>
                  Próxima Questão
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
