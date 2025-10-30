import { updateUserData } from "@/app/api/user-settings";
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
import { formatDate, parseBirthdate } from "@/utils/format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { isPast, subYears } from "date-fns";
import {
  AtSign,
  Calendar,
  Loader2Icon,
  Mail,
  Pencil,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

const userDataFormSchema = z.object({
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
});

type TUserDataForm = z.infer<typeof userDataFormSchema>;

type UserDataFormProps = {
  user: User;
};

export default function UserDataForm({ user }: UserDataFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<TUserDataForm>({
    resolver: zodResolver(userDataFormSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      birthdate: formatDate(new Date(user.birthdate)),
    },
    resetOptions: { keepDefaultValues: true },
  });

  function onSubmit({ name, username, email, birthdate }: TUserDataForm) {
    startTransition(async () => {
      try {
        const parsedDate = parseBirthdate(birthdate);
        if (!parsedDate) {
          toast.error("Data de nascimento inválida");
          return;
        }
        const { success, error } = await updateUserData(user.id, {
          name,
          username,
          email,
          birthdate: parsedDate,
        });

        if (success) {
          toast.success("Dados atualizados");
          router.refresh();
          setIsOpen(false);
          return;
        }

        if (error) {
          toast.error(error);
        }
      } catch (error) {
        console.log(error);
        toast.error("Erro ao atualizar dados");
      }
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Pencil />
          Editar dados
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar informações</DialogTitle>
          <CardDescription>
            Preencha os campos abaixo para editar seus dados
          </CardDescription>
        </DialogHeader>
        <div className="flex sm:grow">
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
                          <UserIcon />
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
              </div>

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
