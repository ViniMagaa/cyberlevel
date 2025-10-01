import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPublishedArticles } from "../actions";
import { ArticleCard } from "./article-card";

export default async function LastArticles() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const articles = await getPublishedArticles(user.id, 2);

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
