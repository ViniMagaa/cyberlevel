"use client";

import { activitySchemas } from "@/utils/activity-schemas";
import { TMatchPairsContent } from "@/utils/activity-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2Icon, PlusCircleIcon, Trash } from "lucide-react";
import { Textarea } from "./ui/textarea";

export type TMatchPairsForm = z.infer<(typeof activitySchemas)["MATCH_PAIRS"]>;

type MatchPairsFormProps = {
  matchPairs?: TMatchPairsContent;
  onSubmit: (data: TMatchPairsContent) => void;
};

export default function MatchPairsForm({
  matchPairs,
  onSubmit,
}: MatchPairsFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TMatchPairsForm>({
    resolver: zodResolver(activitySchemas.MATCH_PAIRS),
    defaultValues: {
      title: matchPairs?.title ?? "",
      concepts: matchPairs?.concepts ?? [
        { term: "", definition: "" },
        { term: "", definition: "" },
      ],
      timeLimit: matchPairs?.timeLimit ?? ("" as unknown as number),
      maxAttempts: matchPairs?.maxAttempts ?? ("" as unknown as number),
      feedback: matchPairs?.feedback ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray<TMatchPairsForm>({
    control: form.control,
    name: "concepts",
  });

  async function handleSubmit(values: TMatchPairsContent) {
    const ok = await form.trigger();
    if (!ok) return;

    startTransition(() => onSubmit(values));
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
                <Input placeholder="Tema dos pares" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conceitos */}
        <div className="space-y-4">
          <FormLabel>Conceitos</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`concepts.${index}.term`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Conceito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`concepts.${index}.definition`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Definição" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length <= 2}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ term: "", definition: "" })}
            className="flex items-center gap-1"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Tempo limite */}
          <FormField
            control={form.control}
            name="timeLimit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Tempo limite (em segundos)"
                    min={1}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tentativas máximas */}
          <FormField
            control={form.control}
            name="maxAttempts"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quantidade de tentativas"
                    min={1}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Feedback */}
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Feedback (opcional)"
                  className="max-h-40 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
