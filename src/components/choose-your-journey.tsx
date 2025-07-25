import Link from "next/link";
import { MagicCard } from "./magicui/magic-card";
import { Particles } from "./magicui/particles";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";
import { ArrowRight } from "lucide-react";

export function ChooseYourJourney() {
  return (
    <section
      id="start"
      className="border-t- relative grid min-h-lvh w-full place-items-center overflow-hidden border-t"
    >
      <div className="absolute top-0 -z-10 h-[1px] w-full overflow-hidden bg-neutral-700">
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          style={{
            background:
              "radial-gradient(800px circle at 50% -50%, #2db780, #1a8f6b, transparent 80%)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-20 animate-pulse rounded-[inherit] opacity-70"
        style={{
          background:
            "radial-gradient(800px circle at 50% -50%, #2db780, #1a8f6b, transparent 80%)",
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
        <h2 className="text-center text-3xl font-extrabold md:text-5xl lg:text-6xl">
          Escolha sua jornada
        </h2>
        <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <Card className="m-1 h-full w-full max-w-[350px] border-none p-0 shadow-none">
            <MagicCard
              gradientColor="#2db780"
              gradientFrom="#2db780"
              gradientTo="#1a8f6b"
              className="p-4"
              gradientOpacity={0.25}
            >
              <CardContent className="flex flex-col justify-center gap-4 p-4 text-center">
                <CardTitle className="text-2xl font-bold uppercase">
                  Sou um responsável
                </CardTitle>
                <p className="text-lg font-light text-neutral-300">
                  Use ferramentas simples, relatórios claros e dicas práticas
                  para proteger seu filho online. Com o{" "}
                  <strong className="font-bold text-white">CyberLevel</strong>,
                  você entende, acompanha e cuida, sem complicação.
                </p>
                <Button
                  className="hover ml-auto rounded-full text-lg"
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <Link href="/cadastrar?role=responsible">
                    Prosseguir <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </MagicCard>
          </Card>

          <Card className="m-1 h-full w-full max-w-[350px] border-none p-0 shadow-none">
            <MagicCard
              gradientColor="#2db780"
              gradientFrom="#2db780"
              gradientTo="#1a8f6b"
              className="p-4"
              gradientOpacity={0.25}
            >
              <CardContent className="flex flex-col justify-center gap-4 p-4 text-center">
                <CardTitle className="text-2xl font-bold uppercase">
                  Sou um aprendiz
                </CardTitle>
                <p className="text-lg font-light text-neutral-300">
                  Descubra como se proteger online com jogos, desafios e dicas
                  fáceis de entender. Com o{" "}
                  <strong className="font-bold text-white">CyberLevel</strong>,
                  aprender sobre segurança digital é divertido, rápido e sem
                  complicação.
                </p>
                <Button
                  className="ml-auto rounded-full text-lg"
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <Link href="/cadastrar?role=learner">
                    Prosseguir <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </MagicCard>
          </Card>
        </div>
      </div>
    </section>
  );
}
