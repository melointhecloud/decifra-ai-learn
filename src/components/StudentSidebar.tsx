import { Home, FileText, Swords, CreditCard, BarChart3, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { GraduationCap } from "lucide-react";

const menuItems = [
  { title: "Início", url: "/student/dashboard", icon: Home },
  { title: "Simulado Diagnóstico", url: "/student/diagnostic/intro", icon: FileText },
  { title: "Banco de Questões", url: "/student/questions", icon: FileText },
  { title: "Duelos", url: "/student/duels", icon: Swords },
  { title: "Flashcards", url: "/student/flashcards", icon: CreditCard },
  { title: "Meu Desempenho", url: "/student/performance", icon: BarChart3 },
  { title: "Perfil", url: "/student/profile", icon: User },
];

export function StudentSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/student/dashboard" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DecifraAI
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
