import {
  ChartNoAxesCombined,
  FileText,
  Home,
  Settings,
  Store,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Logo } from "./logo";
import { SignOutButton } from "./sign-out-button";
import { Separator } from "./ui/separator";

export function ResponsibleSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="gap-0">
        <div className="flex items-center justify-between p-4">
          <Logo />
          <SignOutButton />
        </div>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Início */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/responsavel">
                    <Home />
                    <span>Início</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Artigos */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/responsavel/artigos">
                    <FileText />
                    <span>Artigos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Estatísticas */}
              <SidebarMenuSubItem>
                <SidebarMenuButton asChild>
                  <Link href="/responsavel/aprendizes">
                    <Users />
                    <span>Aprendizes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuSubItem>

              {/* Estatísticas */}
              <SidebarMenuSubItem>
                <SidebarMenuButton asChild>
                  <Link href="/responsavel/estatisticas">
                    <ChartNoAxesCombined />
                    <span>Estatísticas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuSubItem>

              {/* Loja */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/responsavel/loja">
                    <Store />
                    <span>Loja</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Configurações */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/responsavel/configuracoes">
                <Settings />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
