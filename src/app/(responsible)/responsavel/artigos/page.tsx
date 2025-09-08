import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ArticleCard } from "../_components/article-card";
import { getPublishedArticles } from "./actions";

export default async function Articles() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/dashboard");

  const articles = await getPublishedArticles(user.id);

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <h1 className="text-4xl font-bold">Artigos</h1>
      </div>
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
