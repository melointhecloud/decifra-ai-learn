import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target, Trophy, Clock } from "lucide-react";
import { diagnosticQuestions, Question } from "@/data/diagnosticQuestions";
import { QuestionSolver } from "@/components/QuestionSolver";
import { toast } from "sonner";

const topics = ["Todos", "Álgebra básica", "Geometria", "Raciocínio lógico", "Porcentagem e razão", "Funções"];
const difficulties = ["Todos", "easy", "medium", "hard"];
const statuses = ["Todas", "Não feitas", "Certas", "Erradas"];

const difficultyLabels: Record<string, string> = {
  easy: "Básico",
  medium: "Intermediário",
  hard: "Avançado"
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/20 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  hard: "bg-red-500/20 text-red-700 dark:text-red-400"
};

export default function QuestionBank() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("Todos");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todas");
  const [sortBy, setSortBy] = useState("recent");
  const [questionAttempts, setQuestionAttempts] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterQuestions();
  }, [selectedTopic, selectedDifficulty, selectedStatus, sortBy, questionAttempts]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load question attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from("question_attempts")
        .select("*")
        .eq("user_id", user.id);

      if (attemptsError) throw attemptsError;
      setQuestionAttempts(attempts || []);

      // Load diagnostic results to get weak topics
      const { data: diagnostic, error: diagnosticError } = await supabase
        .from("diagnostic_results")
        .select("weak_topics")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (diagnosticError) throw diagnosticError;
      
      if (diagnostic?.weak_topics) {
        const topics = Array.isArray(diagnostic.weak_topics) 
          ? (diagnostic.weak_topics as string[])
          : [];
        setWeakTopics(topics);
      }

    } catch (error: any) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...diagnosticQuestions];

    // Filter by topic
    if (selectedTopic !== "Todos") {
      filtered = filtered.filter(q => q.topic === selectedTopic);
    }

    // Filter by difficulty
    if (selectedDifficulty !== "Todos") {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    // Filter by status
    if (selectedStatus !== "Todas") {
      filtered = filtered.filter(q => {
        const attempts = questionAttempts.filter(a => a.question_id === q.id);
        
        if (selectedStatus === "Não feitas") {
          return attempts.length === 0;
        } else if (selectedStatus === "Certas") {
          return attempts.some(a => a.is_correct);
        } else if (selectedStatus === "Erradas") {
          return attempts.length > 0 && attempts.every(a => !a.is_correct);
        }
        return true;
      });
    }

    // Sort
    if (sortBy === "difficulty") {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    }

    setFilteredQuestions(filtered);
  };

  const getQuestionStatus = (questionId: string) => {
    const attempts = questionAttempts.filter(a => a.question_id === questionId);
    if (attempts.length === 0) return "not-attempted";
    if (attempts.some(a => a.is_correct)) return "correct";
    return "incorrect";
  };

  const getRecommendedQuestions = () => {
    return diagnosticQuestions
      .filter(q => {
        const attempts = questionAttempts.filter(a => a.question_id === q.id);
        const wasWrong = attempts.length > 0 && attempts.every(a => !a.is_correct);
        const isWeakTopic = weakTopics.includes(q.topic);
        return wasWrong || isWeakTopic;
      })
      .slice(0, 5);
  };

  const handleQuestionComplete = () => {
    setSelectedQuestion(null);
    loadData();
  };

  const getXpForQuestion = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return 10;
      case "medium": return 15;
      case "hard": return 20;
      default: return 10;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const recommendedQuestions = getRecommendedQuestions();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Banco de Questões</h1>
          <p className="text-muted-foreground">
            Pratique e aprimore seus conhecimentos
          </p>
        </div>

        {/* Recommended Section */}
        {recommendedQuestions.length > 0 && (
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                🎯 Recomendadas para você
              </CardTitle>
              <CardDescription>
                Questões baseadas nos seus pontos fracos e erros anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedQuestions.map((question) => (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={difficultyColors[question.difficulty]}>
                          {difficultyLabels[question.difficulty]}
                        </Badge>
                        <span className="text-sm font-semibold text-primary">
                          +{getXpForQuestion(question.difficulty)} XP
                        </span>
                      </div>
                      <CardTitle className="text-sm">{question.topic}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {question.question_text}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => setSelectedQuestion(question)}
                      >
                        Resolver Agora
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tópico</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Dificuldade</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff === "Todos" ? diff : difficultyLabels[diff]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recente</SelectItem>
                    <SelectItem value="difficulty">Dificuldade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Todas as Questões ({filteredQuestions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuestions.map((question) => {
              const status = getQuestionStatus(question.id);
              
              return (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={difficultyColors[question.difficulty]}>
                        {difficultyLabels[question.difficulty]}
                      </Badge>
                      {status === "correct" && (
                        <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">
                          ✓ Acertou
                        </Badge>
                      )}
                      {status === "incorrect" && (
                        <Badge className="bg-red-500/20 text-red-700 dark:text-red-400">
                          ✗ Errou
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-sm">{question.topic}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {question.question_text}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        +{getXpForQuestion(question.difficulty)} XP
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      variant={status === "correct" ? "outline" : "default"}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      {status === "correct" ? "Refazer" : "Resolver Agora"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredQuestions.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Nenhuma questão encontrada com os filtros selecionados
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Question Solver Modal */}
      {selectedQuestion && (
        <QuestionSolver
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onComplete={handleQuestionComplete}
        />
      )}
    </>
  );
}
