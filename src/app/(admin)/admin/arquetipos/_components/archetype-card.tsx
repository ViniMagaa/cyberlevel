"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prisma } from "@prisma/client";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteArchetype } from "../actions";

type ArchetypeCardProps = {
  archetype: Prisma.ArchetypeGetPayload<{
    select: {
      id: true;
      name: true;
      description: true;
      modules: {
        include: {
          _count: true;
          activities: true;
        };
      };
    };
  }>;
};

export function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteArchetype(archetype.id);
        toast.success("Arquétipo excluído com sucesso");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir arquétipo");
      }
    });
  }

  function handleOpenDialog(setOpen: (value: boolean) => void) {
    setIsDropdownOpen(false);
    setOpen(true);
  }

  const activitiesTotal = archetype.modules.reduce(
    (acc, mod) => acc + mod._count.activities,
    0,
  );

  return (
    <Card className="relative">
      <CardContent className="space-y-2">
        <CardTitle>{archetype.name}</CardTitle>
        <CardDescription className="space-y-1">
          <p className="line-clamp-4">{archetype.description}</p>
          <div>
            <strong className="text-white">Módulos:</strong>{" "}
            {archetype.modules.length}
          </div>
          <div>
            <strong className="text-white">Atividades:</strong>{" "}
            {activitiesTotal}
          </div>
        </CardDescription>
      </CardContent>

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="absolute top-2 right-2" asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleOpenDialog(setIsDialogOpen)}>
            <Eye /> Visualizar
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/admin/arquetipos/editar/${archetype.id}`)
            }
          >
            <Pencil /> Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleOpenDialog(setIsAlertOpen)}
            disabled={isPending}
          >
            <Trash /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="space-y-3">
            <DialogTitle>{archetype.name}</DialogTitle>
            <DialogDescription className="space-y-2">
              <div>
                <strong className="text-white">Módulos:</strong>{" "}
                {archetype.modules.length}
              </div>
              <div>
                <strong className="text-white">Atividades:</strong>{" "}
                {activitiesTotal}
              </div>
              <ScrollArea className="h-80">{archetype.description}</ScrollArea>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso vai remover permanentemente
              o arquétipo <strong>{archetype.name}</strong> do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
