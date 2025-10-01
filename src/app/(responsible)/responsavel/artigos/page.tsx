import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArticleCard } from "./_components/article-card";
import { getPublishedArticles } from "./actions";

export default async function Articles() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const articles = await getPublishedArticles(user.id);

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <h1 className="text-4xl font-bold">Artigos</h1>
      </div>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">Nenhum artigo criado.</p>
        )}
      </section>
    </div>
  );
}
