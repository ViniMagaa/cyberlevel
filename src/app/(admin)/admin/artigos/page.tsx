import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { ArticleCard } from "./_components/article-card";

export default async function Articles() {
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { views: true } },
    },
  });

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <h1 className="text-4xl font-bold">Artigos</h1>
        <Button type="button" asChild>
          <Link href="/admin/artigos/criar">Criar artigo</Link>
        </Button>
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
