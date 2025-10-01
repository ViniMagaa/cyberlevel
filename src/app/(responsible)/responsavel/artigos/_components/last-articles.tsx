import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPublishedArticles } from "../actions";
import { ArticleCard } from "./article-card";

type LastArticlesProps = {
  userId: string;
};

export async function LastArticles({ userId }: LastArticlesProps) {
  const articles = await getPublishedArticles(userId, 2);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl">Últimos artigos</h2>
      <div className="flex flex-col gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum artigo encontrado.
          </p>
        )}
      </div>
      <Button className="w-full" asChild>
        <Link href="/responsavel/artigos">Visualizar tudo</Link>
      </Button>
    </section>
  );
}
