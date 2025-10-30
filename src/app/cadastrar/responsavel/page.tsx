"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isPast, subYears } from "date-fns";
import {
  ArrowRight,
  AtSign,
  Calendar,
  Loader2Icon,
  Lock,
  LockOpen,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import signUp from "@/app/api/sign-up";
import { BackButton } from "@/components/back-button";
import Silk from "@/components/silk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { PatternFormat } from "react-number-format";

const registerSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    username: z
      .string()
      .min(1, "O nome de usuário é obrigatório")
      .max(30, "O nome de usuário deve ter no máximo 30 caracteres")
      .regex(
        /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
        'Use letras, números, "_" ou "." sem iniciar ou terminar com ponto e sem pontos duplos',
      ),
    birthdate: z
      .string()
      .min(10, "Data de nascimento obrigatória")
      .refine((date) => {
        const parsed = parseBirthdate(date);
        return (
          parsed !== null && isPast(parsed) && parsed < subYears(new Date(), 3)
        );
      }, "Data de nascimento inválida ou muito recente"),
    email: z.email("E-mail inválido").min(1, "O e-mail é obrigatório"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
    termsAndConditions: z
      .boolean()
      .refine((value) => value, "Você deve aceitar os termos e condições"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isMobile = useIsMobile();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      birthdate: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false,
    },
  });

  function onSubmit({
    name,
    username,
    email,
    password,
    birthdate,
  }: RegisterForm) {
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
          role: "RESPONSIBLE",
        });

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success(`Bem-vindo, ${name}!`);
        router.push("/responsavel");
      } catch (error) {
        console.log(error);
        toast.error("Erro ao cadastrar usuário");
      }
    });
  }

  return (
    <div className="relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Silk
          speed={5}
          scale={1}
          color="#2db487"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 min-h-screen w-1/3 bg-gradient-to-r from-black" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 min-h-screen w-1/3 bg-gradient-to-l from-black" />

      <BackButton size="icon" className="fixed top-4 left-4" />

      <div className="grid min-h-screen w-full place-items-center p-4">
        <Card className="m-4 mx-auto w-full max-w-2xl">
          <CardHeader className="mb-4">
            <CardTitle className="text-4xl font-extrabold sm:text-5xl">
              Cadastre-se como responsável
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex grow flex-col justify-between gap-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        <div className="grid">
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
                </div>

                <div className="flex flex-wrap justify-between gap-4">
                  <Button type="button" variant="link" className="px-0" asChild>
                    <Link href="/entrar">Já possui uma conta?</Link>
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    className="ml-auto"
                    disabled={isPending}
                  >
                    Cadastrar
                    {!isPending && <ArrowRight />}
                    {isPending && <Loader2Icon className="animate-spin" />}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
