"use client";

import CardSwap, { Card } from "@/components/card-swap";
import { ChooseYourJourney } from "@/components/choose-your-journey";
import { Logo } from "@/components/logo";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { Particles } from "@/components/magicui/particles";
import { RetroGrid } from "@/components/magicui/retro-grid";
import Threads from "@/components/threads";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FileChartPie, LockKeyhole, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const WHY_CYBERLEVEL_ITEMS = [
  {
    title: "Aprendizado gamificado",
    desc: "Crianças e adolescentes aprendem sobre segurança digital de forma interativa e divertida.",
    icon: <Trophy size={100} className="m-4" />,
  },
  {
    title: "Monitoramento inteligente",
    desc: "Responsáveis acompanham relatórios claros e personalizados do progresso dos aprendizes.",
    icon: <FileChartPie size={100} className="m-4" />,
  },
  {
    title: "Ambiente seguro",
    desc: "A plataforma é pensada para proteger, orientar e desenvolver a consciência digital dos jovens.",
    icon: <LockKeyhole size={100} className="m-4" />,
  },
];

const CARDS = [
  {
    title: "Criança",
    image: "/images/child-dashboard.png",
    description: "Um universo colorido e lúdico para aprender brincando.",
  },
  {
    title: "Adolescente",
    image: "/images/teen-dashboard.png",
    description:
      "Visual futurista e desafios empolgantes sobre segurança digital.",
  },
  {
    title: "Responsável",
    image: "/images/responsible-dashboard.png",
    description: "Acompanhe e proteja o aprendizado digital dos seus filhos.",
  },
];

const IMAGES_ROW_CHILD = [
  "/images/child/informative-text.png",
  "/images/child/match-pairs.png",
  "/images/child/fake-chat.png",
  "/images/child/post-or-not.png",
  "/images/child/quiz.png",
  "/images/child/fake-news.png",
  "/images/child/themed-password.png",
];

const IMAGES_ROW_TEEN = [
  "/images/teen/informative-text.png",
  "/images/teen/match-pairs.png",
  "/images/teen/fake-chat.png",
  "/images/teen/post-or-not.png",
  "/images/teen/quiz.png",
  "/images/teen/fake-news.png",
  "/images/teen/themed-password.png",
];

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="relative overflow-hidden">
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-neutral-900 to-black" />
      <Particles
        className="absolute inset-0 -z-50"
        quantity={1000}
        ease={80}
        color="#ffffff"
        refresh
      />
      <header className="relative h-screen">
        <div className="flex items-center justify-between border-b-[1px] border-neutral-700 px-5 py-5 md:px-10">
          <Logo onlyLogo />
          <div className="flex items-baseline gap-4">
            <Button
              size="lg"
              variant="outline"
              className="text-md hover:bg-primary-600 px-3"
              asChild
            >
              <Link href="#start">Iniciar agora</Link>
            </Button>
            <Button variant="link" className="px-0" asChild>
              <Link href="/entrar">Entrar</Link>
            </Button>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-1/2 space-y-4 text-center md:top-1/2">
          <BlurFade delay={0.25}>
            <h1 className="font-mars text-3xl font-bold select-none sm:text-4xl md:text-5xl lg:text-[6rem]/20">
              CyberLevel
            </h1>
          </BlurFade>

          <BlurFade delay={0.5}>
            <p className="text-muted-foreground mx-auto max-w-150 text-center text-xs font-extralight tracking-wider select-none md:text-xl">
              A plataforma que transforma segurança digital em uma jornada
              divertida de aprendizado.
            </p>
          </BlurFade>
        </div>
      </header>

      <div className="relative">
        <section className="relative min-h-screen">
          <div className="absolute top-1/4 left-1/2 flex w-full -translate-1/2 flex-col items-center gap-4 px-4">
            <BlurFade>
              <h2 className="text-center text-3xl font-bold md:text-5xl">
                O que é o CyberLevel?
              </h2>
            </BlurFade>
            <BlurFade delay={0.25}>
              <p className="text-muted-foreground max-w-4xl text-center font-light md:text-xl">
                O CyberLevel combina{" "}
                <strong className="font-semibold text-white">
                  jogos interativos, histórias envolventes e missões educativas
                </strong>{" "}
                para ensinar crianças e adolescentes a navegarem com segurança e
                responsabilidade pela internet. Enquanto isso, responsáveis
                acompanham o progresso com relatórios claros e ferramentas
                práticas.
              </p>
            </BlurFade>
          </div>
        </section>

        <div className="absolute -bottom-32 w-full overflow-hidden">
          <div className="relative h-[600px] w-full">
            <Threads
              color={[45 / 255, 180 / 255, 135 / 255]}
              amplitude={2}
              distance={0}
            />
          </div>
        </div>
      </div>

      <section className="relative flex min-h-screen flex-col items-center justify-center gap-16 px-4 py-12">
        <BlurFade>
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Por que usar o CyberLevel?
          </h2>
        </BlurFade>

        <div className="flex max-w-7xl flex-wrap items-center justify-center gap-16 px-4">
          {WHY_CYBERLEVEL_ITEMS.map(({ title, desc, icon }, i) => (
            <div key={i} className="max-w-xs">
              <BlurFade delay={0.25 * (i + 1)} className="flex flex-col gap-8">
                <NeonGradientCard
                  borderRadius={100}
                  borderSize={1}
                  neonColors={{
                    firstColor: "#2db78022",
                    secondColor: "#2db780",
                  }}
                  className="m-auto flex w-min items-center justify-center"
                >
                  {icon}
                </NeonGradientCard>
                <div className="space-y-2 text-center">
                  <h3 className="text-md font-semibold md:text-2xl">{title}</h3>
                  <p className="md:text-md text-muted-foreground max-w-sm text-center font-light">
                    {desc}
                  </p>
                </div>
              </BlurFade>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden">
        <div
          className={cn(
            "relative mx-auto flex max-w-6xl flex-col items-center justify-between py-12 lg:flex-row",
            isMobile ? "h-[90vh] pb-32" : "min-h-screen",
          )}
        >
          <div className="max-w-lg space-y-5 px-4 text-center lg:mr-[600px] lg:pl-10 lg:text-left">
            <BlurFade>
              <h2 className="text-3xl font-bold lg:text-5xl">
                Design inteligente
              </h2>
            </BlurFade>
            <BlurFade delay={0.25}>
              <p className="text-muted-foreground font-light lg:text-xl">
                Cada idade tem um olhar e nossa plataforma entende isso. O
                CyberLevel{" "}
                <span className="font-semibold text-white">
                  muda de visual conforme o público
                </span>
                , garantindo engajamento e identificação.
              </p>
            </BlurFade>
          </div>
          <div className="relative -mr-[200px] sm:-mr-[500px] lg:mt-88 lg:mr-0">
            <CardSwap
              cardDistance={60}
              verticalDistance={100}
              delay={5000}
              pauseOnHover={false}
              skewAmount={2}
              width={600}
              height={400}
            >
              {CARDS.map((card) => (
                <Card
                  key={card.image}
                  className="absolute top-0 left-1/2 overflow-hidden"
                  style={{ borderColor: "#ffffff33" }}
                >
                  <CardHeader className="gap-0 p-4">
                    <CardTitle className="text-xl font-bold">
                      {card.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {card.description}
                    </p>
                  </CardHeader>
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={1920}
                    height={1080}
                    className="h-full w-full"
                  />
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </section>

      <div className="relative border-t border-b py-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/4 bg-gradient-to-r from-black" />
        <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/4 bg-gradient-to-l from-black" />

        <div className="flex w-full flex-col items-center gap-8">
          <div className="m-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:pl-10">
            <div className="space-y-5 text-center md:text-left">
              <BlurFade>
                <span className="text-md text-muted-foreground md:text-xl">
                  Se divirta jogando
                </span>
                <h2 className="text-2xl font-bold md:text-4xl">
                  Aprender com o CyberLevel é divertido{" "}
                </h2>
              </BlurFade>
              <BlurFade delay={0.25}>
                <p className="text-md text-muted-foreground max-w-2xl font-light lg:text-xl">
                  Com{" "}
                  <span className="font-semibold text-white">
                    missões curtas e jogos imersivos
                  </span>
                  , os aprendizes do mundo digital descobrem como se proteger e
                  navegar com sabedoria pela internet. Cada lição é um passo
                  para se tornar um verdadeiro{" "}
                  <span className="font-semibold text-white">
                    herói cibernético
                  </span>
                  .
                </p>
              </BlurFade>
            </div>
            <Image
              alt="CyberLevel"
              src="/images/shield.png"
              width={400}
              height={400}
              className="select-none"
            />
          </div>

          <ScrollVelocityContainer className="-z-20 w-full">
            <ScrollVelocityRow baseVelocity={2} direction={1} className="py-4">
              {IMAGES_ROW_CHILD.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt="Atividade da criança"
                  width={480}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="mx-4 inline-block h-40 w-60 rounded-lg border object-cover"
                />
              ))}
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={2} direction={-1} className="py-4">
              {IMAGES_ROW_TEEN.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt="Atividade do adolescente"
                  width={240}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="mx-4 inline-block h-40 w-60 rounded-lg border object-cover"
                />
              ))}
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
        </div>
      </div>

      <section className="relative h-[70vh] py-12">
        <div className="absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center gap-4 px-4">
          <BlurFade>
            <h2 className="text-center text-3xl font-bold md:text-5xl">
              CyberLevel fora das telas
            </h2>
          </BlurFade>
          <BlurFade delay={0.25}>
            <p className="text-muted-foreground max-w-3xl text-center font-light md:text-xl">
              O mundo digital é só uma parte da experiência. Por isso, a{" "}
              <strong className="font-bold text-white">
                loja do CyberLevel
              </strong>{" "}
              oferece diversas opções com{" "}
              <strong className="font-bold text-white">desafios lúdicos</strong>{" "}
              pensados para tirar os aprendizes do celular, incentivando a
              criatividade, interação, diversão e vínculo com a família.
            </p>
          </BlurFade>
        </div>
        <RetroGrid className="-z-10 border-b" />
      </section>

      <section className="relative m-auto flex h-full min-h-[90vh] w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 pt-22 lg:flex-row lg:pl-10">
        <div className="space-y-5 text-center md:pr-[400px] md:text-left">
          <div>
            <BlurFade>
              <span className="text-md text-muted-foreground md:text-xl">
                Metodologia eficaz
              </span>
            </BlurFade>
            <BlurFade>
              <h2 className="text-2xl font-bold md:text-4xl">
                Motivação que não acaba
              </h2>
            </BlurFade>
          </div>
          <BlurFade delay={0.25}>
            <p className="text-md text-muted-foreground max-w-2xl font-light lg:text-xl">
              O <span className="font-semibold text-white">CyberLevel</span>{" "}
              transforma o aprendizado sobre o mundo digital em uma aventura:
              personalize seu avatar, encare desafios e avance entre heróis e
              vilões online.{" "}
              <span className="font-semibold text-white">
                Aprender nunca foi tão emocionante!
              </span>
            </p>
          </BlurFade>
        </div>
        <Image
          alt="CyberLevel"
          src="/images/cyber-vision-avatar.png"
          width={400}
          height={400}
          className="select-none md:absolute md:right-10 md:bottom-0"
        />
      </section>

      <ChooseYourJourney />
    </div>
  );
}
