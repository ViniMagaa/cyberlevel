import { ArticleForm } from "@/components/article-form";
import { createClient } from "@/utils/supabase/server";

export default async function CreateArticlePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Usuário não encontrado</p>;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Criar Artigo</h1>
      <div className="w-full max-w-xl">
        <ArticleForm userId={user.id} />
      </div>
    </div>
  );
}
