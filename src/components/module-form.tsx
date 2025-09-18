"use client";

import {
  createModule,
  updateModule,
  uploadModuleImage,
} from "@/app/(admin)/admin/modulos/actions";
import { cn } from "@/lib/utils";
import { ageGroup } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archetype, Module } from "@prisma/client";
import { ArrowLeft, Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
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

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const moduleSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    ageGroup: z.enum(["CHILD", "TEEN"], {
      error: "Selecione o público",
    }),
    archetypeId: z.string().optional(),
    pixelBackgroundImage: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Apenas .jpg, .png e .webp são suportados",
      )
      .optional(),
    pixelIslandImage: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Apenas .jpg, .png e .webp são suportados",
      )
      .optional(),
    pixelBackgroundImageUrl: z.string().optional(),
    pixelIslandImageUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.ageGroup === "TEEN") {
        return data.archetypeId && data.archetypeId.length > 0;
      }
      return true;
    },
    {
      path: ["archetypeId"],
      message: "Arquétipo é obrigatório",
    },
  )
  .refine(
    (data) => {
      if (data.ageGroup === "CHILD") {
        return !!data.pixelBackgroundImage || !!data.pixelBackgroundImageUrl;
      }
      return true;
    },
    {
      path: ["pixelBackgroundImage"],
      message: "Imagem de fundo é obrigatória",
    },
  )
  .refine(
    (data) => {
      if (data.ageGroup === "CHILD") {
        return !!data.pixelIslandImage || !!data.pixelIslandImageUrl;
      }
      return true;
    },
    {
      path: ["pixelIslandImage"],
      message: "Imagem da ilha é obrigatória",
    },
  );

export type ModuleFormSchema = z.infer<typeof moduleSchema>;

type TModuleFormContent = Omit<ModuleFormSchema, "image" | "archetype"> & {
  order: number;
  archetype:
    | {
        connect: {
          id: string;
        };
      }
    | undefined;
  pixelBackgroundImageUrl?: string;
  pixelIslandImageUrl?: string;
};

type ModuleFormProps = {
  module?: Module;
  archetypes: Archetype[];
};

export function ModuleForm({ module, archetypes }: ModuleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [pixelBackgroundPreview, setPixelBackgroundPreview] = useState<
    string | undefined
  >(module?.pixelBackgroundImageUrl ?? undefined);
  const [pixelIslandPreview, setPixelIslandPreview] = useState<
    string | undefined
  >(module?.pixelIslandImageUrl ?? undefined);

  const form = useForm<ModuleFormSchema>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: module?.title ?? "",
      description: module?.description ?? "",
      ageGroup: module?.ageGroup ?? undefined,
      archetypeId: module?.archetypeId ?? undefined,
      pixelBackgroundImage: undefined,
      pixelIslandImage: undefined,
      pixelBackgroundImageUrl: module?.pixelBackgroundImageUrl ?? undefined,
      pixelIslandImageUrl: module?.pixelIslandImageUrl ?? undefined,
    },
  });

  const { watch } = form;

  function onSubmit(data: ModuleFormSchema) {
    startTransition(async () => {
      try {
        let pixelBackgroundImageUrl = module?.pixelBackgroundImageUrl;
        let pixelIslandImageUrl = module?.pixelIslandImageUrl;

        // Se o usuário selecionar um arquivo novo, faz o upload
        if (data.pixelBackgroundImage) {
          pixelBackgroundImageUrl = await uploadModuleImage(
            data.pixelBackgroundImage,
            "backgrounds",
          );
        }
        if (data.pixelIslandImage) {
          pixelIslandImageUrl = await uploadModuleImage(
            data.pixelIslandImage,
            "islands",
          );
        }

        const newModuleData: TModuleFormContent = {
          title: data.title,
          description: data.description,
          order: module?.order ? module.order : -1,
          ageGroup: data.ageGroup,
          archetype: data.archetypeId
            ? { connect: { id: data.archetypeId } }
            : undefined,
          pixelBackgroundImageUrl: pixelBackgroundImageUrl ?? undefined,
          pixelIslandImageUrl: pixelIslandImageUrl ?? undefined,
        };

        if (module && module.id) {
          await updateModule(module.id, newModuleData);
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
                      disabled={watch("ageGroup") !== "TEEN"}
                      className={cn(
                        "justify-between rounded-md!",
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
                                archetype.id === field.value
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

        <FormField
          control={form.control}
          name="pixelBackgroundImage"
          render={({ field }) => (
            <FormItem className={watch("ageGroup") !== "CHILD" ? "hidden" : ""}>
              <FormLabel>Imagem de fundo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  disabled={watch("ageGroup") !== "CHILD"}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPixelBackgroundPreview(url);
                    } else {
                      setPixelBackgroundPreview(undefined);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
              {pixelBackgroundPreview && (
                <AspectRatio ratio={16 / 9}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pixelBackgroundPreview}
                    alt="Pré-visualização"
                    className="h-full w-full rounded-md object-cover"
                  />
                </AspectRatio>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pixelIslandImage"
          render={({ field }) => (
            <FormItem className={watch("ageGroup") !== "CHILD" ? "hidden" : ""}>
              <FormLabel>Ilha de atividade</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  disabled={watch("ageGroup") !== "CHILD"}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPixelIslandPreview(url);
                    } else {
                      setPixelIslandPreview(undefined);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
              {pixelIslandPreview && (
                <AspectRatio ratio={5 / 3}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pixelIslandPreview}
                    alt="Pré-visualização"
                    className="h-full w-full rounded-md object-contain object-center"
                  />
                </AspectRatio>
              )}
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
