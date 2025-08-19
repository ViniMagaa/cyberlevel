"use client";

import { activitySchemas } from "@/utils/activity-schemas";
import { TQuizContent } from "@/utils/activity-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { QuestionItem } from "./question-item";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export type TQuizForm = z.infer<(typeof activitySchemas)["QUIZ"]>;

type QuizFormProps = {
  quiz?: TQuizContent;
  onSubmit: (data: TQuizContent) => void;
};

export function QuizForm({ quiz, onSubmit }: QuizFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TQuizForm>({
    resolver: zodResolver(activitySchemas.QUIZ),
    defaultValues: {
      title: quiz?.title ?? "",
      questions: quiz?.questions ?? [
        {
          text: "",
          options: [{ text: "" }, { text: "" }],
          correctIndex: 0,
          feedback: "",
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function handleSubmit(values: TQuizForm) {
    const ok = await form.trigger();
    if (!ok) return;

    startTransition(async () => {
      const payload: TQuizContent = {
        title: values.title,
        questions: values.questions,
      };

      onSubmit(payload);
    });
  }

  return (
    <Form {...form}>
      <form className="flex grow flex-col justify-between gap-4">
        {/* Título */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Título do quiz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lista de Perguntas */}
        <div className="space-y-6">
          {questionFields.map((q, qIndex) => (
            <QuestionItem
              key={q.id}
              qIndex={qIndex}
              onRemoveQuestion={() => remove(qIndex)}
            />
          ))}

          {/* Adicionar pergunta */}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                text: "",
                options: [{ text: "" }, { text: "" }],
                correctIndex: 0,
                feedback: "",
              })
            }
            className="flex items-center gap-1"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Adicionar pergunta
          </Button>
        </div>

        {/* Botão salvar */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            variant="default"
            disabled={isPending}
          >
            Salvar
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
