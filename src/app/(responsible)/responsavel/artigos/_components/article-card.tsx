import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { format, formatDistanceToNow, isSameSecond } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ArticleCardProps = {
  article: Prisma.ArticleGetPayload<{
    include: {
      author: { select: { name: true } };
      views: { take: 1 };
    };
  }>;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const articleView = article.views[0] ?? null;

  return (
    <Card className="relative gap-2 overflow-hidden py-4">
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle className="text-3xl font-bold">{article.title}</CardTitle>
        {!articleView ? (
          <Badge
            variant="secondary"
            className="bg-primary-600 rounded-full text-white"
          >
            Não lido
          </Badge>
        ) : (
          <Badge variant="secondary" className="rounded-full">
            Visto{" "}
            {articleView.viewedAt &&
              formatDistanceToNow(articleView.viewedAt, {
                locale: ptBR,
                addSuffix: true,
              })}
          </Badge>
        )}
      </CardHeader>

      <Separator />

      <Button
        variant="secondary"
        className={cn(
          !articleView && "bg-primary-600 hover:bg-primary-700!",
          "absolute right-6 bottom-6 z-60 rounded-full font-bold text-white",
        )}
        asChild
      >
        <Link href={`/responsavel/artigos/${article.id}`}>Ler artigo</Link>
      </Button>
      <div className="absolute z-50 h-full w-full bg-linear-to-t from-neutral-950 from-10% to-transparent" />

      <CardContent className="max-h-80 w-full space-y-2">
        <div>
          <p className="text-muted-foreground">
            {article.author?.name
              ? "Publicado por " + article.author?.name
              : "Sem autor"}
          </p>
          <p className="text-muted-foreground">
            {format(article.createdAt, "d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
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
        </div>

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
  );
}
