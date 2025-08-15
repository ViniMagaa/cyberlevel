"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteModule } from "../../modulos/actions";

type ModuleAccordionItemProps = {
  module: Prisma.ModuleGetPayload<{
    include: {
      activities: true;
      archetype: true;
    };
  }>;
};

export function ModuleAccordionItem({ module }: ModuleAccordionItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteModule(module.id);
        toast.success("Módulo excluído com sucesso");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir módulo");
      }
    });
  }

  return (
    <AccordionItem
      key={module.id}
      value={`item-${module.id}`}
      className="relative"
    >
      <AccordionTrigger className="text-lg font-semibold">
        {module.title}
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <div className="absolute top-3 right-8 flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/modulos/editar/${module.id}`)}
          >
            <Pencil /> Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isPending}>
                <Trash /> Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso vai remover
                  permanentemente o módulo <strong>{module.title}</strong> do
                  sistema.
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
        </div>

        <p className="text-muted-foreground line-clamp-3">
          {module.description}
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">Atividades</h4>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {module.activities.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma atividade criada.
              </p>
            )}
          </section>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
