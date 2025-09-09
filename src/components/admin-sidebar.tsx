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
import Link from "next/link";

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
                  <Link href="/admin">
                    <Home />
                    <span>Início</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Usuários */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/usuarios">
                    <Users />
                    <span>Usuários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Produtos */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/produtos">
                    <Store />
                    <span>Produtos</span>
                  </Link>
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
                          <Link href="/admin/arquetipos">
                            <Component />
                            <span>Arquétipos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      {/* Atividades */}
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link href="/admin/atividades">
                            <NotebookPen />
                            <span>Atividades</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      {/* Artigos */}
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link href="/admin/artigos">
                            <FileText />
                            <span>Artigos</span>
                          </Link>
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
              <Link href="/admin/configuracoes">
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
