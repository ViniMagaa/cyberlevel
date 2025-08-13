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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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

  return (
    <Card>
      <CardContent className="space-y-2">
        <CardTitle>{archetype.name}</CardTitle>
        <CardDescription className="space-y-1 overflow-hidden text-ellipsis">
          <p>{archetype.description}</p>
          <div>
            <strong className="text-white">Módulos:</strong>{" "}
            {archetype.modules.length}
          </div>
          <div>
            <strong className="text-white">Atividades:</strong>{" "}
            {archetype.modules.reduce(
              (acc, mod) => acc + mod._count.activities,
              0,
            )}
          </div>
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-auto flex justify-end gap-2">
        <Button type="button" asChild>
          <Link href={`/admin/arquetipos/editar/${archetype.id}`}>
            <Pencil /> Editar
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive" disabled={isPending}>
              <Trash /> Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso vai remover
                permanentemente o arquétipo <strong>{archetype.name}</strong> do
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
      </CardFooter>
    </Card>
  );
}
