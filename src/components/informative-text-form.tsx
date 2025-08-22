import { uploadActivityImage } from "@/app/(admin)/admin/atividades/actions";
import { activitySchemas } from "@/utils/activity-schemas";
import { TInformativeTextContent } from "@/utils/activity-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import z from "zod";
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
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

export type TInformativeTextForm = z.infer<
  (typeof activitySchemas)["INFORMATIVE_TEXT"]
>; // com File

type InformativeTextFormProps = {
  informativeText?: TInformativeTextContent;
  onSubmit: (data: TInformativeTextContent) => void;
};

export function InformativeTextForm({
  informativeText,
  onSubmit,
}: InformativeTextFormProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | undefined>(
    informativeText?.imageUrl,
  );

  const form = useForm<TInformativeTextForm>({
    resolver: zodResolver(activitySchemas.INFORMATIVE_TEXT),
    defaultValues: {
      title: informativeText?.title ?? "",
      description: informativeText?.description ?? "",
      content: informativeText?.content ?? "",
      image: undefined,
    },
  });

  const { watch } = form;

  async function handleSubmit(values: TInformativeTextForm) {
    const ok = await form.trigger();
    if (!ok) return;

    startTransition(async () => {
      let imageUrl = informativeText?.imageUrl;

      // Se o usuário selecionar um arquivo novo, faz o upload
      if (values.image) {
        imageUrl = await uploadActivityImage(values.image, "informative-text");
      }

      // Monta o payload que será salvo no JSON
      const payload: TInformativeTextContent = {
        title: values.title,
        description: values.description,
        content: values.content,
        imageUrl, // <- URL pública do Supabase
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
                <Input placeholder="Título do texto" {...field} />
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
                  placeholder="Descrição (opcional)"
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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="ml-auto">
                      Ver exemplos de Markdown
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="md:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        Exemplos de Markdown
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold">
                            Títulos e textos
                          </h3>
                          <p># Título H1</p>
                          <p>## Título H2</p>
                          <p>### Título H3</p>
                          <p>Texto normal</p>
                          <p>**negrito**</p>
                          <p>*itálico*</p>
                          <p>~~tachado~~</p>
                          <p>`código inline`</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Divisão</h3>
                          <p>---</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Checklist</h3>
                          <p>[x] Tarefa concluída</p>
                          <p>[ ] Tarefa pendente</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Links e imagens</h3>
                          <p>Um link normal: [Google](https://google.com)</p>
                          <br />
                          <p>
                            Imagem: ![Exemplo de
                            Imagem](https://via.placeholder.com/300x150)
                          </p>
                          <br />
                          <p>
                            Um link com imagem:
                            [![Placeholder](https://via.placeholder.com/100)](https://google.com)
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Listas</h3>
                          <p>- Item não ordenado 1</p>
                          <p>- Item não ordenado 2</p>
                          <p className="ml-2">- Subitem</p>
                          <p className="ml-2">- Outro subitem</p>
                          <br />
                          <p>1. Item ordenado 1</p>
                          <p>2. Item ordenado 2</p>
                          <p className="ml-2">1. Subitem numerado</p>
                          <p className="ml-2">2. Outro subitem</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Citação</h3>
                          <p>{">"} Isso é uma citação de exemplo.</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Código</h3>
                          <p>```js</p>
                          <p>function hello() {"{"}</p>
                          <p> console.log{'("Hello, Markdown!")'};</p>
                          <p>{"}"}</p>
                          <p>```</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">Tabela</h3>
                          <p>| Nome | Idade |</p>
                          <p>|---------|-------|</p>
                          <p>| João | 20 |</p>
                          <p>| Maria | 25 |</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

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
