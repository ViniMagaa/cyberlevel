"use client";

import { ChooseYourJourney } from "@/components/choose-your-journey";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { Particles } from "@/components/magicui/particles";
import { RetroGrid } from "@/components/magicui/retro-grid";
import Threads from "@/components/threads";
import { Button } from "@/components/ui/button";
import { FileChartPie, LockKeyhole, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <Particles
        className="absolute inset-0 -z-50"
        quantity={1000}
        ease={80}
        color="#ffffff"
        refresh
      />
      <header className="relative h-screen">
        <div className="flex items-center justify-between border-b-[1px] border-neutral-700 px-5 py-5 md:px-10">
          <p className="text-lg font-bold">Logo</p>
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
          <h1 className="font-mars text-3xl font-bold select-none sm:text-4xl md:text-5xl lg:text-[6rem]/20">
            CyberLevel
          </h1>

          <p className="text-muted-foreground mx-auto max-w-180 text-center text-xs font-extralight tracking-wider select-none md:text-xl">
            Protegemos, educamos e preparamos jovens para o mundo digital.
            Conhecimento vira escudo, diversão vira aprendizado.
          </p>
        </div>
      </header>

      <div className="relative">
        <section className="relative min-h-screen">
          <div className="absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center gap-4 px-4">
            <h2 className="text-center text-3xl md:text-5xl">
              Por que utilizar o{" "}
              <span className="text-primary-500 font-extrabold">
                CyberLevel
              </span>
              ?
            </h2>
            <p className="text-muted-foreground max-w-4xl text-center font-light md:text-xl">
              Criamos experiências que combinam pedagogia moderna com narrativas
              encantadoras e visuais instigantes. Cada módulo ensina sobre
              segurança online, privacidade, cidadania digital e muito mais,
              respeitando a idade e o ritmo de cada aprendiz.
            </p>
          </div>
        </section>

        <div className="absolute -bottom-1/3 w-full overflow-hidden">
          <div className="relative h-[600px] w-full">
            <Threads
              color={[45 / 255, 180 / 255, 135 / 255]}
              amplitude={2}
              distance={0}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <section className="grid min-h-screen w-full place-items-start">
          <div className="m-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:pl-10">
            <div className="pt-6">
              <span className="text-md md:text-xl">Se divirta jogando</span>
              <h2 className="text-2xl font-bold md:text-4xl">
                Aprender com o CyberLevel é divertido{" "}
              </h2>
              <p className="text-md text-muted-foreground max-w-2xl pt-10 font-light lg:text-2xl">
                Aqui, conhecimento é superpoder. Com missões curtas e jogos
                imersivos, os pequenos agentes do mundo digital aprendem a se
                proteger e navegar com sabedoria pela internet. Cada lição é um
                passo para se tornar um verdadeiro herói cibernético.
              </p>
            </div>
            <Image
              alt="CyberLevel"
              src="/images/shield.png"
              width={400}
              height={400}
              className="select-none"
            />
          </div>
        </section>
      </div>

      <section className="relative flex min-h-screen flex-col items-center justify-center gap-16 px-4 py-12">
        <h2 className="text-center text-3xl font-bold md:text-5xl">
          Por que usar o CyberLevel?
        </h2>

        <div className="flex max-w-7xl flex-wrap items-center justify-center gap-16 px-4">
          <div className="flex max-w-xs flex-col items-center gap-8">
            <NeonGradientCard
              borderRadius={100}
              borderSize={1}
              neonColors={{
                firstColor: "#2db780",
                secondColor: "#cb6ce6",
              }}
              className="m-auto flex w-min items-center justify-center"
            >
              <Trophy size={100} className="m-4" />
            </NeonGradientCard>
            <div className="space-y-2 text-center">
              <h3 className="text-md font-semibold md:text-2xl">
                Aprendizado gamificado
              </h3>
              <p className="md:text-md text-muted-foreground max-w-sm text-center font-light">
                Crianças e adolescentes aprendem sobre segurança digital de
                forma interativa e divertida.
              </p>
            </div>
          </div>
          <div className="flex max-w-xs flex-col items-center gap-8">
            <NeonGradientCard
              borderRadius={100}
              neonColors={{
                firstColor: "#2db780",
                secondColor: "#cb6ce6",
              }}
              className="m-auto flex w-min items-center justify-center"
            >
              <FileChartPie size={100} className="m-4" />
            </NeonGradientCard>
            <div className="space-y-2 text-center">
              <h3 className="text-md font-semibold md:text-2xl">
                Monitoramento inteligente
              </h3>
              <p className="md:text-md text-muted-foreground max-w-sm text-center font-light">
                Responsáveis acompanham relatórios claros e personalizados do
                progresso dos aprendizes.
              </p>
            </div>
          </div>
          <div className="flex max-w-xs flex-col items-center gap-8">
            <NeonGradientCard
              borderRadius={100}
              neonColors={{
                firstColor: "#2db780",
                secondColor: "#cb6ce6",
              }}
              className="m-auto flex w-min items-center justify-center"
            >
              <LockKeyhole size={100} className="m-4" />
            </NeonGradientCard>
            <div className="space-y-2 text-center">
              <h3 className="text-md font-semibold md:text-2xl">
                Ambiente seguro
              </h3>
              <p className="md:text-md text-muted-foreground max-w-sm text-center font-light">
                A plataforma é pensada para proteger, orientar e desenvolver a
                consciência digital dos jovens.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid min-h-[70lvh] w-full place-items-center">
        <div className="m-auto flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-4 px-4 md:flex-row md:pr-10">
          <Image
            alt="CyberLevel"
            src="/images/control.png"
            width={450}
            height={150}
            className="select-none"
          />

          <div className="pt-6">
            <span className="text-md md:text-xl">Metodologia eficaz</span>
            <h2 className="text-2xl font-bold md:text-4xl">
              Motivação que não acaba!{" "}
            </h2>
            <p className="text-md text-muted-foreground max-w-2xl pt-10 font-light lg:text-2xl">
              Nossa plataforma tem combina tudo no melhor sentido: avatares
              recompensas e desafios com heróis e vilões do mundo virtual.
              Aprender nunca foi tão emocionante.
            </p>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen">
        <div className="absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center gap-4 px-4">
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            CyberLevel fora das telas
          </h2>
          <p className="text-muted-foreground max-w-4xl text-center font-light md:text-xl">
            O mundo digital é só uma parte da experiência. Por isso, o{" "}
            <strong className="font-bold text-white">CyberLevel</strong> vai
            além das telas com jogos físicos que incentivam a criatividade e a
            interação. Nossa loja oferece diversas opções com{" "}
            <strong className="font-bold text-white">desafios lúdicos</strong>{" "}
            pensados para tirar as crianças do celular, promovendo momentos
            reais de aprendizado, diversão e vínculo com a família.
          </p>
        </div>
        <RetroGrid />
      </section>

      <section className="grid min-h-screen w-full place-items-center overflow-hidden">
        <div className="relative m-auto flex h-full w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 lg:flex-row lg:pl-10">
          <div className="pt-6 md:pr-[400px]">
            <span className="text-md lg:text-xl">Design inteligente</span>
            <h2 className="text-2xl font-bold lg:text-4xl">
              Visual que cresce junto com você{" "}
            </h2>
            <p className="text-md text-muted-foreground max-w-2xl pt-10 font-light lg:text-2xl">
              Cada idade tem um olhar — e nossa plataforma entende isso. Para
              crianças, um universo colorido e lúdico. Para adolescentes, um
              estilo futurista e ousado. O{" "}
              <strong className="font-bold text-white">CyberLevel</strong> muda
              de visual conforme o seu público, garantindo engajamento e
              identificação em cada fase.
            </p>
          </div>
          <Image
            alt="CyberLevel"
            src="/images/cyber-vision-avatar.png"
            width={400}
            height={400}
            className="select-none md:absolute md:right-10 md:bottom-0"
          />
        </div>
      </section>

      <ChooseYourJourney />
    </div>
  );
}
