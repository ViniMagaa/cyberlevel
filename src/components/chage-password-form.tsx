import { updatePassword } from "@/app/api/user-settings";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Key, KeyIcon, Loader2Icon, Lock, LockOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres"),

    newPassword: z
      .string()
      .min(6, "A nova senha deve ter no mínimo 6 caracteres"),
    confirmNewPassword: z
      .string()
      .min(6, "A confirmação da nova senha deve ter no mínimo 6 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: "As novas senhas não coincidem",
    path: ["confirmNewPassword"],
  });

type TChangePasswordForm = z.infer<typeof changePasswordFormSchema>;

type ChangePasswordFormProps = {
  user: User;
};

export default function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<TChangePasswordForm>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onSubmit(data: TChangePasswordForm) {
    startTransition(async () => {
      try {
        const result = await updatePassword(
          user.email,
          data.currentPassword,
          data.newPassword,
        );

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Senha atualizada");
        form.reset();
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar senha");
      }
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Key />
          Alterar senha
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar a senha</DialogTitle>
          <CardDescription>
            Preencha os campos abaixo para atualizar sua senha
          </CardDescription>
        </DialogHeader>
        <div className="flex sm:grow">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex grow flex-col justify-between gap-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <KeyIcon />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput
                          type="password"
                          placeholder="Senha atual"
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <LockOpen />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput
                          type="password"
                          placeholder="Nova senha"
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
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <InputGroup>
                      <InputGroupAddon>
                        <Lock />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput
                          type="password"
                          placeholder="Confirme sua nova senha"
                          {...field}
                        />
                      </FormControl>
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="default"
                className="ml-auto disabled:opacity-50"
                disabled={isPending}
              >
                Atualizar
                {isPending && <Loader2Icon className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
