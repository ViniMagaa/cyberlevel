"use client";

import { updateModulesOrder } from "@/app/(admin)/admin/modulos/actions";
import { Button } from "@/components/ui/button";
import { Module } from "@prisma/client";
import { ArrowDown, ArrowDownUp, ArrowUp, Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
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

type ModuleOrderProps = {
  modules: Module[];
};

export function ModuleOrderList({ modules }: ModuleOrderProps) {
  const [list, setList] = useState([...modules]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function moveModule(index: number, direction: "up" | "down") {
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
        const orderedList = list.map((m, i) => ({
          ...m,
          order: i,
        }));

        await updateModulesOrder(orderedList);
        toast.success("Ordem dos módulos atualizada!");
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
        <Button variant="outline">
          <ArrowDownUp />
          Ordenar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Altere a ordem dos módulos
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex h-90 flex-col pr-2">
          {list.map((module, index) => (
            <div key={module.id}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-medium">{module.title}</span>
                  <p className="font-sm text-muted-foreground line-clamp-1">
                    {module.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveModule(index, "up")}
                    disabled={index === 0 || isPending}
                  >
                    <ArrowUp size={4} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveModule(index, "down")}
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
