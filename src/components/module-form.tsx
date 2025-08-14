"use client";

import { updateArchetype } from "@/app/(admin)/admin/arquetipos/actions";
import { createModule } from "@/app/(admin)/admin/atividades/actions";
import { cn } from "@/lib/utils";
import { ageGroup } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archetype, Prisma } from "@prisma/client";
import { ArrowLeft, Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export const moduleSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    ageGroup: z.enum(["CHILD", "TEEN"], {
      error: "Selecione o público",
    }),
    archetypeId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.ageGroup === "TEEN") {
        return !!data.archetypeId && data.archetypeId.trim() !== "";
      }
      return true;
    },
    {
      path: ["archetypeId"],
      message: "Arquétipo é obrigatório",
    },
  );

export type ModuleFormSchema = z.infer<typeof moduleSchema>;

type ModuleFormProps = {
  module?: Prisma.ModuleCreateInput;
  archetypes: Archetype[];
};

export function ModuleForm({ module, archetypes }: ModuleFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ModuleFormSchema>({
    resolver: zodResolver(moduleSchema),
    defaultValues: module ?? {
      title: "",
      description: "",
      ageGroup: undefined,
      archetypeId: undefined,
    },
  });

  const { watch } = form;

  function onSubmit(data: ModuleFormSchema) {
    startTransition(async () => {
      try {
        const newModuleData: Prisma.ModuleCreateInput = {
          title: data.title,
          description: data.description,
          order: -1,
          ageGroup: data.ageGroup,
          archetype: data.archetypeId
            ? { connect: { id: data.archetypeId } }
            : undefined,
        };
        if (module && module.id) {
          await updateArchetype(module.id, data);
          toast.success("Módulo atualizado");
        } else {
          await createModule(newModuleData);
          toast.success("Módulo criado");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar módulo");
      }
      redirect("/admin/atividades");
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Título do módulo" {...field} />
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
                  placeholder="Descrição do módulo"
                  className="max-h-80 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ageGroup"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o público" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CHILD">{ageGroup["CHILD"]}</SelectItem>
                  <SelectItem value="TEEN">{ageGroup["TEEN"]}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="archetypeId"
          disabled={watch("ageGroup") !== "TEEN"}
          render={({ field }) => (
            <FormItem
              className={cn(
                "flex flex-col",
                watch("ageGroup") !== "TEEN" && "hidden",
              )}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? archetypes.find(
                            (archetype) => archetype.id === field.value,
                          )?.name
                        : "Selecione o arquétipo"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Selecione o arquétipo"
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Nenhum arquétipo encontrado.</CommandEmpty>
                      <CommandGroup>
                        {archetypes.map((archetype) => (
                          <CommandItem
                            value={archetype.id}
                            key={archetype.id}
                            onSelect={() => {
                              form.setValue("archetypeId", archetype.id);
                            }}
                          >
                            {archetype.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                archetype.name === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap justify-between gap-4">
          <Button type="button" variant="link" className="px-0" asChild>
            <Link href="/admin/atividades">
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
            {module ? "Atualizar" : "Criar"}
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
