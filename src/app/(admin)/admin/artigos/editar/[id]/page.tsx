import { ArticleForm } from "@/components/article-form";
import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Usuário não encontrado</p>;

  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id },
  });

  if (!article) return <p>Artigo não encontrado</p>;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Editar Atividade</h1>
      <div className="w-full max-w-xl">
        <ArticleForm article={article} userId={user.id} />
      </div>
    </div>
  );
}
