import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const StudentRegister = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
        
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Registro de Estudante</h1>
            <p className="text-muted-foreground">
              Em breve: formulário de registro para estudantes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
