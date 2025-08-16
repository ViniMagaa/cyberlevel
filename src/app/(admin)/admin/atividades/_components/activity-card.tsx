"use client";

import { ActivityDialogDetails } from "@/components/activity-dialog-details";
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
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteActivity } from "../actions";

type ActivityCardProps = {
  activity: Prisma.ActivityGetPayload<{
    include: {
      module: {
        include: { archetype: true };
      };
    };
  }>;
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteActivity(activity.id);
        toast.success("Atividade excluído com sucesso");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir atividade");
      }
    });
  }

  return (
    <Card className="gap-2 bg-neutral-800 p-2">
      <CardHeader className="px-2">
        <h5 className="text-lg font-bold">{activity.title}</h5>
        <span className="text-muted-foreground">
          {activityType[activity.type]}
        </span>
      </CardHeader>
      <CardFooter className="flex items-center justify-end gap-1 px-2">
        <ActivityDialogDetails activity={activity} />

        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/atividades/editar/${activity.id}`}>
            <Pencil />
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso vai remover
                permanentemente a atividade <strong>{activity.title}</strong> do
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
