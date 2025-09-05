"use client";

import { Paragraphs } from "@/components/paragraphs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@prisma/client";
import { BadgeCheckIcon, BadgeX, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProduct } from "../actions";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format-currency";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { formatDate } from "@/utils/format-date";

type ProductCardProps = {
  product: Omit<Product, "price"> & { price: number };
};

export function ProductCard({ product }: ProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteProduct(product.id);
        toast.success("Produto excluído com sucesso");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir produto");
      }
    });
  }

  return (
    <Card className="flex flex-col justify-end gap-2 bg-neutral-800 p-4">
      <CardHeader className="p-0">
        {product.imageUrl && (
          <AspectRatio ratio={1 / 1}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
        )}
        <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        <CardDescription>
          <Paragraphs text={product.description} />
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-lg font-black">{formatCurrency(product.price)}</p>
        {product.active ? (
          <Badge
            variant="secondary"
            className="bg-green-500 text-white dark:bg-green-600"
          >
            <BadgeCheckIcon />
            Disponível
          </Badge>
        ) : (
          <Badge variant="destructive">
            <BadgeX /> Indisponível
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2 p-0 align-bottom">
        <div className="text-muted-foreground text-[0.7rem]">
          <p>Criado em {formatDate(product.createdAt)}</p>
          <p>Atualizado em {formatDate(product.updatedAt)}</p>
        </div>
        <div className="flex flex-auto items-center justify-end gap-1">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/produtos/editar/${product.id}`}>
              <Pencil />
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso vai remover
                  permanentemente o produto <strong>{product.name}</strong> do
                  sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
