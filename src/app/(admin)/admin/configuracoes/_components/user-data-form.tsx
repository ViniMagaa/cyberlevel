import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { format, isPast, isValid, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2Icon, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { updateUserData } from "../actions";

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
    .date("Data de nascimento inválida")
    .refine(
      (date) => isValid(date) && isPast(date) && date < subYears(new Date(), 3),
      "Data de nascimento inválida ou muito recente",
    ),
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
      birthdate: user.birthdate,
    },
  });

  function onSubmit(data: TUserDataForm) {
    startTransition(async () => {
      try {
        await updateUserData(user.id, data);
        toast.success("Dados atualizados");
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar dados");
      }
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
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
