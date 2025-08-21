"use client";

import { activitySchemas } from "@/utils/activity-schemas";
import { TFakeChatContent } from "@/utils/activity-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { FakeChatFormItem } from "./fake-chat-form-item";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export type TFakeChatForm = z.infer<(typeof activitySchemas)["FAKE_CHAT"]>;

type FakeChatFormProps = {
  fakeChat?: TFakeChatContent;
  onSubmit: (data: TFakeChatContent) => void;
};

export function FakeChatForm({ fakeChat, onSubmit }: FakeChatFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TFakeChatForm>({
    resolver: zodResolver(activitySchemas.FAKE_CHAT),
    defaultValues: {
      title: fakeChat?.title ?? "",
      messages: fakeChat?.messages ?? [
        {
          characterMessage: "",
          options: [
            { text: "", feedback: "", isSafe: false },
            { text: "", feedback: "", isSafe: false },
          ],
        },
      ],
    },
  });

  const {
    fields: messageFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "messages",
  });

  async function handleSubmit(values: TFakeChatForm) {
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
                <Input placeholder="Título do chat falso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lista de Mensagens */}
        <div className="space-y-6">
          {messageFields.map((m, mIndex) => (
            <FakeChatFormItem
              key={m.id}
              mIndex={mIndex}
              onRemove={() => remove(mIndex)}
            />
          ))}

          {/* Adicionar pergunta */}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                characterMessage: "",
                options: [
                  {
                    text: "",
                    feedback: "",
                    isSafe: false as unknown as boolean,
                  },
                  {
                    text: "",
                    feedback: "",
                    isSafe: false as unknown as boolean,
                  },
                ],
              })
            }
            className="flex items-center gap-1"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Adicionar mensagem
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
