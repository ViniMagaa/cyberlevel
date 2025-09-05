import {
  ChevronDown,
  Component,
  FileText,
  Home,
  NotebookPen,
  Settings,
  Store,
  Users,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
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
                  <a href="/admin">
                    <Home />
                    <span>Início</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Usuários */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/usuarios">
                    <Users />
                    <span>Usuários</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Produtos */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/produtos">
                    <Store />
                    <span>Produtos</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      Conteúdo
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Arquétipos */}
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <a href="/admin/arquetipos">
                            <Component />
                            <span>Arquétipos</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      {/* Atividades */}
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <a href="/admin/atividades">
                            <NotebookPen />
                            <span>Atividades</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      {/* Artigos */}
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <a href="/admin/artigos">
                            <FileText />
                            <span>Artigos</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Configurações */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/admin/configuracoes">
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
