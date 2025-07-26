"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import signIn from "@/api/sign-in";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleAuthError } from "@/lib/handle-auth-error";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("O e-mail é inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = ({ email, password }: LoginForm) => {
    startTransition(async () => {
      const result = await signIn({ email, password });

      if (!result.success) {
        toast.error(handleAuthError(result.error.code));
        return;
      }

      router.push("/dashboard");
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

      <div className="absolute top-1/2 left-1/2 w-full max-w-sm -translate-1/2 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">
              Entre na plataforma
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para entrar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex grow flex-col justify-between gap-4"
              >
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap justify-between gap-4">
                  <Button type="button" variant="link" className="px-0" asChild>
                    <Link href="/cadastrar">Não possui uma conta?</Link>
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    className="ml-auto rounded-full disabled:opacity-50"
                    disabled={isPending}
                  >
                    Entrar
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
