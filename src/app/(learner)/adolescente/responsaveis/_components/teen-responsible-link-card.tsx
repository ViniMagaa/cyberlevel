"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  deleteResponsibleLinkById,
  updateResponsibleLinkById,
} from "@/utils/responsible-link";
import { ResponsibleLink, ResponsibleLinkStatus, User } from "@prisma/client";
import { Loader2Icon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type TeenResponsibleLinkCardProps = {
  responsibleLink: ResponsibleLink & { responsible: User };
};

export function TeenResponsibleLinkCard({
  responsibleLink: { id, responsible, status },
}: TeenResponsibleLinkCardProps) {
  const [isPendingUpdate, startUpdateTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  const router = useRouter();

  function handleUpdateResponsibleLink(status: ResponsibleLinkStatus) {
    startUpdateTransition(async () => {
      try {
        await updateResponsibleLinkById(id, { status });
        toast.success(
          `Solicitação ${status === "ACCEPTED" ? "aceita" : "recusada"}`,
        );
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar solicitação");
      }
    });
  }

  function handleDeleteResponsibleLink() {
    startDeleteTransition(async () => {
      try {
        await deleteResponsibleLinkById(id);
        toast.success("Responsável excluído");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir responsável");
      }
    });
  }

  return (
    <Card
      className={cn(
        "flex justify-between gap-2 p-4",
        status === "ACCEPTED" && "flex-row items-center",
      )}
    >
      <div>
        <h2 className="line-clamp-1 text-xl break-all overflow-ellipsis">
          {responsible.name}
        </h2>
        <p className="line-clamp-1 text-sm break-all overflow-ellipsis text-white/50">
          {responsible.email}
        </p>
      </div>

      {status === "ACCEPTED" && (
        <Button
          size="icon"
          variant="destructive"
          onClick={handleDeleteResponsibleLink}
          disabled={isPendingDelete}
        >
          {isPendingDelete ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Trash />
          )}
        </Button>
      )}

      {status === "PENDING" && (
        <div className="flex flex-wrap gap-2 *:flex-1">
          <Button
            onClick={() => handleUpdateResponsibleLink("ACCEPTED")}
            disabled={isPendingUpdate}
          >
            Aceitar
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleUpdateResponsibleLink("REJECTED")}
            disabled={isPendingUpdate}
          >
            Recusar
          </Button>
        </div>
      )}
    </Card>
  );
}
