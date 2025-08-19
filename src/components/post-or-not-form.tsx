import { uploadActivityImage } from "@/app/(admin)/admin/atividades/actions";
import { activitySchemas } from "@/utils/activity-schemas";
import { TPostOrNotContent } from "@/utils/activity-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
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

export type TPostOrNotForm = z.infer<(typeof activitySchemas)["POST_OR_NOT"]>; // com File

type FakeNewsFormProps = {
  postOrNot?: TPostOrNotContent;
  onSubmit: (data: TPostOrNotContent) => void;
};

export function PostOrNotForm({ postOrNot, onSubmit }: FakeNewsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | undefined>(
    postOrNot?.imageUrl,
  );

  const form = useForm<TPostOrNotForm>({
    resolver: zodResolver(activitySchemas.POST_OR_NOT),
    defaultValues: {
      title: postOrNot?.title ?? "",
      description: postOrNot?.description ?? "",
      image: undefined,
      isSafe:
        typeof postOrNot?.isSafe === "boolean"
          ? postOrNot.isSafe
          : (undefined as unknown as boolean),
      justification: postOrNot?.justification ?? "",
    },
  });

  async function handleSubmit(values: TPostOrNotForm) {
    const ok = await form.trigger();
    if (!ok) return;

    startTransition(async () => {
      let imageUrl = postOrNot?.imageUrl;

      // Se o usuário selecionar um arquivo novo, faz o upload
      if (values.image) {
        imageUrl = await uploadActivityImage(values.image, "post-or-not");
      }

      // Monta o payload que será salvo no JSON
      const payload: TPostOrNotContent = {
        title: values.title,
        description: values.description,
        imageUrl, // <- URL pública do Supabase
        isSafe: values.isSafe,
        justification: values.justification,
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
                <Input placeholder="Título da situação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Descrição detalhada da situação"
                  className="max-h-40 resize-y"
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

        {/* É recomendado postar? */}
        <FormField
          control={form.control}
          name="isSafe"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                defaultValue={
                  field.value === true
                    ? "true"
                    : field.value === false
                      ? "false"
                      : undefined
                }
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a recomendação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">É seguro postar</SelectItem>
                  <SelectItem value="false">Não é seguro postar</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Justificativa */}
        <FormField
          control={form.control}
          name="justification"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Justificativa e feedback"
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
            Salvar
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
