import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
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
import { getActiveProducts } from "@/lib/actions/store";
import { getUserSession } from "@/lib/auth";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LastArticles } from "./artigos/_components/last-articles";
import { getLearnersByResponsibleId } from "@/utils/responsible-link";

export default async function Dashboard() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const [products, learners] = await Promise.all([
    getActiveProducts(),
    getLearnersByResponsibleId(user.id, "ACCEPTED"),
  ]);

  return (
    <div className="flex w-full flex-col gap-4 p-6 md:grid md:min-h-screen md:grid-cols-12">
      <Card className="md:col-span-6 lg:col-span-5">
        <CardHeader className="flex flex-wrap items-center">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
            Olá, {user.name}!
          </h1>
        </CardHeader>
      </Card>

      <div className="md:col-span-6 md:row-span-5 lg:col-span-7">
        <Card className="h-full">
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-2xl">Aprendizes</h2>

            {learners.length > 0 ? (
              <>
                <div className="flex gap-2 *:flex-1">
                  {learners.map(({ id, learner }) => (
                    <Card
                      key={id}
                      className="w-20 overflow-hidden bg-neutral-950 p-0"
                    >
                      <AspectRatio ratio={1}>
                        <Image
                          src={
                            learner.avatar?.imageUrl ??
                            "/images/profile-picture.png"
                          }
                          alt={learner.name}
                          fill
                          className="no-blur size-full object-contain"
                        />
                      </AspectRatio>
                    </Card>
                  ))}
                </div>

                <Button className="w-full" asChild>
                  <Link href="/responsavel/estatisticas">Estatísticas</Link>
                </Button>
              </>
            ) : (
              <div>
                <p className="text-muted-foreground text-sm">
                  Nenhum aprendiz encontrado.
                </p>
                <Link href="/responsavel/aprendizes">
                  <Button className="mx-auto">Adicionar aprendiz</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="pb-0 md:col-span-6 md:row-span-11 lg:col-span-5">
        <ScrollArea className="h-[90svh)] md:h-[calc(100svh-175px)]">
          <CardContent className="pb-4">
            <LastArticles userId={user.id} />
          </CardContent>
        </ScrollArea>
      </Card>

      <div className="md:col-span-6 md:row-span-7 lg:col-span-7">
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
