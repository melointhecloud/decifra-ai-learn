import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Target, TrendingUp, Clock } from "lucide-react";

const DiagnosticIntro = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Target, text: "Identificar seu nível atual" },
    { icon: CheckCircle, text: "Descobrir seus pontos fortes" },
    { icon: TrendingUp, text: "Criar um plano de estudos personalizado" },
    { icon: FileText, text: "Recomendar conteúdos específicos para você" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">Simulado Diagnóstico</CardTitle>
          <CardDescription className="text-base">
            Este teste tem 20 questões de matemática e lógica
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Não se preocupe com o resultado - ele servirá para:
            </p>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <benefit.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Tempo estimado: 30-40 minutos</span>
          </div>

          <Button
            onClick={() => navigate("/student/diagnostic/test")}
            className="w-full bg-gradient-to-r from-primary to-secondary text-lg py-6"
          >
            Começar Teste
          </Button>

          <Button
            onClick={() => navigate("/student/dashboard")}
            variant="ghost"
            className="w-full"
          >
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticIntro;
