"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";
import { z } from "zod";
import {
  createArchetype,
  updateArchetype,
  uploadArchetypeImage,
} from "@/app/(admin)/admin/arquetipos/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { AspectRatio } from "./ui/aspect-ratio";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const archetypeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Apenas .jpg, .png e .webp são suportados",
    )
    .optional(),
  primaryColor: z.string().min(1, "Cor principal é obrigatória"),
});

export type ArchetypeFormSchema = z.infer<typeof archetypeSchema>;

type TArchetypeFormContent = Omit<ArchetypeFormSchema, "image"> & {
  imageUrl?: string;
};

type ArchetypeFormProps = {
  archetype?: Prisma.ArchetypeCreateInput;
};

export function ArchetypeForm({ archetype }: ArchetypeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | undefined>(
    archetype?.imageUrl ?? undefined,
  );

  const form = useForm<ArchetypeFormSchema>({
    resolver: zodResolver(archetypeSchema),
    defaultValues: archetype ?? {
      name: "",
      description: "",
      image: undefined,
      primaryColor: undefined,
    },
  });

  function onSubmit(data: ArchetypeFormSchema) {
    startTransition(async () => {
      try {
        let imageUrl = archetype?.imageUrl;

        // Se o usuário selecionar um arquivo novo, faz o upload
        if (data.image) {
          imageUrl = await uploadArchetypeImage(data.image);
        }

        // Monta o payload que será salvo no JSON
        const newArchetypeData: TArchetypeFormContent = {
          name: data.name,
          description: data.description,
          imageUrl: imageUrl ?? undefined, // <- URL pública do Supabase
          primaryColor: data.primaryColor,
        };

        if (archetype && archetype.id) {
          await updateArchetype(archetype.id, newArchetypeData);
          toast.success("Arquétipo atualizado");
        } else {
          await createArchetype(newArchetypeData);
          toast.success("Arquétipo criado");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar arquétipo");
      }
      redirect("/admin/arquetipos");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex grow flex-col justify-between gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nome do arquétipo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Descrição do arquétipo"
                  className="max-h-80 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cor principal */}
        <FormField
          control={form.control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem className="flex gap-2">
              <FormLabel>Cor principal</FormLabel>
              <FormControl>
                <Input
                  type="color"
                  className="h-9 flex-1 cursor-pointer rounded-md border p-1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Imagem (arquivo) */}
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
              {preview && (
                <AspectRatio ratio={4 / 5}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Pré-visualização"
                    className="h-full w-full rounded-md object-cover"
                  />
                </AspectRatio>
              )}
            </FormItem>
          )}
        />

        <div className="flex flex-wrap justify-between gap-4">
          <Button type="button" variant="link" className="px-0" asChild>
            <Link href="/admin/arquetipos">
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
            {archetype ? "Atualizar" : "Criar"}
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
