"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/format-date";
import { Prisma } from "@prisma/client";
import { formatDistanceToNow, isSameSecond } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { deleteArticle } from "../actions";

type ArticleCardProps = {
  article: Prisma.ArticleGetPayload<{
    include: {
      author: { select: { name: true } };
      _count: { select: { views: true } };
    };
  }>;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteArticle(article.id);
        toast.success("Artigo excluído com sucesso");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir artigo");
      }
    });
  }

  return (
    <Card className="gap-2">
      <CardContent className="flex flex-wrap items-end justify-between gap-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold">{article.title}</h2>
            {article.isPublished ? (
              <Badge
                variant="secondary"
                className="bg-green-500 text-white dark:bg-green-600"
              >
                Público
              </Badge>
            ) : (
              <Badge variant="destructive">Privado</Badge>
            )}
          </div>
          <div>
            <p className="text-muted-foreground">
              {article.author?.name ?? "Sem autor"}
            </p>
            <p className="text-muted-foreground">
              Criado em {formatDate(article.createdAt)}
            </p>
            {!isSameSecond(article.createdAt, article.updatedAt) && (
              <p className="text-muted-foreground">
                Atualizado{" "}
                {formatDistanceToNow(article.updatedAt, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </p>
            )}
            {(article.isPublished || article._count.views > 0) && (
              <p className="text-muted-foreground font-bold">
                {article._count.views}{" "}
                {article._count.views === 1 ? "visualização" : "visualizações"}
              </p>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center justify-end gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-neutral-700!"
              >
                <Eye />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[clamp(0px,calc(100%-2rem),1024px)]">
              <DialogHeader>
                <DialogTitle>{article.title}</DialogTitle>
                <DialogDescription>
                  {article.author?.name ?? "Sem autor"} |{" "}
                  {formatDate(article.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <ScrollArea className="h-[60vh]">
                <Card>
                  <CardContent className="space-y-4">
                    {article.imageUrl && (
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                    )}
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
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
                        {article.content}
                      </Markdown>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/artigos/editar/${article.id}`}>
              <Pencil />
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso vai remover
                  permanentemente o artigo <strong>{article.title}</strong> do
                  sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Card className="relative max-h-40 w-full overflow-hidden">
          <div className="absolute z-50 h-full w-full bg-linear-to-t from-neutral-950 from-10% to-transparent" />
          <CardContent>
            {article.imageUrl && (
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="rounded-md object-cover"
                />
              </AspectRatio>
            )}
            <div className="prose prose-neutral dark:prose-invert">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {article.content}
              </Markdown>
            </div>
          </CardContent>
        </Card>
      </CardFooter>
    </Card>
  );
}
