import { SignOutButton } from "@/components/sign-out-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LastArticles from "./artigos/_components/last-articles";
import { getActiveProducts } from "./loja/actions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Paragraphs } from "@/components/paragraphs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/utils/format-currency";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/dashboard");

  const [userData, products] = await Promise.all([
    db.user.findUnique({ where: { id: user.id } }),
    getActiveProducts(),
  ]);

  return (
    <div className="flex w-full flex-col gap-4 p-6 sm:grid sm:min-h-screen sm:grid-cols-12">
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
        <Card className="h-full">
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
        <Card className="h-full">
          <CardContent className="flex h-full flex-col justify-between gap-4">
            <h2 className="text-2xl">Produtos da loja</h2>

            <Carousel className="mx-auto w-full max-w-10/12">
              <CarouselContent>
                {products.map((product) => (
                  <CarouselItem key={product.id}>
                    <Card className="bg-neutral-950 p-4">
                      <CardContent className="flex flex-col justify-start gap-4 p-0 lg:flex-row">
                        <div className="h-full w-full lg:max-h-48 lg:max-w-48">
                          {product.imageUrl && (
                            <AspectRatio ratio={1 / 1}>
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="rounded-md object-contain shadow-lg"
                              />
                            </AspectRatio>
                          )}
                        </div>
                        <CardHeader className="flex grow flex-col justify-center p-0">
                          <CardTitle className="text-xl font-bold">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            <Paragraphs text={product.description} />
                          </CardDescription>
                          <p className="text-lg font-black">
                            {formatCurrency(Number(product.price))}
                          </p>
                        </CardHeader>
                        {/* <div className="flex w-full grow flex-wrap items-center gap-4">
                          <div className="w-full max-w-48">
                          </div>
                          <CardHeader className="grow p-0">
                            <CardTitle className="text-xl font-bold">
                              {product.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              <Paragraphs text={product.description} />
                            </CardDescription>
                          </CardHeader>
                        </div> */}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <Button className="w-full" asChild>
              <Link href="/responsavel/loja">Ir para loja</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
