import {
  Component,
  Home,
  NotebookPen,
  Pencil,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Início",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Usuários",
    url: "#",
    icon: Users,
  },
  {
    title: "Arquétipos",
    url: "#",
    icon: Pencil,
  },
  {
    title: "Módulos",
    url: "#",
    icon: Component,
  },
  {
    title: "Atividades",
    url: "#",
    icon: NotebookPen,
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
