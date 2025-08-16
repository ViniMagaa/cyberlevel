"use client";

import { updateActivitiesOrder } from "@/app/(admin)/admin/atividades/actions";
import { Button } from "@/components/ui/button";
import { activityType } from "@/utils/enums";
import { Activity } from "@prisma/client";
import { ArrowDown, ArrowDownUp, ArrowUp, Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ActivityDialogDetails } from "./activity-dialog-details";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

type ActivityOrderProps = {
  activities: Activity[];
};

export function ActivityOrderList({ activities }: ActivityOrderProps) {
  const [list, setList] = useState([...activities]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function moveActivity(index: number, direction: "up" | "down") {
    const newList = [...list];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= list.length) return;

    [newList[index], newList[targetIndex]] = [
      newList[targetIndex],
      newList[index],
    ];
    setList(newList);
  }

  function saveOrder() {
    startTransition(async () => {
      try {
        const orderedList = list.map((a, i) => ({
          ...a,
          order: i,
        }));

        await updateActivitiesOrder(orderedList);
        toast.success("Ordem das atividades atualizada!");
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar ordem");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowDownUp />
          Ordenar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Altere a ordem das atividades
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex h-90 flex-col pr-2">
          {list.map((activity, index) => (
            <div key={activity.id}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-medium">{activity.title}</span>
                  <p className="font-sm text-muted-foreground">
                    {activityType[activity.type]}
                  </p>
                </div>
                <div className="flex gap-2">
                  <ActivityDialogDetails activity={activity} />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveActivity(index, "up")}
                    disabled={index === 0 || isPending}
                  >
                    <ArrowUp size={4} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveActivity(index, "down")}
                    disabled={index === list.length - 1 || isPending}
                  >
                    <ArrowDown size={4} />
                  </Button>
                </div>
              </div>
              {index < list.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </ScrollArea>

        <DialogFooter>
          <Button className="self-end" onClick={saveOrder} disabled={isPending}>
            Salvar ordem
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
