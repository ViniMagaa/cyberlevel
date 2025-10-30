"use client";

import { updatePassword, updateUserData } from "@/app/api/user-settings";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Prisma } from "@prisma/client";
import { format, isPast, isValid, subYears } from "date-fns";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ChildUpdateProfileFormProps = {
  user: Prisma.UserGetPayload<{ include: { avatar: true } }>;
  avatars: Avatar[];
};

const childUpdateProfileSchema = z
  .object({
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

    email: z.email("E-mail inválido").min(1, "O e-mail é obrigatório"),
    birthdate: z
      .string("Data de nascimento inválida")
      .refine(
        (date) =>
          isValid(new Date(date)) &&
          isPast(new Date(date)) &&
          new Date(date) < subYears(new Date(), 3),
        "Data de nascimento inválida ou muito recente",
      ),
    currentPassword: z
      .string()
      .min(6, "A senha atual deve ter no mínimo 6 caracteres")
      .optional(),
    password: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .optional(),
    confirmPassword: z
      .string()
      .min(6, "A confirmação de senha deve ter no mínimo 6 caracteres")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ChildUpdateProfileForm = z.infer<typeof childUpdateProfileSchema>;

export default function ChildUpdateProfileForm({
  user,
  avatars,
}: ChildUpdateProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(
    avatars.findIndex((avatar) => avatar.id === user.avatarId),
  );
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<ChildUpdateProfileForm>({
    resolver: zodResolver(childUpdateProfileSchema),
    defaultValues: {
      avatarId: user.avatarId ?? undefined,
      name: user.name,
      username: user.username,
      email: user.email,
      birthdate: format(user.birthdate, "yyyy-MM-dd"),
      currentPassword: undefined,
      password: undefined,
      confirmPassword: undefined,
    },
  });

  const {
    formState: { errors },
    register,
    clearErrors,
    setValue,
  } = form;

  function handleAvatarChange(direction: "left" | "right") {
    setSelectedAvatarIndex((prev) => {
      const newIndex =
        direction === "left"
          ? prev === 0
            ? avatars.length - 1
            : prev - 1
          : prev === avatars.length - 1
            ? 0
            : prev + 1;
      setValue("avatarId", avatars[newIndex].id);
      return newIndex;
    });
  }

  function handleToggleChangingPassword() {
    setIsChangingPassword((prev) => !prev);

    clearErrors(["currentPassword", "password", "confirmPassword"]);
    setValue("currentPassword", undefined);
    setValue("password", undefined);
    setValue("confirmPassword", undefined);
  }

  function onSubmit(data: ChildUpdateProfileForm) {
    startTransition(async () => {
      const result = await updateUserData(user.id, {
        avatar: { connect: { id: data.avatarId } },
        name: data.name,
        username: data.username,
        email: data.email,
        birthdate: new Date(data.birthdate),
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (data.currentPassword && data.password && data.confirmPassword) {
        if (data.password !== data.confirmPassword) {
          toast.error("As novas senhas não coincidem");
          return;
        }

        const result = await updatePassword(
          data.email,
          data.currentPassword,
          data.password,
        );

        if (!result.success) {
          toast.error(result.message);
          return;
        }
      }

      toast.success("Dados atualizados com sucesso");
      router.push("/crianca/perfil");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-6"
      >
        <div className="w-full space-y-4 text-center">
          <h1 className="font-upheaval text-4xl">Seus dados</h1>

          {/* Avatar */}
          <div className="space-y-2">
            <p className="font-monocraft">Avatar</p>

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
                      avatars[selectedAvatarIndex]?.imageUrl ||
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
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <p className="font-monocraft text-left">Nome</p>

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
          </div>

          {/* Nome de usuário */}
          <div className="space-y-2">
            <p className="font-monocraft text-left">Nome de usuário</p>
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
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <p className="font-monocraft text-left">E-mail</p>
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
          </div>

          {/* Data de nascimento */}
          <div className="space-y-2">
            <p className="font-monocraft text-left">Data de nascimento</p>
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
          </div>

          {isChangingPassword && (
            <>
              <h2 className="font-upheaval text-2xl">Alterar senha</h2>

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
                  placeholder="Senha atual"
                  {...register("currentPassword")}
                />
              </div>

              <p className="text-destructive font-monocraft text-sm">
                {errors.currentPassword?.message}
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
                  placeholder="Nova senha"
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
                  placeholder="Confirme a nova senha"
                  {...register("confirmPassword")}
                />
              </div>

              <p className="text-destructive font-monocraft text-sm">
                {errors.confirmPassword?.message}
              </p>
            </>
          )}
        </div>

        <div className="flex w-full flex-wrap justify-between gap-2">
          <Button
            type="button"
            variant="pixel"
            size="pixel"
            className="flex-1"
            onClick={() => router.back()}
          >
            Voltar
          </Button>

          <Button
            type="button"
            variant="pixel"
            size="pixel"
            className="flex-1 hue-rotate-240"
            onClick={handleToggleChangingPassword}
            disabled={isPending}
          >
            {isChangingPassword ? "Não alterar" : "Alterar senha"}
          </Button>

          <Button
            type="submit"
            variant="pixel"
            size="pixel"
            className="flex-1"
            disabled={isPending}
          >
            <div className="flex items-center gap-2 text-base">
              Atualizar
              {isPending && <Loader2Icon className="animate-spin" />}
            </div>
          </Button>
        </div>
      </form>
    </Form>
  );
}
