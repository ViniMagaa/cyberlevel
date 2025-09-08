import {
  ChartNoAxesCombined,
  FileText,
  Home,
  Settings,
  Store,
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

export function ResponsibleSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Início */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/responsavel">
                    <Home />
                    <span>Início</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ARtigos */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/responsavel/artigos">
                    <FileText />
                    <span>Artigos</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Estatísticas */}
              <SidebarMenuSubItem>
                <SidebarMenuButton asChild>
                  <a href="/responsavel/estatisticas">
                    <ChartNoAxesCombined />
                    <span>Estatísticas</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuSubItem>

              {/* Loja */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/responsavel/loja">
                    <Store />
                    <span>Loja</span>
                  </a>
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
              <a href="/responsavel/configuracoes">
                <Settings />
                <span>Configurações</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
