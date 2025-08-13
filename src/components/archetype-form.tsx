"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";
import { z } from "zod";
import {
  createArchetype,
  updateArchetype,
} from "@/app/(admin)/admin/arquetipos/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Textarea } from "./ui/textarea";

export const archetypeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

export type ArchetypeFormSchema = z.infer<typeof archetypeSchema>;

type ArchetypeFormProps = {
  archetype?: Prisma.ArchetypeCreateInput;
};

export function ArchetypeForm({ archetype }: ArchetypeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ArchetypeFormSchema>({
    resolver: zodResolver(archetypeSchema),
    defaultValues: archetype ?? { name: "", description: "" },
  });

  function onSubmit(data: ArchetypeFormSchema) {
    startTransition(async () => {
      try {
        if (archetype && archetype.id) {
          await updateArchetype(archetype.id, data);
          toast.success("Arquétipo atualizado");
        } else {
          await createArchetype(data);
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
