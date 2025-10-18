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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { responsibleLinkStatus } from "@/utils/enums";
import { formatDate } from "@/utils/format-date";
import { deleteResponsibleLinkById } from "@/utils/responsible-link";
import { ResponsibleLink, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2Icon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type LearnerLinkCardProps = {
  responsibleLink: ResponsibleLink & { learner: User };
};

export function LearnerLinkCard({
  responsibleLink: { id, learner, createdAt, status },
}: LearnerLinkCardProps) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResponsibleLinkById(id);
        toast.success("Aprendiz excluído");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir aprendiz");
      }
    });
  }

  return (
    <Card className="relative gap-2">
      <CardContent className="flex flex-col gap-2">
        <div>
          <CardTitle className="text-xl font-bold">{learner.name}</CardTitle>
          <p>{learner.email}</p>
          <p className="text-white/50">@{learner.username}</p>
          <p className="text-sm text-white/50">
            Entrou em {formatDate(learner.createdAt)}
          </p>
        </div>
        {status !== "ACCEPTED" && (
          <>
            <Separator />
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-white/50">
                Enviado{" "}
                {formatDistanceToNow(createdAt, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </p>
              <Badge
                variant={
                  status === "PENDING"
                    ? "secondary"
                    : status === "REJECTED"
                      ? "destructive"
                      : "default"
                }
              >
                {responsibleLinkStatus[status]}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isPending}
            size="icon"
            className="absolute top-4 right-4"
          >
            {isPending ? <Loader2Icon className="animate-spin" /> : <Trash />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você deseja remover o aprendiz <strong>{learner.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Remover
              {isPending && <Loader2Icon className="animate-spin" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
