"use client";

import { updateUserData } from "@/app/api/user-settings";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, Prisma } from "@prisma/client";
import { ArrowLeft, ArrowRight, ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type ChangeAvatarDialogProps = {
  user: Prisma.UserGetPayload<{ include: { avatar: true } }>;
  avatars: Avatar[];
};

export function ChangeAvatarDialog({ user, avatars }: ChangeAvatarDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [selectedAvatarId, setSelectedAvatarId] = useState(user.avatarId);
  const router = useRouter();

  useEffect(() => {
    const index = avatars.findIndex((avatar) => avatar.id === user.avatarId);
    if (index !== -1) {
      setSelectedAvatarIndex(index);
    }
  }, [avatars, user.avatarId]);

  function handleAvatarChange(direction: "left" | "right") {
    setSelectedAvatarIndex((prev) => {
      const newIndex =
        direction === "left"
          ? prev === 0
            ? avatars.length - 1
            : prev - 1
          : prev === avatars.length - 1
            ? 0
            : prev + 1;
      setSelectedAvatarId(avatars[newIndex].id);
      return newIndex;
    });
  }

  function handleSubmit() {
    startTransition(async () => {
      try {
        if (!selectedAvatarId) {
          toast.error("Selecione um avatar");
          return;
        }

        const { error } = await updateUserData(user.id, {
          avatar: { connect: { id: selectedAvatarId } },
        });

        if (error) {
          toast.error(error);
          return;
        }

        toast.success("Avatar alterado");
        router.refresh();
        setIsOpen(false);
      } catch (error) {
        console.log(error);
        toast.error("Erro ao atualizar avatar");
      }
    });
  }

  const isAvatarSelected = user.avatarId === selectedAvatarId;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Trocar avatar <ArrowRightLeft />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm!">
        <DialogTitle>Escolha seu avatar</DialogTitle>
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="transition active:scale-90"
            onClick={() => handleAvatarChange("left")}
          >
            <ArrowLeft />
          </Button>

          <Card className="w-full max-w-44 overflow-hidden p-0">
            <AspectRatio ratio={1}>
              <Image
                src={
                  avatars[selectedAvatarIndex]?.imageUrl ||
                  "/images/profile-picture.png"
                }
                alt="Avatar selecionado"
                fill
                className="size-full object-contain"
              />
            </AspectRatio>
          </Card>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="transition active:scale-90"
            onClick={() => handleAvatarChange("right")}
          >
            <ArrowRight />
          </Button>
        </div>

        <Button
          type="button"
          className="mx-auto w-full max-w-44 font-semibold uppercase"
          onClick={handleSubmit}
          disabled={isPending || isAvatarSelected}
        >
          {isAvatarSelected ? "Selecionado" : "Selecionar"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
