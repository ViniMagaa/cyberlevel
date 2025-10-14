"use client";

import signUp from "@/app/api/sign-up";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@prisma/client";
import { isPast, isValid, subYears } from "date-fns";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ChildRegisterFormProps = {
  avatars: Avatar[];
};

const childRegisterSchema = z
  .object({
    email: z.email("E-mail inválido").min(1, "O e-mail é obrigatório"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
    birthdate: z
      .string("Data de nascimento inválida")
      .refine(
        (date) =>
          isValid(new Date(date)) &&
          isPast(new Date(date)) &&
          new Date(date) < subYears(new Date(), 3),
        "Data de nascimento inválida ou muito recente",
      ),
    avatarId: z.string().min(1, "Selecione um avatar"),
    name: z.string().min(1, "O nome é obrigatório"),
    username: z
      .string()
      .min(1, "O nome de usuário é obrigatório")
      .max(30, "O nome de usuário deve ter no máximo 30 caracteres")
      .regex(
        /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
        'Use letras, números, "_" ou "." sem iniciar ou terminar com ponto e sem pontos duplos',
      ),
    termsAndConditions: z
      .boolean()
      .refine((value) => value, "Você deve aceitar os termos e condições"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ChildRegisterForm = z.infer<typeof childRegisterSchema>;

export default function ChildRegisterForm({ avatars }: ChildRegisterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);

  const childAvatars = avatars.filter((a) => a.ageGroup === "CHILD");

  const form = useForm<ChildRegisterForm>({
    resolver: zodResolver(childRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      avatarId: avatars[0].id ?? undefined,
      name: "",
      username: "",
      termsAndConditions: false,
    },
  });

  const {
    formState: { errors },
    watch,
    register,
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
            ? childAvatars.length - 1
            : prev - 1
          : prev === childAvatars.length - 1
            ? 0
            : prev + 1;
      form.setValue("avatarId", childAvatars[newIndex].id);
      return newIndex;
    });
  }

  function onSubmit(data: ChildRegisterForm) {
    startTransition(async () => {
      try {
        const result = await signUp({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          birthdate: new Date(data.birthdate),
          role: "LEARNER",
          ageGroup: "CHILD",
          avatar: { connect: { id: data.avatarId } },
        });

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success(`Bem-vindo, ${data.name}!`);
        router.push("/crianca");
      } catch (error) {
        console.log(error);
        toast.error("Erro ao cadastrar usuário");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex h-screen w-full max-w-lg items-center justify-center"
      >
        {/* Passo 0 - Boas-vindas */}
        {step === 0 && (
          <div className="flex flex-col items-center space-y-12 text-center">
            <div>
              <span className="font-monocraft text-md sm:text-4xl">
                Bem-vindo ao
              </span>
              <h1 className="font-upheaval text-4xl leading-6 sm:text-8xl sm:leading-12">
                CyberLevel
              </h1>
            </div>
            <Button
              type="button"
              variant="pixel"
              size="pixel"
              onClick={() => setStep(1)}
            >
              Iniciar jornada
            </Button>
          </div>
        )}

        {/* Passo 1 - E-mail e Senha */}
        {step === 1 && (
          <div className="w-full space-y-4 px-4 text-center">
            <h2 className="font-upheaval text-4xl">Crie sua conta</h2>

            <div className="relative mx-auto h-[64px] w-full">
              <Image
                src="/images/pixel-themed-password-input.png"
                alt="Input"
                fill
                className="pointer-events-none select-none"
              />
              <input
                className="font-monocraft absolute inset-0 h-full w-full bg-transparent px-6 text-xl text-black outline-none"
                placeholder="E-mail"
                {...register("email")}
              />
            </div>

            <p className="text-destructive font-monocraft text-sm">
              {errors.email?.message}
            </p>

            <div className="relative mx-auto h-[64px] w-full">
              <Image
                src="/images/pixel-themed-password-input.png"
                alt="Input"
                fill
                className="pointer-events-none select-none"
              />
              <input
                type="password"
                className="font-monocraft absolute inset-0 h-full w-full bg-transparent px-6 text-xl text-black outline-none"
                placeholder="Senha"
                {...register("password")}
              />
            </div>

            <p className="text-destructive font-monocraft text-sm">
              {errors.password?.message}
            </p>

            <div className="relative mx-auto h-[64px] w-full">
              <Image
                src="/images/pixel-themed-password-input.png"
                alt="Input"
                fill
                className="pointer-events-none select-none"
              />
              <input
                type="password"
                className="font-monocraft absolute inset-0 h-full w-full bg-transparent px-6 text-xl text-black outline-none"
                placeholder="Confirme a senha"
                {...register("confirmPassword")}
              />
            </div>

            <p className="text-destructive font-monocraft text-sm">
              {errors.confirmPassword?.message}
            </p>

            <div className="flex flex-wrap justify-between gap-2">
              <Button
                type="button"
                variant="pixel"
                size="pixel"
                onClick={handlePrev}
              >
                Voltar
              </Button>
              <Button
                type="button"
                variant="pixel"
                size="pixel"
                className="ml-auto"
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
            <h2 className="font-upheaval text-4xl">
              Qual sua data de nascimento?
            </h2>

            <div className="relative mx-auto h-[64px] w-full">
              <Image
                src="/images/pixel-themed-password-input.png"
                alt="Input data"
                fill
                className="pointer-events-none select-none"
              />
              <input
                type="date"
                className="font-monocraft absolute inset-0 h-full w-full bg-transparent px-6 text-xl text-black outline-none"
                {...register("birthdate")}
              />
            </div>

            <p className="text-destructive font-monocraft text-sm">
              {errors.birthdate?.message}
            </p>

            <div className="flex flex-wrap justify-between gap-2">
              <Button
                type="button"
                variant="pixel"
                size="pixel"
                onClick={handlePrev}
              >
                Voltar
              </Button>
              <Button
                type="button"
                variant="pixel"
                size="pixel"
                className="ml-auto"
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
            <h2 className="font-upheaval text-4xl">Escolha seu avatar</h2>
            <div className="flex items-center justify-center gap-4">
              <Image
                src="/images/pixel-arrow.png"
                alt="Esquerda"
                width={64}
                height={64}
                className="scale-x-[-1] cursor-pointer transition active:-scale-x-90 active:scale-y-90 max-sm:w-8"
                onClick={() => handleAvatarChange("left")}
              />

              <Card className="bg-primary-600/20 border-primary-600 w-44 overflow-hidden p-0">
                <AspectRatio ratio={1}>
                  <Image
                    src={
                      childAvatars[selectedAvatarIndex]?.imageUrl ||
                      "/images/profile-picture.png"
                    }
                    alt="Avatar selecionado"
                    fill
                    className="size-full object-contain"
                  />
                </AspectRatio>
              </Card>

              <Image
                src="/images/pixel-arrow.png"
                alt="Direita"
                width={64}
                height={64}
                className="cursor-pointer transition active:scale-90 max-sm:w-8"
                onClick={() => handleAvatarChange("right")}
              />
            </div>

            <p className="text-destructive font-monocraft text-sm">
              {errors.avatarId?.message}
            </p>

            <div className="flex flex-wrap justify-between gap-2">
              <Button
                type="button"
                variant="pixel"
                size="pixel"
                onClick={handlePrev}
              >
                Voltar
              </Button>
              <Button
                type="button"
                variant="pixel"
                size="pixel"
                className="ml-auto"
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
            <h2 className="font-upheaval text-4xl">Como quer ser chamado?</h2>

            <div className="relative mx-auto h-[64px] w-full">
              <Image
                src="/images/pixel-themed-password-input.png"
                alt="Input"
                fill
                className="pointer-events-none select-none"
              />
              <input
                placeholder="Seu nome"
                className="font-monocraft absolute inset-0 h-full w-full bg-transparent px-6 text-xl text-black outline-none"
                {...register("name")}
              />
            </div>

            <p className="text-destructive font-monocraft text-sm">
              {errors.name?.message}
            </p>

            <div className="relative mx-auto h-[64px] w-full">
              <Image
                src="/images/pixel-themed-password-input.png"
                alt="Input"
                fill
                className="pointer-events-none select-none"
              />
              <input
                placeholder="Nome de usuário"
                className="font-monocraft absolute inset-0 h-full w-full bg-transparent px-6 text-xl text-black outline-none"
                {...register("username")}
              />
            </div>

            <p className="text-destructive font-monocraft text-sm">
              {errors.username?.message}
            </p>

            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem className="font-monocraft flex items-start gap-3 sm:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="grid gap-1">
                    <FormLabel>Aceito os termos e condições</FormLabel>
                    <Link href="/termos" target="_blank">
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
                variant="pixel"
                size="pixel"
                onClick={handlePrev}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                variant="pixel"
                size="pixel"
                className="ml-auto"
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
  );
}
