import { ArrowRight, Gamepad2, UserRoundSearch } from "lucide-react";
import Link from "next/link";
import { MagicCard } from "./magicui/magic-card";
import { Particles } from "./magicui/particles";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { BlurFade } from "./ui/blur-fade";

export function ChooseYourJourney() {
  return (
    <section
      id="start"
      className="border-t- relative grid min-h-lvh w-full place-items-center overflow-hidden border-t"
    >
      <div className="bg-primary-500 absolute top-0 -z-10 h-[1px] w-full overflow-hidden" />
      <div
        className="pointer-events-none absolute inset-0 -z-20 animate-[pulse_5s_ease-in-out_infinite] rounded-[inherit] opacity-20"
        style={{
          background:
            "linear-gradient(to bottom, #2db78099 5%, #1a8f6b55, transparent 40%)",
        }}
      />
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        refresh
      />
      <div className="m-auto w-full max-w-4xl space-y-12 px-4 py-12">
        <BlurFade>
          <h2 className="text-center text-3xl font-extrabold md:text-5xl lg:text-6xl">
            Escolha sua jornada
          </h2>
        </BlurFade>
        <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <BlurFade>
            <Card className="m-1 h-full w-full max-w-[350px] border-none p-0 shadow-none">
              <MagicCard
                gradientColor="#2db780"
                gradientFrom="#2db780"
                gradientTo="#1a8f6b"
                className="p-4"
                gradientOpacity={0.25}
              >
                <CardContent className="flex flex-col justify-center gap-4 p-4 text-center">
                  <UserRoundSearch size={100} className="mx-auto" />
                  <div>
                    <CardTitle className="text-2xl font-bold uppercase">
                      Sou um responsável
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm font-light">
                      Acompanhe e proteja seu filho no mundo digital com
                      relatórios simples e dicas práticas.
                    </CardDescription>
                  </div>
                  <Link href="/cadastrar/responsavel">
                    <Button
                      className="mx-auto text-lg transition-all hover:gap-4"
                      size="lg"
                      variant="outline"
                    >
                      Prosseguir <ArrowRight />
                    </Button>
                  </Link>
                </CardContent>
              </MagicCard>
            </Card>
          </BlurFade>

          <BlurFade>
            <Card className="m-1 h-full w-full max-w-[350px] border-none p-0 shadow-none">
              <MagicCard
                gradientColor="#2db780"
                gradientFrom="#2db780"
                gradientTo="#1a8f6b"
                className="p-4"
                gradientOpacity={0.25}
              >
                <CardContent className="flex flex-col justify-center gap-4 p-4 text-center">
                  <Gamepad2 size={100} className="mx-auto" />
                  <div>
                    <CardTitle className="text-2xl font-bold uppercase">
                      Sou um aprendiz
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm font-light">
                      Aprenda sobre segurança digital com jogos, desafios e
                      histórias incríveis.
                    </CardDescription>
                  </div>
                  <Link href="/cadastrar/aprendiz">
                    <Button
                      className="mx-auto text-lg transition-all hover:gap-4"
                      size="lg"
                      variant="outline"
                    >
                      Prosseguir <ArrowRight />
                    </Button>
                  </Link>
                </CardContent>
              </MagicCard>
            </Card>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
