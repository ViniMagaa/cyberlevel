import Prism from "@/components/prism";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen w-screen select-none md:grid-cols-2">
      <section className="relative h-[50vh] overflow-hidden md:h-screen">
        <Image
          alt="CyberLevel"
          src="/images/learner-register-background.png"
          fill
          className="no-blur inset-0 opacity-65 select-none"
        />
        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col justify-center gap-4">
          <div>
            <Image
              alt="CyberLevel"
              src="/images/cyberlevel-kids-logo.png"
              width={800}
              height={360}
              className="no-blur select-none"
            />
            <p className="font-monocraft mr-5 text-right text-2xl font-bold uppercase">
              Kids
            </p>
          </div>
          <Button variant="pixel" size="pixel" className="m-auto">
            Tenho menos de 12 anos
          </Button>
        </div>
      </section>

      <section className="relative h-[50vh] overflow-hidden md:h-screen">
        <div className="absolute top-1/2 left-1/2 h-full w-full -translate-1/2 opacity-50">
          <Prism
            animationType="3drotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={1.3}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            suspendWhenOffscreen
            glow={1}
          />
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 h-lvh w-1/3 bg-gradient-to-r from-black" />
        <div className="pointer-events-none absolute inset-y-0 right-0 h-lvh w-1/3 bg-gradient-to-l from-black" />

        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col justify-center gap-4 md:gap-24">
          <div>
            <h1 className="font-mars text-center text-3xl font-bold md:text-4xl lg:text-5xl">
              CyberLevel
            </h1>
            <div className="flex justify-end">
              <span className="text-muted-foreground m-auto text-right text-2xl uppercase md:text-3xl">
                Teen
              </span>
            </div>
          </div>
          <Button
            className="m-auto py-6 text-xl font-semibold hover:gap-4"
            size="lg"
          >
            Tenho 12 anos ou mais <ArrowRight className="size-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
