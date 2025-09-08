import { SignOutButton } from "@/components/sign-out-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LastArticles from "./_components/last-articles";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/dashboard");

  const userData = await db.user.findUnique({ where: { id: user.id } });

  return (
    <div className="flex w-full flex-col gap-4 p-6 sm:grid sm:h-screen sm:grid-cols-12">
      <Card className="sm:col-span-6 lg:col-span-5">
        <CardHeader className="flex flex-wrap items-center">
          <h1 className="text-2xl font-bold sm:text-xl md:text-3xl">
            Olá, {userData?.name}!
          </h1>
          <div className="ml-auto">
            <SignOutButton />
          </div>
        </CardHeader>
      </Card>

      <div className="sm:col-span-6 sm:row-span-5 lg:col-span-7">
        <Card>
          <CardContent className="flex gap-4">
            <h2 className="text-2xl">Estatísticas</h2>
          </CardContent>
        </Card>
      </div>

      <Card className="pb-0 sm:col-span-6 sm:row-span-11 lg:col-span-5">
        <ScrollArea className="h-[90svh)] sm:h-[calc(100svh-175px)]">
          <CardContent className="pb-4">
            <LastArticles />
          </CardContent>
        </ScrollArea>
      </Card>

      <div className="sm:col-span-6 sm:row-span-7 lg:col-span-7">
        <Card>
          <CardContent className="flex gap-4">
            <h2 className="text-2xl">Produtos da loja</h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
