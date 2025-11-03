import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur px-4 py-2 rounded-full border border-primary/20 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground/80">
                Powered by AI
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Aprenda Matemática com{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Inteligência Artificial
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              Plataforma educacional que adapta o ensino ao seu ritmo de aprendizagem. 
              Domine matemática e lógica com tutoria personalizada por IA.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all text-base sm:text-lg px-8 py-6"
              >
                <Link to="/registro/estudante" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Sou Estudante
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="border-2 border-primary/20 hover:bg-primary/5 text-base sm:text-lg px-8 py-6"
              >
                <Link to="/registro/professor" className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Sou Professor
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Questões Adaptativas</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Tutoria com IA</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Taxa de Aprovação</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-3xl opacity-20" />
            <img
              src={heroImage}
              alt="Estudantes aprendendo com IA"
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const GraduationCap = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export default Hero;
