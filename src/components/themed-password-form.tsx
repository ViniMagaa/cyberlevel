import { activitySchemas } from "@/utils/activity-schemas";
import {
  ThemedPasswordRules,
  TThemedPasswordContent,
  TThemedPasswordRules,
} from "@/utils/activity-types";
import { themedPasswordRuleType } from "@/utils/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export type TThemedPasswordForm = z.infer<
  (typeof activitySchemas)["THEMED_PASSWORD"]
>;

type ThemedPasswordFormProps = {
  themedPassword?: TThemedPasswordContent;
  onSubmit: (data: TThemedPasswordContent) => void;
};

export function ThemedPasswordForm({
  themedPassword,
  onSubmit,
}: ThemedPasswordFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TThemedPasswordForm>({
    resolver: zodResolver(activitySchemas.THEMED_PASSWORD),
    mode: "onChange",
    defaultValues: {
      title: themedPassword?.title ?? "",
      mission: themedPassword?.mission ?? "",
      rules: themedPassword?.rules ?? [
        {
          type: undefined as unknown as TThemedPasswordRules,
          value: "",
        },
      ],
      feedback: themedPassword?.feedback ?? "",
    },
  });

  const {
    fields: ruleFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const { watch } = form;

  async function handleSubmit(values: TThemedPasswordForm) {
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
                <Input placeholder="Tema da senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="mission"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Objetivo da senha"
                  className="max-h-40 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lista de Perguntas */}
        <div className="space-y-4">
          {ruleFields.map((rule, index) => (
            <Card key={rule.id} className="gap-1">
              <CardHeader>
                <CardTitle>{index + 1}ª regra</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-start justify-between gap-2 sm:flex-nowrap">
                {/* Selecionar o tipo da regra */}
                <FormField
                  control={form.control}
                  name={`rules.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="flex flex-wrap items-center gap-2">
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(
                            Object.entries(themedPasswordRuleType) as [
                              TThemedPasswordRules,
                              string,
                            ][]
                          ).map(([ruleType, label]) => (
                            <SelectItem key={ruleType} value={ruleType}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Valor */}
                {(watch(`rules.${index}.type`) ===
                  ThemedPasswordRules.MIN_LENGTH ||
                  watch(`rules.${index}.type`) ===
                    ThemedPasswordRules.MAX_LENGTH) && (
                  <FormField
                    control={form.control}
                    name={`rules.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Valor"
                            type="number"
                            min={1}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {(watch(`rules.${index}.type`) ===
                  ThemedPasswordRules.INCLUDE_WORD ||
                  watch(`rules.${index}.type`) ===
                    ThemedPasswordRules.EXCLUDE_WORD) && (
                  <FormField
                    control={form.control}
                    name={`rules.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Valor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Remover */}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  disabled={ruleFields.length <= 1}
                >
                  Remover
                </Button>
              </CardContent>
            </Card>
          ))}

          <FormMessage>
            {form.formState.errors.rules?.root?.message}
          </FormMessage>

          {/* Adicionar regra */}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                type: undefined as unknown as TThemedPasswordRules,
                value: "",
              })
            }
            className="flex items-center gap-1"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Adicionar regra
          </Button>
        </div>

        {/* Feedback */}
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Feedback ao acertar"
                  className="max-h-80 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            variant="default"
            disabled={isPending}
          >
            Salvar {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
