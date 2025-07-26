"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isPast, isValid, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, CalendarIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import signUp from "@/api/sign-up";
import { UserRole } from "@prisma/client";
import { ChooseYourJourney } from "@/components/choose-your-journey";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      .date("Data de nascimento inválida")
      .refine(
        (date) =>
          isValid(date) && isPast(date) && date < subYears(new Date(), 3),
        "Data de nascimento inválida ou muito recente",
      ),
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

type RegisterPageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const userRole = use(searchParams).role?.toLocaleUpperCase();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false,
    },
  });

  if (
    userRole === undefined ||
    (userRole !== UserRole.RESPONSIBLE && userRole !== UserRole.LEARNER)
  ) {
    return <ChooseYourJourney />;
  }

  const onSubmit = ({
    name,
    username,
    email,
    password,
    birthdate,
  }: RegisterForm) => {
    const role = userRole as UserRole;

    startTransition(async () => {
      try {
        await signUp({ name, username, email, password, birthdate, role });
        router.push("/dashboard");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao fazer cadastro");
      }
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <VelocityScroll
        defaultVelocity={0.2}
        numRows={8}
        className="fixed top-0 left-0 -z-10 h-full w-full"
      >
        <span className="font-black-future text-[10rem]/32 font-thin opacity-50 select-none">
          CyberLevel
        </span>
      </VelocityScroll>
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 h-lvh w-1/3 bg-gradient-to-r from-black" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 h-lvh w-1/3 bg-gradient-to-l from-black" />

      {userRole === UserRole.RESPONSIBLE ? (
        <Image
          alt="CyberLevel"
          src="/images/3d-green-element.png"
          width={500}
          height={500}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 select-none sm:top-1/2 sm:bottom-auto sm:left-1/4 sm:-translate-y-1/2"
        />
      ) : (
        <Image
          alt="CyberLevel"
          src="/images/cyber-vision-avatar.png"
          width={400}
          height={400}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none sm:left-1/6"
        />
      )}

      <ScrollArea className="absolute inset-y-0 ml-auto h-screen w-full sm:w-3/4 lg:w-1/2">
        <Card className="m-4 sm:min-h-[calc(100lvh-2rem)]">
          <CardHeader className="mb-4">
            <CardTitle className="text-4xl font-extrabold sm:text-5xl">
              {userRole === UserRole.RESPONSIBLE
                ? "Cadastre-se como responsável"
                : "Comece sua jornada"}
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="flex sm:grow">
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
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Nome de usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="E-mail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Data de nascimento</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Senha"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirme sua senha"
                            {...field}
                          />
                        </FormControl>
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
                          <p className="text-muted-foreground text-sm">
                            Ao clicar, você concorda com os{" "}
                            <Button
                              type="button"
                              variant="link"
                              className="p-0"
                            >
                              termos e condições do CyberLevel
                            </Button>
                          </p>
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
                    className="rounded-full disabled:opacity-50"
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
      </ScrollArea>
    </div>
  );
}
