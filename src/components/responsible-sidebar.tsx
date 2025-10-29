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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Logo } from "./logo";
import { SignOutButton } from "./sign-out-button";
import { Separator } from "./ui/separator";

const items = [
  {
    title: "Início",
    url: "/responsavel",
    icon: Home,
  },
  {
    title: "Artigos",
    url: "/responsavel/artigos",
    icon: FileText,
  },
  {
    title: "Aprendizes",
    url: "/responsavel/aprendizes",
    icon: Users,
  },
  {
    title: "Estatísticas",
    url: "/responsavel/estatisticas",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Loja",
    url: "/responsavel/loja",
    icon: Store,
  },
];

export function ResponsibleSidebar() {
  return (
    <Sidebar className="z-40">
      <SidebarContent className="gap-0 text-xl sm:text-base">
        <div className="flex items-center justify-between p-4">
          <Logo path="/responsavel" />
          <SignOutButton />
        </div>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel className="text-base">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="gap-3 px-3 py-5" asChild>
                    <Link href={item.url}>
                      <item.icon className="size-5!" />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Configurações */}
          <SidebarMenuItem>
            <SidebarMenuButton className="gap-3 px-3 py-5" asChild>
              <Link href="/responsavel/configuracoes">
                <Settings className="size-5!" />
                <span className="text-lg">Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
