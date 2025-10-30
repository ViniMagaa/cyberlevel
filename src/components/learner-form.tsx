"use client";

import { createResponsibleLink } from "@/app/(responsible)/responsavel/aprendizes/actions";
import { formatDate } from "@/utils/format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, User } from "@prisma/client";
import { ArrowLeft, Loader2Icon, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

export const learnerForm = z.object({
  field: z.string().min(1, "Informe o campo"),
});

export type LearnerFormSchema = z.infer<typeof learnerForm>;

type Learner = User & { avatar: Avatar | null };

type LearnerFormProps = {
  responsibleId: string;
  learners: Learner[];
};

export function LearnerForm({ responsibleId, learners }: LearnerFormProps) {
  const [isPendingSearch, startSearchTransition] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState<"email" | "username">("email");
  const [learner, setLearner] = useState<Learner | null | undefined>(undefined);

  const router = useRouter();

  const form = useForm<LearnerFormSchema>({
    resolver: zodResolver(learnerForm),
    defaultValues: {
      field: "",
    },
  });

  const { watch } = form;

  function handleSearch() {
    startSearchTransition(() => {
      const learner = learners.find(({ email, username }) =>
        search === "email"
          ? email.toLocaleLowerCase() === watch("field").toLocaleLowerCase()
          : username.toLocaleLowerCase() === watch("field").toLocaleLowerCase(),
      );

      if (!learner) {
        setLearner(null);
        return;
      }

      setLearner(learner);
    });
  }

  function onSubmit() {
    if (!learner) {
      toast.error("Selecione o aprendiz");
      return;
    }

    startTransition(async () => {
      try {
        await createResponsibleLink({ responsibleId, learnerId: learner.id });
        toast.success(
          "Pedido feito! O aprendiz deve aceitar a solicitação na plataforma",
        );
        router.push("/responsavel/aprendizes");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao adicionar aprendiz");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex grow flex-col justify-between gap-4"
      >
        <div className="flex flex-row gap-2">
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    disabled={isPending || isPendingSearch}
                    placeholder={
                      (search === "email" ? "E-mail" : "Nome de usuário") +
                      " do aprendiz"
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            disabled={isPending || isPendingSearch}
            onClick={handleSearch}
            className="rounded-md!"
          >
            {isPendingSearch ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Search />
            )}
          </Button>
        </div>

        <RadioGroup
          value={search}
          disabled={isPending || isPendingSearch}
          className="flex flex-row gap-4"
          onValueChange={(val: "email" | "username") => {
            setLearner(undefined);
            setSearch(val);
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="option-email" />
            <Label htmlFor="option-email">E-mail</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="username" id="option-username" />
            <Label htmlFor="option-username">Nome de usuário</Label>
          </div>
        </RadioGroup>

        {learner && (
          <Card className="flex-row flex-wrap gap-2 p-2">
            <CardHeader className="h-25 w-25 overflow-hidden rounded-md bg-neutral-950 p-0">
              <AspectRatio ratio={1}>
                <Image
                  src={
                    learner.avatar?.imageUrl ?? "/images/profile-picture.png"
                  }
                  alt={learner.name}
                  fill
                  className="no-blur size-full object-contain"
                />
              </AspectRatio>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-0">
              <div>
                <CardTitle className="line-clamp-1 text-xl font-bold break-all overflow-ellipsis">
                  {learner.name}
                </CardTitle>
                <p className="line-clamp-1 text-sm break-all overflow-ellipsis text-white/50">
                  {learner.email}
                </p>
                <p className="line-clamp-1 text-sm break-all overflow-ellipsis text-white/50">
                  @{learner.username}
                </p>
                <p className="text-sm text-white/50">
                  Entrou em {formatDate(learner.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {learner === null && (
          <p className="text-destructive">Aprendiz não encontrado</p>
        )}

        <div className="flex flex-wrap justify-between gap-4">
          <Button type="button" variant="link" className="px-0" asChild>
            <Link href="/responsavel/aprendizes">
              <ArrowLeft />
              Voltar
            </Link>
          </Button>
          <Button
            type="submit"
            variant="default"
            className="ml-auto disabled:opacity-50"
            disabled={!learner || isPending || isPendingSearch}
          >
            Adicionar
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
