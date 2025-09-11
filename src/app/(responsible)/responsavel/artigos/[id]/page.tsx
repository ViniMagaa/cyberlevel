import { BackButton } from "@/components/back-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { format, formatDistanceToNow, isSameSecond } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleViewTracker } from "../_components/article-view-tracker";
import { getPublishedArticleById } from "../actions";

type ArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <p>Usuário não encontrado</p>;

  const { id } = await params;
  const article = await getPublishedArticleById(id, user.id);

  if (!article) return <p>Artigo não encontrado</p>;
  const articleView = article.views[0] ?? null;

  return (
    <div className="w-full space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BackButton size="icon" />
          <h1 className="text-3xl font-bold">{article.title}</h1>
        </div>

        <div className="relative">
          <Separator />
          <div className="absolute -top-3 right-0">
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
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-4">
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
        <div className="prose prose-neutral dark:prose-invert max-w-none">
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
      </div>

      <div className="flex gap-2">
        <BackButton size="default" />

        <Button asChild>
          <Link href="/responsavel/artigos">Visualizar mais artigos</Link>
        </Button>
      </div>

      <ArticleViewTracker articleId={article.id} userId={user.id} />
    </div>
  );
}
