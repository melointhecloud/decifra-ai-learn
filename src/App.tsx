import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentRegister from "./pages/StudentRegister";
import TeacherRegister from "./pages/TeacherRegister";
import Login from "./pages/Login";
import StudentLayout from "./pages/student/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import DiagnosticIntro from "./pages/student/DiagnosticIntro";
import Diagnostic from "./pages/student/Diagnostic";
import DiagnosticReview from "./pages/student/DiagnosticReview";
import DiagnosticResults from "./pages/student/DiagnosticResults";
import PracticeReview from "./pages/student/PracticeReview";
import QuestionBank from "./pages/student/QuestionBank";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/registro/estudante" element={<StudentRegister />} />
            <Route path="/registro/professor" element={<TeacherRegister />} />
            <Route path="/registro" element={<StudentRegister />} />
            <Route path="/login" element={<Login />} />
            
            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="questions" element={<QuestionBank />} />
              <Route path="duels" element={<div className="p-6">Duelos - Em breve</div>} />
              <Route path="flashcards" element={<div className="p-6">Flashcards - Em breve</div>} />
              <Route path="performance" element={<div className="p-6">Meu Desempenho - Em breve</div>} />
              <Route path="profile" element={<div className="p-6">Perfil - Em breve</div>} />
            </Route>

            {/* Diagnostic routes - full screen without sidebar */}
            <Route path="/student/diagnostic/intro" element={
              <ProtectedRoute allowedRole="student">
                <DiagnosticIntro />
              </ProtectedRoute>
            } />
            <Route path="/student/diagnostic/test" element={
              <ProtectedRoute allowedRole="student">
                <Diagnostic />
              </ProtectedRoute>
            } />
            <Route path="/student/diagnostic/review" element={
              <ProtectedRoute allowedRole="student">
                <DiagnosticReview />
              </ProtectedRoute>
            } />
            <Route path="/student/diagnostic/results" element={
              <ProtectedRoute allowedRole="student">
                <DiagnosticResults />
              </ProtectedRoute>
            } />
            <Route path="/student/practice/review" element={
              <ProtectedRoute allowedRole="student">
                <PracticeReview />
              </ProtectedRoute>
            } />

            {/* Teacher Routes - Placeholder */}
            <Route path="/teacher/dashboard" element={
              <ProtectedRoute allowedRole="teacher">
                <div className="min-h-screen flex items-center justify-center">
                  <h1 className="text-2xl">Dashboard do Professor - Em breve</h1>
                </div>
              </ProtectedRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
