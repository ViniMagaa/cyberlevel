"use client";

import {
  createArticle,
  updateArticle,
  uploadArticleImage,
} from "@/app/(admin)/admin/artigos/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Article, Prisma } from "@prisma/client";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import z from "zod";
import { MarkdownExampleDialog } from "./markdown-example-dialog";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
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

const articleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Apenas .jpg, .png e .webp são suportados",
    )
    .optional(),
  isPublished: z.boolean("Indique a visibilidade do artigo"),
}); // com File

type TArticleForm = z.infer<typeof articleSchema>;

type ArticleFormProps = {
  article?: Article;
  userId: string;
};

export function ArticleForm({ article, userId }: ArticleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | undefined>(
    article?.imageUrl ?? undefined,
  );

  const form = useForm<TArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title ?? "",
      content: article?.content ?? "",
      image: undefined,
      isPublished:
        typeof article?.isPublished === "boolean"
          ? article.isPublished
          : (undefined as unknown as boolean),
    },
  });

  const { watch } = form;

  async function onSubmit(data: TArticleForm) {
    startTransition(async () => {
      try {
        let imageUrl = article?.imageUrl;

        // Se o usuário selecionar um arquivo novo, faz o upload
        if (data.image) {
          imageUrl = await uploadArticleImage(data.image);
        }

        // Monta o payload que será salvo no JSON
        const newArticleData: Prisma.ArticleCreateInput = {
          title: data.title,
          content: data.content,
          imageUrl: imageUrl ?? undefined, // <- URL pública do Supabase
          isPublished: data.isPublished,
          author: { connect: { id: article?.authorId ?? userId } },
        };

        if (article && article.id) {
          await updateArticle(article.id, newArticleData);
          toast.success("Artigo atualizado");
        } else {
          await createArticle(newArticleData);
          toast.success("Artigo criado");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar artigo");
      }
      redirect("/admin/artigos");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex grow flex-col justify-between gap-4"
      >
        {/* Título */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Título do artigo" {...field} />
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

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            const liveValue = watch("content");

            return (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Digite o conteúdo em Markdown"
                    className="h-40"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Você pode usar **negrito**, _itálico_,
                  [links](https://exemplo.com), listas, títulos (#), etc.
                </FormDescription>

                <MarkdownExampleDialog />

                {/* Preview */}
                <p className="mb-2 font-semibold">Pré-visualização:</p>
                <Card>
                  <CardContent>
                    <div className="prose prose-neutral dark:prose-invert">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: (props) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                        }}
                      >
                        {liveValue || "Digite algo para ver aqui..."}
                      </Markdown>
                    </div>
                  </CardContent>
                </Card>
              </FormItem>
            );
          }}
        />

        {/* Está publicado? */}
        <FormField
          control={form.control}
          name="isPublished"
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
                    <SelectValue placeholder="Selecione a visibilidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Público</SelectItem>
                  <SelectItem value="false">Privado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap justify-between gap-4">
          <Button type="button" variant="link" className="px-0" asChild>
            <Link href="/admin/artigos">
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
            {article ? "Atualizar" : "Criar"}
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
