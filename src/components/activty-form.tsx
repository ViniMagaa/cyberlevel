"use client";

import {
  createActivity,
  updateActivity,
} from "@/app/(admin)/admin/atividades/actions";
import { cn } from "@/lib/utils";
import {
  TFakeChatContent,
  TFakeNewsContent,
  TMatchPairsContent,
  TPostOrNotContent,
  TQuizContent,
  TThemedPasswordContent,
} from "@/utils/activity-types";
import { activityType, ageGroup } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityType, Prisma } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Loader2Icon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FakeChatForm } from "./fake-chat-form";
import { FakeNewsForm } from "./fake-news-form";
import MatchPairsForm from "./match-pairs-form";
import { PostOrNotForm } from "./post-or-not-form";
import { QuizForm } from "./quiz-form";
import { ThemedPasswordForm } from "./themed-password-form";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const activitySchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  ageGroup: z.enum(["CHILD", "TEEN"], {
    error: "Selecione o público",
  }),
  moduleId: z.string().min(1, "O módulo é obrigatório"),
  type: z.enum(ActivityType, "Selecione o tipo de atividade"),
  content: z.string().min(1, "O conteúdo da atividade é obrigatório"),
});

export type ActivityFormSchema = z.infer<typeof activitySchema>;

type ActivityFormProps = {
  activity?: Prisma.ActivityGetPayload<{ include: { module: true } }>;
  modules: Prisma.ModuleGetPayload<{ include: { archetype: true } }>[];
};

export function ActivityForm({ activity, modules }: ActivityFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<unknown | undefined>(
    activity?.content || undefined,
  );
  const [isPending, startTransition] = useTransition();

  const form = useForm<ActivityFormSchema>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: activity?.type ?? undefined,
      title: activity?.title ?? "",
      ageGroup: activity?.module.ageGroup ?? undefined,
      content: activity ? JSON.stringify(activity.content) : "",
      moduleId: activity?.module.id ?? "",
    },
  });

  const { watch, setValue } = form;

  function onSubmit(data: ActivityFormSchema) {
    startTransition(async () => {
      try {
        const newActivityData: Prisma.ActivityCreateInput = {
          type: data.type,
          title: data.title,
          order: activity?.order ?? -1,
          content: JSON.parse(data.content),
          module: { connect: { id: data.moduleId } },
        };
        if (activity && activity.id) {
          await updateActivity(activity.id, newActivityData);
          toast.success("Atividade atualizada");
        } else {
          await createActivity(newActivityData);
          toast.success("Atividade criada");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar atividade");
      }
      redirect("/admin/atividades");
    });
  }

  function handleSubmitActivity(data: unknown) {
    try {
      const newContent = JSON.stringify(data);
      setContent(data);
      setValue("content", newContent);
    } catch (error) {
      console.error("Erro ao analisar dados da atividade", error);
      toast.error("Erro ao analisar dados da atividade");
      return;
    }
    setIsOpen(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex grow flex-col justify-between gap-4"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Título da atividade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age Group */}
        <FormField
          control={form.control}
          name="ageGroup"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <Select
                onValueChange={(value) => {
                  setValue("moduleId", "");
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o público" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(ageGroup).map(([key, value]) => (
                    <SelectItem value={key} key={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Module ID */}
        <FormField
          control={form.control}
          name="moduleId"
          render={({ field }) => {
            const selectedModule = modules.find(
              (module) => module.id === field.value,
            );
            const archetype = selectedModule?.archetype;

            return (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!watch("ageGroup")}
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? `${selectedModule?.title} ${archetype ? " | " + archetype.name : ""}`
                          : "Selecione o módulo"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Selecione o módulo"
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Nenhum módulo encontrado.</CommandEmpty>
                        <CommandGroup>
                          {modules
                            .filter(
                              (module) => module.ageGroup === watch("ageGroup"),
                            )
                            .map((module) => (
                              <CommandItem
                                value={module.id}
                                key={module.id}
                                onSelect={() => {
                                  form.setValue("moduleId", module.id);
                                }}
                              >
                                {module.title}{" "}
                                {module.archetype
                                  ? ` | ${module.archetype.name}`
                                  : ""}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    module.id === field.value
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
            );
          }}
        />

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(activityType).map(([key, value]) => (
                    <SelectItem value={key} key={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" disabled={!watch("type")}>
              <Settings /> Configurar atividade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Atividade do tipo {activityType[watch("type")]}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações para configurar a atividade.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[425px]">
              {watch("type") === "FAKE_NEWS" && (
                <FakeNewsForm
                  onSubmit={handleSubmitActivity}
                  fakeNews={content as unknown as TFakeNewsContent}
                />
              )}
              {watch("type") === "POST_OR_NOT" && (
                <PostOrNotForm
                  onSubmit={handleSubmitActivity}
                  postOrNot={content as unknown as TPostOrNotContent}
                />
              )}
              {watch("type") === "QUIZ" && (
                <QuizForm
                  onSubmit={handleSubmitActivity}
                  quiz={content as unknown as TQuizContent}
                />
              )}
              {watch("type") === "THEMED_PASSWORD" && (
                <ThemedPasswordForm
                  onSubmit={handleSubmitActivity}
                  themedPassword={content as unknown as TThemedPasswordContent}
                />
              )}
              {watch("type") === "FAKE_CHAT" && (
                <FakeChatForm
                  onSubmit={handleSubmitActivity}
                  fakeChat={content as unknown as TFakeChatContent}
                />
              )}
              {watch("type") === "MATCH_PAIRS" && (
                <MatchPairsForm
                  onSubmit={handleSubmitActivity}
                  matchPairs={content as unknown as TMatchPairsContent}
                />
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <FormControl className="hidden">
                <Input placeholder="Conteúdo" {...field} />
              </FormControl>
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
            {activity ? "Atualizar" : "Criar"}
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
