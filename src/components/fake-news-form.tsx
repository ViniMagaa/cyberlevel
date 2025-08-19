import { uploadActivityImage } from "@/app/(admin)/admin/atividades/actions";
import { cn } from "@/lib/utils";
import { activitySchemas } from "@/utils/activity-schemas";
import { TFakeNewsContent } from "@/utils/activity-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
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

export type TFakeNewsForm = z.infer<(typeof activitySchemas)["FAKE_NEWS"]>; // com File

type FakeNewsFormProps = {
  fakeNews?: TFakeNewsContent;
  onSubmit: (data: TFakeNewsContent) => void;
};

export function FakeNewsForm({ fakeNews, onSubmit }: FakeNewsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | undefined>(
    fakeNews?.imageUrl,
  );

  const form = useForm<TFakeNewsForm>({
    resolver: zodResolver(activitySchemas.FAKE_NEWS),
    defaultValues: {
      title: fakeNews?.title ?? "",
      subtitle: fakeNews?.subtitle ?? "",
      author: fakeNews?.author ?? "",
      publicationDate: fakeNews?.publicationDate
        ? new Date(fakeNews.publicationDate)
        : undefined,
      text: fakeNews?.text ?? "",
      image: undefined,
      source: fakeNews?.source ?? "",
      isFake:
        typeof fakeNews?.isFake === "boolean"
          ? fakeNews.isFake
          : (undefined as unknown as boolean),
      feedback: fakeNews?.feedback ?? "",
    },
  });

  async function handleSubmit(values: TFakeNewsForm) {
    const ok = await form.trigger();
    if (!ok) return;

    startTransition(async () => {
      let imageUrl = fakeNews?.imageUrl;

      // Se o usuário selecionar um arquivo novo, faz o upload
      if (values.image) {
        imageUrl = await uploadActivityImage(values.image, "fake-news");
      }

      // Monta o payload que será salvo no JSON
      const payload: TFakeNewsContent = {
        title: values.title,
        subtitle: values.subtitle,
        author: values.author,
        publicationDate: values.publicationDate,
        text: values.text,
        imageUrl, // <- URL pública do Supabase
        source: values.source,
        isFake: values.isFake,
        feedback: values.feedback,
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
                <Input placeholder="Título da notícia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subtítulo (opcional) */}
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Subtítulo (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Autor (opcional) */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Autor (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data de publicação (opcional) */}
        <FormField
          control={form.control}
          name="publicationDate"
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Data de publicação (opcional)</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Texto */}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Texto da notícia"
                  className="max-h-80 resize-y"
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
                <AspectRatio ratio={16 / 9}>
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

        {/* Fonte */}
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Fonte da notícia (URL)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* É falsa? */}
        <FormField
          control={form.control}
          name="isFake"
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
                    <SelectValue placeholder="Selecione a veracidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Falsa</SelectItem>
                  <SelectItem value="false">Verdadeira</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feedback */}
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Feedback sobre a atividade"
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
