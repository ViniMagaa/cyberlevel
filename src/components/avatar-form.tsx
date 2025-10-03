"use client";

import {
  createAvatar,
  updateAvatar,
  uploadAvatarImage,
} from "@/app/(admin)/admin/avatares/actions";
import { ageGroup } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgeGroup, Prisma } from "@prisma/client";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AspectRatio } from "./ui/aspect-ratio";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const avatarSchema = z.object({
  ageGroup: z.enum(AgeGroup, {
    error: "Selecione o público",
  }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Apenas .jpg, .png e .webp são suportados",
    )
    .optional(),
});

export type AvatarFormSchema = z.infer<typeof avatarSchema>;

type TAvatarFormContent = Omit<AvatarFormSchema, "image"> & {
  imageUrl: string;
};

type AvatarFormProps = {
  avatar?: Prisma.AvatarCreateInput & { id?: string };
};

export function AvatarForm({ avatar }: AvatarFormProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | undefined>(
    avatar?.imageUrl ?? undefined,
  );

  const form = useForm<AvatarFormSchema>({
    resolver: zodResolver(avatarSchema),
    defaultValues: avatar ?? {
      ageGroup: undefined,
      image: undefined,
    },
  });

  function onSubmit(data: AvatarFormSchema) {
    startTransition(async () => {
      try {
        let imageUrl = avatar?.imageUrl;

        // Upload de imagem se usuário selecionou arquivo novo
        if (data.image) {
          imageUrl = await uploadAvatarImage(data.image);
        }

        if (!imageUrl) {
          toast.error("Imagem não carregada");
          return;
        }

        const newAvatarData: TAvatarFormContent = {
          ageGroup: data.ageGroup,
          imageUrl,
        };

        if (avatar && avatar.id) {
          await updateAvatar(avatar.id, newAvatarData);
          toast.success("Avatar atualizado");
        } else {
          await createAvatar(newAvatarData);
          toast.success("Avatar criado");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar avatar");
      }
      redirect("/admin/avatares");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex grow flex-col gap-4 *:flex-1"
      >
        <div className="flex gap-4 *:flex-1">
          <FormField
            control={form.control}
            name="ageGroup"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHILD">{ageGroup["CHILD"]}</SelectItem>
                      <SelectItem value="TEEN">{ageGroup["TEEN"]}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreview(url);
                      } else {
                        setPreview(undefined);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {preview && (
          <Card className="mx-auto h-full max-h-32 w-full max-w-32 overflow-hidden p-0">
            <AspectRatio ratio={1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Pré-visualização"
                className="mx-auto h-full rounded-md object-contain"
              />
            </AspectRatio>
          </Card>
        )}

        <div className="flex flex-wrap justify-between gap-4">
          <Button type="button" variant="link" className="px-0" asChild>
            <Link href="/admin/avatares">
              <ArrowLeft />
              Voltar
            </Link>
          </Button>
          <Button
            type="submit"
            variant="default"
            className="ml-auto disabled:opacity-50"
            disabled={isPending}
          >
            {avatar ? "Atualizar" : "Criar"}
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
