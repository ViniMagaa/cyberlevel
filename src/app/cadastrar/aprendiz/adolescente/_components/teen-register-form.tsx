"use client";

import signUp from "@/app/api/sign-up";
import Beams from "@/components/beams";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { parseBirthdate } from "@/utils/format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@prisma/client";
import { isPast, subYears } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Calendar,
  Loader2Icon,
  Lock,
  LockOpen,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

type TeenRegisterFormProps = {
  avatars: Avatar[];
};

const teenRegisterSchema = z
  .object({
    email: z.email("E-mail inválido").min(1, "O e-mail é obrigatório"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
    birthdate: z
      .string()
      .min(10, "Data de nascimento obrigatória")
      .refine((date) => {
        const parsed = parseBirthdate(date);
        return (
          parsed !== null && isPast(parsed) && parsed < subYears(new Date(), 3)
        );
      }, "Data de nascimento inválida ou muito recente"),
    avatarId: z.string().min(1, "Selecione um avatar"),
    name: z.string().min(1, "O nome é obrigatório"),
    username: z
      .string()
      .min(1, "O nome de usuário é obrigatório")
      .max(30, "O nome de usuário deve ter no máximo 30 caracteres")
      .regex(
        /^(?!.*\.\.)(?!.*\.$)[a-z0-9][a-z0-9_.]{0,29}$/,
        'Use apenas letras minúsculas, números, "_" ou ".", sem iniciar ou terminar com ponto e sem pontos duplos',
      ),

    termsAndConditions: z
      .boolean()
      .refine((value) => value, "Você deve aceitar os termos e condições"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type TeenRegisterForm = z.infer<typeof teenRegisterSchema>;

export function TeenRegisterForm({ avatars }: TeenRegisterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const isMobile = useIsMobile();

  const teenAvatars = avatars.filter((a) => a.ageGroup === "TEEN");

  const form = useForm<TeenRegisterForm>({
    resolver: zodResolver(teenRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      birthdate: "",
      avatarId: avatars[0].id ?? undefined,
      name: "",
      username: "",
      termsAndConditions: false,
    },
  });

  const {
    formState: { errors },
    watch,
    trigger,
    clearErrors,
  } = form;

  async function handleNext() {
    if (step === 1) {
      const isValid = await trigger(["email", "password", "confirmPassword"]);
      if (!isValid) return;

      if (watch("password") !== watch("confirmPassword")) {
        toast.error("As senhas não coincidem");
        return;
      }
    }

    if (step === 2) {
      const isBirthdateValid = await trigger("birthdate");
      if (!isBirthdateValid) return;
    }

    if (step === 3) {
      const isValid = await trigger("avatarId");
      if (!isValid) return;
    }

    if (step === 4) {
      const isValid = await trigger(["name", "username"]);
      if (!isValid) return;
    }

    setStep((prev) => prev + 1);
    clearErrors();
  }

  function handlePrev() {
    setStep((prev) => Math.max(0, prev - 1));
  }

  function handleAvatarChange(direction: "left" | "right") {
    setSelectedAvatarIndex((prev) => {
      const newIndex =
        direction === "left"
          ? prev === 0
            ? teenAvatars.length - 1
            : prev - 1
          : prev === teenAvatars.length - 1
            ? 0
            : prev + 1;
      form.setValue("avatarId", teenAvatars[newIndex].id);
      return newIndex;
    });
  }

  function onSubmit({
    name,
    username,
    email,
    password,
    birthdate,
    avatarId,
  }: TeenRegisterForm) {
    startTransition(async () => {
      try {
        const parsedDate = parseBirthdate(birthdate);
        if (!parsedDate) {
          toast.error("Data de nascimento inválida");
          return;
        }

        const result = await signUp({
          name,
          username,
          email,
          password,
          birthdate: parsedDate,
          role: "LEARNER",
          ageGroup: "TEEN",
          avatar: { connect: { id: avatarId } },
        });

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success(`Bem-vindo, ${name}!`);
        router.push("/adolescente");
      } catch (error) {
        console.log(error);
        toast.error("Erro ao cadastrar usuário");
      }
    });
  }

  return (
    <>
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={20}
        lightColor="#2db487"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="fixed top-1/2 left-1/2 mx-auto flex h-screen w-full max-w-md -translate-1/2 items-center justify-center"
        >
          {/* Passo 0 - Boas-vindas */}
          {step === 0 && (
            <div className="flex flex-col items-center space-y-12 text-center">
              <div>
                <span className="text-muted-foreground m-auto text-right text-xl uppercase md:text-3xl">
                  Bem-vindo ao
                </span>
                <h1 className="font-mars text-center text-3xl font-bold md:text-5xl lg:text-7xl">
                  CyberLevel
                </h1>
                <p className="text-muted-foreground md:text-md mx-auto mt-4 max-w-xl px-4 text-sm">
                  A partir de agora, você vai mergulhar nos bastidores do mundo
                  digital. Missões, desafios e descobertas te esperam. Você já
                  entrou. Agora é hora de evoluir.
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                className="text-xl font-semibold uppercase"
                onClick={() => setStep(1)}
              >
                Iniciar jornada
              </Button>
            </div>
          )}

          {/* Passo 1 - E-mail e Senha */}
          {step === 1 && (
            <div className="w-full space-y-4 px-4 text-center">
              <h2 className="text-4xl font-extrabold">Crie sua conta</h2>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <Mail />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput placeholder="E-mail" {...field} />
                      </FormControl>
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <LockOpen />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput
                          type="password"
                          placeholder="Senha"
                          {...field}
                        />
                      </FormControl>
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <Lock />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput
                          type="password"
                          placeholder="Confirme sua senha"
                          {...field}
                        />
                      </FormControl>
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap justify-between gap-2">
                <Button
                  type="button"
                  className="font-semibold uppercase"
                  onClick={handlePrev}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="ml-auto font-semibold uppercase"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Passo 2 - Data de nascimento */}
          {step === 2 && (
            <div className="space-y-4 px-4 text-center">
              <h2 className="text-4xl font-extrabold">
                Qual sua data de nascimento?
              </h2>

              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <Calendar />
                      </InputGroupAddon>
                      <FormControl>
                        <PatternFormat
                          format="##/##/####"
                          mask="_"
                          placeholder="Data de nascimento"
                          customInput={InputGroupInput}
                          {...field}
                        />
                      </FormControl>
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap justify-between gap-2">
                <Button
                  type="button"
                  className="font-semibold uppercase"
                  onClick={handlePrev}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="ml-auto font-semibold uppercase"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Passo 3 - Avatar */}
          {step === 3 && (
            <div className="space-y-4 px-4 text-center">
              <h2 className="text-4xl font-extrabold">Escolha seu avatar</h2>
              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="transition active:scale-90"
                  onClick={() => handleAvatarChange("left")}
                >
                  <ArrowLeft />
                </Button>

                <Card className="w-44 overflow-hidden p-0">
                  <AspectRatio ratio={1}>
                    <Image
                      src={
                        teenAvatars[selectedAvatarIndex]?.imageUrl ||
                        "/images/profile-picture.png"
                      }
                      alt="Avatar selecionado"
                      fill
                      className="size-full object-contain"
                    />
                  </AspectRatio>
                </Card>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="transition active:scale-90"
                  onClick={() => handleAvatarChange("right")}
                >
                  <ArrowRight />
                </Button>
              </div>

              <p className="text-destructive text-sm">
                {errors.avatarId?.message}
              </p>

              <div className="flex flex-wrap justify-between gap-2">
                <Button
                  type="button"
                  className="font-semibold uppercase"
                  onClick={handlePrev}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="ml-auto font-semibold uppercase"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Passo 4 - Nome e Nome de usuário */}
          {step === 4 && (
            <div className="space-y-4 px-4 text-center">
              <h2 className="text-4xl font-extrabold">
                Como quer ser chamado?
              </h2>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput placeholder="Nome" {...field} />
                      </FormControl>
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <AtSign />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput
                          placeholder="Nome de usuário"
                          {...field}
                        />
                      </FormControl>
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 sm:col-span-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="grid gap-1">
                      <FormLabel>Aceito os termos e condições</FormLabel>
                      <Link
                        href="/termos"
                        target={isMobile ? "_self" : "_blank"}
                      >
                        <Button
                          type="button"
                          variant="link"
                          className="text-muted-foreground p-0 text-left text-xs whitespace-break-spaces"
                        >
                          <span>
                            Ao clicar, você concorda com os{" "}
                            <span className="text-white">
                              termos e condições do CyberLevel
                            </span>
                          </span>
                        </Button>
                      </Link>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap justify-between gap-2">
                <Button
                  type="button"
                  className="font-semibold uppercase"
                  onClick={handlePrev}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="ml-auto font-semibold uppercase"
                  disabled={isPending}
                >
                  <div className="flex items-center gap-2">
                    Cadastrar
                    {isPending && <Loader2Icon className="animate-spin" />}
                  </div>
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
